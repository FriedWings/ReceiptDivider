import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { receipt } from '../../classes/Receipt';
import { directPayment } from '../../classes/DirectPayment';
import { expenditure } from '../../classes/Expenditure';

import { FirestoreProvider } from '../../providers/firestore/firestore';
import firebase from 'firebase';
import { ToastProvider } from '../../providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-add-payment',
  templateUrl: 'add-payment.html',
})

export class AddPaymentPage {
	description: string;
	date: any;
	dateFound: any;
	paid: boolean = false;
	amount: number;
	paramData: any;
	buttonEnabled: boolean = true;

  constructor(public viewCtrl: ViewController, public _firestore: FirestoreProvider, public params: NavParams, public _loadingCtrl: LoadingController, public _toastCtrl: ToastProvider) {
  	this.dateFound = new Date();
  	this.date = this.dateFound.toISOString();
    this.paramData = params.data;
  }

  dismiss(isSuccess: boolean) {
  	this.viewCtrl.dismiss({'success': isSuccess});
  }

  createPayment() {
  	// add $ sign infront
		let dateFound = new Date(this.date).getTime();
		let currentUser = firebase.auth().currentUser;
		let uid = currentUser.uid;
		let name = currentUser.displayName;

		this.buttonEnabled = false;
		let loading = this._loadingCtrl.create({
			content: 'Please wait...',
			spinner: 'crescent'
		});
		loading.present();

		if(this.paramData.paymentType == "Expenditure"){
			var createPaymentPromise = this._firestore.addExpenditure(new expenditure(uid, name, this.description, this.amount, this.date));
		}

		createPaymentPromise.then(() => {
			this.dismiss(true);
			loading.dismiss();
		}).catch((err) => {
			this._toastCtrl.toastMessage('Please ensure inputs are valid', 2000);
			this.buttonEnabled = true;
			console.log(err);
			loading.dismiss();
		})
		
	}
}
