import React, {memo, useCallback} from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ComposedChart,
    Funnel,
    FunnelChart,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    Treemap,
    XAxis,
    YAxis,
} from 'recharts';
import {v4} from 'uuid';
import {saveAs} from 'file-saver';
import {useGenerateImage} from 'recharts-to-png';

// Import utilities and components
import {CHART_COLORS, dataFormatter, getColor, getValueKey, safeJsonParse} from './chart-utils';
import DownloadChart from './DownloadChart.jsx';
import renderMarkdown from "@/utils/chat/markdown.js";
import {embedderSettings} from "@/main.jsx";
import AnythingLLMIcon from "@/assets/anything-llm-icon.svg";

// Main Chart component
const foregroundColor = 'black';

export function Chart({props}) {
    const [getDivJpeg, {ref}] = useGenerateImage({
        quality: 1,
        type: "image/jpeg",
        options: {
            // backgroundColor: "#393d43",
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

    const data = typeof content.dataset === "string"
        ? safeJsonParse(content.dataset, [])
        : content.dataset;

    const value = getValueKey(data);
    const title = content?.title;
    const color = null; // Can be customized
    const showLegend = true;

    /**
     * @param chartType string|undefined
     */
    const renderChart = (chartType) => {
        switch (chartType) {
            case "area":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={getColor(color || "blue")} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={getColor(color || "blue")} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444"/>
                            <XAxis dataKey="name" tick={{fill: foregroundColor}}/>
                            <YAxis tick={{fill: foregroundColor}} tickFormatter={dataFormatter}/>
                            <Tooltip/>
                            <Area type="monotone" dataKey={value} stroke={getColor(color || "blue")}
                                  fillOpacity={1} fill="url(#colorValue)"/>
                        </AreaChart>
                    </ResponsiveContainer>
                );

            case "bar":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444"/>
                            <XAxis dataKey="name" tick={{fill: foregroundColor}}/>
                            <YAxis tick={{fill: foregroundColor}} tickFormatter={dataFormatter}/>
                            <Tooltip/>
                            {showLegend && <Legend/>}
                            <Bar dataKey={value} fill={getColor(color || "blue")}/>
                        </BarChart>
                    </ResponsiveContainer>
                );

            case "line":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444"/>
                            <XAxis dataKey="name" tick={{fill: foregroundColor}}/>
                            <YAxis tick={{fill: foregroundColor}} tickFormatter={dataFormatter}/>
                            <Tooltip/>
                            {showLegend && <Legend/>}
                            <Line type="monotone" dataKey={value} stroke={getColor(color || "blue")}
                                  strokeWidth={2} dot={{fill: getColor(color || "blue"), strokeWidth: 2, r: 4}}/>
                        </LineChart>
                    </ResponsiveContainer>
                );

            case "composed":
                return (
                    <ResponsiveContainer width="100%" height={260}>
                        <ComposedChart data={data} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444"/>
                            <XAxis dataKey="name" tick={{fill: foregroundColor}}/>
                            <YAxis tick={{fill: foregroundColor}} tickFormatter={dataFormatter}/>
                            <Tooltip/>
                            {showLegend && <Legend/>}
                            <Bar dataKey={value} fill={getColor(color || "blue")}/>
                            <Line type="monotone" dataKey={value} stroke={getColor(color || "emerald")} strokeWidth={2}/>
                        </ComposedChart>
                    </ResponsiveContainer>
                );

            case "scatter":
                return (
                    <ResponsiveContainer width="100%" height={260}>
                        <ScatterChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444"/>
                            <XAxis type="number" dataKey="name" name="name" tick={{fill: foregroundColor}}/>
                            <YAxis type="number" dataKey={value} name={value} tick={{fill: foregroundColor}} tickFormatter={dataFormatter}/>
                            <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                            <Scatter name={value} data={data} fill={getColor(color || "blue")}/>
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
                                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip/>
                        </PieChart>
                    </ResponsiveContainer>
                );

            case "radar":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <PolarGrid stroke="#444"/>
                            <PolarAngleAxis dataKey="name" tick={{fill: foregroundColor}}/>
                            <PolarRadiusAxis tick={{fill: foregroundColor}}/>
                            <Tooltip/>
                            <Radar name={value} dataKey={value} stroke={getColor(color || "blue")}
                                   fill={getColor(color || "blue")} fillOpacity={0.6}/>
                        </RadarChart>
                    </ResponsiveContainer>
                );

            case "radialbar":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="90%"
                                        barSize={10} data={data}>
                            <RadialBar angleAxisId={15} label={{position: 'insideStart', fill: '#fff'}}
                                       background dataKey={value} fill={getColor(color || "blue")}/>
                            <Tooltip/>
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
                            <Tooltip/>
                        </Treemap>
                    </ResponsiveContainer>
                );

            case "funnel":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <FunnelChart>
                            <Tooltip/>
                            <Funnel dataKey={value} data={data} isAnimationActive>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]}/>
                                ))}
                            </Funnel>
                        </FunnelChart>
                    </ResponsiveContainer>
                );

            default:
                return <p className="allm-text-black">Unsupported chart type: {chartType}</p>;
        }
    };

    return (
        <div className="allm-py-[5px]">
            <div className="allm-text-[10px] allm-text-gray-400 allm-ml-[54px] allm-mr-6 allm-mb-2 allm-text-left allm-font-sans">
                {embedderSettings.settings.assistantName ||
                    "Anything LLM Chat Assistant"}
            </div>
            <div className="allm-flex allm-items-start allm-w-full allm-h-fit allm-justify-start">
                <img
                    src={embedderSettings.settings.assistantIcon || AnythingLLMIcon}
                    alt="Anything LLM Icon"
                    className="allm-w-9 allm-h-9 allm-flex-shrink-0 allm-ml-2"
                />
                <div
                    style={{
                        wordBreak: "break-word",
                        backgroundColor: embedderSettings.ASSISTANT_STYLES.msgBg,
                    }}
                    className={`allm-py-[11px] allm-px-4 allm-flex allm-flex-col allm-flex-1 ${embedderSettings.ASSISTANT_STYLES.base} allm-shadow-[0_4px_14px_rgba(0,0,0,0.25)]`}
                >
                    <div className="allm-relative allm-w-full">
                        <DownloadChart onClick={handleDownload}/>
                        <div ref={ref} className="allm-p-8 allm-rounded-xl">
                            <h3 className="allm-text-lg allm-m-0 allm-mb-2 allm-px-4">{title}</h3>
                            { renderChart(content?.type?.toLowerCase()) }
                        </div>
                    </div>
                    {content.caption && (
                        <div className="allm-flex allm-gap-x-5">
                  <span
                      className={`allm-flex allm-flex-col allm-gap-y-1 allm-mt-2`}
                      dangerouslySetInnerHTML={{
                          __html: renderMarkdown(content.caption),
                      }}
                  />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(Chart);
