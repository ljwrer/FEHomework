require.config({
	baseUrl: "js",
	paths: {
		"base": "base/base",
		"util": "base/util",
		"md5": "lib/md5.min"
	},
	shim: {　　　　　　
		'md5': {　　　　　　　　
			exports: 'md5'　　　　
		}
	}
})
require(["base", "util", "md5"], function(base, util, md5) {
	/* 关闭顶部通知条 */
	(function() {
		var ghead = document.querySelector(".g-head");
		if (!util.CookieUtil.get("notip")) {
			var gtip = document.createElement("div");
			gtip.className = "g-tip";
			gtip.innerHTML = "";
			var htmlText = "";
			htmlText += '<div class="m-tip clear-fix">' + '<p>网易云课堂微专业，帮助你掌握专业技能，令你求职或加薪多一份独特优势！<a href="http://study.163.com/smartSpec/intro.htm" target="_blank">立即查看></a></p>' + '<div class="u-notip" id="notip">' + '<p class="u-sprite"></p>' + '<span>不再提醒</span>' + '</div>';
			gtip.innerHTML = htmlText;
			ghead.parentNode.insertBefore(gtip, ghead);
			var notip = document.getElementById("notip");
			notip.onclick = function() {
				util.CookieUtil.set("notip", true);
				document.body.removeChild(gtip);
			}
		}
	})();

	/* 关注网易教育产品部 登录  */
	(function() {
		var ghead = document.querySelector(".g-head");
		var fansNum = document.querySelector(".m-follow .fans span");
		var follow = document.getElementById("follow");
		var unfollow = document.getElementById("unfollow");
		var login = document.getElementById("login");
		util.EventUtil.addEvent(follow, "click", followHandle);
		util.EventUtil.addEvent(unfollow, "click", unfollowHandle);

		function followHandle() {
			if (!util.CookieUtil.get("loginSuc")) {
				util.StyleUtil.show(login);
				var loginForm = login.getElementsByTagName("form")[0];
				util.FormUtil.resetFields(loginForm);
				var closeLogin = document.getElementById("closeLogin");
				closeLogin.onclick = function() {
					loginForm.elements[0].value = "";
					loginForm.elements[1].value = "";
					util.StyleUtil.hide(login);
				};
				util.EventUtil.addEvent(loginForm, "submit", submitHandle);

				function submitHandle(event) {
					event = util.EventUtil.getEvent(event);
					util.EventUtil.preventDefault(event);
					var target = util.EventUtil.getTarget(event);
					var btn = target.elements[2];
					btn.disabled = true;
					var option = {};
					option.userName = md5(target.elements[0].value);
					option.password = md5(target.elements[1].value);
					util.AjaxUtil.getAjax("http://study.163.com/webDev/login.htm", option, loginHandle);

					function loginHandle(back) {
						btn.disabled = false;
						if (back == 1) {
							util.StyleUtil.hide(login);
							util.CookieUtil.set("loginSuc", true);
							followBtnHandle(true);
						}
					}
				}
			} else {
				followBtnHandle(true);
			}
		}

		function unfollowHandle() {
			followBtnHandle(false);
		}

		function followBtnHandle(sta) {
			switch (sta) {
				case true:
					util.AjaxUtil.getAjax("http://study.163.com/webDev/attention.htm", null, followSuccess);
					break;
				case false:
					util.StyleUtil.hide(unfollow.parentNode);
					util.StyleUtil.show(follow.parentNode);
					util.CookieUtil.set("followSuc", false);
					var oldfansNum = parseInt(fansNum.innerText);
					var newfansNum = oldfansNum - 1;
					fansNum.innerText = newfansNum;
					break;
				default:
					break;
			}
		}

		function followSuccess(sta) {
			if (sta == 1) {
				util.StyleUtil.hide(follow.parentNode);
				util.StyleUtil.show(unfollow.parentNode);
				util.CookieUtil.set("followSuc", true);
				var oldfansNum = parseInt(fansNum.innerText);
				var newfansNum = oldfansNum + 1;
				fansNum.innerText = newfansNum;
			}
		}
	})();

	/* 轮播图  */
	(function() {
		var bannerView = document.getElementById("bannerView");
		var bannerList = bannerView.children;
		var bannerBtnBox = document.getElementById("pointer")
		var bannerBtnList = bannerBtnBox.children;
		var PREV=0;
		var CURRENT = 0;
		var NEXT = 1;
		var NUM = bannerList.length;
		var intervalID = null;
		var bannerID = null;
		var btnID=null;
		/* 初始化 */
		banner();
		util.DomUtil.addClass(bannerBtnList[CURRENT], "j-cur");
		/* 按钮函数 */
		function bannerBtn(callback) {
				util.DomUtil.removeClass(bannerBtnList[CURRENT], "j-cur");
				util.DomUtil.addClass(bannerBtnList[NEXT], "j-cur");
				counter();
				if (callback) {
					callback();
				}
		}
		/* 淡入函数 */
		function banner(callback) {
			if (bannerID) {
				clearInterval(bannerID);
			}
			var dist = 1 * 5 / 500;
			bannerList[PREV].style.opacity = 0;
			bannerList[CURRENT].style.opacity = 0;
			var bannerStep = function() {
				var currentOp = parseFloat(util.StyleUtil.get(bannerList[CURRENT], "opacity"));
				currentOp += dist;
				if (currentOp >= 1) {
					bannerList[CURRENT].style.opacity = 1;
					clearInterval(bannerID);
					if (callback) {
						callback();
					}
				} else {
					bannerList[CURRENT].style.opacity = currentOp;
				}
			}
			bannerID = setInterval(bannerStep, 5);
		}
		/* 更新计数 */
		function counter() {
			PREV = CURRENT;
			CURRENT = NEXT;
			NEXT++;
			NEXT = NEXT % NUM;
		}

		function slider() {
			if(intervalID){
				clearInterval(intervalID);
			}
			var step=function(){
				bannerBtn(banner);
			}
			intervalID=setInterval(step,5000)
		}
		util.EventUtil.addEvent(bannerView, "mouseover", viewOverHandle);
		util.EventUtil.addEvent(bannerView, "mouseout", viewOutHandle);
		function viewOverHandle(event) {
			event = util.EventUtil.getEvent(event);
			var target = util.EventUtil.getTarget(event);
			if (target.nodeName == "IMG") {
				if (intervalID) {
					clearInterval(intervalID);
				}

			}
		}
		function viewOutHandle(event) {
			event = util.EventUtil.getEvent(event);
			var target = util.EventUtil.getTarget(event);
			if (target.nodeName == "IMG") {
				slider();
			}
		}
		util.EventUtil.addEvent(bannerBtnBox, "click", bannerBtnHandle);
		function bannerBtnHandle(event) {
			event = util.EventUtil.getEvent(event);
			var target = util.EventUtil.getTarget(event);
			if (target.nodeName == "LI"); {
				var item = util.ArrayUtil.search(this.children, target);
				if(intervalID){
					clearInterval(intervalID);
				}
				NEXT = item;
				bannerBtn(banner);
				slider();
			}
		}
		slider();
	})();
})