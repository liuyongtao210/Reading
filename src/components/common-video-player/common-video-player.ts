import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { Platform } from 'ionic-angular/platform/platform';
import { Events } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'common-video-player',
  templateUrl: 'common-video-player.html'
})

export class CommonVideoPlayerComponent {

  @Input('vurl') videoUrl: string;
  @Input('aurl') audioUrl: string;
  @Input('cover') cover: string;
  @Output() fullscreen: EventEmitter<any> = new EventEmitter<any>();

  processPosition:string = "0%"; //控制条进度
  defaultPanelHeight:string = ""; //视频窗口高度（默认）
  panelHeight:string = "200px"; //视频窗口高度
  currentTimeLabel:string = "00:00"; //当前播放进度的文本
  totalTimeLabel:string = "00:00"; //视频总时长的文本
  @ViewChild("myvideo") myvideo: ElementRef; //视频对象
  @ViewChild("myaudio") myaudio: ElementRef; //音频对象
  canplay: boolean = false; //是否可以播放
  isPlaying: boolean = false; //是否正在播放
  isPan: boolean = false; //进度条是否正在被拖动
  isFullscreen: boolean = false; //是否已经全屏
  //监听App切后台的处理函数
  onAppPauseHandler:any = ()=>{
    if(!this.isPlaying) return;
    if(this.checkHasAudioUrl()){
      this.myaudio.nativeElement.muted = false;
      this.myaudio.nativeElement.play();
      if(this.checkHasVideoUrl()){
        this.myaudio.nativeElement.currentTime = this.myvideo.nativeElement.currentTime;
      }
    }
  };
  //监听App重新激活的处理函数
  onAppResumeHandler:any = ()=>{
    if(!this.isPlaying) return;
    if(this.checkHasAudioUrl()){
      this.myaudio.nativeElement.muted = true;
    }
    if(this.checkHasVideoUrl()){
      this.myvideo.nativeElement.play();
      if(this.checkHasAudioUrl()){
        this.myvideo.nativeElement.currentTime = this.myaudio.nativeElement.currentTime;
      }
    }
  };

  constructor(
    private weui: WeuiModel,
    private plt: Platform,
    private event: Events,
    private screenOrientation: ScreenOrientation
  ) {
    this.event.subscribe("app-pause", this.onAppPauseHandler);
    this.event.subscribe("app-resume", this.onAppResumeHandler);
  }

  //当点击播放/暂停按钮的时候
  onPlayPauseTap(){
    if(!this.canplay) return;
    if(this.isPlaying){
      this.isPlaying = false;
      this.myvideo.nativeElement.pause();
    }else{
      this.isPlaying = true;
      this.myvideo.nativeElement.play();
    }
  }

  //当滑动进度条的时候
  onProcessPan(event){
    if(!this.canplay) return;
    var percent = (event.center.x - event.target.offsetLeft) / event.target.offsetWidth;
    if(percent<0) percent = 0;
    if(percent>1) percent = 1;
    this.processPosition = (percent*100).toString()+"%";
    this.isPan = true;
    if(event.isFinal){
      this.isPan = false;
      this.myvideo.nativeElement.currentTime = this.myvideo.nativeElement.duration * percent;
      if(!this.isPlaying){
        this.isPlaying = true;
        this.myvideo.nativeElement.play();
      }
    }
  }

  //点击全屏的时候
  onFullscreenTap(){
    if(!this.canplay) return;
    if(this.isFullscreen){
      this.isFullscreen = false;
      this.panelHeight = this.defaultPanelHeight;
      this.fullscreen.emit({isFullscreen:false});
      if(this.plt.is("cordova")){
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }
    }else{
      this.isFullscreen = true;
      this.panelHeight = this.plt.width()+"px";
      this.fullscreen.emit({isFullscreen:true});
      if(this.plt.is("cordova")){
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      }
    }
  }

  //视频开始加载
  onVideoLoadStart(event){
    if(this.checkHasVideoUrl()){
      this.log("loadStart", event);
      this.canplay = false;
      this.isPlaying = true;
      this.myvideo.nativeElement.play();
    }
  }

  //音频开始加载
  onAudioLoadStart(event){
    if(this.checkHasAudioUrl()){
      this.myaudio.nativeElement.play();
      this.myaudio.nativeElement.muted = true;
    }
  }

  //视频总时长发生改变（只支持IOS）
  onVideoDurationChange(event){
    this.log("durationChange", event);
    this.onVideoRealMeta(event);
  }

  //视频元数据加载成功（不支持IOS）
  onVideoLoadedMetadata(event){
    this.log("metaData", event);
    this.onVideoRealMeta(event);
  }

  //视频元数据发生改变（兼容统一处理）
  onVideoRealMeta(event){
    var duration = this.myvideo.nativeElement.duration;
    this.totalTimeLabel = this.formatTime(duration);
    var videoWidth = this.myvideo.nativeElement.videoWidth;
    var videoHeight = this.myvideo.nativeElement.videoHeight;
    var displayWidth = this.myvideo.nativeElement.clientWidth;
    var displayHeight = videoHeight / videoWidth * displayWidth;
    this.panelHeight = displayHeight+"px";
    this.defaultPanelHeight = this.panelHeight;
  }

  //视频可以播放了
  onVideoCanplay(event){
    this.log("canplay", event);
    this.canplay = true;
  }

  //视频播放进度发生改变
  onVideoTimeupdate(event){
    this.log("timeUpdate", event);
    var currentTime = this.myvideo.nativeElement.currentTime;
    var duration = this.myvideo.nativeElement.duration;
    if(currentTime!=undefined && duration!=undefined){
      if(!this.isPan){
        var percent = currentTime / duration * 100;
        this.processPosition = percent+"%";
      }
      this.currentTimeLabel = this.formatTime(currentTime);
    }
  }

  //视频播放完毕
  onVideoEnded(event){
    this.log("ended", event);
    this.isPlaying = false;
  }

  //音频进度发生改变
  onAudioTimeupdate(event){
    this.log("audioTimeupdate", event);
  }

  formatTime(timecount){
    var minutes = parseInt(timecount / 60 + "");
    var seconds = timecount - minutes*60;
    var mstr = minutes.toString();
    var sstr = parseInt(seconds+"").toString();
    mstr = mstr.length==1 ? "0"+mstr : mstr;
    sstr = sstr.length==1 ? "0"+sstr : sstr;
    return mstr+":"+sstr;
  }

  //获取是否具有有效的视频URL
  checkHasVideoUrl(){
    return (this.videoUrl!=undefined && this.videoUrl!=null && this.videoUrl!="");
  }

  //获取是否具有有效的音频URL
  checkHasAudioUrl(){
    return (this.audioUrl!=undefined && this.audioUrl!=null && this.audioUrl!="");
  }

  //组件被销毁了
  ngOnDestroy(){
    this.event.unsubscribe("app-pause", this.onAppPauseHandler);
    this.event.unsubscribe("app-resume", this.onAppResumeHandler);
    if(this.plt.is("cordova")){
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }

  log(eventName, event){
    //console.log("*** <Video Event: "+eventName+"> ***", event);
  }

}