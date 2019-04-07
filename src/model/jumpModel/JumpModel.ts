import { Injectable } from '@angular/core';
import { App, Platform, ModalController } from 'ionic-angular';
import { H5DetailPage } from '../../pages/h5-detail/h5-detail';
import { ArticleDetailPage } from '../../pages/article-detail/article-detail';
import { ChapterListPage } from '../../pages/chapter-list/chapter-list';
import { LoginModal } from '../../pages/modal-login/modal-login';
import { TeacherThemePage } from '../../pages/teacher-theme/teacher-theme'; //老师列表
import { ActivityPage } from '../../pages/activity/activity'; //活动列表
import { FeedbackPage } from '../../pages/feedback/feedback'; //意见反馈
import { commanModel } from '../comman/comman';
import { TeacherIndexPage } from '../../pages/teacher-index/teacher-index';
import { NewThingsPage } from '../../pages/new-things/new-things';
import { ReadArticlePage } from '../../pages/read-article/read-article';
import { LivePage } from '../../pages/live/live';
import { CourseDetailPage } from '../../pages/course-detail/course-detail';
import { MyInvitePage } from '../../pages/my-invite/my-invite';
import { MyBookPage } from '../../pages/my-book/my-book';
import { MyFollowPage } from '../../pages/my-follow/my-follow';
import { personalDataPage } from '../../pages/personal-data/personal-data';
import { CoursesPaidPage } from '../../pages/courses_paid/courses_paid';

@Injectable()

export class JumpModel {
	//
	constructor(
		private plt: Platform,
		private app:App,
		private modalCtrl: ModalController,
		private common: commanModel
	) {

	}

	isLogin(){
		let userId = this.common.getGlobal("userId");
		return (userId!="" && userId!=undefined && userId!=null);
	}

	goLogin(callback) {
		let loginModalCtrl = this.modalCtrl.create(LoginModal, {});
		loginModalCtrl.present();
		loginModalCtrl.onDidDismiss((data)=>{
			if(data.isLogin){
				callback();
			}
		});
	}
	
	//页面跳转通用方法
	//mode: 0-无跳转   1-H5详情页   2-App内跳转
	//link: 跳转的url
	jumpTo(mode, link, title?, summary?, icon?){
		if(mode==2){
			this.jumpToApp(link);
		}else if(mode==1){
			this.jumpToH5(link, title, summary, icon);
		}
	}

	//跳转H5详情页
	jumpToH5(link, title?, summary?, icon?){
		var param = {url:link};
		if(title) param["title"] = title;
		if(summary) param["summary"] = summary;
		if(icon) param["icon"] = icon;
		this.app.getActiveNav().push(H5DetailPage, param);
	}

