import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Pages
import { StartUpPage } from '../pages/start-up/start-up';
import { MainPage } from '../pages/main/main';

// Providers
import { AuthProvider } from '../providers/auth/auth';

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = StartUpPage;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public _authProvider: AuthProvider) {
    this.initializeApp();

    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     this.rootPage = MainPage;
    //   }
    //   else this.rootPage = StartUpPage;
    // });


    this.pages = [
      { title: 'Home', component: MainPage },
      // { title: 'Pending payments', component: MainPage },
      // { title: 'Scan receipt', component: MainPage },
      // { title: 'About', component: MainPage },
      // { title: 'Settings', component: MainPage },
      // { title: 'Logout', component: MainPage },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Place any higher level native things required here.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
