import { Component, ViewChild, ElementRef, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { NavController,Content, ModalController, Platform } from 'ionic-angular';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';

@Component({
	selector: 'punch-card-date',
	templateUrl: 'punch-card-date.html'
})
export class PunchCardDateComponent {
	@ViewChild("dateDom") dateDom: ElementRef;
	weekHeight: number = 0;
	monthHeight: number = 0;
	slidesArr: any = [];
	IsInitData: boolean = true;
	dateHeight: number = 0;
	dateWidth: number = 0;
	winWidth: number = 0;
	winHeight: number = 0;
	year: any; //年
	month: any; //月
	weeks: any = []; //星期
	dayArray: any = []; //每个月有多少天包括格子
	@Input() set weekHeight_(weekHeight_: number) {
		this.weekHeight = weekHeight_;
	};
	@Input() set monthHeight_(monthHeight_: number) {
		this.monthHeight = monthHeight_;
	};
	@Input() set slidesArr_(slidesArr_: any) {
		console.log(slidesArr_)
		this.slidesArr = slidesArr_;
	};

	@Output() childEvent = new EventEmitter < any > ();
	constructor(
		public modalCtrl: ModalController,
		public navCtrl: NavController,
		private weui: WeuiModel,
		private ref: ChangeDetectorRef, //脏检查
		private comman: commanModel,
		public plt: Platform
	) {
	  	this.init();
	}
	
	/*处理滑块数组中的时间*/
	handleTime(arr,year,month){
		for(let o = 0;o<arr.length;o++){
			if(arr[o]['prev']){
				let m = month -1 <=0 ? 12 : month -1 >9 ?`${month-1}`: `0${month-1}`;
				arr[o]['wholeTime'] =`${year}-${m}-${arr[o]['data']}` 
			}else if(arr[o]['isCurrent']){
				let m = month <10 ? `0${month}`: `${month}`;
				arr[o]['wholeTime'] =`${year}-${m}-${arr[o]['data']}`
			}else if(arr[o]['next']){
				let m = month +1 >12 ? `01` : month > 9 ? month + 1 : '0' + (month + 1);
				arr[o]['wholeTime'] =`${year}-${m}-${arr[o]['data']}`
			}
			
		}
	}

	slideChanged(e, index) {
//		console.log(this.slidesArr)
		this.IsInitData = false;
		/*向右滑 pge ++*/
		if(e.direction == 2) {
			let obj_ = this.slidesArr[this.slidesArr.length - 1];
			let obj_month = obj_.month;
			let obj_year = obj_.year;
			let index_ = obj_.index;
			if(obj_month < 12) {  
				obj_month += 1
			} else {
				obj_year += 1;
				obj_month = 1;
			}
			let objNext = {}
			objNext['date'] = this.computedDay(obj_year, obj_month);
			
			objNext['month'] = obj_month;
			objNext['year'] = obj_year;
			objNext['index'] = index_ + 1;
			this.handleTime(objNext['date'],objNext['year'],objNext['month'])
			this.year = obj_year;
			this.month = obj_month;
			this.slidesArr.push(objNext);
			this.slidesArr = this.slidesArr.filter((item, _index) => {
				return _index != 0
			});
			this.slidesArr.map((item) => {
				return item.index -= 1;
			})
			console.log(this.slidesArr);
			this.setDateHeight();//这里重新计算下高度
			let _obj_ = {};
			_obj_['height'] = this.dateHeight;
			_obj_['arr'] = this.slidesArr;
			this.childEvent.emit(_obj_);
		}
		/*向左滑 pge --*/
		if(e.direction == 4) {
			let obj_ = this.slidesArr[0];
			let obj_month = obj_.month;
			let obj_year = obj_.year;
			let index_ = obj_.index;
			if(obj_month > 0 && obj_month != 1) {
				obj_month--;
			} else {
				obj_year--;
				obj_month = 12;
			}
			let objNext = {}
			objNext['date'] = this.computedDay(obj_year, obj_month);
			objNext['month'] = obj_month;
			objNext['year'] = obj_year;
			objNext['index'] = index_ - 1;
			this.handleTime(objNext['date'],objNext['year'],objNext['month'])
			this.year = obj_year;
			this.month = obj_month;
			this.slidesArr.unshift(objNext);
			this.slidesArr = this.slidesArr.filter((item, _index) => {
				return _index != this.slidesArr.length - 1;
			});
			this.slidesArr.map((item) => {
				return item.index += 1;
			})
            this.setDateHeight();//这里重新计算下高度
			let _obj_ = {};
			_obj_['height'] = this.dateHeight;
			_obj_['arr'] = this.slidesArr;
			this.childEvent.emit(_obj_);
			console.log(this.slidesArr)
		}
		

	}
	/*时间转换*/
	timestampToTime() {
		var date = new Date();
		var Y = date.getFullYear();
		//var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
		var M = date.getMonth() + 1;
		this.year = Y;
		this.month = M;
	}

	/*计算每月天数及上月补全下月补全*/
	computedDay(year_, month_) {
		let _date = new Date();
		let NowYear = _date.getFullYear();
		let NowMonth = _date.getMonth();
		let year = year_; //年
		let month = month_ - 1; //月
		let date = _date.getDate() //日
		let compuArr = [];
		let NowDate = new Date(year, month + 1, 0).getDate(); //这个月一共多少天
		for(let i = 1; i < NowDate + 1; i++) {
			let obj = {};
			obj['data'] = i <10 ? `0${i}` : i;
			obj['isCurrent'] = true; //当月
			obj['prev'] = false; //上月
			obj['next'] = false; //下月
			obj['minToday'] = i < _date.getDate() && this.year == NowYear && month == NowMonth ? 'AlreadyDay' : ''; //判断是否当前天之前

			obj['CurrDay'] = i == _date.getDate() && this.year == NowYear && month == NowMonth ? 'cur_' : i == _date.getDate() ? 'cur' : ''; //判断是否是当前天
			obj['txt'] = i == _date.getDate() && this.year == NowYear && month == NowMonth ? '今' : i;
			obj['AlreadyCard'] = ''; //已打卡
			compuArr.push(obj)
		}
		//上个月开始
		let lastCount = new Date(year, month, 0).getDate(); //上个月多少天
		let offDay = new Date(year, month, 1).getDay() == 0 ? 7 : new Date(year, month, 1).getDay();
		let offCount = 7 - (7 - offDay + 1); //有多少个格子
		let lastArr = [];
		for(let i = 1; i < lastCount + 1; i++) { //将数字转成数组形式
			let obj = {};
			obj['data'] = i <10 ? `0${i}` : i;
			obj['isCurrent'] = false;
			obj['prev'] = true; //上月
			obj['next'] = false; //下月
			obj['minToday'] = '';
			obj['CurrDay'] = '';
			obj['txt'] = obj['CurrDay'] == 'cur' ? '今' : i;
			obj['AlreadyCard'] = ''; //已打卡
			lastArr.push(obj)
		}
		lastArr.reverse(); //反转一下
		lastArr = lastArr.filter((item, index) => {
			return index < offCount
		});
		lastArr.reverse(); //这里需要再反转下
		//上个月结束

		//下个月开始
		let offCountNext;
		if(35 - lastArr.length - compuArr.length >= 0) { //如果能保证35个
			offCountNext = 35 - lastArr.length - compuArr.length; //下个月有多少个格子~
		} else {
			offCountNext = 42 - lastArr.length - compuArr.length;
		}
		let nextArr = [];
		for(let i = 1; i < offCountNext + 1; i++) { //因为下个月不可能都展示所以只需要遍历就成
			let obj = {};
			obj['data'] = i <10 ? `0${i}` : i;
			obj['isCurrent'] = false;
			obj['prev'] = false;
			obj['next'] = true; //下月
			obj['minToday'] = '';
			obj['CurrDay'] = '';
			obj['txt'] = obj['CurrDay'] == 'cur' ? '今' : i;
			obj['AlreadyCard'] = ''; //已打卡
			nextArr.push(obj);
		}
		compuArr.unshift(...lastArr); //~~把上个月的加上喽
		compuArr.push(...nextArr); //~~把下个月的加上喽
		//下个月结束
		this.dayArray = compuArr;
		return this.dayArray;
	}
	/*设置高度*/
	setDateHeight() {
		//this.dateHeight = this.dateDom.nativeElement.offsetHeight;
		let heighter = this.slidesArr[1].date.length;
		let conmputedHeight = heighter == 42 ? 300 : 250;
		this.dateHeight = 14 + 38 + 28 +20 + conmputedHeight;
		console.log(this.dateHeight)
		this.dateWidth = this.dateDom.nativeElement.offsetWidth;
		this.winWidth = this.plt.width(); //当前屏幕宽度
		this.winHeight = this.plt.height(); //当前屏幕高度
	}
	
	/*初始化函数*/
	init() {
		this.timestampToTime();
		this.weeks = ['一', '二', '三', '四', '五', '六', '日'];
        console.log(this.slidesArr)
       
	}
	/*NG生命周期*/
	ngAfterViewInit(){
		 this.setDateHeight();
	}

}