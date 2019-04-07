import { Component } from '@angular/core';
import {IonicApp,Platform, NavController,ModalController } from 'ionic-angular';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { LoginModal } from '../modal-login/modal-login';

@Component({
  selector: 'page-courses_paid',
  templateUrl: 'courses_paid.html'
})
export class CoursesPaidPage {
  userId:string = '';
	token:string = '';
	isShowHeader:boolean = false;//默认进来页面展示
	page: number = 0; //当前页面
	size: number = 20; //每页的条数
	total: number = 0; //总条数
	moreWords: string = '加载更多';
	firstLoadedData:boolean = false;
	isLoadMore:boolean = false; //是否正在加载更多数据
	noMoreData:boolean = false; //是否还有更多下滑的数据
	ajaxrequest:boolean = true;
	componty: any; //完成
	orders:any = [];
  constructor(
  	private ionicApp: IonicApp,
  	private plt: Platform,
  	public modalCtrl: ModalController,
  	public navCtrl: NavController,
  	private weui:WeuiModel,
  	private comman:commanModel
  ) {
  	this.init(); 
  }
  init(){
		this.userId = this.comman.getGlobal("userId");
	  this.token = this.comman.getGlobal("token");
		this.initData()
	}
  timestampToTime(timestamp) {
		if(timestamp == '') {
			return
		} else {
			timestamp = timestamp * 1;
			let date = new Date(timestamp),
				Y = date.getFullYear() + '-',
				M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
				D = date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate() + '',
				h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':',
				m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':',
				s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
			return Y + M + D;
		}

	}
 
	/*去登录*/
	login() {
		let loginModalCtrl = this.modalCtrl.create(LoginModal, {}, {});
		loginModalCtrl.present();
		loginModalCtrl.onDidDismiss((data) => {
			if(data.isLogin) {
				this.initData();
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
	initData(getMoreStates ? : boolean) {
		 this.userId = this.comman.getGlobal("userId");
	   this.token = this.comman.getGlobal("token");
		if(this.isLoadMore) return;
		let param = {
			userId: this.userId,
			token: this.token,
			page: this.page,
			size: this.size,
			orderStatus: 5
		};
		this.isLoadMore = true;
		// let myLoading:any;
		// if(!getMoreStates) {
		// 	myLoading = this.weui.showLoading("数据获取中");
		// }
		this.comman.request("Order", "myOrderList", param, (data) => {
			// if(myLoading){
			// 	this.weui.hideLoading(myLoading);
			// }
			this.isLoadMore = false;
			if(data.code == 0) {
				console.log(data);
				this.total = data.total;
				for(let i = 0; i < data.orderList.length; i++) {
					if(data.orderList[i].productList.length>0){
						var good = data.orderList[i].productList[0];
						console.log(good);
						good.goodsName = good.cusGoodsName==undefined ? good.goodsName : good.cusGoodsName;
					}
				}
				if(getMoreStates) {
					for(let i = 0; i < data.orderList.length; i++) {
						this.orders.push(data.orderList[i]);
					}
					this.componty.complete();
				} else {
					this.orders = data.orderList;
					
				}
				if(this.orders.length==data.total){
					this.noMoreData = true;
				}
				if(this.orders.length == 0){
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
	/*更多数据*/
	getMoreData() {
		this.initData(true)

	}

	/*查看更多*/
	loadMore() {
		if(this.orders.length < this.total) {
			this.moreWords = "加载更多";
			this.page++;
			this.getMoreData();
		} else {
			this.componty.complete();
			this.moreWords = "没有更多了";
		}
	}

	/*分页器*/
	doInfinite(infiniteScroll) {
		setTimeout(() => {
			this.componty = infiniteScroll;
			this.loadMore();
		}, 500);
	}
}
