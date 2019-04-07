import { Component,ViewChild,ElementRef,ChangeDetectorRef  } from '@angular/core';
import { IonicPage, NavController, NavParams,Slides,Events,Content ,ModalController} from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the ReadArticlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { commanModel } from '../../model/comman/comman';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { PayPage } from '../pay/pay';
declare var $;
@Component({
  selector: 'page-read-article',
  templateUrl: 'read-article.html'
})
export class ReadArticlePage {
@ViewChild(Slides) slides: Slides;
@ViewChild('readaudio') readaudio: ElementRef;
@ViewChild('wordsAudio') wordsAudio: ElementRef;
@ViewChild('posCircle') posCircle: ElementRef;
@ViewChild('pointOffLeft') pointOffLeft: ElementRef;
@ViewChild('articleTxt') articleTxt: ElementRef;
@ViewChild('ionContent') ionContent: ElementRef;
@ViewChild('ionFooter') ionFooter: ElementRef;
@ViewChild(Content) content: Content;
phoneticHeight:any;
circleLeft:any=0; 
isStartMove:boolean=false; 
userId:any;
token:any;
urlData:any;
moveLeft:any;
pointLeft:any;
oldOffLeft:any;
isPlay:boolean=false;
wordAudio:any;
totalTime:any;
currentTime:any="00:00";
progressLineW:any;
leftTolerance:any=7;
worldsArr:any=[];
//articleContet:any="“I 123 555 can read that letter as well as Father can,” Parvana whispered into the folds of her chador. “Well,almost.”She didn’t dare say those words out loud. The man sitting beside her father would not want to hear her voice. Nor would anyone else in the Kabul market. Parvana was there only to help her father walk to the market and back home again after work. She sat well back on the blanket, her head and most of her face covered by her chador.She wasn’t really supposed to be outside at all. The Taliban had ordered all the girls and women in Afghanistan to stay inside their homes. They even forbade girls to go to school.Parvana had had to leave her sixth grade class,and her sister Nooria was not allowed to go to her high school.Their mother had been kicked out of her job as a writer for a Kabul radio station.For more than a year now,they had all been stuck inside one room,along with five-year-old Maryam and two-year-old Ali.Parvana did get out for a few hours most days to help her father walk.She was always glad to go outside,even though it meant sitting for hour on a blanked spread over the hard ground of the marketplace.At least it was something to I can read that letter as well as Father can,” Parvana whispered into the folds of her chador. “Well,almost.”She didn’t dare say those words out loud. The man sitting beside her father would not want to hear her voice. Nor would anyone else in the Kabul market. Parvana was there only to help her father walk to the market and back home again after work. She sat well back on the blanket, her head and most of her face covered by her chador.She wasn’t really supposed to be outside at all. The Taliban had ordered all the girls and women in Afghanistan to stay inside their homes. They even forbade girls to go to school.Parvana had had to leave her sixth grade class,and her sister Nooria was not allowed to go to her high school.Their mother had been kicked out of her job as a writer for a Kabul radio station.For more than a year now,they had all been stuck inside one room,along with five-year-old Maryam and two-year-old Ali.Parvana did get out for a few hours most days to help her father walk.She was always glad to go outside,even though it meant sitting for hour on a blanked spread over the hard ground of the marketplace.At least it was something to out loud. The man sitting beside her father would not want to hear her voice. Nor would anyone else in the Kabul market. Parvana was there only to help her father walk to the market and back home again after work. She sat well back on the blanket, her head and most of her face covered by her chador.She wasn’t really supposed to be outside at all. The Taliban had ordered all the girls and women in Afghanistan to stay inside their homes. They even forbade girls to go to school.Parvana had had to leave her sixth grade class,and her sister Nooria was not allowed to go to her high school.Their mother had been kicked out of her job as a writer for a Kabul radio station.For more than a year now,they had all been stuck inside one room,along with five-year-old Maryam and two-year-old Ali.Parvana did get out for a few hours most days to help her father walk.She was always glad to go outside,even though it meant sitting for hour on a blanked spread over the hard ground of the marketplace.At least it was something to  out loud. The man sitting beside her father would not want to hear her voice. Nor would anyone else in the Kabul market. Parvana was there only to help her father walk to the market and back home again after work. She sat well back on the blanket, her head and most of her face covered by her chador.She wasn’t really supposed to be outside at all. The Taliban had ordered all the girls and women in Afghanistan to stay inside their homes. They even forbade girls to go to school.Parvana had had to leave her sixth grade class,and her sister Nooria was not allowed to go to her high school.Their mother had been kicked out of her job as a writer for a Kabul radio station.For more than a year now,they had all been stuck inside one room,along with five-year-old Maryam and two-year-old Ali.Parvana did get out for a few hours most days to help her father walk.She was always glad to go outside,even though it meant sitting for hour on a blanked spread over the hard ground of the marketplace.At least it was something to  out loud. The man sitting beside her father would not want to hear her voice. Nor would anyone else in the Kabul market. Parvana was there only to help her father walk to the market and back home again after work. She sat well back on the blanket, her head and most of her face covered by her chador.She wasn’t really supposed to be outside at all. The Taliban had ordered all the girls and women in Afghanistan to stay inside their homes. They even forbade girls to go to school.Parvana had had to leave her sixth grade class,and her sister Nooria was not allowed to go to her high school.Their mother had been kicked out of her job as a writer for a Kabul radio station.For more than a year now,they had all been stuck inside one room,along with five-year-old Maryam and two-year-old Ali.Parvana did get out for a few hours most days to help her father walk.She was always glad to go outside,even though it meant sitting for hour on a blanked spread over the hard ground of the marketplace.At least it was something to  out loud. The man sitting beside her father would not want to hear her voice. Nor would anyone else in the Kabul market. Parvana was there only to help her father walk to the market and back home again after work. She sat well back on the blanket, her head and most of her face covered by her chador.She wasn’t really supposed to be outside at all. The Taliban had ordered all the girls and women in Afghanistan to stay inside their homes. They even forbade girls to go to school.Parvana had had to leave her sixth grade class,and her sister Nooria was not allowed to go to her high school.Their mother had been kicked out of her job as a writer for a Kabul radio station.For more than a year now,they had all been stuck inside one room,along with five-year-old Maryam and two-year-old Ali.Parvana did get out for a few hours most days to help her father walk.She was always glad to go outside,even though it meant sitting for hour on a blanked spread over the hard ground of the marketplace.At least it was something to  out loud. The man sitting beside her father would not want to hear her voice. Nor would anyone else in the Kabul market. Parvana was there only to help her father walk to the market and back home again after work. She sat well back on the blanket, her head and most of her face covered by her chador.She wasn’t really supposed to be outside at all. The Taliban had ordered all the girls and women in Afghanistan to stay inside their homes. They even forbade girls to go to school.Parvana had had to leave her sixth grade class,and her sister Nooria was not allowed to go to her high school.Their mother had been kicked out of her job as a writer for a Kabul radio station.For more than a year now,they had all been stuck inside one room,along with five-year-old Maryam and two-year-old Ali.Parvana did get out for a few hours most days to help her father walk.She was always glad to go outside,even though it meant sitting for hour on a blanked spread over the hard ground of the marketplace.At least it was something to   ";
articleContet:any="No Article !";
newArticleCon:any=''
textnewArticleCon:any=''
articleItemArr:any=[];
selectWord:any;//选择的单词
wordPhonetic:any;//单词读音
phoneticSrc:any;//读音链接
partOfSpeech:any;//词性
phoneticShow:boolean=false;
contentHeight:any;//内容高度
contentWidth:any;//内容宽度
totalContentHeight:any;
isMove:boolean=false;
audioPath:any="assets/imgs/read/song.ogg";
haveAudioPath:boolean=true;
//assets/imgs/read/song.ogg
curIndex:any=1;
comonear:any=["assets/imgs/read/comonear0.png","assets/imgs/read/comonear1.png","assets/imgs/read/comonear2.png","assets/imgs/read/comonear3.png",]
comonearDefult:any="assets/imgs/read/comonear.png";
wordAnimationImg:any;
newWord:any;
timer:any;
tiptimer:any = -1;
progress:any;
bookId:any;
startNum:number=0;
endNum:number=0;
readTipShow:boolean=true;
question:any='';
type:any=1;
collect:any=0;
dataType:any=16;
pincShow:boolean=false;
curChapterIndex:number=0;
isFinishVideo:boolean=true;
worldsTxt:any;
hiddenDom:boolean=false;
smlImgData:any=[
		{
			id:1,
			name:'chapter1_111'
		},
	];
smlArr:any=[];
meKnowShow:boolean=true;
pptData:any=[];
saveUrlData:any={};
isLoadTrue:boolean=false;
isCanPlayer:boolean=false;
chapterIcon:any=[
	"assets/imgs/read/chapter_icon_01.png",
	"assets/imgs/read/chapter_icon_02.png",
	"assets/imgs/read/chapter_icon_03.png",
	"assets/imgs/read/chapter_icon_04.png",
	"assets/imgs/read/chapter_icon_05.png",
	"assets/imgs/read/chapter_icon_06.png",
	"assets/imgs/read/chapter_icon_07.png",
	"assets/imgs/read/chapter_icon_08.png",
	"assets/imgs/read/chapter_icon_09.png",
	"assets/imgs/read/chapter_icon_10.png",
	"assets/imgs/read/chapter_icon_11.png",
	"assets/imgs/read/chapter_icon_12.png",
	"assets/imgs/read/chapter_icon_13.png",
	"assets/imgs/read/chapter_icon_14.png",
	"assets/imgs/read/chapter_icon_15.png",
	"assets/imgs/read/chapter_icon_16.png",
	"assets/imgs/read/chapter_icon_17.png",
	"assets/imgs/read/chapter_icon_18.png",
	"assets/imgs/read/chapter_icon_19.png",
	"assets/imgs/read/chapter_icon_20.png"
	];
  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public commanModel:commanModel,
  	public events: Events,
  	public WeuiModel:WeuiModel,
  	private imgViewer:ImageViewerController,
  	private storage: Storage,
  	public cd: ChangeDetectorRef,
  	public modalCtrl: ModalController,
  ) {
  	this.userId=this.commanModel.getGlobal("userId");
  	this.token=this.commanModel.getGlobal("token");
  	this.type=this.navParams.get('type');
  	console.log("type",this.type)
  	
  	if(this.type==2){
  		this.bookId=this.navParams.get('data')
  		console.log("畅读书本ID",this.bookId)
  	}else{
  		this.urlData=this.navParams.get('data');
  		console.log("精读数据",this.urlData)
  	}
  }
  voiceClick(){
  	
  	if(this.isCanPlayer){
  		if(this.isPlay==true){//暂停播放
	  		this.isPlay=false
	  		this.readaudio.nativeElement.pause()
	  	}else{//开始播放
	  		this.isPlay=true	
	  		this.readaudio.nativeElement.play();
	  	}
  	}
  }
  audioEnd(){//语音播放结束
  	this.isPlay=false;
  }
  onLoadStart(){
  	this.isCanPlayer=false;
  }
  oncanplay(e){
  	this.isCanPlayer=true;
  	this.readaudio.nativeElement.pause();
  	console.log(this.isCanPlayer)
  }
  startFn(e){
//	console.log("移动开始:::",e)
  	this.isStartMove=true;
  }
  moveFn(e){
  	if(this.isStartMove&&this.isCanPlayer){
//		console.log("移动中:::",e)
		this.isMove=true;
  		this.oldOffLeft=this.pointOffLeft.nativeElement.offsetLeft;
  		if(this.pointLeft==null||this.pointLeft==undefined){
  			this.pointLeft=e.changedTouches[0].clientX;
  		}else{
  			var moveLeft=e.changedTouches[0].clientX;
	  		var offX=moveLeft-this.pointLeft;
	  		this.circleLeft=this.oldOffLeft+offX;
	  		this.pointLeft=moveLeft;
	  		if(this.circleLeft<=0){
	  			this.circleLeft=0
	  		}
	  		if(this.circleLeft>(this.progressLineW-this.leftTolerance)){
	  			this.circleLeft=this.progressLineW-this.leftTolerance
	  		}
	  		this.currentTime=this.formateDate(this.readaudio.nativeElement.duration*(this.circleLeft/(this.progressLineW-this.leftTolerance)));
  		}
  	}
  }
  endFn(e){//console.log("移动结束:::",e)
  		this.isStartMove=false;
  		this.pointLeft=null;
  		if(this.isMove==true){
  			this.isMove=false;
  			this.readaudio.nativeElement.currentTime=this.readaudio.nativeElement.duration*(this.circleLeft/(this.progressLineW-this.leftTolerance))
  		this.currentTime=this.formateDate(this.readaudio.nativeElement.duration*(this.circleLeft/(this.progressLineW-this.leftTolerance)));
  		}
  }
  loadedmetadata(){
	 console.log('phoneticHeight#####',this.phoneticHeight)
	try{
		this.totalTime=this.formateDate(this.readaudio.nativeElement.duration)
	}catch(e){
		//TODO handle the exception
	}
  }
  timeupdate(e){
  	if(!this.isStartMove){
  		this.currentTime=this.formateDate(e.target.currentTime);
  		console.log(this.currentTime)
  		this.circleLeft=(this.progressLineW-this.leftTolerance)*(e.target.currentTime/e.target.duration)
  	}
  	try{
  		if((e.target.currentTime/this.readaudio.nativeElement.duration)>=0.9&&this.saveUrlData.progress!=100){
  			
  			if(this.isFinishVideo){
  				this.saveUserStudyRecord();
  			}
  		}
  	}catch(e){
  		console.log(e)
  	}
  	
  }
  startRead(e){
  	this.readTipShow=false;
  	e.stopPropagation();
  }
 meKonwFn(e){
 	console.log(e)
	this.meKnowShow=false;
	e.stopPropagation();
}
  saveUserStudyRecord(ppt?){
	this.commanModel.request("SA","saveUserStudyRecord",{//保存学习进度
			userId: this.userId,
			token: this.token,
			bookId:this.saveUrlData.bookId,
			chapterId:this.saveUrlData.chapterId,
			sourceId:this.saveUrlData.sourceId,
			progress:100
	},(data)=>{
		if(data.code==0){
//			this.urlData.progress=100;
			console.log("完成了")
			let options = {
				position: "middle",
				duration: 2000,
			}
			if(ppt){
				this.tiptimer = setTimeout(()=>{
					this.WeuiModel.showToast("完成任务!",{position:"middle"})
					}, 2000);
				}else{
					this.isFinishVideo=false;
					this.WeuiModel.showToast("完成任务",options)
				}
			this.events.publish('taskFinish',{chapterId:this.saveUrlData.chapterId,sourceId:this.saveUrlData.sourceId,type:this.type});
		}
	})
}
 twoArr(){
	var numArr=Math.ceil(this.smlImgData.length/3);
	this.smlArr=[];
	var num =0;
	for(var i=0;i<numArr;i++){
		this.smlArr[i]=[];
		for(var j=0;j<3;j++){
			if(this.smlImgData[num]==undefined){
				this.smlArr[i][j]={	
						id:-10086,
						name:"##@@##"
					}
				continue 
			}
			this.smlArr[i][j]=this.smlImgData[num];
			num ++;
		}
	}
	console.log("this.smlArrthis.smlArr",this.smlArr)
}
  formateDate(min:number){
	min=Math.round(min);
	var m =parseInt(min/60+"");
	var s=parseInt(min-m*60+"");
	var mins ;
	var str;
	if(m<1){
		mins ="00"
	}else{
		mins =m;
	}
	if(s<10){
		str="0"+s;
	}else{
		str=s;
	};
	return mins+':'+str;
}
  slideChanged(){
  	console.log(this.slides.getActiveIndex())
  	console.log(this.slides.isEnd())
	if(this.slides.isEnd()){
		this.curIndex=this.slides.length()
	}else{
		this.curIndex=this.slides.getActiveIndex()+1
	}
 }
  getElementPageLeft(element){//获取元素距离文档的X轴偏移量
  	 var actualLeft=element.offsetLeft;
     var parent=element.offsetParent;
        while(parent!=null){
            actualLeft+=parent.offsetLeft+(parent.offsetWidth-parent.clientWidth)/2;
            parent=parent.offsetParent;
        }
        return actualLeft;
  }
  execWorlds(){
// var re =/[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\“|\”|\’|\‘|\。]|\w+|\s+/g;
   var re =/\w+’\w+|\w+|\W+/g;
   var arr;
// while ((arr = re.exec(this.articleContet)) != null) 
//    {
//    this.worldsArr.push(arr[0])
//    }
     this.worldsArr=this.articleContet.match(re);
       console.log("this.articleContet.match(pat) ",this.worldsArr)
  }
  worldsClickFn(e){
  	var re =/\w+’\w+|\w+/g;
  	if(re.test(e)){
  		console.log(e)
  		this.phoneticShow=true;
	  	this.YouDaoTrans(e,(data)=>{
	  		console.log(data)
	  		//selectWord:any;//选择的单词
			//wordPhonetic:any;//单词读音
			//phoneticSrc:any;//读音链接
			this.wordAudio=this.wordsAudio.nativeElement;
			this.selectWord=e;
			try{
				this.wordPhonetic=data.basic.phonetic;
				this.phoneticSrc="https://dict.youdao.com/dictvoice?audio="+e+"&amp;type=2";
				this.partOfSpeech=data.basic.explains
			}catch(e){
				console.log("error:",e)
				this.wordPhonetic="-";
				this.partOfSpeech=data.translation
				this.phoneticSrc="https://dict.youdao.com/dictvoice?audio="+e+"&amp;type=2";
			}
			
	  	})
  	}

  }
  wordPlay(){
  	this.wordsAudio.nativeElement.src=this.phoneticSrc;
	this.wordsAudio.nativeElement.play();
	clearInterval(this.timer);
	this.endNum=this.startNum=0;
	if(this.startNum==this.endNum){
		this.endNum=-1;
	  	this.timer=setInterval(()=>{
	  		if(this.startNum==this.comonear.length){
	  			this.startNum=0;
	  		}
	  		this.wordAnimationImg=this.comonear[this.startNum];
	  		this.startNum++
	  	},200)
	}
  }
  wordAudioEnd(e){
	clearInterval(this.timer);
  	this.endNum=this.startNum=0;
  	this.wordAnimationImg=this.comonearDefult
  }
  closePhonetic(){
  	this.phoneticShow=false;
  }
