const isAnimationPreferred = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

let isAngry = false;
let isComputerOff = false;

(function runAnimations() {
  if (!isAnimationPreferred) {
    return;
  }

  /**
   * animation for screen
   */

  gsap.to(".terminal__key-prompt", {
    duration: 0.2,
    repeat: -1,
    yoyo: true,
    opacity: 0,
    repeatDelay: 0.5
  });

  const screenChatTimeline = gsap.timeline({
    onComplete: () => {
      const chatScrollTimeline = gsap.timeline({
        delay: 10,
        repeat: -1,
        repeatDelay: 8,
        yoyo: true
      });

      chatScrollTimeline.to(".chat__content", {
        y: 0,
        duration: 3
      });
    }
  });

  screenChatTimeline
    .from(".screen__chat", {
      x: 100,
      y: 120,
      scaleY: 0,
      scaleX: 0,
      duration: 1,
      delay: 2
    })
    .from(".chat__sidebar__paragraph", {
      opacity: 0
    })
    .from(".chat__content__paragraph-1", {
      scaleX: 0,
      opacity: 0
    })
    .to(".chat__content", {
      y: -100,
      duration: 3,
      delay: 1,
      ease: Power3.easeOut
    })
    .from(
      ".chat__content__paragraph-2",
      {
        scaleX: 0,
        opacity: 0
      },
      "-=1.5"
    );


  /**
   * animation for cat
   */
  gsap.to(".cat__tail-far", {
    duration: 2,
    attr: {
      d: "M297.28 257.185C297.28 257.185 295.703 257.079 313.203 260.579C330.703 264.079 312.5 265.5 300 277"
    },
    ease: Back.easeIn,
    repeat: -1,
    yoyo: true,
    delay: 0.5
  });

  const blink = gsap.timeline({ repeat: -1, repeatDelay: 4 });

  blink
    .set(".cat__eye-left, .cat__eye-right", {
      transformOrigin: "bottom"
    })
    .to(".cat__eye-left, .cat__eye-right", {
      scaleX: 1.2,
      scaleY: 0.1,
      duration: 0.1
    })
    .to(".cat__eye-left, .cat__eye-right", {
      scaleX: 1,
      scaleY: 1,
      duration: 0.1
    })


  /**
   * animation for computer click
   */
  const screenOffTimeline = gsap.timeline({
    onComplete: () => {
      screenChatTimeline.play();
      isComputerOff = false;
    }
  });

  const catAngryTimeline = gsap.timeline({ paused: true });

  const catPawToOnTimeline = gsap.timeline({
    paused: true,
    onComplete: () => {
      screenOffTimeline
        .to(".button__icon", {
          stroke: "white"
        })
        .to(
          ".screen",
          {
            scaleY: 1,
            scaleX: 1
          },
          "<"
        )

      catAngryTimeline.reverse();
    }
  });

  catAngryTimeline
    .to(
        ".cat__eye-left-happy, .cat__eye-right-happy",
        {
          visibility: "hidden",
          duration: 0.5,
        },
      )
    .to(
      ".cat__eye-left-angry, .cat__eye-right-angry",
      {
        visibility: "visible",
        duration: 0.5
      },
      "<"
    );

  catPawToOnTimeline
    .set(".screen", { transformOrigin: "center" })
    .to(".cat__paw-back", {
      delay: 1.5,
      x: -30,
      y: -18
    })
    .to(
      ".cat__paw-back",
      {
        x: 0,
        y: 0
      },
      ">"
    )
    .add(() => {
      catAngryTimeline.play();
    }, "-=1.5");

  document.querySelector(".computer__button").addEventListener("click", () => {
    if (isComputerOff) {
      return;
    }

    isComputerOff = true;

    screenChatTimeline.pause();
    catPawToOnTimeline.restart();

    screenOffTimeline
      .to(".screen", {
        duration: 0.15,
        scaleY: 0,
        scaleX: 1.05
      })
      .to(
        ".button__icon",
        {
          duration: 0.1,
          stroke: "#444444"
        },
        "<"
    )
  });
})()

