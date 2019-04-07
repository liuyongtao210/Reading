import {Injectable} from '@angular/core'; 
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { AlertController,LoadingController } from 'ionic-angular';
import { AppUpdate } from '@ionic-native/app-update';
import { File } from '@ionic-native/file';

import { commanModel } from '../../model/comman/comman';
//import { request,setGloble } from '../../assets/js/comman';
//import { Weui } from '../../assets/ts/weui/weui';
import { WeuiModel } from '../../model/weuiModel/weuiModel';

declare var HotUpdater: any; //使用自定义插件
@Injectable()
export class CheckVModel {
	loader: any;
	androidV:string = "200001";//20180920
	androidApkName:string = "";
	constructor(
		private storage: Storage,
		private alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		public platform: Platform,
		private appUpdate: AppUpdate,
		private file: File,
		private weui:WeuiModel,
		private comman: commanModel
	) {
	}
	checkFileExist(apkPathDir){
		let path = apkPathDir+'download/';
		if(this.androidApkName!=""&&this.androidApkName!=null&&this.androidApkName!=undefined){
			try{
				this.file.removeFile(path,this.androidApkName+'.apk').then(() => {
				}).catch((err) => {
					
				});
			}catch(e){
				//TODO handle the exception
				console.log(e);
			}
		}
	}
	checkV(){
		try{
			if(this.platform.is("ios")) {
				this.storage.get("hv").then((val) => {
					if(!val) {
						val = "2.0";
					}
					this.comman.request("App", "getVersion", {
						appCode: "com.speciala.originalreading",
						platform: "ios"
					}, (data) => {
						if(data.code == 0) {
							this.comman.setGlobal({iVersion:data.version});
							if(Number(data.version) > Number(val)) {
								let cancelTxt = "跳过";
								if(data.isForce!=0){
									cancelTxt="";
								}
								this.weui.showAlert("发现新版本", data.des,cancelTxt,"立即更新",()=>{}, () => {
									this.loader = this.loadingCtrl.create({
										content: "更新中,请勿关闭APP...",
									});
									this.loader.present();
									HotUpdater.updateVersion(data.path, (msg) => {
										this.loader.dismiss();
										this.weui.showAlert("更新完毕", "请关闭APP后重新打开", "", "");
										this.storage.set("hv", data.version);
									}, (err) => {
										this.loader.dismiss();
										this.weui.showToast("更新失败", err, "确认");
									})
								});
							}
						}
					});
				});
			}
			if(this.platform.is("android")) {
				this.comman.request("App", "getVersion", {
					appCode: "com.speciala.originalreading",
					platform: "android"
				}, (data) => {
					if(data.code == 0) {
						this.comman.setGlobal({aVersion:data.version});
						this.androidApkName = data.appName;
						if(Number(data.version) > Number(this.androidV)) {
							let cancelTxt = "跳过";
							if(data.isForce!=0){
								cancelTxt="";
							}
							this.weui.showAlert("发现新版本", data.des,cancelTxt, "立即更新",()=>{}, () => {
								this.loader = this.loadingCtrl.create({
									content: "更新中,请勿关闭APP...",
								});
								this.loader.present();
								this.appUpdate.checkAppUpdate(data.xmlFile).then(()=>{
									this.loader.dismiss();
									this.loader = this.loadingCtrl.create({
										content: "更新完毕",
										duration:3000
									});
									this.loader.present();	
								}).catch(()=>{
									this.loader.dismiss();
									if(data.isForce!=0){	
										this.weui.showAlert("更新失败","更新失败,请到应用商店或官方网站下载最新版本","","");					
									}else{
										this.weui.showAlert("更新失败","更新失败,请到应用商店或官方网站下载最新版本","关闭","");	
									}
								});
							});
						}else{		
							let apkPathDir = this.file.externalRootDirectory;
							this.file.checkDir(apkPathDir, 'download').then(() => {
									this.checkFileExist(apkPathDir);
									console.log('Directory exists');
							}).catch((err) => {
									console.log('Directory doesnt exist');
								});
						}
					}
				});
			}
		}catch(e){
			//TODO handle the exception
		}
		
	}

}