//'https://dict.youdao.com/dictvoice?audio="+str+"&amp;type=2'  //语音
  YouDaoTrans(q, success?, error?){
  	$.ajax({
      type: "get",
      async: false,
      url: "http://fanyi.youdao.com/openapi.do?keyfrom=SpecialAOnline&key=1616095035&type=data&doctype=jsonp&version=1.1&q="+q,
      dataType: "jsonp",
      jsonpCallback:"callback",
      success: (json)=>{
        switch(json.errorCode){
          case 0:
            if(success!=undefined){
              success(json);
            }
            break;
          case 20:
            if(error!=undefined){
              error("要翻译的文本过长");
            }
            break;
          case 30:
            if(error!=undefined){
              error("无法进行有效的翻译");
            }
            break;
          case 40:
            if(error!=undefined){
              error("不支持的语言类型");
            }
            break;
          case 50:
            if(error!=undefined){
              error("无效的key");
            }
            break;
          case 60:
            if(error!=undefined){
              error("无词典结果，仅在获取词典结果生效");
            }
            break;
          default:
            if(error!=undefined){
              error("未知错误");
            }
            break;
        }
      },
      error: function(){
        if(error!=undefined){
          error("数据加载失败");
        }
      }
    });
  }
  newTxtFn(){

	var re =/<[^>]+>|&nbsp;|[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\“|\”|\’|\‘|\。]|\w+’\w+|\w+'\w+|\w+|\s+/g;
	var textRe=/<[^>]+>/;
	var nbsp=/&nbsp;/
 	var txtArr=[]
 	var newTxtArr=''
		txtArr=this.newArticleCon.match(re)
 	console.log("txtArr ",txtArr)
 	for(var i=0;i<txtArr.length;i++){
		if(nbsp.test(txtArr[i])){
			txtArr[i]=txtArr[i].replace(nbsp," ")
		}
 		if(textRe.test(txtArr[i])){
 			newTxtArr+=txtArr[i]
 		}else{
 			newTxtArr+='<span class="every_world">'+txtArr[i]+'</span>'
 		}
 	}
 	this.newArticleCon=newTxtArr;
  }
 initData(){
 	this.wordAnimationImg=this.comonearDefult;
// 	this.isShowTipCover();
 	if(this.type==2){
   		this.getBookData(this.bookId)//畅读获取详细信息
 	}else{
 		this.getInfo(this.urlData.sourceId,this.urlData.dataType)//精读获取详细信息
 	}
 }
 getInfo(sourceId,dataType){
 		this.dataType=dataType;
// 		let loading = this.WeuiModel.showLoading("加载中...")
 	    this.commanModel.request("SA","sourceInfo",{
	  	userId:this.userId,
	  	token:this.token,
     	sourceId:sourceId,
     	dataType:dataType,
     },(data)=>{
//   	this.WeuiModel.hideLoading(loading)
     	if(data.code==0){
     		this.audioPath="1"
     		console.log("书本详细信息",data)
     		if(this.type==2){
		  		this.saveUrlData={
		  			bookId:this.bookId,
		  			chapterId:this.smlImgData[this.curChapterIndex].chapterId,
		  			sourceId:this.smlImgData[this.curChapterIndex].source[0].sourceId,
		  			progress:this.smlImgData[this.curChapterIndex].source[0].progress,
		  			dataType:this.smlImgData[this.curChapterIndex].source[0].dataType,
		  		}
		  	}else{
		  		this.saveUrlData=this.urlData
		  	}
		  	console.log("saveUrlDatasaveUrlData&&&&&&&&",this.saveUrlData)
     		if(dataType==16){
     			this.newArticleCon=data.data[0].content;
	     		this.articleContet=data.data[0].content;
	     		if(data.data[0].audioPath){
	     			this.audioPath=data.filePath+data.data[0].audioPath;
	     			this.readaudio.nativeElement.src=this.audioPath;
	     			this.readaudio.nativeElement.play();

	     			
	     		}
	     		this.question=data.data[0].question;
			     this.totalContentHeight=this.articleTxt.nativeElement.offsetHeight;
			     this.execWorlds();
			     this.newTxtFn();
     		}else{
     			this.pptData=[];
     			this.phoneticShow=false;
     			var getData=data.data[0];
				var filesArr=getData.files.split(',')
				if(getData.audioPath){
					this.audioPath=data.filePath+getData.audioPath
					this.readaudio.nativeElement.src=this.audioPath;
	     			this.readaudio.nativeElement.play();

				}
	   			for(var i=0;i<filesArr.length;i++){
	   				this.pptData.push(data.filePath+filesArr[i])
	   			}
	   			if(this.saveUrlData.progress!=100){
	   				this.saveUserStudyRecord('ppt')
	   			}
	   			 console.log(13,'this.audioPath',this.audioPath)
     		}
     		if(this.audioPath&&this.audioPath!='1'){
     				this.haveAudioPath=true;
     				$('.scroll-content').css('margin-bottom',this.navCtrl.parent._tabbar.nativeElement.clientHeight)
     				this.phoneticHeight=this.navCtrl.parent._tabbar.nativeElement.clientHeight
					try{
//						this.audio=this.readaudio.nativeElement;//获取audio
						
		     			this.oldOffLeft=this.pointOffLeft.nativeElement.offsetLeft;
						this.progressLineW=this.posCircle.nativeElement.offsetWidth;
					}catch(e){
						//TODO handle the exception
					}
		 	}else{
		 		this.haveAudioPath=false;
		 		this.phoneticHeight=0
//		 		this.content._elementRef.nativeElement.style.marginBottom=0
		 		$('.scroll-content').css('margin-bottom',0)
		 	}
     		 console.log('phoneticHeight',this.phoneticHeight)
     	}else{
     		this.WeuiModel.showAlert("数据获取失败!",data.msg,"确定")
     	}
     })
 }

  presentImage(myImage) {
	const imageViewer = this.imgViewer.create(myImage, {enableBackdropDismiss:true});
	imageViewer.present();
  }
 addNewWord(){
var str=this.partOfSpeech.join()
console.log(str)
  	 this.commanModel.request("OReading","addUserWords",{
  	 	userId: this.userId,
		token: this.token,
		name:this.selectWord,
		wordZh:str,
		pronounce:this.wordPhonetic,
		audioUrl:this.phoneticSrc
  	 },(data)=>{
  	 	let options = {
				position: "middle",
				duration: 2000,
				}
  	 	if(data.code==0){
  	 		console.log(data)
  	 		this.WeuiModel.showToast("添加成功!",options)
  	 	}else{
//	 		showAlert(title: string, content: string, cancelTxt ? : string, confirmTxt ? : string, clearback ? , callback ? )
  	 		this.WeuiModel.showAlert("添加失败!",data.msg,'',"确定")
  	 	}
  	 })
  }
  getBookData(bookId){//进入畅读  只有畅读才会走这里.
		this.commanModel.request("SA", "chapterList", {
			userId: this.userId,
			token: this.token,
			bookId:bookId,
			type: 2
		}, (data) => {
			if(data.code == 0) {
				this.smlImgData=data.data;
				this.collect=data.collect;
				this.twoArr();
				console.log("this.smlImgData::::",this.smlImgData)
//				this.goChapterPage(data.bookInfo)
				if(data.bookInfo){
					this.goChapterPage(data.bookInfo)
				}else{
					this.WeuiModel.showAlert("未上传书籍信息","请联系管理员","","确定",()=>{
					},()=>{
						this.navCtrl.pop();
					})
				}
			}
		})
}
  isLoadInfo(){
  	this.storage.get('curChapterIndex').then((val) => {
			    	console.log('本地缓存的索引', val);
			    	if(val!=null||val){
			    		this.curChapterIndex=val
				    	
			    	}else{
			    		this.curChapterIndex=0
			    	}
			    	if(this.smlImgData.length>0){
			    			var sourceId=this.smlImgData[this.curChapterIndex].source[0].sourceId;
							var dataType=this.smlImgData[this.curChapterIndex].source[0].dataType;
							this.getInfo(sourceId,dataType);
			    	}
			 	});
  }
 goChapterPage(item) {
		if(item.goodsId==undefined){
				this.WeuiModel.showAlert("未关联商品ID",'请联系管理员',"确定")
				return ;
			}
		if(item.isBuy!=1){
				var tipTitle="书籍尚未购买" 
				var tipCon="亲,买一本吧~"
				if(item.price<=0){
					tipTitle="免费书籍";
					tipCon="是否立即开始阅读";
				}
				this.WeuiModel.showAlert(tipTitle,tipCon,"取消","确定",()=>{
				this.navCtrl.pop();
			},()=>{
				if(item.isBuy == -1) { //；isBuy：-1未购买；0：待支付；1：已支付
					this.commanModel.buyBook(item.goodsId, item.bookId, item.bookName, item.thumb, (success, res) => {
					this.isPay(item, success, res);
					})
				} else if(item.isBuy == 0) { //待支付
					this.commanModel.realPay(item.orderNumber, (success, res) => {
						this.isPay(item, success, res);
					})
				}
			})
		}else{
			this.isLoadInfo()
		}
	}
	isPay(item, success, res) {
		if(success) {
			if(res == 0) {//0元购买成功
				item.isBuy = 1;
				this.events.publish("book-buy-success");
				this.isLoadInfo()
			} else {
				item.isBuy = 0;
				item.orderNumber = res;
				let payModalCtrl = this.modalCtrl.create(PayPage, {
					orderNumber: res
				});
				payModalCtrl.present();
				payModalCtrl.onDidDismiss((data) => {
					if(data.success) {
						item.isBuy = 1;
						this.events.publish("book-buy-success");
						this.isLoadInfo()
					}else{
						this.navCtrl.pop();
					}
				})
			}
		}else{
			this.WeuiModel.showAlert("处理书籍错误",res,"确定")
		}
	}
