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
	var gtip = util.DomUtil.getElementsByClassName("g-tip")[0];
	var ghead = util.DomUtil.getElementsByClassName("g-head")[0];
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

	/* 关注网易教育产品部 登录  */
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
					if (back == 1) {
						util.StyleUtil.hide(login);
						util.StyleUtil.hide(follow.parentNode);
						util.StyleUtil.show(unfollow.parentNode);
						util.CookieUtil.set("followSuc", true);
						util.CookieUtil.set("loginSuc", true);
					} else {
						btn.disabled = false;
					}
				}
			}
		} else {
			util.CookieUtil.set("followSuc", true);
			util.StyleUtil.hide(follow.parentNode);
			util.StyleUtil.show(unfollow.parentNode);
		}
	}
	function unfollowHandle() {
		event = util.EventUtil.getEvent(event);
		var target = util.EventUtil.getTarget(event);
		util.StyleUtil.hide(unfollow.parentNode);
		util.StyleUtil.show(follow.parentNode);
		util.CookieUtil.set("followSuc", false);
	}
})