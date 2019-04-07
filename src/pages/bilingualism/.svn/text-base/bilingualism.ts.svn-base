import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams ,Slides, Events} from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';

/**
 * Generated class for the BilingualismPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { commanModel } from '../../model/comman/comman';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
@Component({
  selector: 'page-bilingualism',
  templateUrl: 'bilingualism.html',
})
export class BilingualismPage {
@ViewChild(Slides) slides: Slides;
userId:any;
token:any;
urlData:any;
pptData:any=[]; 
sourceName:any='';
path:any;
progress:any;
curIndex:any=1;
tiptimer:any = -1;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public commanModel:commanModel,
  	public WeuiModel:WeuiModel,
	public events: Events,
	private imgViewer:ImageViewerController
  ) {
  	this.userId=this.commanModel.getGlobal("userId");
  	this.token=this.commanModel.getGlobal("token")
  	this.urlData=this.navParams.get('data');
  	console.log("this.urlData:::",this.urlData)
  	this.progress=this.urlData.progress
  }

  presentImage(myImage) {
	const imageViewer = this.imgViewer.create(myImage, {enableBackdropDismiss:true});
	imageViewer.present();
  }
 
 slideChanged(){
 	var activeIndex=this.slides.getActiveIndex();
 	console.log(this.pptData.length)
 	this.curIndex=activeIndex+1;
 	console.log(activeIndex)
 	if(activeIndex==this.pptData.length){
 		this.curIndex=activeIndex;
 	}
 	if(this.curIndex==this.pptData.length&&this.progress!=100){
	 		this.commanModel.request("SA","saveUserStudyRecord",{//保存学习进度
//			userId: this.userId,
//			token: this.token,
//			seriesId:this.urlData.seriesId,
//			classId:this.urlData.classId,
//			sourceId:this.urlData.sourseId,
//			progress:100
			userId: this.userId,
			token: this.token,
			bookId:this.urlData.seriesId,
			chapterId:this.urlData.classId,
			sourceId:this.urlData.sourseId,
			progress:100
		},(data)=>{
			if(data.code==0){
				console.log("完成了")
				let options = {
				position: "middle",
				duration: 2000,
				//			closeButtonText:"关闭"
				}
				this.WeuiModel.showToast("完成任务",options)
			}
		})
 	}
 	
 }
 
 saveUserStudyRecord(){
 	this.commanModel.request("SA","saveUserStudyRecord",{//保存学习进度
			userId: this.userId,
			token: this.token,
			bookId:this.urlData.bookId,
			chapterId:this.urlData.chapterId,
			sourceId:this.urlData.sourceId,
			progress:100
	},(data)=>{
		if(data.code==0){
			this.tiptimer = setTimeout(()=>{
				this.WeuiModel.showToast("完成任务!",{position:"middle"})
			}, 2000);
			this.events.publish('taskFinish',{chapterId:this.urlData.chapterId,sourceId:this.urlData.sourceId});
		}
	})
 }
 
	ionViewWillLeave() {
		if(this.tiptimer!=-1){
			clearTimeout(this.tiptimer);
			this.tiptimer = -1;
		}
	}
 
 initData(){
// 	let loading = this.WeuiModel.showLoading("加载中...")
 	this.commanModel.request("SA","sourceInfo",{
 			userId:this.userId,
		  	token:this.token,
	     	sourceId:this.urlData.sourceId,
	     	dataType:this.urlData.dataType,
 	},(data)=>{
// 		this.WeuiModel.hideLoading(loading) ;
 		if(data.code==0){
			var getData=data.data[0];
			var filesArr=getData.files.split(',')
			this.sourceName=getData.sourceName
			
   			for(var i=0;i<filesArr.length;i++){
   				this.pptData.push(data.filePath+filesArr[i])
   			}
// 			this.pptData=data.list[0].imgList;
   			if(this.urlData.progress<100){
   				this.saveUserStudyRecord();
   			}
 		}else{
 			this.WeuiModel.showAlert("数据获取失败!",data.msg,"确定")
 		}
 	})
 }
  ionViewDidLoad() {
   this.initData();
  }

}
