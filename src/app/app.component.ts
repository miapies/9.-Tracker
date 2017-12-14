import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UsuarioProvider } from '../providers/usuario/usuario';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private _userProv: UsuarioProvider) {
    platform.ready().then(() => {

      this._userProv.cargar_storage()
        .then(() => {
          if (this._userProv.clave) {
            this.rootPage = HomePage;
          } else {
            this.rootPage = 'login';
          }

          platform.pause.subscribe(() => {
            console.log('La aplicación se detendrá');
          });

          platform.resume.subscribe(() => {
            console.log('La aplicación va a continuar');
          });

          // Okay, so the platform is ready and our plugins are available.
          // Here you can do any higher level native things you might need.
          statusBar.styleDefault();
          splashScreen.hide();
        });

    });
  }
}

