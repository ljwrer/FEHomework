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
		var PREV = 0;
		var CURRENT = 0;
		var NEXT = 1;
		var NUM = 3;
		var intervalID = null;
		var bannerID = null;
		var btnID = null;
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
			if (intervalID) {
				clearInterval(intervalID);
			}
			var step = function() {
				bannerBtn(banner);
			}
			intervalID = setInterval(step, 5000)
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
				var item = util.ArrayUtil.search(bannerBtnBox.children, target);
				if(item==-1) return;
				if (intervalID) {
					clearInterval(intervalID);
				}
				NEXT = item;
				bannerBtn(banner);
				slider();
			}
		}
		slider();
	})();

	/* 左侧内容区 tab切换  */
	(function() {
		function Card(obj) {
			this.imgsrc = obj.middlePhotoUrl;
			this.name = obj.name;
			this.provider = obj.provider;
			this.learnerCount = obj.learnerCount;
			this.price = obj.price;
			this.category = obj.categoryName;
			this.description = obj.description;
			this.cardDiv = document.createElement("div");
			this.cardDiv.className = "m-card";
			this.bigCardDiv = document.createElement("div");
			this.bigCardDiv.className = "m-bigcard";
		}
		Card.prototype = {
			construtor: Card,
			init: function(parent) {
				var img = document.createElement("img");
				img.src = this.imgsrc;
				var namep = document.createElement("p");
				namep.className = "name";
				namep.innerText = this.name;
				var providerp = document.createElement("p");
				providerp.className = "provider";
				providerp.innerText = this.provider;
				var countDiv = document.createElement("div");
				countDiv.className = "m-learnercount";
				var sprite1 = document.createElement("div");
				sprite1.className = "u-sprite";
				var countSpan = document.createElement("span");
				countSpan.innerText = this.learnerCount;
				var priceSpan = document.createElement("span");
				priceSpan.className="price"
				priceSpan.innerText = this.price==0?"免费":"￥"+this.price;
				countDiv.appendChild(sprite1);
				countDiv.appendChild(countSpan);
				this.cardDiv.appendChild(img);
				this.cardDiv.appendChild(namep);
				this.cardDiv.appendChild(providerp);
				this.cardDiv.appendChild(countDiv);
				this.cardDiv.appendChild(priceSpan);
				parent.appendChild(this.cardDiv);
			},
			hover: function() {
				var topDiv = document.createElement("div");
				topDiv.className = "top";
				var img = document.createElement("img");
				img.src = this.imgsrc;
				var detailDiv = document.createElement("div");
				topDiv.className = "detail";
				var categoryH = document.createElement("h2");
				categoryH.innerText = this.category;
				var countDiv = document.createElement("div");
				countDiv.className = "count";
				var sprite2 = document.createElement("div");
				sprite2.className = "u-sprite";
				var countp = document.createElement("p");
				countp.innerText = this.learnerCount + "人在学";
				var provP = document.createElement("p");
				provP.className = "prov";
				provP.innerText = "发布者：" + this.provider;
				var categoryP = document.createElement("p");
				provP.className = "category";
				provP.innerText = "分类：" + this.category;
				var desP = document.createElement("p");
				desP.className = "des";
				desP.innerText = this.description;
				countDiv.appendChild(sprite2);
				countDiv.appendChild(countp);
				detailDiv.appendChild(categoryH);
				detailDiv.appendChild(countDiv);
				detailDiv.appendChild(provP);
				detailDiv.appendChild(categoryP);
				topDiv.appendChild(img);
				topDiv.appendChild(detailDiv);
				this.bigCardDiv.appendChild(topDiv);
				this.bigCardDiv.appendChild(desP);
				util.DomUtil.addClass(this.cardDiv,"j-relative");
				this.cardDiv.appendChild(this.bigCardDiv);
			},
			out:function(){
				this.cardDiv.removeChild(this.bigCardDiv);
				util.DomUtil.removeClass(this.cardDiv,"j-relative");
			}
		}
		var tablist = document.querySelector(".m-tab");
		var design = document.getElementById("design");
		var program = document.getElementById("program");
		var tabArray = [];
		tabArray.push(design);
		tabArray.push(program);
		var curIndex = -1;
		var cardBox = document.getElementById("cardBox");
		var pagerbox = document.getElementById("pager");
		util.EventUtil.addEvent(tablist,"click",contentChangeHandle);
//		util.EventUtil.addEvent(cardBox,"mouseover",cardOverHandle)
//		util.EventUtil.addEvent(cardBox,"mouseoout",cardOutHandle)
		function contentChangeHandle(event) {
			event = util.EventUtil.getEvent(event);
			var target = util.EventUtil.getTarget(event);
			if (target.nodeName == "SPAN") {
				var tarIndex = (util.ArrayUtil.search(tabArray, target));
				if (curIndex != tarIndex) {
					curIndex = tarIndex;
					util.DomUtil.removeClass(tabArray[1 - tarIndex], "j-tabed")
					util.DomUtil.addClass(tabArray[tarIndex], "j-tabed")
					cardBox.innerHTML = "";
					var url = "http://study.163.com/webDev/couresByCategory.htm";
					var options = {};
					var pageNo = parseInt(pagerbox.querySelector(".f-cur").innerText);
					var psize = 20;
					var type = 10 + tarIndex * 10;
					options.pageNo = pageNo;
					options.psize = psize;
					options.type = type;
					util.AjaxUtil.getAjax(url, options, AjaxHandle);
					function AjaxHandle(text) {
						var content = JSON.parse(text);
						var contentList=content.list;
						var cardList=[];
						for(var i=0,len=contentList.length;i<len;i++)
						{
							cardList[i]=new Card(contentList[i]);
							cardList[i].init(cardBox);
//							cardList[i].cardDiv.onmousemove=function(){
//								alert(1);
//							}
//							cardList[i].cardDiv.onmousemove=(function(){
//								cardList[i].hover
//							})(cardList[i].bigCardDiv);
//							
							cardList[i].cardDiv.onmousemove=(function(card){
								return function(){
									card.hover();
								}
							})(cardList[i])
							cardList[i].cardDiv.onmouseout=(function(card){
								return function(){
									card.out();
								}
							})(cardList[i])
						}
					}
				}
			}
		}
		function cardOverHandle(){
			event = util.EventUtil.getEvent(event);
			var target = util.EventUtil.getTarget(event);
			if(util.DomUtil.hasClass(target,"m-card")){
			}
		}
		function cardOutHandle(){
			event = util.EventUtil.getEvent(event);
			var target = util.EventUtil.getTarget(event);
			if(util.DomUtil.hasClass(target,"m-card")){
			}
		}
		design.click();
		





	})();
})