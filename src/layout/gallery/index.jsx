import React, { useEffect, useRef, useState } from "react";
import "./gallery.scss";
import { useSpring, animated, easings } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import Button from "../../components/buttons";

const sections = [
  {
    title: "Title 1",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Title 2",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Title 3",
    image: "https://via.placeholder.com/150",
  },
];
export default function Gallery() {
  const contentRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const index = useRef(0);
  const [{ x }, api] = useSpring(() => ({ x: 0, config: { duration: 1000 } }));

  const animateToSection = async (sectionIndex) => {
    const sectionWidth = window.innerWidth;
    const multi = sectionIndex * sectionWidth;
    const currentX = x.get();
    const direction = currentX > -multi ? 1 : -1;
    const targetX = -multi - direction * 10;

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
          config: { tension: 400, friction: 50 },
        });
      },
    });

    index.current =
      sectionIndex >= sections.length ? sections.length - 1 : sectionIndex;
  };

  const NavigateToSection = async (sectionIndex) => {
    const sectionWidth = window.innerWidth;
    const multi = sectionIndex * sectionWidth;
    const currentX = x.get();
    const direction = currentX > -multi ? 1 : -1;
    const targetX = -multi - direction * 10;

    api.start({
      x: currentX + direction * 10, // Example stretch distance based on direction
      config: { tension: 350, friction: 50 },
      onRest: () => {
        api.start({
          x: targetX,
          config: { tension: 250, friction: 40 },
          onRest: () => {
            api.start({
              x: -multi,
              config: { tension: 400, friction: 50 },
            });
          },
        });
      },
    });

    index.current = sectionIndex;
  };

  console.log(index.current);

  const bind = useDrag(({ active, movement: [mx], memo = x.get() }) => {
    if (active) {
      // While dragging
      api.start({ x: memo + mx, immediate: true });
    } else {
      // On release, snap to the nearest section
      const nextIndex = Math.round(Math.abs(memo + mx) / windowWidth);
      animateToSection(nextIndex);
    }
    return memo;
  });

  // Function to handle "Next" button click
  const handleNext = () => {
    const nextIndex = index.current + 1;
    if (nextIndex < sections.length) {
      NavigateToSection(nextIndex);
    }
  };
  const handlePrev = () => {
    const nextIndex = index.current - 1;
    if (nextIndex >= 0) {
      NavigateToSection(nextIndex);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      animateToSection(index.current);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="gallery">
      <div className="gallery-content" ref={contentRef}>
        {/* {sections.map((item, index) => (
        ))} */}
        <Button onClick={handlePrev} title={"Prev"} />
        <Button onClick={handleNext} title={"Next"} />
        <animated.div
          {...bind()}
          id="overflow"
          style={{
            width: `${sections.length * windowWidth}px`,
            transform: x.to((x) => `translate3d(${x}px, 0, 0)`),
          }}
        >
          {sections.map((section, idx) => (
            <GalleryImage key={idx} idx={idx} item={section} x={x} />
          ))}
        </animated.div>
      </div>
      <GalleryActions x={x} windowWidth={windowWidth} />
    </div>
  );
}

const GalleryActions = ({ x, windowWidth }) => {
  const values = Array.from({ length: sections.length }, (_, index) => index);
  const colors = ["#78000D", "#5B5B5F", "#314559"];
  const size = values.map((num) => num * -windowWidth).sort((a, b) => a - b);
  console.log(
    "values",
    values.map((num) => num * -windowWidth),
    colors
  );
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

const GalleryImage = ({ item, idx, x }) => {
  return (
    <animated.div
      key={idx}
      className="gallery-image"
      style={{
        background: idx % 2 === 0 ? "lightblue" : "lightcoral",
        // transform: x.to((currentX) => {
        //   const distance = Math.abs(idx * window.innerWidth - currentX);
        //   const scale = 1 - Math.min(distance / window.innerWidth / 2, 0.5); // Scale down up to 50%
        //   return `scale(${scale})`;
        // }),
      }}
    >
      {item.title}
      {/* <img src={item.image} alt={item.title} /> */}
    </animated.div>
  );
};

const GalleryNames = ({ data, index }) => {
  return (
    <div className="gallery-names">
      <h3>Gallery</h3>
    </div>
  );
};
