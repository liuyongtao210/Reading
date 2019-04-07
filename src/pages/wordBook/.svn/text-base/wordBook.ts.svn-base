import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NavController, Platform, ModalController,Events } from 'ionic-angular';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { LoginModal } from '../modal-login/modal-login';
@Component({
	selector: 'page-wordBook',
	templateUrl: 'wordBook.html'
})
export class wordBookPage {
	isShowHeader:boolean = false;//默认进来页面展示
	page: number = 0; //当前页面
	size: number = 20; //每页的条数
	total: number = 0; //总条数
	moreWords: string = '加载更多';
	src: string = ''; //播放的src
	words: any = []; //单词的数组总量
	componty: any; //完成
	manageFlag: boolean = false;
	headerHeight: number = 0;
	userId: string = '';
	token: string = '';
	isCheckAll: boolean = false; //是否全部选中
	deleteArr: any = []; //需要删除的数组
	sortTypeArr:any = [];//排序及其数组
	@ViewChild("audio") audio: ElementRef;
	@ViewChild("header") header: ElementRef;
	constructor(
		public events: Events,
		public modalCtrl: ModalController,
		public navCtrl: NavController,
		private weui: WeuiModel,
		private comman: commanModel,
		public plt: Platform,
		private ref: ChangeDetectorRef,
	) {
		this.checkUserInfo();
		this.initArr();
		this.initData();
	}
	/*管理*/
	manage() {
		this.manageFlag = !this.manageFlag;
	}
	/*返回上一页*/
	backPage() {
      this.isShowHeader = false;
	}

	/*点击选中某项*/
	clickEvent(index) {
		this.words[index].isClick = !this.words[index].isClick;
		//console.log(this.ref)
		this.words.some((item) => {
			if(!item.isClick) {
				this.isCheckAll = false;
				return
			}
		});
		for(let i = 0; i < this.words.length; i++) {
			if(!this.words[i].isClick) {
				this.isCheckAll = false;
				break
			} else {
				this.isCheckAll = true;

			}
		}
		this.ref.markForCheck(); //提示当前要被检测
		this.ref.detectChanges(); //检查和更检测程序,也可以进行局部的检测

	}

	/*点击全选*/
	checkAll() {
		this.isCheckAll = !this.isCheckAll;
		if(this.isCheckAll) {
			this.words.map((item, index) => {
				item.isClick = true;
			})
		} else {
			this.words.map((item, index) => {
				item.isClick = false;
			})
		}
	}

	/*移除生词本的状态*/
	removeWordStated() {
		console.log(this.words)
		for(let i = 0; i < this.words.length; i++) {
			if(this.words[i].isClick) {
				return true;
			}  
			if(i == this.words.length-1  && !this.words[i].isClick){
				return false;
			}
		}
	}

	/*移除生词本*/
	removeWord() {
		let idsArr = this.words.filter((item, index) => {
				return item.isClick
		})
		let idsArr_ = [];
		
		for(let i = 0;i<idsArr.length;i++){
			idsArr_.push(idsArr[i].id);
		}
		let ids = idsArr_.toString();
	    console.log(ids)
		let options = {
			position: "middle",
			duration: 1000,
			//			closeButtonText: "关闭"
		}
		if(this.words.length == 0) {
			this.weui.showToast("没有要移除的词本了", options);
		} else if(!this.removeWordStated()) {
			this.weui.showToast("请选择一个要删除的列表", options);
		} else {
			this.weui.showAlert('确定要删除吗','','取消','确认',()=>{
				
			},()=>{ //成功的回调
				this.deleteWordAjax(ids,()=>{
					this.initData();
					this.isCheckAll = false;
					this.manageFlag = false;
				})
			})
			
			
			
			
			
		}

	}

	/*点击小喇叭*/
	audioEvent(index) {
		console.log(this.audio)
		this.src = this.words[index].audioUrl;
		let rudio = this.audio.nativeElement;
		rudio.src = this.src;
		console.log(rudio)
		console.log(this.src)
		this.words.map((item) => {
			item.isPlay = false;
		})
		this.words[index].isPlay = true;
		rudio.play(0);
	}

	/*音频播放结束*/
	audioEnded() {
		this.words.map((item) => {
			item.isPlay = false
		})

	}
	
