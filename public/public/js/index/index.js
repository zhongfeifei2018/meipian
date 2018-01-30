
var url = 'http://172.29.3.43:8082/blogService/im'
 
var paramAjax = {};
var loading=false; 

function getIndex() {
    paramAjax.backwords = true;
	paramAjax.lastBlogMsgid = 0;
	paramAjax.lastUpdateTime = 0;
	paramAjax.imId = 'txz';
	paramAjax.blogNum = 10;   
    $.pullToRefreshTrigger(".content");
    render(paramAjax);
	initDownResh();
	initLoadMore();
	$.pullToRefreshTrigger(".cardContent");
}
function initDownResh(){
  
    $(document).on("refresh", ".content", function(e) {
        // 模拟1s的加载过程
        function callBackFunc(){
            $.pullToRefreshDone(".content");
            $.attachInfiniteScroll($('.content'));
            console.log("启动刷新！！！");
        }
        paramaAjaxD.lastId = 0;
        paramaAjaxD.lastUpdateTime = 0;
        render(callBackFunc);
    });
}

function initLoadMore(){
	$(document).on('infinite', '.infinite-scroll-bottom',function() {	
        // 如果正在加载，则退出 
        if (loading) return;  
        // 设置flag  
        loading = true;  
       setTimeout(function(){
       	  loading = false;
       	  render(paramAjax);
       	  $.refreshScroller();  
       },1000)   
    }); 
 } 

function render(paramAjax) {
  $.ajax({
    url: url+"/getBlog",
    type: "post",
    dataType: "json",
    data: JSON.stringify(paramAjax),
    contentType: "application/json;charset=utf-8",
    success: function(res) {
    	  console.log(res.data.length)
	      $.hideIndicator();
	      if (res.code == 200 && res.data.length != 0) {
	        paramAjax.lastBlogMsgid = res.data[res.data.length-1].blog.msgId;
	        paramAjax.lastUpdateTime = res.data[res.data.length-1].blog.updateTime;
	        dataHandler(res.data);
	      } else {
	        $("#bottomText").html("暂时没有消息");
	      }
          
       }
  });
 
}
//处理数据到UI
function dataHandler(data){
	var html = '';
    for (var i = 0; i < data.length; i++) {
        //模板渲染
        html += '<li class="ul_content_active_content">'+
	                  '<p><img src="./images/2.jpg"><span>云淡风轻</span></p>'+
	                  '<div class="active_title">'+data[i].blog.msgId+'</div>'+
	                  '<div class="active_article"></div>'+
	                  '<div class="active_img">'+
	                      '<img src="./images/2.jpg">'+
	                  '</div>'+
	                  '<div class="good">'+
	                      '<div class="good_people">'+
	                         '<span class="clearfix good_people_span">'+
		                         '<img src="./images/2.jpg">'+
		                         '<img src="./images/2.jpg">'+
		                         '<img src="./images/2.jpg">'+
		                         '<img src="./images/2.jpg">'+
		                         '<em><img src="./images/btn_icon_44.png">137</em>'+
	                          '</span>'+
	                          '<div class="good_people_right">'+
	                               '<span><img src="./images/btn_icon_45.png">38</span>'+
	                          '</div>'+
	                      '</div>'+
	                  '</div>'+
	               '</li>'              
    }
    $('.infinite-scroll-bottom .movieDetailUl').append(html);
}

