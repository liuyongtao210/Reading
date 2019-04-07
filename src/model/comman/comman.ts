import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { WeuiModel } from '../weuiModel/weuiModel';
declare var $;
@Injectable()
export class commanModel {
	// SA_URL: string = "http://192.168.1.235:8091/SAonline/centerCtrl/routeService.do"; //local 
	SA_URL: string = "http://test.saclass.com/businessService/centerCtrl/routeService.do";
	userId: string;
	token: string;
	globalVariableObj = {};
	constructor(
		//		private http: Http,
		private weui: WeuiModel
	) {

	}
	setGlobal(data) { 
		if(data.token != undefined && data.token != null && data.token != "") {
			this.token = data.token;
		}
		if(data.userId != undefined && data.userId != null && data.userId != "") {
			this.userId = data.userId;
		}
		for(var key in data) {
			if(key == "userIds") {
				key = "userId";
			}
			this.globalVariableObj[key] = data[key];
		}
	}
	getGlobal(key) {
		return this.globalVariableObj[key];
	}
	clearGlobal() {
		this.globalVariableObj = new Object();
	}
	request(serviceName: string, methodName: string, otherParam: any, successFunc: any, errorFunc ? : any, type ? : string, typeData ? : any) {
		/*
		 type:'get':'post'默认为get
		 typeData:post的数据
		 */
		var urlStr = this.createURLStr(serviceName, methodName, otherParam);
		console.log(urlStr);
		//		this.http.get(urlStr)
		//             .toPromise()
		//             .then(response => {
		//             		var data = eval("(" + response._body + ")");
		//             		if(data.code==10099){
		//             			
		//             		}else{
		//             			successFunc(data);
		//             		}
		//             	})
		//             .catch(this.handleError);
		var xhr = $.ajax({
			type: type == undefined ? "get" : type,
			timeout: 60000,
			url: urlStr,
			data: typeData,
			success: (str)=> {
				var json = eval("(" + str + ")");
				if(json.code == 10099) {
					if(errorFunc != null) {
						this.clearGlobal();
						errorFunc("10099");
					}
				} else {
					if(successFunc != null) {
						successFunc(json);
					}
				}
			},
			error: (str)=> {
				if(errorFunc != null) {
					errorFunc(str);
				}
				console.log("ajax请求失败" + str);
			}
		});
		return xhr;
	}
	handleError() {
		//		this.weui.showAlert("请求成功",data.msg,"关闭","确认");/

	}
	//创建请求的url
	createURLStr(serviceName, methodName, otherParam) {
		let data = {};
		data['sn'] = serviceName;
		data['mn'] = methodName;
		//		data.token = token;
		if(otherParam != null) {
			for(let key in otherParam) {
				if(key=="userId"||key=="token"){
					if(otherParam[key]==undefined){
						data[key] = "";
						this.setGlobal({'key':""});
					}else{
						data[key] = otherParam[key];
					}
				}else{
					data[key] = otherParam[key];
				}
			}
		}
		//		this.token = data.token;
		data['sign'] = this.createMD5Sign(data);
		let str = this.createVarsStrByObj(data);
		let urlStr = this.SA_URL + "?" + str;
		return urlStr;
	}

	//MD5验证加密
	createMD5Sign(data) {
		let paramArr = [];
		for(let key in data) {
			if(key != "info") {
				paramArr.push({
					key: key,
					value: data[key]
				});
			}
		}
		paramArr.sort(function(a, b) {
			return a.key > b.key ? 1 : -1;
		});
		var md5 = "";
		for(var i = 0; i < paramArr.length; i++) {
			md5 += paramArr[i].value;
		}
		md5 += "6783c950bdbf40aeac52042a9206e0ba";
		md5 = $.md5(md5);
		//		var MD5 = require('md5.js');
		//		console.log(MD5);
		//		md5 = new MD5().update(md5).digest('hex');
		return md5;
	}
	//把对象转换为字符串拼接
	createVarsStrByObj(obj) {
		let str = "";
		for(let key in obj) {
			let encodeKeyValue = encodeURIComponent(obj[key]);
			str += key + "=" + encodeKeyValue + "&";
		}
		str = str.slice(0, str.length - 1);
		return str;
	}
	tsMD5(mdData) {
		var md = $.md5(mdData);
		return md;
	}

	// ********** 常用的业务接口 ********** 

