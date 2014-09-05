function checkUrl(urlReg){
	var urlCheckTest = urlReg.match(/^((http|https|ftp)?:\/\/)?([\a-zA-Z0-9\.-]+)\.([a-z\.]{2,6})(\/)?([\a-zA-Z0-9\/+=%&_\.~?\-]+)?$/)
	if(urlCheckTest==null){
		return false;
	}else{
		return true;
	}
}

function loadWebSite(website,mode){
	error=false;
	if(mode === undefined) mode = 0;
	if(mode==0){
		if(website!==""){
			if(checkUrl(website)){
				if(website.substr(0,7)!="http://" && website.substr(0,8)!="https://" && website.substr(0,6)!="ftp://") website="http://"+website;
				browser.setAttribute("src", website);
			}else{
				browser.setAttribute("src", "http://www.google.com/search?q="+website);
			}
		}
	}else{
		browser.setAttribute("src", website);
	}
}

function init(){
	$("#loading-screen").delay(3000).fadeOut();
	sidebar = false;
	error=false;
}

function sb_on(){
	if(sidebar){
		sidebar = false;
		$("#main").animate({"left":"0"},500)
		$("#sidebar").animate({"left":"100%"},500)
	}else{
		sidebar = true;
		$("#main").animate({"left":"-70%"},500)
		$("#sidebar").animate({"left":"30%"},500)
	}
}

document.addEventListener("DOMContentLoaded", function () {

	init();

	url  = document.getElementById("url");
	go   = document.getElementById("go");
	stop = document.getElementById("stop");
	prev = document.getElementById("btn_pre");
	next = document.getElementById("btn_nex");
	sb  = document.getElementById("btn_add_t");
	browser = document.querySelector("iframe[mozbrowser]");

	//Browser Events
	browser.addEventListener("mozbrowserloadstart", function( event ) {
		stop.innerHTML="x"
		$("#loading").fadeIn();
	});

	browser.addEventListener("mozbrowserloadend", function( event ) {
		stop.innerHTML="&#8635;"
		$("#loading").fadeOut();
		if(url.value.substr(0,6)=="app://") url.value="";
		if(error) url.value=temp;
	});

	browser.addEventListener('mozbrowserlocationchange', function (event) {
		url.value = event.detail;
	});

	browser.addEventListener('mozbrowsererror', function (event) {
		temp=url.value;
		loadWebSite("error.html",1);
		error=true;
	});

	//Load Events
	go.addEventListener("touchend", function () {
		loadWebSite(url.value);
	});

	$("#navigation input").keydown(function(event){
		if(event.keyCode == 13) loadWebSite(url.value);
	})
	$("#navigation").submit(function(event){
		event.preventDefault();
	})

	//Stop Events
	stop.addEventListener("touchend", function () {
		if(stop.innerHTML=="x"){
			browser.stop();
		}else{
			browser.reload();
		}
	});

	//Navigation
	prev.addEventListener("touchend", function(){
		browser.goBack();
	})
	next.addEventListener("touchend", function(){
		browser.goForward();
	})

	//Sidebar
	sb.addEventListener("touchend", function(){
		sb_on();
	})
	$("#s_sp").click(function(){
		loadWebSite("homepage.html",1);
		sb_on();
	})
});