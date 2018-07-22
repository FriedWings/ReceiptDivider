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
          resolve();
        })
        .catch(function (error) {
          reject(error);
        });      
      }
      else if(this.plt.is('ios')){
        // Todo: IOS Platform
        reject();
      }
      else if(this.plt.is('android')){
        (<any>window).FirebasePlugin.verifyPhoneNumber(phoneNumber, 60, (credential) => {
          this.verificationId = credential.verificationId;
          resolve();
        }, function(err) {
          reject(err);
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
