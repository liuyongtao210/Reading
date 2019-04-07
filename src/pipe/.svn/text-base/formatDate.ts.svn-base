// 导入模块
import { Pipe, PipeTransform } from "@angular/core";
// 管道名称
@Pipe({
	name: "formatDate"
})
export class FormatDatePipe implements PipeTransform {
	// 参数说明:
	// value是在使用管道的时候,获取的所在对象的值
	// 后面可以跟若干个参数
	// arg: 自定义参数, 数字类型, 使用的时候, 使用冒号添加在管道名称后面
	transform(time: any,type?:string,param?:any) {		
		switch(type){			
			case "YY.MM.DD hh:mm":
				var timeNum_1 = Number(time);
				var d_1 = new Date(timeNum_1);
				var year_1 = d_1.getFullYear();
				var trueMonth_1 = d_1.getMonth() + 1;
				var month_1 = trueMonth_1 < 10 ? ("0" + trueMonth_1) : trueMonth_1;
				var day_1 = d_1.getDate() < 10 ? ("0" + d_1.getDate()) : d_1.getDate();
				var hour_1 = d_1.getHours() < 10 ? ("0" + d_1.getHours()) : d_1.getHours();
				var minutes_1 = d_1.getMinutes() < 10 ? ("0" + d_1.getMinutes()) : d_1.getMinutes();
				return year_1 + "." + month_1 + "." + day_1+ "  " + hour_1 + ":" + minutes_1;			
			case "MM月DD日 hh:mm":
				var timeNum_2 = Number(time);
				var d_2 = new Date(timeNum_2);
				var trueMonth_2 = d_2.getMonth() + 1;
				var month_2 = trueMonth_2 < 10 ? ("0" + trueMonth_2) : trueMonth_2;
				var day_2 = d_2.getDate() < 10 ? ("0" + d_2.getDate()) : d_2.getDate();
				var hour_2 = d_2.getHours() < 10 ? ("0" + d_2.getHours()) : d_2.getHours();
				var minutes_2 = d_2.getMinutes() < 10 ? ("0" + d_2.getMinutes()) : d_2.getMinutes();
				return month_2 + "月" + day_2 + "日  " + hour_2 + ":" + minutes_2;	
			case "D":
				var timeNum_3 = Number(time);
				var d_3 = new Date(timeNum_3);
				var day_3 = d_3.getDate() < 10 ? ("0" + d_3.getDate()) : d_3.getDate();
				return day_3;
			case "H":
				var timeNum_4 = Number(time);
				var d_4 = new Date(timeNum_4);
				var hour_4 = d_4.getHours() < 10 ? ("0" + d_4.getHours()) : d_4.getHours();
				return hour_4;
			case "M":
				var timeNum_5 = Number(time);
				var d_5 = new Date(timeNum_5);
				var minutes_5 = d_5.getMinutes() < 10 ? ("0" + d_5.getMinutes()) : d_5.getMinutes();
				return minutes_5;
			case "E":
				var timeNum_6 = Number(time);
				var d_6 = new Date(timeNum_6);
				var w_6 = this.getWeek(d_6.getDay());
				return w_6;
			case "countDownTime":
				var d_7 = new Date(param);
				var d2_7 = new Date(time);
				var leftTime_7 = Number(d_7.getTime()-d2_7.getTime());
				var days2 = Math.floor(leftTime_7 / 1000 / 60 / 60 / 24);
				var hours2 = Math.floor((leftTime_7 / 1000 / 60 / 60) % 24);
				var minutes2 = Math.floor((leftTime_7 / 1000 / 60) % 60);
				var seconds2 = Math.floor((leftTime_7 / 1000) % 60);
				var resultTime="";
				if(days2>0){
					resultTime= days2+"天"+hours2+"小时";
				}else if(days2==0&&hours2>0){
					resultTime= hours2+"小时"+minutes2+"分";
				}else if(days2==0&&hours2==0){
					resultTime= minutes2+"分"+seconds2+"秒";
				}				
				return resultTime;
			case "countDownTimeM":
				var d_8 = new Date(param);
				var d2_8 = new Date(time);
				var leftTime_8 = Number(d_8.getTime()-d2_8.getTime());
				var minutes8 = Math.floor((leftTime_8 / 1000 / 60) % 60);
				var resultTime8=minutes8;			
				return resultTime8;
			case "countDownTimeH":
				var d_9 = new Date(param);
				var d2_9 = new Date(time);
				var leftTime_9 = Number(d_9.getTime()-d2_9.getTime());
				var hours9 = Math.floor((leftTime_9 / 1000 / 60 / 60) % 24);
				var resultTime9=hours9;				
				return resultTime9;
			case "YY/MM/DD":
				var timeNum_10 = Number(time);
				var d_10 = new Date(timeNum_10);
				var year_10 = d_10.getFullYear();
				var trueMonth_10 = d_10.getMonth() + 1;
				var month_10 = trueMonth_10 < 10 ? ("0" + trueMonth_10) : trueMonth_10;
				var day_10 = d_10.getDate() < 10 ? ("0" + d_10.getDate()) : d_10.getDate();
				return year_10 + "/" + month_10 + "/" + day_10;
			case "YY-MM-DD":
				var timeNum_10 = Number(time);
				var d_10 = new Date(timeNum_10);
				var year_10 = d_10.getFullYear();
				var trueMonth_10 = d_10.getMonth() + 1;
				var month_10 = trueMonth_10 < 10 ? ("0" + trueMonth_10) : trueMonth_10;
				var day_10 = d_10.getDate() < 10 ? ("0" + d_10.getDate()) : d_10.getDate();
				return year_10 + "-" + month_10 + "-" + day_10;
			case "MM/DD":
				var timeNum_11 = Number(time);
				var d_11 = new Date(timeNum_11);
				var trueMonth_11 = d_11.getMonth() + 1;
				var month_11 = trueMonth_11 < 10 ? ("0" + trueMonth_11) : trueMonth_11;
				var day_11 = d_11.getDate() < 10 ? ("0" + d_11.getDate()) : d_11.getDate();
				return month_11 + "/" + day_11;
			case "hh:mm":
				var timeNum_2 = Number(time);
				var d_2 = new Date(timeNum_2);
				var trueMonth_2 = d_2.getMonth() + 1;
				var month_2 = trueMonth_2 < 10 ? ("0" + trueMonth_2) : trueMonth_2;
				var day_2 = d_2.getDate() < 10 ? ("0" + d_2.getDate()) : d_2.getDate();
				var hour_2 = d_2.getHours() < 10 ? ("0" + d_2.getHours()) : d_2.getHours();
				var minutes_2 = d_2.getMinutes() < 10 ? ("0" + d_2.getMinutes()) : d_2.getMinutes();
				return hour_2 + ":" + minutes_2;	
			case "YY年MM月DD日 hh:mm":
				var timeNum_12 = Number(time);
				var d_12 = new Date(timeNum_12);
				var year_12 = d_12.getFullYear();
				var trueMonth_12 = d_12.getMonth() + 1;
				var month_12 = trueMonth_12 < 10 ? ("0" + trueMonth_12) : trueMonth_12;
				var day_12 = d_12.getDate() < 10 ? ("0" + d_12.getDate()) : d_12.getDate();
				var hour_12 = d_12.getHours() < 10 ? ("0" + d_12.getHours()) : d_12.getHours();
				var minutes_12 = d_12.getMinutes() < 10 ? ("0" + d_12.getMinutes()) : d_12.getMinutes();
				return year_12+"年"+month_12 + "月" + day_12 + "日  " + hour_12 + ":" + minutes_12;
			case "YY年MM月DD日":
				var timeNum_13 = Number(time);
				var d_13 = new Date(timeNum_13);
				var year_13 = d_13.getFullYear();
				var trueMonth_13 = d_13.getMonth() + 1;
				var month_13 = trueMonth_13 < 10 ? ("0" + trueMonth_13) : trueMonth_13;
				var day_13 = d_13.getDate() < 10 ? ("0" + d_13.getDate()) : d_13.getDate();
				var hour_13 = d_13.getHours() < 10 ? ("0" + d_13.getHours()) : d_13.getHours();
				var minutes_13 = d_13.getMinutes() < 10 ? ("0" + d_13.getMinutes()) : d_13.getMinutes();
				return year_13+"年"+month_13 + "月" + day_13 + "日";	
			case "MM-DD":
				var timeNum_12 = Number(time);
				var d_12 = new Date(timeNum_12);
				var year_12 = d_12.getFullYear();
				var trueMonth_12 = d_12.getMonth() + 1;
				var month_12 = trueMonth_12 < 10 ? ("0" + trueMonth_12) : trueMonth_12;
				var day_12 = d_12.getDate() < 10 ? ("0" + d_12.getDate()) : d_12.getDate();
				var hour_12 = d_12.getHours() < 10 ? ("0" + d_12.getHours()) : d_12.getHours();
				var minutes_12 = d_12.getMinutes() < 10 ? ("0" + d_12.getMinutes()) : d_12.getMinutes();
				return month_12 + "-" + day_12;
			case "MM月DD日":
				var timeNum_14 = Number(time);
				var d_14 = new Date(timeNum_14);
				var trueMonth_14 = d_14.getMonth() + 1;
				var month_14 = trueMonth_14 < 10 ? ("0" + trueMonth_14) : trueMonth_14;
				var day_14 = d_14.getDate() < 10 ? ("0" + d_14.getDate()) : d_14.getDate();
				return month_14 + "月" + day_14 + "日";	
			case "MM月DD日周Ehh:mm":
				var timeNum_15 = Number(time);
				var d_15 = new Date(timeNum_15);
				var trueMonth_15 = d_15.getMonth() + 1;
				var month_15 = trueMonth_15 < 10 ? ("0" + trueMonth_15) : trueMonth_15;
				var day_15 = d_15.getDate() < 10 ? ("0" + d_15.getDate()) : d_15.getDate();
				var w_15 = this.getWeek(d_15.getDay());
				var hour_15 = d_15.getHours() < 10 ? ("0" + d_15.getHours()) : d_15.getHours();
				var minutes_15 = d_15.getMinutes() < 10 ? ("0" + d_15.getMinutes()) : d_15.getMinutes();
				return month_15 + "月" + day_15 + "日  周"+w_15+" "+hour_15 + ":" + minutes_15;
			default:
				var timeNum = Number(time);
				var d = new Date(timeNum);
				var year = d.getFullYear();
				var trueMonth = d.getMonth() + 1;
				var month = trueMonth < 10 ? ("0" + trueMonth) : trueMonth;
				var day = d.getDate() < 10 ? ("0" + d.getDate()) : d.getDate();
				var hour = d.getHours() < 10 ? ("0" + d.getHours()) : d.getHours();
				var minutes = d.getMinutes() < 10 ? ("0" + d.getMinutes()) : d.getMinutes();
				return year + "." + month + "." + day + "  " + hour + ":" + minutes;	
		}

	}
	checkTime(i){ //将0-9的数字前面加上0，例1变为01 
	  if(i<10) 
	  { 
	    i = "0" + i; 
	  } 
	  return i; 
	} 
	getWeek(week){
		switch(week){
			case 0:
				return "日";
			case 1:
				return "一";
			case 2:
				return "二";
			case 3:
				return "三";
			case 4:
				return "四";
			case 5:
				return "五";
			case 6: 
				return "六";
			default: break;
		}
	}
}