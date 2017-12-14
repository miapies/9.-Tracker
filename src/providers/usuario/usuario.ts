import { Injectable } from '@angular/core';
// Firebase
import { AngularFireDatabase } from 'angularfire2/database';
// Storage
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular/platform/platform';

@Injectable()
export class UsuarioProvider {

  clave: string = null;

  constructor(private db: AngularFireDatabase,
    private storage: Storage,
    private platform: Platform) { }

  verfica_usuario(clave: string) {

    // return this.db.list(`usuarios/${clave.toLowerCase()}`).valueChanges();
    // Mejor forma
    const promesa = new Promise((resolve, reject) => {

      this.db.object(`usuarios/${clave.toLowerCase()}`).valueChanges()
        .subscribe(data => {
          if (data) {
            // la clave es correcta
            this.clave = clave;
            this.guardar_storage();
            resolve(true);
          } else {
            // la clave no es válida
            resolve(false);
          }
        });
    })
      .catch(error =>
        console.error('Error en promesa Service: ' + JSON.stringify(error)));

    return promesa;
  }

  private guardar_storage() {

    if (this.platform.is('cordova')) {
      // Dispositivo
      this.storage.set('clave', this.clave);
    } else {
      // Escritorio
      if (this.clave) {
        localStorage.setItem('clave', this.clave);
      } else {
        localStorage.removeItem('clave');
      }

    }
  }

  cargar_storage() {

    const promesa = new Promise((resolve, reject) => {

      if (this.platform.is('cordova')) {
        // Dispositivo
        this.storage.get('clave')
          .then((val) => {
            if (val) {
              this.clave = val;
              console.log('Clave: ' + JSON.stringify(this.clave));
            }
            resolve();
          })
          .catch((error) => console.error('Error: ' + JSON.stringify(error)));

      } else {
        // Escritorio
        if (localStorage.getItem('clave')) {
          this.clave = localStorage.getItem('clave');
        }
        console.log('Clave: ' + JSON.stringify(this.clave));
        resolve();
      }

    });

    return promesa;

  }

  borrar_usuario() {
    this.clave = null;
    this.guardar_storage();
  }

}
