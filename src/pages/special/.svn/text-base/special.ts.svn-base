import { Component } from '@angular/core';
import { NavController, ModalController,Events, Nav, Platform } from 'ionic-angular';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { LoginModal } from '../modal-login/modal-login';
import { SpecialPopPage } from '../../pages/special_pop/special_pop';
import { SpecialSetPage } from '../../pages/special_set/special_set';
import { ArticleDetailPage } from '../../pages/article-detail/article-detail';
@Component({
	selector: 'page-special',
	templateUrl: 'special.html'
})
export class SpecialPage {
	userId: string = '';
	token: string = '';
	products: any = []; //产品数组
	page: number = 0; //当前页面
	limit: number = 10; //每页的条数
	total: number = 0; //总条数
	componty: any; //完成
	firstLoadedData:boolean = false;
	isLoadMore:boolean = false; //是否正在加载更多数据
	noMoreData:boolean = false; //是否还有更多下滑的数据

	eventHandler:any = ()=> {
		this.firstLoadedData = false;
	}

	constructor(
		public events: Events,
		public modalCtrl: ModalController,
		private plt: Platform,
		public navCtrl: NavController,
		private weui: WeuiModel,
		private comman: commanModel
	) {
		//监听模态窗内点击"申请规划"按钮事件
		events.subscribe('goSetPage', () => {
			this.goSetPage_()
		});
		
	}
	checkUserInfo() {
		var userId = this.comman.getGlobal("userId");
		var token = this.comman.getGlobal("token");
		console.log(userId);
		console.log(token);
		if(userId == "" || userId == null || userId == undefined || token == "" || token == null || token == undefined) {
			this.login(0);
		}
	}
	/*去设置页*/
	goSetPage_(){
		if(this.userId=="" || this.userId==null) {
			this.login(1);
		}else{
			this.navCtrl.push(SpecialSetPage);
		}
	}
	/*去详情页*/
	goDetail(product){
		if(product.sourceId != undefined){
			this.navCtrl.push(ArticleDetailPage,{
				id:product.sourceId, 
				nolike:1, 
				title:product.name,
				showapply: true
			});
		}else{
			this.weui.showToast("未关联文章", {position:"middle"});
		}
	}
	login(gotoApply) {
		let loginModalCtrl = this.modalCtrl.create(LoginModal, {}, {});
		loginModalCtrl.present();
		loginModalCtrl.onDidDismiss((data)=>{
			if(data.isLogin){
				this.initData();
				if(gotoApply==1){
					this.navCtrl.push(SpecialSetPage);
				}
			}
		});
	}
	/*初始化数据*/
	initData() {
	 this.userId = this.comman.getGlobal("userId");
	 this.token = this.comman.getGlobal("token");
	 this.getDataAjax();
	}
	
	/*更多数据*/
	getMoreData() {
		this.getDataAjax(true)

	}
	
	/*打开弹框*/
	showPop() {
		let profileModal = this.modalCtrl.create(SpecialPopPage,{});
		profileModal.present();
	}
	
	/*查看更多*/
	loadMore() {
		if(this.products.length < this.total) {
			this.page++;
			this.getMoreData();
		} else {
			this.componty.complete();
		}
	}
	
	/*分页器*/
	doInfinite(infiniteScroll) {
		setTimeout(() => {
			this.componty = infiniteScroll;
			this.loadMore();
		}, 500);
	}
	
	/*请求接口数据*/
	getDataAjax(getMoreStates ? : boolean) {
		if(this.isLoadMore) return;
		let param = {
			userId: this.userId,
			token: this.token,
			page: this.page,
			limit: this.limit,
			appId: 9, //固定传9

		};
		this.isLoadMore = true;
		let myLoading:any;
		if(!getMoreStates) {
			myLoading = this.weui.showLoading("数据获取中");
		}
		this.comman.request("OReading", "getSAProduceList", param, (data) => {
			if(myLoading){
				this.weui.hideLoading(myLoading);
			}
			this.isLoadMore = false;
			if(data.code == 0) {
				this.total = data.total;
				if(getMoreStates) {
					for(var i = 0; i < data.rows.length; i++) {
						this.products.push(data.rows[i]);
					}
					this.componty.complete();
				} else {
					this.products = data.rows;
				}
				for(let i = 0;i<this.products.length;i++){
					this.products[i]['src'] = data.filePath + this.products[i].bigPic;
				}
				if(this.products.length==data.total){
					this.noMoreData = true;
				}
			} else {
				this.weui.showAlert("获取数据失败", data.msg, "确定");
			}
		}, (err) => {
			this.isLoadMore = false;
			if(myLoading){
				this.weui.hideLoading(myLoading);
			}
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			} else if(err == '10099') {
				this.weui.showAlert("获取数据失败", "请先登录", "确定", );
			}
		})
	}
	ionViewDidLeave(){
		this.events.subscribe('login-state-change', this.eventHandler);
	}
	ionViewDidEnter() {
		this.events.unsubscribe('login-state-change', this.eventHandler);
		if(!this.firstLoadedData){
			this.firstLoadedData = true;
			this.initData();
		}
	}
}