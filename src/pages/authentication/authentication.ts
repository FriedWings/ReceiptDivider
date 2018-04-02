import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform, ToastController, Slides} from 'ionic-angular';
import { NgClass } from '@angular/common';

// Pages
import { MainPage } from '../../pages/main/main';

// Providers
import { AuthProvider } from '../../providers/auth/auth';
import { ToastProvider } from '../../providers/toast/toast';

import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.html',
})

export class AuthenticationPage {
  @ViewChild(Slides) slides: Slides;
  showSpinner: boolean = false;

  public recaptchaVerifier: firebase.auth.RecaptchaVerifier = null;

  constructor(public navCtrl: NavController, public plt: Platform , private _authProvider: AuthProvider, private _toastCtrl: ToastProvider) {
    if(_authProvider.isAuthenticated()) this.finishSetup();
  }

  ionViewDidLoad() {
    if(!this.plt.is('ios') || !this.plt.is('android')){
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible'
      }); 
    }

    // Lock the slides
    this.slides.lockSwipes(true);
  }

  sendSms(phoneNumber: string){
    this.showSpinner = true;

    this._authProvider.sendSms(phoneNumber, this.recaptchaVerifier)
    .then((data) => {
      this.showSpinner = false;
      this._toastCtrl.toastMessage('SMS successfully sent.', 3000);
      this.slideTo(1);
    }).catch((err) => {
      this.showSpinner = false;
      if(err.code = "auth/invalid-phone-number"){
        this._toastCtrl.toastMessage('Invalid phone number. Please check input and retry.', 4000);
      }
      else if(err.code == "auth/too-many-requests"){
        this._toastCtrl.toastMessage('Too many requests sent. Please try again later.', 4000);
      }
      else {
        this._toastCtrl.toastMessage('An error has occured. Please check input and retry.', 4000);
      }
      console.log(err);
    }); 
  }

  signIn(smsCode: string){
    this.showSpinner = true;
    this._authProvider.signIn(smsCode).then((result) => {
      this.showSpinner = false;
      this.finishSetup();
    }).catch((err) => {
      this.showSpinner = false;
      console.log(JSON.stringify(err));
      if(err == 'Need to send SMS first' || err.code=='auth/argument-error'){
        this._toastCtrl.toastMessage('Please send SMS first!', 3000);
      }
      else if(err.code == "auth/invalid-verification-code"){
        this._toastCtrl.toastMessage('Invalid SMS verification code! Please check the phone number and resend the verification code.', 7000);
      }
      else if(err.code == "auth/too-many-requests"){
        this._toastCtrl.toastMessage('Too many requests sent. Please try again later.', 4000);
      }
      else{
        this._toastCtrl.toastMessage('Please check phone number and resend verification code again!', 4000);
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
      this._toastCtrl.toastMessage('Please place a valid input', 4000);
      console.log("ERROR DURING ACCOUNT SETUP" + err);
    });
  }

  finishSetup(){
    console.log(firebase.auth().currentUser.displayName)
    if(!firebase.auth().currentUser.displayName) {
      console.log('Sent');
      this.slideTo(2);
      return;
    }    
    this._toastCtrl.toastMessage('Welcome ' + firebase.auth().currentUser.displayName ,3000)
    this.navCtrl.setRoot(MainPage);
  }
}
