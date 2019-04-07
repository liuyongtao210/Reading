import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { WxsharePage } from '../../model/wxshare/wxshare'; //分享
import { SpecialSharePopPage } from '../../pages/share_pop/share_pop';//分享模态框

/**
 * Generated class for the H5DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-h5-detail',
  templateUrl: 'h5-detail.html',
})
export class H5DetailPage {

  @ViewChild("myiframe") myiframe: ElementRef;
  mytitle: string = "";
  myurl: string = "";
  shareSummary: string = "";
  shareIcon: string = "";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public WxsharePage:WxsharePage,
    public viewCtrl: ViewController
    ) {
    this.myurl = navParams.get('url');
    this.mytitle = navParams.get('title');
    if(this.mytitle == null){
      this.mytitle = "";
    }
    this.shareSummary = navParams.get('summary');
    if(this.shareSummary == null){
      this.shareSummary = "";
    }
    this.shareIcon = navParams.get('icon');
    if(this.shareIcon == null){
      this.shareIcon = "";
    }
  }

  onCloseTap(){
    this.viewCtrl.dismiss();
  }

  onIframeLoaded(){
    console.log("iframe loaded");
  }

  ionViewDidLoad() {
    this.myiframe.nativeElement.src = this.myurl;
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
    let shareIcon = this.shareIcon=="" ? "http://my.saclass.com/share1to1/img/logo.png" : this.shareIcon;
    let shareTitle = this.mytitle=="" ? "特优生 · 为世界创造有用人才" : this.mytitle;
    let shareDesct = this.shareSummary=="" ? "www.saclass.com" : this.shareSummary;
    console.log({url:this.myurl, title:this.mytitle, summary:this.shareSummary, icon:this.shareIcon});
		this.WxsharePage.shareWx(
			shareTitle,
			shareDesct,
			mode,
			this.myurl,
			1,
			shareIcon,
			()=>{
		   		//
			}
		)
	}

}
