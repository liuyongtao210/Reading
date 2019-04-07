import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events  } from 'ionic-angular';
import { commanModel } from '../../model/comman/comman';
/**
 * Generated class for the ChapterDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { ReadArticlePage } from '../read-article/read-article';
import { ExercisePage } from '../exercise/exercise';
import { ClassPieviewPage } from '../class-pieview/class-pieview';
import { BilingualismPage } from '../bilingualism/bilingualism';
import { ArticleDetailPage } from '../article-detail/article-detail';

@Component({
  selector: 'page-chapter-detail',
  templateUrl: 'chapter-detail.html',
})
export class ChapterDetailPage {
userId:any;
token:any;
chapterData:any=[];
getParm:any;
totalFinish:number=0;
detailData:any;
colorArr:any=["#5bb4ba","#002d5f","#dc4851","#7fa8fa","#8acc51","#f3d718","#d325d5"];
  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public commanModel:commanModel,
  	public events: Events,
  	public WeuiModel:WeuiModel,
  ) {
	  	this.userId=this.commanModel.getGlobal("userId");
	  	this.token=this.commanModel.getGlobal("token")
	  	this.getParm=this.navParams.get("data");
	  	this.events.subscribe('user:created', (data, time)=>{
	  		if(data=="finish"){
		    		this.initData(false);
		    }
	  	});
  }
  
goReadArticle(){
	this.navCtrl.push(ReadArticlePage)
}
goExercise(){
	this.navCtrl.push(ExercisePage)
}
goClasspieview(){
	this.navCtrl.push(ClassPieviewPage)
}
goPage(e){
	console.log(e)
	var data={
				sourseId:e.sourseId,
				dataType:e.dataType,
				seriesId:this.getParm.seriesId,
				classId:this.getParm.classId,
				progress:e.progress,
				name:e.name
			}
	switch (e.dataType){
		case 10 :// 去直播页
		
		break ;
		
		case 11 ://习题页面
		this.navCtrl.push(ExercisePage,{data:data});
		break ;
		case 12 ://直播
		
		break ;
		case 13 ://PPT 双语译文
		this.navCtrl.push(BilingualismPage,{data:data})
		break ;
		
		case 14 ://文章详情 章节介绍 跳到公共页
		this.navCtrl.push(ArticleDetailPage,{id:data.sourseId, nolike:1})
		if(data.progress!=100){
			this.saveUserStudyRecord(data);
			e.progress=100;
		}
		break ;
		case 15 ://单词组  课前预习
		this.navCtrl.push(ClassPieviewPage,{data:data})
		break ;
		case 16 ://章节内容  阅读文章  语音讲解
		this.navCtrl.push(ReadArticlePage,{data:data})
		break ;
	}		 
}
saveUserStudyRecord(parm){
	this.commanModel.request("SASchool","saveUserStudyRecord",{//保存学习进度
		userId: this.userId,
		token: this.token,
		seriesId:parm.seriesId,
		classId:parm.classId,
		sourceId:parm.sourseId,
		progress:100
	},(data)=>{
		if(data.code==0){
			console.log("完成了")
		}
	})
}
getDetailData(e){
	this.commanModel.request("Course","getCourseDetails",{
		id:e.sourseId,
		dataType:e.dataType,
		originType:9,
	},(data)=>{
		if(data.code==0){
			this.getDetailData=data;
		}
	})
}
initData(showloading){
	let loading;
	if(showloading){
		loading =this.WeuiModel.showLoading("加载中...")
	}
	this.commanModel.request("Course","getClassChildList",{
		userId:this.userId,
		token:this.token,
		seriesId:this.getParm.seriesId,
		classId:this.getParm.classId,
		originType:9,
		payType:1	
	},(data)=>{
		if(data.code==0){
			if(showloading){
				this.WeuiModel.hideLoading(loading)
			}
			console.log(data)
			this.chapterData=data.list;
			for(var i=0;i<data.list.length;i++){
				if(data.list[i].progress==100){
					this.totalFinish++
				}
			}
			console.log(this.chapterData)
		}
	})
}
  ionViewDidLoad() {
    this.initData(true);
  }
  
  ngOnDestroy(){
  	this.events.unsubscribe('user:created');
  }

}
