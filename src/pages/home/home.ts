import { Component } from '@angular/core';
import { UbicacionProvider } from '../../providers/ubicacion/ubicacion';
import { NavController } from 'ionic-angular/navigation/nav-controller';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  usuario: any = {
    nombre: 'Nombre del usuario'
  };

  constructor(private _ubicacion: UbicacionProvider,
    private navCtrl: NavController) {

    this._ubicacion.iniciar_localizacion();
    this._ubicacion.usuario.valueChanges()
      .subscribe((user: any) => {
        console.log(JSON.stringify(user));
        this.usuario = user;
      });
  }

  salir() {
    this.navCtrl.setRoot('login');
    this._ubicacion.detener_watch();
  }

}
