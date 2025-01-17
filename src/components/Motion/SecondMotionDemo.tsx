import { useEffect, useState } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import * as d3 from "d3";

const FirstMotionDemo = () => {
  const [scope, animate] = useAnimate();

  const [data, setData] = useState<any[]>([]);
  const [localData, setLocalData] = useState<any[]>([]);

  const drawSquares = (amount: number) => {
    setLocalData(data.slice(0, Math.min(amount, data.length)));
  };

  useEffect(() => {
    d3.csv("/organizations.csv").then((data: any) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      animate(
        "rect",
        { rotate: 360 },
        {
          duration: 2,
          repeat: Infinity,
          ease: "linear",
          delay: stagger(1 / localData.length),
        }
      );
    }, 500);

    return () => {
      clearTimeout(delay);
    };
  }, [localData]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 items-start">
        <button className="button" onClick={() => drawSquares(10)}>
          10 squares
        </button>
        <button className="button" onClick={() => drawSquares(100)}>
          100 squares
        </button>
        <button className="button" onClick={() => drawSquares(1000)}>
          1.000 squares
        </button>
        <button className="button" onClick={() => drawSquares(10000)}>
          10.000 squares
        </button>
      </div>
      <motion.svg
        ref={scope}
        className="relative w-full h-96 border border-black rounded-lg opacity-1"
      >
        {localData.map((d, i) => (
          <motion.rect
            width={100}
            height={100}
            x={(scope.current?.clientWidth ?? 0) / 2 - 50}
            y={50}
            key={i}
            style={{
              fill: i % 2 === 0 ? "red" : "blue",
              originX: "50%",
              originY: "50%",
            }}
            initial={{ rotate: 0 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          ></motion.rect>
        ))}
      </motion.svg>
    </div>
  );
};

export default FirstMotionDemo;
