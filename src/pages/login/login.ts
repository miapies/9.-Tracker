import { Component } from '@angular/core';
import {
  IonicPage,
  LoadingController,
  AlertController,
  NavController
} from 'ionic-angular';

import { ViewChild, AfterViewInit } from '@angular/core';
import { Slides } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { HomePage } from '../home/home';

@IonicPage({
  name: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements AfterViewInit {

  @ViewChild(Slides) slides: Slides;
  clave: string = 'mig-1';

  constructor(private _userSrv: UsuarioProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController) { }

  ngAfterViewInit(): void {
    this.slides.lockSwipes(true);
    this.slides.freeMode = false;
    this.slides.paginationType = 'progress';
  }

  continuar() {

    const loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });

    loading.present();

    // Verificar si ka clave es válida
    if (this.clave.length < 3) {
      return;
    }

    this._userSrv.verfica_usuario(this.clave)
      .then(valido => {
        loading.dismiss();

        if (valido) {
          // Continuar a la siguiente pantalla
          this.slides.lockSwipes(false);
          this.slides.slideNext();
          this.slides.lockSwipes(true);

        } else {

          this.alertCtrl.create({
            title: 'Clave no es correcta',
            subTitle: 'Por favor verifique su clave, o hable con el administrador',
            buttons: ['OK!']
          }).present();

        }

      })
      .catch(error => {
        loading.dismiss();
        console.error('ERROR en veridfica_usuario: ' + JSON.stringify(error));
      });
  }

  ingresar() {
    // Tenemos la clave, ir al home
    this.navCtrl.setRoot(HomePage);
  }
}
