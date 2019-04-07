import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { commanModel } from '../../model/comman/comman';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { ImageViewerController } from 'ionic-img-viewer';

@Component({
	selector: 'page-book-introduction',
	templateUrl: 'book-introduction.html',
})
export class BookIntroductionPage {
	
	loading: any = null;
	userId: string = "";
	token: string = "";
	seriesId: string = "";
	pptlist: any = [];
	filePath: string = "http://files.specialaedu.com/files/";

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public commanModel: commanModel,
		public WeuiModel: WeuiModel,
		private imgViewer:ImageViewerController
	) {
		this.userId = this.commanModel.getGlobal("userId");
		this.token = this.commanModel.getGlobal("token");
		this.seriesId = this.navParams.get("data");
	}

	initData() {
//		this.loading = this.WeuiModel.showLoading("加载中");
		this.commanModel.request("DocumentConvert", "getCourseImage", {
			courseId: this.seriesId,
			type: 91
		}, (data) => {
			this.WeuiModel.hideLoading(this.loading)
			if(data.code == 0) {
				this.filePath = data.filePath;
//				data.list = [{
//					imgList:[
//						{file:'2018/09/11/1536648558992_1.jpg'},
//						{file:'2018/09/11/1536648558992_2.jpg'},
//						{file:'2018/09/11/1536648558992_3.jpg'},
//						{file:'2018/09/11/1536648558992_4.jpg'},
//						{file:'2018/09/11/1536648558992_5.jpg'},
//						{file:'2018/09/11/1536648558992_6.jpg'},
//					]
//				}]
				if(data.list.length>0){
					this.pptlist = data.list[0].imgList;
				}else{
					this.WeuiModel.showToast("未上传书籍简介ppt", {position:"middle"})
				}
			}else{
				this.WeuiModel.showAlert("数据获取失败!",data.msg,"确定")
			}
		})
	}

	presentImage(myImage) {
		const imageViewer = this.imgViewer.create(myImage, {enableBackdropDismiss:true});
		imageViewer.present();
	}

	ionViewDidLoad() {
		this.initData();
	}

	ionViewDidEnter() {

	}

	ionViewWillLeave() {

	}

}