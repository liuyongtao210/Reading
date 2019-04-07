import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { ImageAddPage } from '../pages/image-add/image-add';
import { Storage } from '@ionic/storage';
import { commanModel } from '../model/comman/comman';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
  	platform: Platform, 
  	statusBar: StatusBar, 
  	splashScreen: SplashScreen,
		private storage: Storage,
		private comman:commanModel
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
			this.getUserInfo(() => {
				this.storage.get('isNotFirstLaunch').then(val=>{
					if(val==null){
						this.rootPage = ImageAddPage;
					}else{
						this.rootPage = TabsPage;
					}
				})
				statusBar.styleDefault();
				splashScreen.hide();
			})
    });
  }
	getUserInfo(callback) {
		this.storage.get('userId').then((val) => {
			console.log(val);
			this.comman.setGlobal({
				userId: this.checkValue(val)
			});
			this.storage.get('token').then((val) => {
				this.comman.setGlobal({
					token: this.checkValue(val)
				});
				callback();
			});

		});
	}
	checkValue(value){
		if(value == "" || value == null || value == undefined) {
			return "";
		}else{
			return value;
		}
	}
}
