import { Component,ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams ,Events,Slides,ModalController } from 'ionic-angular';

import { WxsharePage } from '../../model/wxshare/wxshare'; //分享
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
//页面
import { BookIntroductionPage } from '../book-introduction/book-introduction';
import { ChapterDetailPage } from '../chapter-detail/chapter-detail';
import { PayPage } from '../pay/pay';

import { ReadArticlePage } from '../read-article/read-article';
import { ExercisePage } from '../exercise/exercise';
import { ClassPieviewPage } from '../class-pieview/class-pieview';
import { BilingualismPage } from '../bilingualism/bilingualism';
import { ArticleDetailPage } from '../article-detail/article-detail';
import { CourseDetailPage } from '../course-detail/course-detail';
/**
 * Generated class for the ChapterListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var $;
@Component({
	selector: 'page-chapter-list',
	templateUrl: 'chapter-list.html',
})
export class ChapterListPage {
	@ViewChild(Slides) slides: Slides;
	userId: any;
	token: any;
	capterData: any = [];
	capterListData: any = [];
	bookId: any;
	isShare:boolean=false;//当前章节是否分享过
	shareItem:any;
	hasShare:boolean=false;//是否有分享过的章节
	coverHeight:number = 130;
	//new start
	newListData:any=[{}];
	listColorArr:any=["#5bb4ba","#002d5f","#f3d718","#dc4851","#c73ec2"];
	completeProgress:number=0;
	currentChapterImg:any='';
	collect:any=0;
	progress:any=0;
	isReloadData: boolean = false;
	eventHandler: any = () => {
			this.initData();
	};
	//new end 
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public WxsharePage: WxsharePage,
		public commanModel: commanModel,
		public WeuiModel:WeuiModel,
		public events: Events,
		public modalCtrl: ModalController,
	) {
		this.userId = this.commanModel.getGlobal("userId");
		this.token = this.commanModel.getGlobal("token")
		this.bookId = this.navParams.get("data");
//		this.collect=this.navParams.get("collect");//是否收藏
		//计算cover的高度
		var screenWidth = document.body.clientWidth;
		var ratio = 750 / 416;
		this.coverHeight = screenWidth / ratio;
		events.subscribe('taskFinish', this.eventHandler);
	}
slideChange(){
		let currentIndex = this.slides.getActiveIndex();
    	if(currentIndex>=this.newListData.length){
    		currentIndex=this.newListData.length-1
    	}
    	try{
    		this.currentChapterImg=this.newListData[currentIndex].pic
    	}catch(e){
    		this.currentChapterImg=''
    	}
    	
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

unCollectionBook(){
	
}
golChapterList(e,item){//点击卡片跳转
	console.log("点击卡片跳转",e,item);
//	var data =e;
	var data={
		sourceId:e.sourceId,
		progress:e.progress,
		dataType:e.dataType,
		bookId:this.bookId,
		chapterId: item.chapterId 
	};
	switch (e.dataType){
		case 10 :// 去直播页
		
		break ;
		
		case 11 ://习题页面
		this.navCtrl.push(ExercisePage,{data:data});
		break ;
		case 12 ://录播
		this.navCtrl.push(CourseDetailPage, {id:data.sourceId, sinvideo:0});
		break ;
		case 13 ://PPT 双语译文
		this.navCtrl.push(BilingualismPage,{data:data})
		break ;
		
		case 14 ://文章详情 章节介绍 跳到公共页
		this.navCtrl.push(ArticleDetailPage,{id:data.sourceId, nolike:1})
//		if(data.progress!=100){
//			this.saveUserStudyRecord(data);
//			e.progress=100;
//		}
		break ;
		case 15 ://单词组  课前预习
		this.navCtrl.push(ClassPieviewPage,{data:data})
		break ;
		case 16 ://章节内容  阅读文章  语音讲解
		this.navCtrl.push(ReadArticlePage,{data:data})
		break ;
	}	
}
goIntroPage() {
		this.navCtrl.push(BookIntroductionPage,{data:this.bookId})
	}
goArticleDetail(){
	this.navCtrl.push(ArticleDetailPage,{imgurl:this.capterData.middlePic})
}
goExercise(){//课后习题
	this.navCtrl.push(ExercisePage)
}
goClassPieviewPage(){
	this.navCtrl.push(ClassPieviewPage)
}
goReadArticle(){
	this.navCtrl.push(ReadArticlePage)
}
	clickChapter(item, i){
		this.shareItem=item;
//		if(true){
//			this.navCtrl.push(ChapterDetailPage, {
//				data: {
//					classId: item.classId,
//					seriesId: item.seriesId,
//					name:item.name
//				}
//			})
//		}
			for(var j=0;j<this.capterListData.length;j++){
				if(this.capterListData[j].unlocks==1){
					this.hasShare=true;
					break ;
				}
			}
			if(this.hasShare==false){//没有分享过
				this.shareChapter();
				this.goChapterDetailPage(item)
			}else{
				if(item.unlocks == 0){//有分享过 不是第一次阅读 当前章节没有分享过
						this.isShare=true;
				}else{//有分享过 不是第一次阅读 当前章节分享过
					this.goChapterDetailPage(item)
				}
			}
	}
goChapterDetailPage(item){
		this.navCtrl.push(ChapterDetailPage, {
						data: {
							classId: item.classId,
							seriesId: item.seriesId,
							name:item.name
						}
		})
}
shareFn(num){ 
//	this.WxsharePage.shareWx(this.shareItem.name,this.shareItem.descs,num,"http://my.saclass.com/app/articleDetail.html?id=185",1,this.shareItem.smallPic,
		this.WxsharePage.shareWx(
			'已成功解锁章节，快来加入特优生原版阅读吧！',
			'特优生·为世界创造有用人才',
			num,
			"http://my.saclass.com/app/oreadingad.html",
			1,
			'https://my.saclass.com/share1to1/img/logo.png',
		()=>{
				this.shareChapter();
		}) 
	} 
shareChapter(){
	this.commanModel.request("OReading", "unlockChapter", {
					userId: this.userId,
					token: this.token,
					seriesId: this.shareItem.seriesId,
					classId: this.shareItem.classId,
				},(data)=>{
					if(data.code==0){
						this.hasShare=true;
						this.initData();
						this.isShare=false;
						try{
							console.log(data.msg)
						}catch(e){
							//TODO handle the exception
						}
					}
	})
}
	
noHidden(e){
	this.isShare=true;
}
hiddenShare(e){
	this.isShare=false;
}

initData() {
//		let loading =this.WeuiModel.showLoading("加载中...")
		this.commanModel.request("SA", "chapterList", {
			userId: this.userId,
			token: this.token,
			bookId: this.bookId,
			type: 1
		}, (data) => {
//			this.WeuiModel.hideLoading(loading)
			if(data.code == 0) {
				this.newListData=data.data;
				this.collect=data.collect
				console.log("this.collect=data.collect",this.collect=data.collect)
				this.capterData=data.bookInfo;
				if(this.capterData){
					this.goChapterPage(this.capterData);
				}else{
					this.WeuiModel.showAlert("未上传书籍信息","请联系管理员","","确定",()=>{
					},()=>{
						this.navCtrl.pop();
					})
				}
				try{
					this.currentChapterImg=this.newListData[0].pic
				}catch(e){
					this.currentChapterImg=''
				}
				for(var i =0;i<this.newListData.length;i++){
					if(this.newListData[i].progress==100){
						this.completeProgress++;
					}
				}
			}
		})
	}
	goChapterPage(item) {
		if(!item.goodsId){
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
			this.WeuiModel.showAlert(tipTitle,tipCon,"取消","立即购买",()=>{
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
		}	
	}
	isPay(item, success, res) {
		if(success) {
			if(res == 0) {//购买成功
				item.isBuy = 1;
				this.events.publish("book-buy-success");
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
					}else{
						this.navCtrl.pop();
					}
				})
			}
		}else{
			this.WeuiModel.showAlert("处理书籍错误",res,"确定")
		}
	}

ngOnDestroy(){
	this.events.unsubscribe('taskFinish', this.eventHandler);
}
ionViewDidEnter(){
	if(!this.isReloadData) {
			this.isReloadData = true;
		}
}
	ionViewDidLoad() {
		this.initData();
	}
	ngOnInit(){
		
	}

}