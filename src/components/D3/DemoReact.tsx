import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type { DataPoint1 } from "../../consts";

const DemoReact = () => {
  const ref = useRef(null);

  const margin = { top: 20, right: 20, bottom: 60, left: 50 };
  const width = 700 + margin.left + margin.right;
  const height = 400 + margin.top + margin.bottom;

  useEffect(() => {
    const svg = d3
      .select(ref.current)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // This is new to me so I wanted to console.log() it for a second
    d3.csv(
      "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv",
      (d: any) => d as DataPoint1
    ).then((data) => {
      console.log(data);

      const x = d3
        .scaleBand()
        .domain(
          data
            .sort((a: any, b: any) => b.Value - a.Value)
            .map((d: any) => d.Country)
        )
        .range([0, width - margin.left - margin.right])
        .padding(0.2);

      svg
        .append("g")
        .attr(
          "transform",
          `translate(0, ${height - margin.bottom - margin.top})`
        )
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      //  This part I did before the tutorial to see if I could. The only difference is that the tutorial uses hard-coded values for the domain.
      //  const yMax = d3.max(data.map((d: any) => Number.parseInt(d.Value))) ?? 0;
      //  const yMin = d3.min(data.map((d: any) => Number.parseInt(d.Value))) ?? 0;
      //  const y = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);
      //  svg.append("g").call(d3.axisLeft(y));

      const y = d3
        .scaleLinear()
        .domain([0, 13000])
        .range([height - margin.bottom - margin.top, 0]);
      svg.append("g").call(d3.axisLeft(y));

      svg
        .selectAll("mybar")
        .data(data.sort((a: any, b: any) => b.Value - a.Value))
        .join("rect")
        .attr("x", (d) => x(d.Country) ?? 0)
        .attr("y", (d: any) => y(d.Value))
        .attr("width", x.bandwidth())
        .attr(
          "height",
          (d: any) => height - margin.bottom - margin.top - y(d.Value)
        )
        .attr("fill", "#5f0f40");
    });
  }, []);

  return <svg style={{ width: "100%" }} height={height} ref={ref} />;
};

export default DemoReact;
