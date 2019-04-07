import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';

//ran
import { HomePage } from '../pages/home/home';
import { ReadPage } from '../pages/read/read';
import { PublicCoursePage } from '../pages/public-course/public-course';
import { LiveActorPage } from '../pages/live-actor/live-actor';
import { SpecialPage } from '../pages/special/special';
import { MinePage } from '../pages/mine/mine';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginModal } from '../pages/modal-login/modal-login';
import { LiveListPage } from '../pages/live-list/live-list';
//yongtao
import { ChapterListPage } from '../pages/chapter-list/chapter-list';
import { ChapterDetailPage } from '../pages/chapter-detail/chapter-detail';
import { BookIntroductionPage } from '../pages/book-introduction/book-introduction';
import { ClassPieviewPage } from '../pages/class-pieview/class-pieview';
import { ExercisePage } from '../pages/exercise/exercise';
import { ExercisesResultPage } from '../pages/exercises-result/exercises-result';
import { ReadArticlePage } from '../pages/read-article/read-article';
import { BilingualismPage } from '../pages/bilingualism/bilingualism';
import { VivaPage } from '../pages/viva/viva';
import { NewThingsPage } from '../pages/new-things/new-things';
import { MediaPlayerPage } from '../pages/media-player/media-player';
//aijun
import { PunchCardPage } from '../pages/punchCard/punchCard';
import { SpecialDetailPage } from '../pages/special_detail/special_detail';
import { SpecialSetPage } from '../pages/special_set/special_set';
import { wordBookPage } from '../pages/wordBook/wordBook';
import { ChangePwdPage } from '../pages/changePwd/changePwd';
import { SpecialPopPage } from '../pages/special_pop/special_pop';
import { SpecialSharePopPage } from '../pages/share_pop/share_pop';
import { CourseListPage } from '../pages/course-list/course-list';  //课程
import { personalDataPage } from '../pages/personal-data/personal-data'; //个人信息
import { citiesModel } from '../model/cities/cities'; //城市
import { TeacherIndexPage } from '../pages/teacher-index/teacher-index'; //老师列表
import { TeacherThemePage } from '../pages/teacher-theme/teacher-theme'; //老师主页
import { ActivityPage } from '../pages/activity/activity'; //活动列表
import { MyInvitePage } from '../pages/my-invite/my-invite'; //我的邀请
import { ActiveRulePage } from '../pages/active_rule/active_rule'; //活动规则
import { CoursesPaidPage } from '../pages/courses_paid/courses_paid'; //已购买的课程
//qian
import { ArticleDetailPage } from '../pages/article-detail/article-detail';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { H5DetailPageModule } from '../pages/h5-detail/h5-detail.module';
import { ImageAddPageModule } from '../pages/image-add/image-add.module';
import { PayPageModule } from '../pages/pay/pay.module';
import { PayTutorPageModule } from '../pages/pay-tutor/pay-tutor.module';
import { FeedbackPageModule } from '../pages/feedback/feedback.module';
import { CourseDetailPageModule } from '../pages/course-detail/course-detail.module';
import { LivePageModule } from '../pages/live/live.module';
import { PipesModule } from '../pipe/pie.module';
//monkey
import { MyBookPage } from '../pages/my-book/my-book';
import { MyFollowPage } from '../pages/my-follow/my-follow';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { HTTP } from '@ionic-native/http';
import { CallNumber } from '@ionic-native/call-number';
import { Brightness } from '@ionic-native/brightness';
import { AppUpdate } from '@ionic-native/app-update';
import { File } from '@ionic-native/file';

import { ComponentsModule } from '../components/components.module';
import { WxsharePage } from '../model/wxshare/wxshare';
import { WeuiModel } from '../model/weuiModel/weuiModel';
import { weuiNativeModel } from '../model/weuiModel/weuiNativeModel';
import { commanModel } from '../model/comman/comman';
import { UmengModel } from '../model/umengModel/umengModel';
import { CheckVModel } from "../pages/tabs/checkVModel";
import { IonJPushModule } from 'ionic2-jpush'
import { JumpModel } from '../model/jumpModel/JumpModel';
import { MultiPickerModule } from 'ion-multi-picker';
import { QRCodeModule } from 'angular2-qrcode';
import { Vibration } from '@ionic-native/vibration';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';

@NgModule({
	declarations: [
		MyApp,
		ReadPage,
		PublicCoursePage,
		SpecialPage,
		MinePage,
		HomePage,
		TabsPage,
		LoginModal,
		ReadPage,
		ChapterListPage,
		ChapterDetailPage,
		BookIntroductionPage,
		ClassPieviewPage,
		ExercisePage,
		ExercisesResultPage,
		ReadArticlePage,
		PunchCardPage,
		SpecialPage,
		SpecialDetailPage,
		SpecialSetPage,
		wordBookPage,
		ChangePwdPage,
		SpecialPopPage,
		BilingualismPage,
		LiveActorPage,
		ArticleDetailPage,
		SpecialSharePopPage,
		CourseListPage,
		personalDataPage,
		VivaPage,
		NewThingsPage,
		MediaPlayerPage,
		MyBookPage,
		MyFollowPage,
		LiveListPage,
		TeacherIndexPage,
		TeacherThemePage,
		ActivityPage,
		MyInvitePage,
		ActiveRulePage,
		CoursesPaidPage
	],
	imports: [
		PipesModule,
		QRCodeModule,
		ComponentsModule,
		BrowserModule,
		IonicImageViewerModule,
		H5DetailPageModule,
		ImageAddPageModule,
		IonJPushModule,
		PayPageModule,
		PayTutorPageModule,
		FeedbackPageModule,
		CourseDetailPageModule,
		LivePageModule,
		MultiPickerModule,
		IonicModule.forRoot(MyApp,{
    		backButtonText:'',
    		tabsHideOnSubPages: true
    	}),
		IonicStorageModule.forRoot({
			name: '__mydb',
			driverOrder: ['indexeddb', 'sqlite', 'websql']
		}),
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		ReadPage,
		PublicCoursePage,
		SpecialPage,
		MinePage,
		HomePage,
		TabsPage,
		LoginModal,
		ReadPage,
		ChapterListPage,
		ChapterDetailPage,
		BookIntroductionPage,
		ClassPieviewPage,
		ExercisePage,
		ExercisesResultPage,
		ReadArticlePage,
		PunchCardPage,
		SpecialPage,
		SpecialDetailPage,
		SpecialSetPage,
		wordBookPage,
		ChangePwdPage,
		SpecialPopPage,
		BilingualismPage,
		LiveActorPage,
		ArticleDetailPage,
		SpecialSharePopPage,
		CourseListPage,
		personalDataPage,
		VivaPage,
		NewThingsPage,
		MediaPlayerPage,
		MyBookPage,
		MyFollowPage,
		LiveListPage,
		TeacherIndexPage,
		TeacherThemePage,
		ActivityPage,
		MyInvitePage,
		ActiveRulePage,
		CoursesPaidPage
	],
	providers: [
		File,
		AppUpdate,
		Brightness,
		CallNumber,
		HTTP,
		WxsharePage,
		ScreenOrientation,
		CheckVModel,
		commanModel,
		UmengModel,
		WeuiModel,
		weuiNativeModel,
		StatusBar,
		SplashScreen,
		JumpModel,
		citiesModel,
		Vibration,
		FileTransfer,
		Camera,
		{
			provide: ErrorHandler,
			useClass: IonicErrorHandler
		}
	]
})
export class AppModule {}