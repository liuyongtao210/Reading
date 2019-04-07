// 导入模块
import { Pipe, PipeTransform } from "@angular/core";
// 管道名称
@Pipe({
	name: "formatChat"
})
export class FormatChatPipe implements PipeTransform {
	// 参数说明:
	// value是在使用管道的时候,获取的所在对象的值
	// 后面可以跟若干个参数
	// arg: 自定义参数, 数字类型, 使用的时候, 使用冒号添加在管道名称后面
	transform(content: string) {
		var flag = "_&%#_";
		if(content==null||content==undefined){
			return "";
		}
		var arr = content.split(flag);
		if(arr.length > 1) {
			return arr[1];
		} else {
			return content;
		}
	}
}