	/*删除接口*/
	deleteWordAjax(ids,callback){//第二个参数判断是成功之后的回调
		let myLoading: any = this.weui.showLoading("删除中");
		let param = {
			userId: this.userId,
			token: this.token,
			ids:ids,
		};
		this.comman.request("OReading", "delUserWords", param, (data) => {
			this.weui.hideLoading(myLoading);
			if(data.code == 0) {
				callback();
			} else {
				this.weui.showAlert("删除失败", data.msg, "确定");
			}
		}, (err) => {
			this.weui.hideLoading(myLoading);
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			} else if(err == '10099') {
				this.weui.showAlert("删除失败", "请先登录", "确定", );
			}
		})
	}

	/*删除某项*/
	deleteItem(i) {
		let id = this.words[i].id;
		this.deleteWordAjax(id,()=>{
		  this.initData();
		})
		
	}
	/*音频播放*/
	audioPlay() {

	}
	/*检查是否登录*/
	checkUserInfo() {
		var userId = this.comman.getGlobal("userId");
		var token = this.comman.getGlobal("token");
		console.log(userId);
		console.log(token);
		if(userId == "" || userId == null || userId == undefined || token == "" || token == null || token == undefined) {
			this.login();
		}
	}
	/*去登录*/
	login() {
		let loginModalCtrl = this.modalCtrl.create(LoginModal, {}, {});
		loginModalCtrl.present();
		loginModalCtrl.onDidDismiss((data)=>{
			if(data.isLogin){
			    this.initArr();
			    this.initData();
			}
		});
		
	}
	
	/*排序函数*/
	sortFn(index){
		if(this.sortTypeArr[index].isClick){
			this.sortTypeArr[index].sortType = !this.sortTypeArr[index].sortType;
			this.initData();
		}else{
			 this.sortTypeArr.map((item,index)=>{
				return item.isClick = false
			})
			this.sortTypeArr[index].isClick = true;
			this.initData();
		}
		
	}

	/*请求接口数据*/
	getDataAjax(getMoreStates?:boolean) {
		// let myLoading: any = this.weui.showLoading("数据获取中");
		let sortType = null;
		let sortName = null;
		for(let i = 0;i<this.sortTypeArr.length;i++){
			if(this.sortTypeArr[i].isClick){
			  sortType = this.sortTypeArr[i].sortType == false ? 1 : 2;
			  sortName = this.sortTypeArr[i].sortNumber;
			}
		}
		let param = {
			userId: this.userId,
			token: this.token,
			page: this.page,
			size: this.size,
			sortType:sortType, //默认是升序
			sortName: sortName, //默认是名称

		};
		this.comman.request("OReading", "getUserWords", param, (data) => {
			// this.weui.hideLoading(myLoading);
			if(data.code == 0) {
				console.log(data)
				this.total = data.total;
				if(getMoreStates) {
					for(var i = 0; i < data.list.length; i++) {
						this.words.push(data.list[i]);
					}
					this.componty.complete();
					if(this.words.length < this.total) {
						this.moreWords = "加载更多";
					} else {
						this.moreWords = "没有更多了";
					}
				} else {
					this.words = data.list;
				}
				for(let i = 0; i < this.words.length; i++) {
					this.words[i].isPlay = false;
					this.words[i].isClick = false;
				}

			} else {
				this.weui.showAlert("获取数据失败", data.msg, "确定");
			}
		}, (err) => {
			// this.weui.hideLoading(myLoading);
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			} else if(err == '10099') {
				this.weui.showAlert("获取数据失败", "请先登录", "确定", );
			}
		})
	}
	/*初始化数据*/
	initArr(){
		this.sortTypeArr = [
		  {
		  	sortType:false,
		  	sortName:'字母排序',
		  	sortNumber:1,
		  	isClick:true,//默认按照字母排序
		  },
		  {
		  	sortType:false,
		  	sortName:'时间排序',
		  	sortNumber:2,
		  	isClick:false,
		  }
		];
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

	/*查看更多*/
	loadMore() {
		if(this.words.length < this.total) {
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

	/*NG生命周期---当dom加载完成后执行*/
	ionViewDidEnter() {
		this.isShowHeader = true;
		console.log(this.header)
		this.headerHeight = this.header['nativeElement']['clientHeight'];
		console.log(this.header['nativeElement']['clientHeight'])
	}
	ionViewWillLeave(){
		this.isShowHeader = false;
	}
}