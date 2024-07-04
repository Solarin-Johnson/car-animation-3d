import React, { useEffect, useRef, useState } from "react";
import "./gallery.scss";
import { useSpring, animated, easings } from "@react-spring/web";
import BezierEasing from "bezier-easing";
import { useDrag } from "@use-gesture/react";
import Button from "../../components/buttons";
import ford from "../../assets/ford.png";
import audi from "../../assets/audi.png";
import lexus from "../../assets/lexus.png";

import fordTyre from "../../assets/ford-tyre.png";
import audiTyre from "../../assets/audi-tyre.png";
import lexusTyre from "../../assets/lexus-tyre.png";

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
    // title: "Title 3",
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
    // title: "Title 3",
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
];
const values = Array.from({ length: sections.length }, (_, index) => index);
// const customEasing = BezierEasing(1.0, -0.13, 0.675, 1.1);
const customEasing = BezierEasing(1.0, -0.135, 0.01, 1.065);

export default function Gallery() {
  const contentRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const index = useRef(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [{ x }, api] = useSpring(() => ({ x: 0, config: { duration: 1000 } }));

  const animateToSection = async (sectionIndex) => {
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
  };

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
    },
    {
      axis: "x",
      filterTaps: true, // Ensure taps are not interpreted as drags
    }
  );

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
      animateToSection(currentSection);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // setCurrentSection();
  }, [index]);

  return (
    <div className="gallery">
      <div className="gallery-content" ref={contentRef}>
        {/* {sections.map((item, index) => (
        ))} */}
        <GalleryNames x={x} windowWidth={windowWidth} />
        <Button
          onClick={handlePrev}
          title={"Prev"}
          left
          fade={currentSection <= 0}
        />
        <Button
          onClick={handleNext}
          title={"Next"}
          fade={currentSection > sections.length - 2}
        />
        <animated.div
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
      </div>
      <GalleryActions x={x} windowWidth={windowWidth} />
    </div>
  );
}

const GalleryActions = ({ x, windowWidth }) => {
  const size = values.map((num) => num * -windowWidth).sort((a, b) => a - b);
  const colors = ["#78000D", "#5B5B5F", "#314559"];
  const interpolatedColor = x.interpolate(size, colors);

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
      >
        Details
      </animated.button>
    </div>
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
        <img src={item.image} alt={item.title} />
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

  console.log("translate", translate);

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
