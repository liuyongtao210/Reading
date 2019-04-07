import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { commanModel } from '../../model/comman/comman';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { WxsharePage } from '../../model/wxshare/wxshare'; //分享
import { SpecialSharePopPage } from '../../pages/share_pop/share_pop';//分享模态框
import { TeacherIndexPage } from '../../pages/teacher-index/teacher-index'; //教师详情页面
import { PayPage } from '../../pages/pay/pay'; //支付页面
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@IonicPage()
@Component({
  selector: 'page-course-detail',
  templateUrl: 'course-detail.html',
})
export class CourseDetailPage {

  userId:string = "";
  token:string = "";

  sourceId:string = "";
  courseList:any = [];
  currentIndex:number = 0;
  bookInfo:any = {};
  course:any = {};
  videoUrl:string = "";
  mode:number = 0; //0-课程简介 1-视频列表
  filePath:string = "";
  singleVideo:boolean = false;
  isFullscreen:boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private common: commanModel,
    private weui: WeuiModel,
    public wx:WxsharePage,
    public modalCtrl: ModalController,
    private plt: Platform,
    public screenOrientation: ScreenOrientation
    ) {
      //constructor
      this.userId = this.common.getGlobal("userId");
      this.token = this.common.getGlobal("token");
      this.sourceId = this.navParams.get("id");
      if(this.navParams.get("sinvideo")!=undefined){
        this.singleVideo = true;
        var item = {
          sourceId: this.sourceId,
          sourceName: "录播课程"
        }
        this.courseList.push(item);
        this.loadCourseDetail();
      }else{
        this.loadChaterList();
      }
  }

  loadChaterList(){
    this.common.request("SA", "chapterList", 
      {
        userId:this.userId, 
        token:this.token, 
        type:3, 
        bookId:this.sourceId
      }, 
      (data)=>{
      if(data.code==0){
        this.filePath = data.filePath;
        if(data.bookInfo==undefined){
          this.log("没有课程详情");
          return;
        }
        this.bookInfo = data.bookInfo;
        for(var i=0; i<data.data.length; i++){
          var item = data.data[i];
          if(item.type==12){
            this.courseList.push(item);
          }
        }
        if(this.courseList.length>0){
          this.loadCourseDetail();
        }else{
          this.log("该课程包内没有课程");
        }
      }else{
        this.log(data.msg);
      }
    }, (err)=>{
      if(err=="10099"){
        this.log("登录失效，请重新登录");
      }else{
        this.log("网络错误");
      }
    })
  }

  onCourseTap(item, index){
    if(this.singleVideo) return;
    if(this.bookInfo.isBuy!=1){
      this.weui.showToast("请先购买", {position:"middle"});
      return;
    }
    if(index != this.currentIndex){
      this.currentIndex = index;
      this.loadCourseDetail();
    }
  }

  loadCourseDetail(){
    this.common.request("SA", "sourceInfo", 
      {
        userId:this.userId, 
        token:this.token, 
        dataType:12, 
        sourceId:this.courseList[this.currentIndex].sourceId
      }, 
      (data)=>{
      if(data.code==0){
        this.filePath = data.filePath;
        if(data.data.length>0){
          var obj = data.data[0];
          obj["pptList"] = obj.files.split(",");
          this.course = obj;
          if(this.singleVideo || this.bookInfo.isBuy==1){
            this.getVideoByCCID();
          }else{
            if(this.bookInfo.price<=0){
              this.weui.showAlert("Amazing!", "这个课程免费，抓紧机会学习吧！", "", "知道啦", ()=>{}, ()=>{
                this.onBuyTap();
              })
            }
          }
          if(this.singleVideo){
            this.bookInfo = {bookName:obj.sourceName, thumb:obj.smallPic};
          }
        }else{
          this.log("当前选集没有课程内容");
        }
      }else{
        this.log(data.msg);
      }
    }, (err)=>{
      if(err=="10099"){
        this.log("登录失效，请重新登录");
      }else{
        this.log("网络错误");
      }
    })
  }

  getVideoByCCID(){
    let loading = this.weui.showLoading("获取视频内容");
    this.common.request('Video', 'getVideoUrlByCcId', {ccId:this.course.ccid}, (data)=>{
      this.weui.hideLoading(loading);
      if(data.code==0){
        console.log("<CC视频URL获取成功>", data.url.videoUrl);
        this.videoUrl = data.url.videoUrl;
      }else{
        this.log(data.msg);
      }
    }, (err)=>{
      this.weui.hideLoading(loading);
      if(err=="10099"){
        this.log("登录失效，请重新登录");
      }else{
        this.log("网络错误");
      }
    });
  }

  onBuyTap(){
		if(this.bookInfo.isBuy==-1){ //未购买
      if(this.bookInfo.goodsId==undefined){
        this.weui.showAlert("无法获取课程", "没有返回商品Id", "确定");
        return;
      }
      let loading = this.weui.showLoading("获取课程");
      this.common.buyBook(this.bookInfo.goodsId, this.bookInfo.bookId, this.bookInfo.bookName, this.bookInfo.smallPic, (success, res)=>{
        this.weui.hideLoading(loading);
        this.toPaybook(success, res);
      });
    }else if(this.bookInfo.isBuy==0){ //待支付
      if(this.bookInfo.orderNumber==undefined){
        this.weui.showAlert("无法获取课程", "没有返回待支付订单号", "确定");
        return;
      }
      let loading = this.weui.showLoading("处理课程");
      this.common.realPay(this.bookInfo.orderNumber, (success, res)=>{
        this.weui.hideLoading(loading);
        this.toPaybook(success, res);
      })
    }
	}
	toPaybook(success, res){
		if(success){
			if(res==0){
				this.bookInfo.isBuy = 1;
        //buy success to do ...
        this.getVideoByCCID();
			}else{
				this.bookInfo.isBuy = 0;
				this.bookInfo.orderNumber = res;
				let payModel = this.modalCtrl.create(PayPage, {orderNumber: res});
				payModel.present();
				payModel.onDidDismiss((data)=>{
					if(data.success){
						this.bookInfo.isBuy = 1;
            //buy success to do ...
            this.getVideoByCCID();
					}
				})
			}
		}else{
			this.weui.showAlert("获取课程错误", res, "确定");
		}
	}

  log(msg){
    this.weui.showAlert("获取视频失败", msg, "确定");
  }

  gotoTeacherDetail(){
    this.navCtrl.push(TeacherIndexPage, {teacherId:this.course.teacherId});
  }

  onShareTap(){
		let SharePopModal = this.modalCtrl.create(SpecialSharePopPage,{});
		SharePopModal.present();
		SharePopModal.onDidDismiss((data)=>{
			console.log(data)
			if(data.isshareFriend){
			    this.doShare(0);
			}
			if(data.isshareCircle){
				this.doShare(1);
			}
		});
	}
	
	doShare(mode){
    let shareURL = "http://my.saclass.com/app/new-Video-details.html?id="+this.sourceId;
    if(this.singleVideo){
      shareURL += "&single=1";
    }
		let shareIcon = this.bookInfo.thumb;
		this.wx.shareWx(
			this.bookInfo.bookName,
			"特优生精品课程邀您来体验",
			mode,
			shareURL,
			1,
			shareIcon,
			()=>{
		   		//分享成功
			}
		)
		console.log({url:shareURL, title:this.bookInfo.bookName, summary:"特优生精品课程邀您来体验", icon:shareIcon});
	}

  ionViewDidLoad() {
    this.navCtrl.swipeBackEnabled = false;
  }
  ionViewWillLeave() {
    //
  }
  ionViewDidLeave() {
    this.navCtrl.swipeBackEnabled = true;
  }

  videoLoadedActive(event){
    //console.log("videoLoadedActive", event);
  }

  videoActive(event){
    //console.log("videoActive", event);
  }

  fullscreenEvent(event){
    this.isFullscreen = event.isFullscreen;
  }

}
