import { Injectable } from '@angular/core';
import { ActionSheetController, ToastController, Platform } from 'ionic-angular';

@Injectable()
export class WxsharePage {
	constructor(
		public actionSheetCtrl:ActionSheetController,
		public toastCtrl:ToastController,
		public platform: Platform,
	) {}
	
	wxShare(shareTile:string,shareIntroduction:string,shareOpenUrl:string,shareType:number,img_Url:string,callback?){//shareType==1表示连接分享,2表示图片分享
				if(callback != undefined || callback != null) {
							var callback=callback ;
				}else{
							var callback=null ;
				}
	    let actionSheet = this.actionSheetCtrl.create({
			//title: 'Modify your album',//弹出框顶部文字
			cssClass: 'wxShareBody',
		    buttons: [
		        {
		          text: '微信',
		          cssClass: 'wxShareLeft',
		          handler:()=>{
		          	this.shareWx(shareTile,shareIntroduction,0,shareOpenUrl,shareType,img_Url,callback);
		          },
		        },{
		          text: '朋友圈',
		          cssClass: 'wxShareRight',
		          handler:()=>{
		          	this.shareWx(shareTile,shareIntroduction,1,shareOpenUrl,shareType,img_Url,callback);
		          },
		        },{
		          text: '取消',
		          role: 'cancel',
		          cssClass: 'wxShareBottom',
		          handler:()=>{
		          	console.log('取消')
		          },
		        }
		    ]
	    });
	    actionSheet.present();
	}
	
	shareWx(shareTile:string,shareIntroduction:string,m:number,shareOpenUrl:any,shareType:number,img_Url:string,callback){
		if(this.platform.is('cordova')){
			let wechat = (<any>window).Wechat;
		    wechat.isInstalled((installed)=>{
	      		if(!installed){
	        		this.alertEv("Failed: 未检测到微信手机端");
	      		}
		    },(reason)=>{
		        this.alertEv("Failed: " + reason);
		    });
		    let media_LINK:any = {
		    	type: wechat.Type.LINK,
			    webpageUrl: shareOpenUrl,
			    image: img_Url
		    }
		    let media_IMAGE:any = {
		    	type: wechat.Type.IMAGE,
			    image: img_Url
		    }
		    wechat.share({
			    message: {
			        title:shareTile,
			        description:shareIntroduction,
			        thumb:img_Url,
			        media:shareType==1?media_LINK:media_IMAGE,
			    },
			        scene: m==1 ? 1 : 0, //0好友  1朋友圈
			    },()=>{
					this.alertEv('分享成功');
					if(callback != undefined || callback != null) {
							callback();
					}
			    },(reason)=>{
		        	this.alertEv("分享失败: " + reason);
		    });
		}else{
			this.alertEv('请使用手机客户端进行分享')
		}
	}
	
	imgShare(imgUrl:string,callback,num){
		if(this.platform.is('cordova')){
			let wechat = (<any>window).Wechat;
		    wechat.isInstalled((installed)=>{
	      		if(!installed){
	        		this.alertEv("Failed: 未检测到微信手机端");
	      		}
		    },(reason)=>{
		        this.alertEv("Failed: " + reason);
		    });
		    wechat.share({
			    message: {
			        title:'特优生',
			        description:'为世界创造有用人才',
			        thumb:'http://test.saclass.com/share1to1/img/logo.png',
			        media: {
			            type: wechat.Type.IMAGE,
			            image: imgUrl
			        }
			    },
			        scene:num, //0好友  1朋友圈
			    },()=>{
					this.alertEv('分享成功');
					if(callback){
						callback();
					}
			    },(reason)=>{
			    	if(reason == '用户点击取消并返回'){
			    		this.alertEv("取消分享");
			    	}else{			    		
			    		this.alertEv("分享失败: " + reason);
			    	}
		    });
		}else{
			this.alertEv('请使用手机客户端进行分享')
		}
	}
	
	alertEv(titleIntroduction?:string){
		let toast = this.toastCtrl.create({
			message:titleIntroduction,
			position:'middle',
			cssClass:'wxshareToast',
			duration:1500
		})
		toast.present();
	}
}
