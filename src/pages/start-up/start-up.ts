import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-start-up',
  templateUrl: 'start-up.html',
})
export class StartUpPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  openPage() {
  	// Change page to the authentication page.
    // this.navCtrl.push(authenticationPage);
  }


  // Image sources (THESE IMAGES ARE TEMP AND SO ARE THE TEXT)
  // https://www.shareicon.net/receipt-buy-purchase-credit-card-106780
  // https://www.shareicon.net/smartphone-611954
  // https://www.shareicon.net/bill-receipt-103511
  slides = [
    {
      title: "What are we!",
      description: "<b>Receipt Divider</b> is an application!<br>A really nice application.<br>Revolutionary!",
      image: "assets/imgs/temporary-image.png"
    },
    {
      title: "Split receipts!",
      description: "Some temporary text.",
      image: "assets/imgs/temporary-image2.png"
    },
    {
      title: "A phone!",
      description: "Some temporary text.",
      image: "assets/imgs/temporary-image3.png"
    }
  ];
}
