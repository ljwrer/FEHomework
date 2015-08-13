require.config({
	baseUrl: "js",
	paths: {
		"base": "base/base",
		"util": "base/util"
	}
})
require(["base", "util"], function(base, util) {

	/* 关闭顶部通知条 */
	var gtip = util.DomUtil.getElementsByClassName("g-tip")[0];
	var ghead = util.DomUtil.getElementsByClassName("g-head")[0];
	if (!util.CookieUtil.get("notip")) {
		var gtip = document.createElement("div");
		gtip.className = "g-tip";
		gtip.innerHTML = "";
		var htmlText = "";
		htmlText += '<div class="m-tip clear-fix">' + '<p>网易云课堂微专业，帮助你掌握专业技能，令你求职或加薪多一份独特优势！<a href="http://study.163.com/smartSpec/intro.htm" target="_blank">立即查看></a></p>' + '<div class="u-notip" id="notip">'
		+ '<p class="u-sprite"></p>' + '<span>不再提醒</span>' + '</div>';
		gtip.innerHTML = htmlText;
		ghead.parentNode.insertBefore(gtip, ghead);
		var notip = document.getElementById("notip");
		notip.onclick = function() {
			util.CookieUtil.set("notip", true);
			document.body.removeChild(gtip);
		}
	}
	
	/* 关注“网易教育产品部” /登录 */
	var follow=document.getElementById("follow");
	var login=document.getElementById("login");
	util.EventUtil.addEvent(follow,"click",followHandle,false);
	function followHandle(){
		if(!util.CookieUtil.get("loginSuc"))
		{
			util.StyleUtil.show(login);
			var closeLogin=document.getElementById("closeLogin");
			closeLogin.onclick=function(){
				util.StyleUtil.hide(login);
			}
		}	
	}
	
})