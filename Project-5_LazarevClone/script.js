function locomotiveAnimation() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,

    // for tablet smooth
    tablet: { smooth: true },

    // for mobile
    smartphone: { smooth: true },
  });
  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  ScrollTrigger.refresh();
}

function loadingAnimation() {
  let tl = gsap.timeline();
  tl.from("#page1", {
    opacity: 0,
  });

  tl.from("#page1", {
    transform: "scaleX(0.7) scaleY(0.2)",
    duration: 0.4,
    ease: "expo.out",
  });

  tl.from("nav", {
    opacity: 0,
    delay: -0.2,
  });

  tl.from("#page1 h1, #page1 p, #page1 div", {
    opacity: 0,
    transform: "translateY(20px)",
    duration0: 0.5,
    stagger: 0.2,
  });
}

function navAnimation() {
  let nav = document.querySelector("nav");

  nav.addEventListener("mouseenter", function () {
    let tl = gsap.timeline();

    tl.to("#nav-bottom", {
      height: "21vh",
    });
    tl.to(".nav-part2 h5", {
      display: "block",
    });
    tl.to(".nav-part2 h5 span", {
      y: 0,
      stagger: {
        amount: 0.6,
      },
    });
  });

  nav.addEventListener("mouseleave", function () {
    let tl = gsap.timeline();

    tl.to(".nav-part2 h5 span", {
      y: 25,
      stagger: {
        amount: 0.2,
      },
    });
    tl.to(".nav-part2 h5", {
      display: "none",
      duration: 0.05,
    });
    tl.to("#nav-bottom", {
      height: 0,
      duration: 0.1,
    });
  });
}

function page2Animation() {
  let rightElems = document.querySelectorAll(".right-elem");

  rightElems.forEach(function (elem) {
    elem.addEventListener("mouseenter", function () {
      gsap.to(elem.childNodes[3], {
        opacity: 1,
        scale: 1,
      });
    });
    elem.addEventListener("mouseleave", function () {
      gsap.to(elem.childNodes[3], {
        opacity: 0,
        scale: 0,
      });
    });

    elem.addEventListener("mousemove", function (e) {
      gsap.to(elem.childNodes[3], {
        x: e.x - elem.getBoundingClientRect().x - 35,
        y: e.y - elem.getBoundingClientRect().y - 90,
      });
    });
  });
}

function page3VideoAnimation() {
  let page3Center = document.querySelector(".page3-center");
  let video = document.querySelector("#page3 video");

  page3Center.addEventListener("click", function () {
    video.play();
    gsap.to(video, {
      transform: "scaleX(1) scaleY(1)",
      opacity: 1,
      borderRadius: 0,
    });
  });

  video.addEventListener("click", function () {
    video.pause(),
      gsap.to(video, {
        transform: "scaleX(0.7) scaleY(0)",
        opacity: 0,
        borderRadius: "30px",
      });
  });
}

function page5VideoAnimation() {
  let sectionRight = document.querySelectorAll(".sec-right");

  sectionRight.forEach(function (elem) {
    elem.addEventListener("mouseenter", function () {
      elem.childNodes[3].style.opacity = 1;
      elem.childNodes[3].play();
    });

    elem.addEventListener("mouseleave", function () {
      elem.childNodes[3].style.opacity = 0;
      elem.childNodes[3].load();
    });
  });
}

function page7Animation() {
  gsap.from(".btm7-parts h4", {
    x: 0,
    duration: 1,
    scrollTrigger: {
      trigger: "#btm7-part2",
      scroller: "#main",
      start: "top 80%",
      end: "top -50",
      scrub: true,
    },
  });
}

locomotiveAnimation();

loadingAnimation();

// navAnimation();

page2Animation();

page3VideoAnimation();

page5VideoAnimation();

page7Animation();
