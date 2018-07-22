import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import firebase from 'firebase';

import { AuthenticationPage } from '../authentication/authentication';
import { MainPage } from '../main/main';

@IonicPage()
@Component({
  selector: 'page-start-up',
  templateUrl: 'start-up.html',
})
export class StartUpPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) this.navCtrl.setRoot(MainPage);
    });
  }

  openPage() {
  	// Change page to the authentication page.
    this.navCtrl.push(AuthenticationPage);
  }


  // Image sources (THESE IMAGES ARE TEMP AND SO ARE THE TEXT)
  // https://www.shareicon.net/receipt-buy-purchase-credit-card-106780
  // https://www.shareicon.net/smartphone-611954
  // https://www.shareicon.net/bill-receipt-103511
  slides = [
    {
      title: "What are we!",
      description: "<b>Receipt Divider</b> is an application that allows users to track their expenditures and also split bills!",
      image: "assets/imgs/temporary-image.png"
    },
    {
      title: "Track Expenditure",
      description: "See where your money is going and analyse your monthly expenditures!",
      image: "assets/imgs/temporary-image2.png"
    },
    {
      title: "Split Receipts",
      description: "Take a photo of a receipt and send notifications to friends to pay up!",
      image: "assets/imgs/temporary-image3.png"
    }
  ];
}
