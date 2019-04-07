import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  userId: string = "";
  token: string = "";
  inputContent: string = "";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private weui: WeuiModel,
    private common: commanModel
    ) {
      this.userId = this.common.getGlobal("userId");
      this.token = this.common.getGlobal("token");
  }

  ionViewDidLoad() {
    
  }

  onSubmitTap(){
    this.inputContent = this.inputContent.trim();
    if(this.inputContent!=""){
      console.log(this.inputContent);
      let loading = this.weui.showLoading("提交中");
      this.common.request("SA", "saveFeedback", {
        userId:this.userId, 
        token:this.token, 
        title: "我的意见反馈",
        content:this.inputContent
      }, (data)=>{
        this.weui.hideLoading(loading);
        if(data.code==0){
          this.toast("提交成功，感谢你的支持");
          this.navCtrl.pop();
        }else{
          this.toast("提交失败："+data.msg);
        }
      }, (err)=>{
        this.weui.hideLoading(loading);
        if(err=="ajaxError"){
          this.toast("网络错误，请检查你的网络");
        }else if(err="10099"){
          this.toast("登录已失效，请返回重新登录");
        }
      });
    }else{
      this.toast("请输入意见内容");
    }
  }

  toast(msg){
    this.weui.showToast(msg, {position:"middle"});
  }

}
