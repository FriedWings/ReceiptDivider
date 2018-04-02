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
      const phoneNumberString = "+" + phoneNumber;
      console.log('Phonenumber: ' + phoneNumberString);

      if(this.plt.is('mobileweb')){
        firebase.auth().signInWithPhoneNumber(phoneNumberString, recaptchaVerifier)
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
        (<any>window).FirebasePlugin.verifyPhoneNumber('+61434191241', 60, (credential) => {
          this.verificationId = credential.verificationId;
          resolve();
        }, function(error) {
          reject(error);
        });
      }
      else { // browser
        reject();
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
