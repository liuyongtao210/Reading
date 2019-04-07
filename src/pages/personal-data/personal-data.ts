import { Component } from '@angular/core';
import {IonicApp, NavController, ModalController, Events, Platform, ActionSheetController } from 'ionic-angular';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { citiesModel } from '../../model/cities/cities';
import { LoginModal } from '../modal-login/modal-login';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
	selector: 'page-personal-data',
	templateUrl: 'personal-data.html'
})
export class personalDataPage {
	personalInfo: any = {};
	userId: string = '';
	token: string = '';
	sexArr: any = [];
	cities: any = [];
	province: string = '';
	city: string = '';
	area: string = '';
	headImg:string = '';
	constructor(
		private ionicApp: IonicApp,
		public events: Events,
		public modalCtrl: ModalController,
		private plt: Platform,
		public navCtrl: NavController,
		private weui: WeuiModel,
		private comman: commanModel,
		private citiesmodel: citiesModel,
		private actionSheetCtrl: ActionSheetController,
		private transfer: FileTransfer,
		private camera: Camera
	) {
		this.initData();
	}
	
	Removedomain(url) { //图片转换把域名剔除
		let header = url.indexOf("//");  
		var headerStart = header + 2;  
		let resource = url.substring(headerStart, url.length);
		console.log(resource);
		let str = resource;  
		let next = resource.indexOf("/");  
		let result = resource.substring(0, next);
		str = str.substring(result.length + 1, str.length);  
		return str;
	}
	//图片加载失败时触发
	errFn(e) {
		console.log(e)
		this.personalInfo.userImg = 'assets/imgs/mine/mine-avatar.png';
	}
	changeAvatarData() {
		let userBirthdayTime = this.personalInfo['date'];
		console.log(userBirthdayTime)
		let timer: any;
		if(userBirthdayTime == '请选择') {
			timer = '';
		} else {
			let userBirthdayArr = userBirthdayTime.split('');
			for(let i = 0; i < userBirthdayArr.length; i++) {
				if(userBirthdayArr[i] == '年' || userBirthdayArr[i] == '月') {
					userBirthdayArr[i] = '/';
				} else if(userBirthdayArr[i] == '日') {
					userBirthdayArr[i] = '';
				}
			}
			userBirthdayArr = userBirthdayArr.join('');
			timer = new Date(userBirthdayArr).getTime()
		}
		let param = {
			userId: this.userId,
			token: this.token,
			gender: this.personalInfo['sex'] == '男' ? 1 : 2,
			nickName:  this.personalInfo.NickName,
			userBirthday: timer,
			province: this.province,
			city: this.city,
			area: this.area,
			//(后期放开) headImg:this.headImg
		};
		if(this.headImg!=''){
			param["headImg"] = this.headImg;
		}
		let myLoading: any;
		myLoading = this.weui.showLoading("保存中");
		this.comman.request("FrontUser", "updateUserInfo", param, (data) => {
			this.weui.hideLoading(myLoading);
			if(data.code == 0) {
				console.log(data)
				this.weui.showAlert("保存成功", "", "确定");
				this.events.publish("userinfo-updated", this.personalInfo);
			} else {
				this.weui.showAlert("保存失败", data.msg, "确定");
			}
		}, (err) => {
			this.weui.hideLoading(myLoading);
			if(err == "ajaxError") {
				this.weui.showAlert("保存失败", "请手机检查网络", "关闭");
			} else if(err == '10099') {
				if(this.checkMask()) {
					this.login();
				}

			}
		})
	}

	changeAvatar() {
		let actionSheet = this.actionSheetCtrl.create({
			title: '上传头像',
			buttons: [{
				text: '拍照',
				role: 'destructive',
				handler: () => {
					this.photoStart()
				}
			}, {
				text: '从相册选择',
				role: 'destructive',
				handler: () => {
					this.filePhoto();
				}
			}, {
				text: '取消',
				role: 'cancel',
				handler: () => {

				}
			}]
		});
		actionSheet.present();
	}

	//拍照
	photoStart() {
		this.callCamera(this.camera.PictureSourceType.CAMERA);
	}
	//相册选取
	filePhoto() {
		this.callCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
	}
	//Camera插件通用方法
	callCamera(sourceType){
		const options: CameraOptions = {
			quality: 80,//照片质量
			destinationType: this.camera.DestinationType.FILE_URI, //照片路径类型
			encodingType: this.camera.EncodingType.JPEG, //照片文件后缀名
			mediaType: this.camera.MediaType.PICTURE, //媒体类型：照片、视频或全部
			sourceType: sourceType //拍照或相册
		}
		this.camera.getPicture(options).then((imageData) => {
			// imageData is either a base64 encoded string or a file URI
			// If it's base64 (DATA_URL):
			//let base64Image = 'data:image/jpeg;base64,' + imageData;
			this.upload(imageData);
		}, (err) => {
			//this.weui.showToast(err, {position:"middle"});
		});
	}

