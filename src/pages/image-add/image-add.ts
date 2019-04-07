import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Slides } from 'ionic-angular';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-image-add',
  templateUrl: 'image-add.html',
})
export class ImageAddPage {

  @ViewChild(Slides) slides: Slides;
  contentBgColorList:any = ["#fdde85", "#bbe1ee", "#fe8484", "#90c6fd"];
  currentSlideIndex:number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private app: App,
    private storage: Storage
    ) {
  }

  ionViewDidLoad() {
    //
  }

  onSlideChange(event){
    let index = this.slides.getActiveIndex();
    if(index<0) index=0;
    if(index>3) index=3;
    this.currentSlideIndex = index;
  }

  onGotoIndex(){
    this.storage.set("isNotFirstLaunch", "true");
    this.app.getRootNav().setRoot(TabsPage);
  }

}
