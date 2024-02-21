$(function() {

  'use strict';

  // link back
  $('.link-back').on('click', function() {
    window.history.back();
    return false;
  });

  // navbar on scroll
  $(window).on('scroll', function() {
    if ($(document).scrollTop() > 50) {
      $(".navbar-home").css({
        "box-shadow": "0 .125rem .25rem rgba(0,0,0,.075)"
      });
    } else {
      $(".navbar-home").css({
        "transition": ".3s ease-out",
        "box-shadow": "none"
      });
    }
  });

  // swiper slider
  $(document).ready(function () {
    var swiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      spaceBetween: 15,
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
      },
    });
  });

  // Plusieurs autres initialisations de swiper...

  // sidebar
  $('.menu-link').bigSlide({
    menu: '#menu',
    side: 'left',
    speed: 500,
    easyClose: true,
    menuWidth: '260px',
    afterOpen: function(){
      $('body').addClass('menu-open');
    },
    afterClose: function(){
      $('body').removeClass('menu-open');
    }
  });

  // accordion
  $('.accordion').collapse();

});
