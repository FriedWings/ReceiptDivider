import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';

// Pages
import { StartUpPage } from '../start-up/start-up';

// Providers
import { AuthProvider } from '../../providers/auth/auth';
import { ToastProvider } from '../../providers/toast/toast';


@IonicPage()
@Component({
  selector: 'page-icon-popup',
  templateUrl: 'icon-popup.html',
})
export class IconPopupPage {
  displayName: any;

  constructor(public _toastCtrl: ToastProvider, public navCtrl: NavController, public viewCtrl: ViewController, public _authProvider: AuthProvider, public loadingCtrl: LoadingController) {
  	// Should never be able to load this without being authenticated
  	if(!this._authProvider.isAuthenticated) this.viewCtrl.dismiss();
    this.displayName = _authProvider.getUserProfile().displayName;
    // console.log(_authProvider.getUserProfile().displayName);
  }

  logout(){
    let loader = this.loadingCtrl.create({
      content: "Signing out"
    });
    loader.present();

    this._authProvider.signOut().then(() => {
      loader.dismiss();
      this._toastCtrl.toastMessage('Successfully logged out', 4000);
      this.navCtrl.setRoot(StartUpPage);
    }).catch((err) => {
      loader.dismiss();
      this._toastCtrl.toastMessage('An error has occured during signout. Please try again.', 4000);
    });
  }

  close() {
  	this.viewCtrl.dismiss();
  }

}
