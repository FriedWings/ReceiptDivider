import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBlDv7Gf430NVxFGX-Qa-V5TMu5SZJKTrI",
  authDomain: "ionicauthtst.firebaseapp.com",
  databaseURL: "https://ionicauthtst.firebaseio.com",
  projectId: "ionicauthtst",
  storageBucket: "ionicauthtst.appspot.com",
  messagingSenderId: "197823917329"
};

@Injectable()
export class AuthProvider {
  verificationId;

  constructor() {
    firebase.initializeApp(firebaseConfig);
  }

  sendSms(phoneNumber: string, recaptchaVerifier){
    return new Promise((resolve, reject) => {
      const phoneNumberString = "+" + phoneNumber;

      firebase.auth().signInWithPhoneNumber(phoneNumberString, recaptchaVerifier)
        .then( confirmationResult => {
            this.verificationId = confirmationResult;
            resolve();
      })
      .catch(function (error) {
        console.error("SMS not sent", error);
        reject(error);
      });
    });
  }

  signIn(smsCode: string){
    return new Promise((resolve, reject) => {
      if(this.verificationId == null) reject('Need to send SMS first');
      this.verificationId.confirm(smsCode).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    })
  }

  signOut(){
    return firebase.auth().signOut();
  }

  isAuthenticated(){
    if(firebase.auth().currentUser) return true;
    return false;
  }

}
