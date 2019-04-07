import { Component, ViewChild,ElementRef } from '@angular/core';
import { IonicApp, NavController, ModalController, Events, Platform, Slides } from 'ionic-angular';
import { ChangePwdPage } from '../changePwd/changePwd';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { LoginModal } from '../modal-login/modal-login';
import { PunchCardPage } from '../punchCard/punchCard';
import { wordBookPage } from '../wordBook/wordBook';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import { PayPage } from '../../pages/pay/pay';
import { CourseDetailPage } from '../course-detail/course-detail';
@Component({
	selector: 'page-course-list',
	templateUrl: 'course-list.html'
})
export class CourseListPage {
	@ViewChild("_content_") _content_: ElementRef;
	userId: string = '';
	token: string = '';
	page:number = 0;//当前页码
	limit:number = 10;//每页条数
	total: number = 0; //总条数
	firstLoadedData:boolean = false;
	isLoadMore:boolean = false; //是否正在加载更多数据
	noMoreData:boolean = false; //是否还有更多下滑的数据
	ajaxrequest:boolean = true;
	heighter:number = 0;
	winWidth: number = 0;
	slideIndex: number = 0;
	isTransition: boolean = false;
	products: any = [];
	dragState: any = {};
	domLeft: string = '0%';
	num: number = 0;
	slidesMoving:boolean = false;
	slidesHeight:number = 0;
	@ViewChild(Slides) slides: Slides;
	constructor(
		private callNumber: CallNumber,
		public events: Events,
		public modalCtrl: ModalController,
		private plt: Platform,
		public navCtrl: NavController,
		private weui: WeuiModel,
		private comman: commanModel,
		private storage: Storage,
		private ionicApp: IonicApp
	) {
		this.init();
	}

	ionViewDidEnter() {
		if(!this.firstLoadedData){
			this.firstLoadedData = true;
			this.initData();
		}
	}

	init() {
		this.products = [
		  {
		  	name:'轻课',
		  	content:[]
		  },
		  {
		  	name:'BSTL',
		  	content:[
		  	   {
		  	   	 title:'',
		  	   	 imgPath:'assets/imgs/course/B1.png',
		  	   },
		  	   {
		  	   	 title:'',
		  	   	 imgPath:'assets/imgs/course/B2.png',
		  	   },
		  	   {
		  	   	 title:'',
		  	   	 imgPath:'assets/imgs/course/B3.png',
		  	   },
		  	   {
		  	   	 title:'',
		  	   	 imgPath:'assets/imgs/course/B4.png',
		  	   },
		  	   {
		  	   	 title:'',
		  	   	 imgPath:'assets/imgs/course/B5.png',
		  	   },
		  	   {
		  	   	 title:'课程内容',
		  	   	 imgPath:'',
		  	   	 partCourse:{
		  	   	   name:'部分课件',
		  	   	   children:[
		  	   	     {
		  	   	     	imgPath:'assets/imgs/course/bcourse1.jpg'
		  	   	     },
		  	   	     {
		  	   	     	imgPath:'assets/imgs/course/bcourse2.png'
		  	   	     },
		  	   	     {
		  	   	     	imgPath:'assets/imgs/course/bcourse3.png'
		  	   	     }
		  	   	   ]
		  	   	 }
		  	   },
		  	   {
		  	   	 title:'教材书籍',
		  	   	 imgPath:'assets/imgs/course/B6.png',
		  	   },
		  	]
		  },
		  {
		  	name:'STEAM',
		  	content:[
		  	   {
		  	   	 title:'',
		  	   	 imgPath:'assets/imgs/course/S1.png',
		  	   },
		  	   {
		  	   	 title:'',
		  	   	 imgPath:'assets/imgs/course/S2.png',
		  	   },
		  	   {
		  	   	 title:'',
		  	   	 imgPath:'assets/imgs/course/S3.png',
		  	   },
		  	   {
		  	   	 title:'',
		  	   	 imgPath:'assets/imgs/course/S4.png',
		  	   },
		  	   {
		  	   	 title:'',
		  	   	 imgPath:'assets/imgs/course/S5.png',
		  	   },
		  	   {
		  	   	 title:'课堂照片',
		  	   	 imgPath:'',
		  	   	 partCourse:{
		  	   	   name:'部分课件',
		  	   	   children:[
		  	   	     {
		  	   	     	imgPath:'assets/imgs/course/steam_1.png'
		  	   	     },
		  	   	     {
		  	   	     	imgPath:'assets/imgs/course/steam_2.png'
		  	   	     },
		  	   	     {
		  	   	     	imgPath:'assets/imgs/course/steam_3.png'
		  	   	     },
		  	   	     {
		  	   	     	imgPath:'assets/imgs/course/steam_4.png'
		  	   	     }
		  	   	   ]
		  	   	 }
		  	   	 
		  	   },
		  	   {
		  	   	 title:'成果展示',
		  	   	 imgPath:'',
		  	   	 partCourse:{
		  	   	   name:'部分课件',
		  	   	   children:[
		  	   	     {
		  	   	     	imgPath:'assets/imgs/course/steam_cg1.png'
		  	   	     },
		  	   	     {
		  	   	     	imgPath:'assets/imgs/course/steam_cg2.png'
		  	   	     },
		  	   	     {
		  	   	     	imgPath:'assets/imgs/course/steam_cg3.png'
		  	   	     },
		  	   	     {
		  	   	     	imgPath:'assets/imgs/course/steam_cg4.png'
		  	   	     },
		  	   	     {
		  	   	     	imgPath:'assets/imgs/course/steam_cg5.png'
		  	   	     }
		  	   	   ]
		  	   	 }
		  	   	 
		  	   },
		  	]
		  },
		  {
		  	name:'出国留学',
		  	content:[
		  	   {
		  	   	 title:'',
		  	   	 imgPath:'assets/imgs/course/chu1.png',
		  	   },
		  	   {
		  	   	 title:'',
		  	   	 imgPath:'assets/imgs/course/chu2.png',
		  	   },
		  	   {
		  	   	 title:'',
		  	   	 imgPath:'assets/imgs/course/chu3.png',
		  	   },
		  	   {
		  	   	 title:'',
		  	   	 imgPath:'assets/imgs/course/chu4.png',
		  	   },
		  	   {
		  	   	 title:'',
		  	   	 imgPath:'assets/imgs/course/chu5.png',
		  	   },
		  	   
		  	]
		  }
		]
		 this.userId = this.comman.getGlobal("userId");
	     this.token = this.comman.getGlobal("token");
	}
	
