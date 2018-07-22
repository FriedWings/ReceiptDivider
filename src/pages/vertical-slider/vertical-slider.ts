import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular';

// Providers
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-vertical-slider',
  templateUrl: 'vertical-slider.html',
})

export class VerticalSliderPage {
  @ViewChild(Slides) verticalSlide: Slides;
  paymentData = [];
  userProfile: any;  
  displayName: string;
  showSpinner: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public _firestoreProvider: FirestoreProvider, public _authProvider: AuthProvider) {
    this.userProfile = _authProvider.getUserProfile();
    this.displayName = this.userProfile.displayName;   
    this.setListeners();
  }

  ionViewDidLoad() {}

  setListeners(){
    var uid = this.userProfile.uid;
    if(!uid) return;
    // Listener for updates to list of payments
    this._firestoreProvider.getDatabase().collection("users/" + uid + "/paymentRefs").onSnapshot((doc) => {
      this._firestoreProvider.getAllPayments().then((data) => {
        this.paymentData = data;
        this.showSpinner = false;
        setTimeout(() => { // Fixes problem with vertical slider not updating immediately after data change
          this.verticalSlide.update();
        }, 500);            
      }).catch((error) => {
        console.log(error);
      })
    })
  }

  convertMillisToDateString(millisInput: string){
    var date = new Date(millisInput);
    if(!date) return "n/a";
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  }
}