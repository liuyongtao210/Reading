import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { trigger, state, style, animate, transition } from '@angular/animations';

/**
 * Generated class for the IonVideoPlayerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
/** 使用示例：
 *	属性：【src:资源】【poster:预览图】【videoWidth、videoHeight：视频宽高】 【audioSrc：视频同步的音频资源，后台播放使用】
 * 	事件：【active：监控video的实时状态】
 * 		videoInfoObject={
 * 			isPlay:boolean,
 * 			isLoading:boolean,
 * 			isFullscreen:boolean,
 * 			durationTime:number,
 * 			currentTime:number,
 * 			videoCurrentWidth:number,
 * 			videoCurrentHeight:number,
 * 		}
 * 	事件：【loadedActive：监控video的加载完成状态】
 * 		videoInfoObject={
 * 			isPlay:boolean,
 * 			isLoading:boolean,
 * 			isFullscreen:boolean,
 * 			durationTime:number,
 * 			currentTime:number,
 * 			videoCurrentWidth:number,
 * 			videoCurrentHeight:number,
 * 		}
 * <ion-video-player 
 * 		src="http:xxxxx.mp4"
 * 		poster="http://xxxxxx.png"
 * 		videoWidth="100%" 
 * 		videoHeight="300px" 
 * 		(loadedActive)="videoLoadedActive($event)"
 * 		(active)="videoActive($event)">
 * </ion-video-player>
 * */
@Component({
	selector: 'ion-video-player',
	templateUrl: 'ion-video-player.html',
	animations: [
		//进场离场
		trigger('controlBarState', [
			state('false', style({
				transform: 'translate(0,100%)'
			})),
			state('true', style({
				transform: 'translate(0,0)'
			})),
			transition('true => false', animate('220ms ease-in')),
			transition('false => true', animate('220ms ease-out'))
		])
	]
})
export class IonVideoPlayerComponent {
	@Input('src') videoSrc: string;
	@Input('poster') videoPoster: string;
	@Input() audioSrc: string;
	@Input() videoWidth: string;
	@Input() videoHeight: string;
	@Output() active: EventEmitter < any > = new EventEmitter < any > ();
	@Output() loadedActive: EventEmitter < any > = new EventEmitter < any > ();
	@Output() fullscreenEvent: EventEmitter < any > = new EventEmitter < any > ();
	videoStyles: {};
	videoProgress: string = 'translate(-100%,0)';
	videoProgressBall: string = "translate(0,0)";
	videoDom: any;
	videoCurrentWidth:number = 0;
	videoCurrentHeight:number = 0;
	videoMinHeight:string = "56.25vw";
	currentTime: number = 0;
	durationTime: number = 0;
	isPlay: boolean = false;
	isLoading: boolean = false;
	isFullscreen: boolean = false;
	isPan: boolean = false;
	isBarShow: boolean = true;
	TIMESHOW: number = 3;
	showBarTimeCount: number = 3;
	showBarTimeOut: any;
	isShowBarTimeCount: boolean = false;
	videoInfoObject = {}
	isEnded:boolean = false;
	isBuffer:boolean = false;
	//audio
	currentTime_audio: number = 0;
	durationTime_audio: number = 0;
	isPlay_audio: boolean = false;
	isLoading_audio: boolean = false;
	isEnded_audio:boolean = false;
	isBuffer_audio:boolean = false;
	audioFile: any;
	audioPosition:any;
	hasAudioFile:boolean = false;
	constructor(
		private screenOrientation: ScreenOrientation,
		public plt: Platform
	) {
		this.setActiveData();
	}
	sendActive() {
		this.setActiveData();
		var data = new Object();
		for(let x in this.videoInfoObject) {
			data[x] = this.videoInfoObject[x];
		}
		this.active.emit(data);
	}
	sendLoadedActive() {
		this.videoMinHeight = "auto";
		this.setActiveData();
		var data = new Object();
		for(let x in this.videoInfoObject) {
			data[x] = this.videoInfoObject[x];
		}
		this.loadedActive.emit(data);
	}
	setActiveData() {
		this.videoInfoObject['isPlay'] = this.isPlay;
		this.videoInfoObject['isLoading'] = this.isLoading;
		this.videoInfoObject['isEnded'] = this.isEnded;
		this.videoInfoObject['isFullscreen'] = this.isFullscreen;
		this.videoInfoObject['durationTime'] = this.durationTime;
		this.videoInfoObject['currentTime'] = this.currentTime;
		this.videoInfoObject['videoCurrentWidth'] = this.videoCurrentWidth;
		this.videoInfoObject['videoCurrentHeight'] = this.videoCurrentHeight;
	}
	loadstart(ev) {
		if(this.videoSrc!=""){
			this.isLoading = true;
			this.sendActive();
		}
	}
	durationchange(ev){
		this.videoDom = ev.target;
	}
	loadedmetadata(ev) {
		this.videoCurrentWidth = ev.target.videoWidth;
		this.videoCurrentHeight = ev.target.videoHeight;
		this.isLoading = false;
		this.videoDom = ev.target;
		if(this.audioSrc){
			this.videoDom.volume = 0;
		}
		this.durationTime = ev.target.duration;
		this.sendLoadedActive();
	}
	timeupdate(ev) {
			this.isBuffer = false;
		try {
			if(this.videoDom != undefined) {
				this.durationTime = this.videoDom.duration;
				this.currentTime = this.videoDom.currentTime;
				var barWidth = ev.target.parentElement.children[2].children[1].offsetWidth;
				if(!this.isPan) {
					var percent = (this.currentTime / this.durationTime) * 100;
					this.videoProgress = "translate(" + (percent - 100) + "%,0)";
					this.videoProgressBall = "translate(" + (percent * barWidth / 100) + "px,0)";
				}
				if(this.isBarShow && !this.isShowBarTimeCount) {
					this.isShowBarTimeCount = true;
					this.checkBarShow(1);
				}
				this.sendActive();
			}
		} catch(e) {
			//TODO handle the exception
		}
	}
	waiting(ev){
		this.isBuffer = true;
		if(this.hasAudioFile){
			this.audioFile.pause();
		}
	}
	canplay(ev){
		this.isBuffer = false;
		this.doPlay();
	}
	ended(ev) {
		this.isPlay = false;
		this.isBarShow = true;
		this.isEnded = true;
		this.sendActive();
	}
	showControlBar(ev) {
		this.showBarTimeCount = this.TIMESHOW;
		if(ev.target.className == "myVideoComponentBox" || ev.target.className == "myVideoComponent") {
			if(this.isBarShow) {
				this.isBarShow = false;
			} else {
				this.isBarShow = true;
			}
		} else {
			this.isBarShow = true;
		}
	}
	playVideo() {
		if(this.videoSrc=="") return;
		if(this.isPlay&&this.isPlay_audio) {
			this.doPause();
		} else {
			this.doPlay();
		}
	}
	doPlay(){
		if(this.hasAudioFile){
			this.audioFile.play();
		}
		this.videoDom.play();
		this.isPlay = true;
		this.isBuffer = true;
		this.isPlay_audio = true;
		this.isBuffer_audio = true;
		this.isShowBarTimeCount = false;
	}
	doPause(){
		if(this.hasAudioFile){
			this.audioFile.pause();
		}
		this.videoDom.pause();
		this.isPlay = false;
		this.isBuffer = false;
		this.isPlay_audio = false;
		this.isBuffer_audio = false;
		this.checkBarShow(0);
	}

