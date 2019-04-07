import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';

declare var actorPlugins: any; //使用自定义插件
@Injectable()
export class weuiNativeModel {
	constructor(
		private alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
	) {}
	showNativeAlert(title,msg,cancelText,confirmText,callback?){
		var alertInfo;
		if(cancelText==""){
			alertInfo = "title="+title+"&msg="+msg+"&confirmText="+confirmText;
		}else{
			alertInfo = "title="+title+"&msg="+msg+"&cancelText="+cancelText+"&confirmText="+confirmText;
		}
		try{
			actorPlugins.setJoinActor(alertInfo, (msg) => {
				if(msg=="closePanel"){
//					this.closePanel();
				}
				if(callback){
					callback();
				}
			});
		}catch(e){
			//TODO handle the exception
			console.log(e);
		}
	}
	showLoading(content:string,duration?:number){
		let loader;
		if(duration==null||duration==undefined){
			loader = this.loadingCtrl.create({
				content:content
			})
		}else{
			loader = this.loadingCtrl.create({
				content:content,
				duration:duration
			})
		}
		loader.present();
		return loader;
	}
	hideLoading(loader:any){
		loader.dismiss();
	}
	showToast(title: string, content: string, buttonTxt: string, callback?) {
		this.showNativeAlert(title,content,"",buttonTxt,callback);
	}
	showAlert(title: string, content: string, cancelTxt?: string, confirmTxt?: string, clearback?, callback?) {
		this.showNativeAlert(title,content,cancelTxt,confirmTxt,callback);
	}
	

}