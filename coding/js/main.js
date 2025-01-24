$(function () {
  // swiper slide 구현 js
  let bannerSwiper = new Swiper(".banner-swiper", {
    sliderPerView: 1, // 이걸 사용해야 화면에 원활하게 구현
    loop: true,

    pagination: {
      el: ".banner-swiper-box .banner-swiper-pagination",
      clickable: true, //클릭 시 , 해당 슬라이드로 화면 이동
      type: "fraction",
    },
    navigation: {
      nextEl: ".banner-swiper-button-next",
      prevEl: ".banner-swiper-button-prev",
    },

    /*     autoplay: {
      delay: 5000,
    }, */
  });

  // 메인 배너 슬라이드 autoplay 제어
  document
    .querySelector("#mainBanner .toggle-slide-button")
    ?.addEventListener("click", function (e) {
      const isAutoPlaying = bannerSwiper.autoplay.running;
      if (isAutoPlaying) {
        bannerSwiper.autoplay.stop(); //자동 슬라이드 중지
        e.currentTarget.classList.remove("play");
      } else {
        bannerSwiper.autoplay.start(); //자동 슬라이드 시작
        e.currentTarget.classList.add("play");
      }
    });

  bannerSwiper.on("autoplayStart", () => {
    document
      .querySelector("#mainBanner .toggle-slide-button")
      .classList.add("play");
    document.querySelector("#mainBanner .toggle-slide-button").title =
      "자동재생 정지";
  });

  // 좌우버튼 클릭해서 focus가 이동시, autoplay 중지- 이로 인해 사용자가 버튼을 조작할 때 슬라이드가 자동으로 넘어가는 것을 방지
  const focusHandlerList = [
    document.querySelector("#mainBanner .banner-swiper-button-next"),
    document.querySelector("#mainBanner .banner-swiper-button-prev"),
  ];
  focusHandlerList.forEach((item) => {
    item.addEventListener("focus", () => {
      const isAutoPlaying = bannerSwiper.autoplay.running;
      if (isAutoPlaying) bannerSwiper.autoplay.stop();
    });
  });

  // 추천테마 제어하기 위한 전역변수
  const themeHandlerStatus = {
    hover: null,
    focus: null,
  };

  themeSectionInit();
  // 추천 테마 섹션 초기 세팅
  // hover시 img의 href 교체
  function themeSectionInit() {
    const mainThemeListItem = document.querySelectorAll(
      ".main-theme-list li a"
    );

    /*     // 모바일일 때는 제거
    if (userAgent.type === "mo") return; */

    //테마 리스트 아이템 이벤트 처리
    mainThemeListItem.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        themeHandlerStatus.hover = item;
        activeTheme(item);
      });

      item.addEventListener("mouseleave", () => {
        themeHandlerStatus.hover = null;
        inactiveTheme(item);
      });

      item.addEventListener("focus", () => {
        themeHandlerStatus.focus = item;
        activeTheme(item);
      });

      item.addEventListener("blur", () => {
        themeHandlerStatus.focus = null;
        inactiveTheme(item);
      });
    });

    function activeTheme(item) {
      const imgElement = item.querySelector("img");
      if (!imgElement) return;

      let imgSrc = imgElement.src; // img의 src
      const regex = /hover/; // reverse를 포함하고 있는 지 확인할 정규표현식
      const isHoverExist = regex.test(imgSrc); // 포함하고 있는지 테스트 값
      if (!isHoverExist) {
        // reverse가 없는 경우에만 변환
        const newSrc = imgSrc.replace(/(\.png)$/, "_hover$1"); //변환
        imgElement.src = newSrc;
      }
    }

    function inactiveTheme(item) {
      if (
        themeHandlerStatus.hover === item ||
        themeHandlerStatus.focus === item
      )
        return;

      const imgElement = item.querySelector("img");
      if (!imgElement) return;

      let imgSrc = imgElement.src;
      const regex = /_hover/;
      const isHoverExist = regex.test(imgSrc);

      if (isHoverExist) {
        // hover가 있는 경우에만 원래대로 변경
        const newSrc = imgSrc.replace(/_hover(\.png)$/, "$1");
        imgElement.src = newSrc;
      }
    }
  }

  // IBK 자산운용 슬라이드
  let representativeFundSwiper = new Swiper(".representative-fund-swiper", {
    slidesPerView: "auto", //페이지당 슬라이드 개수
    pagination: {
      el: ".swiper-custom-pagination-box .custom-swiper-pagination",
      clickable: true, //클릭 시 해당 슬라이드로 화면 이동
    },

    navigation: {
      nextEl: ".custom-button-next",
      prevEl: ".custom-button-prev",
    },

    autoplay: {
      delay: 5000,
    },
    loop: true,

    // 웹접근성 이미지 대체 텍스트 제공 및 선택 여부 title제공
    pagination: {
      el: ".custom-swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return `<span class = '${className}' ${
          index === 0 ? "title='선택됨'" : ""
        }><i class = hidden>슬라이드 ${index + 1}번으로 이동</i></span>`;
      },
    },

    on: {
      realIndexChange: (swiper) => {
        swiper.pagination.bullets.forEach((bullet) => {
          bullet.title = bullet.ariaCurrent === "true" ? "선택됨" : "";
        });
      },
    },
  });

  // 대표 펀드 autoplay 제어
  document
    .querySelector("#representativeFund .toggle-auto-button")
    .addEventListener("click", function (e) {
      const isAutoPlaying = representativeFundSwiper.autoplay.running;
      if (isAutoPlaying) {
        representativeFundSwiper.autoplay.stop(); // 자동슬라이드 중지
        e.currentTarget.classList.remove("play");
      } else {
        representativeFundSwiper.autoplay.start(); // 자동슬라이드 시작
        e.currentTarget.classList.add("play");
      }
    });

  representativeFundSwiper.on("autoplayStart", () => {
    document
      .querySelector("#representativeFund .toggle-auto-button")
      .classList.add("play");
    document.querySelector("#representativeFund .toggle-auto-button").title =
      "자동재생 정지";
  });
  representativeFundSwiper.on("autoplayStop", () => {
    document
      .querySelector("#representativeFund .toggle-auto-button")
      .classList.remove("play");
    document.querySelector("#representativeFund .toggle-auto-button").title =
      "자동재생 시작";
  });
});
