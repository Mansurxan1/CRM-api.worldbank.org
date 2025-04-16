import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface D3ChartProps {
  data: { year: string; value: number }[];
  chartType: "line" | "bar" | "pie" | "scatter";
  width: string; 
  height: number;
}

const D3Chart = ({ data, chartType, height }: D3ChartProps) => {
  const d3Ref = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawD3Chart = () => {
    if (!containerRef.current || !d3Ref.current || !data) return;

    const svg = d3.select(d3Ref.current);
    svg.selectAll("*").remove();

    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const containerHeight = height;

    svg.attr("width", containerWidth).attr("height", containerHeight);

    const margin = { top: 50, right: 60, bottom: 70, left: 100 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = containerHeight - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Tooltip yaratish
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ddd")
      .style("padding", "5px")
      .style("border-radius", "8px")
      .style("font-family", "Inter")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)");

    if (chartType === "line" || chartType === "bar" || chartType === "scatter") {
      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.year))
        .range([0, innerWidth])
        .padding(0.3);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d: { value: number }) => d.value) ?? 0])
        .range([innerHeight, 0])
        .nice();

      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("font-family", "Inter")
        .style("font-size", "12px")
        .style("fill", "#555");

      g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 50)
        .attr("text-anchor", "middle")
        .style("font-family", "Inter")
        .style("font-size", "14px")
        .style("fill", "#333")
        .text("Yil");

      if (chartType === "line" || chartType === "scatter") {
        g.append("g")
          .call(
            d3.axisLeft(yScale).tickFormat((value: d3.NumberValue, _index: number) => {
              const num = Number(value);
              return num >= 1000000 ? `${(num / 1000000).toFixed(1)}M` : num.toLocaleString();
            })
          )
          .selectAll("text")
          .style("font-family", "Inter")
          .style("font-size", "12px")
          .style("fill", "#555");

        g.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -innerHeight / 2)
          .attr("y", -80)
          .attr("text-anchor", "middle")
          .style("font-family", "Inter")
          .style("font-size", "14px")
          .style("fill", "#333")
          .text("Qiymat");

        // Grid chiziqlari
        const yGridAxis = d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => "");
        g.append("g").attr("class", "grid").call(yGridAxis).selectAll(".tick line").attr("stroke", "rgba(0, 0, 0, 0.05)");
      }

      if (chartType === "line") {
        const line = d3
          .line<{ year: string; value: number }>()
          .x((d) => (xScale(d.year) ?? 0) + xScale.bandwidth() / 2)
          .y((d) => yScale(d.value))
          .curve(d3.curveMonotoneX);

        const gradient = svg
          .append("defs")
          .append("linearGradient")
          .attr("id", "gradient-d3")
          .attr("x1", "0")
          .attr("y1", "0")
          .attr("x2", "0")
          .attr("y2", "1");

        gradient.append("stop").attr("offset", "5%").attr("stop-color", "rgba(107, 72, 255, 0.3)");
        gradient.append("stop").attr("offset", "95%").attr("stop-color", "rgba(107, 72, 255, 0)");

        g.append("path")
          .datum(data)
          .attr("fill", "url(#gradient-d3)")
          .attr("d", d3
            .area<{ year: string; value: number }>()
            .x((d) => (xScale(d.year) ?? 0) + xScale.bandwidth() / 2)
            .y0(innerHeight)
            .y1(innerHeight)
            .curve(d3.curveMonotoneX))
          .transition()
          .duration(1000)
          .attr("d", d3
            .area<{ year: string; value: number }>()
            .x((d) => (xScale(d.year) ?? 0) + xScale.bandwidth() / 2)
            .y0(innerHeight)
            .y1((d) => yScale(d.value))
            .curve(d3.curveMonotoneX));

        g.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "#6b48ff")
          .attr("stroke-width", 3)
          .attr("d", line)
          .attr("stroke-dasharray", function (this: SVGPathElement) {
            const length = this.getTotalLength();
            return `${length} ${length}`;
          })
          .attr("stroke-dashoffset", function (this: SVGPathElement) {
            return this.getTotalLength();
          })
          .transition()
          .duration(1500)
          .attr("stroke-dashoffset", 0);

        g.selectAll<SVGCircleElement, { year: string; value: number }>("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", (d) => (xScale(d.year) ?? 0) + xScale.bandwidth() / 2)
          .attr("cy", innerHeight)
          .attr("r", 0)
          .attr("fill", "#fff")
          .attr("stroke", "#6b48ff")
          .attr("stroke-width", 2)
          .transition()
          .duration(1000)
          .delay((_, i: number) => i * 50)
          .attr("cy", (d) => yScale(d.value))
          .attr("r", 5);

        // Tooltip uchun hodisalar
        g.selectAll<SVGCircleElement, { year: string; value: number }>("circle")
          .data(data)
          .on("mouseover", (event: MouseEvent, d: { year: string; value: number }) => {
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
              .html(`Yil: ${d.year}<br>Qiymat: ${d.value >= 1000000 ? `${(d.value / 1000000).toFixed(1)}M` : d.value.toLocaleString()}`)
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY - 28}px`);
          })
          .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
          });
      } else if (chartType === "bar") {
        g.selectAll<SVGRectElement, { year: string; value: number }>("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", (d) => xScale(d.year) ?? 0)
          .attr("y", innerHeight)
          .attr("width", xScale.bandwidth())
          .attr("height", 0)
          .attr("fill", "#66b3ff")
          .transition()
          .duration(1000)
          .delay((_, i: number) => i * 50)
          .attr("y", (d) => yScale(d.value))
          .attr("height", (d) => innerHeight - yScale(d.value));

        g.selectAll<SVGTextElement, { year: string; value: number }>("text.value")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "value")
          .attr("x", (d) => (xScale(d.year) ?? 0) + xScale.bandwidth() / 2)
          .attr("y", innerHeight)
          .attr("text-anchor", "middle")
          .text((d) => (d.value >= 1000000 ? `${(d.value / 1000000).toFixed(1)}M` : d.value.toLocaleString()))
          .style("font-family", "Inter")
          .style("font-size", "12px")
          .style("fill", "#333")
          .transition()
          .duration(1000)
          .delay((_, i: number) => i * 50)
          .attr("y", (d) => yScale(d.value) - 10);

        // Tooltip uchun hodisalar
        g.selectAll<SVGRectElement, { year: string; value: number }>("rect")
          .data(data)
          .on("mouseover", (event: MouseEvent, d: { year: string; value: number }) => {
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
              .html(`Yil: ${d.year}<br>Qiymat: ${d.value >= 1000000 ? `${(d.value / 1000000).toFixed(1)}M` : d.value.toLocaleString()}`)
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY - 28}px`);
          })
          .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
          });
      } else if (chartType === "scatter") {
        g.selectAll<SVGCircleElement, { year: string; value: number }>("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", (d) => (xScale(d.year) ?? 0) + xScale.bandwidth() / 2)
          .attr("cy", (d) => yScale(d.value))
          .attr("r", 0)
          .attr("fill", "#6b48ff")
          .attr("opacity", 0.7)
          .transition()
          .duration(1000)
          .delay((_, i: number) => i * 50)
          .attr("r", 6);

        // Tooltip uchun hodisalar
        g.selectAll<SVGCircleElement, { year: string; value: number }>("circle")
          .data(data)
          .on("mouseover", (event: MouseEvent, d: { year: string; value: number }) => {
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
              .html(`Yil: ${d.year}<br>Qiymat: ${d.value >= 1000000 ? `${(d.value / 1000000).toFixed(1)}M` : d.value.toLocaleString()}`)
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY - 28}px`);
          })
          .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
          });
      }
    } else if (chartType === "pie") {
      const pieData = d3.pie<{ year: string; value: number }>().value((d) => d.value)(data);
      const arc = d3
        .arc<d3.PieArcDatum<{ year: string; value: number }>>()
        .innerRadius(0)
        .outerRadius(Math.min(innerWidth, innerHeight) / 2 - 10);

      const colors = d3.schemeCategory10;

      const pieGroup = g.append("g").attr("transform", `translate(${innerWidth / 2},${innerHeight / 2})`);

      pieGroup
        .selectAll<SVGPathElement, d3.PieArcDatum<{ year: string; value: number }>>("path")
        .data(pieData)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (_: d3.PieArcDatum<{ year: string; value: number }>, i: number) => colors[i % colors.length])
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .transition()
        .duration(1000)
        .attrTween("d", (d: d3.PieArcDatum<{ year: string; value: number }>) => {
          const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
          return (t: number) => arc(interpolate(t))!;
        });

      pieGroup
        .selectAll<SVGTextElement, d3.PieArcDatum<{ year: string; value: number }>>("text")
        .data(pieData)
        .enter()
        .append("text")
        .attr("transform", (d: d3.PieArcDatum<{ year: string; value: number }>) => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("font-family", "Inter")
        .style("font-size", "12px")
        .style("fill", "#333")
        .text((d: d3.PieArcDatum<{ year: string; value: number }>) => d.data.year);

      // Tooltip uchun hodisalar
      pieGroup
        .selectAll<SVGPathElement, d3.PieArcDatum<{ year: string; value: number }>>("path")
        .data(pieData)
        .on("mouseover", (event: MouseEvent, d: d3.PieArcDatum<{ year: string; value: number }>) => {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(`Yil: ${d.data.year}<br>Qiymat: ${d.data.value >= 1000000 ? `${(d.data.value / 1000000).toFixed(1)}M` : d.data.value.toLocaleString()}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        });
    }

    return () => {
      tooltip.remove();
    };
  };

  useEffect(() => {
    drawD3Chart();
    const handleResize = () => drawD3Chart();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data, chartType]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={d3Ref}></svg>
    </div>
  );
};

export default D3Chart;