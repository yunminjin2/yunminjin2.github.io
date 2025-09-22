window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

// Carousel functionality
var currentSlide = 0;
var totalSlides = 0;

// function initCarousel() {
//   var items = document.querySelectorAll('#results-carousel .item');
//   totalSlides = items.length;
//   showSlide(0);
// }

// function showSlide(n) {
//   var items = document.querySelectorAll('#results-carousel .item');
  
//   // Remove active class from all items
//   items.forEach(item => item.classList.remove('active'));
  
//   // Calculate the correct slide index
//   if (n >= totalSlides) currentSlide = 0;
//   if (n < 0) currentSlide = totalSlides - 1;
//   else currentSlide = n;
  
//   // Add active class to current slide
//   if (items[currentSlide]) {
//     items[currentSlide].classList.add('active');
//   }
// }

function changeSlide(direction) {
  showSlide(currentSlide + direction);
}

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Initialize custom carousel
    // initCarousel();
    
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
    function bindModelViewerToCarousel(carouselSelector) {
      const el = document.querySelector(carouselSelector);
      if (!el) return;
  
      // 이미 attach되어 있으면 인스턴스가 element.bulmaCarousel에 있어요.
      const instance = el.bulmaCarousel || bulmaCarousel.attach(el, options)[0];
      const mvs = Array.from(el.querySelectorAll('model-viewer'));
      if (!mvs.length) return;
  
      function activate(index) {
        mvs.forEach((mv, i) => {
          // 보이는 슬라이드만 자동회전
          mv.autoRotate = (i === index);
  
          if (i === index) {
            // 렌더 시작
            if (mv.dismissPoster) mv.dismissPoster();
          } else {
            // 렌더/애니메이션 정지
            if (mv.showPoster) mv.showPoster();
          }
        });
      }
  
      // 초기 적용 (bulmaCarousel가 current 인덱스를 갖고 있을 수 있음)
      setTimeout(() => {
        const current = instance.state ? instance.state.current : 0;
        activate(current || 0);
      }, 0);
  
      // 슬라이드 변경 이벤트에 반응 (버전에 따라 after:show/after:slide 둘 다 걸어둡니다)
      instance.on('after:show', (state) => activate(state.current));
      instance.on('after:slide', (state) => activate(state.current));
    }
  
    // 너의 3D 슬라이더 아이디로 바인딩
    bindModelViewerToCarousel('#results-carousel');
    
    // Model viewer pointer events control
    function swallowPointerEvents(el) {
      const stop = (e) => {
        // 모바일에서 스크롤/스와이프 방지 (passive:false 필수)
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
      };
      // 데스크톱/모바일 모두 커버
      ['pointerdown','pointermove','pointerup','pointercancel',
       'touchstart','touchmove','touchend','touchcancel',
       'mousedown','mousemove','mouseup','wheel','dragstart','contextmenu']
       .forEach(type => el.addEventListener(type, stop, { passive: false }));
    }

    // Apply pointer events control to all model-viewer elements
    document.querySelectorAll('#results-carousel model-viewer')
      .forEach(swallowPointerEvents);
    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

})

