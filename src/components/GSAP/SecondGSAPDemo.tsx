import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FirstGSAPDemo = () => {
  const [data, setData] = useState<any[]>([]);
  gsap.registerPlugin(useGSAP);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const { contextSafe } = useGSAP({ scope: mainRef });

  const drawSquares = contextSafe((amount: "10" | "100" | "1000" | "10000") => {
    let localData: any;
    let stagger: number;

    switch (amount) {
      case "10":
        localData = data.slice(0, 10);
        stagger = 0.15;
        break;
      case "100":
        localData = data.slice(0, 100);
        stagger = 0.015;
        break;
      case "1000":
        localData = data.slice(0, 1000);
        stagger = 0.0015;
        break;
      case "10000":
        localData = data;
        stagger = 0.0001;
        break;
    }

    d3.select(svgRef.current).selectAll("rect").remove();

    const squares = d3
      .select(svgRef.current)
      .selectAll("rect")
      .data(localData)
      .enter()
      .append("rect")
      .attr("width", 100)
      .attr("height", 100)
      .attr("x", (svgRef.current?.clientWidth ?? 0) / 2 - 50)
      .attr("y", 50)
      .attr("fill", (d, i) => (i % 2 === 0 ? "red" : "blue"))
      .attr("transform-origin", "50 150");

    gsap.to(squares.nodes(), {
      rotate: 360,
      duration: 2,
      repeat: -1,
      ease: "none",
      stagger: stagger,
    });
  });

  useEffect(() => {
    d3.csv("/organizations.csv").then((data: any) => {
      setData(data);
    });
  }, []);

  return (
    <div ref={mainRef} className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-4 items-start">
        <button className="button" onClick={() => drawSquares("10")}>
          10 squares
        </button>
        <button className="button" onClick={() => drawSquares("100")}>
          100 squares
        </button>
        <button className="button" onClick={() => drawSquares("1000")}>
          1.000 squares
        </button>
        <button className="button" onClick={() => drawSquares("10000")}>
          10.000 squares
        </button>
      </div>
      <svg
        ref={svgRef}
        className="w-full h-96 border border-black rounded-lg"
      ></svg>
    </div>
  );
};

export default FirstGSAPDemo;