	getCreateURLStr() {
		var obj = {
			md5: "true",
			signCode: "wordLearning"
		};
		var server_url = this.comman.createURLStr("File", "upload", obj);
		return server_url;
	}
	/*上传图片*/
	upload(filePath) {
		let myLoading: any = this.weui.showLoading("上传中");
		let imgFileTypeArray = filePath.split(".");
		let len = imgFileTypeArray.length;
		let imgFileType = imgFileTypeArray[len - 1];
		let options: FileUploadOptions = {
			fileKey: 'file',
			fileName: 'name.' + imgFileType,
			httpMethod: 'POST',
			mimeType: 'image/jpeg',
		}
		let url = this.getCreateURLStr();
		const fileTransfer: FileTransferObject = this.transfer.create();
		fileTransfer.upload(filePath, url, options)
			.then((data) => {
				this.weui.hideLoading(myLoading);
				var obj = JSON.parse(data.response);
				if(obj.code==0){
					//this.weui.showAlert(obj.fileName, obj.path, "知道了");
					this.personalInfo.userImg = obj.path+obj.fileName;
					this.headImg = obj.fileName;
					this.changeAvatarData();
				}else{
					this.weui.showAlert("上传错误", obj.msg, "确定");
				}
			}, (err) => {
				this.weui.hideLoading(myLoading);
				this.weui.showToast('图片上传失败', "err:" + err + "exception:" + err.exception + "body:" + err.body, '确定');
			})
	}

	useWebUpload(){
		let loading;
		this.comman.uploadFile(10, (success, filename, url)=>{
			this.weui.hideLoading(loading);
			if(success){
				console.log(filename, url);
				this.personalInfo.userImg = url;
				this.headImg = filename;
				this.changeAvatarData();
			}else{
				this.weui.showAlert("上传失败", "上传失败了", "确定");
			}
		}, ()=>{
			loading = this.weui.showLoading("上传中");
		}, "jpg,png,jpeg");
	}

	commonSaveFn(msg) {
		let options = {
			position: "middle"
		}
		this.weui.showToast('msg', options);
	}
	/*保存*/
	save() {
		this.changeAvatarData();
	}
	/*返回上一页*/
	backPage() {

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
		loginModalCtrl.onDidDismiss((data) => {
			if(data.isLogin) {
				this.initData();
			}
		});
	}
	initData() {
		this.personalInfo['userImg'] = '../assets/imgs/personal-data/avatar.png';
		this.personalInfo['NickName'] = '';
		this.personalInfo['name'] = '请填写';
		this.personalInfo['sex'] = '请选择';
		this.personalInfo['date'] = '请选择';
		this.initSex();
	}
	initSex() {
		this.sexArr = [{
			name: 'sex',
			options: [{
					text: '男',
					value: '男'
				},
				{
					text: '女',
					value: '女'
				},
			]
		}];
		this.cities = this.citiesmodel.chineseCities();
		this.getUserInfo();
	}

	getUserInfo() {
		this.userId = this.comman.getGlobal("userId");
		this.token = this.comman.getGlobal("token");
		this.comman.getUserInfo((success, data)=>{
			if(success){
				this.personalInfo.userImg = data.userImg;
				this.personalInfo.name = data.userName != '' ? data.userName : '请填写';
				this.personalInfo.NickName =  data.nickName;
				if(data.userBirthday!=undefined && data.userBirthday!=null && data.userBirthday!=""){
					this.personalInfo.date = this.timestampToTime(data.userBirthday);
				}else{
					this.personalInfo.date = '请选择';
				}
				this.province = data.province;
				this.city = data.city;
				this.area = data.area;
				this.personalInfo.sex = data.gender && data.gender == 1 ? '男' : data.gender && data.gender == 2 ? '女' : '';
			}else{
				this.weui.showAlert("获取个人信息失败", data.msg, "确定");
			}
		});
	}
	timestampToTime(timestamp) {
		if(timestamp == '') {
			return
		} else {
			timestamp = timestamp * 1;
			let date = new Date(timestamp),
				Y = date.getFullYear() + '年',
				M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月',
				D = date.getDate() < 10 ? '0' + date.getDate() + '日' : date.getDate() + '日',
				h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':',
				m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':',
				s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
			return Y + M + D;
		}

	}
	changeText(e, num) {
		if(num == 0) { //性别
			this.personalInfo['sex'] = e['sex'].value;
		} else if(num == 2) { //地区
			let arr = [];
			for(let key in e) {
				arr.push(e[key].text);
			};
			console.log(arr);
			this.province = arr[0];
			this.city = arr[1];
			this.area = arr[2];
		} else { //生日
			let {
				year,
				month,
				day
			} = e;
			this.personalInfo['date'] = `${year}年${month}月${day}日`;
		}
	}
}