import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Pages
import { StartUpPage } from '../pages/start-up/start-up';

// Providers
import { AuthProvider } from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = StartUpPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public _authProvider: AuthProvider) {
    this.initializeApp();

    // if(_authProvider.isAuthenticated) this.rootPage = MainPage;
    console.log('User already authenticated goto main page.');

    this.pages = [
      // { title: 'A Title', component: aComponent }
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
