import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { Vibration } from '@ionic-native/vibration';
import { PayTutorPage } from '../pay-tutor/pay-tutor';
import { WxsharePage } from '../../model/wxshare/wxshare'; //分享

declare var aliPayPlugins: any; //自定义插件：支付宝支付插件
declare var commandPlugins: any; //自定义插件：苹果支付

@IonicPage()
@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html',
})
export class PayPage {
  @ViewChild("myqrcode") qrcode: any;
  wechat:any= (<any>window).Wechat;
  userId:string;
  token:string;
  payType:number = 0; //支付类型：5-微信   8-支付宝   6-苹果支付
  wxAppId:string = "wx8b64ccf4a7cc1992"; //微信开放平台AppId
  partnerNo:string = "1516979951"; //微信商户号
  wxPayAPIKey:string = "6CD1F5A3CE889816D9B1E534AB2FF856"; //微信商户平台支付API安全密钥
  orderNumber:string = "";
  appleCode:string = ""; //苹果商品ID
  appleOrderData:string = ""; //苹果支付返回的订单数据
  orderDetail:any = {};
  isIOS: boolean = false;
  cancelApplePay: boolean = false;
  h5PayUrl: string = "http://my.saclass.com/app/app-pay.html?orderNumber=";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private weui: WeuiModel,
    private common: commanModel,
    private platform: Platform,
    private vibration: Vibration,
    private wxshare: WxsharePage,
    private viewCtrl: ViewController
    ) {
      this.userId = this.common.getGlobal("userId");
      this.token = this.common.getGlobal("token");
      var orderNo = this.navParams.get("orderNumber");
      if(orderNo!=null && orderNo!=undefined){
        this.h5PayUrl += orderNo;
        this.orderNumber = orderNo;
        this.getOrderDetail();
      }
      this.isIOS = this.platform.is("ios");
  }

  getOrderDetail(callback?){
    let loading = this.weui.showLoading("获取订单");
    this.common.request("Order", "checkOrderDetails", {
      userId:this.userId, 
      token:this.token,
      orderId:this.orderNumber
    }, (data)=>{
      this.weui.hideLoading(loading);
      if(data.code==0){
        if(data.orderList==undefined){
          this.weui.showAlert("获取订单失败", "无效的订单号", "", "确定");
          return;
        }
        for(var i=0; i<data.orderList.length; i++){
          this.appleCode = data.orderList[i].appleCode;
          if(data.orderList[i].cusGoodsName==undefined || data.orderList[i].cusGoodsName==""){
            data.orderList[i].cusGoodsName = data.orderList[i].courseName;
          }
          if(data.orderList[i].cusGoodsPic==undefined || data.orderList[i].cusGoodsPic==""){
            data.orderList[i].cusGoodsPic = data.orderList[i].courseImg;
          }
        }
        this.orderDetail = data;
        if(callback!=undefined && callback!=null){
          callback();
        }
      }else{
        this.weui.showAlert("获取订单失败", data.msg, "", "确定");
      }
    }, (err)=>{
      this.weui.hideLoading(loading);
      if(err=="ajaxError"){
        this.weui.showAlert("获取订单失败", "网络错误，请检查你的网络设置", "", "确定");
      }else if(err=="10099"){
        this.weui.showAlert("获取订单失败", "登录失效，请返回重新登录", "", "确定");
      }
    });
  }

  onWxTap(){
    this.payType = 5;
    this.realPay();
  }

  onZfbTap(){
    this.payType = 8;
    this.realPay();
  }

  onApplyPay(){
    this.payType = 6;
		if(this.platform.is('cordova')){
      if(this.appleCode!="" && this.appleCode!=null && this.appleCode!=undefined){
        let loading:any = this.weui.showLoading("支付中");
        commandPlugins.callIAP(this.appleCode, (msg) => {
          this.weui.hideLoading(loading);
          var rd = msg.replace(/\s+/g, '');
          this.appleOrderData = rd;
          this.realPay();
        }, (error)=>{
          this.weui.hideLoading(loading);
          this.weui.showAlert("支付失败", error, "", "确定", ()=>{}, ()=>{
            this.cancelApplePay = true; //取消了苹果支付或者支付失败
          });
        });
      }else{
        this.weui.showToast("未返回苹果商品ID", {position:"middle"});
      }
		}else{
      console.log("appleCode: ", this.appleCode);
      this.cancelApplePay = true;
    }
  }

  shareToWx(mode){
    let qrcodeElement = this.qrcode.elementRef.nativeElement;
    let imgElement = qrcodeElement.querySelector("img");
    this.wxshare.imgShare(imgElement.src, ()=>{
      console.log("分享完成");
    }, mode);
  }

  onSharePayClose(){
    this.cancelApplePay = false;
  }

  onAppleTutorTap(){
    this.navCtrl.push(PayTutorPage);
  }

  realPay() {
		let myloading: any = this.weui.showLoading("处理订单");
		let param: any = {
			userId: this.userId,
			token: this.token,
			orderNumber: this.orderNumber,
			payType: this.payType,
      wxAppId: this.wxAppId,
      acash: 0,
			couId: ""
    };
    if(this.payType==6){
      param.receiptData = this.appleOrderData;
    }
		this.common.request("Pay", "goPayWeiXinOrAlipay", param, (data) => {
			this.weui.hideLoading(myloading);
			if(data.code == 0) {
				if(data.isZero != undefined) {
					this.onPaySuccess("免费订单无需支付");
				} else {
					if(this.payType==5){
            //--- Wechat Pay ---
						var timestamp = Math.round(data.timestamp/1000);
						this.doWechatPay(data.prePayId, data.nonce_str, timestamp);
          }else if(this.payType==8){
            //--- Alipay Pay ---
            if(data.alipayFormInfo==null || data.alipayFormInfo==undefined || data.alipayFormInfo==""){
							this.weui.showToast("支付宝支付发生错误", {position:"middle"});
						}else{
							this.doAliPay(data.alipayFormInfo);
						}
          }else if(this.payType==6){
            //--- Apple Pay ---
            this.onPaySuccess("苹果支付成功");
          }
				}
			} else {
				this.weui.showToast("订单处理失败："+data.msg, {position:"middle"});
			}
		}, (errorData) => {
			this.weui.hideLoading(myloading);
			if(errorData == "10099") {
				this.weui.showToast("登录失效，无法处理订单", {position:"middle"});
			} else if(errorData == "ajaxError") {
			  this.weui.showToast("网络连接错误", {position:"middle"});
			}
		});
  }

  doWechatPay(prePayId, nonce_str, timestamp){
    if(this.platform.is('cordova')){
      this.wechat.isInstalled((installed)=>{
        if(!installed){
          this.weui.showToast("未安装微信", {position:"middle"});
        }else{
          //参数组成字符串+支付密钥，按顺序排列
          let wx_sign = "appid="+this.wxAppId+
                        "&noncestr="+nonce_str+
                        "&package=Sign=WXPay"+
                        "&partnerid="+this.partnerNo+
                        "&prepayid="+prePayId+
                        "&timestamp="+timestamp+
                        "&key="+this.wxPayAPIKey;
          //md5加密，转换成大写
          wx_sign = this.common.tsMD5(wx_sign).toUpperCase();
          let params:any = {
              partnerid: this.partnerNo, //商户号
              prepayid: prePayId, //微信预订单号
              noncestr: nonce_str, //随机字符串
              timestamp: timestamp, //时间戳
              sign: wx_sign //签名sign
          };
          this.wechat.sendPaymentRequest(params, ()=>{
            this.onPaySuccess("微信支付成功");
         }, (err)=>{
            this.weui.showToast("微信支付失败："+err, {position:"middle"});
         })
        }
      }, (err)=> {
          this.weui.showToast("微信插件调用失败："+err, {position:"middle"});
      });
    }else{
      this.weui.showToast("请在手机上操作", {position:"middle"});
    }
  }
  
  doAliPay(alipayFormInfo){
    if(this.platform.is('cordova')){
			aliPayPlugins.aliPay(alipayFormInfo, (msg) => {
				this.onPaySuccess("支付宝支付成功");
			}, (err) => {
				this.weui.showToast("支付宝支付失败："+err, {position:"middle"});
			});
		}else{
      this.weui.showToast("请在手机上操作", {position:"middle"});
    }
  } 

  onPaySuccess(msg){
    this.orderDetail.orderStatus = 1;
    this.weui.showAlert("支付成功", msg, "", "确定", ()=>{}, ()=>{
      //支付成功，点击确定的回调：延时1秒返回，因为后台处理订单有延时
      let loading = this.weui.showLoading("处理中");
      setTimeout(()=>{
        this.weui.hideLoading(loading);
        //this.navCtrl.pop();
        this.viewCtrl.dismiss({"success":true});
      }, 2000);
    });
    this.vibration.vibrate(600);
  }

  onClose(){
    this.viewCtrl.dismiss({"success":false});
  }

  onCompletePay(){
    this.getOrderDetail(()=>{
      if(this.orderDetail.orderStatus==1){
        this.cancelApplePay = false;
        this.onPaySuccess("已完成支付");
      }else{
        this.weui.showToast("未支付，请重新支付", {position:"middle"});
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayPage');
  }

}
