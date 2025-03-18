$(function () {
  // 브라우저 창(뷰포트)의 너비와 높이룰 가져오는 코드
  // 스크롤바 제외한 순수한 화면 크기
  // document.documentElement - HTML 문서의 <html></html>요소를 가리킨다.
  let clientWidth = document.documentElement.clientWidth;
  let clientHeight = document.documentElement.clientHeight;

  //현재 브라우저 크기(너비, 높이)를 가져와서 CSS 변수에 저장
  //초기 clientWidth root(--clientWidth)에 할당
  setClientWidthHeight(clientWidth, clientHeight);

  // 브라우저 크기가 변할 때마다 (resize 이벤트 발생)
  // 다시 clientWidth , clientHeight 값을 가져와 업데이트
  // 변경된 값을 setClientWidthHeight() 함수에 전달하여 반영
  window.addEventListener("resize", function (e) {
    clientWidth = document.documentElement.clientWidth;
    clientHeight = document.documentElement.clientHeight;

    setClientWidthHeight(clientWidth, clientHeight);

    //모바일 메뉴가 열린 상태에서 브라우저 크기 변경 시, 메뉴 닫기 버튼 클릭
    if (document.querySelector("#header").classList.contains("opened")) {
      // .btn-mo-menu.close 버튼을 강제 클릭.
      document.querySelector(".btn-mo-menu.close").click();
    }
  });

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

  /*   focusHandlerList.forEach((item) => {
    item.addEventListener("focus", () => {
      const isAutoPlaying = bannerSwiper.autoplay.running;
      if (isAutoPlaying) bannerSwiper.autoplay.stop();
    });
  }); */

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

  //펀드 TOP% 클릭 이벤트 함수
  onClickTop5PeriodButton();

  // 이것을 사용할 수 없는 이유는 데이터 함수를 불러오는 곳이 따로 있기 때문에 이 함수는 실행 불가능
  // 펀드 TOP 5 기간 선택
  /*   function onClickTop5PeriodButton() {
    Array.from(document.querySelectorAll(".btn-date>li>button")).forEach(
      (element) => {
        element.addEventListener("click", (e) => {
          vinns.isActiveListButton(".btn-rate-of-return-date-wrapper");
          inquiryTopFund(e.target.dataset.month);
        });
      }
    );
  } */

  // 그래셔 데이터를 불러오는 곳 없이 기능 동작을 코드로 구현(수정된 코드)
  /*   function onClickTop5PeriodButton() {
    // 이렇게 사용 시 button에 class가 들어간다
    const monthButtons = document.querySelectorAll(".btn-date>li>button"); // 기능을 구현할 요소를 찾는다.
    console.log(monthButtons);

    monthButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        monthButtons.forEach((btn) => btn.classList.remove("active"));

        e.target.classList.add("active");
      });
    });
  } */

  //다시 한번 수정된 코드
  function onClickTop5PeriodButton() {
    const buttons = document.querySelectorAll(".btn-date>li");
    console.log(buttons);

    buttons.forEach((button) => {
      const item = button.querySelector("button");
      console.log(item);

      item.addEventListener("click", (e) => {
        // 모든 li에서 'active' 클래스 삭제
        buttons.forEach((li) => li.classList.remove("active"));

        // 클릭한 li에 'active' 클래스 추가
        button.classList.add("active");
      });
    });
  }

  // TOP5 슬라이드

  let top55Swiper = new Swiper(".swiper-top5", {
    slidesPerView: "auto",
    navigation: {
      nextEl: ".fund-button-wrap .next-button",
      prevEl: ".fund-button-wrap .prev-button",
    },
  });

  // 드롭다운 메뉴 열림/닫힘 제어 (active , hidden)
  function onClickSelectButton(target) {
    target.addEventListener("click", (e) => {
      const customSelect = e.target.nextElementSibling;
      const customSelectList = customSelect.querySelector("ul");

      if (customSelect.classList.contains("active")) {
        customSelectList.classList.add("hidden");
        customSelect.classList.remove("active");
      } else {
        customSelectList.classList.remove("hidden");
        customSelect.classList.add("active");
      }
    });
  }

  onClickFooterUtilMenu();

  function onBlurSelectButton(target) {
    const customSelect = target.nextElementSibling;
    const customSelectAnchorElement = customSelect.querySelectorAll("a");
    const checkElements = [target, ...customSelectAnchorElement];

    checkElements.forEach((item) => {
      item.addEventListener("blur", () => {
        setTimeout(() => {
          const isIn = Array.from(customSelectAnchorElement).some(
            (checkItem) => checkItem === document.activeElement
          );
          if (!isIn) {
            customSelect.classList.remove("active");
            customSelect.querySelector("ul").classList.add("hidden");
          }
        }, 100);
      });
    });
  }

  //이 코드가 없으면 클릭 이벤트가 적용되지 않음. ->  이벤트는 직접 버튼에 등록해야 동작

  function onClickFooterUtilMenu() {
    const footerSelectButton = Array.from(
      document.querySelectorAll(".footer-util button")
    );

    footerSelectButton.forEach((selectButton) => {
      // footer util select button click 이벤트 함수 호출
      onClickSelectButton(selectButton);

      // footer util select button blur 이벤트 함수 호출
      onBlurSelectButton(selectButton);
    });
  }

  /* 모바일 메뉴 활성화를 위한 JS  */
  function onClickButtonMobileMenu() {
    const header = document.querySelector("#header");
    const mobileMenu = document.querySelectorAll("#mo-gnb > .mo-menu > li > a");

    console.log(header, mobileMenu);
    //header 내부의 햄버거, 닫기 버튼에 클릭 이벤트 적용
    /* 유사 배열을 실제 배열 (Array)로 변환 */
    Array.from(header.querySelectorAll(".btn-mo-menu")).forEach((button) => {
      // 버튼에 forEach를 사용하여 각각의 이벤트 추가(click)
      button.addEventListener("click", () => {
        //열려있는 모든 submenu 닫기 상태로 초기화
        // mobileMenu 배열을 순회하면서
        Array.from(mobileMenu).forEach((element) => {
          // 각 a태그의 부모 li를 가지고 온다.
          const li = element.parentElement;
          // 만약 li에 active클래스가 포함되어 있다면
          if (li.classList.contains("active")) {
            // li에 active클래스를 지워라
            li.classList.remove("active");
          }
        });

        //header에 opened class 존재 유무로 show/hide
        if (header.classList.contains("opened")) {
          document.documentElement.style.overflow = "auto";
          header.classList.remove("opened");
        } else {
          document.documentElement.style.overflow = "hidden";
          header.classList.add("opened");
        }
      });
    });
  }

  onClickButtonMobileMenu();
  removeMobileSubmenuActive();

  // 이 함수의 역할은 서브메뉴를 클릭하면 펼쳐지거나 닫히도록(.active 클래스 토글)동작
  function removeMobileSubmenuActive() {
    const mobileMenu = document.querySelectorAll("#mo-gnb > .mo-menu > li > a");
    Array.from(mobileMenu).forEach((element) => {
      element.addEventListener("click", (e) => {
        e.preventDefault(); // 기본 링크 이동을 방지
        if (clientWidth <= 1024) {
          const list = e.target.parentElement;
          list.classList.toggle("active");
        }
      });
    });
  }

  /* 스크롤바를 제외한 뷰포트의 너비를 root에 할당하는 함수 */
  function setClientWidthHeight(clientWidth, clientHeight) {
    document.documentElement.style.setProperty(
      "--clientWidth",
      clientWidth + "px"
    );
    document.documentElement.style.setProperty(
      "--clientHeight",
      clientHeight + "px"
    );
  }
});
