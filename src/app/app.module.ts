import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { StartUpPage } from '../pages/start-up/start-up';
import { AuthenticationPage } from '../pages/authentication/authentication';
import { MainPage } from '../pages/main/main';
import { IconPopupPage } from '../pages/icon-popup/icon-popup';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';
import { AuthProvider } from '../providers/auth/auth';
import { ToastProvider } from '../providers/toast/toast';

import firebase from 'firebase';

firebase.initializeApp({
  apiKey: "AIzaSyBlDv7Gf430NVxFGX-Qa-V5TMu5SZJKTrI",
  authDomain: "ionicauthtst.firebaseapp.com",
  databaseURL: "https://ionicauthtst.firebaseio.com",
  projectId: "ionicauthtst",
  storageBucket: "ionicauthtst.appspot.com",
  messagingSenderId: "197823917329"
});

@NgModule({
  declarations: [
    MyApp,
    StartUpPage,
    AuthenticationPage,
    MainPage,
    IconPopupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StartUpPage,
    AuthenticationPage,
    MainPage,
    IconPopupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ToastProvider
  ]
})
export class AppModule {}
