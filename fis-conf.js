//fis.match('*.css', {
//    postpackager: fis.plugin('autoprefixer', {
//        // detail config (https://github.com/postcss/autoprefixer#browsers)
//        "browsers": ["Chrome>1%","Android >= 2.3", "ChromeAndroid > 1%", "iOS >= 4"],
//        "cascade": true
//    })
//});


fis.match('**.css', {
    postpackager : fis.plugin('autoprefixer', {
            //"browsers": ["Android >= 2.3", "ChromeAndroid > 1%", "iOS >= 4"],
            "browsers": ['last 2 versions'],
            "cascade": false
    })
});

//fis.config.merge({
//    settings : {
//        postprocessor : {
//            autoprefixer : {
//                // detail config (https://github.com/postcss/autoprefixer#browsers)
//                "browsers": ["Android >= 2.3", "ChromeAndroid > 1%", "iOS >= 4"],
//                "cascade": true
//            }
//        }
//    }
//});