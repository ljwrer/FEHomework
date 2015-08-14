define(["base"], function(base) {
	if (!("innerText" in document.body)) {
		HTMLElement.prototype.__defineGetter__("innerText", function() {
			return this.textContent;
		});
		HTMLElement.prototype.__defineSetter__("innnerText", function(s) {
			return this.textContent = s;
		});
	}
	var GennerUtil = {
		repalceChar: function(str, char) {
			var i;
			while ((i = str.indexOf(char)) != -1) {
				str = str.slice(0, i) + str.charAt(i + 1).toUpperCase() + str.slice(i + 2);
			}
			return str;
		}
	};
	var CookieUtil = {
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
	};
	var DomUtil = {
		hasClass: function(ele, cls) {
			return (new RegExp('(\\s|^)' + cls + '(\\s|$)')).test(ele.className);
		},
		addClass: function(ele, cls) {
			if (!this.hasClass(ele, cls)) ele.className += " " + cls;
		},
		removeClass: function(ele, cls) {
			if (this.hasClass(ele, cls)) {
				ele.className = ele.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), " ");
			}
		},
		getElementsByClassName: function(names, element) {
			if (!element) element = document;
			if (document.getElementsByClassName) {
				return element.getElementsByClassName(names);
			} else {
				var result = new Array();
				var nodes = element.getElementsByTagName("*");
				var namesArray = names.split(' ');
				var hasAllClassName = [];
				for (var j = 0, len = nodes.length; j < len; j++) {
					hasAllClassName[j] = true;
					for (var i = 0; i < namesArray.length; i++) {
						if (nodes[j].className.indexOf(namesArray[i]) === -1) {
							hasAllClassName[j] = false;
						}
					}
				}
				for (i = 0; i < len; i++) {
					if (hasAllClassName[i]) {
						result[result.length] = nodes[i];
					}
				}
				return result;
			}
		}
	};
	var EventUtil = {
		addEvent: document.addEventListener ? function(elem, type, listener, useCapture) {
			elem.addEventListener(type, listener, useCapture);
		} : function(elem, type, listener, useCapture) {
			elem.attachEvent('on' + type, listener);
		},
		delEvent: document.removeEventListener ? function(elem, type, listener, useCapture) {
			elem.removeEventListener(type, listener, useCapture);
		} : function(elem, type, listener, useCapture) {
			elem.detachEvent('on' + type, listener);
		},
		preventDefault: function(event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},
		getEvent: function(event) {
			return event ? event : window.event;
		},
		getTarget: function(event) {
			return event.target || event.srcElement;
		}
	};
	var StyleUtil = {
		hide: function(ele) {
			DomUtil.removeClass(ele, "j-show");
			DomUtil.addClass(ele, "j-hide");
		},
		show: function(ele) {
			DomUtil.removeClass(ele, "j-hide");
			DomUtil.addClass(ele, "j-show");
		},
		getStyle: function(ele) {
			if (window.getComputedStyle) {
				return window.getComputedStyle(ele);
			} else {
				return ele.currentStyle;
			}
		},
		get: function(ele, prop) {
			var dec = this.getStyle(ele);
			prop = GennerUtil.repalceChar(prop, "-");
			var result = dec[prop];
			return result;
		}
	};

	var FormUtil = {
		resetFields: function(whichform) {
			if ('placeholder' in document.createElement('input')) return;
			for (var i = 0; i < whichform.elements.length; i++) {
				var element = whichform.elements[i];
				if (element.type == "submit") continue;
				if (!element.getAttribute('placeholder')) continue;
				element.onfocus = function() {
					if (this.value == this.getAttribute('placeholder')) {
						this.value = "";
					}
				}
				element.onblur = function() {
					if (this.value == "") {
						this.value = this.getAttribute('placeholder');
					}
				}
				element.onblur();
			}
		}
	};
	var AjaxUtil = {
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
		getAjax: function(url, options, callback) {
			var xhr = new this.getHTTPObject();
			xhr.open("GET", url + "?" + this.serialize(options), true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (xhr.status >= 200 && xhr.status <= 300 || xhr.status == 304) {
						callback(xhr.responseText);
					} else {
						//						alert("get failed,status:" + xhr.status);
					}
				}
			};
			xhr.send(null);
		},
		postAjax: function(url, options, callback) {
			var xhr = new this.getHTTPObject();
			xhr.open("POST", url, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (xhr.status >= 200 && xhr.status <= 300 || xhr.status == 304) {
						callback(xhr.responseText);
					} else {
						//						alert("post failed,status:" + xhr.status);
					}
				}
			};
			xhr.send(this.serialize(options));
		}
	};
	var MoveUtil = {
		moveElement: function(ele, finalX, finalY, intervel) {
			finalX = parseInt(finalX);
			finalY = parseInt(finalY);
			if (ele.interverID) {
				clearInterval(ele.interverID);
			}
			function step() {
				var currentX = parseInt(window.getComputedStyle(ele).left);
				var currentY = parseInt(window.getComputedStyle(ele).top);
				var dist = 0
				if (currentX === finalX && currentY === finalY) {
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
					dist = Math.ceil((finalX - currentX) / 10);
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
		},
		fadeOver: function(ele,time,callback) {
			if(ele.interverID){
				clearInterval(ele.interverID);
			}
			var dist=1*25/500;
			function step(){
				var currentOp=StyleUtil.get(ele,"opacity");
				currentOp+=dist;
				if(currentOp>=1){
					ele.opacity=1;
					clearInterval(intervelID);
					ele.intervalID=undefined;
					if(callback){
						callback();
					}
				}else{
					ele.opacity=currentOp;
				}
			}
			var intervelID=setInterval(step,25);
			ele.intervalID=intervelID;
		}
	};

	return {
		GennerUtil: GennerUtil,
		CookieUtil: CookieUtil,
		DomUtil: DomUtil,
		EventUtil: EventUtil,
		StyleUtil: StyleUtil,
		FormUtil: FormUtil,
		AjaxUtil: AjaxUtil,
		MoveUtil:MoveUtil
	};
})