	checkBarShow(type) {
		if(type == 1) {
			this.showBarTimeOut = setTimeout(() => {
				this.showBarTimeCount--;
				if(this.showBarTimeCount < 0 && this.isPlay) {
					this.isBarShow = false;
					this.isShowBarTimeCount = false;
				} else {
					if(this.isPlay) {
						this.checkBarShow(1);
					}
				}
			}, 1000);
		} else {
			clearTimeout(this.showBarTimeOut);
			this.isShowBarTimeCount = false;
		}
	}
	formatTime(value) {
		if(!value){
			return '00:00';
		}
		var theTime = Math.floor(value); // 秒 
		var theTime1 = 0; // 分 
		var theTime2 = 0; // 小时 
		if(theTime > 60) {
			theTime1 = Math.floor(theTime / 60);
			theTime = Math.floor(theTime % 60);
			if(theTime1 > 60) {
				theTime2 = Math.floor(theTime1 / 60);
				theTime1 = Math.floor(theTime1 % 60);
			}
		} 
		var result;
		var h = theTime2 < 10 ? '0' + Math.floor(theTime2) : Math.floor(theTime2);
		var m = theTime1 < 10 ? '0' + Math.floor(theTime1) : Math.floor(theTime1);
		var s = theTime < 10 ? '0' + Math.floor(theTime) : Math.floor(theTime);
		if(theTime2 > 0) {
			result = h + ":" + m + ":" + s;
		} else {
			result = m + ":" + s;
		}
		return result;
	}
	tapProgress(even) {
		if(this.videoSrc==""){
			return false;
		}
		if(this.isLoading) {
			return false;
		}
		var ev;
		var maxWidth;
		var layer_x;
		var timePercent;
		if(even.target.className == "progressBarBox") {
			ev = even;
			maxWidth = ev.target.offsetWidth;
			layer_x = ev.center.x - ev.target.offsetLeft;
			timePercent = layer_x / maxWidth;
		} else if(even.target.className == "progressBar") {
			ev = even;
			maxWidth = ev.target.offsetParent.offsetWidth;
			layer_x = ev.center.x - ev.target.offsetParent.offsetLeft;
			timePercent = layer_x / maxWidth;
		}else if(even.target.className == "progress") {
			ev = even;
			maxWidth = ev.target.offsetParent.offsetWidth;
			layer_x = ev.center.x - ev.target.offsetParent.offsetParent.offsetLeft;
			timePercent = layer_x / maxWidth;
		} else if(even.target.className == "progress-ball") {
			ev = even;
			maxWidth = ev.target.offsetParent.offsetWidth;
			layer_x = ev.center.x - ev.target.offsetParent.offsetLeft;
			timePercent = layer_x / maxWidth;
		}
		if(this.hasAudioFile){
			this.audioFile.currentTime = timePercent * this.videoDom.duration;
		}else{
			this.videoDom.currentTime = timePercent * this.videoDom.duration;
		}
		if(!this.isPlay) {
			this.videoDom.play();
			this.isPlay = true;
		}
	}
	panProgress(even) {
		if(this.videoSrc==""){
			return false;
		}
		if(this.isLoading) {
			return false;
		}
		this.showBarTimeCount = this.TIMESHOW;
		this.isPan = true;
		var ev;
		var maxWidth;
		var layer_x;
		var timePercent;
		if(even.target.className == "progressBarBox") {
			ev = even;
			maxWidth = ev.target.offsetWidth;
			layer_x = ev.center.x - ev.target.offsetLeft;
			timePercent = layer_x / maxWidth;
		} else if(even.target.className == "progressBar") {
			ev = even;
			maxWidth = ev.target.offsetParent.offsetWidth;
			layer_x = ev.center.x - ev.target.offsetParent.offsetLeft;
			timePercent = layer_x / maxWidth;
		} else if(even.target.className == "progress") {
			ev = even;
			maxWidth = ev.target.offsetParent.offsetParent.offsetWidth;
			layer_x = ev.center.x - ev.target.offsetParent.offsetParent.offsetLeft;
			timePercent = layer_x / maxWidth;
		} else if(even.target.className == "progress-ball") {
			ev = even;
			maxWidth = ev.target.offsetParent.offsetWidth;
			layer_x = ev.center.x - ev.target.offsetParent.offsetLeft;
			timePercent = layer_x / maxWidth;
		}
		if(timePercent > 1) {
			timePercent = 1;
		}
		if(timePercent < 0) {
			timePercent = 0;
		}
		var percent = timePercent * 100;
		this.videoProgress = "translate(" + (percent - 100) + "%,0)";
		this.videoProgressBall = "translate(" + (percent * maxWidth / 100) + "px,0)";
		if(ev.isFinal) {
			this.isPan = false;
			if(this.hasAudioFile){
				this.audioFile.currentTime = timePercent * this.videoDom.duration;
			}else{
				this.videoDom.currentTime = timePercent * this.videoDom.duration;
			}
			if(!this.isPlay) {
				this.videoDom.play();
				this.isPlay = true;
			}
		}
	}
	videoFullscreen() {
		if(this.isFullscreen) {
			if(this.plt.is('cordova')) {
				this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
			}
			this.isFullscreen = false;
		} else {
			if(this.plt.is('cordova')) {
				this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
			}
			this.isFullscreen = true;
		}
		this.fullscreenEvent.emit({isFullscreen:this.isFullscreen});
		this.sendActive();
	}
	setAudioElement(){
		this.audioFile = new Audio();
		this.audioFile.src = this.audioSrc;
		this.audioFile.preload = "auto";
		this.hasAudioFile = true;
		this.audioFile.addEventListener("loadedmetadata",()=>{
			this.isLoading_audio = false;
		});
		this.audioFile.addEventListener("timeupdate",()=>{
			this.isBuffer_audio = false;
			if(Math.abs(this.audioFile.currentTime-this.videoDom.currentTime)>0.5){
				this.videoDom.currentTime = this.audioFile.currentTime;
			}
		});
		this.audioFile.addEventListener("waiting",()=>{
			this.isBuffer_audio = true;
		});
		this.audioFile.addEventListener("canplay",()=>{
			this.isBuffer_audio = false;
		});
		this.audioFile.addEventListener("ended",()=>{
			this.isPlay_audio = false;
			this.isEnded_audio = true;
		});
		this.audioFile.addEventListener("error",()=>{
			this.videoDom.volume = 1;
			this.hasAudioFile = false;
		});
	}
	ngOnInit(){
	}
	ngOnChanges(){
		if(this.audioSrc){
			this.setAudioElement();
		}
	}
	ngAfterViewInit() {
		if(this.videoPoster==undefined){
			this.videoPoster = "";
		}
	}
	ngOnDestroy() {
		try{
			if(this.hasAudioFile){
				this.audioFile.pause();
			}
		}catch(e){
			//TODO handle the exception
		}
		this.isFullscreen = false;
		if(this.plt.is('cordova')) {
			this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
		}
	}

}