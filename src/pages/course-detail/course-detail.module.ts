import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourseDetailPage } from './course-detail';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipe/pie.module';

@NgModule({
  declarations: [
    CourseDetailPage,
  ],
  imports: [
    PipesModule,
    ComponentsModule,
    IonicPageModule.forChild(CourseDetailPage),
  ],
})
export class CourseDetailPageModule {}