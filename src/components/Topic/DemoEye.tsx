import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const DemoEye = () => {
  const main = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<any[] | null>(null);
  const [day, setDay] = useState<any | null>(null);

  const setSingleDay = (date: Date) => {
    if (data) {
      const days = data.filter((d: any) => {
        return new Date(d.report_date).getTime() === date.getTime();
      });

      if (days) {
        const day = days[0];
        setDay(day);
        return day;
      }
    }
  };

  //Get the data
  const getData = async () => {
    let data = await fetch(
      "https://data.techforpalestine.org/api/v2/casualties_daily.json"
    ).then(async (response) => {
      if (response.ok) {
        return await response.json();
      }
    });
    setData(data);
  };

  useEffect(() => {
    if (data) {
      const localDay = setSingleDay(new Date(2025, 0, 1, 1, 0));

      if (localDay) {
        const killed = new Array(localDay.killed).fill(0);
        const injured = new Array(localDay.injured).fill(1);
        const array = killed.concat(injured);
        shuffleArray(array);

        d3.select(svg.current).selectAll("rect").remove();

        d3.select(svg.current)
          .selectAll("rect")
          .data(array)
          .enter()
          .append("rect")
          .style("transform-origin", `center 192px`)
          .attr("width", 20)
          .attr("height", (_) => 100 + (Math.random() * 10 - 5))
          .attr("x", svg.current?.clientWidth / 2 - 10)
          .attr("y", svg.current?.clientHeight / 2 + 50)
          .attr(
            "transform",
            (_, i) =>
              `rotate(${(360 / array.length) * i + (-10 + Math.random() * 20)})`
          )
          .attr("fill", (type) => (type === 0 ? "red" : "black"));
      }
    }
  }, [data]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div
      id="demo-pattern"
      ref={main}
      className="relative w-full h-96 border border-black rounded-lg overflow-y-hidden overflow-x-auto"
    >
      <svg ref={svg} className="w-full h-96 perspective-normal"></svg>
    </div>
  );
};

export default DemoEye;
