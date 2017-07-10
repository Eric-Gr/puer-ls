window.onload = function(){
	selfAdaption();//自适应
	screenResize();//屏幕宽度变化自适应
	followBtn();//关注按钮
	sldsShow();//轮播图
	topList();//最热排行
	videoPop();//视频弹窗

}

//自适应
function selfAdaption(){
	var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var head = document.getElementsByTagName("head")[0];
	if (w >= 1205) {
		courseTab(20);
		innerCourseList(1,20,10);
	}else{
		var link = document.createElement("link");
		link.id = "mincss"
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = "css/min.css"
		head.appendChild(link);
		courseTab(15);
		innerCourseList(1,15,10);
	}
}

function screenResize(){
	function screenChange(){
		var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var head = document.getElementsByTagName("head")[0];
		var links = head.getElementsByTagName("link");
		var oLink = links[links.length-1];
		if (w >= 1205) {
			if (oLink.id == "mincss") {
				var link = document.getElementById("mincss");
				head.removeChild(link);
				courseTab(20);
				innerCourseList(1,20,10);
			}
		}else{
			if (oLink.id != "mincss") {
				var link = document.createElement("link");
				link.id = "mincss"
				link.rel = "stylesheet";
				link.type = "text/css";
				link.href = "css/min.css"
				head.appendChild(link);
				courseTab(15);
				innerCourseList(1,15,10);
			}
		}
	}
	window.onresize = function(){
		screenChange();
	}
}

//顶部通知条
(function closeNtc(){
	var oNtc = document.getElementById("m-ntc");
	var oSpan = oNtc.getElementsByTagName("span")[0];
	var cookie = getCookie();
	if (cookie.closeNtc == "true")
		addClass(oNtc,"f-dn");
	oSpan.onclick = function(){
		addClass(oNtc,"f-dn");
		setCookie("closeNtc","true");
	}
}())

//关注按钮
function followBtn(){
	var follow = document.getElementById("follow");
	var followBtn = follow.getElementsByTagName("div")[0];
	var cookie = getCookie();
	function flo(){
		get("http://study.163.com/webDev/attention.htm",{},function(data){
			if (data == 1)
				addClass(follow,"follow2");
				followBtn.innerHTML = "取消";
				setCookie("followSuc","true");
				followBtn.onclick = unflo;
		})
	}
	function unflo(){
		delClass(follow,"follow2");
		followBtn.innerHTML = "关注";
		setCookie("followSuc","false");
		followBtn.onclick = flo;
	}
	if (cookie.loginSuc == "true") {
		if (cookie.followSuc == "true") {
			addClass(follow,"follow2");
			followBtn.innerHTML = "取消";
			followBtn.onclick = unflo;
		}else{
			followBtn.onclick = flo;
		}
	}else{
		followBtn.onclick = function(){
			var popup = document.createElement("div");
			addClass(popup,"m-log");
			popup.innerHTML = '<i class="f-csp"></i><h3>登录网易云课堂</h3><form id="login-form" name="loginForm" autocomplete="off"><div id="err" class="err"></div><input class="input" type="text" name="username" placeholder="账号"><input class="input" type="password" name="password" placeholder="密码"><input id="login-btn" class="button f-csp" type="button" name="loginBtn" value="登录"></form>'
			var close = popup.getElementsByTagName("i")[0];
			createPop(popup,close);
			login();
		}
	}
}

//登录
function login(){
	var form = document.forms.loginForm;
	var logBtn = getElementsByClassName(form,"button")[0];
	var nErr = document.getElementById("err");
	function showErr(err){
		if (!err) {
			nErr.innerHTML = "";
			delClass(nErr,"z-show");
		}else{
			nErr.innerHTML = err;
			addClass(nErr,"z-show");
		}
	}
	function invalidInput(node,err){
		showErr(err);
		addClass(node,"z-err");
		node.focus();
	}
	function clearInvalid(node){
		showErr();
		delClass(node,"z-err");
	}
	form.oninput = function(event){
		var target = event.srcElement ? event.srcElement : event.target;
		clearInvalid(target);
	}
	logBtn.onclick = function(){
		var un = form.username.value;
		var	pw = form.password.value;
		if (un == "") {
			invalidInput(form.username,"请输入账号");
		}else{
			if (pw == "") {
				invalidInput(form.password,"请输入密码");
			}else{
				var oUn = hex_md5(un);
				var oPw = hex_md5(pw);
				var parameter = {userName:oUn,password:oPw};
				get("http://study.163.com/webDev/login.htm",parameter,function(data){
					if (data == 0) {
						showErr("账号或密码错误");
					}else if(data == 1){
						var mask = getElementsByClassName(document,"mask")[0];
						setCookie("loginSuc","true");
						mask.click();
						followBtn();
					}
				})
			}
		}
	}
}

//轮播图
function sldsShow(){
	var oSld = document.getElementById("m-sld");
	var oIs = oSld.getElementsByTagName("i");
	var oLis = oSld.getElementsByTagName("li");
	var crt = 0;
	function sldHide(){//删除样式
		delClass(oIs[crt],"z-crt");
		delClass(oLis[crt],"z-crt");
	}
	function sldShow(){//增加样式
		addClass(oIs[crt],"z-crt");
		addClass(oLis[crt],"z-crt");
	}
	function sldChange(){//自动轮播
		sldHide();
		crt++;
		if (crt >= oIs.length)
			crt = 0;
		sldShow();
	}
	var sldInterval = setInterval(sldChange,5000);//每5s切换
	for (var i = 0; i < oIs.length; i++){//点击轮播
		oIs[i].index = i;
		oIs[i].onclick = function(){
			sldHide();
			crt = this.index;
			sldShow();
		}
	}
	oSld.onmouseover = function(){//鼠标移入暂停轮播
		clearInterval(sldInterval);
	}
	oSld.onmouseout = function(){//鼠标移出恢复轮播
		sldInterval = setInterval(sldChange,5000);
	}
}

