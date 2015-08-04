/* base interface */
define([], function() {
	if (!("innerText" in document.body)) {
		HTMLElement.prototype.__defineGetter__("innerText", function() {
			return this.textContent;
		});
		HTMLElement.prototype.__defineSetter__("innnerText", function(s) {
			return this.textContent = s;
		});
	}

	var addEvent = document.addEventListener ? function(elem, type, listener, useCapture) {
		elem.addEventListener(type, listener, useCapture);
	} : function(elem, type, listener, useCapture) {
		elem.attachEvent('on' + type, listener);
	}
	var delEvent = document.removeEventListener ? function(elem, type, listener, useCapture) {
		elem.removeEventListener(type, listener, useCapture);
	} : function(elem, type, listener, useCapture) {
		elem.detachEvent('on' + type, listener);
	}

	var getElementsByClassName = function(className, tag, elm) {
		if (document.getElementsByClassName) {
			getElementsByClassName = function(className, tag, elm) {
				elm = elm || document;
				var elements = elm.getElementsByClassName(className),
					nodeName = (tag) ? new RegExp("\\b" + tag + "\\b", "i") : null,
					returnElements = [],
					current;
				for (var i = 0, il = elements.length; i < il; i += 1) {
					current = elements[i];
					if (!nodeName || nodeName.test(current.nodeName)) {
						returnElements.push(current);
					}
				}
				return returnElements;
			};
		} else if (document.evaluate) {
			getElementsByClassName = function(className, tag, elm) {
				tag = tag || "*";
				elm = elm || document;
				var classes = className.split(" "),
					classesToCheck = "",
					xhtmlNamespace = "http://www.w3.org/1999/xhtml",
					namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace) ? xhtmlNamespace : null,
					returnElements = [],
					elements,
					node;
				for (var j = 0, jl = classes.length; j < jl; j += 1) {
					classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
				}
				try {
					elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
				} catch (e) {
					elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
				}
				while ((node = elements.iterateNext())) {
					returnElements.push(node);
				}
				return returnElements;
			};
		} else {
			getElementsByClassName = function(className, tag, elm) {
				tag = tag || "*";
				elm = elm || document;
				var classes = className.split(" "),
					classesToCheck = [],
					elements = (tag === "*" && elm.all) ? elm.all : elm.getElementsByTagName(tag),
					current,
					returnElements = [],
					match;
				for (var k = 0, kl = classes.length; k < kl; k += 1) {
					classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
				}
				for (var l = 0, ll = elements.length; l < ll; l += 1) {
					current = elements[l];
					match = false;
					for (var m = 0, ml = classesToCheck.length; m < ml; m += 1) {
						match = classesToCheck[m].test(current.className);
						if (!match) {
							break;
						}
					}
					if (match) {
						returnElements.push(current);
					}
				}
				return returnElements;
			};
		}
		return getElementsByClassName(className, tag, elm);
	};

	function addLoadEvent(func) {
		var oldonload = window.onload;
		if (typeof window.onload != 'function') {
			window.onload = func;
		} else {
			window.onload = function() {
				oldonload();
				func();
			}
		}
	}

	function insertAfter(newElement, targetElement) {
		var parent = targetElement.parentNode;
		if (targetElement === parent.lastChild) {
			parent.appendChild(newElement);
		} else {
			parent.insertBefore(newElement, targetElement.nextSibling);
		}
	}

	/* AJAX */
	function getHTTPObject() {
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
	}
	var serialize = function(data) {
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
	};
	var getAjax = function(url, options, callback) {
		var xhr = new getHTTPObject();
		xhr.open("GET", url + "?" + serialize(options), true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status >= 200 && xhr.status <= 300 || xhr.status == 304) {
					callback(xhr.responseText);
				} else {
					alert("get failed,status:" + xhr.status);
				}
			}
		};
		xhr.send(null);
	};
	var postAjax = function(url, options, callback) {
		var xhr = new getHTTPObject();
		xhr.open("POST", url, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status >= 200 && xhr.status <= 300 || xhr.status == 304) {
					callback(xhr.responseText);
				} else {
					alert("post failed,status:" + xhr.status);
				}
			}
		};
		xhr.send(serialize(options));
	};

	function nextElementSibling(ele) {
		if (ele.nextElementSibling) return ele.nextElementSibling;
		if (ele.nextSibling.nodeType === 1) return ele.nextSibling;
		if (ele.nextSibling) return nextElementSibling(ele.nextSibling);
		return null;
	}

	function addClass(ele, value) {
		if (!ele.className) {
			ele.className = value;
		} else {
			ele.className += " value";
		}

	}

	function positionElement(ele, x, y) {
		ele.style.position = "absolute";
		ele.style.left = parseInt(x) + "px" || 0;
		ele.style.top = parseInt(y) + "px" || 0;
	}

	function moveElement(ele, finalX, finalY, intervel) {
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
	}

	var getElementChildren = function(element) {
		var ret = [];
		if (element.children) {
			ret = element.children;
		} else {
			var childNodes = element.childNodes;
			for (var i = 0, len = childNodes.length; i < len; i++) {
				if (childNodes[i].nodeType === 1) {
					ret[ret.length] = childNodes[i];
				}
			}
		}
		return ret;
	}

	function repalceChar(str, char) {
		var i;
		while ((i = str.indexOf(char)) != -1) {
			str = str.slice(0, i) + str.charAt(i + 1).toUpperCase() + str.slice(i + 2);
		}
		return str;
	}

	function getDataset(node) {
		var result = {};
		if (node.dataset) {
			result = node.dataset;
		} else {
			var nodeAtt = node.attributes;
			var len = nodeAtt.length;
			var i = 0;
			var name = '',
				value = '';
			for (; i < len; i++) {
				if (/^(data-)/.test(nodeAtt[i].nodeName)) {
					name = nodeAtt[i].nodeName.slice(5);
					name = repalceChar(name, '-');
					value = nodeAtt[i].nodeValue;
					result[name] = value;
				}
			}
		}
		return result;
	}

	function getStyleDeclaration(node) {
		if (window.getComputedStyle) {
			return window.getComputedStyle(node);
		} else {
			return node.currentStyle;
		}
	}

	function colourNameToHex(colour) {
		var colours = {
			"aliceblue": "#f0f8ff",
			"antiquewhite": "#faebd7",
			"aqua": "#00ffff",
			"aquamarine": "#7fffd4",
			"azure": "#f0ffff",
			"beige": "#f5f5dc",
			"bisque": "#ffe4c4",
			"black": "#000000",
			"blanchedalmond": "#ffebcd",
			"blue": "#0000ff",
			"blueviolet": "#8a2be2",
			"brown": "#a52a2a",
			"burlywood": "#deb887",
			"cadetblue": "#5f9ea0",
			"chartreuse": "#7fff00",
			"chocolate": "#d2691e",
			"coral": "#ff7f50",
			"cornflowerblue": "#6495ed",
			"cornsilk": "#fff8dc",
			"crimson": "#dc143c",
			"cyan": "#00ffff",
			"darkblue": "#00008b",
			"darkcyan": "#008b8b",
			"darkgoldenrod": "#b8860b",
			"darkgray": "#a9a9a9",
			"darkgreen": "#006400",
			"darkkhaki": "#bdb76b",
			"darkmagenta": "#8b008b",
			"darkolivegreen": "#556b2f",
			"darkorange": "#ff8c00",
			"darkorchid": "#9932cc",
			"darkred": "#8b0000",
			"darksalmon": "#e9967a",
			"darkseagreen": "#8fbc8f",
			"darkslateblue": "#483d8b",
			"darkslategray": "#2f4f4f",
			"darkturquoise": "#00ced1",
			"darkviolet": "#9400d3",
			"deeppink": "#ff1493",
			"deepskyblue": "#00bfff",
			"dimgray": "#696969",
			"dodgerblue": "#1e90ff",
			"firebrick": "#b22222",
			"floralwhite": "#fffaf0",
			"forestgreen": "#228b22",
			"fuchsia": "#ff00ff",
			"gainsboro": "#dcdcdc",
			"ghostwhite": "#f8f8ff",
			"gold": "#ffd700",
			"goldenrod": "#daa520",
			"gray": "#808080",
			"green": "#008000",
			"greenyellow": "#adff2f",
			"honeydew": "#f0fff0",
			"hotpink": "#ff69b4",
			"indianred ": "#cd5c5c",
			"indigo": "#4b0082",
			"ivory": "#fffff0",
			"khaki": "#f0e68c",
			"lavender": "#e6e6fa",
			"lavenderblush": "#fff0f5",
			"lawngreen": "#7cfc00",
			"lemonchiffon": "#fffacd",
			"lightblue": "#add8e6",
			"lightcoral": "#f08080",
			"lightcyan": "#e0ffff",
			"lightgoldenrodyellow": "#fafad2",
			"lightgrey": "#d3d3d3",
			"lightgreen": "#90ee90",
			"lightpink": "#ffb6c1",
			"lightsalmon": "#ffa07a",
			"lightseagreen": "#20b2aa",
			"lightskyblue": "#87cefa",
			"lightslategray": "#778899",
			"lightsteelblue": "#b0c4de",
			"lightyellow": "#ffffe0",
			"lime": "#00ff00",
			"limegreen": "#32cd32",
			"linen": "#faf0e6",
			"magenta": "#ff00ff",
			"maroon": "#800000",
			"mediumaquamarine": "#66cdaa",
			"mediumblue": "#0000cd",
			"mediumorchid": "#ba55d3",
			"mediumpurple": "#9370d8",
			"mediumseagreen": "#3cb371",
			"mediumslateblue": "#7b68ee",
			"mediumspringgreen": "#00fa9a",
			"mediumturquoise": "#48d1cc",
			"mediumvioletred": "#c71585",
			"midnightblue": "#191970",
			"mintcream": "#f5fffa",
			"mistyrose": "#ffe4e1",
			"moccasin": "#ffe4b5",
			"navajowhite": "#ffdead",
			"navy": "#000080",
			"oldlace": "#fdf5e6",
			"olive": "#808000",
			"olivedrab": "#6b8e23",
			"orange": "#ffa500",
			"orangered": "#ff4500",
			"orchid": "#da70d6",
			"palegoldenrod": "#eee8aa",
			"palegreen": "#98fb98",
			"paleturquoise": "#afeeee",
			"palevioletred": "#d87093",
			"papayawhip": "#ffefd5",
			"peachpuff": "#ffdab9",
			"peru": "#cd853f",
			"pink": "#ffc0cb",
			"plum": "#dda0dd",
			"powderblue": "#b0e0e6",
			"purple": "#800080",
			"red": "#ff0000",
			"rosybrown": "#bc8f8f",
			"royalblue": "#4169e1",
			"saddlebrown": "#8b4513",
			"salmon": "#fa8072",
			"sandybrown": "#f4a460",
			"seagreen": "#2e8b57",
			"seashell": "#fff5ee",
			"sienna": "#a0522d",
			"silver": "#c0c0c0",
			"skyblue": "#87ceeb",
			"slateblue": "#6a5acd",
			"slategray": "#708090",
			"snow": "#fffafa",
			"springgreen": "#00ff7f",
			"steelblue": "#4682b4",
			"tan": "#d2b48c",
			"teal": "#008080",
			"thistle": "#d8bfd8",
			"tomato": "#ff6347",
			"turquoise": "#40e0d0",
			"violet": "#ee82ee",
			"wheat": "#f5deb3",
			"white": "#ffffff",
			"whitesmoke": "#f5f5f5",
			"yellow": "#ffff00",
			"yellowgreen": "#9acd32"
		};
		if (typeof colours[colour.toLowerCase()] != 'undefined')
			return colours[colour.toLowerCase()];
		return false;
	}

	function hex2rgb(col) {
		var r, g, b;
		if (col.charAt(0) == '#') {
			col = col.substr(1);
		}
		r = col.charAt(0) + col.charAt(1);
		g = col.charAt(2) + col.charAt(3);
		b = col.charAt(4) + col.charAt(5);
		r = parseInt(r, 16);
		g = parseInt(g, 16);
		b = parseInt(b, 16);
		return 'rgb(' + r + ',' + g + ',' + b + ')';
	}

	function getStyle(ele, prop) {
		var dec = getStyle(ele);
		prop = repalceChar(prop, "-");
		var result = dec[prop];
		if (prop === "color" && !window.getComputedStyle) {
			result = hex2rgb(colourNameToHex(result));
		}
		return result;
	}

	return {
		addEvent: addEvent,
		delEvent: delEvent,
		getElementsByClassName: getElementsByClassName,
		addLoadEvent: addLoadEvent,
		insertAfter: insertAfter,
		getHTTPObject: getHTTPObject,
		getAjax: getAjax,
		postAjax: postAjax,
		nextElementSibling: nextElementSibling,
		addClass: addClass,
		positionElement: positionElement,
		moveElement: moveElement,
		getElementChildren: getElementChildren,
		getDataset: getDataset,
		getStyleDeclaration: getStyleDeclaration,
		getStyle: getStyle
	}
})