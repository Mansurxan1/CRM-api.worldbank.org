import { Line as NivoLine } from "@nivo/line";
import { Bar as NivoBar } from "@nivo/bar";
import { Pie as NivoPie } from "@nivo/pie";
import { ScatterPlot as NivoScatter } from "@nivo/scatterplot";

interface NivoChartProps {
  data: { year: string; value: number }[];
  chartType: "line" | "bar" | "pie" | "scatter";
  height: number;
}

const NivoChart = ({ data, chartType, height }: NivoChartProps) => {
  const nivoDataLine = [
    {
      id: "Qiymat",
      data: data?.map((d) => ({ x: d.year, y: d.value })) || [],
    },
  ];

  const nivoDataBar = (data || []).map((d) => ({
    year: d.year,
    value: d.value,
  }));

  const nivoDataPie = (data || []).map((d) => ({
    id: d.year,
    label: d.year,
    value: d.value,
  }));

  const nivoDataScatter = [
    {
      id: "Qiymat",
      data: data?.map((d) => ({ x: d.year, y: d.value })) || [],
    },
  ];

  const computedWidth = window.innerWidth * 0.8;

  return (
    <>
      {chartType === "line" ? (
        <NivoLine
          width={computedWidth}
          height={height}
          data={nivoDataLine}
          margin={{ top: 50, right: 60, bottom: 70, left: 100 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto" }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Yil",
            legendOffset: 36,
            legendPosition: "middle",
            tickValues: data?.map((d) => d.year),
            format: (value: string) => value,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 10,
            tickRotation: 0,
            legend: "Qiymat",
            legendOffset: -80,
            legendPosition: "middle",
            format: (value: number) =>
              value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value.toLocaleString(),
            tickValues: 6,
          }}
          colors={["#6b48ff"]}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          enablePoints={true}
          enableArea={true}
          areaOpacity={0.2}
          curve="monotoneX"
          useMesh={true}
          enableGridX={false}
          enableGridY={true}
          gridYValues={6}
          animate={true}
          motionConfig="gentle"
          theme={{
            axis: {
              ticks: {
                text: { fontSize: 12, fill: "#555", fontFamily: "Inter" },
              },
              legend: {
                text: { fontSize: 14, fill: "#333", fontFamily: "Inter" },
              },
            },
            grid: { line: { stroke: "rgba(0, 0, 0, 0.05)" } },
          }}
        />
      ) : chartType === "bar" ? (
        <NivoBar
          width={computedWidth}
          height={height}
          data={nivoDataBar}
          keys={["value"]}
          indexBy="year"
          margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
          padding={0.3}
          colors={["#66b3ff"]}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Yil",
            legendPosition: "middle",
            legendOffset: 36,
          }}
          axisLeft={null}
          enableLabel={true}
          labelTextColor="#333"
          label={(d) =>
            d.value != null && d.value >= 1000000
              ? `${(d.value / 1000000).toFixed(1)}M`
              : d.value != null
              ? d.value.toLocaleString()
              : ""
          }
          labelSkipHeight={12}
          labelSkipWidth={12}
          theme={{
            axis: {
              ticks: {
                text: { fontSize: 12, fill: "#555", fontFamily: "Inter" },
              },
              legend: {
                text: { fontSize: 14, fill: "#333", fontFamily: "Inter" },
              },
            },
          }}
        />
      ) : chartType === "pie" ? (
        <NivoPie
          width={computedWidth}
          height={height}
          data={nivoDataPie}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          theme={{
            labels: {
              text: { fontSize: 12, fontFamily: "Inter", fill: "#333" },
            },
          }}
        />
      ) : (
        <NivoScatter
          width={computedWidth}
          height={height}
          data={nivoDataScatter}
          margin={{ top: 50, right: 60, bottom: 70, left: 100 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto" }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Yil",
            legendOffset: 36,
            legendPosition: "middle",
            tickValues: data?.map((d) => d.year),
            format: (value: string) => value,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 10,
            tickRotation: 0,
            legend: "Qiymat",
            legendOffset: -80,
            legendPosition: "middle",
            format: (value: number) =>
              value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value.toLocaleString(),
            tickValues: 6,
          }}
          colors={["#6b48ff"]}
          nodeSize={12}
          theme={{
            axis: {
              ticks: {
                text: { fontSize: 12, fill: "#555", fontFamily: "Inter" },
              },
              legend: {
                text: { fontSize: 14, fill: "#333", fontFamily: "Inter" },
              },
            },
          }}
        />
      )}
    </>
  );
};

export default NivoChart;