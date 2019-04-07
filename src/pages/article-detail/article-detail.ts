import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { WxsharePage } from '../../model/wxshare/wxshare'; //分享
import { SpecialSharePopPage } from '../../pages/share_pop/share_pop';//分享模态框
import { ImageViewerController } from 'ionic-img-viewer';
import { CallNumber } from '@ionic-native/call-number';
import { SpecialSetPage } from '../../pages/special_set/special_set';

/**
 * Generated class for the ArticleDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-article-detail',
	templateUrl: 'article-detail.html',
})
export class ArticleDetailPage {

	id: string = "";
	imgurl: string = "";
	articleTitle: string = "加载中......";
	icon: string = "";
	htmlData: string = "";
	readings: number = 0;
	favour: number = 0;
	mytitle: string = "";
	nolike: boolean = false;
	hasliked: boolean = false;
	summary: string = "";
	// showapply: boolean = false;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private weui: WeuiModel,
		private comman: commanModel,
		public modalCtrl: ModalController,
		public WxsharePage:WxsharePage,
		private callNumber:CallNumber,
		private imgViewer:ImageViewerController
	) {
		this.id = this.navParams.get('id');
		this.imgurl = this.navParams.get('imgurl');
		this.nolike = this.navParams.get('nolike')==1;
		if(this.imgurl==undefined || this.imgurl==null){
			this.imgurl = "";
		}
		if(this.imgurl!=""){
			this.mytitle = "人物关系";
		}else{
			let paramtitle = this.navParams.get('title');
			if(paramtitle!=null){
				this.mytitle = paramtitle;
			}
		}
		// let paramicon = this.navParams.get('icon');
		// if(paramicon!=null){
		// 	this.icon = paramicon;
		// }
		// let apply = this.navParams.get('showapply');
		// if(apply != null){
		// 	this.showapply = apply;
		// }
		this.initData();
	}

	presentImage(myImage) {
		const imageViewer = this.imgViewer.create(myImage, {enableBackdropDismiss:true});
		imageViewer.present();
	}

	onApplyTap(){
		this.navCtrl.push(SpecialSetPage);
	}

	onContactTap(){
		this.callNumber.callNumber("18515159491", true);
	}
	
	initData(){
		let param = {
			dataType: 14,
			sourceId: this.id
		};
		this.comman.request("SA", "sourceInfo", param, (data) => {
			if(data.code == 0) {
				if(data.data.length>0){
					var article = data.data[0];
					this.articleTitle = article.title;
					this.readings = article.readings;
					this.favour = article.favour;
					this.icon = data.filePath+article.smallPic;
					this.summary = article.newsIntro;
					if(article.content!=""){
						try{
							var obj = JSON.parse(article.content);
							this.htmlData = decodeURIComponent(obj[0].content);
						}catch(e){
							this.htmlData = "文章内容格式有误,解析失败";
						}
					}else{
						this.htmlData = "文章内容为空";
					}
				}else{
					this.articleTitle = "未编辑文章内容";
				}
			} else {
				this.articleTitle = data.msg;
			}
		}, (err) => {
			if(err == "ajaxError") {
				this.articleTitle = "连接失败,请检查网络";
			}
		})
	}
	
	onLikeTap(){
		if(!this.hasliked){
			this.hasliked = true;
			this.comman.request("SA", "favour", {dataId:this.id, type:1}, (data) => {
				if(data.code == 0){
					this.favour++;
					this.weui.showToast("点赞成功", {position:"middle"});
				}
			});
		}
	}
	
	onShareTap(){
		let SharePopModal = this.modalCtrl.create(SpecialSharePopPage,{});
		SharePopModal.present();
		SharePopModal.onDidDismiss((data)=>{
			console.log(data)
			if(data.isshareFriend){
			    this.doShare(0);
			}
			if(data.isshareCircle){
				this.doShare(1);
			}
		});
	}
	
	doShare(mode){
		let shareURL = "http://my.saclass.com/app/articleDetail.html?id="+this.id;
		if(this.nolike){
			shareURL += "&nolike=1";
		}
		let shareIcon = this.icon=="" ? "http://my.saclass.com/share1to1/img/logo.png" : this.icon;
		this.WxsharePage.shareWx(
			this.articleTitle,
			this.summary,
			mode,
			shareURL,
			1,
			shareIcon,
			()=>{
		   		//
			}
		)
		console.log({url:shareURL, title:this.articleTitle, summary:this.summary, icon:shareIcon});
	}

	ionViewDidLoad() {
		//
	}

}