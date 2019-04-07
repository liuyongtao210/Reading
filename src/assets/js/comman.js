var SA_URL;
if(location.href.indexOf("https") != -1) {
	SA_URL = "https://test.saclass.com/businessService/centerCtrl/routeService.do";
} else {
	SA_URL = "http://test.saclass.com/businessService/centerCtrl/routeService.do";
}
var SA_URL =  "http://192.168.1.119:8091/SAonline/centerCtrl/routeService.do"; //local 
//var SA_URL="http://192.168.1.161:8080/SAonline/centerCtrl/routeService.do";
//var SA_URL="http://192.168.1.234/SAonline/centerCtrl/routeService.do";
//var SA_URL="http://192.168.1.207:8080/SAonline/centerCtrl/routeService.do";
//var SA_URL="http://192.168.1.200:8080/SAonline/centerCtrl/routeService.do";
//var SA_URL="http://192.168.1.112:8091/SAonline/centerCtrl/routeService.do";//再飞
//var SA_URL="http://192.168.1.120/SAonline/centerCtrl/routeService.do";
//var SA_URL="http://192.168.1.234/SAonline/centerCtrl/routeService.do";//yp
//var SA_URL="http://192.168.1.200:8080/SAonline/centerCtrl/routeService.do";//xc

var userInfo = null;


//var token = getCookie("token");
var token = null;

var loginModuleContainerID = "login-module-container";

var globalVariableObj = {};
export function setGloble(data) {
	if(data.token!=undefined&&data.token!=null&&data.token!=""){
		token = data.token;
	}
	
	for(var key in data) {
		if(key=="userIds"){
			key="userId";
		}
		globalVariableObj[key] = data[key];
	}
}
export function getGloble(key){
	return globalVariableObj[key];
}
export function clearGloble() {
	globalVariableObj = new Object();
}
//发送get请求-基于jquery
export function request(serviceName, methodName, otherParam, successFunc,errorFunc,type,typeData){
//	console.log(SA_URL);
//	console.log(serviceName + " : " + methodName);
//	console.log(otherParam);
	var urlStr = createURLStr(serviceName, methodName, otherParam);
	var xhr = $.ajax({
		type: type==undefined?"get":type,		
		timeout: 60000,
		url: urlStr,
		data:typeData,
		success: function(str) {
			var json = eval("(" + str + ")");
//			console.log(json);
//			console.log("======================================");
			if(json.code == 10099) {
//				clearCookie("userId");
//				clearCookie("token");
//				userID = null;
//				token = null;
//				userInfo = null;
				if(errorFunc != null) {
					clearGloble();
					errorFunc("10099");
					
				}
			} else {
				if(successFunc != null) {
					successFunc(json);
				}
			}
		},
		error: function(str) {
			if(errorFunc != null) {
				errorFunc(str);
			}
			console.log("ajax请求失败"+str);
		}
	});
	return xhr;
}

//创建jsonp请求数据
export function jsonp(actionName, param, successFunc){
	showLoad("加载习题");
	var jsonurl = SA_URL + actionName + ".do?callback=callback&" + createVarsStrByObj(param);
	$.ajax({
		type: "get",
		async: false,
		url: jsonurl,
		dataType: "jsonp",
		jsonpCallback: "callback",
		success: function(json) {
//			console.log(json);
			if(successFunc != null) {
				successFunc(json);
			}
		},
		error: function() {
			//showAlert("数据加载失败！", "跨域请求，已被浏览器阻止！", "");
		}
	});
}

//创建请求的url
export function createURLStr(serviceName, methodName, otherParam) {
	var data = {};
	data.sn = serviceName;
	data.mn = methodName;
	data.token = token;
	if(otherParam != null) {
		for(var key in otherParam) {
			data[key] = otherParam[key];
		}
	}
	token = data.token;
//	console.log(data);
	data.sign = createMD5Sign(data);
	var str = createVarsStrByObj(data);
	var urlStr = SA_URL + "?" + str;
//	console.log(urlStr);
	return urlStr;
}

