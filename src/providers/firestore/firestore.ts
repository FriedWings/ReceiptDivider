import { Injectable } from '@angular/core';
import { expenditure } from '../../classes/Expenditure';
import { receipt } from '../../classes/Receipt';
import { payment } from '../../classes/Payment';
import { directPayment } from '../../classes/DirectPayment';

import firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class FirestoreProvider {
	database: any;
	usersRef: any;
	paymentRef: any;
	
	constructor() {
		this.database = firebase.firestore();
		this.usersRef = this.database.collection('users');
		this.paymentRef = this.database.collection('payments');
	}

	getDatabase() {
		return this.database;
	}

	addExpenditure(expenditureData: expenditure) {
		return new Promise((resolve, reject) => {
			let uid = firebase.auth().currentUser.uid;
			let payorRef = this.database.collection("users").doc(expenditureData.getStoredData()['payor']).collection("paymentRefs").doc();
			if (!uid) reject("UID not found");

			var batch = this.database.batch();
			var paymentsRef = this.database.collection("payments").doc();

			batch.set(paymentsRef, expenditureData.getStoredData());
			batch.set(payorRef, {
				refToPayment: paymentsRef.path
			})
			batch.commit().then(() => resolve()).catch((err) => reject(err));
			// also remove paymentsRef 
		})
	}

	// Returns ReceiptID
	addReceipt() {
	}

	// You must be receipt owner to delete
	deleteReceipt(receiptID: string) {
	}

	addDirectPayment(directPaymentData: directPayment) {
		let batch = this.database.batch();
		let paymentsRef = this.database.collection("payments").doc();
		let payorRef = this.database.collection("users").doc(directPaymentData.getStoredData()['payor']).collection("paymentRefs").doc();
		let payeeRef = this.database.collection("users").doc(directPaymentData.getStoredData()['payee']).collection("paymentRefs").doc();

		return new Promise((resolve, reject) => {
			this.usersRef.doc(directPaymentData.getStoredData['payee']).get().then((doc) => {
				let payeeName = doc.data().name;
				if (!payeeName) {
					console.log("error no name found");
				}

				batch.set(paymentsRef, directPaymentData);

				batch.set(payorRef, {
					refToPayment: paymentsRef.path
				})

				batch.set(payeeRef, {
					refToPayment: paymentsRef.path
				})

				batch.commit().then(() => resolve())
					.catch((err) => reject(err));
				// also remove paymentsRef 

			}).catch((err) => reject(err));
		})
	}

	//todo
	deletePayment(paymentId: string) {
		return new Promise((resolve, reject) => {
			resolve();
			var paymentsRef = this.paymentRef.doc(paymentId);

			paymentsRef.get().then((doc) => {
				if (!doc.exists) {
					reject("Error: No payment found");
					// If no payment found, attempt removing reference from users acc
				}
				console.log(doc.data());
				resolve();

				var batch = this.database.batch();
				var paymentPath = paymentsRef.path;


				batch.delete(paymentsRef);


				// batch.commit().then(()=> resolve())
				// .catch((err)=> reject(err));

			}).catch((err) => reject(err));

		})
	}

	updatePayment(paymentId: string, updatedValues: object) {
		return new Promise((resolve, reject) => {
			var paymentsRef = this.paymentRef.doc(paymentId);
			paymentsRef.update(updatedValues).then(() => resolve())
				.catch((err) => reject(err));
		})
	}

	// get all related payments
	getAllPayments() {
		return new Promise<any>((resolve, reject) => {
			var uid = firebase.auth().currentUser.uid;
			var userPaymentsRef = this.usersRef.doc(uid).collection("paymentRefs");
			var directReferences = new Array;
			var returnData = [];
			if (!uid) reject("User not authenticated");


			// Uses inbuilt sort but cannot do logical "or" for .where function (need to check payor/payee)

			// this.paymentRef.where("payor", "==", uid).orderBy("date").get()
			// .then((querySnapshot) => {
			// 	querySnapshot.forEach((doc) => {
			// 		console.log(doc.data());
			// 		var testDate = new Date(doc.data().date);
			// 		console.log(testDate)
			// 	})
			// 	resolve("asds");
			// }).catch((error)=>{
			// 	console.log(error);
			// 	reject();
			// })

			userPaymentsRef.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						// doc.data() is never undefined for query doc snapshots
						// console.log(doc.id, " => ", doc.data());
						directReferences.push(doc.data().refToPayment);
					});

					directReferences.forEach((item, i) => {
						this.database.doc(item).get()
							.then((querySnapshot) => {
								var source = querySnapshot.metadata.fromCache ? "local cache" : "server";
								console.log("Data came from " + source);

								returnData.push(querySnapshot.data());
							}).catch(function (error) {
								console.log(error);
								reject(error);
							})
					})
					returnData.sort(function (a, b) { return b.date - a.date });
					resolve(returnData);
				})
				.catch(function (error) {
					console.log("Error getting documents: ", error);
					reject("Error obtaining documents");
				});
		})
	}

	// returns a promise
	addNewUser(nameInput: string) {
		return new Promise((resolve, reject) => {
			let uid = firebase.auth().currentUser.uid;
			if (!uid) reject("User not authenticated");
			this.database.collection("users").doc(uid).set({
				name: nameInput
			})
			.then((docRef) => resolve())
			.catch((error) => reject("Problem adding user"));
		});
	}

	// return a promise
	removeUser() {
		let currentUser = firebase.auth().currentUser;
		let uid = currentUser.uid;

		return new Promise((resolve, reject) => {
			if (!currentUser) reject("");

			// Delete user firestore data
			this.usersRef.doc(uid).delete().then(() => {
				// Delete user from firebase auth
				currentUser.delete().then(() => {
					resolve();
				}).catch((err) => reject(err));
			}).catch((err) => reject(err));
		});
	}

	changeName(newName: string) {
		let uid = firebase.auth().currentUser;

		return new Promise((resolve, reject) => {
			if (!uid) reject("");

			this.usersRef.doc(uid).update({
				name: newName
			}).then(() => {
				resolve();
			}).catch((err) => reject(err));
		});
	}
}
