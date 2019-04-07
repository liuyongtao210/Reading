import { Component, ViewChild } from '@angular/core';
import { IonicApp, NavController, ModalController, Events, Platform, Slides } from 'ionic-angular';
import { ChangePwdPage } from '../changePwd/changePwd';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { LoginModal } from '../modal-login/modal-login';
import { PunchCardPage } from '../punchCard/punchCard';
import { TeacherIndexPage } from '../teacher-index/teacher-index';
import { Storage } from '@ionic/storage';
@Component({
	selector: 'page-teacher-theme',
	templateUrl: 'teacher-theme.html'
})
export class TeacherThemePage {
	teacherArr:any = [];
	userId: string = '';
	token: string = '';
	page:number = 0;//当前页码
	limit:number = 10;//每页条数
	total: number = 0; //总条数
	componty: any; //完成
	firstLoadedData:boolean = false;
	isLoadMore:boolean = false; //是否正在加载更多数据
	noMoreData:boolean = false; //是否还有更多下滑的数据
	ajaxrequest:boolean = true;
	constructor(
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
	init(){
		this.initData();
	}
	/*更多数据*/
	getMoreData() {
		this.initData(true)

	}
	/*查看更多*/
	loadMore() {
		if(this.teacherArr.length < this.total) {
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
	initData(getMoreStates ? : boolean) {
		 this.userId = this.comman.getGlobal("userId");
	     this.token = this.comman.getGlobal("token");
		if(this.isLoadMore) return;
		let param = {
			userId: this.userId,
			token: this.token,
			page: this.page,
			size: this.limit,
		};
		this.isLoadMore = true;
		this.comman.request("SA", "famousTeacher", param, (data) => {
			this.isLoadMore = false;
			if(data.code == 0) {
				console.log(data);
				this.total = data.total;
				if(getMoreStates) {
					for(let i = 0; i < data.list.length; i++) {
						this.teacherArr.push(data.list[i]);
					}
					this.componty.complete();
				} else {
					this.teacherArr = data.list;
				}
				console.log(this.teacherArr);
				if(this.teacherArr.length==data.total){
					this.noMoreData = true;
				}
				if(this.teacherArr.length == 0){
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
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			} else if(err == '10099') {
				if(this.checkMask()) {
					this.login();
				}
			}
		})
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
	goteacherIndex(teacher){
		let userId = this.comman.getGlobal("userId");
		let token = this.comman.getGlobal("token");
		if( userId == '' || !userId || token == '' || !token){
			if(this.checkMask()) {
				this.login();
			}
		}else{
			this.navCtrl.push(TeacherIndexPage,{
				teacherId:teacher.teacherId
			})
		}
	}
	ionViewDidEnter() {

	}
	/*NG生命周期*/
	ngAfterViewInit() {
		let winWidth = this.plt.width();
	}
}