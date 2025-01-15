import * as d3 from "d3";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FirstGSAPDemo = () => {
  gsap.registerPlugin(useGSAP);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useGSAP(
    () => {
      const square = d3
        .select(svgRef.current)
        .append("rect")
        .attr("width", 100)
        .attr("height", 100)
        .attr("x", (svgRef.current?.clientWidth ?? 0) / 2 - 50)
        .attr("y", 50)
        .attr("fill", "red")
        .attr("transform-origin", "50 150");

      gsap.to(square.node(), {
        rotate: 360,
        duration: 2,
        repeat: -1,
        ease: "none",
        overwrite: true,
      });
    },
    { scope: svgRef, dependencies: [] }
  );

  return (
    <svg
      ref={svgRef}
      className="w-full h-96 border border-black rounded-lg"
    ></svg>
  );
};

export default FirstGSAPDemo;