isShowTipCover(){
	if(this.smlImgData.length>1){
		this.storage.get('meKnowShow').then((val) => {
			    if(val!=null){
			    	this.meKnowShow=false;
			    }else{
			    	this.storage.set('meKnowShow', 'true');
			    }
		});
	}else{
		this.meKnowShow=false;
	}
	
}
  getChapterInfo(item,index,e){
  	e.stopPropagation();
  	console.log(item,index)
  	this.pincShow=false;
  	this.isPlay=false;
  	this.curChapterIndex=index;
  	this.getInfo(item.source[0].sourceId,item.source[0].dataType)//精读获取详细信息
  }
  pinchEvent(e){
	if(this.pincShow==true){
		this.pincShow=false;
	}else{
		this.pincShow=true;
	}
	e.stopPropagation();
}
  collectionBook(){
		
		if(this.collect==0){//收藏书籍
			this.commanModel.request("SA", "collectBook", {
				userId: this.userId,
				token: this.token,
				bookId: this.bookId
			}, (data) => {
				if(data.code == 0) {
					this.WeuiModel.showToast(data.msg)
					this.collect=1;
					this.events.publish('collectionBook',true);
				}
			})
		}else{//取消收藏
			this.commanModel.request("SA", "unCollectBook", {
				userId: this.userId,
				token: this.token,
				bookId: this.bookId
				}, (data) => {
					if(data.code == 0) {
						this.WeuiModel.showToast(data.msg)
						this.collect=0;
						this.events.publish('collectionBook',false);
					}
			})	
		}
}
  changeChapter(i){//上下章节切换
  	this.isPlay=false;
  	let options = {
				position: "middle",
				duration: 2000,
			}
  	if(i==1){//上一章
  		this.curChapterIndex--
  		if(this.curChapterIndex<0){
  			this.curChapterIndex=0
  			this.WeuiModel.showToast("已经是第一章!",options)
  			return false;
  		}
  	}else{//下一章
  		this.curChapterIndex++;
  		if(this.curChapterIndex>=this.smlImgData.length){
  			this.curChapterIndex=this.smlImgData.length-1;
  			this.WeuiModel.showToast("已经是最后一章!",options)
  			return false;
  		}
  	}
  	var sourceId=this.smlImgData[this.curChapterIndex].source[0].sourceId;
	var dataType=this.smlImgData[this.curChapterIndex].source[0].dataType;
  	this.getInfo(sourceId,dataType)
  }

  worldClickFn(){
  	$('.every_world').off("click").on("click",(e)=>{
		console.log("点击单词")
		e.stopPropagation();
		this.endNum=this.startNum;
		var txt =e.target.innerText;
		clearInterval(this.timer)
		this.timer=null;
  		this.wordAnimationImg=this.comonearDefult
	var re =/\w+’\w+|\w+'\w+|\w+/g;
  	if(re.test(txt)){
  		console.log(txt)
  		this.worldsTxt=txt;
  		this.phoneticShow=true;
	  	this.YouDaoTrans(txt,(data)=>{
	  		
	  		console.log(data)
	  		//selectWord:any;//选择的单词
			//wordPhonetic:any;//单词读音
			//phoneticSrc:any;//读音链接
			this.wordAudio=this.wordsAudio.nativeElement;
			this.selectWord=txt;
				try{
					this.wordPhonetic=data.basic.phonetic;
					this.phoneticSrc="https://dict.youdao.com/dictvoice?audio="+txt+"&amp;type=2";
					this.partOfSpeech=data.basic.explains
				}catch(e){
					
					this.wordPhonetic="-";
					this.partOfSpeech=data.translation
					this.phoneticSrc="https://dict.youdao.com/dictvoice?audio="+txt+"&amp;type=2";		
				}   
	  	})
  	}
	})
  }
  
