import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular'; 

import firebase from 'firebase';

@Injectable()
export class AuthProvider {
  verificationId;

  constructor(public plt: Platform) {
  }

  sendSms(phoneNumber: string, recaptchaVerifier){
    return new Promise((resolve, reject) => {

      if(this.plt.is('mobileweb')){
        firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
        .then( confirmationResult => {
          this.verificationId = confirmationResult.verificationId;
          console.log(this.verificationId);
          resolve();
        })
        .catch(function (error) {
          reject(error);
        });      
      }
      else if(this.plt.is('ios')){
        console.log('ios platform --TODO');
      }
      else if(this.plt.is('android')){
        console.log(phoneNumber);
        (<any>window).FirebasePlugin.verifyPhoneNumber(phoneNumber, 60, (credential) => {
          this.verificationId = credential.verificationId;
          resolve();
        }, function(err) {
          console.log(err);
          if(err = "auth/invalid-phone-number")
            reject('Invalid phone number. Please check input and retry.');
          else if(err == "auth/too-many-requests")
            reject('Too many requests sent. Please try again later');
          else reject('An error has occured. Please check input and retry.');
        });
      }
      else {
        reject("Application running on invalid platform");
      }
    });

  }

  signIn(smsCode: string){
    return new Promise((resolve, reject) => {
      if(this.verificationId == null) reject('Need to send SMS first');
      let signInCreditial = firebase.auth.PhoneAuthProvider.credential(this.verificationId, smsCode);
      firebase.auth().signInWithCredential(signInCreditial).then((result) => {
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

  getUserProfile(){
    return firebase.auth().currentUser;
  }

}
