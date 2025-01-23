import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import Train from "../GSAP/Train";
import { motion, useAnimate } from "motion/react";

const ThirdMotionDemo = () => {
  const [data, setData] = useState<any[]>([]);

  const [ref, animate] = useAnimate();
  const [value, setValue] = useState(1);
  const [stringLength, setStringLength] = useState(1);
  const [trainAmount, setTrainAmount] = useState(1);

  useEffect(() => {
    d3.csv("/organizations.csv").then((data: any) => {
      setData(data);
      drawSquares(1);
      drawTrains(1);
    });
  }, []);

  const drawSquares = (amount: number) => {
    let localData = data.slice(0, Math.min(amount, data.length));

    d3.select(ref.current).selectAll("span").remove();

    const squares = d3
      .select(ref.current)
      .selectAll("span")
      .data(localData)
      .enter()
      .append("span")
      .text((d) => d.Name.slice(0, 1))
      .style("position", "absolute")
      .style(
        "left",
        () =>
          `${-100 + Math.random() * ((ref.current?.clientWidth ?? 0) + 200)}px`
      )
      .style(
        "top",
        () => `${Math.random() * (ref.current?.clientHeight ?? 0)}px`
      )
      .style(
        "font-size",
        (d) => `${1 + Number.parseInt(d["Number of employees"]) / 500}px`
      )
      .style("text-anchor", "middle");

    const timeout = setTimeout(() => {
      squares.each((d, i, nodes) => {
        const node = nodes[i];

        const x = -10 - Number.parseInt(d["Number of employees"]) / 100;

        animate(
          node,
          { x: [x, -x, x] },
          { duration: 2, repeat: Infinity, ease: "linear" }
        );

        setText(stringLength);
      });
    }, 500);
  };

  const setText = (letters: number) => {
    const squares = d3.select(ref.current).selectAll("span");

    squares.each((d, i, nodes) => {
      const node = nodes[i];

      (node as HTMLElement).innerHTML = d.Name.slice(
        0,
        Math.ceil((letters / 20) * d["Name"].length)
      );
    });
  };

  const drawTrains = (amount: number) => {
    const trains = document.getElementsByClassName("train");

    const timeout2 = setTimeout(() => {
      Array.from(trains).forEach((node, index) => {
        (node as HTMLElement).style.transform = `translate(${
          index % 2 === 0 ? -24 : ref.current?.clientWidth - 24 - 254
        }px, ${21 - 23.1 * trains.length + index * 46.2}px)`;

        animate(
          node,
          {
            x: `${index % 2 === 0 ? ref.current?.clientWidth : -254 - 24}px`,
          },
          { duration: 2, repeat: Infinity, ease: "linear" }
        );
      });
    }, 500);
  };

  return (
    <div ref={ref} className="w-full flex flex-col gap-8">
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
            setStringLength(Number.parseInt(e.target.value));
            setText(Number.parseInt(e.target.value));
          }}
        ></input>
      </div>
      <div className="relative overflow-hidden w-full h-96 border border-black rounded-lg"></div>
      <label htmlFor="amountTrains">Amount of trains</label>
      <input
        id="amountTrains"
        type="range"
        min={1}
        max={30}
        value={trainAmount}
        step={1}
        onChange={(e) => {
          setTrainAmount(Number.parseInt(e.target.value));
          drawTrains(Number.parseInt(e.target.value));
        }}
      ></input>
      <svg height={30 * 46.2} className="w-full border border-black rounded-lg">
        {new Array(30).fill(null).map((_, i) => (
          <motion.g key={i} className="train">
            <Train />
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

export default ThirdMotionDemo;
