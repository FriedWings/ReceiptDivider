import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { AddPaymentPage } from '../add-payment/add-payment';

@IonicPage()
@Component({
  selector: 'page-select-person',
  templateUrl: 'select-person.html',
})

export class SelectPersonPage {
	appType: string; // = 'Contacts';
	contactList: any;
	friendList: any;
	showSpinner: boolean = true;

  constructor(public navParams: NavParams, public viewCtrl: ViewController, private contacts: Contacts,  public modalCtrl: ModalController) {
  	this.appType = 'Contacts';

    this.contacts.find(['displayName', 'name', 'phoneNumbers', 'emails'], {filter: "", multiple: true})
    .then(data => {
      console.log(data)
      this.contactList = data;
      this.showSpinner = false;
    }).catch((err) => {
    	this.showSpinner = false;
    	console.log(err);
    	// if 'deny' pressed
    })
  }

  ionViewDidLoad() {
  }

  dismiss() {
  	// this.viewCtrl.dismiss({'success': successfullPayment});
  	this.viewCtrl.dismiss();
  	// console.log(this.appType)
  }

  selectContact(contact: Contact){
  	console.log(contact);

    let profileModal = this.modalCtrl.create(AddPaymentPage, { type: "directPayment" });
    profileModal.present();
  	this.viewCtrl.dismiss();
  	this.dismiss()
  }

  getAppType(appTypeInput: string){
  	if(appTypeInput == 'Contacts') return this.contactList;
  	return this.friendList;
  }

  addNewPerson(){
  	console.log("Add new person for " + this.appType);
  }
}