	//跳转App内页面
	jumpToApp(link){
		var path = link.split("?")[0];
		var obj = this.analysisParam(link);
		switch(path){
			case "app://home": //首页
				if(!this.app.getActiveNav().canGoBack()){
					this.app.getActiveNav().parent.select(0);
				}
				break;
			case "app://reading": //阅读
				if(!this.app.getActiveNav().canGoBack()){
					this.app.getActiveNav().parent.select(1);
				}
				break;
			case "app://course": //课程
				if(!this.app.getActiveNav().canGoBack()){
					this.app.getActiveNav().parent.select(2);
				}
				break;
			case "app://live": //云课堂
				if(!this.app.getActiveNav().canGoBack()){
					this.app.getActiveNav().parent.select(3);
				}
				break;
			case "app://mine": //我的
				if(!this.app.getActiveNav().canGoBack()){
					this.app.getActiveNav().parent.select(4);
				}
				break;
			case "app://news-detail": //文章详情
				this.app.getActiveNav().push(ArticleDetailPage, obj);
				break;
			case "app://feedback": //意见反馈
				if(this.isLogin()){
					this.app.getActiveNav().push(FeedbackPage);
				}else{
					let ctrl = this.app.getActiveNav();
					this.goLogin(()=>{
						ctrl.push(FeedbackPage);
					});
				}
				break;
			case "app://activity-list": //活动列表
				this.app.getActiveNav().push(ActivityPage);
				break;
			case "app://teacher-list": //大咖（老师）列表
				this.app.getActiveNav().push(TeacherThemePage);
				break;
			case "app://teacher-detail": //老师主页
				if(this.isLogin()){
					this.app.getActiveNav().push(TeacherIndexPage, {teacherId:obj["id"]});
				}else{
					let ctrl = this.app.getActiveNav();
					this.goLogin(()=>{
						ctrl.push(TeacherIndexPage, {teacherId:obj["id"]});
					});
				}
				break;
			case "app://news-list": //新鲜事（文章）列表
				this.app.getActiveNav().push(NewThingsPage);
				break;
			case "app://reading-chapter": //精读章节列表
				if(this.isLogin()){
					this.app.getActiveNav().push(ChapterListPage, {data:obj["id"]});
				}else{
					let ctrl = this.app.getActiveNav();
					this.goLogin(()=>{
						ctrl.push(ChapterListPage, {data:obj["id"]});
					});
				}
				break;
			case "app://reading-free": //畅读详情
				if(this.isLogin()){
					this.app.getActiveNav().push(ReadArticlePage, {data:obj["id"], type:2});
				}else{
					let ctrl = this.app.getActiveNav();
					this.goLogin(()=>{
						ctrl.push(ReadArticlePage, {data:obj["id"], type:2});
					});
				}
				break;
			case "app://live-detail": //直播课详情
				if(this.isLogin()){
					this.app.getActiveNav().push(LivePage, obj);
				}else{
					let ctrl = this.app.getActiveNav();
					this.goLogin(()=>{
						ctrl.push(LivePage, obj);
					});
				}
				break;
			case "app://course-detail": //录播课详情
				if(this.isLogin()){
					this.app.getActiveNav().push(CourseDetailPage, obj);
				}else{
					let ctrl = this.app.getActiveNav();
					this.goLogin(()=>{
						ctrl.push(CourseDetailPage, obj);
					});
				}
				break;
			case "app://my-invite": //我的邀请
				if(this.isLogin()){
					this.app.getActiveNav().push(MyInvitePage);
				}else{
					let ctrl = this.app.getActiveNav();
					this.goLogin(()=>{
						ctrl.push(MyInvitePage);
					});
				}
				break;
			case "app://my-detail": //我的个人信息
				if(this.isLogin()){
					this.app.getActiveNav().push(personalDataPage);
				}else{
					let ctrl = this.app.getActiveNav();
					this.goLogin(()=>{
						ctrl.push(personalDataPage);
					});
				}
				break;
			case "app://my-order": //我的已购列表
				if(this.isLogin()){
					this.app.getActiveNav().push(CoursesPaidPage);
				}else{
					let ctrl = this.app.getActiveNav();
					this.goLogin(()=>{
						ctrl.push(CoursesPaidPage);
					});
				}
				break;
			case "app://my-like": //我的关注
				if(this.isLogin()){
					this.app.getActiveNav().push(MyFollowPage);
				}else{
					let ctrl = this.app.getActiveNav();
					this.goLogin(()=>{
						ctrl.push(MyFollowPage);
					});
				}
				break;
			case "app://my-collect": //我的收藏
				if(this.isLogin()){
					this.app.getActiveNav().push(MyBookPage);
				}else{
					let ctrl = this.app.getActiveNav();
					this.goLogin(()=>{
						ctrl.push(MyBookPage);
					});
				}
				break;
		}
	}

	analysisParam(paramstr){
		var arr = paramstr.split("?");
		var obj = {};
		if(arr.length>1){
			var parr = arr[1].split("&");
			for(var i=0; i<parr.length; i++){
				var varr = parr[i].split("=");
				obj[varr[0]] = varr[1];
			}
		}
		return obj;
	}

}