ngAfterContentChecked(){
	this.worldClickFn()
	this.cd.detectChanges();
}
ngAfterViewInit(){
	this.worldClickFn()
}
  ionViewDidLoad() {
	this.initData()
  }
  ionViewDidEnter(){
//	this.worldClickFn()
 }
 ionViewWillLeave(){
 	
 	if(this.type!=2){
 		$('.scroll-content').css('margin-bottom',0)
 	}else{
 		$('.scroll-content').css('margin-bottom',this.navCtrl.parent._tabbar.nativeElement.clientHeight)
 	}
 	this.phoneticShow=false;
 	this.storage.set('curChapterIndex', this.curChapterIndex);
 	if(this.tiptimer!=-1){
			clearTimeout(this.tiptimer);
			this.tiptimer = -1;
	}
 }
oldFn(){//旧版分页
	var wordWidth=0;
	var totalH=$(".hideContentHeight").height();
	console.log(" totalH ",totalH)
	var totalPage=Math.ceil(totalH/(this.contentHeight));
	console.log( "totalPage",totalPage)
	var _wordW=$('.wordWidth')
	var everPageH;
	for(var i=0;i<totalPage;i++){
		this.articleItemArr[i]=[]
	}
	everPageH=Math.floor((this.contentHeight)/22);//每页有多少行
	for(var i=0;i<_wordW.length;i++){
		wordWidth+=_wordW.eq(i).width()
	}
	var k=0;
	var evW=0;
	for(var i=0;i<this.articleItemArr.length;i++){
		for(var j=0;j<everPageH;j++){
			for(k;k<this.worldsArr.length;k++){
				evW+=_wordW.eq(k).outerWidth(true);
				if(_wordW.eq(k).width()==0||_wordW.eq(k).width()==undefined||_wordW.eq(k).width()==null){
				}
				if(evW>this.contentWidth){
					evW=0;
					break ;
				}
				this.articleItemArr[i].push(this.worldsArr[k]);
			}
		}
	}
}
}
