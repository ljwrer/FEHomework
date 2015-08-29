require.config({
	baseUrl: "js",
	paths: {
		"util": "base/util",
		"md5": "lib/md5.min"
	},
	shim: {　　　　　　
		'md5': {　　　　　　　　
			exports: 'md5'　　　　
		}
	}
})
require(["util", "md5"], function(util, md5) {
	//关闭顶部通知条 
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
			//点击不再提示时设置cooikie并删除节点
			notip.onclick = function() {
				util.CookieUtil.set("notip", true);
				document.body.removeChild(gtip);
			}
		}
	})();

	//关注网易教育产品部 登录
	(function() {
		var ghead = document.querySelector(".g-head");
		var fansNum = document.querySelector(".m-follow .fans span");
		var follow = document.getElementById("follow");
		var unfollow = document.getElementById("unfollow");
		var login = document.getElementById("login");
		util.EventUtil.addEvent(follow, "click", followHandle);
		util.EventUtil.addEvent(unfollow, "click", unfollowHandle);
		//点击关注处理函数
		function followHandle() {
				//检测是否设置登录cookie
				if (!util.CookieUtil.get("loginSuc")) {
					util.StyleUtil.show(login);
					var loginForm = login.getElementsByTagName("form")[0];
					util.FormUtil.resetFields(loginForm);
					var closeLogin = document.getElementById("closeLogin");
					//关闭登录窗口
					closeLogin.onclick = function() {
						loginForm.elements[0].value = "";
						loginForm.elements[1].value = "";
						util.StyleUtil.hide(login);
					};
					util.EventUtil.addEvent(loginForm, "submit", submitHandle);
					//点击登陆处理函数
					function submitHandle(event) {
						event = util.EventUtil.getEvent(event);
						util.EventUtil.preventDefault(event);
						var target = util.EventUtil.getTarget(event);
						//表单验证
						if (!("required" in document.createElement("input"))) {
							if (!util.FormUtil.validateForm(target)) {
								return false;
							}
						}
						var btn = target.elements[2];
						btn.disabled = true;
						var option = {};
						option.userName = md5(target.elements[0].value);
						option.password = md5(target.elements[1].value);
						util.AjaxUtil.getAjax("http://study.163.com/webDev/login.htm", option, loginHandle);
						//登陆结果处理
						function loginHandle(back) {
							btn.disabled = false;
							//登陆成功，关闭窗口，设置cookie
							if (back == 1) {
								util.StyleUtil.hide(login);
								util.CookieUtil.set("loginSuc", true);
								followBtnHandle(true);
							} else {
								alert("账号或密码错误，请重新输入！");
							}
						}
					}
				} else {
					followBtnHandle(true);
				}
			}
			//点击取消关注处理函数

		function unfollowHandle() {
				followBtnHandle(false);
			}
			//处理关注与取消关注

		function followBtnHandle(sta) {
				switch (sta) {
					case true:
						util.AjaxUtil.getAjax("http://study.163.com/webDev/attention.htm", null, followSuccess);
						break;
					case false:
						//取消关注，修改cookie并改变显示效果，修改粉丝数
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
			//关注成功，设置cookie并改变显示效果，修改粉丝数

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

	//轮播图 
	(function() {
		var bannerView = document.getElementById("bannerView");
		var bannerList = bannerView.children;
		var bannerBtnBox = document.getElementById("pointer")
		var bannerBtnList = bannerBtnBox.querySelectorAll("li");
		var PREV = 0;
		var CURRENT = 0;
		var NEXT = 1;
		var NUM = 3;
		var intervalID = null;
		var bannerID = null;
		var btnID = null;
		//初始化 
		banner();
		util.DomUtil.addClass(bannerBtnList[CURRENT], "j-cur");
		//按钮切换函数
		function bannerBtn(callback) {
				util.DomUtil.removeClass(bannerBtnList[CURRENT], "j-cur");
				util.DomUtil.addClass(bannerBtnList[NEXT], "j-cur");
				counter();
				if (callback) {
					callback();
				}
			}
			//500ms淡入函数 

		function banner(callback) {
				if (bannerID) {
					clearInterval(bannerID);
				}
				var dist = 1 * 5 / 500;
				bannerList[PREV].style.opacity = 0;
				bannerList[PREV].style.filter = 'alpha(opacity:' + 0 + ')';
				bannerList[CURRENT].style.opacity = 0;
				bannerList[CURRENT].style.filter = 'alpha(opacity:' + 0 + ')';
				var bannerStep = function() {
					var currentOp = parseFloat(util.StyleUtil.get(bannerList[CURRENT], "opacity"));
					currentOp += dist;
					if (currentOp >= 1) {
						bannerList[CURRENT].style.opacity = 1;
						bannerList[CURRENT].style.filter = 'alpha(opacity:' + 100 + ')';
						clearInterval(bannerID);
						if (callback) {
							callback();
						}
					} else {
						bannerList[CURRENT].style.opacity = currentOp;
						bannerList[CURRENT].style.filter = 'alpha(opacity:' + currentOp * 100 + ')';
					}
				}
				bannerID = setInterval(bannerStep, 5);
			}
			//更新计数 

		function counter() {
				PREV = CURRENT;
				CURRENT = NEXT;
				NEXT++;
				NEXT = NEXT % NUM;
			}
			//5000ms轮播函数

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
		//mouseover暂停轮播
		function viewOverHandle(event) {
				event = util.EventUtil.getEvent(event);
				var target = util.EventUtil.getTarget(event);
				if (target.nodeName == "IMG") {
					if (intervalID) {
						clearInterval(intervalID);
					}
				}
			}
			//mouseout继续轮播

		function viewOutHandle(event) {
			event = util.EventUtil.getEvent(event);
			var target = util.EventUtil.getTarget(event);
			if (target.nodeName == "IMG") {
				slider();
			}
		}
		util.EventUtil.addEvent(bannerBtnBox, "click", bannerBtnHandle);
		//点击按钮切换图片
		function bannerBtnHandle(event) {
				event = util.EventUtil.getEvent(event);
				var target = util.EventUtil.getTarget(event);
				if (target.nodeName == "LI"); {
					var item = util.ArrayUtil.search(bannerBtnList, target);
					if (item == -1) return;
					if (intervalID) {
						clearInterval(intervalID);
					}
					NEXT = item;
					bannerBtn(banner);
					slider();
				}
			}
			//开始轮播
		slider();
	})();

	//左侧内容区 tab切换
	(function() {
		//卡片对象构造函数
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
			this.bigCardDiv.className = "m-bigcard j-hide";
		}
		Card.prototype = {
			construtor: Card,
			//卡片初始化，此处使用innerHTML更加精简
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
				priceSpan.className = "price"
				priceSpan.innerHTML = this.price == 0 ? "免费" : "&yen;" + this.price;
				countDiv.appendChild(sprite1);
				countDiv.appendChild(countSpan);
				this.cardDiv.appendChild(img);
				this.cardDiv.appendChild(namep);
				this.cardDiv.appendChild(providerp);
				this.cardDiv.appendChild(countDiv);
				this.cardDiv.appendChild(priceSpan);
				parent.appendChild(this.cardDiv);
				var topDiv = document.createElement("div");
				topDiv.className = "top";
				var img = document.createElement("img");
				img.src = this.imgsrc;
				var detailDiv = document.createElement("div");
				detailDiv.className = "detail";
				var categoryH = document.createElement("h2");
				categoryH.innerText = this.name;
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
				categoryP.className = "category";
				categoryP.innerText = "分类：" + this.category;
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
				this.cardDiv.appendChild(this.bigCardDiv);
			},
			//hover处理
			hover: function() {
				util.DomUtil.addClass(this.cardDiv, "j-relative");
				util.StyleUtil.show(this.bigCardDiv);
			},
			//mouseout处理
			out: function() {
				util.DomUtil.removeClass(this.cardDiv, "j-relative");
				util.StyleUtil.hide(this.bigCardDiv);
			}
		}
		var tablist = document.querySelector(".m-tab");
		var design = document.getElementById("design");
		var program = document.getElementById("program");
		var tabArray = [];
		tabArray.push(design);
		tabArray.push(program);
		var curIndex = -1;
		var tarIndex = -1;
		var pageNum = 1;
		var pageCurIndex = 1;
		var pageTarIndex = 1;
		var pageIndex = [];
		for (var i = 1; i < 9; i++) {
			pageIndex[i] = i;
		}
		var totalCount;
		var totalPage;
		var cardBox = document.getElementById("cardBox");
		var pagerbox = document.getElementById("pager");
		var pagerArray = [];
		for (var i = 0, len = pagerbox.children.length; i < len; i++) {
			pagerArray[i] = pagerbox.children[i];
		}
		util.EventUtil.addEvent(tablist, "click", contentChangeHandle);
		util.EventUtil.addEvent(pagerbox, "click", pagerChangeHandle);
		//tab选项卡切换
		function contentChangeHandle(event) {
				event = util.EventUtil.getEvent(event);
				var target = util.EventUtil.getTarget(event);
				if (target.nodeName == "SPAN") {
					tarIndex = (util.ArrayUtil.search(tabArray, target));
					if (curIndex != tarIndex) {
						curIndex = tarIndex;
						util.DomUtil.removeClass(tabArray[1 - tarIndex], "j-tabed")
						util.DomUtil.addClass(tabArray[tarIndex], "j-tabed")
						requestData();
					}
				}
			}
			//底部分页器切换

		function pagerChangeHandle(event) {
				event = util.EventUtil.getEvent(event);
				var target = util.EventUtil.getTarget(event);
				if (target.nodeName == "LI" && target.innerText != "") {
					var pageTarIndex = util.ArrayUtil.search(pagerArray, target)
					if (pageCurIndex != pageTarIndex) {
						switch (pageTarIndex) {
							//前一页
							case 0:
								if (pageNum > 1) {
									if (pageNum % 8 == 1) {
										for (var i = 1; i <= 8; i++) {
											pagerArray[i].innerText = parseInt(pagerArray[i].innerText) - 8;
											pagerArray[i].style.display = "inline-block";
										}
									}
									pageNum--;
									pageTarIndex = pageNum % 8 ? pageNum % 8 : 8;
								}
								break;
								//后一页
							case 9:
								if (pageNum < totalPage) {
									if (pageNum % 8 == 0 && pageNum < totalPage) {
										for (var i = 1; i <= 8; i++) {
											pagerArray[i].innerText = parseInt(pagerArray[i].innerText) + 8;
											if (parseInt(pagerArray[i].innerText) > totalPage) {
												pagerArray[i].style.display = "none";
											}
										}
									}
									pageNum++;
									pageTarIndex = pageNum % 8;

								}
								break;
							default:
								pageNum = pagerArray[pageTarIndex].innerText;
								break;
						}
						util.DomUtil.removeClass(pagerArray[pageCurIndex], "f-cur");
						util.DomUtil.addClass(pagerArray[pageTarIndex], "f-cur");
						pageCurIndex = pageTarIndex;
						requestData();
					}
				}
			}
			//成功请求卡片数据后处理

		function AjaxHandle(text) {
				var content = JSON.parse(text);
				totalCount = content.totalCount;
				totalPage = content.totalPage;
				var contentList = content.list;
				var cardList = [];
				for (var i = 0, len = contentList.length; i < len; i++) {
					//生成卡片
					cardList[i] = new Card(contentList[i]);
					//插入卡片
					cardList[i].init(cardBox);
					//卡片hover,显示详情
					cardList[i].cardDiv.onmousemove = (function(card) {
						return function() {
							card.hover();
						}
					})(cardList[i]);
					//绑定卡片mouseout事件
					cardList[i].cardDiv.onmouseout = (function(card) {
						return function() {
							card.out();
						}
					})(cardList[i]);
				}
			}
			//设置卡片Ajax请求参数

		function requestData() {
				cardBox.innerHTML = "";
				var url = "http://study.163.com/webDev/couresByCategory.htm";
				var options = {};
				var pageNo = pageNum;
				var psize = document.body.clientWidth >= 1205 ? 20 : 15;
				var type = 10 + tarIndex * 10;
				options.pageNo = pageNo;
				options.psize = psize;
				options.type = type;
				util.AjaxUtil.getAjax(url, options, AjaxHandle);
			}
			//初始化，第一次数据请求
		design.click();
	})();

	//右侧"机构介绍"中的视频介绍 
	(function() {
		var videoOpenBtn = document.getElementById("videoBtn");
		var videoCloseBtn = document.getElementById("videoCloseBtn");
		var videoMask = document.getElementById("videoMask");
		var videoWindow = document.getElementById("videoWindow");
		//点击打开视频窗口，自动播放视频
		videoOpenBtn.onclick = function() {
				util.StyleUtil.show(videoMask);
				if (videoWindow.play) {
					videoWindow.play();
				}
			}
			//点击暂停视频播放，关闭视频窗口
		videoCloseBtn.onclick = function() {
			if (videoWindow.pause) {
				videoWindow.pause();
			}
			util.StyleUtil.hide(videoMask);
		}
	})();

	//右侧"热门推荐"
	(function() {
		//mini卡片对象构造函数
		function MiniCard(obj) {
			this.imgsrc = obj.smallPhotoUrl;
			this.name = obj.name;
			this.learnerCount = obj.learnerCount;
		}
		MiniCard.prototype = {
			constructor: MiniCard,
			//mini卡片初始化
			init: function(parent) {
				var minicardDiv = document.createElement("div");
				minicardDiv.className = "m-minicard clear-fix";
				minicardDiv.innerHTML = '<img src="' + this.imgsrc + '" /><div class="detail clear-fix"><p>' + this.name + '</p><div class="count clear-fix"><div class="u-sprite"></div><span>' + this.learnerCount + '</span></div></div>';
				parent.appendChild(minicardDiv);
			}
		};
		var minicardBox = document.getElementById("minicardBox");
		var url = "http://study.163.com/webDev/hotcouresByCategory.htm";
		var options = null;
		var minicardList = [];
		util.AjaxUtil.getAjax(url, options, miniCardAjaxHandle);
		//成功请求mini卡片数据后处理
		function miniCardAjaxHandle(text) {
			minicardBox.innerHTML = "";
			var contentArray = JSON.parse(text);
			for (var i = 0, len = contentArray.length; i < len; i++) {
				//生成mini卡片
				minicardList[i] = new MiniCard(contentArray[i]);
				//插入mini卡片
				minicardList[i].init(minicardBox);
			}
		}
		var minicardBoxView = document.querySelector(".m-ranklist-view");
		var reg = 1;
		var regc = 1;
		//最热排行5000ms滚动
		var step = function() {
			var tarY = -reg * 70;
			if (reg == 10 || reg == 0) {
				regc = -regc;
			}
			reg += regc;
			util.MoveUtil.moveElement(minicardBox, 0, tarY, 10);
		}
		setInterval(step, 5000);
	})();
})