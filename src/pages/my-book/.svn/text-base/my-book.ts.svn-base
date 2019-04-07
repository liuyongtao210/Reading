import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { ChapterListPage } from '../chapter-list/chapter-list';
import { ReadArticlePage } from '../read-article/read-article';

/**
 * Generated class for the MyBookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
	selector: 'page-my-book',
	templateUrl: 'my-book.html',
})
export class MyBookPage {
	//创建数组接收书籍
	//总书籍
	Book: Array < any > = [];
	//精读
	JBook: Array < any > = [];
	//畅读
	CBook: Array < any > = [];
	Like: any = true; //按钮控制
	_param: any = {} //用户具体数据 

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private weui: WeuiModel,
		private comman: commanModel
	) {}

	ionViewDidLoad() {
		//生命周期函数 当页面加载完成之后触发
		this.getMyCollectBook();
	}

	getMyCollectBook(){
		var param = {
			token: this.comman.getGlobal('token'),
			userId: this.comman.getGlobal('userId'),
			page: 0,
			size: 10
		}
		this._param = param;
		this.comman.request('SA', 'myCollectBook', param, (data) => {
			if(data.code==0){
				this.Book = data.list;
				this.JBook = [];
				this.CBook = [];
				for(let i = 0; i < data.list.length; i++) {
					//判断当前书籍类型 数据分类
					if(data.list[i].type == 1) {
						this.JBook.push(data.list[i])
					} else {
						this.CBook.push(data.list[i])
					}
				}
			}else{
				this.weui.showAlert("获取失败", data.msg, "确定");
			}
		})
	}

	onReadingTap(book){
		console.log("点击",book);
		this.navCtrl.push(ChapterListPage, {data:book.bookId});
	}

	onVivaTap(book){
		console.log(book);
		this.navCtrl.push(ReadArticlePage, {data:book.bookId, type:2});
	}

	cancelCollect(item, index, event) {
		event.stopPropagation();
		this.weui.showAlert('确认取消关注吗?', '', '取消', '确认', () => {
			//取消回调

		}, () => {
			//确认回调
			var param = {
				token: this.comman.getGlobal('token'),
				userId: this.comman.getGlobal('userId'),
				bookId: item.bookId

			}
			let loading = this.weui.showLoading("取消收藏");
			this.comman.request('SA', 'unCollectBook', param, (data) => {
				this.weui.hideLoading(loading);
				if(data.code==0){
					this.getMyCollectBook();
				}else{
					this.weui.showAlert("取消收藏失败", data.msg,"确定");
				}
			})
		})
	}
}