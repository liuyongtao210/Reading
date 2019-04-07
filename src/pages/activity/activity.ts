import { Component } from '@angular/core';
import {IonicApp, NavController, ModalController,Events, Nav, Platform } from 'ionic-angular';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { LoginModal } from '../modal-login/modal-login';
import { ArticleDetailPage } from '../article-detail/article-detail';
import { MyInvitePage } from '../my-invite/my-invite';

@Component({
	selector: 'page-activity',
	templateUrl: 'activity.html'
})
export class ActivityPage {
	ajaxrequest:boolean = true;//ajax返回
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


	constructor(
		public events: Events,
		public modalCtrl: ModalController,
		private plt: Platform,
		public navCtrl: NavController,
		private weui: WeuiModel,
		private comman: commanModel,
		private ionicApp: IonicApp,
	) {
		this.initData();
		
	}
	
	/*去详情页*/
	goDetail(product){
		if(this.isLogin()){
			this.navCtrl.push(MyInvitePage);
		}else{
			this.login();
		}
	}
	/*初始化数据*/
	initData() {
	 this.userId = this.comman.getGlobal("userId");
	 this.token = this.comman.getGlobal("token");
	 this.getDataAjax();
	}
	isLogin(){
		return !(this.userId=="" || this.userId==null || this.userId==undefined || this.userId=="null");
	}
	/*更多数据*/
	getMoreData() {
		this.getDataAjax(true)

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
	/*去登录*/
	login() {
		let loginModalCtrl = this.modalCtrl.create(LoginModal, {}, {});
		loginModalCtrl.present();
		loginModalCtrl.onDidDismiss((data) => {
			if(data.isLogin) {
				this.userId = this.comman.getGlobal("userId");
	 			this.token = this.comman.getGlobal("token");
			}
		});
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
	
	/*请求接口数据*/
	getDataAjax(getMoreStates ? : boolean) {
		if(this.isLoadMore) return;
		let param = {
			page: this.page,
			size: this.limit
		};
		this.isLoadMore = true;
		this.comman.request("SA", "activityList", param, (data) => {
			this.isLoadMore = false;
			if(data.code == 0) {
				console.log(data)
				this.total = data.total;
				if(getMoreStates) {
					for(var i = 0; i < data.list.length; i++) {
						this.products.push(data.list[i]);
					}
					this.componty.complete();
				} else {
					this.products = data.list;
				}
				for(let i = 0;i<this.products.length;i++){
					this.products[i]['src'] = data.filePath + this.products[i].pic;
				}
				if(this.products.length==data.total){
					this.noMoreData = true;
				}
				if(this.products.length == 0){
					this.ajaxrequest = false;
				}else{
					this.ajaxrequest = true;
				}
			} else {
				this.ajaxrequest = false;
				this.weui.showAlert("获取数据失败", data.msg, "确定");
			}
		}, (err) => {
			this.ajaxrequest = false;
			this.isLoadMore = false;
			if(err == "ajaxError") {
				this.weui.showAlert("获取失败", "请手机检查网络", "关闭");
			} else if(err == '10099') {
				this.weui.showAlert("获取失败", "登录已失效", "关闭");
			}
		})
	}
	ionViewDidEnter() {
		
	}
}