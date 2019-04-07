import { Component } from '@angular/core';
import { Events, ModalController, NavController, Platform } from 'ionic-angular';
import { LiveActorPage } from '../live-actor/live-actor';
import { LoginModal } from '../modal-login/modal-login';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';

@Component({
	selector: 'page-public-course',
	templateUrl: 'public-course.html'
})
export class PublicCoursePage {
	userId:string;
	token:string;
	systemTime:number;
	openCourseList = [];
	historyCourseList = [];
	infiniteScrollEvent:any;
	infi_loadingText: string = "加载中……";
	refresherEvent:any;
	saPage: number = 0;
	saPageTotal: number = 0;
	saLimitPageSize: number = 20;
	firstLoadedData:boolean = false;
	eventHandler:any = ()=> {
		this.firstLoadedData = false;
	}
	constructor(
		public events: Events,
		private plt: Platform,
		public navCtrl: NavController,
		private weui: WeuiModel,
		private comman: commanModel,
		public modalCtrl: ModalController
	) {
		//监听公开课预约成功事件
		events.subscribe('hasAppointment', () => {
			this.initData();
		});
	}
	getUserInfo() {
		this.userId = this.comman.getGlobal("userId");
		this.token = this.comman.getGlobal("token");
	}
	initData() {
		this.saPage = 0;
		this.saPageTotal = 0;
		this.getUserInfo();
		this.getSeriesLVList();
	}
	getSeriesLVList() {
		if(this.saPage == 0) {
			this.openCourseList = new Array();
			this.historyCourseList = new Array();
		}
		let myLoading: any = this.weui.showLoading("加载中……");
		let param = {
			userId: this.userId,
			token: this.token,
			tag:"oreding_public_cource",
//			beginTime:,//可选
//			dataType:10,//10直播，12录播
			page:0,
			size:20
		};
		this.comman.request("Course", "getSeriesLVList", param, (data) => {
			this.weui.hideLoading(myLoading);
			if(data.code == 0) {
				this.systemTime = data.sysTime;
				for(var i=0;i<data.list.length;i++){
					if(data.list[i].courseTimeStamp<=this.systemTime){
						data.list[i]["isLive"] = true;
					}else{
						data.list[i]["isLive"] = false;
					}
					
					if(data.list[i].isSub==0&&data.list[i].isFinish==0){
						data.list[i]["viewType"] = 2;
					}else if(data.list[i].isSub==1&&data.list[i].isFinish==0&&!data.list[i].isLive){
						data.list[i]["viewType"] = 0;
					}else if(data.list[i].isSub==1&&data.list[i].isLive&&data.list[i].isFinish==0){
						data.list[i]["viewType"] = 1;
					}else if(data.list[i].isSub==1&&data.list[i].isFinish==1){
						data.list[i]["viewType"] = 3;
					}else{
						data.list[i]["viewType"] = -1;
					}
					if(data.list[i].dataType==12){
						this.historyCourseList.push(data.list[i]);
					}else{
						if(data.list[i].isFinish==0){
							this.openCourseList.push(data.list[i]);
						}else{
							this.historyCourseList.push(data.list[i]);
						}
					}
				}
				this.saPageTotal = Math.ceil(data.total / this.saLimitPageSize);
				if(this.saPage == this.saPageTotal - 1) {
					this.infi_loadingText = "没有更多了。";
				}
			} else {
				this.weui.showAlert("获取课程失败", data.msg, "确定");
			}
			if(this.infiniteScrollEvent != undefined) {
				this.infiniteScrollEvent.complete();
			}
			if(this.refresherEvent!=undefined){
				this.refresherEvent.complete();
			}
		}, (err) => {
			if(this.infiniteScrollEvent != undefined) {
				this.infiniteScrollEvent.complete();
			}
			if(this.refresherEvent!=undefined){
				this.refresherEvent.complete();
			}
			this.weui.hideLoading(myLoading);
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			}
			if(err == "10099") {
//				this.goLogin();
			}
		})
	}
	goLogin() {
		let loginModalCtrl = this.modalCtrl.create(LoginModal, {});
		loginModalCtrl.present();
		loginModalCtrl.onDidDismiss((data)=>{
			if(data.isLogin){
				this.initData();
			}
		});
	}
	goLive(courseObj,ev) {//type:0详情，1去直播
		ev.stopPropagation();
		this.navCtrl.push(LiveActorPage, {
			courseId: courseObj.courseId,
			seriesId: courseObj.seriesId,
			classId: courseObj.classId,
			viewType:courseObj.viewType==1?courseObj.viewType:0,
			courseObj:courseObj
		});
	}
	appointmentCourse(courseObj,ev?){
		try{
			if(ev!=undefined){
				ev.stopPropagation();
			}
		}catch(e){
			//TODO handle the exception
		}
		if(!this.isLogin()){
//			this.weui.showAlert("提示","只有登录用户才能进行预约","取消","去登陆",()=>{
//				
//			},()=>{
				this.goLogin();
//			})
			return false;
		}
		var params = {
			userId:this.userId,
			token:this.token,
			seriesId:courseObj.seriesId,
			classId:courseObj.classId,
			id:courseObj.courseId,
			originType:7
		};
		this.comman.request("Course", "subscribeLive", params, (data) => {
			console.log(data);
			if(data.code == 0) {
				this.weui.showToast("课程预约成功！");
				this.initData();
			}else{
				this.weui.showAlert("课程预约失败",data.msg,"确定");
			}
		}, (err) => {
			this.weui.showAlert("课程预约失败","","确定");
			console.log(err);
			
			if(err == "10099") {
				this.weui.showAlert("登录失败", "登录状态已失效，请从新登录", "关闭", "去登陆", () => {}, () => {
					this.goLogin();
				});
			}
		})
	}
	isLogin(){
		if(this.userId==""||this.userId==undefined||this.userId==null||this.token==""||this.token==undefined||this.token==null){
			return false;
		}else{
			return true;
		}
	}
	imgError(ev){
		console.log(ev);
		ev.target.style.visibility = "hidden";
	}
	doInfinite(infiniteScroll) {
		this.infiniteScrollEvent = infiniteScroll;
		this.saPage++;
		if(this.saPage < this.saPageTotal) {
			this.getSeriesLVList();
		} else {
			infiniteScroll.complete();
		}
	}
	doRefresh(refresher) {
		this.refresherEvent = refresher;
		this.initData();
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