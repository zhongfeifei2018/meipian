var selfImId = GetQueryString("imid");
var pageIndex = GetQueryString("page");
var pageMainMsg = GetQueryString("msgId");
// var selfImId = "lzy";
//当前点击头像的imid
var clickHeadImid;
//存放后退的相关参数
var jumpPageArr = [];
//判断是否停止加载
var isOverLoad = false;
//var postUrl = "http://20.95.15.171:8082/blogService/im";
var postUrl = "http://172.29.3.43:8082/blogService/im";
//拉取美篇的参数
var parmaData = {};
var currentPageNum = 1;
parmaData.backwords = true;
parmaData.lastBlogMsgid = 0;
parmaData.lastUpdateTime = "0";
parmaData.blogNum = 10;
parmaData.imId = selfImId;
//当前请求postURL
// var currentPostUrl = "/getBlog";
//触摸是否开始
var isStop = false;
//保存是在那个tab页跳转到其他页面，回到主页时恢复那个页面
var whichTab = 0;
//是否从主页调回来不刷新
var isResultPage = true;
//是否在需要滑动的开关，
var isNeedScroll = true;
//提示的开关
var messPromptFlag = 0;
var tabflag = 1;
//获取带过来的参数
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

function pageIndeLoad(data){
  if (!isResultPage) {
    return;
  }
  //再次回到主页的方法
  if (data != 0) {
    switch (whichTab) {
      case 1:
        tab1Click();
        break;
      case 2:
        tab2Click();
        break;
      case 3:
        tab3Click();
        break;
      case 4:
        tab4Click();
        break;
      case 5:
        tab5Click();
        break;
      case 6:
        tab6Click();
        break;
      default:
        break;
    }
    $.pullToRefreshTrigger($("#tab1Content"));
    return;
  }
  $("#cardContent").html("");
  //初始化方法
  tab1Click(openUpAndDown);
  $("body").on("touchstart", function () {
    if ($(".content").scrollTop() > 150 && !isStop) {
      isStop = true;
      $.destroyPullToRefresh('#tab1Content');
    }
    if ($(".content").scrollTop() < 150 && isStop) {
      isStop = false;
      $.initPullToRefresh('#tab1Content')
    }
  });
  //初始化轮播图
  slideHot();
}
//开启上拉刷新  下拉加载更多
function openUpAndDown() {
  topRefreshTab2();
  bottomloadMoreTab2();
}
//定义内容区
var currentTabBlock = $("#content_block_tab");
function clearTabs() {
  $("#tab1").html("");
  $("#tab4").html("");
  $("#tab5").html("");
  $("#tab6").html("");
}
//热点
function tab1Click(callBack) {
  if (!!callBack) {
    callBack();
  }
  clearTabs();
  whichTab = 1;
  isOpenBorside = 0;
  initParam();
  currentPostUrl = "/getOrgBlog";
  currentTabBlock.appendTo($("#tab1"));
  $.pullToRefreshTrigger($("#tab1Content"));
}

//关注
function tab2Click(callBack) {
  if (!!callBack) {
    callBack();
  }
  whichTab = 2;
  isOpenBorside = 0;
}

//身边
function tab3Click(callBack) {
  if (!!callBack) {
    callBack();
  }
  whichTab = 3;
  isOpenBorside = 0;
  // initParam();
  // currentPostUrl = "/getAttentionBlog";
  // currentTabBlock.appendTo($("#tab3"));
  // $.pullToRefreshTrigger($("#tab3Content"));
}

//摄影
function tab4Click(callBack) {
  if (!!callBack) {
    callBack();
  }
  clearTabs();
  whichTab = 4;
  isOpenBorside = 0;
  initParam();
  currentPostUrl = "/getOrgBlog";
  currentTabBlock.appendTo($("#tab4"));
  $.pullToRefreshTrigger($("#tab4Content"));
}

//美文
function tab5Click(callBack) {
  if (!!callBack) {
    callBack();
  }
  clearTabs();
  whichTab = 5;
  isOpenBorside = 0;
  initParam();
  currentPostUrl = "/getAttentionBlog";
  currentTabBlock.appendTo($("#tab5"));
  $.pullToRefreshTrigger($("#tab5Content"));
}
//旅行	
function tab6Click(callBack) {
  if (!!callBack) {
    callBack();
  }
  clearTabs();
  whichTab = 6;
  isOpenBorside = 0;
  currentPostUrl = "/getAttentionBlog";
  currentTabBlock.appendTo($("#tab6"));
  $.pullToRefreshTrigger($("#tab6Content"));
}
//初始化请求参数
function initParam() {
  parmaData = {}
  differentParam = false;
  parmaData.backwords = true;
  parmaData.lastBlogMsgid = 0;
  parmaData.lastUpdateTime = "0";
  parmaData.blogNum = 10;
  parmaData.imId = selfImId;
}
function getFirstAjax(callBack) {
  //开启加载指示器
  $.showIndicator();
  slideHot();
  $.ajax({
    url: postUrl + currentPostUrl,
    type: "POST",
    data: JSON.stringify(parmaData),
    contentType: "application/json;charset=utf-8",
    success: function (res) {
      $.hideIndicator();
      if (res.code == 200) {
        isOverLoad = true;
        $("#noMore").show();
        $("#loadMoreloding").hide();
        dataHandlerData(res.data);
        //获取最后的数据填充参数以便回调
        getLastData(res.data);
        //是否有回调
        if (!!callBack) {
          callBack();
        }
      }
    },
    error: function (msg) {
      $.toast("网络请求超时！！！")
    }
  });
}
//下拉刷新的ajax
function downResh(callBack) {
  //开启加载指示器
  $.showIndicator();
  slideHot();
  $.ajax({
    url: postUrl + currentPostUrl,
    type: "POST",
    data: JSON.stringify(parmaData),
    contentType: "application/json;charset=utf-8",
    success: function (res) {
      $.hideIndicator();
      if (res.code == 200) {
        //清空列表
        $("#cardContent").html("");
        dataHandlerData(res.data);
        //获取最后的数据填充参数以便回调
        getLastData(res.data);
        //是否有回调
        if (!!callBack) {
          callBack();
        }
      }
    },
    error: function (msg) {
      $.toast("网络错误");
    }
  });
}
//重新拼接好参数
function getLastData(datas) {
  if (datas.length == 0) {
    return;
  }
  var lastData = datas[datas.length - 1].blog;
  parmaData.lastBlogMsgid = lastData.blogMsgId;
  parmaData.lastUpdateTime = lastData.updateTime;
}
//数据处理
function dataHandlerData(data) {
  //判断是否有数据，无数据就显示没有更多
  if (data.length == 0) {
    isOverLoad = true;
    $("#noMore").show();
    $("#loadMoreloding").hide();
    return;
  }
  //当数据小于十个的时候不显示加载更多
  if (data.length < 10) {
    $("#loadMoreloding").hide();
    $("#noMore").show();
    $.detachInfiniteScroll($('#tab1Content'));
  }
  initUI(data);
}

