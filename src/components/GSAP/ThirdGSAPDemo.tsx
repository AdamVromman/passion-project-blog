import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/dist/TextPlugin";
import Train from "./Train";

const ThirdGSAPDemo = () => {
  const [data, setData] = useState<any[]>([]);
  gsap.registerPlugin(useGSAP);
  gsap.registerPlugin(TextPlugin);

  const mainRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const svg2Ref = useRef<SVGSVGElement | null>(null);
  const [value, setValue] = useState(1);
  const [stringLength, setStringLength] = useState(1);
  const [trainAmount, setTrainAmount] = useState(1);
  const [trainsTimeline, setTrainsTimeline] = useState<gsap.core.Timeline>(
    gsap.timeline()
  );
  const [wordsTimeline, setWordsTimeline] = useState<gsap.core.Timeline>(
    gsap.timeline()
  );
  const [wordsPlaying, setWordsPlaying] = useState(false);
  const [trainsPlaying, setTrainsPlaying] = useState(false);

  useEffect(() => {
    d3.csv("/organizations.csv").then((data: any) => {
      setData(data);
      drawSquares(1);
      drawTrains(1);
    });
  }, []);

  const { contextSafe } = useGSAP({ scope: mainRef });

  const drawSquares = contextSafe((amount: number) => {
    let localData = data.slice(0, Math.min(amount, data.length));

    d3.select(svgRef.current).selectAll("text").remove();

    const squares = d3
      .select(svgRef.current)
      .selectAll("text")
      .data(localData)
      .enter()
      .append("text")
      .text((d) => d.Name.slice(0, 1))
      .attr(
        "x",
        () => -100 + Math.random() * ((svgRef.current?.clientWidth ?? 0) + 200)
      )
      .attr("y", () => Math.random() * (svgRef.current?.clientHeight ?? 0))
      .attr(
        "font-size",
        (d) => 1 + Number.parseInt(d["Number of employees"]) / 500
      )
      .attr("text-anchor", "middle");

    const tl = gsap.timeline();

    squares.each((d, i, nodes) => {
      const node = nodes[i];

      gsap.set(node, {
        transformOrigin: "center",
        text: d.Name.slice(
          0,
          Math.floor((stringLength / d["Name"].length) * 20)
        ),
      });

      tl.fromTo(
        node,
        {
          x: -10 - Number.parseInt(d["Number of employees"]) / 100,
        },
        {
          x: 10 + Number.parseInt(d["Number of employees"]) / 100,
          // scale: 10 + Number.parseInt(d["Number of employees"]) / 1000,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "none",
          overwrite: "auto",
        },
        0
      );
    });

    setWordsTimeline(tl);
  });

  const setText = contextSafe((letters: number) => {
    const squares = d3.select(svgRef.current).selectAll("text");

    squares.each((d, i, nodes) => {
      const node = nodes[i];

      gsap.to(node, {
        text: d.Name.slice(0, Math.ceil((letters / 20) * d["Name"].length)),
        duration: 0.2,
        overwrite: "auto",
      });
    });
  });

  const drawTrains = (amount: number) => {
    const trains = document.getElementsByClassName("train");

    Array.from(trains).forEach((node, index) => {
      gsap.killTweensOf(node);

      gsap.set(node, {
        x: index % 2 === 0 ? -24 : mainRef.current?.clientWidth - 24 - 254,
        y: 21 - 23.1 * trains.length + index * 46.2,
      });
    });

    const tl = gsap.timeline();

    Array.from(trains)
      .slice(0, amount)
      .forEach((node, index) => {
        tl.fromTo(
          node,
          {
            x: index % 2 === 0 ? -24 - 254 : mainRef.current?.clientWidth - 24,
            y: 21 - 23.1 * trains.length + index * 46.2,
          },
          {
            x: index % 2 === 0 ? mainRef.current?.clientWidth : -254 - 24,
            repeat: -1,
            duration: 2,
            ease: "none",
            delay: Math.random(),
            repeatDelay: Math.random(),
          },
          0
        );
      });

    setTrainsTimeline(tl);
  };

  useEffect(() => {
    if (!trainsPlaying) {
      trainsTimeline.pause();
    } else {
      trainsTimeline.play();
    }
    if (!wordsPlaying) {
      wordsTimeline.pause();
    } else {
      wordsTimeline.play();
    }
  }, [trainsPlaying, wordsPlaying]);

  return (
    <div ref={mainRef} className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-4 items-start">
        <p id="amount">{value} names</p>
        <label htmlFor="amount">Amount of names</label>
        <input
          id="amount"
          type="range"
          min={1}
          max={4000}
          value={value}
          step={1}
          onChange={(e) => {
            setTrainsPlaying(false);
            setWordsPlaying(true);
            setValue(Number.parseInt(e.target.value));
            drawSquares(Number.parseInt(e.target.value));
          }}
        ></input>
        <label htmlFor="stringLength">Length of string</label>
        <input
          id="stringLength"
          type="range"
          min={1}
          max={20}
          value={stringLength}
          step={1}
          onChange={(e) => {
            setTrainsPlaying(false);
            setWordsPlaying(true);
            setStringLength(Number.parseInt(e.target.value));
            setText(Number.parseInt(e.target.value));
          }}
        ></input>
      </div>
      <svg
        ref={svgRef}
        className="w-full h-96 border border-black rounded-lg"
      ></svg>
      <label htmlFor="amountTrains">Amount of trains</label>
      <input
        id="amountTrains"
        type="range"
        min={1}
        max={30}
        value={trainAmount}
        step={1}
        onChange={(e) => {
          setWordsPlaying(false);
          setTrainsPlaying(true);
          setTrainAmount(Number.parseInt(e.target.value));
          drawTrains(Number.parseInt(e.target.value));
        }}
      ></input>
      <svg
        ref={svg2Ref}
        height={30 * 46.2}
        className="w-full border border-black rounded-lg"
      >
        {new Array(30).fill(null).map((_, i) => (
          <g key={i} className="train">
            <Train />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default ThirdGSAPDemo;
