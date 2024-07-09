import React, { useCallback, useEffect, useRef, useState } from "react";
import "./gallery.scss";
import { useSpring, animated, easings, to } from "@react-spring/web";
import BezierEasing from "bezier-easing";
import { useDrag } from "@use-gesture/react";
import Button from "../../components/buttons";

import { BottomView, RightView } from "./spec";
import { publicImage } from "../../utils";

const sections = [
  {
    // title: "Title 1",
    image: publicImage("ford.webp"),
    name: { top: "Ford", bottom: "Mustang" },
    tyre: publicImage("ford-tyre.webp"),
    cord: { left: "12.7%", top: "clamp(0px, 39.5%, 190px)", right: "14.5%" },
  },
  {
    // title: "Title 2",
    image: publicImage("audi.webp"),
    name: { top: "Audi", bottom: "A3" },
    tyre: publicImage("audi-tyre.webp"),
    cord: { left: "13.9%", top: "clamp(0px, 42.2%, 203px)", right: "10.4%" },
  },

  {
    image: publicImage("bmw.webp"),
    name: { top: "BMW", bottom: "M5 CS" },
    tyre: publicImage("bmw-tyre.webp"),
    cord: {
      left: "4.2%",
      top: "calc(clamp(0px, 33%, 150px) + clamp(0px, 10%, 100px)",
      right: "11.7%",
      height: "clamp(20px, 11.4vw, 135px)",
    },
    parentStyle: {
      // paddingTop: "clamp(0px, calc(100px - 10vw), 50px)",
    },
    style: {
      transform: "scale(1.15) translateY(clamp(0px, 10%, 150px)",
    },
  },
  {
    image: publicImage("mercedes.webp"),
    name: { top: "Mercedes", bottom: "GT 63 S" },
    tyre: publicImage("mercedes-tyre.webp"),
    cord: {
      left: "-6.7%",
      top: "calc(clamp(0px, 45%, 155px) + clamp(-36px, calc( 51% - 200px), 40px ))",
      right: "6.5%",
      height: "clamp(20px, 12.3vw, 140px)",
    },
    parentStyle: {
      paddingTop: "clamp(0px, calc(100px - 10vw), 50px)",
    },
    style: {
      transform:
        "scale(1.32) translateY(clamp(-28px, calc( 51% - 200px), 300px ))",
    },
  },
  {
    image: publicImage("lexus.webp"),
    name: { top: "Lexus", bottom: "LC Series" },
    tyre: publicImage("lexus-tyre.webp"),
    cord: {
      left: "13%",
      top: "clamp(0px, 35%, 170px)",
      right: "13.3%",
      height: "clamp(20px, 14.8vw, 175px)",
    },
  },
];

export const colors = [
  "#78000D",
  "#4F616C",
  "#273323",
  "#5B5B5F",
  "#314559",
  "#283749",
];
const values = Array.from({ length: sections.length }, (_, index) => index);
// const customEasing = BezierEasing(1.0, -0.13, 0.675, 1.1);
const customEasing = BezierEasing(1.0, -0.135, 0.01, 1.065);
const initialView = (width) => ({
  x: 0,
  y: 0,
  arrowY: 0,
  opacity: 1,
  scale: width > 1820 ? 1.2 : 1,
  scaleCar: width > 1820 ? 1 : 1,
  scaleArrow: width > 1820 ? 1.6 : 1,
  config: { duration: 2000, easing: customEasing },
});

const shrinkView = (width) => ({
  x: 0,
  y: width < 1024 ? -40 : -100,
  arrowY: -90,
  opacity: 0,
  scale: width > 1820 ? 1.1 : width <= 1024 ? 1 : 0.9,
  scaleCar: width > 1820 ? 0.95 : width <= 1024 ? 0.9 : 0.8,
  scaleArrow: width > 1820 ? 1.7 : 1.3,
  config: { duration: 2000, easing: customEasing },
});

