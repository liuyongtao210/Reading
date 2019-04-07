import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams ,Slides ,Events } from 'ionic-angular';

/**
 * Generated class for the ExercisePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { WeuiModel } from '../../model/weuiModel/weuiModel';
//ExercisesResultPage
import { ExercisesResultPage } from '../exercises-result/exercises-result';
import { commanModel } from '../../model/comman/comman';
import { ChapterDetailPage } from '../chapter-detail/chapter-detail';


@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html',
})
export class ExercisePage {
@ViewChild(Slides) slides: Slides;
exercises:any=[];
correctNum:number=0;
resultShow=false;
userId:any;
token:any;
urlData:any;
curIndex:number=1;
progress:number=0;
letterArr:any=["A.","B.","C.","D.","E.","F.","G.","H.","I.","J.","K.","L.","M.","N.","O.","P.","Q.","R.","S.","T.","U.","V.","W.","X.","Y.","Z."];
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public commanModel:commanModel,
  	public WeuiModel:WeuiModel,
  	public events: Events
  ) {
  	this.userId=this.commanModel.getGlobal("userId");
  	this.token=this.commanModel.getGlobal("token");
  	this.urlData=this.navParams.get('data');
  	
  }

initDataTest(){//课后习题 解析出来的结构
	this.exercises=[
		{
			subject:"an unpleasant sound1111111", //题干
			answer:[//答案
				{
					answer:"答案一",
					isSelect:{//选择答案时候的样式  correct_answer:正确的样式  error_answer:错误的样式
						correct_answer:false,
						error_answer:false 
					},
					correct:true,//是否是正确答案 true:正确,false :不正确
				},
				{
					answer:"答案一",
					isSelect:{
						correct_answer:false,
						error_answer:false
					},
					correct:false
				},
				{
					answer:"答案一",
					isSelect:{
						correct_answer:false,
						error_answer:false
					},
					correct:false
				},
				{
					answer:"答案一",
					isSelect:{
						correct_answer:false,
						error_answer:false
					},
					correct:false
				}
			]
		}
	]
}

donotClick:boolean = false;

selectAnswer(it,i,lti){
	if(this.donotClick) return;
	this.donotClick = true;
	var index=i+1;
	this.exercises[i].answer[lti].isSelect.error_answer=true;
	for(var j=0;j<this.exercises[i].answer.length;j++){
		if(this.exercises[i].answer[j].correct==true){
			this.exercises[i].answer[j].isSelect.correct_answer=true;
			this.exercises[i].answer[j].isSelect.error_answer=false;
		}
	}
	if(it.correct==true){
		this.correctNum++
	}
	console.log(this.correctNum)
	setTimeout(()=>{
		this.slides.lockSwipes(false);
		this.slides.slideNext(0)
		this.donotClick = false;
		if(index==this.exercises.length){
			this.curIndex=index
		}else{
			this.curIndex=index+1
		}
		setTimeout(()=>{
			this.slides.lockSwipes(true);
		}, 10);
	},1000)
	
	if(i==this.exercises.length-1){
		setTimeout(()=>{
			this.resultShow=true;
		},1000)
		if(this.progress!=100){
			this.saveUserStudyRecord()
		}
	}
}

createUser(finish) {
  console.log('User created!')
  this.events.publish('user:created', finish, Date.now());
}

closeResult(e){
	this.resultShow=false;
	this.navCtrl.pop()
	e.preventDefault()
}
goExercisesResult(){
	console.log(this.exercises)
	this.navCtrl.push(ExercisesResultPage,{data:this.exercises})
}
saveUserStudyRecord(){
	this.commanModel.request("SA","saveUserStudyRecord",{//保存学习进度
			userId: this.userId,
			token: this.token,
			bookId:this.urlData.bookId,
			chapterId:this.urlData.chapterId,
			sourceId:this.urlData.sourceId,
			progress:100
	},(data)=>{
		if(data.code==0){
			console.log("完成了")
			let options = {
			position: "middle",
			duration: 2000,
			}
			this.WeuiModel.showToast("完成任务",options)
			this.events.publish('taskFinish',{chapterId:this.urlData.chapterId,sourceId:this.urlData.sourceId});
		}
	})
}
initData(){
	let loading =this.WeuiModel.showLoading("加载中...")
	console.log(this.urlData)
	this.progress=this.urlData.progress;//获取进度
	this.slides.lockSwipes(true);
//	if(this.progress==100){
//		this.resultShow=true;
//	}
	this.commanModel.request("SA","sourceInfo",{
		userId:this.userId,
	  	token:this.token,
     	sourceId:this.urlData.sourceId,
     	dataType:this.urlData.dataType,
	},(data)=>{
		if(data.code==0){
			this.WeuiModel.hideLoading(loading)
			console.log(data)
			for(var i=0;i<data.data.length;i++){
				var answerList=JSON.parse(data.data[i].content)
				console.log(answerList)
				var obj ={
					subject:"",
					answer:[]
				}
				obj.subject=answerList.stem;
				for(var j=0;j<answerList.options.length;j++){
					var listObj={
						answer:"",
						isSelect:{
							correct_answer:false,
							error_answer:false
						},
						correct:false
					};
					listObj.answer=this.letterArr[j]+"  "+answerList.options[j].content;
					if(answerList.answer[0]==j){
						listObj.correct=true;
					}else{
						listObj.correct=false; 
					}
					obj.answer.push(listObj);
				}
				this.exercises.push(obj);
			}
		}
	})
}
  ionViewDidLoad() {
//  this.initDataTest()
    this.initData();
	
  }

}
