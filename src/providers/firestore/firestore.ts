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

	// Todo
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

	/*
    * Update a payment
    * @return {promise} a promise the resolves when successful and rejects when fails 
    */ 
	updatePayment(paymentId: string, updatedValues: object) {
		return new Promise((resolve, reject) => {
			var paymentsRef = this.paymentRef.doc(paymentId);
			paymentsRef.update(updatedValues).then(() => resolve())
				.catch((err) => reject(err));
		})
	}

    /*
    * Get all payments associated with the user
    * @return {promise} 
	* 	-If successful will contain an array of payments relating to the user
	*	-If fails will contain the error message 
    */ 
	getAllPayments() {
		return new Promise<any>((resolve, reject) => {
			var uid = firebase.auth().currentUser.uid;
			var returnData = [];
			if (!uid) reject("User not authenticated");
			
			this.getPaymentRefs().then((data) => {
				for(let i = 0; i < data.length; i++) {
					this.database.doc(data[i]).get()
					.then((querySnapshot) => {
						returnData.push(querySnapshot.data());

						if (i == data.length - 1) {
							returnData.sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime() });
							resolve(returnData);
						}
					})
				}
			}).catch((err) => {
				reject(err);
			});
		})
	}

    /*
    * Get references to the payment objects associated with the user from the database
    * @return {promise} 
	* 	-If successful will contain an array of references to payments in the database
	*	-If fails will contain the error message 
    */ 
	getPaymentRefs() {
		return new Promise<any>((resolve, reject) => {
			var uid = firebase.auth().currentUser.uid;
			var returnData = [];
			if (!uid) reject("User not authenticated");

			this.usersRef.doc(uid).collection("paymentRefs").get()
				.then((querySnapshot) => {					
					querySnapshot.forEach((doc) => {
						returnData.push(doc.data().refToPayment);
					});
					resolve(returnData);
				})
				.catch(function (error) {
					reject("Error obtaining documents");
				});
		})
	}

    /*
    * Add a user onto the database
    * @return {promise} a promise the resolves when successful and rejects when fails 
    */ 
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

    /*
    * Remove all relating user data from the database
    * @return {promise} a promise the resolves when successful and rejects when fails 
    */ 
	removeUser() {
		let currentUser = firebase.auth().currentUser;
		let uid = currentUser.uid;

		return new Promise((resolve, reject) => {
			if (!currentUser) reject("User not found");

			// Delete user firestore data
			this.usersRef.doc(uid).delete().then(() => {
				// Delete user from firebase auth
				currentUser.delete().then(() => {
					resolve();
				}).catch((err) => reject(err));
			}).catch((err) => reject(err));
		});
	}

	/*
    * Change the stored name of the user
    * @return {promise} a promise the resolves when successful and rejects when fails 
    */ 
	changeName(newName: string) {
		let uid = firebase.auth().currentUser;

		return new Promise((resolve, reject) => {
			if (!uid) reject("User not found");

			this.usersRef.doc(uid).update({
				name: newName
			}).then(() => {
				resolve();
			}).catch((err) => reject(err));
		});
	}
}
