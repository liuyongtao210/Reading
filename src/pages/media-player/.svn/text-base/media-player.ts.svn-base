import { Component,Input  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MediaPlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-media-player',
  templateUrl: 'media-player.html',
})
export class MediaPlayerPage {
 @Input() audioSrc:any='';
currentTime:any="00:00";
playerAudio:any;
isPlay:boolean=false;
lineWidth:any=0;
currentWidth:any=0;
currentLeft:any=0;
difWidth:any=10;
isDrap:boolean=false;
drapDistance:any=null;
isCanPlayer:boolean=false;
totalTime:any=0;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams
  ) {
  	
  }
initAudio(){
	this.playerAudio=document.getElementById('playerAudio')
	this.lineWidth=document.getElementById('progress_box').offsetWidth
}
oncanplay(e){
	this.isCanPlayer=true;
}
loadedmetadata(){
	this.totalTime=this.formateDate(this.playerAudio.duration)
}
timeupdate(e){
	if(!this.isDrap){
		this.currentTime=this.formateDate(e.target.currentTime)
		this.currentLeft=(e.target.currentTime/this.playerAudio.duration)*this.lineWidth
	}
}
playerFn(){
	if(this.isPlay==true){
		this.isPlay=false;
		this.playerAudio.pause()
	}else{
		if(this.isCanPlayer){
			this.isPlay=true;
			this.playerAudio.play()
		}
	}
}
playerOver(e){
	this.isPlay=false
}
startFn(e){
	this.isDrap=true;
}
moveFn(e){
	if(this.isDrap){
		if(this.drapDistance==null){
			this.drapDistance=e.changedTouches[0].clientX;
		}else{
			var moveLeft=e.changedTouches[0].clientX;
			var offX =moveLeft-this.drapDistance;
			this.currentLeft=this.currentLeft+offX
			this.drapDistance=moveLeft
			
			if(this.currentLeft<=0){
				this.currentLeft=0
			}
			if(this.currentLeft>=this.lineWidth){
				this.currentLeft=this.lineWidth
			}
			this.currentTime=this.formateDate((this.currentLeft/this.lineWidth)*this.playerAudio.duration);
		}
	}
}
endFn(e){
	this.isDrap=false;
	this.drapDistance=null;
	this.playerAudio.currentTime=(this.currentLeft/this.lineWidth)*this.playerAudio.duration
}
tapFn(e){
	console.log(e)
}
 formateDate(min:number){
	min=Math.round(min);
	var m =parseInt(min/60+"");
	var s=parseInt(min-m*60+"");
	var mins ;
	var str;
	if(m<1){
		mins ="00"
	}else{
		mins =m;
	}
	if(s<10){
		str="0"+s;
	}else{
		str=s;
	};
	return mins+':'+str;
}
 ionViewDidLoad() {
    console.log('ionViewDidLoad MediaPlayerPage');
    
  }
ngAfterViewInit(){
	this.initAudio()
}
}
