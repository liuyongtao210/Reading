//格式化代码函数,已经用原生方式写好了不需要改动,直接引用就好
String.prototype.removeLineEnd = function() {
	return this.replace(/(<.+?\s+?)(?:\n\s*?(.+?=".*?"))/g, '$1 $2')
}

function formatXml(text) {
//	console.log(text)
	//去掉多余的空格
	text = '\n' + text.replace(/(<\w+)(\s.*?>)/g, function($0, name, props) {
		return name + ' ' + props.replace(/\s+(\w+=)/g, " $1");
	}).replace(/>\s*?</g, ">\n<");

	//把注释编码
	text = text.replace(/\n/g, '\r').replace(/<!--(.+?)-->/g, function($0, text) {
		var ret = '<!--' + escape(text) + '-->';
		//alert(ret);
		return ret;
	}).replace(/\r/g, '\n');

	//调整格式
	var rgx = /\n(<(([^\?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg;
	var nodeStack = [];
	var output = text.replace(rgx, function($0, all, name, isBegin, isCloseFull1, isCloseFull2, isFull1, isFull2) {
		var isClosed = (isCloseFull1 == '/') || (isCloseFull2 == '/') || (isFull1 == '/') || (isFull2 == '/');
		//alert([all,isClosed].join('='));
		var prefix = '';
		if(isBegin == '!') {
			prefix = getPrefix(nodeStack.length);
		} else {
			if(isBegin != '/') {
				prefix = getPrefix(nodeStack.length);
				if(!isClosed) {
					nodeStack.push(name);
				}
			} else {
				nodeStack.pop();
				prefix = getPrefix(nodeStack.length);
			}

		}
		var ret = '\n' + prefix + all;
		return ret;
	});

	var prefixSpace = -1;
	var outputText = output.substring(1);
	//alert(outputText);

	//把注释还原并解码，调格式
	outputText = outputText.replace(/\n/g, '\r').replace(/(\s*)<!--(.+?)-->/g, function($0, prefix, text) {
		//alert(['[',prefix,']=',prefix.length].join(''));
		if(prefix.charAt(0) == '\r')
			prefix = prefix.substring(1);
		text = unescape(text).replace(/\r/g, '\n');
		var ret = '\n' + prefix + '<!--' + text.replace(/^\s*/mg, prefix) + '-->';
		//alert(ret);
		return ret;
	});

	return outputText.replace(/\s+$/g, '').replace(/\r/g, '\r\n');
}

function getPrefix(prefixIndex) {
	var span = '    ';
	var output = [];
	for(var i = 0; i < prefixIndex; ++i) {
		output.push(span);
	}

	return output.join('');
}

function getXmlStrData(xmlNode) { //将XML字符串中的结点属性转换为数据对象
	var obj = {};
	for(var i = 0; i < xmlNode.attributes.length; i++) {
		obj[xmlNode.attributes[i].nodeName] = xmlNode.attributes[i].nodeValue;
	}
	obj.nodeName = xmlNode.nodeName;
	if(xmlNode.children.length > 0) {
		var childrenArr = [];
		for(var i = 0; i < xmlNode.children.length; i++) {
			var childData = getXmlStrData(xmlNode.children[i]);
			childrenArr.push(childData);
		}
		obj.childrenArr = childrenArr;
	}
	return obj;
}

export function getXmlData(xmlStr, nodeName) {
	//引用示例部分
	//(1)创建xml格式或者从后台拿到对应的xml格式
	//	var originalXml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?>\n<xml_result>\n    <read_word lan=\"en\" type=\"study\" version=\"\">\n        <rec_paper>\n            <read_word beg_pos=\"0\" content=\"sentence\" end_pos=\"428\" except_info=\"0\" is_rejected=\"false\" total_score=\"4.570855\">\n                <sentence beg_pos=\"0\" content=\"sentence\" end_pos=\"428\" index=\"0\">\n                    <word beg_pos=\"198\" content=\"sentence\" dp_message=\"0\" end_pos=\"289\" global_index=\"0\" index=\"0\" total_score=\"4.570855\">\n                        <syll beg_pos=\"198\" content=\"s eh n\" end_pos=\"238\" syll_score=\"4.174100\">\n                            <phone beg_pos=\"198\" content=\"s\" dp_message=\"0\" end_pos=\"225\" \/>\n                            <phone beg_pos=\"225\" content=\"eh\" dp_message=\"0\" end_pos=\"230\" \/>\n                            <phone beg_pos=\"230\" content=\"n\" dp_message=\"0\" end_pos=\"238\" \/>\n                        <\/syll>\n                        <syll beg_pos=\"238\" content=\"t ax n s\" end_pos=\"289\" syll_score=\"4.868421\">\n                            <phone beg_pos=\"238\" content=\"t\" dp_message=\"0\" end_pos=\"246\" \/>\n                            <phone beg_pos=\"246\" content=\"ax\" dp_message=\"0\" end_pos=\"250\" \/>\n                            <phone beg_pos=\"250\" content=\"n\" dp_message=\"0\" end_pos=\"262\" \/>\n                            <phone beg_pos=\"262\" content=\"s\" dp_message=\"0\" end_pos=\"289\" \/>\n                        <\/syll>\n                    <\/word>\n                <\/sentence>\n            <\/read_word>\n        <\/rec_paper>\n    <\/read_word>\n<\/xml_result>\n";
	var originalXml = xmlStr;
	//(2)调用formatXml函数,将xml格式进行格式化
	var resultXml = formatXml(originalXml);
	//(3)创建文档对象  
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(resultXml, "text/xml");
	console.log(xmlDoc);
	//(4)提取数据  
	console.log("提取节点名： "+nodeName);
	var rootNode = xmlDoc.getElementsByTagName(nodeName);
	
	var resultObjArray = [];
	for(var i=0;i<rootNode.length;i++){
		var resultObj = getXmlStrData(rootNode[i]);
		resultObjArray.push(resultObj);
	}
	
//	var resultObj = getXmlStrData(rootNode[0]);
	/*获取乱读、异常等结点信息*/
	var typeName="";
	if(nodeName=="sentence"){
		typeName = "read_chapter";
	}else{
		typeName = "read_word";
	}
	var readType = xmlDoc.getElementsByTagName(typeName);
	var type = getXmlStrData(readType[readType.length-1]);
	resultObjArray[0].is_rejected=type.is_rejected;//获取是否乱读
	resultObjArray[0].except_info=type.except_info;//获取异常码
	resultObjArray[0].chapterScore=type.total_score;//获取总分
	console.log(resultObjArray);
	return resultObjArray;
}

export function transformSymbols(symbols) {
	var symbolArr = symbols.split(" ");
	var resultArr = "";
	for(var i = 0; i < symbolArr.length; i++) {
		resultArr += transformSymbol(symbolArr[i]);
	}
	return resultArr + " ";
}

export function transformSymbol(symbol) {
	switch(symbol) {
		case "aa":
			return "ɑː";
			break;
		case "ae":
			return "æ";
			break;
		case "ah":
			return "ʌ";
			break;
		case "ao":
			return "ɔː";
			break;
		case "ar":
			return "eə";
			break;
		case "aw":
			return "aʊ";
			break;
		case "ax":
			return "ə";
			break;
		case "ay":
			return "aɪ";
			break;
		case "eh":
			return "e";
			break;
		case "er":
			return "ɜː";
			break;
		case "ey":
			return "eɪ";
			break;
		case "ih":
			return "ɪ";
			break;
		case "ir":
			return "ɪə";
			break;
		case "iy":
			return "iː";
			break;
		case "oo":
			return "ɒ";
			break;
		case "ow":
			return "əʊ";
			break;
		case "oy":
			return "ɒɪ";
			break;
		case "uh":
			return "ʊ";
			break;
		case "uw":
			return "ʊə";
			break;
		case "ur":
			return "uː";
			break;
		case "b":
			return "b";
			break;
		case "ch":
			return "tʃ";
			break;
		case "d":
			return "d";
			break;
		case "dh":
			return "ð";
			break;
		case "f":
			return "f";
			break;
		case "g":
			return "g";
			break;
		case "hh":
			return "h";
			break;
		case "jh":
			return "dʒ";
			break;
		case "k":
			return "k";
			break;
		case "l":
			return "l";
			break;
		case "m":
			return "m";
			break;
		case "n":
			return "n";
			break;
		case "ng":
			return "ŋ";
			break;
		case "p":
			return "p";
			break;
		case "r":
			return "r";
			break;
		case "s":
			return "s";
			break;
		case "sh":
			return "ʃ";
			break;
		case "t":
			return "t";
			break;
		case "th":
			return "θ";
			break;
		case "v":
			return "v";
			break;
		case "w":
			return "w";
			break;
		case "y":
			return "j";
			break;
		case "z":
			return "z";
			break;
		case "zh":
			return "ʒ";
			break;
		case "dr":
			return "dr";
			break;
		case "dz":
			return "dz";
			break;
		case "tr":
			return "tr";
			break;
		case "ts":
			return "ts";
			break;
		default:
			return symbol;
	}
}