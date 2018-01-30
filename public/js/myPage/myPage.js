function myPageInfo() {
  $('.content').scroll(function(){
    var scrollHeight = $('.content').scrollTop();
    if(scrollHeight>0 && scrollHeight<=100){
      $('.topbarShowOrHide').css('opacity',0.3)
    }else if(scrollHeight>100){
      $('.topbarShowOrHide').css('opacity',1)
    }else{
      $('.topbarShowOrHide').css('opacity',0);
    }
  })
   //开启加载指示器
  $.showIndicator();
  $(document).on('refresh', '#content', function (e) {
    $.pullToRefreshDone('#content')
  });
}