function checkUrl(urlReg){
	//urlCheckTest = urlReg.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);
	urlCheckTest = urlReg.match(/^((http|https|ftp)?:\/\/)?([\a-zA-Z0-9\.-]+)\.([a-z\.]{2,6})(\/)?([\a-zA-Z0-9\/+=%&_\.~?\-]+)?$/)
	if(urlCheckTest==null){
		return false;
	}else{
		return true;
	}
}

$(function(){
	//loading screen
	$("#loading-screen").remove();


	var ifrNM = $("iframe").contents();
	ifr=document.getElementById("b_iframe");
	var url="";
	bHistory = [];
	sidebar = false;
	n_mode = false;
	f_mode = false;

	var browser = document.querySelector("iframe[mozbrowser]");

	browser.addEventListener("mozbrowserloadstart", function( event ) {
		$("#btn_rl").html("x")
		$("#loading").fadeIn();
	});
	browser.addEventListener("mozbrowserlocationchange", function( event ) {
		if($("#input input").val()!="" && $("#container iframe").attr("src")!="homepage.html"){
			$("#input input").val(event.detail);
			dtl={
				icon:"icon-128.png",
				title:ifr,
				urlCurrent:event.detail
			}
			bHCheck=false;
			for(j in bHistory){
				urlCh = bHistory[j].urlCurrent;
				if(urlCh == dtl.urlCurrent) bHCheck=true;
			}
			if(!bHCheck){bHistory.push(dtl)};
		}else{
			$("#input input").val("");
		}
	});
	browser.addEventListener("mozbrowserloadend", function( event ) {
		$("#btn_rl").html("&#8635;")
		$("#loading").fadeOut();
		if($("#input input").val().indexOf("app://")!=-1 || $("#container iframe").attr("src")=="homepage.html"){
			$("#input input").val("")
		}else{
			$("#input input").val(event.detail)	
		}
	});

	$("#btn_pre").click(function(){
		ifr.goBack();
	})
	$("#btn_nex").click(function(){
		ifr.goForward();
	})

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

	$("#btn_add_t").click(function(){
		sb_on();
	})

	$("#btn_rl").click(function(){
		if($("#btn_rl").text()=="x"){
			ifr.stop();
			$("#btn_rl").html("&#8635;")
		}else{
			ifr.reload();
			$("#btn_rl").text("x")
		}
	})

	$("#input .go").click(function(){
		url=$("#url").val();
		sub();
	});

	$("#input input").keydown(function(e){
		if(e.keyCode == 13){
			url=$("#url").val();
			sub();
		}
	});

	function sub(){
		if(url!==""){			
			if(checkUrl(url)){
				if(url.substr(0,7)!="http://" && url.substr(0,8)!="https://" && url.substr(0,6)!="ftp://") url = "http://"+url;
				$("#container iframe").attr("src",url);
			}else{
				$("#container iframe").attr("src","http://www.google.com/search?q="+url);
			}
			$("#container iframe").load();
		}
	}

	$("#s_sp").click(function(){
		sb_on();
		url="homepage.html";
		$("#container iframe").attr("src",url);
		$("#container iframe").load();
	})

	$("#s_hi").click(function(){
		sb_on();
		$("#hist .list").html("");
		ln=bHistory.length-1
		for(i in bHistory){
			//img = "<img src='"+bHistory[ln-i].icon+"'>"
			img="";
			$("#hist .list").append("<li src='"+bHistory[ln-i].urlCurrent+"'>"+bHistory[ln-i].urlCurrent+"</li>")
		}
		$("#hist").fadeIn();
		$("#hist .list li").click(function(){
			urlD=$(this).attr('src');
			$("#input input").val(urlD);
			$("#container iframe").attr("src",urlD);
			$("#container iframe").load();
			$("#hist").fadeOut();
		})
	})

	$("#hist #close").click(function(){
		$("#hist").fadeOut();
	})

	function n_md(){
		if(n_mode){
			n_mode = false;
			$("#s_nm span").html("OFF");
			$("#nmInject").remove();
			ifl = ifr.contentDocument.getElementsByTagName('head')[0].children[ifr.contentDocument.getElementsByTagName('head')[0].children.length-1].remove()
			//ifl.getElementById('ifrNMEl').remove();
		}else{
			n_mode = true;
			$("#s_nm span").html("ON");
			$("head").append("<link rel='stylesheet' href='system/style/browser_nm.css' id='nmInject'>");
			link=document.createElement("link");
			link.rel='stylesheet';
			link.href='system/style/startpage_nm.css';
			link.type='text/css';
			link.id='ifrNMEl'
			ifr.contentDocument.getElementsByTagName('head')[0].appendChild(link);
		}
	}

	$("#s_nm").click(function(){
		n_md();
	})

	function f_md(){
		if(f_mode){
			f_mode = false;
			$("#s_fm span").html("OFF");
		}else{
			f_mode = true;
			$("#s_fm span").html("ON");
		}
	}

	$("#s_fm").click(function(){
		sb_on();
		f_md();
	})
})