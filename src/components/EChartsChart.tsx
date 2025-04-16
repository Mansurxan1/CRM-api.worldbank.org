import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { EChartsOption, LineSeriesOption, BarSeriesOption, PieSeriesOption, ScatterSeriesOption } from "echarts";

interface EChartsChartProps {
  data: { year: string; value: number }[];
  chartType: "line" | "bar" | "pie" | "scatter";
  width: string;
  height: number;
}

const EChartsChart = ({ data, chartType, width, height }: EChartsChartProps) => {
  const echartsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (echartsRef.current && data) {
      const chart = echarts.init(echartsRef.current);

      const option: EChartsOption = {
        xAxis:
          chartType === "line" || chartType === "bar" || chartType === "scatter"
            ? {
                type: "category",
                data: data.map((d) => d.year),
                axisLabel: { fontSize: 12, color: "#555", fontFamily: "Inter" },
                axisTick: { show: chartType === "bar" ? false : true },
              }
            : undefined,
        yAxis:
          chartType === "line" || chartType === "bar" || chartType === "scatter"
            ? {
                type: "value",
                axisLabel: {
                  formatter: (value: number) =>
                    value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value.toLocaleString(),
                  fontSize: 12,
                  color: "#555",
                  fontFamily: "Inter",
                },
              }
            : undefined,
        series:
          chartType === "line"
            ? [
                {
                  type: "line",
                  data: data.map((d) => d.value),
                  smooth: true,
                  lineStyle: { color: "#6b48ff", width: 3 },
                  itemStyle: { color: "#6b48ff" },
                  showSymbol: true,
                  symbolSize: 8,
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: "rgba(107, 72, 255, 0.3)" },
                      { offset: 1, color: "rgba(107, 72, 255, 0)" },
                    ]),
                  },
                } as LineSeriesOption,
              ]
            : chartType === "bar"
            ? [
                {
                  type: "bar",
                  data: data.map((d) => ({
                    value: d.value,
                    label: {
                      show: true,
                      position: "top",
                      formatter: (params: { value: number | string }) => {
                        const value = Number(params.value);
                        return value >= 1000000
                          ? `${(value / 1000000).toFixed(1)}M`
                          : value.toLocaleString();
                      },
                      fontSize: 12,
                      color: "#333",
                      fontFamily: "Inter",
                    },
                  })),
                  barWidth: "30%",
                  itemStyle: { color: "#66b3ff" },
                } as BarSeriesOption,
              ]
            : chartType === "pie"
            ? [
                {
                  type: "pie",
                  radius: "50%",
                  center: ["50%", "50%"],
                  data: data.map((d) => ({
                    value: d.value,
                    name: d.year,
                  })),
                  label: {
                    fontSize: 12,
                    fontFamily: "Inter",
                    color: "#333",
                  },
                  itemStyle: {
                    borderColor: "#fff",
                    borderWidth: 2,
                  },
                } as PieSeriesOption,
              ]
            : chartType === "scatter"
            ? [
                {
                  type: "scatter",
                  data: data.map((d) => [d.year, d.value]),
                  symbolSize: 12,
                  itemStyle: { color: "#6b48ff", opacity: 0.7 },
                } as ScatterSeriesOption,
              ]
            : [],
        tooltip: {
          trigger: "axis",
          backgroundColor: "#fff",
          borderColor: "#ddd",
          textStyle: { color: "#333" },
        },
        grid: chartType === "pie" ? undefined : { left: "80px", right: "30px", bottom: "50px", top: "50px" },
      };

      chart.setOption(option);
      return () => chart.dispose();
    }
  }, [data, chartType]);

  return <div ref={echartsRef} style={{ width, height }} />;
};

export default EChartsChart;