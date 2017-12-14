import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { UsuarioProvider } from '../usuario/usuario';
// Firebase
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class UbicacionProvider {

  usuario: AngularFireObject<{}>;
  private watch: Subscription;

  constructor(private geolocation: Geolocation,
    private userProv: UsuarioProvider,
    private db: AngularFireDatabase) {

    if (!this.userProv.clave) {
      return;
    }

    this.usuario = this.db.object(`usuarios/${this.userProv.clave}`);
  }

  iniciar_localizacion() {

    this.watch = this.geolocation.watchPosition()
      .subscribe((data) => {
        if (this.userProv.clave && data.coords) {
          this.guardar_coordenadas(
            data.coords.longitude, data.coords.latitude)
            .then(() => console.log('Coordenadas guardadas correctamente'))
            .catch((error) => console.error('ERROR coordenadas no guardadas: ' + JSON.stringify(error)))
        }
      });

  }

  detener_watch() {
    this.watch.unsubscribe();
    this.userProv.borrar_usuario();
  }

  private guardar_coordenadas(lng: number, lat: number) {
    return this.usuario.update({
      lat: lat,
      lng: lng
    });
  }

}
