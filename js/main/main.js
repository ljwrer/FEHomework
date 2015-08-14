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
		var gtip = document.querySelector(".g-tip");
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
					util.StyleUtil.hide(follow.parentNode);
					util.StyleUtil.show(unfollow.parentNode);
					util.CookieUtil.set("followSuc", true);
					var oldfansNum = parseInt(fansNum.innerText);
					var newfansNum = oldfansNum + 1;
					fansNum.innerText = newfansNum;
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
	})();

	/* 轮播图  */
	(function() {
		var bannerView = document.getElementById("bannerView");
		var bannerList = bannerView.children;
		var bannerBtnList = document.getElementById("pointer").children;
		var PREV = 0;
		var CURRENT = 1;
		var NEXT = 2;
		var NUM = bannerList.length;
		var intervalID;
		function bannerBtn(callback) {
			var btnStep = function() {
				util.DomUtil.addClass(bannerBtnList[CURRENT], "j-cur");
				util.DomUtil.removeClass(bannerBtnList[PREV], "j-cur");
				if (callback) {
					callback();
				}
			}
			intervalID = setInterval(btnStep, 5000);
		}

		function banner() {
			var dist = 1 * 25 / 500;
			var bannerStep = function() {
				util.DomUtil.removeClass(bannerList[PREV], "j-banner-show");
				util.DomUtil.addClass(bannerList[PREV], "j-banner-hide");
				util.DomUtil.removeClass(bannerList[CURRENT], "j-banner-hide");
				util.DomUtil.addClass(bannerList[CURRENT], "j-banner-show");
				var currentOp = parseFloat(util.StyleUtil.get(bannerList[CURRENT], "opacity"));
				currentOp += dist;
				if (currentOp >= 1) {
					bannerList[CURRENT].style.opacity=1;
					PREV = CURRENT;
					CURRENT = NEXT;
					NEXT++;
					NEXT = NEXT % NUM;
					clearInterval(intervalID);
				}else{
					bannerList[CURRENT].style.opacity=currentOp;
				}
			}
			var intervalID = setInterval(bannerStep, 20);
		}
		bannerBtn(banner);
	})();
})