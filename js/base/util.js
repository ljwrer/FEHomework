define(["base"], function(base) {
	if (!("innerText" in document.body)) {
		HTMLElement.prototype.__defineGetter__("innerText", function() {
			return this.textContent;
		});
		HTMLElement.prototype.__defineSetter__("innnerText", function(s) {
			return this.textContent = s;
		});
	}
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
				for (var j = 0, len = nodes.length; j < len; j++) {
					nodes[j].hasAllClassName = true;
					for (var i = 0; i < namesArray.length; i++) {
						if (nodes[j].className.indexOf(namesArray[i]) === -1) {
							nodes[j].hasAllClassName = false;
						}
					}
				}
				for (i = 0; i < len; i++) {
					if (nodes[i].hasAllClassName) {
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
		}
	}
	var StyleUtil={
		hide:function(ele){
			DomUtil.removeClass(ele,"j-show");
			DomUtil.addClass(ele,"j-hide");
		},
		show:function(ele){
			DomUtil.removeClass(ele,"j-hide");
			DomUtil.addClass(ele,"j-show");
		}
	}

	return {
		CookieUtil: CookieUtil,
		DomUtil: DomUtil,
		EventUtil:EventUtil,
		StyleUtil:StyleUtil
	};
})