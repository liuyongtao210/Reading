import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ExercisesResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { WeuiModel } from '../../model/weuiModel/weuiModel';

@Component({
  selector: 'page-exercises-result',
  templateUrl: 'exercises-result.html',
})
export class ExercisesResultPage {
exeData:any;
  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public WeuiModel:WeuiModel
  ) {
  	this.exeData=this.navParams.get('data');
  	console.log(this.exeData)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExercisesResultPage');
  }

}
