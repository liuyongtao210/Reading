import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { TeacherIndexPage } from '../teacher-index/teacher-index';
//import { Jq } from '../../assets/js/jquery-1.12.0.min.js';

//declare var $;

/**
 * Generated class for the MyFollowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-my-follow',
	templateUrl: 'my-follow.html',
})
export class MyFollowPage {
	List: any = []; //教师数据
	filePath:string = "";
	
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private weui: WeuiModel,
		private comman: commanModel,
	) {}

	//生命周期函数 当页面加载完成之后触发
	ionViewWillEnter() {
		this.getMySubTeacher();
	}

	getMySubTeacher(){
		var param = {
			token: this.comman.getGlobal('token'),
			userId: this.comman.getGlobal('userId'),
			page: 0,
			size: 50
		}
		this.comman.request('SA', 'mySubscribeTeacher', param, (data) => {
			if(data.code==0){
				this.filePath = data.filePath;
				this.List = data.list;
			}else{
				this.weui.showAlert("获取失败", data.msg, "确定");
			}
		}, (err) => {
			if(err=="10099"){
				this.weui.showAlert("获取失败", "登录失效，请重新登录", "确定");
			}else{
				this.weui.showAlert("获取失败", "网络错误", "确定");
			}
		})
	}

	onTeacherTap(teacher){
		this.navCtrl.push(TeacherIndexPage, {teacherId:teacher.teacherId});
	}

	click(item, index, event) {
		event.stopPropagation();
		this.weui.showAlert("确定取消关注吗", "取消关注后可能无法及时获悉老师的最新动态", "取消", "确定", ()=>{}, ()=>{
			let loading = this.weui.showLoading("操作中");
			var param = {
				token: this.comman.getGlobal('token'),
				userId: this.comman.getGlobal('userId'),
				teacherId: item.teacherId
			}
			this.comman.request('SA', 'unSubscribeTeacher', param, (data) => {
				this.weui.hideLoading(loading);
				if(data.code==0){
					this.getMySubTeacher();
				}else{
					this.weui.showAlert("取消关注失败", data.msg, "确定");
				}
			})
		})
	}

}