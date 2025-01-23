import { useEffect } from "react";
import { motion, useAnimate } from "motion/react";
import * as d3 from "d3";

const FirstMotionDemo = () => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const square = d3
      .select(scope.current)
      .append("rect")
      .attr("width", 100)
      .attr("height", 100)
      .attr("x", (scope.current?.clientWidth ?? 0) / 2 - 50)
      .attr("y", 50)
      .attr("fill", "red")
      .attr("transform-origin", "50 150")
      .attr("transform", "rotate(0)");

    const to = setTimeout(() => {
      animate(
        square.node() ?? "rect",
        {
          rotate: 360,
        },
        { duration: 2, repeat: Infinity, ease: "linear" }
      );
    }, 1000);

    return () => {
      clearTimeout(to);
      d3.select(scope.current).selectAll("*").remove();
    };
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <motion.svg
        ref={scope}
        className="w-full h-96 border border-black rounded-lg opacity-1"
      >
        <motion.rect
          className="w-[100px] h-[100px]"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        ></motion.rect>
      </motion.svg>
      <div className="relative w-full h-96 border border-black rounded-lg opacity-1">
        <motion.div
          className="absolute w-[100px] h-[100px] bg-[#FF0000] top-[50px] left-[45%] origin-[50px_150px]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        ></motion.div>
      </div>
    </div>
  );
};

export default FirstMotionDemo;
