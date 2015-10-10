//fis.match('**.css', {
//    postpackager : fis.plugin('autoprefixer', {
//            //"browsers": ["Android >= 2.3", "ChromeAndroid > 1%", "iOS >= 4"],
//            "browsers": ['last 2 versions'],
//            "cascade": false
//    })
//});

//压缩
fis.match("**.js",{
    optimizer: fis.plugin('uglify-js', {
        mangle:false
    })
});
fis.match('**.css', {
    optimizer: fis.plugin('clean-css', {
    })
});

fis.match("**.css",{
    domain: 'http://c.58cdn.com.cn',
    url:"/crop/zt/supin/koubei$0"
});
fis.match("**.js",{
    domain: 'http://j1.58cdn.com.cn',
    url:"/crop/zt/supin/koubei$0"
});

fis.match("*.{png,gif,jpg}",{
    domain: 'http://c.58cdn.com.cn',
    url:"/crop/zt/supin/koubei$0"
});

