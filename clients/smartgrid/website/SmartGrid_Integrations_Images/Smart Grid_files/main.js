$('.navbar-theme').scrollupbar();

// $(window).load(function(){
//     $(".loading").delay(1500).fadeOut();
// });
// $('html, body').animate({
//     scrollTop: $("#elementID").offset().top
// }, 2000);
// $(window).scrollTop(0);
new WOW().init();
$("html, body").animate({ scrollTop: 0 }, "slow");
$('.mainSlider').owlCarousel({
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',
    loop: true,
    margin: 0,
    nav: false,
    dots: true,
    center: false,
    rtl: false,
    smartSpeed: 2000,
    navRewind: false,
    autoplay: true,
    autoplayTimeout: 10000,
    autoplayHoverPause: true,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 1
        },
        1000: {
            items: 1
        }
    }
});


$('.clients').owlCarousel({
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',
    loop: true,
    margin: 10,
    nav: false,
    dots: true,
    center: false,
    rtl: false,
    smartSpeed: 1000,
    navRewind: false,
    autoplay: true,
    autoplayTimeout: 1000,
    autoplayHoverPause: true,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 3
        },
        1000: {
            items: 5
        }
    }
});


$('.feedback1').owlCarousel({
    loop: true,
    margin: 0,
    nav: false,
    dots: true,
    center: false,
    rtl: false,
    smartSpeed: 1000,
    navRewind: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 1
        },
        1000: {
            items: 1
        }
    }
});

// instance of fuction while Window Scroll event




var jump=function(e)
{
   if (e){
       e.preventDefault();
       var target = $(this).attr("href");
   }else{
       var target = location.hash;
   }

   $('html,body').animate(
   {
       scrollTop: $(target).offset().top
   },2000,function()
   {
       location.hash = target;
   });

}

$('html, body').hide();

$(document).ready(function()
{
    $('.haslinks a[href^=#]').bind("click", jump);

    if (location.hash){
        setTimeout(function(){
            $('html, body').scrollTop(0).show();
            jump();
        }, 0);
    }else{
        $('html, body').show();
    }
});











function createTicker() {
    var tickerLIs = jQuery(".marquee ul").children();
    tickerItems = new Array();
    tickerLIs.each(function(el) {
        tickerItems.push(jQuery(this).html());
    });
    i = 0;
    rotateTicker();
}

function rotateTicker() {
    if (i == tickerItems.length) {
        i = 0;
    }
    tickerText = tickerItems[i];
    c = 0;
    typetext();
    setTimeout("rotateTicker()", 5000);
    i++;
}
var isInTag = false;

function typetext() {
    if (jQuery('.marquee ul').length > 0) {
        var thisChar = tickerText.substr(c, 1);
        if (thisChar == '<') {
            isInTag = true;
        }
        if (thisChar == '>') {
            isInTag = false;
        }
        jQuery('.marquee ul').html(tickerText.substr(0, c++));
        if (c < tickerText.length + 1)
            if (isInTag) {
                typetext();
            } else {
                setTimeout("typetext()", 28);
            } else {
            c = 1;
            tickerText = "";
        }
    }
}

jQuery(document).ready(function(){
    createTicker(); 
    });