//课程列表
function courseTab(num){//tab选项卡事件注册
	var courseTab = document.getElementById("course-tab");
	var tabLi = courseTab.getElementsByTagName("li");
	var crt = 0;
	for (var i = 0; i < tabLi.length; i++) {
		tabLi[i].index = i;
		tabLi[i].onclick = function(){
			delClass(tabLi[crt],"z-sel");
			crt = this.index;
			addClass(tabLi[crt],"z-sel");
			var tabLiInner = tabLi[this.index].innerHTML;
			var tabNum = 10;
			switch(tabLiInner){
				case "产品设计":
					tabNum = 10;
					break;
				case "编程语言":
					tabNum = 20;
					break;
			}
			innerCourseList(1,num,tabNum);
		}
	}
}
function innerCourseList(pageNo,psize,type){//课程列表写入
	var parameter = {pageNo:pageNo,psize:psize,type:type};
	var courseList = document.getElementById("course-list");
	var coursePage = document.getElementById("course-page");
	get("http://study.163.com/webDev/couresByCategory.htm",parameter,function(data){
		var obj = JSON.parse(data);
		courseList.innerHTML = createCourseList(obj.list);
		coursePage.innerHTML = createCoursePage(obj.pagination);
		var pageNum = obj.pagination.pageIndex;
		coursePageEvent(pageNum,psize,type);
	});
}
function createCourseList(list){//课程列表生成
	var iList = "";
	for (var i = 0; i < list.length; i++) {
		var name = list[i].name,
			url = list[i].providerLink,
			imgUrl = list[i].bigPhotoUrl,
			provider = list[i].provider,
			learner = list[i].learnerCount,
			price = list[i].price,
			classify = list[i].categoryName,
			descrip = list[i].description;
		var popUp = '<div class="popup"><a href="' + url + '"' + ' alt="' + name + '"><div><img src="' + imgUrl + '"' + ' alt="' + name + '"><div><h3>' + name + '</h3><div><i></i><span>' + learner + '人在学</span></div><p>发布者：' + provider + '</p><p>分类：' + (classify != null ? classify : "未分类") + '</p></div></div><p>' + descrip + '</p></a></div>';
		iList += '<li><div><a href="' + url + '"' + ' alt="' + name + '"><img src="' + imgUrl + '"' + ' alt="' + name + '"><div class="ctt"><h3>' + name + '</h3><p>' + provider + '</p><div class="f-pr"><i></i><span>' + learner + '</span></div><p class="price">' + (price != 0 ? ('￥' + price) : "免费") + '</p></div></a></div>' + popUp + '</li>';
	}
	return iList;
}
function createCoursePage(page){//翻页器生成
	var iPage = "";
	var pageIndex = page.pageIndex;
	var pageCount = page.totlePageCount;
	iPage += '<li class="prev"><a></a></li>'
	for (var i = 0; i < pageCount; i++) {
		var pageNum = i+1;
		iPage += '<li' + (pageNum == pageIndex ? ' class="z-crt"' : '') + '><a>' + pageNum + '</a></li>';
	}
	iPage += '<li class="next"><a></a></li>'
	return iPage;
}
function coursePageEvent(pageNum,psize,type){//翻页器事件注册
	var coursePage = document.getElementById("course-page");
	var pageList = coursePage.getElementsByTagName("li");
	var pageLen = pageList.length;
	for (var i = 0; i < pageLen; i++) {
		pageList[i].index = i;
		pageList[i].onclick = function(){
			switch(this.index){
				case 0:
					if (pageNum > 1){
						pageNum--;
					} else {
						return;
					}
					break;
				case (pageLen - 1):
					if (pageNum < pageLen - 2){
						pageNum++;
					} else {
						return;
					}
					break;
				default:
					pageNum = this.index;
					break;
			}
			innerCourseList(pageNum,psize,type);
		}
	}
}

//视频弹窗
function videoPop(){
	var videoBtn = document.getElementById("video-btn");
	videoBtn.onclick = function(){
		var popup = document.createElement("div");
		addClass(popup,"m-video");
		popup.innerHTML = '<i class="f-csp"></i><h3>请观看下面的视频</h3><video src="http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4" controls="controls">您的浏览器不支持 video 标签。</video>'
		var close = popup.getElementsByTagName("i")[0];
		createPop(popup,close);
	}
}

//最热排行
function topList(){
	var first = 0;
	innerTopList(first);
	function topChange(){
		first ++;
		if (first >= 10)
			first = 0;
		innerTopList(first);
	}
	var topInterval = setInterval(topChange,5000);
}
function innerTopList(first){//排行写入
	var parameter = {};
	var topList = document.getElementById("top-list");
	get("http://study.163.com/webDev/hotcouresByCategory.htm",parameter,function(data){
		var obj = JSON.parse(data);
		var last = first + 10;
		topList.innerHTML = createTopList(obj,first,last);
	});
}
function createTopList(list,first,last){//排行列表生成
	var iList = "";
	for (var i = first; i < last; i++) {
		var name = list[i].name,
			url = list[i].providerLink,
			imgUrl = list[i].smallPhotoUrl,
			provider = list[i].provider,
			learner = list[i].learnerCount,
			price = list[i].price,
			classify = list[i].categoryName,
			descrip = list[i].description;
		iList += '<li><a href="' + url + '"' + ' alt="' + name + '"><img src="' + imgUrl + '"' + ' alt="' + name + '"><div><h3>' + name + '</h3><div><i></i><span>' + learner + '</span></div></div></a></li>';
	}
	return iList;
}