	buyCourse(book){
		let userId = this.comman.getGlobal("userId");
		let token = this.comman.getGlobal("token");
	  if(userId == '' || !userId || token == '' || !token){
	  	  if(this.checkMask()) {
			this.login();
		}
	  }else{
	  	console.log(book.id)
	  	this.navCtrl.push(CourseDetailPage,{
	  		 id:book.id
	  	});
	  	//日后再说
//	  	if(book.isBuy==-1){ //未购买
//			if(book.goodsId == undefined){
//				this.weui.showAlert("无法获取当前课程", "没有返回商品Id", "确定");
//				return;
//			}
//			let loading = this.weui.showLoading("获取课程");
//			this.comman.buyBook(book.goodsId, book.id, book.name, book.thumb, (success, res)=>{
//				this.weui.hideLoading(loading);
//				this.toPaybook(book, success, res);
//			});
//		}else if(book.isBuy==0){ //待支付
//			if(book.orderNumber==undefined){
//				this.weui.showAlert("无法获取当前课程", "没有返回待支付订单号", "确定");
//				return;
//			}
//			let loading = this.weui.showLoading("处理中...");
//			this.comman.realPay(book.orderNumber, (success, res)=>{
//				this.weui.hideLoading(loading);
//				this.toPaybook(book, success, res);
//			})
//		}else if(book.isBuy==1){ //1:已购买
//			this.weui.showAlert("进入详情页", "待开发", "确定");
//		}
	  }
	}
	toPaybook(book, success, res){
		if(success){
			if(res==0){
				book.isBuy = 1;
				this.weui.showAlert("进入详情页", "待开发", "确定");
			}else{
				book.isBuy = 0;
				book.orderNumber = res;
				let payModel = this.modalCtrl.create(PayPage, {orderNumber: res});
				payModel.present();
				payModel.onDidDismiss((data)=>{
					if(data.success){
						book.isBuy = 1;
						this.weui.showAlert("进入详情页", "待开发", "确定");
					}
				})
			}
		}else{
			this.weui.showAlert("获取错误", res, "确定");
		}
	}
	checkMask() {
		let activePortalArray = this.ionicApp._modalPortal._views;
		console.log(activePortalArray);
		if(activePortalArray.length > 0) {
			return false;
		} else {
			return true;
		}

	}
	login() {
		let loginModalCtrl = this.modalCtrl.create(LoginModal, {}, {});
		loginModalCtrl.present();
		loginModalCtrl.onDidDismiss((data)=>{
			if(data.isLogin){
				this.initData();
			}
		});
	}
	/*更多数据*/
	getMoreData() {
		this.initData(true)

	}
	/*查看更多*/
	loadMore() {
		if(this.products.length < this.total) {
			this.page++;
			this.getMoreData();
		}
	}
	
