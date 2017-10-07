import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';

@Injectable()
export class TrailTrackerProvider {

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;

  private configBack: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 20,
    distanceFilter: 30,
    debug: false,
    stopOnTerminate: true,
    interval: 2000
};

  private _options = {
    frequency: 3000,
    enableHighAccuracy: true
  };

  constructor(private _zone: NgZone, private _backgroundGeolocation: BackgroundGeolocation, private _geolocation: Geolocation) {
  }

  public startTracking() {

    this._backgroundGeolocation.configure(this.configBack)
    .subscribe((location: BackgroundGeolocationResponse) => {
      this._zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
      });
    });     

    this.watch = this._geolocation.watchPosition(this._options).filter((p: any) => p.code === undefined)
    .subscribe((data) => {
      this._zone.run(() => {
        this.lat = data.coords.latitude;
        this.lng = data.coords.longitude;
      });
    });

    this._backgroundGeolocation.start();
  }

  public stopTracking() {
     this._backgroundGeolocation.finish();
     this.watch.unsubscribe();    
  }
}