//MD5验证加密
function createMD5Sign(data) {
	var paramArr = [];
	for(var key in data) {
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
	return md5;
}
export function tsMD5(mdData) {
	var md = $.md5(mdData);
	return md;
}
//把对象转换为字符串拼接
export function createVarsStrByObj(obj) {
	var str = "";
	for(var key in obj) {
		var encodeKeyValue = encodeURIComponent(obj[key]);
		str += key + "=" + encodeKeyValue + "&";
	}
	str = str.slice(0, str.length - 1);
	return str;
}

//js获取location.href的参数的方法
function getQuery(para) {
	var reg = new RegExp("(^|&)" + para + "=([^&]*)(&|$)");
	var search = decodeURIComponent(window.location.search);
	var r = search.substr(1).match(reg);
	if(r != null) {
		return unescape(r[2]);
	}
	return null;
}

function replaceQuery(para, value) {
	var search = decodeURIComponent(window.location.search);
	if(search == "") {
		search = "?" + para + "=" + value;
	} else if(search.indexOf(para) == -1) {
		search += "&" + para + "=" + value
	} else {
		var reg = new RegExp(para + "=[^&]*");
		search = search.replace(reg, para + "=" + value);
	}
	return search;
}

//读取cookies
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if(arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}

//写入N小时cookie
function setCookie(name, value, Hours) {
	var exp = new Date();
	exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

//清除cookie  
function clearCookie(name) {
	setCookie(name, "", -1);
}

//派发事件
var dispatch = function(ele, type) {
	if(document.all) {
		// IE浏览器支持fireEvent方法
		ele.fireEvent('on' + type, evt)
	} else {
		// 其他标准浏览器使用dispatchEvent方法
		var evt = document.createEvent('HTMLEvents');
		// initEvent接受3个参数：
		// 事件类型，是否冒泡，是否阻止浏览器的默认行为
		evt.initEvent(type, true, true);
		ele.dispatchEvent(evt);
	}
};

//上传文件
export function uploadFile(maxSize, successFunc, startuploadFunc, extention) {
	var form = $('<form method="post" enctype="multipart/form-data"></form>');
	var file = $('<input type="file" name="file" />');
	form.append(file);
	file.click();
	file.change(function() {
		var filePath = this.value;
		var fileObj = $(this)[0].files[0];
		var fileSizeM = fileObj.size / 1024 / 1024;
		if(extention != undefined && extention != "") {
			var earr = extention.split(",");
			var ext = fileObj.name.slice(fileObj.name.lastIndexOf(".") + 1);
			if(earr.indexOf(ext) == -1) {
				alert("文件格式只能是" + extention);
				return;
			}
		}
		if(fileSizeM > maxSize) {
			alert("文件大小不能超过" + maxSize + "M");
			return;
		}
		fileSizeM = fileSizeM.toFixed(1);
		if(startuploadFunc != null) {
			startuploadFunc();
		}
		formUpload(form[0], function(json) {
			if(json.code == 0) {
				if(successFunc != null) {
					successFunc(json.fileName, json.url, fileObj.name);
				}
			} else {
				//showAlert(json.msg);
			}
		});
	});
}
//上传文件
export function uploadFileByImagePicker(filePath,maxSize, successFunc, startuploadFunc, extention) {
	var form = $('<form method="post" enctype="multipart/form-data"></form>');
	var file = $('<input type="file" name="file" value="'+filePath+'" />');
	form.append(file);
		var filePath = filePath;
		var fileObj = $(this)[0].files[0];
		var fileSizeM = fileObj.size / 1024 / 1024;
		if(extention != undefined && extention != "") {
			var earr = extention.split(",");
			var ext = fileObj.name.slice(fileObj.name.lastIndexOf(".") + 1);
			if(earr.indexOf(ext) == -1) {
				alert("文件格式只能是" + extention);
				return;
			}
		}
		if(fileSizeM > maxSize) {
			alert("文件大小不能超过" + maxSize + "M");
			return;
		}
		fileSizeM = fileSizeM.toFixed(1);
		if(startuploadFunc != null) {
			startuploadFunc();
		}
		formUpload(form[0], function(json) {
			if(json.code == 0) {
				if(successFunc != null) {
					successFunc(json.fileName, json.url, fileObj.name);
				}
			} else {
				//showAlert(json.msg);
			}
		});
}
export function formUpload(form, func) {

	var obj = {
		md5: "true",
		signCode:"talkmiao"
	};
	var server_url = createURLStr("File", "upload", obj);
	form.action = server_url;
	console.log("上传文件...");
	$(form).ajaxSubmit({
		success: function(str) {
			console.log("上传成功！");
			var json = JSON.parse(str);
			console.log(json.path + json.fileName);
			console.log(json);
			if(func != null) {
				func(json);
			}
		}
	});
}
export function getCreateURLStr(type){
	if(type==undefined||type==""||type==null){
		type="";
	}
	var obj = {
		md5: "true",
		signCode:"wordLearning"
	};
	var server_url = createURLStr("File", "upload", obj);	
	return server_url;
}