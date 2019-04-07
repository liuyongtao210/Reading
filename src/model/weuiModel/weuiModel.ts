import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';

@Injectable()
export class WeuiModel {
	constructor(
		private alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		private toastCtrl: ToastController
	) {}
	/**********Toast************/
	showToast(message: string, toastOptions ? : any, callback ? ) {
		//		options={
		//		 	position:"top", "middle", "bottom"/默认top
		//		 	duration:毫秒/默认2000
		//		 	closeButtonText:string/默认无，不为空显示
		//		 }
		//		callback回调可选，toast关闭后执行
		let options = toastOptions;
		let toastOpts = new Object();
		if(options == undefined) {
			options = new Object();
		}
		// if(options['position'] == "" || options['position'] == undefined || options['position'] == null) {
		// 	options['position'] = 'bottom';
		// }
		options['position'] = 'middle'; //不管传什么位置，都放到中间
		if(options['duration'] == "" || options['duration'] == undefined || options['duration'] == null) {
			options['duration'] = 2000;
		}
		toastOpts = {
			message: message,
			position: options['position'],
			dismissOnPageChange: false
		}
		let showCloseButton = false;
		if(options['closeButtonText'] == "" || options['closeButtonText'] == undefined || options['closeButtonText'] == null) {
			toastOpts['duration'] = options['duration'];
		} else {
			showCloseButton = true;
			toastOpts['showCloseButton'] = showCloseButton;
			toastOpts['closeButtonText'] = options['closeButtonText'];
		}
		let toast = this.toastCtrl.create(toastOpts);

		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
			if(callback != undefined || callback != null) {
				callback();
			}
		});

		toast.present();
	}
	/**********Loading************/
	/*showLoading返回loader对象，然后调用hideLoading(loader)将这个loading关闭*/
	showLoading(content: string, duration ? : number) {
		let loader;
		if(duration == null || duration == undefined) {
			loader = this.loadingCtrl.create({
				content: content
			})
		} else {
			loader = this.loadingCtrl.create({
				content: content,
				duration: duration
			})
		}
		loader.present();
		return loader;
	}
	hideLoading(loader: any) {
		loader.dismiss();
	}
	/**********Alert************/
	/*
	showAlert(标题（ 可为空）， 内容（ 可为空）， 取消按钮？， 确认按钮？， 取消按钮回调？， 确认按钮回调？) 
		支持单按钮 
		*/
	showAlert(title: string, content: string, cancelTxt ? : string, confirmTxt ? : string, clearback ? , callback ? ) {
		//		if(imgSrc == null || imgSrc == "") {
		//			imgSrc = "assets/img/wang/talk-userinfo-imgbg.png";
		//		}
		let buttonsArr = [];
		cancelTxt = cancelTxt == undefined ? "" : cancelTxt;
		confirmTxt = confirmTxt == undefined ? "" : confirmTxt;

		buttonsArr = this.getButtonStyle(cancelTxt, confirmTxt, clearback, callback);
		console.log(buttonsArr);
		let alert = this.alertCtrl.create({
			title: '<div class="tt">' + title + '</div>',
			message: content,
			buttons: buttonsArr,
			enableBackdropDismiss: false,
		});
		alert.present();
	}
	getButtonStyle(cancelTxt, confirmTxt, clearback, callback) {
		let buttonsArr = [];
		if(cancelTxt == "" && confirmTxt != "") {
			buttonsArr = [{
				text: confirmTxt,
				handler: callback,
				cssClass: "hideAlertButton100",
			}];
			return buttonsArr;
		} else if(cancelTxt != "" && confirmTxt == "") {
			buttonsArr = [{
				text: cancelTxt,
				role: 'cancel',
				handler: clearback,
				cssClass: "hideAlertButton100",
			}];
			return buttonsArr;
		} else {
			buttonsArr = [{
					text: cancelTxt,
					role: 'cancel',
					handler: clearback,
					//					cssClass: "hideAlertButton100",
				},
				{
					text: confirmTxt,
					handler: callback,
					//					cssClass: "hideAlertButton100",
				}
			];
			return buttonsArr;
		}

	}
	/*单按钮的alert，已废弃*/
	showAlert2(title: string, content: string, buttonTxt: string, callback ? ) {
		//		if(imgSrc == null || imgSrc == "") {
		//			imgSrc = "assets/img/wang/talk-userinfo-imgbg.png";
		//		}
		let alert = this.alertCtrl.create({
			title: '<div class="ttA">' + title + '</div>',
			subTitle: content,
			buttons: [{
				text: buttonTxt,
				cssClass: 'toastStyle',
				handler: callback
			}],
			enableBackdropDismiss: false,
		});
		alert.present();
	}

}