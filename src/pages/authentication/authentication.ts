import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Slides} from 'ionic-angular';
import { NgClass } from '@angular/common';

// Providers
import { AuthProvider } from '../../providers/auth/auth';

import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.html',
})

export class AuthenticationPage {
  @ViewChild(Slides) slides: Slides;
  showSpinner: boolean = false;

  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  constructor(public navCtrl: NavController, public navParams: NavParams, private _authProvider: AuthProvider, private toastCtrl: ToastController) {
    if(_authProvider.isAuthenticated()) console.log("user already signed in, skip to main page");
  }

  ionViewDidLoad() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible'
    });

    // Lock the slides
    this.slides.lockSwipes(true);
  }

  sendSms(phoneNumber: string){
    this.showSpinner = true;

    this._authProvider.sendSms(phoneNumber, this.recaptchaVerifier).then((data) => {
      this.showSpinner = false;
      this.slideTo(1);
    }).catch((err) => {
      this.showSpinner = false;
      if(err.code = "auth/invalid-phone-number"){
        this.toastMessage('Invalid phone number. Please check input and retry.', 4000);
      }

      console.log(err);
    }); 
  }

  signIn(smsCode: string){
    this.showSpinner = true;
    this._authProvider.signIn(smsCode).then((result) => {
      this.showSpinner = false;
      let user = firebase.auth().currentUser;

      // If profile not setup, goto setup slide
      if(!user.displayName) this.slideTo(2);
      else this.finishSetup();

    }).catch((err) => {
      this.showSpinner = false;
      console.log(err);
      if(err == 'Need to send SMS first' || err.code=='auth/argument-error'){
        this.toastMessage('Please send SMS first!', 3000);
      }
      else if(err.code == "auth/invalid-verification-code"){
        this.toastMessage('Invalid SMS verification code! Please check the phone number and resend the verification code.', 7000);
      }
      else if(err.code == "auth/too-many-requests"){
        this.toastMessage('Too many requests sent. Please try again later.', 4000);
      }
      else{
        this.toastMessage('Please check phone number and resend verification code again!', 4000);
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
      this.toastMessage('Please place a valid input', 4000);
      console.log("ERROR DURING ACCOUNT SETUP" + err);
    });
  }

  finishSetup(){
    this.toastMessage('Welcome ' + firebase.auth().currentUser.displayName ,3000)

    console.log('FINISHED SETUP GOTO MAIN PAGE');
    // this.navCtrl.setRoot();
  }

  toastMessage(message: string, duration: number) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

}
