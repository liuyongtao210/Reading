import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { commanModel } from '../../model/comman/comman';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
/**
 * Generated class for the NewThingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { ArticleDetailPage } from '../article-detail/article-detail';
@Component({
  selector: 'page-new-things',
  templateUrl: 'new-things.html',
})
export class NewThingsPage {
	
curCardIndex:number=-1;
userId:any;
token:any;
newsCardList:any=[];
newsListData:any=[];

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public commanModel:commanModel,
  	public WeuiModel:WeuiModel
  ) {
  	this.userId=this.commanModel.getGlobal("userId");
  	this.token=this.commanModel.getGlobal("token")
  }
selBookType(i,item){
	
	this.curCardIndex=i;
	if(item==-1){
		this.getNewsData();
	}else{
		this.getNewsData(item.id)
	}
}
getTags() { //获取标签: getTags
//	let loading = this.WeuiModel.showLoading("加载中...")
		this.commanModel.request('SA', 'getTags', { //书籍列表
			userId: this.userId,
			token: this.token,
			parentCode: "newsTag"
		}, (data) => {
//			this.WeuiModel.hideLoading(loading) ;
			
			if(data.code==0){
				this.newsCardList = data.tagsList
				console.log("newsTag", this.newsCardList)
			}
		})
	}
getNewsData(tagId?){
	var id='';
	if(tagId){
		id=tagId
	}else{
		id=""
	}
//	let loading = this.WeuiModel.showLoading("加载中...")
 	this.commanModel.request("SA","dailyInfoList",{
 			userId:this.userId,
		  	token:this.token,
		  	size:50,
		  	page:0,
		  	tagId:id
 	},(data)=>{
// 		this.WeuiModel.hideLoading(loading) ;
 		if(data.code==0){
 			this.newsListData=data.dailyInfoList;
 		}
 	})
}
goArticleDetailPage(item){
	console.log(item)
	this.navCtrl.push(ArticleDetailPage,{id:item.sourceId})
}
initData(){
	this.getTags();
	this.getNewsData();
}
//	每日资讯列表：
//sn=SA
//mn=dailyInfoList
//size、page
//@【系统消息】
  ionViewDidLoad() {
    console.log('ionViewDidLoad NewThingsPage');
    this.initData()
  }

}
