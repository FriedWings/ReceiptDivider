import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform, ToastController, Slides} from 'ionic-angular';
import { NgClass } from '@angular/common';
import { Sim } from '@ionic-native/sim';

// Pages
import { MainPage } from '../../pages/main/main';

// Providers
import { AuthProvider } from '../../providers/auth/auth';
import { ToastProvider } from '../../providers/toast/toast';

import { countryDate } from '../../classes/CountryDate';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.html',
})

export class AuthenticationPage {
  @ViewChild(Slides) slides: Slides;
  showSpinner: boolean = false;
  phoneNumber: number;

  public recaptchaVerifier: firebase.auth.RecaptchaVerifier = null;

  constructor(public navCtrl: NavController, private sim: Sim, public plt: Platform , private _authProvider: AuthProvider, private _toastCtrl: ToastProvider) {
    if(_authProvider.isAuthenticated()) this.finishSetup();
  }

  ionViewDidLoad() {
    if(!this.plt.is('ios') || !this.plt.is('android')){
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible'
      }); 
    }
    this.slides.lockSwipes(true);
  }

  sendSms(phoneNumber: string){
    this.showSpinner = true;

    this._authProvider.sendSms("+" + phoneNumber, this.recaptchaVerifier)
    .then((data) => {
      this.showSpinner = false;
      this._toastCtrl.toastMessage('SMS successfully sent.', 3000);
      this.slideTo(1);
    }).catch((err) => {
      this.showSpinner = false;
      this._toastCtrl.toastMessage("Please ensure you have the area code included. Example +61412345678", 7000);
    }); 
  }

  signIn(smsCode: string){
    this.showSpinner = true;
    this._authProvider.signIn(smsCode).then((result) => {
      this.showSpinner = false;
      this.finishSetup();
    }).catch((err) => {
      this.showSpinner = false;

      if(err == 'Need to send SMS first' || err=='auth/argument-error'){
        this._toastCtrl.toastMessage('Please send SMS first!', 3000);
      }
      else if(err == "auth/invalid-verification-code"){
        this._toastCtrl.toastMessage('Invalid SMS verification code! Please check the phone number and resend the verification code.', 7000);
      }
      else if(err == "auth/too-many-requests"){
        this._toastCtrl.toastMessage('Too many requests sent. Please try again later.', 4000);
      }
      else{
        this._toastCtrl.toastMessage('Please check the phone number and resend verification code!', 4000);
      }
    })
  }

  slideTo(index: number){
    this.slides.lockSwipes(false);
    this.slides.slideTo(index);
    this.slides.lockSwipes(true);
  }

  setupAccount(profileName: string){
    this.showSpinner = true;
    let user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: profileName,
      photoURL: null
    }).then(() => {
      this.showSpinner = false;
      this.finishSetup();
    }).catch((err) => {
      this.showSpinner = false;
      this._toastCtrl.toastMessage('Please enter a valid input', 4000);
    });
  }

  finishSetup(){
    if(!firebase.auth().currentUser.displayName) {
      this.slideTo(2);
      return;
    }    
    this._toastCtrl.toastMessage('Welcome ' + firebase.auth().currentUser.displayName ,3000)
    this.navCtrl.setRoot(MainPage);
  }

  getCountryCodeNumber(isoCode: string){
    return countryDate[isoCode];
  }

}
