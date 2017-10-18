// 判断元素是否包含类名
var hasClass = function (ele, cls) {
	return (new RegExp('(\\s|^)' + cls + '(\\s|$)')).test(ele.className);
}
// 添加类名
var addClass = function (ele, cls) {
	if (!hasClass(ele, cls)) {
		ele.className += ' ' + cls;
	}
}
// 移除类名
var removeClass = function (ele, cls) {
	if (hasClass(ele, cls)) {
		ele.className = ele.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), '');
	}
}
// 屏幕宽高
var getInner = function () {
	if (typeof window.innerWidth != 'undefined') {
		return {
			width: window.innerWidth,
			height: window.innerHeight
		}
	} else {
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		}
	}
}
// 深度复制多维数组
function deepCopy(obj) {
	var out = [];
	var len = obj.length;
	for (var i = 0; i < len; i++) {
		if (obj[i] instanceof Array) {
			out[i] = deepCopy(obj[i]);
		} else {
			out[i] = obj[i];
		}
	}
	return out;
}