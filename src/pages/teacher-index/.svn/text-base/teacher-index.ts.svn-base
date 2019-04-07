import { Component, ViewChild } from '@angular/core';
import { IonicApp, NavController, ModalController, Events, Platform, Slides,NavParams } from 'ionic-angular';
import { ChangePwdPage } from '../changePwd/changePwd';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { WxsharePage } from '../../model/wxshare/wxshare'; //分享
import { SpecialSharePopPage } from '../../pages/share_pop/share_pop';//分享模态框
import { LoginModal } from '../modal-login/modal-login';
import { ArticleDetailPage } from '../article-detail/article-detail';
import { Storage } from '@ionic/storage';
@Component({
	selector: 'page-teacher-index',
	templateUrl: 'teacher-index.html'
})
export class TeacherIndexPage {
	isShowAllContent:boolean = true;
	teacherInfo:any = {};
	param:any = {};
	teacherArr:any = [];
	filePath:string = '';
	teacherId:string = '';
	userId:string = '';
	token:string = '';
	isImgError:boolean = false;
	constructor(
		public events: Events,
		public modalCtrl: ModalController,
		private plt: Platform,
		private NavParams: NavParams,
		public navCtrl: NavController,
		private weui: WeuiModel,
		private comman: commanModel,
		private storage: Storage,
		private ionicApp: IonicApp,
		public WxsharePage:WxsharePage
	) {
		this.init()
	}
	errFn(e,obj){
		obj.isImgError = true;
	}
	goArticleDetail(obj){
		console.log(obj)
		this.navCtrl.push(ArticleDetailPage,{
			id:obj.sourceId
		})
	}
	init(){
		this.teacherId = this.NavParams.get('teacherId');
		this.userId = this.comman.getGlobal("userId");
	    this.token = this.comman.getGlobal("token");
		console.log(this.teacherId);
		this.param['userId'] = this.userId;
		this.param['token'] = this.token;
		this.param['teacherId'] = this.teacherId;
		this.initData()
	}
	onDyLike(teacher){
		let loading = this.weui.showLoading("关注");
		this.comman.request("SA", "favour", {userId:this.userId, token:this.token, type:2, dataId:teacher.dynmaicId}, (data)=>{
			this.weui.hideLoading(loading);
			if(data.code==0){
				teacher.favour++;
			}
		})
	}
	timestampToTime(timestamp) {
	 	timestamp = timestamp *1;
		let date = new Date(timestamp),
		Y = date.getFullYear() + '-',
		M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
		D = date.getDate()<10?'0'+date.getDate()+ ' ':date.getDate()+' ',
		h = date.getHours()<10?'0'+date.getHours() + ':':date.getHours()+ ':',
		m = date.getMinutes()<10?'0'+ date.getMinutes()+ ':':date.getMinutes()+ ':',
		s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
		return Y+M+D;
    }
	initData(){
	  this.comman.request("SA", "teacherDetail", this.param, (data) => {
			if(data.code == 0) {
				console.log(data);
				this.teacherInfo = data.teacherInfo;
				this.filePath = data.filePath;
				this.teacherArr = data.dynamicList;
				for(let i = 0;i < this.teacherArr.length;i++){
					if(this.teacherArr[i].type == 1){
						if(this.teacherArr[i].pics!=undefined && this.teacherArr[i].pics!=""){
							this.teacherArr[i].picsArr = this.teacherArr[i].pics.split(',');
						}else{
							this.teacherArr[i].picsArr = [];
						}
					    console.log(this.teacherArr[i].picsArr)
					}else{
						this.teacherArr[i].isImgError = false;
						this.teacherArr[i].typename = this.teacherArr[i].name;
					    this.teacherArr[i].smallPic =  this.teacherArr[i].smallPic;
					}
				}
				
			} else {
				this.weui.showAlert("获取数据失败", data.msg, "确定");
			}
		}, (err) => {
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
	ionViewDidEnter() {

	}
	subscribeFn(num){ //关注未关注
		let Mn = '';
		let myLoading:any;
		if(num == 1){
			Mn = 'unSubscribeTeacher';
			myLoading = this.weui.showLoading("取消关注");
		}else{
			Mn = 'subscribeTeacher';
			myLoading = this.weui.showLoading("关注");
		}
		
		 this.comman.request("SA", Mn, this.param, (data) => {
		 	this.weui.hideLoading(myLoading);
			if(data.code == 0) {
				this.weui.showToast(data.msg);
				if(num == 1){
					this.teacherInfo.subscribe = 0;
				}else{
					this.teacherInfo.subscribe = 1;
				}
			} else {
				this.weui.showAlert("获取数据失败", data.msg, "确定");
			}
		}, (err) => {
			this.weui.hideLoading(myLoading);
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			} else if(err == '10099') {
				if(this.checkMask()) {
					this.login();
				}
			}
		})	
	}
	isShowAllpage(){
		this.isShowAllContent = !this.isShowAllContent;
	}
	/*点击分享按钮弹出层*/
	shareFn_title(){
		let SharePopModal = this.modalCtrl.create(SpecialSharePopPage,{});
		SharePopModal.present();
		SharePopModal.onDidDismiss((data)=>{
			console.log(data)
			if(data.isshareFriend){
			    this.shareFn(0);
			}
			if(data.isshareCircle){
				this.shareFn(1);
			}
		});
		
		
	}
	shareFn(mode){
		let shareURL = "http://my.saclass.com/app/new-teacher-home.html?id=" + this.teacherId;
		let shareIcon =  this.filePath + this.teacherInfo.pic;
		let articleTitle = this.teacherInfo.teacherName + '老师的主页';
		let summary = '特优生 · 为世界创造有用人才';
		this.WxsharePage.shareWx(
			articleTitle,
			summary,
			mode,
			shareURL,
			1,
			shareIcon,
			()=>{
		   		//
			}
		)
		console.log({url:shareURL, title:articleTitle, icon:shareIcon, summary:summary});
	}
	/*NG生命周期*/
	ngAfterViewInit() {
		let winWidth = this.plt.width();
	}
}