import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayPage } from './pay';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    PayPage,
  ],
  imports: [
    QRCodeModule,
    IonicPageModule.forChild(PayPage),
  ],
})
export class PayPageModule {}
