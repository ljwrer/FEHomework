//让firefox支持innerText
if (!("innerText" in document.body)) {
	HTMLElement.prototype.__defineGetter__("innerText", function() {
		return this.textContent;
	});
	HTMLElement.prototype.__defineSetter__("innerText", function(s) {
		this.textContent = s;
	});
}
var util = {
	//通用工具
	GennerUtil: {
		//将连字符格式转换为驼峰格式
		repalceChar: function(str, char) {
			var i;
			while ((i = str.indexOf(char)) != -1) {
				str = str.slice(0, i) + str.charAt(i + 1).toUpperCase() + str.slice(i + 2);
			}
			return str;
		},
	},
	//cookie工具 
	CookieUtil: {
		//获取cookie
		get: function(name) {
			if (!document.cookie) return null;
			var allCookie = document.cookie;
			var CookieName = encodeURIComponent(name) + "=",
				CookieValue = null,
				CookieStart = allCookie.indexOf(CookieName),
				CookieEnd;
			if (CookieStart > -1) {
				CookieEnd = allCookie.indexOf(";", CookieStart);
				if (CookieEnd == -1) {
					CookieEnd = allCookie.length;
				}
				CookieValue = decodeURIComponent(allCookie.substring(CookieStart + CookieName.length, CookieEnd));
			}
			return CookieValue;
		},
		//设置cookie
		set: function(name, value, expires, domain, path, secure) {
			var CookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
			if (expires instanceof Date) {
				CookieText += " ;expires=" + expires.toGMTString();
			}
			if (domain) {
				CookieText += " ;domain=" + domain;
			}
			if (path) {
				CookieText += " ;path" + path;
			}
			if (secure) {
				CookieText += " ;secure" + secure;
			}
			document.cookie = CookieText;
		}
	},
	//DOM工具
	DomUtil: {
		//查询是否用有指定class
		hasClass: function(ele, cls) {
			return (new RegExp('(\\s|^)' + cls + '(\\s|$)')).test(ele.className);
		},
		//增加class
		addClass: function(ele, cls) {
			if (!this.hasClass(ele, cls)) ele.className += " " + cls;
		},
		//移除class
		removeClass: function(ele, cls) {
			if (this.hasClass(ele, cls)) {
				ele.className = ele.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), "");
			}
		}
	},
	//事件处理工具
	EventUtil: {
		//绑定事件
		addEvent: document.addEventListener ? function(elem, type, listener, useCapture) {
			elem.addEventListener(type, listener, useCapture);
		} : function(elem, type, listener, useCapture) {
			elem.attachEvent('on' + type, listener);
		},
		//取消绑定事件
		delEvent: document.removeEventListener ? function(elem, type, listener, useCapture) {
			elem.removeEventListener(type, listener, useCapture);
		} : function(elem, type, listener, useCapture) {
			elem.detachEvent('on' + type, listener);
		},
		//取消事件默认行为
		preventDefault: function(event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},
		//获取事件
		getEvent: function(event) {
			return event ? event : window.event;
		},
		//获取事件target
		getTarget: function(event) {
			return event.target || event.srcElement;
		}
	},
	//样式工具
	StyleUtil: {
		//隐藏
		hide: function(ele) {
			util.DomUtil.removeClass(ele, "j-show");
			util.DomUtil.addClass(ele, "j-hide");
		},
		//显示
		show: function(ele) {
			util.DomUtil.removeClass(ele, "j-hide");
			util.DomUtil.addClass(ele, "j-show");
		},
		//获取样式对象
		getStyle: function(ele) {
			if (window.getComputedStyle) {
				return window.getComputedStyle(ele);
			} else {
				return ele.currentStyle;
			}
		},
		//获取样式属性
		get: function(ele, prop) {
			var dec = this.getStyle(ele);
			prop = util.GennerUtil.repalceChar(prop, "-");
			var result = dec[prop];
			return result;
		}
	},
	//表单工具
	FormUtil: {
		//兼容placeholder
		resetFields: function(whichform) {
			if ('placeholder' in document.createElement('input')) return;
			for (var i = 0; i < whichform.elements.length; i++) {
				var element = whichform.elements[i];
				if (element.type == "submit") continue;
				if (!element.getAttribute('placeholder')) continue;
				element.onfocus = function() {
					if (this.value == this.getAttribute('placeholder')) {
						this.value = "";
						this.style.color = "#000000";
					}
				}
				element.onblur = function() {
					if (this.value == "") {
						this.value = this.getAttribute('placeholder');
						this.style.color = "#cccccc";
					}
				}
				element.onblur();
			}
		}
	},
	//Ajax工具
	AjaxUtil: {
		//兼容获取xhr
		getHTTPObject: function() {
			if (typeof XMLHttpRequest === undefined) {
				try {
					return new ActiveXObject("Msxml2.XMLHTTP.6.0");
				} catch (e) {}
				try {
					return new ActiveXObject("Msxml2.XMLHTTP.3.0");
				} catch (e) {}
				try {
					return new ActiveXObject();
				} catch (e) {}
			}
			return new XMLHttpRequest();
		},
		//请求参数序列化
		serialize: function(data) {
			var ret = [];
			for (var name in data) {
				var value = data[name];
				if (!data.hasOwnProperty(name)) continue;
				if (typeof data[name] == "function") continue;
				name = encodeURIComponent(name);
				value = encodeURIComponent(value);
				ret.push(name + "=" + value);
			}
			ret = ret.join("&");
			return ret;
		},
		//get方法进行Ajax请求
		getAjax: function(url, options, callback) {
			var xhr = new this.getHTTPObject();
			xhr.open("GET", url + "?" + this.serialize(options), true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (xhr.status >= 200 && xhr.status <= 300 || xhr.status == 304) {
						callback(xhr.responseText);
					}
				}
			};
			xhr.send(null);
		}
	},
	//动画工具
	MoveUtil: {
		//移动
		moveElement: function(ele, finalX, finalY, intervel) {
			finalX = parseInt(finalX);
			finalY = parseInt(finalY);
			if (ele.interverID) {
				clearInterval(ele.interverID);
			}

			function step() {
				var currentX = parseInt(util.StyleUtil.get(ele, "left"));
				var currentY = parseInt(util.StyleUtil.get(ele, "top"));
				var dist = 0
				if (currentX == finalX && currentY == finalY) {
					clearInterval(intervelID);
				}
				if (currentX < finalX) {
					dist = Math.ceil((finalX - currentX) / 10);
					currentX += dist;
				} else if (currentX > finalX) {
					dist = Math.ceil((currentX - finalX) / 10);
					currentX -= dist;
				}
				if (currentY < finalY) {
					dist = Math.ceil((finalY - currentY) / 10);
					currentY += dist;
				} else if (currentY > finalY) {
					dist = Math.ceil((currentY - finalY) / 10);
					currentY -= dist;
				}
				ele.style.left = currentX + "px";
				ele.style.top = currentY + "px";
			}
			var intervelID = setInterval(step, intervel);
			ele.interverID = intervelID;
		}
	},
	//数组工具
	ArrayUtil: {
		//搜索数组并返回下标
		search: function(arr, item) {
			var ret = -1;
			for (var i = 0, len = arr.length; i < len; i++) {
				if (arr[i] === item) {
					ret = i;
					break;
				}
			}
			return ret;
		}
	}
}