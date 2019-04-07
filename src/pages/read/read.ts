import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController, Platform, ItemSliding ,Slides, App} from 'ionic-angular';
import { commanModel } from '../../model/comman/comman';
import { Storage } from '@ionic/storage';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { ChapterListPage } from '../chapter-list/chapter-list';
import { LoginModal } from '../modal-login/modal-login';
import { ReadArticlePage } from '../read-article/read-article';

import { NewThingsPage } from '../new-things/new-things';
import { PayPage } from '../pay/pay';

declare var $;
/**
 * Generated class for the ReadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-read',
	templateUrl: 'read.html',
})
export class ReadPage {
	@ViewChild('zoneHeight') zoneHeight: ElementRef;
	@ViewChild(Slides) slides: Slides;
	userId: any;
	token: any;
	latestStudy: any = { //最近阅读进度..
		bigPic: "",
		isFinish: "",
		level: "",
		middlePic: 0,
		name: "",
		process: "",
		seriesId: "",
		smallPic: "",
		updateName: ""
	};
	updateingData: any = []; //更新中..
	finishData: any = []; //已完结..
	firstLoadedData: boolean = false;

	scrollPoint: any = "false";
	newBookData: any = [];
	isStart: boolean = false;
	startOffX: number = 0;
	bindHeight: any = '';
	initBindHeight: any = '';
	startContHeight: any = '';
	contAddHeight: number = 0;
	contReduceHeight: number = 0;
	currentStyles: {};
	pointDirection: boolean = true;
	readItem: any = [];
	readTitle: number = 0;
	isBottom: boolean = false;
	bookType: any = [];
	selBookIndex: number = -1;
	intenSmlArr: any = [];
	vivaSmlArr: any = [];
	readData: any = [];
	isEdit: boolean = false;
	bottomHeight: any = 0;
	isSelectAll: boolean = false;
	selectTotalNum: number = 0;
	cateId:any=0;
	delMyBookId:any=[];
	allContentHeight:any;
	drapHotZoneHeight:any;
	jReadItem:any;
	isInitTags:boolean=true;
	eventHandler: any = () => {
		this.firstLoadedData = false;
	};

	constructor(
		public navCtrl: NavController,
		private plt: Platform,
		public navParams: NavParams,
		public commanModel: commanModel,
		public events: Events,
		public WeuiModel: WeuiModel,
		public modalCtrl: ModalController,
		private storage: Storage,
		private app: App
	) {
		//监听任务完成事件，TODO 换个事件名称吧
		events.subscribe('user:created', (data, time) => {
			if(data == "finish") {

			}
		});
		events.subscribe('collectionBook', (data) => {
			this.getBookList();
		});
		events.subscribe('taskFinish', (data) => {
			this.myReadProgress();
		});
		var cid =this.commanModel.getGlobal("home_cateId");
		if(cid!=undefined){
			this.cateId=cid;
		}
		this.events.subscribe("home_cateid_change",(data)=>{
			this.cateId=data;
			if(this.firstLoadedData){
				this.selBookIndex=this.cateId;
				this.getBookList(this.cateId)
				
			}
		})
		//监听书籍购买成功事件
		this.events.subscribe("book-buy-success", ()=>{
			var isActive = this.app.getActiveNav().getActive().name=="ReadPage";
			if(!isActive){
				this.getBookList();
				this.myReadProgress();
			}
		})
	}
	startFn(e) {
		this.isStart = true;
	}
	moveFn(e) {
		if(!this.jReadItem){
			this.jReadItem=190
		}
		if(this.userId){
			this.bindHeight = this.zoneHeight.nativeElement.offsetHeight; //实时获取父盒子的高度
		if(this.isStart == true) { //判断移动触发点 是不是在热区上触发
			if(this.startContHeight == '') { //不是首次触发  等于空 为首次触发
				this.startContHeight = e.changedTouches[0].clientY; //首次触发 当前触发点的 Y轴偏移量
			} else {
				var moveHeight = e.changedTouches[0].clientY;
				var offY = moveHeight - this.startContHeight; //计算每次移动的偏移量
				this.scrollPoint = "false"
				this.bindHeight = this.bindHeight + offY; //父元素的高度增加量  就是拖拽的距离
				this.startContHeight = moveHeight;
				if(offY > 0) { // offY 大于0 则是向下拖拽
					this.pointDirection = true; // 向下拖拽 pointDirection 为true
					this.contAddHeight += offY; //计算总的拖拽距离
					if(this.contAddHeight >= 50) { //当向下拖拽距离大于50像素的时候 :
						this.contReduceHeight = 0;
						this.bindHeight = this.allContentHeight-this.jReadItem-this.readTitle-this.drapHotZoneHeight;
						this.currentStyles = {
							'height': this.bindHeight + 'px',
							'transition': 'height .5s',
							'overflow': 'auto'
						}
						this.isBottom = true;
						$('#book_base').animate({
							"scrollTop": 0
						}, 30)
						return;
					}
				} else {
					if(this.bindHeight <= this.initBindHeight) {
						return;
					}
					this.pointDirection = false;
					this.contReduceHeight += offY;

					if(this.contReduceHeight <= -50) {
						this.contAddHeight = 0;
						this.bindHeight = this.initBindHeight;
						this.currentStyles = {
							'height': this.bindHeight + 'px',
							'transition': 'height .5s',
							'overflow': 'hidden'
						}
						this.isBottom = false;
						this.isEdit = false;
						$('#zoneHeight').animate({
							"scrollTop": 0
						}, 30)
						return;
					}
				}
				this.currentStyles = {
					'height': this.bindHeight + 'px'
				}
			}
		}
		}
		

	}
	endFn(e) {
		if(this.isStart) { //这里不加判断会有bug 
			this.isStart = false;
			this.startContHeight = ''
			this.scrollPoint = "false";
			if(this.pointDirection) {
				if(this.contAddHeight < 50) {
					this.contAddHeight = 0;
					this.currentStyles = {
						'height': this.initBindHeight + 'px',
						'transition': 'height .5s',
						'overflow': 'hidden'
					}
					this.isBottom = false;
					this.isEdit = false;
					$('#zoneHeight').animate({
						"scrollTop": 0
					}, 30)

				}
			} else {
				if(this.contReduceHeight >= -50) {
					this.contReduceHeight = 0;
					this.currentStyles = {
						'height': this.allContentHeight-this.jReadItem-this.readTitle-this.drapHotZoneHeight + 'px',
						'transition': 'height .5s',
						'overflow': 'auto'
					}
					$('#book_base').animate({
							"scrollTop": 0
						}, 30)
					this.isBottom = true;
				}
			}
		}
	}
	computeHeight() {
		if(this.newBookData.length > 3) { // 当阅读进度中书本数量大于3的时候 :
			this.bindHeight = this.allContentHeight-this.jReadItem-this.readTitle-this.drapHotZoneHeight;
		} else if(this.newBookData.length == 1 || this.newBookData.length == 0) { // 当阅读进度中书本数量大于3的时候 :
			this.bindHeight = this.initBindHeight;
			this.currentStyles = {
				'height': this.bindHeight + 'px',
				'transition': 'height .5s',
				'overflow': 'hidden'
			}
			this.isBottom = false;
			return;
		} else if(this.newBookData.length == 2) {
			this.bindHeight = this.initBindHeight * 2;
		}
		this.currentStyles = {
			'height': this.bindHeight + 'px',
			'transition': 'height .5s',
			'overflow': 'auto'
		}
		this.isBottom = true;
	}
	selBookType(i, item) {
//		this.isInitTags=false;
		if(item.id){
			this.selBookIndex = item.id
		}else{
			this.selBookIndex=i
		}
		if(this.cateId){
			this.cateId=this.selBookIndex
		}
		if(item == -1) {
			this.getBookList()
		} else {
			this.getBookList(item.id)
		}
	}
getBookData(bookId){//进入畅读
//	let loading =this.WeuiModel.showLoading("加载中...")
		this.commanModel.request("SA", "chapterList", {
			userId: this.userId,
			token: this.token,
			bookId:bookId,
			type: 2
		}, (data) => {
//			 this.WeuiModel.hideLoading(loading)
			if(data.code == 0) {
				
			}
		})
}
	goChapterListPage(item,e){
		console.log("itemitem",item)
		if(this.isEdit){
			return false ;
		}
		if(item.type==1){
			this.navCtrl.push(ChapterListPage, {data: item.bookId,collect:item.collect})
		}else{
			this.navCtrl.push(ReadArticlePage, {data: item.bookId,type:2})
		}
	}
	goChapterPage(item) {
		console.log("itemitemaaa",item)
		if(this.userId == null || this.userId == undefined || this.userId == "") {
			let loginModalCtrl = this.modalCtrl.create(LoginModal, {});
			loginModalCtrl.present();
			loginModalCtrl.onDidDismiss((data) => {
				if(data.isLogin) {
					this.initData();
				}
			})
		} else {
			if(!item.goodsId){
				this.WeuiModel.showAlert("未关联商品ID",'请联系管理员',"确定")
				return ;
			}
			if(item.isBuy == -1) { //；isBuy：-1未购买；0：待支付；1：已支付
				let loading = this.WeuiModel.showLoading('获取书籍信息');
				this.commanModel.buyBook(item.goodsId, item.id, item.name, item.thumb, (success, res) => {
					this.WeuiModel.hideLoading(loading);
					this.isPay(item, success, res);
				})
			} else if(item.isBuy == 0) { //待支付
				let loading = this.WeuiModel.showLoading('获取书籍信息');
				this.commanModel.realPay(item.orderNumber, (success, res) => {
					this.WeuiModel.hideLoading(loading);
					this.isPay(item, success, res);
				})
			}else{
				//this.navCtrl.push(ChapterListPage, {data: item.id,collect:item.collect})
				if(item.type==1){
					this.navCtrl.push(ChapterListPage, {data: item.id,collect:item.collect})
				}else{
					this.navCtrl.push(ReadArticlePage, {data: item.id,type:2})
//					this.getBookData(item.id)
				}
			}

		}
	}
	isPay(item, success, res) {
		if(success) {
			if(res == 0) {
				item.isBuy = 1;
				this.events.publish("book-buy-success");
				this.myReadProgress();
				if(item.type==1){
					this.navCtrl.push(ChapterListPage, {data: item.id,collect:item.collect})
				}else{
					this.navCtrl.push(ReadArticlePage, {data: item.id,type:2})
//					this.getBookData(item.id)
				}
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
						this.myReadProgress();
						if(item.type==1){
							this.navCtrl.push(ChapterListPage, {data: item.id,collect:item.collect})
						}else{
							this.navCtrl.push(ReadArticlePage, {data: item.id,type:2})
//							this.getBookData(item.id)
						}
					}
				})
			}
		}else{
			this.WeuiModel.showAlert("处理书籍错误",res,"确定")
		}
	}
	goNewThingsPage() {
		this.navCtrl.push(NewThingsPage)
	}

	newInitData() {
		this.newBookData = [{
				bookName: 'The Case of the Stinky Socks11111',
				progress: 80,
				cost: false, //是否免费
				id: 1,
				select: false,//是否选中
			},
		]
		this.readData = [{
				type: '1', //精读
				costType: 1, //付费类型  1 免费 2未购买 3已购买
				price: 9.9,
				updType: '更新至01',
				bookName: '书籍名称',
				readNum: 1000,
				difficulty: [{}, {}]
		},
		]
		this.bookType = [{
				bookName: '数学',
				bgColor: '#9067fc'
		},
		]
	}
	editFn() {
		this.isEdit = true;
	}
	successFn() {
		this.isEdit = false;
	}
	selectReadItem(item,e) {
		console.log("newBookData",this.newBookData)
		if(item.select) {
			item.select = false;
			this.selectTotalNum--
			this.isSelectAll = false;
		
		} else {
			item.select = true;
			this.selectTotalNum++
			
				if(this.selectTotalNum == this.newBookData.length) {
					this.isSelectAll = true;
				}
		}
	}
	selectAll() {
		this.delMyBookId.length=0
		if(this.isSelectAll) {
			this.isSelectAll = false;
			this.selectTotalNum = 0;
			for(var i = 0; i < this.newBookData.length; i++) {
				this.newBookData[i].select = false;
			}
			
		} else {
			this.isSelectAll = true;
			this.selectTotalNum = this.newBookData.length
			for(var i = 0; i < this.newBookData.length; i++) {
				this.newBookData[i].select = true;
			}
			
		}
		
	}
	deleteSelect() { //删除选中
		var bookIdsArr=[]; 
		for(var i=0;i<this.newBookData.length;i++){
			if(this.newBookData[i].select&&this.newBookData[i].isFree==2) {//&&this.newBookData[i].isFree==1
				bookIdsArr.push(this.newBookData[i].bookId)
			}
		}
		
		if(bookIdsArr.length==0){
			let options = {
					position: "middle",
					duration: 2000,
				}
			this.WeuiModel.showToast("请选择要删除的书籍!",options)
			return false ;
		}else{
			var bookIdsArrStr=bookIdsArr.join(',');
			this.WeuiModel.showAlert("确定删除吗?","删除的书籍在重新阅读后将再次加入您的阅读记录","取消","确定",()=>{
			},()=>{
				this.delFn(bookIdsArrStr);
			})
		}
	
	}
	
	delFn(bookIdsArr){
		
		
		let loading = this.WeuiModel.showLoading("删除中...");
		this.commanModel.request('SA', 'deleteBook', { //删除我的书籍
			userId: this.userId,
			token: this.token,
			bookId:bookIdsArr
		}, (data) => {
			this.WeuiModel.hideLoading(loading)
			
			if(data.code==0){
				let options = {
					position: "middle",
					duration: 2000,
				}
					var i = this.newBookData.length;
					while(i--) {
						if(this.newBookData[i].select&&this.newBookData[i].isFree==2) {//&&this.newBookData[i].isFree==1
							this.newBookData.splice(i, 1);
						}
					}
					if(this.newBookData.length == 0) {
						this.bindHeight = this.initBindHeight;
						this.currentStyles = {
							'height': this.bindHeight + 'px',
							'transition': 'height .5s',
							'overflow': 'hidden'
						}
						this.isBottom = false;
						this.isEdit=false;
						this.isSelectAll=false;
					}
				console.log('1233333',this.initBindHeight,this.isBottom)
				this.WeuiModel.showToast("删除成功!",options)
				
			}else{
				this.WeuiModel.showAlert("删除失败!",data.msg,"确定")
			}
		})
	}
	twoArr(data, nullArr) {
		var numArr = Math.ceil(data.length / 3);
		var num = 0;
		for(var i = 0; i < numArr; i++) {
			nullArr[i] = [];
			for(var j = 0; j < 3; j++) {
				if(data[num] == undefined) {
					nullArr[i][j] = {
						type: '##@@##', //精读
						costType: 1, //付费类型  1 免费 2未购买 3已购买
						price: 9.9,
						updType: '更新至01',
						bookName: '书籍名称',
						readNum: 1000,
						difficulty: [{}]
					}
					continue
				}
				
				data[num].difficulty=[];
				var difficultyObj={};
				for(var k=0 ;k<data[num].level;k++){
					if(k>=5){
						break ;
					}
					data[num].difficulty.push(difficultyObj)
				}
				if(data[num].difficulty.length<1){
					data[num].difficulty.push(difficultyObj)
				}
				nullArr[i][j] = data[num];
				num++;
			}
		}
		
		
	}

	getUserInfo() {
		this.userId = this.commanModel.getGlobal("userId");
		this.token = this.commanModel.getGlobal("token");
	}

	ionViewDidLeave() {
		this.events.subscribe('login-state-change', this.eventHandler);
	}

isShowTip(){//是否显示滑动提示
	
	this.storage.get('isShowTip').then((val) => {
			   if(!val){
			   		this.events.publish("read-pull-tip"); 
			   		this.storage.set('isShowTip', 'true');
			   }
	});
}
	initData() {
		this.isEdit=false;
		this.isBottom=false;
		this.isSelectAll=false;
//		this.isInitTags=true;
		this.getUserInfo();
		if(this.userId){//只有登陆的时候 才请求阅读进度
			this.myReadProgress();
		}
		this.getTags();
		if(this.newBookData.length > 0) {
			this.readItem = document.getElementsByClassName('read_item');//
			
			this.initBindHeight = this.readItem[0].offsetHeight + 25;
			this.currentStyles = {
				'height': this.initBindHeight + 'px',
				'transition': 'height .5s',
				'overflow': 'hidden'
			}
		} else {
			this.initBindHeight = 140
			this.currentStyles = {
				'height': this.initBindHeight + 'px',
				'transition': 'height .5s',
				'overflow': 'hidden'
			}
		}
		this.bottomHeight = this.navCtrl.parent._tabbar.nativeElement.clientHeight;
		if(this.cateId&&this.cateId!=-1){
				this.selBookIndex=this.cateId;
				this.getBookList(this.cateId)
				
			}else{
				this.selBookIndex=-1
				this.getBookList();
			}
			
	}
	getBookList(tagIds ? ) {
		var id = ''
		if(tagIds) {
			id = tagIds;
		} else {
			id = ""
		}
//		let loading = this.WeuiModel.showLoading("加载中...");
		this.commanModel.request('SA', 'bookList', { //书籍列表
			userId: this.userId,
			token: this.token,
			page: 0,
			size:50,
			tagIds: id
		}, (data) => {
//			this.WeuiModel.hideLoading(loading)
			if(data.code==0){
				var dataInten = [];
				var dataViva = [];
				this.intenSmlArr = [];
				this.vivaSmlArr = [];
				var bookList = data.bookList;
				for(var i = 0; i < bookList.length; i++) {
					bookList[i].thumb=data.filePath+bookList[i].thumb
					if(bookList[i].type == 1) { //精读
						dataInten.push(bookList[i])
					} else { //畅读
						dataViva.push(bookList[i])
					}
				}
				this.twoArr(dataInten, this.intenSmlArr)
				this.twoArr(dataViva, this.vivaSmlArr)
				console.log("datadatadata",this.intenSmlArr,this.vivaSmlArr)
			}else{
				this.firstLoadedData = false;
				this.WeuiModel.showAlert("获取书籍失败", data.msg, "确定");
			}
		}, (err)=>{
			this.firstLoadedData = false;
			if(err=="10099"){
				this.WeuiModel.showAlert("获取书籍失败", "登录失效，请重新登录", "确定");
			}else{
				this.WeuiModel.showAlert("获取书籍失败", "网络错误", "确定");
			}
		})
	}
	myReadProgress() { //我的阅读进度 我的书籍
		
		this.commanModel.request('SA', 'myBook', { //书籍列表
			userId: this.userId,
			token: this.token,
			page: 0,
			size: 200
		}, (data) => {
			if(data.code==0){
				this.newBookData=data.list
			}
		})
	}
	getTags() { //获取标签: getTags
		this.commanModel.request('SA', 'getTags', { //书籍列表
			userId: this.userId,
			token: this.token,
			parentCode: "category_reading"
		}, (data) => {
			this.bookType = data.tagsList
		})
	}
ngAfterContentChecked(){
	if(!this.jReadItem||this.jReadItem==190){
		this.jReadItem=$('.j_read_con').eq(0).height()
	}
	if(this.isInitTags&&this.cateId){
//		for(let i=0;i<this.bookType.length;i++){
//					if(this.cateId==this.bookType[i].id){
//						this.slides.slideTo(i, 100);
//					}
//		}
	}	
}
ionViewWillLeave(){
//this.isInitTags=true;
}
	ionViewDidEnter() {
		
		this.isShowTip();
		this.allContentHeight=$('.allContent').height();//内容总的高度
		this.readTitle = document.getElementById("readTitle").offsetHeight;//我的阅读title高度;
		this.drapHotZoneHeight=$('.drap_hot_zone').height();//热区的高度
		this.events.unsubscribe('login-state-change', this.eventHandler);
		if(!this.firstLoadedData) {
			this.firstLoadedData = true;
			this.initData();
		}
		if(this.bookType){
			for(let i=0;i<this.bookType.length;i++){
				if(this.cateId==this.bookType[i].id){
					this.slides.slideTo(i, 100);
				}
			}
		}
	}

}