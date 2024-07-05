import React, { useCallback, useEffect, useRef, useState } from "react";
import "./gallery.scss";
import { useSpring, animated, easings, to } from "@react-spring/web";
import BezierEasing from "bezier-easing";
import { useDrag } from "@use-gesture/react";
import Button from "../../components/buttons";
import ford from "../../assets/ford.png";
import audi from "../../assets/audi.png";
import lexus from "../../assets/lexus.png";
import bmw from "../../assets/bmw.png";
import mercedes from "../../assets/mercedes.png";

import fordTyre from "../../assets/ford-tyre.png";
import audiTyre from "../../assets/audi-tyre.png";
import lexusTyre from "../../assets/lexus-tyre.png";
import bmwTyre from "../../assets/bmw-tyre.png";
import mercedesTyre from "../../assets/mercedes-tyre.png";

const sections = [
  {
    // title: "Title 1",
    image: ford,
    name: { top: "Ford", bottom: "Mustang" },
    tyre: fordTyre,
    cord: { left: "12.7%", top: "clamp(0px, 39.5%, 190px)", right: "14.5%" },
  },
  {
    // title: "Title 2",
    image: audi,
    name: { top: "Audi", bottom: "A3" },
    tyre: audiTyre,
    cord: { left: "13.9%", top: "clamp(0px, 42.2%, 203px)", right: "10.4%" },
  },
  {
    image: lexus,
    name: { top: "Lexus", bottom: "LC Series" },
    tyre: lexusTyre,
    cord: {
      left: "13%",
      top: "clamp(0px, 35%, 170px)",
      right: "13.3%",
      height: "clamp(20px, 14.8vw, 175px)",
    },
  },
  {
    image: bmw,
    name: { top: "BMW", bottom: "M5 CS" },
    tyre: bmwTyre,
    cord: {
      left: "4.2%",
      top: "calc(clamp(0px, 33.5%, 160px) + clamp(0px, 12%, 100px)",
      right: "11.7%",
      height: "clamp(20px, 11.4vw, 135px)",
    },
    style: {
      transform: "scale(1.15) translateY(clamp(0px, 15%, 150px)",
    },
  },
  {
    image: mercedes,
    name: { top: "Mercedes", bottom: "GT 63 S" },
    tyre: mercedesTyre,
    cord: {
      left: "-6.7%",
      top: "calc(clamp(0px, 45%, 155px) + clamp(-25px, calc( 51% - 200px), 40px ))",
      right: "6.5%",
      height: "clamp(20px, 12.3vw, 140px)",
    },
    style: {
      transform:
        "scale(1.32) translateY(clamp(-20px, calc( 51% - 200px), 300px ))",
    },
  },
];
const values = Array.from({ length: sections.length }, (_, index) => index);
// const customEasing = BezierEasing(1.0, -0.13, 0.675, 1.1);
const customEasing = BezierEasing(1.0, -0.135, 0.01, 1.065);

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
      scale: windowWidth > 1560 ? 1.2 : 1,
      scaleArrow: windowWidth > 1560 ? 1.6 : 1,
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
          if (Math.abs(mx) > window.innerWidth / 2) {
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
    detailsApi.start({
      x: 0,
      y: -100,
      scale: windowWidth > 1560 ? 1.1 : 0.9,
      scaleArrow: windowWidth > 1560 ? 1.7 : 1.3,
      config: { duration: 2000, easing: customEasing },
    });
  };

  const closeDetails = () => {
    setDetails(false);
    detailsApi.start({
      x: 0,
      y: 0,
      scale: windowWidth > 1560 ? 1.2 : 1,
      scaleArrow: windowWidth > 1560 ? 1.6 : 1,
      config: { duration: 2000, easing: customEasing },
    });
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
        detailsApi.start({
          scale: window.innerWidth > 1560 ? 1.1 : 0.9,
          scaleArrow: window.innerWidth > 1560 ? 1.6 : 1,
        });
      } else {
        detailsApi.start({
          scale: window.innerWidth > 1560 ? 1.2 : 1,
          scaleArrow: window.innerWidth > 1560 ? 1.7 : 1.3,
        });
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentSection]);

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
              [draw.x, draw.y, draw.scaleArrow],
              (x, y, scale) =>
                `translate3d(${x}px, clamp(-50vw, calc(${y * 1.7}px + ${
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
              [draw.x, draw.y, draw.scaleArrow],
              (x, y, scale) => `translate3d(${-y * 0.2}vw, 0,0) scale(${scale})`
            ),
          }}
        />
        <animated.div
          className="gallery-draw"
          style={{
            transform: to(
              [draw.x, draw.y, draw.scale],
              (x, y, scale) =>
                `translate3d(0, clamp(-10vw, calc(${-y * 0.3}px + ${
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
              <GalleryImage
                key={idx}
                idx={idx}
                item={section}
                x={x}
                windowWidth={windowWidth}
              />
            ))}
          </animated.div>
        </animated.div>
      </div>
      <animated.div
        className={"gallery-nav"}
        style={{
          transform: to(
            [draw.x, draw.y, draw.scale, draw.scaleArrow],
            (x, y, scale, scaleArrow) => `translate3d(${x}px, ${-1.8 * y}px, 0)`
          ),
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
  );
}

const GalleryActions = ({ x, windowWidth, openDetails }) => {
  const size = values.map((num) => num * -windowWidth).sort((a, b) => a - b);
  const colors = [
    "#755138",
    "#273323",
    "#78000D",
    "#5B5B5F",
    "#314559",
    "#283749",
  ];
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
        <img src={item.image} alt={item.title} style={{ ...item.style }} />
        <animated.img
          src={item.tyre}
          alt={item.title}
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
          alt={item.title}
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
