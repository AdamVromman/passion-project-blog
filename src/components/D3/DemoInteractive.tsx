import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { Country } from "../../consts";

const DemoInteractive = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const height = 400 + margin.top + margin.bottom;
  let width = 700 + margin.left + margin.right;

  useEffect(() => {
    // Set the variable width to the (dynamic) width of the svg element.
    if (svgRef.current) width = svgRef.current.clientWidth;

    // Transform lat and long to x and y values.
    const transformLatLong = (lat: number, long: number) => {
      const x = ((long + 180) / 360) * (width - margin.left - margin.right);
      const y = ((-1 * lat + 90) / 180) * (height - margin.top - margin.bottom);

      return { x, y };
    };

    // Get the local data.
    d3.csv("/countries.csv").then((data: any) => {
      // Here I transformed the data a bit to make it work better with Typescript.
      const dataTransformed = data.map((d: any): Country => {
        const [lat, long] = d["latlng"].split(",").map(Number);
        return {
          name: d["name.common"],
          lat: lat,
          long: long,
          landlocked: d.landlocked === "1",
          flag: d.flag,
          languages: d.languages,
          region: d.region,
          independent: d.independent === "1",
          area: Number(d.area),
          x: transformLatLong(lat, long).x,
          y: transformLatLong(lat, long).y,
        };
      });

      // Get the max and min values for the area property.

      const maxArea = d3.max(dataTransformed, (d: Country) => d.area) ?? 0;
      const minArea = d3.min(dataTransformed, (d: Country) => d.area) ?? 0;
      const areaDiff = Math.abs(maxArea - minArea);

      // This function makes the text size and the stroke stay the same size when zooming in and out.
      //it also manipulates the map when a user zooms.
      const handleZoom = (e: any) => {
        d3.select(svgRef.current).select("g").attr("transform", e.transform);
        d3.selectAll("text").attr("font-size", `${7 / e.transform.k}px`);

        d3.selectAll<Element, Country>("circle").attr(
          "stroke-width",
          (d: Country) => (d.landlocked ? `${2 / e.transform.k}px` : 0)
        );
      };

      // This function allows zoom/pan and also limits the zoom and the pan to a certain extent.
      const zoomFunction = d3
        .zoom()
        .on("zoom", handleZoom)
        .scaleExtent([1, 10])
        .translateExtent([
          [0, 0],
          [width, height],
        ]);

      // Attach the zoom/pan functionality to the svg element.
      d3.select(svgRef.current).call(zoomFunction);

      // This function allows for programmatic zooming to a specific country.
      const programmaticZoom = (country: Country) => {
        d3.select(svgRef.current)
          .select("g")
          .transition()
          .call(zoomFunction.scaleTo, 1)
          .duration(2000)
          .transition()
          .call(
            zoomFunction.transform,
            d3.zoomIdentity
              .scale(5)
              .translate(
                -country.x + width / (2 * 5),
                -country.y + height / (2 * 5)
              )
          )
          .duration(2000);
      };

      // Transform regions to colors.
      const regionD3 = d3
        .scaleOrdinal()
        .domain(
          Array.from(new Set(dataTransformed.map((d: Country) => d.region)))
        )
        .range([
          "red",
          "blue",
          "green",
          "yellow",
          "purple",
          "orange",
          "pink",
          "brown",
          "black",
          "gray",
        ]);

      // Add a main group to the svg element.
      const main = d3
        .select(svgRef.current)
        .append("g")
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom)
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // A simple border to the map.
      const rect = d3
        .select(svgRef.current)
        .append("rect")
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom)
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("fill", "none")
        .attr("stroke", "black");

      // Add the circles per country, x and y values, radius, fill, stroke and stroke-width.
      main
        .selectAll<Element, Country>("circle")
        .data(dataTransformed)
        .enter()
        .append("circle")
        .attr("cx", (d: Country) => d.x)
        .attr("cy", (d: Country) => d.y)
        // .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .attr("r", (d: any) => 5 + (d.area / areaDiff) * 20)
        .attr("fill", (d: any) => regionD3(d.region) as string)
        .attr("stroke", "black")
        .attr("stroke-width", (d: Country) => (d.landlocked ? 2 : 0))
        .attr("cursor", "pointer")
        .on("click", (e: any, d: Country) => {
          programmaticZoom(d);
        });

      // Add the text per country, x and y values, text-anchor, transform, font-size.
      main
        .selectAll<Element, Country>("text")
        .data(dataTransformed)
        .enter()
        .append("text")
        .text((d: Country) => d.flag + d.name)
        .attr("x", (d: Country) => d.x)
        .attr("y", (d: Country) => d.y)
        .attr("cursor", "pointer")
        .attr("text-anchor", "middle")
        .attr("font-size", `7px`)
        .on("click", (e: any, d: Country) => {
          programmaticZoom(d);
        });
    });
  }, []);

  return (
    <svg
      className="bg-gray-400 w-full rounded-xl"
      height={height}
      ref={svgRef}
    ></svg>
  );
};

export default DemoInteractive;
