import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material';
import { DataSourceSets } from "@/services/response/data_response";
import 'echarts-gl';
import Papa from 'papaparse';
import { DateFilterValue } from '../filter/date_picker';
import { getChartStyles } from '@/components/style/data_chart.sytles';

interface DataChartProps {
  data: DataSourceSets;
  dateRange: DateFilterValue;
  use3D: boolean;
}

export const DataCharts: React.FC<DataChartProps> = ({
  data,
  dateRange,
  use3D,
}) => {
  const theme = useTheme();
  
  const styles = useMemo(() => getChartStyles(theme), [theme]);

  const [useBaseLine, setUseBaseLine] = useState<Boolean>(true) 

  const handleCSVExport = () => {
    if (!chartData) {
      return;
    }

    try {
      const csvData: any[][] = [];
      
      const headers = ['Date'];
      chartData.series.forEach((s: any) => {
        const stationPrefix = s.stationName || s.stationId;
        const sourceKey = s.sourceKey;
        const depth = s.depth ? `_${s.depth}cm` : '';
        const unit = s.unit ? ` (${s.unit})` : '';
        
        const columnHeader = `${stationPrefix}_${sourceKey}${depth}${unit}`;
        headers.push(columnHeader);
      });
      csvData.push(headers);
      
      chartData.dates.forEach((date: string, index: number) => {
        const row = [new Date(date).toLocaleDateString('en-NZ')];
        
        chartData.series.forEach((s: any) => {
          const value = s.data[index];
          row.push(value !== null && value !== undefined ? Number(value).toFixed(3) : '');
        });
        
        csvData.push(row);
      });

      const csv = Papa.unparse(csvData);
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'soil-moisture-data-by-source.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('CSV export failed:', error);
    }
  }

  const chartData = useMemo(() => {
    if (!data?.stations || Object.keys(data.stations).length === 0) {
      return null;
    }

    const allDates = new Set<string>();
    const allSeries: any[] = [];

    Object.entries(data.stations).forEach(([stationId, stationData]) => {
      Object.entries(stationData.station_data_source).forEach(([sourceKey, dataSource]) => {
        dataSource.data_series.forEach(series => {
          allDates.add(series.date);
        });

        const valueMap = new Map<string, number>();
        dataSource.data_series.forEach(series => {
          valueMap.set(series.date, Number(series.value));
        });

        allSeries.push({
          stationId: stationId,
          stationName: stationData.station_name,
          field_capacity: stationData.field_capacity,
          wilting_point: stationData.wilting_point,
          sourceKey: sourceKey,
          dataSource: dataSource,
          valueMap: valueMap
        });
      });
    });
    
    const sortedDates = Array.from(allDates).sort();

    const series = allSeries.map((item, index) => {
      const { stationId, stationName, sourceKey, dataSource, valueMap, field_capacity, wilting_point} = item;
      
      const seriesData = sortedDates.map(date => {
        return valueMap.get(date) ?? null;
      });

      return {
        name: `${dataSource.display_name}`,
        type: 'line',
        lineStyle: {
          width: styles.line2D.width,
        },
        symbolSize: 0,
        emphasis: {
          focus: 'series',
          lineStyle: {
            width: styles.line2D.emphasis.width
          },
          symbolSize: 3,
        },
        markLine: {
          data: [
            ...(sourceKey === 'observation' && field_capacity && useBaseLine ? [{
              yAxis: field_capacity,
              label: {
                position: 'start',
                formatter: `Field Capacity(${Number(field_capacity)})`
              }
            }] : []),
            ...(sourceKey === 'observation' && wilting_point && useBaseLine ? [{
              yAxis: wilting_point,
              label: {
                position: 'start',
                formatter: `Wilting Point(${Number(wilting_point)})`
              }
            }] : [])
          ],    
        },
        data: seriesData,
        connectNulls: false,
        depth: dataSource.data_depth ? Number(dataSource.data_depth) : 0,
        stationId: stationId,
        stationName: stationName,
        sourceKey: sourceKey,
        field_capacity: field_capacity,
        wilting_point: wilting_point,
        unit: dataSource.data_series[0]?.unit || '', 
      };
    });

    return {
      dates: sortedDates,
      series: series,
      stationCount: Object.keys(data.stations).length
    };
  }, [data, styles]);

  const get2DSpecificConfig = () => {
    if (!chartData) return {};

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: styles.tooltipBackground
          }
        },
        formatter: function(params: any[]) {
          if (!params || params.length === 0) return '';
          
          let tooltip = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
          
          params.forEach((param: any) => {
            if (param && param.value !== null && param.value !== undefined) {
              const value = typeof param.value === 'number' ? param.value : parseFloat(param.value);
              if (!isNaN(value)) {
                const series = chartData.series.find(s => s.name === param.seriesName);
                const unit = series?.unit || '';
                tooltip += `
                  <div style="display: flex; align-items: center; margin: 4px 0;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
                    <span style="margin-right: 8px;">${param.seriesName}:</span>
                    <span style="font-weight: bold;">${value.toFixed(3)} ${unit}</span>
                  </div>
                `;
              }
            }
          });
          
          return tooltip;
        }
      },
      grid: styles.grid,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.dates,
        min: dateRange.startDate,
        max: dateRange.endDate, 
        axisLabel: {
          color: styles.axisLabel.color,
          formatter: function(value: string) {
            return new Date(value).toLocaleDateString('en-NZ', {
              month: 'short',
              day: 'numeric'
            });
          }
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        axisLabel: {
          color: styles.axisLabel.color,
          formatter: function(value: number) {
            const firstSeries = chartData.series[0];
            const unit = firstSeries?.unit || '';
            return `${value} ${unit}`;
          }
        },
        splitLine: {
          lineStyle: {
            color: styles.splitLine.color,
            type: styles.splitLine.type
          }
        },
        name: 'Soil Moisture (mm)',
        nameLocation: 'middle',
        nameGap: 80,
        nameTextStyle: {
          color: styles.axisName.color
        }
      },
      series: chartData.series,
      toolbox: {
        left: "right",
        orient: 'horizontal',
        show: true,
        feature: {
          dataZoom: {
            show: true,
            title: {
              zoom: 'Area Zoom',
              back: 'Zoom Restore'
            },
            yAxisIndex: 'none'
          },
          myExportCSV: {
            show: true,
            title: 'Export As CSV', 
            icon: 'path://M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20V9H13V4H6V20H18M8,12V14H16V12H8M8,16V18H13V16H8Z',
            onclick: handleCSVExport
          },
          saveAsImage: {
            show: true,
            title: 'Save As Image', 
            type: 'png',
            name: 'figure',
            pixelRatio: 2,
          },
        }
      }
    };
  };

  const generate3DData = (seriesData: any[], depth: number, dates: string[]) => {
    return seriesData.map((value, index) => {
      if (value === null) return null;
      return [
        index, // x
        depth, // y
        value  // z
      ];
    }).filter(item => item !== null);
  };

  const get3DSpecificConfig = () => {
    if (!chartData) return {};
    
    const depths = [...new Set(chartData.series.map(s => s.depth))].sort((a, b) => a - b);
    const minDepth = Math.min(...depths);
    const maxDepth = Math.max(...depths);

    return {
      tooltip: {
        formatter: function(params: any) {
          if (!params.data) return '';
          const [timeIndex, depth, value] = params.data;
          const date = chartData.dates[timeIndex];
          const numValue = typeof value === 'number' ? value : Number(value);
          const series = chartData.series.find(s => s.name === params.seriesName);
          const unit = series?.unit || '';
          
          return `
            <div><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-NZ')}</div>
            <div><strong>Value:</strong> ${isNaN(numValue) ? 'N/A' : numValue.toFixed(3)} ${unit}</div>
            <div><strong>Depth:</strong> ${depth}</div>
            <div><strong>Series:</strong> ${params.seriesName}</div>
          `;
        }
      },
      grid3D: styles.grid3D,
      xAxis3D: {
        type: 'value',
        name: "Date Range",
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
          color: styles.axisName.color
        },
        min: 0,
        max: chartData.dates.length - 1,
        interval: Math.max(1, Math.floor(chartData.dates.length / 8)),
        axisLabel: {
          color: styles.axisLabel.color,
          formatter: function(value: number) {
            const index = Math.floor(value);
            if (index >= 0 && index < chartData.dates.length) {
              return new Date(chartData.dates[index]).toLocaleDateString('en-NZ', { 
                month: 'short', 
                day: 'numeric' 
              });
            }
            return '';
          }
        }
      },
      yAxis3D: {
        type: 'value',
        name: 'Data Depth (cm)',
        min: minDepth - 5,
        max: maxDepth + 5,
        interval: Math.max(5, Math.ceil((maxDepth - minDepth) / 5)),
        axisLabel: {
          color: styles.axisLabel.color,
          formatter: '{value}'
        },
        nameTextStyle: {
          color: styles.axisName.color
        }
      },
      zAxis3D: {
        type: 'value',
        name: 'Soil Moisture (mm)',
        min: 0,
        axisLabel: {
          color: styles.axisLabel.color,
          formatter: function(value: number) {
            return `${value}`;
          }
        },
        nameTextStyle: {
          color: styles.axisName.color
        }
      },
      toolbox: {
        left: "right",
        orient: 'horizontal',
        show: true,
        feature: {
          restore: {
            title: 'Restore Default'
          },
          myExportCSV: {
            show: true,
            title: 'Export As CSV', 
            icon: 'path://M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20V9H13V4H6V20H18M8,12V14H16V12H8M8,16V18H13V16H8Z',
            onclick: handleCSVExport
          },
          saveAsImage: {
            title: 'Save As Image', 
            type: 'png',
            name: 'figure',
            pixelRatio: 2,
          },
        }
      },
      series: chartData.series.map((series, index) => ({
        name: series.name,
        type: 'line3D',
        data: generate3DData(series.data, series.depth, chartData.dates),
        lineStyle: {
          width: styles.line3D.width,
          opacity: styles.line3D.opacity
        },
        emphasis: {
          lineStyle: {
            width: styles.line3D.emphasis.width,
            opacity: styles.line3D.emphasis.opacity
          },
          itemStyle: {
            opacity: styles.line3D.emphasis.opacity
          }
        }
      }))
    };
  };

  const option = useMemo(() => {
    if (!chartData) return {};

    const specificConfig = use3D ? get3DSpecificConfig() : get2DSpecificConfig();

    return {
      legend: {
        type: 'scroll',
        bottom: 10,
        left: 'center',
        textStyle: {
          color: styles.legend.color
        }
      },
      ...specificConfig,
    };
  }, [chartData, styles, use3D]);

  if (!chartData) {
    const availableStations = data?.stations ? Object.keys(data.stations) : [];
    
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No data available
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Available Station IDs: {availableStations.join(', ')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Total Stations: {availableStations.length}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ 
        height: 600, 
        width: '100%',
        '& .echarts-for-react': {
          height: '100% !important',
          width: '100% !important'
        }
      }}>
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          notMerge={true}
          lazyUpdate={false}
          key={`all-stations-${use3D ? '3d' : '2d'}`}
        />
      </Box>
    </Box>
  );
};