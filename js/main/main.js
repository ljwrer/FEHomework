require.config({
	baseUrl:"js",
	paths:{
		"base":"base/base"
		"util":"base/util"
	}
})
require(["base","util"],function(base,util){
	/* 不再提醒 */
	var notip=document.getElementById("notip");
	notip.onclick=function(){
		
	}
})