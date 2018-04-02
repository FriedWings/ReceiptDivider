import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController, ModalController, ActionSheetController} from 'ionic-angular';

// Pages
import { StartUpPage } from '../start-up/start-up';
import { AuthenticationPage } from '../authentication/authentication';
import { IconPopupPage } from '../icon-popup/icon-popup';

import { ToastProvider } from '../../providers/toast/toast';
import { AuthProvider } from '../../providers/auth/auth';

import firebase from 'firebase';
import 'firebase/firestore';

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})

export class MainPage {
  pages: any;
  displayName: string;
  userProfile: any;
  rootPage: AuthenticationPage;
  
  database: any;
  usersRef: any;
  receiptsRef: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController, public _authProvider: AuthProvider, private _toastCtrl: ToastProvider, public popoverCtrl: PopoverController) {
    this.userProfile = _authProvider.getUserProfile();
    this.displayName = this.userProfile.displayName;
    this.database = firebase.firestore();

    this.usersRef = this.database.collection('users');
    this.receiptsRef = this.database.collection('receipts');
  }

  ionViewDidLoad() {
  }

  logout(){
    this._authProvider.signOut().then(() => {
      this._toastCtrl.toastMessage('Successfully logged out', 5000);
      this.navCtrl.setRoot(StartUpPage);

    }).catch((err) => {

    });
  }

  iconClick(myEvent) {
    let popover = this.popoverCtrl.create(IconPopupPage);
    popover.present({
      ev: myEvent
    });
  }

  presentAddReceiptSheet() {
    let addReceiptModal = this.actionSheetCtrl.create({
      title: 'Add Receipt',
      buttons: [
        {
          text: 'Take Photo',
        },
        {
          text: 'Open Gallery',
        },
        {
          text: 'Input Manually',
        },
        {
          text: 'Cancel',
          role: 'Cancel'
        }
      ]
    }).present();
  }
}