function bottomloadMoreTab2() {
  // 添加'refresh'监听器
  $(document).on('refresh', '#tab1Content', function (e) {
    $(".content").scrollTop(0);
    parmaData.lastBlogMsgid = 0;
    parmaData.lastUpdateTime = "0";
    //需传入最后一条的时间和id
    // parmaData.lastId = data[data.length-1].id;
    // parmaData.lastUpdateTime = data[data.length-1].updateTime;
    parmaData.blogNum = 10;
    downResh(closeUpRefrsh);
    function closeUpRefrsh() {
      setTimeout(() => {
        isOverLoad = false;
        $.pullToRefreshDone('#tab1Content');
        $.attachInfiniteScroll($('#tab1Content'));
      }, 0);
    };
  });
}

function topRefreshTab2() {
  // 加载flag
  var loading = false;
  // 最多可加载的条目
  var maxItems = 100;
  // 注册'infinite'事件处理函数
  $(document).on('infinite', function () {
    if (!isNeedScroll)
      return;
    // 如果正在加载，则退出
    if (loading) return;
    // 设置flag
    loading = true;
    $('#noMore').hide();
    $('#loadMoreloding').show();
    // 模拟1s的加载过程
    getFirstAjax(stopLoad);

    function stopLoad() {
      // 重置加载flag
      loading = false;
      if (isOverLoad) {
        isOverLoad = false;
        return;
      }
      //容器发生改变,如果是js滚动，需要刷新滚动
      $.refreshScroller();
    };
  });
}
//模板渲染
function initUI(data) {
  var html = '';
  html += '<div class="swiper-container">' +
    '<div class="swiper-wrapper">' +
    '<div class="swiper-slide" >' +
    '<img src="./images/timg.jpg" alt="" style="width:100%; height:100px">' +
    '</div>' +
    '<div class="swiper-slide" >' +
    '<img src="./images/timg1.jpg" alt="" style="width:100%; height:100px">' +
    '</div>' +
    '<div class="swiper-slide" >' +
    '<img src="./images/timg2.jpg" alt="" style="width:100%; height:100px">' +
    '</div>' +
    '</div>' +
    '<div class="swiper-pagination"></div>' +
    '</div>'
  for (var i = 0; i < data.length; i++) {
    //模板渲染
    html += '<li class="ul_content_active_content">' +
      '<p><img src="./images/1.jpg"><span>云淡风轻</span></p>' +
      '<div class="active_title">出发,只为途中和你相遇....</div>' +
      '<div class="active_article"></div>' +
      '<div class="active_img">' +
      '<img src="./images/1.jpg">' +
      '</div>' +
      '<div class="good">' +
      '<div class="good_people">' +
      '<span class="clearfix good_people_span">' +
      '<img src="./images/timg.jpg">' +
      '<img src="./images/timg.jpg">' +
      '<img src="./images/timg.jpg">' +
      '<img src="./images/timg.jpg">' +
      '<em><img src="./images/btn_icon_44.png">137</em>' +
      '</span>' +
      '<div class="good_people_right">' +
      '<span><img src="./images/btn_icon_45.png">38</span>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</li>'
  }
  $('#cardContent').append(html);
}
//路由跳转
function myPage() {
  $.router.load('/myPage.html');
}
//滚动下拉显示回到顶部按钮
$('.content').scroll(function () {
  scrollHeight = $('.content').scrollTop();
  if (scrollHeight > 200) {
    $('.topBack').fadeIn();
  } else {
    $('.topBack').fadeOut();
  }
});
//点击按钮回到顶部
$('#topBack').click(function () {
  console.log(scrollHeight)
  $('body,html').animate({
    scrollTop: 0
  }, 500)
});
//点击跳转到详情
$('#cardContent').on('click', '.active_img', function () {
  console.log('1111');
  $.router.load('/details.html');
});
//热点页面轮播图
function slideHot() {
  setTimeout(function () {
    var mySwiper = new Swiper('.swiper-container', {
      autoplay: 2000,
      pagination: {
        el: '.swiper-pagination',
      },
      pagination: {
        el: '.swiper-pagination',
      },
      loop: true,
      observer: true,
      observerParents: true,
      autoplayDisableOnInteraction: false,
      pagination: '.swiper-pagination',
      clickable: true,
      clickableClass: 'my-pagination-clickable',
    });
  }, 500)
}