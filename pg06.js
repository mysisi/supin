
/**
 * Defination
 * Author: Sisiliu
 * Date: 2015/9/23.
 */

//页面
(function(){

    $(function(){

        var setRem=function () {
            var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
                fontSize = 40;
            if((clientHeight/clientWidth)<(3/2)){
                var nowRem = clientHeight*fontSize / 960;
            }else{
                var nowRem = clientWidth*fontSize / 640;

            }
            $("html").css("font-size", nowRem + "px");
        };
        onresize = setRem;
        setRem();

        //TODO loading
        var pw=new pageSwitch('pages',{
            duration:1,                  //int 页面过渡时间
            direction:1,                    //int 页面切换方向，0横向，1纵向
            start:0,                        //int 默认显示页面
            loop:false,                      //bool 是否循环切换
            //ease:/flip(?!Paper)/.test(ts)?'bounce':'ease',
            ease:'ease',                    //string|function 过渡曲线动画，详见下方说明
            transition:'fade',             //string|function转场方式，详见下方说明
            mouse:true,                     //bool 是否启用鼠标
            mousewheel:true,                //bool 是否启用鼠标滚轮切换
            arrowkey:true                   //bool 是否启用键盘
        });

        $("#pages").show();
        pw.freeze(true);
        //loading
        document.onreadystatechange = dosome;//当页面加载状态改变的时候执行这个方法.
        function dosome() {
            if(document.readyState == "complete"){ //当页面加载状态完成
                setTimeout(function(){
                    pw.next();
                    pw.remove(0);
                    pw.freeze(false);
                },1);
            }
        }

        //TODO 滚屏
        pw.on("after",function(next,prev){
            if(next==2){
                setTimeout(function(){
                    pw.next();
                },5000);
            }
        });

        bindEvent();

    });

    function bindEvent(){
        //选中介
        $(".btn-xzj").on("click",function(){

        });
        //选速聘
        $(".btn-xsp").on("click",function(){

        });

    }

})();

//微信分享
//(function() {
//    wx.config({
//        debug: false,
//        appId: "",
//        timestamp: new Date().getTime(),
//        nonceStr: "",
//        signature: "",
//        jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone"]
//    });
//
//    wx.ready(function() {
//        var wxconfig={
//            title: "想骗钱，没门",
//            desc: "可恶的黑中介，竟然••••••",
//            link: location.href,
//            imgUrl: "http://c.58cdn.com.cn/crop/zt/sp/pugong/img/share_icon.jpg",
//            success: function(){
//            },
//            cancel: function() {
//            }
//        };
//        wx.onMenuShareTimeline(wxconfig);
//        wx.onMenuShareAppMessage(wxconfig);
//        wx.onMenuShareQQ(wxconfig);
//        wx.onMenuShareWeibo(wxconfig);
//        wx.onMenuShareQZone(wxconfig);
//    })
//})()
