import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LivePage } from './live';
import { PipesModule } from '../../pipe/pie.module';

@NgModule({
  declarations: [
    LivePage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(LivePage),
  ],
})
export class LivePageModule {}
