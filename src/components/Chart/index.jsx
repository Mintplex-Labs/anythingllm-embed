import React, { memo, useCallback } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  RadialBarChart,
  RadialBar,
  Treemap,
  FunnelChart,
  Funnel,
  CartesianGrid,
  XAxis,
  YAxis,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { v4 } from 'uuid';
import { saveAs } from 'file-saver';
import { useGenerateImage } from 'recharts-to-png';

// Import utilities and components
import { 
  getColor, 
  CHART_COLORS, 
  dataFormatter, 
  safeJsonParse, 
  getValueKey 
} from './chart-utils';
import DownloadChart from './DownloadChart.jsx';

// Main Chart component
export function Chart({ props }) {
  const [getDivJpeg, { ref }] = useGenerateImage({
    quality: 1,
    type: "image/jpeg",
    options: {
      backgroundColor: "#393d43",
      padding: 20,
    },
  });
  
  const handleDownload = useCallback(async () => {
    const jpeg = await getDivJpeg();
    if (jpeg) saveAs(jpeg, `chart-${v4().split("-")[0]}.jpg`);
  }, [getDivJpeg]);

  // Parse content
  const content = typeof props.content === "string" 
    ? safeJsonParse(props.content, null) 
    : props.content;
    
  if (content === null) return null;

  const chartType = content?.type?.toLowerCase();
  const data = typeof content.dataset === "string"
    ? safeJsonParse(content.dataset, [])
    : content.dataset;

  const value = getValueKey(data);
  const title = content?.title;
  const color = null; // Can be customized
  const showLegend = true;

  // console.log('Chart component rendering:', { chartType, dataLength: data?.length, value, title });

  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getColor(color || "blue")} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={getColor(color || "blue")} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" tick={{ fill: 'white' }} />
              <YAxis tick={{ fill: 'white' }} formatter={dataFormatter} />
              <Tooltip />
              <Area type="monotone" dataKey={value} stroke={getColor(color || "blue")}
                fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" tick={{ fill: 'white' }} />
              <YAxis tick={{ fill: 'white' }} formatter={dataFormatter} />
              <Tooltip />
              {showLegend && <Legend />}
              <Bar dataKey={value} fill={getColor(color || "blue")} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" tick={{ fill: 'white' }} />
              <YAxis tick={{ fill: 'white' }} formatter={dataFormatter} />
              <Tooltip />
              {showLegend && <Legend />}
              <Line type="monotone" dataKey={value} stroke={getColor(color || "blue")}
                strokeWidth={2} dot={{ fill: getColor(color || "blue"), strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case "composed":
        return (
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" tick={{ fill: 'white' }} />
              <YAxis tick={{ fill: 'white' }} formatter={dataFormatter} />
              <Tooltip />
              {showLegend && <Legend />}
              <Bar dataKey={value} fill={getColor(color || "blue")} />
              <Line type="monotone" dataKey={value} stroke={getColor(color || "emerald")} strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis type="number" dataKey="name" name="name" tick={{ fill: 'white' }} />
              <YAxis type="number" dataKey={value} name={value} tick={{ fill: 'white' }} formatter={dataFormatter} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name={value} data={data} fill={getColor(color || "blue")} />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case "pie":
      case "donut":
        const pieData = data.map(item => ({
          name: item.name,
          value: item[value] || item.value
        }));
        
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case "radar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis dataKey="name" tick={{ fill: 'white' }} />
              <PolarRadiusAxis tick={{ fill: 'white' }} />
              <Tooltip />
              <Radar name={value} dataKey={value} stroke={getColor(color || "blue")}
                fill={getColor(color || "blue")} fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        );

      case "radialbar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="90%" 
              barSize={10} data={data}>
              <RadialBar angleAxisId={15} label={{ position: 'insideStart', fill: '#fff' }} 
                background dataKey={value} fill={getColor(color || "blue")} />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        );

      case "treemap":
        const treemapData = data.map(item => ({
          name: item.name,
          size: item[value] || item.value,
          color: CHART_COLORS[Math.floor(Math.random() * CHART_COLORS.length)]
        }));
        
        return (
          <ResponsiveContainer width="100%" height={260}>
            <Treemap
              data={treemapData}
              dataKey="size"
              stroke="#fff"
              fill={getColor(color || "blue")}
            >
              <Tooltip />
            </Treemap>
          </ResponsiveContainer>
        );

      case "funnel":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <FunnelChart>
              <Tooltip />
              <Funnel dataKey={value} data={data} isAnimationActive>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        );

      default:
        return <p className="text-white">Unsupported chart type: {chartType}</p>;
    }
  };

  // Render with wrapper
  const chartContent = (
    <div className="bg-theme-bg-primary p-8 rounded-xl text-white light:border light:border-theme-border-primary">
      <h3 className="text-lg text-theme-text-primary font-medium mb-4">{title}</h3>
      <div ref={ref}>
        {renderChart()}
      </div>
      {content.caption && (
        <p className="mt-4 text-sm text-theme-text-secondary">{content.caption}</p>
      )}
    </div>
  );

  // If chatId is provided, wrap with additional layout
  if (props.chatId) {
    return (
      <div className="flex justify-center items-end w-full">
        <div className="py-2 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col">
          <div className="relative w-full">
            <DownloadChart onClick={handleDownload} />
            {chartContent}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, just render the chart with download button
  return (
    <div className="relative w-full">
      <DownloadChart onClick={handleDownload} />
      {chartContent}
    </div>
  );
}

export default memo(Chart);
