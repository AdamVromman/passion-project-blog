import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import * as d3 from "d3";
import { s } from "motion/react-client";

const DemoPattern = () => {
  const ref = useRef<HTMLDivElement>(null);
  const movingSvgRef = useRef<SVGSVGElement>(null);
  const pinnedSvgRef = useRef<SVGSVGElement>(null);

  const width = 2000;

  const getWidth = () => {
    if (ref && ref.current) {
      return ref.current.clientWidth;
    }
    const wrapper = document.querySelector("#demo-pattern");
    if (wrapper) {
      return wrapper.clientWidth;
    }
    if (window) {
      return window.innerWidth;
    }
    return 0;
  };

  const { contextSafe } = useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const data = new Array(600).fill(0);

      const squares = d3
        .select(movingSvgRef.current)
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", 10)
        .attr("height", 2)
        .attr(
          "x",
          (_, i) =>
            (width / (data.length / 2)) * Math.floor(i / 2) +
            (width / (data.length / 2)) * (i % 2)
        )
        .attr("y", (_, i) => 50 + (i % 4 <= 1 ? 0 : 26))
        .attr("fill", "black");

      const tl = gsap.timeline({
        scrollTrigger: {
          scroller: ref.current,
          trigger: movingSvgRef.current,
          start: "left left",
          end: "right right",
          horizontal: true,
          markers: true,
          scrub: 1,
        },
      });

      // tl.to(
      //   ".rect-1",
      //   {
      //     width: getWidth(),
      //     duration: 200 / 2,
      //   },
      //   "0"
      // );

      squares.each((d, i, nodes) => {
        const node = nodes[i];

        tl.fromTo(
          node,
          {
            transformOrigin: "center center",
            rotate: i % 2 === 0 ? 135 : -135,
            x: 20,
            y: i % 2 === 0 ? -40 : 40,
            opacity: 0,
            scale: 4,
          },
          {
            scale: 1,
            x: 0,
            rotate: 0,
            y: 0,
            opacity: 1,
            duration: 1,
          },
          i % 2 === 0 ? "<" : ">"
        );
      });

      console.log(getWidth());
    },
    { scope: ref, dependencies: [] }
  );

  return (
    <div
      id="demo-pattern"
      ref={ref}
      className="relative w-full h-96 border border-black rounded-lg overflow-y-hidden overflow-x-auto"
    >
      {/* <svg
        ref={pinnedSvgRef}
        width={getWidth()}
        className="hidden h-96 sticky top-0 left-0"
      >
        <rect className="rect-1" width={0} height={4} y={0} fill="black" />
        <rect className="rect-1" width={0} height={20} y={10} fill="black" />
        <rect className="rect-1" width={0} height={4} y={36} fill="black" />
      </svg> */}
      <svg
        ref={movingSvgRef}
        width={width}
        className="absolute top-0 left-0 h-96"
      >
        <rect
          className="rect-1"
          width={0}
          height={2}
          x={0}
          y={0}
          fill="black"
        />
        <rect
          className="rect-1"
          width={0}
          height={20}
          x={0}
          y={4}
          fill="black"
        />
        <rect
          className="rect-1"
          width={0}
          height={2}
          x={0}
          y={26}
          fill="black"
        />
      </svg>
    </div>
  );
};

export default DemoPattern;
