import { Component ,ViewChild,ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';

/**
 * Generated class for the ClassPieviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { commanModel } from '../../model/comman/comman';
import { WeuiModel } from '../../model/weuiModel/weuiModel';

@Component({
  selector: 'page-class-pieview',
  templateUrl: 'class-pieview.html',
})
export class ClassPieviewPage {
@ViewChild('readaudio') readaudio: ElementRef;

tabIndex:number = 0; //当前选中的tab索引
vocabularyData:any=[]; //单词
phraseData:any=[]; //短语
sentenceData:any=[]; //句子

urlData:any;
userId:any;
token:any;
audioPath:any="assets/imgs/read/song.ogg";
audio:any;
comonear:any=["assets/imgs/read/comonear0.png","assets/imgs/read/comonear1.png","assets/imgs/read/comonear2.png","assets/imgs/read/comonear3.png",]
comonearDefult:any="assets/imgs/read/comonear.png";
selectcomonear:any;
curIndex:number=-1;
timer:any;
clearTimer:any=null;
  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public commanModel:commanModel,
  	public WeuiModel:WeuiModel,
  	public events: Events
  ) {
  		this.userId = this.commanModel.getGlobal("userId");
		this.token = this.commanModel.getGlobal("token")
  		this.urlData=this.navParams.get('data');
  		console.log(this.urlData)
  }
  
  onTabClick(idx){
  	this.tabIndex = idx;
  }
  
 loadedmetadata(e){
 	console.log("加载",e)
 }
 timeupdate(e){
 	console.log("播放中",e)
 }
audioEnd(e){
	console.log("播放结束")
	this.clearAnimation();//播放结束 停止动画
}
clickWorld(e,i){
	this.clearAnimation();
	this.curIndex=i;
	this.audioPath="https://dict.youdao.com/dictvoice?audio="+e.wordName+"&amp;type=2";
	this.audio.src=this.audioPath;
	this.audio.play();
	var start=0;
	this.timer=setInterval(()=>{
		if(start==e.comonear.length){
			start=0;
		}
		e.comonearDefult=e.comonear[start];
		start++
	},100)
}
clearAnimation(){
	clearInterval(this.timer)
	for(var i=0;i<this.vocabularyData.length;i++){
		this.vocabularyData[i].comonearDefult=this.comonearDefult;
	}
	for(var i=0;i<this.phraseData.length;i++){
		this.phraseData[i].comonearDefult=this.comonearDefult;
	}
}
initData(){ 
//let loading =this.WeuiModel.showLoading("加载中...")
	this.selectcomonear=this.comonearDefult;
	this.audio=this.readaudio.nativeElement;//获取audio
	if(this.urlData.progress!=100){
	this.clearTimer=setTimeout(()=>{
			this.saveUserStudyRecord()
		},5000)
	}
	this.commanModel.request("SA","sourceInfo",{
		userId: this.userId,
		token: this.token,
		sourceId:this.urlData.sourceId,
     	dataType:this.urlData.dataType,
	},(data)=>{
		if(data.code==0){
//			this.WeuiModel.hideLoading(loading)
			var details =data.data;
			for(var i=0;i<details.length;i++){
				details[i].comonear=this.comonear;
				details[i].comonearDefult=this.comonearDefult;
				if(details[i].wordType==1){
					this.vocabularyData.push(details[i])
				}else if(details[i].wordType==2){
					this.phraseData.push(details[i])
				}else{
					this.sentenceData.push(details[i])
				}
			}
		}else{
			this.WeuiModel.showAlert("数据获取失败!",data.msg,"确定")
		}
	})
//	this.urlData
//	this.commanModel.request("SASchool","getUserStudyRecord",{
//		userId: this.userId,
//		token: this.token,
//		seriesId:this.urlData.seriesId,
//		classId:this.urlData.classId,
//		sourceId:this.urlData.sourseId,
//	},(data)=>{
//		if(data.code==0){
//			console.log(data)
//			if(data.record.progress!=100){
//				
//			}
//		}
//	})
	
}
createUser(finish) {
  console.log('User created!')
  this.events.publish('user:created', finish, Date.now());
}
saveUserStudyRecord(){
	this.commanModel.request("SA","saveUserStudyRecord",{//保存学习进度
//		userId: this.userId,
//		token: this.token,
//		seriesId:this.urlData.seriesId,
//		classId:this.urlData.classId,
//		sourceId:this.urlData.sourseId,
//		progress:100
		userId: this.userId,
		token: this.token,
		bookId:this.urlData.bookId,
		chapterId:this.urlData.chapterId,
		sourceId:this.urlData.sourceId,
		progress:100
	},(data)=>{
		if(data.code==0){
			console.log("完成了")
			let options = {
				position: "middle",
				duration: 2000,
			}
			this.WeuiModel.showToast("完成任务",options)
			this.events.publish('taskFinish',{chapterId:this.urlData.chapterId,sourceId:this.urlData.sourceId});
		}
	})
}
  ionViewDidLoad() {
   this.initData();
  }
ionViewWillLeave(){
	clearTimeout(this.clearTimer)
}
}
