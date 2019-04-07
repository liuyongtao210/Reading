import { Injectable } from '@angular/core';

declare var UmengPlugins: any; //使用自定义插件
/**
 * 引入：
 * import { UmengModel } from '../../model/umengModel/umengModel';
 * 声明：
 * private umeng:UmengModel,
 * 
 * (1) onEvent自定义事件：
 * var umengEventId = "index_banner"; //事件ID，与友盟后台设置一致
 * var umengEventName = "邀请好友注册"; //事件名称，需要统计的操作名
 * this.umeng.onEvent(umengEventId,umengEventName);
 */
@Injectable()
export class UmengModel {//
	constructor(
	) {}
	onEvent(eventId,eventName,callback?,errCallback?){
		try{
			if(eventId!=null&&eventId!=undefined&&eventId!=""){
				if(eventName!=null&&eventName!=undefined&&eventName!=""){
					let message = "eventId="+eventId+"&eventName="+eventName;
					UmengPlugins.onEvent(message, (msg) => {
						if(callback){
							callback(msg);
						}
					}, (err) => {
						if(errCallback){
							errCallback(err);
						}
					});
				}
			}
		}catch(e){
			console.log("umeng统计插件错误：");
			console.log(e);
		}
	}
}