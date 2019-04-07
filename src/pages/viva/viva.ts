import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams ,Slides} from 'ionic-angular';
import { commanModel } from '../../model/comman/comman';
/**
 * Generated class for the VivaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { MediaPlayerPage } from '../media-player/media-player';

@Component({
  selector: 'page-viva',
  templateUrl: 'viva.html',
})
export class VivaPage {
	@ViewChild(Slides) slides: Slides;
	pincShow:boolean=false;
	audioSrc:any="assets/imgs/read/song.ogg";
	meKnowShow:boolean=true;
	smlImgData:any=[
		{
			id:1,
			name:'chapter1_111'
		}
	];
	smlArr:any=[];
	mediaData:any={};
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
	userId:any='';
	token:any='';
	bookId:any='';
	slideData:any=[
		{
			name:"slide1111111111"
		},
		{
			name:"22222222222"
		},
		{
			name:"33333333333333"
		},
		{
			name:"4444444444444444444"
		},
	]
	isSlide:boolean=true;
  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public WeuiModel:WeuiModel,
  	public commanModel: commanModel,
  ) {
  	this.userId = this.commanModel.getGlobal("userId");
	this.token = this.commanModel.getGlobal("token");
	this.bookId = this.navParams.get("data");
  }
pinchEvent(e){
	console.log(e)
	if(this.pincShow==true){
		this.pincShow=false;
	}else{
		this.pincShow=true;
	}
	e.stopPropagation();
}
meKonwFn(){
	this.meKnowShow=false;
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
	console.log(this.smlArr)
}
slideChanged(e){
//	this.isSlide=true;
	console.log(this.isSlide)
//	this.slides.lockSwipes(true)
}
clcikSlide(){
	
	if(this.isSlide){
		this.isSlide=false;
		this.slides.lockSwipes(false);
//		this.slides.slideNext(2000)
//		this.slides.lockSwipes(true)

	}
	this.slides.slideTo(2);
}

SlideWillChange(e){
//	this.isSlide=false;
}
ionSlideDrag(e){
console.log(e)
}
initData(){
	this.slides.lockSwipes(true)
//	this.twoArr()
//	this.getBookData()
}
getBookData(){
	let loading =this.WeuiModel.showLoading("加载中...")
		this.commanModel.request("SA", "chapterList", {
			userId: this.userId,
			token: this.token,
			bookId: this.bookId,
			type: 2
		}, (data) => {
			if(data.code == 0) {
				 this.WeuiModel.hideLoading(loading)
				console.log(data)
			}
		})
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad VivaPage');
    this.initData()
  }

}