export default function Gallery({ detailsOpened }) {
  const contentRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const index = useRef(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [details, setDetails] = useState(false);
  const [{ x }, api] = useSpring(() => ({ x: 0, config: { duration: 1000 } }));
  const [draw, detailsApi] = useSpring(() => ({
    from: {
      x: 0,
      y: 0,
      arrowY: 0,
      opacity: 1,
      scale: windowWidth > 1820 ? 1.2 : 1,
      scaleCar: windowWidth > 1820 ? 1 : 1,
      scaleArrow: windowWidth > 1820 ? 1.6 : 1,
    },
  }));

  const animateToSection = useCallback(
    async (sectionIndex) => {
      const sectionWidth = window.innerWidth;
      const multi = sectionIndex * sectionWidth;
      const currentX = x.get();
      const direction = currentX > -multi ? 1 : -1;
      const targetX = -multi - direction * 0.01 * windowWidth;

      api.start({
        x:
          sectionIndex >= sections.length
            ? -((sections.length - 1) * sectionWidth)
            : targetX,
        config: { tension: 250, friction: 40 }, // Bounce effect
        onRest: () => {
          api.start({
            x:
              sectionIndex >= sections.length
                ? -((sections.length - 1) * sectionWidth)
                : -multi,
            config: { tension: 100, friction: 20 },
          });
        },
      });

      setCurrentSection(
        sectionIndex >= sections.length ? sections.length - 1 : sectionIndex
      );
    },
    [api, x, windowWidth]
  );

  const NavigateToSection = async (sectionIndex) => {
    const sectionWidth = window.innerWidth;
    const multi = sectionIndex * sectionWidth;
    const currentX = x.get();
    const direction = currentX > -multi ? 1 : -1;
    const targetX = -multi - direction * 0.01 * windowWidth;

    api.start({
      x: -multi,
      config: {
        duration: 2000,
        easing: (t) => customEasing(t),
      },
    });

    setCurrentSection(sectionIndex);
  };

  const bind = useDrag(
    ({ active, movement: [mx], memo = x.get(), cancel }) => {
      if (!details) {
        if (active) {
          // While dragging
          api.start({ x: memo + mx, immediate: true });
          if (Math.abs(mx) > window.innerWidth * 2) {
            cancel();
            const nextIndex = Math.round(Math.abs(memo + mx) / windowWidth);
            animateToSection(nextIndex);
          }
        } else {
          const nextIndex = Math.round(Math.abs(memo + mx) / windowWidth);
          animateToSection(nextIndex);
        }
        return memo;
      }
    },
    {
      axis: "x",
      filterTaps: true, // Ensure taps are not interpreted as drags
    }
  );

  const openDetails = () => {
    setDetails(true);
    // detailsApi.start(shrinkView(windowWidth));
  };

  const closeDetails = () => {
    setDetails(false);
    // detailsApi.start(shrinkView(windowWidth));
  };
  // Function to handle "Next" button click
  const handleNext = () => {
    const nextIndex = currentSection + 1;
    if (nextIndex < sections.length) {
      NavigateToSection(nextIndex);
    }
  };
  const handlePrev = () => {
    const nextIndex = currentSection - 1;
    if (nextIndex >= 0) {
      NavigateToSection(nextIndex);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (!details) {
        detailsApi.start(initialView(window.innerWidth));
      } else {
        detailsApi.start(shrinkView(window.innerWidth));
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentSection, details, detailsApi]);

  useEffect(() => {
    // setCurrentSection();
  }, [index]);

  useEffect(() => {
    detailsOpened(details);
  }, [details, detailsOpened]);

  useEffect(() => {
    animateToSection(currentSection);
    // closeDetails();
  }, [windowWidth, animateToSection]);

  console.log(currentSection);

  return (
    <>
      <div className="gallery">
        <div className="gallery-content" ref={contentRef}>
          {/* {sections.map((item, index) => (
        ))} */}
          <Button
            onClick={details ? closeDetails : handlePrev}
            title={"Prev"}
            left
            fade={!details && currentSection <= 0}
            style={{
              transform: to(
                [draw.x, draw.arrowY, draw.scaleArrow],
                (x, y, scale) =>
                  `translate3d(${x}px, clamp(-45vw, calc(${y * 1.7}px + ${
                    y * 0.12
                  }vw), 0px), 0) scale(${scale * 0.9})`
              ),
            }}
          />
          <Button
            onClick={handleNext}
            title={"Next"}
            fade={currentSection > sections.length - 2}
            style={{
              transform: to(
                [draw.x, draw.arrowY, draw.scaleArrow],
                (x, y, scale) =>
                  `translate3d(${-y * 0.2}vw, 0,0) scale(${scale})`
              ),
            }}
          />
          <animated.div
            className="gallery-draw"
            style={{
              transform: to(
                [draw.x, draw.y, draw.scale],
                (x, y, scale) =>
                  `translate3d(0, clamp(-32%, calc(${-y * 0.3}px + ${
                    y * 0.12
                  }vw), ${y * 2}px), 0) scale(${scale})`
              ),
            }}
          >
            <GalleryNames x={x} windowWidth={windowWidth} />
            <animated.div
              onClick={openDetails}
              {...bind()}
              id="overflow"
              style={{
                width: `${sections.length * windowWidth}px`,
                transform: x.to((x) => `translate3d(${x}px, 0, 0)`),
              }}
            >
              {sections.map((section, idx) => (
                <animated.div
                  style={{
                    scale: to([draw.scaleCar], (scale) => scale),
                  }}
                >
                  <GalleryImage
                    key={idx}
                    idx={idx}
                    item={section}
                    x={x}
                    windowWidth={windowWidth}
                  />
                </animated.div>
              ))}
            </animated.div>
          </animated.div>
        </div>
        <animated.div
          className={"gallery-nav"}
          style={{
            transform: to(
              [draw.x, draw.y, draw.scale, draw.scaleArrow],
              (x, y, scale, scaleArrow) =>
                `translate3d(${x}px, ${-1.8 * y}px, 0)`
            ),
            opacity: to([draw.opacity], (opacity) => opacity),
          }}
        >
          <GalleryActions
            x={x}
            windowWidth={windowWidth}
            openDetails={openDetails}
          />
          <GalleryIndicator x={x} windowWidth={windowWidth} />
        </animated.div>
      </div>
      <BottomView details={details} index={currentSection} />
      <RightView details={details} windowWidth={windowWidth} />
    </>
  );
}

const GalleryActions = ({ x, windowWidth, openDetails }) => {
  const size = values.map((num) => num * -windowWidth).sort((a, b) => a - b);

  const interpolatedColor = x.interpolate(size, colors);
  // const interpolatedIndicator = x.interpolate(size, colors);

  return (
    <div className="gallery-actions">
      <animated.button
        style={{
          backgroundColor: interpolatedColor,
          borderColor: interpolatedColor,
        }}
      >
        Rent now
      </animated.button>
      <animated.button
        style={{
          borderColor: interpolatedColor,
        }}
        onClick={openDetails}
      >
        Details
      </animated.button>
    </div>
  );
};

const GalleryIndicator = ({ x, windowWidth }) => {
  return (
    <div className="gallery-indicator">
      {sections.map((_, idx) => (
        <GalleryIndicatorDot
          key={idx}
          idx={idx}
          x={x}
          windowWidth={windowWidth}
        />
      ))}
    </div>
  );
};

const GalleryIndicatorDot = ({ idx, x, windowWidth }) => {
  const interpolatedColor = x.interpolate(
    [
      (idx - 1) * -windowWidth,
      (idx + 1) * -windowWidth,
      (idx + 2) * -windowWidth,
      (idx - 2) * -windowWidth,
      idx * -windowWidth,
    ].sort((a, b) => a - b),
    ["#00000050", "#00000050", "#545454", "#00000050", "#00000050"]
  );
  return (
    <animated.span
      style={{
        backgroundColor: interpolatedColor,
      }}
      className="gallery-indicator-dot"
    ></animated.span>
  );
};

const GalleryImage = ({ item, idx, x, windowWidth }) => {
  const interpolatedRotate = x.to({
    range: [(idx + 1) * -windowWidth, idx * -windowWidth],
    output: [-270, 0],
  });
  return (
    <animated.div
      key={idx}
      className="gallery-image"
      style={{ ...item.parentStyle }}
      // style={{
      // background: idx % 2 === 0 ? "lightblue" : "lightcoral",
      //   // transform: x.to((currentX) => {
      //   //   const distance = Math.abs(idx * window.innerWidth - currentX);
      //   //   const scale = 1 - Math.min(distance / window.innerWidth / 2, 0.5); // Scale down up to 50%
      //   //   return `scale(${scale})`;
      //   // }),
      // }}
    >
      <div>
        <img
          src={item.image}
          alt={item.title || "car image"}
          style={{ ...item.style }}
        />
        <animated.img
          src={item.tyre}
          alt={item.title || "car tyre"}
          className="tyre"
          style={{
            left: item.cord.left,
            top: item.cord.top,
            height: item.cord.height,
            transform: interpolatedRotate.to((value) => `rotate(${value}deg)`),
          }}
        />
        <animated.img
          src={item.tyre}
          alt={item.title || "car tyre"}
          className="tyre right"
          style={{
            right: item.cord.right,
            top: item.cord.top,
            height: item.cord.height,
            transform: interpolatedRotate.to(
              (value) => `rotate(${value + 80}deg)`
            ),
          }}
        />
      </div>
    </animated.div>
  );
};

const GalleryNames = ({ index, x, windowWidth }) => {
  const namesRef = useRef(null);
  const [childHeight, setChildHeight] = useState(0);

  useEffect(() => {
    if (namesRef.current) {
      setChildHeight(namesRef.current.clientHeight);
    }
  }, [namesRef]);

  useEffect(() => {
    const handleResize = () => {
      setChildHeight(namesRef.current.clientHeight);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const size = values.map((num) => num * -windowWidth).sort((a, b) => a - b);
  const translate = values
    .map((num) => num * -childHeight)
    .sort((a, b) => a - b);

  const interpolatedTranslate = x.to({
    range: size,
    output: translate,
  });
  return (
    <div className="gallery-names-container">
      <animated.div
        className="gallery-names"
        style={{
          transform: interpolatedTranslate.to(
            (value) => `translate3d(0,${value}px, 0)`
          ),
        }}
      >
        {sections.map((section, idx) => (
          <div className="name" ref={namesRef}>
            <div id="top">{section.name.top}</div>
            <div id="bottom">{section.name.bottom}</div>
          </div>
        ))}
      </animated.div>
    </div>
  );
};