	/*分页器*/
	doInfinite(infiniteScroll) {
	   this.loadMore();
	}
	/*请求接口数据*/
	initData(getMoreStates ? : boolean) {
		if(this.isLoadMore) return;
		let param = {
			userId: this.userId,
			token: this.token,
			page: this.page,
			size: this.limit,
			tagIds:'',
			type:1,
		};
		this.isLoadMore = true;
		// let myLoading:any;
	    // myLoading = this.weui.showLoading("数据获取中");
		this.comman.request("SA", "bookList", param, (data) => {
		    // this.weui.hideLoading(myLoading);
			this.isLoadMore = false;
			if(data.code == 0) {
				console.log(data);
				let filePath = data.filePath;
				this.total = data.total;
				if(getMoreStates) {
					for(let i = 0; i < data.bookList.length; i++) {
						this.products[0].content.push(data.bookList[i]);
					}
					
				} else {
					this.products[0].content = data.bookList;
					
				}
				for(let i = 0; i < this.products[0].content.length; i++) {
				   this.products[0].content[i].imgPath = filePath + this.products[0].content[i].thumb;
				}
				
				console.log(this.products[0].content);
				if(this.products[0]['content'].length==data.total){
					this.noMoreData = true;
				}
				if(this.products[0].content.length == 0){
					this.ajaxrequest = false;
				}else{
					this.ajaxrequest = true;
				}
				if(this.products[0].content.length > 0){
				   this.slidesHeight = Math.round(this.products[0].content.length /2) * 190 + 36 +18;
				}else{
					//先写死(不要高度auto) 因为每次滑动都会计算这个值 这个值就是这个高度 
					this.slidesHeight =  290;
				}
			} else {
				this.firstLoadedData = false;
				this.ajaxrequest = false;
				this.weui.showAlert("获取数据失败", data.msg, "确定");
			}
		}, (err) => {
			this.firstLoadedData = false;
			this.ajaxrequest = false;
			this.isLoadMore = false;
			// if(myLoading){
			// 	this.weui.hideLoading(myLoading);
			// }
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			} else if(err == '10099') {
				if(this.checkMask()) {
					this.login();
				}
			}
		})
	}
	callNow(){ //打电话
		if(this.plt.is("cordova")) {
			this.callNumber.callNumber("18515159491", true)
		}
	}
	event(e){
	  e.stopPropagation();	
	}
	slideMove(e) {
		this.isTransition = false;
		this.num = e._touches.currentX - e._touches.startX;
		let str = Number(this.domLeft.slice(0, this.domLeft.length - 1));
		if(this.num < 0) { //向右滑动
			if(this.slideIndex != 0) {
				this.domLeft = (this.slideIndex) * 100 + Math.abs(this.num / this.winWidth) * 100 + '%';

			} else {
				this.domLeft = Math.abs(this.num / this.winWidth) * 100 + '%';
			}
		} else { //向左滑
			if(this.slideIndex != 0) {
				this.domLeft = Math.abs(Math.abs(this.num / this.winWidth) * 100 - (this.slideIndex) * 100) + '%';

			} else {
				this.domLeft = (this.slideIndex) * 100 - Math.abs(this.num / this.winWidth) * 100 + '%';
			}
		}
		
	}

	slideEnd(e) {
		
		this.isTransition = true;
		let str = Number(this.domLeft.slice(0, this.domLeft.length - 1));
		if(this.num < 0) { //向右滑动
			if(str < this.slideIndex * 100 + 50) {
				this.domLeft = this.slideIndex * 100 + '%';
			} else {

				if(this.slideIndex < this.products.length - 1) {
					this.domLeft = (this.slideIndex + 1) * 100 + '%';

				} else if(this.slideIndex == this.products.length - 1) {
					this.domLeft = (this.products.length - 1) * 100 + '%';

				}

			}
			if(str >= (this.products.length - 1) * 100) {
				this.domLeft = (this.products.length - 1) * 100 + '%';
			}
		} else { //向左滑动

			if(Math.abs(str) < (this.slideIndex) * 100 - 50) {
				this.domLeft = (this.slideIndex - 1) * 100 + '%';
			} else {
				this.domLeft = this.slideIndex * 100 + '%';

			}
			if(this.slideIndex == 0) {
				this.domLeft = '0%';
			}
		}

	}
	slideChanged(e) {

		if(this.slides.getActiveIndex() <= this.products.length - 1) {
			this.slideIndex = this.slides.getActiveIndex();
			this.slidesMoving = false;
			let currentSlide : Element = this.slides._slides[this.slideIndex];
			this.slidesHeight = currentSlide.clientHeight;
             
		}

	}
	slideWillChange(e) {
		if(this.slides.getActiveIndex() <= this.products.length - 1) {
			let str = Number(this.domLeft.slice(0, this.domLeft.length - 1));
			this.slidesMoving = true;
			if(this.num < 0) {
				if(str >= (this.products.length - 1) * 100) {
					this.domLeft = (this.products.length - 1) * 100 + '%';
				} else {
					this.domLeft = (this.slideIndex + 1) * 100 + '%';
				}
			} else {
				if(this.slideIndex != 0) {

					if(this.slideIndex > this.slides.getActiveIndex()) {
						this.domLeft = (this.slideIndex - 1) * 100 + '%';
					} else {
						this.domLeft = (this.slideIndex) * 100 + '%';
					}

				}
			}
		}

	}
	highLigtType(index) {
		this.slides.slideTo(index, 200);
		this.domLeft = index * 100 + '%';
	}
	setHeight(){
		this.winWidth = this.plt.width();
		this.heighter = this._content_['_elementRef']['nativeElement']['clientHeight'] - (72+48);
	    
	}
	pay(index){
		if(index == 1){
			console.log('11111111111');
		}
	}
	/*NG生命周期*/
	ngAfterViewInit() {
		this.setHeight();
	}
}