	//获取用户基本信息
	getUserInfo(callback?){
		let param = {
			userId:this.userId, 
			token:this.token
		}
		this.request("FrontUser", "getUserInfo", param, (data) => {
			if(data.code == 0) {
				if(callback){
					if(data.userImg!=undefined){
						if(data.userImg.indexOf("http://")==-1){
							data.userImg = data.filePath+data.userImg;
						}
					}else{
						data.userImg = "";
					}
					callback(true, data);
				}
			} else {
				callback(false, data.msg);
			}
		}, (err) => {
			if(err == "ajaxError") {
				callback(false, "网络错误");
			} else if(err == '10099') {
				callback(false, "登录失效");
			}
		})
	}

	//下单
	addOrder(goodsId, goodsName, goodsPic, dataId?, callback?){
		var orderModelJson = [{
			"goodsid": goodsId,
			"num": 1
		}];
		var param = {
			userId: this.userId,
			token: this.token,
			businessType: 10,
			orderModelJson: JSON.stringify(orderModelJson),
			cusGoodsName: goodsName,
			cusGoodsPic: goodsPic
		}
		if(dataId){
			param["dataId"] = dataId; //书籍（课程包Id）
		}
		this.request("Order", "addOrderCommon", param,(data)=>{
			if(data.code==0){
				if(callback!=undefined){
					callback(true, data.orderNumber);
				}
			}else{
				if(callback!=undefined){
					callback(false, data.msg);
				}
			}
		}, (err)=>{
			if(err=="ajaxError"){
				if(callback!=undefined){
					callback(false, "网络连接错误");
				}
			}
			if(err=="10099"){
				if(callback!=undefined){
					callback(false, "登录失效，无法下单");
				}
			}
		});
	}

	//支付
	realPay(orderNumber, callback?) {
		let param: any = {
			userId: this.userId,
			token: this.token,
			orderNumber: orderNumber,
			payType: 5,
			wxAppId: "",
			acash: 0,
			couId: ""
		};
		this.request("Pay", "goPayWeiXinOrAlipay", param, (data) => {
			if(data.code == 0) {
				if(data.isZero != undefined) {
					if(callback){
						console.log("***** 0元订单支付成功，延时1秒回调 *****");
						setTimeout(()=>{
							callback(true, 0); //success:true res:0 支付已完成（0元单）
						}, 2000);
					}
				}else{
					if(callback){
						callback(true, orderNumber); //success:true res:orderNumber 待支付
					}
				}
			} else {
				callback(false, data.msg);
			}
		}, (errorData) => {
				if(errorData == "10099") {
					callback(false, "登录已失效，请重新登录");
				} else if(errorData == "ajaxError") {
					callback(false, "忘了错误，请检查你的网络");
				}
			}
		);
	  }
	  
	  //购买书籍
	  buyBook(goodsId, bookId, bookName, bookIcon, callback?){
		this.addOrder(
			goodsId, 
			bookName, 
			bookIcon,
			bookId,
			(orderSuccess, result)=>{
				if(orderSuccess){
					this.realPay(result, callback);
				}else{
					if(callback){
						callback(false, "下单失败："+result);
					}
				}
			}
		);
	  }

	  //上传文件
	uploadFile(maxSize, successCallback, startCallback, extention){
		var form = $('<form method="post" enctype="multipart/form-data"></form>');
		var file = $('<input type="file" name="file" />');
		form.append(file);
		file.click();
		file.change((event)=>{
			var filePath = event.target.value;
			var fileObj = event.target.files[0];
			var fileSizeM = fileObj.size / 1024 / 1024;
			if(extention!=undefined && extention!=""){
				var earr = extention.split(",");
				var ext = fileObj.name.slice(fileObj.name.lastIndexOf(".")+1);
				if(earr.indexOf(ext)==-1){
					alert("文件格式只能是"+extention);
					return;
				}
			}
			if(fileSizeM > maxSize){
				alert("文件大小不能超过"+maxSize+"M");
				return;
			}
			startCallback();
			this.formUpload(form[0], (json)=>{
				if(json.code==0){
					successCallback(true, json.fileName, json.url);
				}else{
					successCallback(false, "", "");
				}
			});
		});
	}
	formUpload(form, callback){
		var obj = {md5:"true", signCode:"store"};
		var server_url = this.createURLStr("File", "upload", obj);
		form.action = server_url;
		console.log("上传文件...");
		$(form).ajaxSubmit({
			success:(str)=>{
				console.log("上传成功！");
				var json = JSON.parse(str);
				callback(json);
			}
		});
	}

}