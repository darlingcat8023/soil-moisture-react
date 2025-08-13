import { getChartStyles } from "@/components/style/data_chart.sytles";
import { StationStatisticalInfo } from "@/services/response/data_response";
import { Box, useTheme } from "@mui/material";
import ReactECharts from 'echarts-for-react';
import Papa from 'papaparse';
import { useMemo, useState } from "react";

interface StatisticalChartProps {
  data: StationStatisticalInfo;
}

export const StatisticalCharts: React.FC<StatisticalChartProps> = ({
  data
}) => {

  const theme = useTheme();
  const styles = useMemo(() => getChartStyles(theme), [theme]);

  const chartData = useMemo(() => {
    if (!data || Object.keys(data.station_data).length === 0) {
      return null;
    }

    // x-axis offset
    const offsets = Array.from({length: 366}, (_, i) => i + 1);
    const allSeries: any[] = [];

    Object.entries(data.station_data).forEach(([year, yearData]) => {
      const valueMap = new Map<number, number>();
      yearData.forEach(item => {
        valueMap.set(item.series, Number(item.value));
      });

      allSeries.push({
        displayName: year,
        valueMap: valueMap
      });
    });

    const series = allSeries.map((item, index) => {
      const { displayName, valueMap} = item;
      
      const seriesData = offsets.map(offset => {
        return valueMap.get(offset) ?? null;
      });

      return {
        name: `${displayName}`,
        type: 'line',
        lineStyle: {
          width: styles.line2D.width,
        },
        symbolSize: 0,
        emphasis: {
          focus: 'series',
          disable: false,
          lineStyle: {
            width: styles.line2D.emphasis.width
          },
          symbolSize: 3,
        },
        data: seriesData,
        connectNulls: false,
      };
    });

    series.push({
      name: 'Reference Lines',
      type: 'line',
      data: [],
      symbolSize: 0,
      itemStyle: {
        opacity: 0
      },
      markLine: {
        data: [
          ...(data.field_capacity ? [{
            yAxis: data.field_capacity,
            label: {
              position: 'start',
              formatter: `Field Capacity(${Number(data.field_capacity)})`
            }
          }] : []),
          ...(data.wilting_point ? [{
            yAxis: data.wilting_point,
            label: {
              position: 'start',
              formatter: `Wilting Point(${Number(data.wilting_point)})`
            }
          }] : []),
        ]
      }
    } as any);

    return {
      offsets: offsets,
      series: series,
    };
  }, [data, styles]);

  const handleCSVExport = () => {
    if (!chartData) {
      return;
    }
  
    try {
      const csvData: any[][] = [];
      const headers = ['Date Offset'];
  
      chartData.series.forEach((serie: any) => {
        if (serie.name !== 'Reference Lines') {
          headers.push(serie.name);
        }
      });
      csvData.push(headers);

      for (let i = 0; i < chartData.offsets.length; i++) {
        const row = [];
        row.push(chartData.offsets[i]);
        chartData.series.forEach((serie: any) => {
          if (serie.name !== 'Reference Lines') {
            const value = serie.data[i];
            row.push(value !== null && value !== undefined ? value : '');
          }
        });
        csvData.push(row);
      }
  
      const csv = Papa.unparse(csvData);
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'soil-moisture-statistical.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error('CSV export failed:', error);
    }
  };

  const option = useMemo(() => {
    if (!chartData) return {};
    console.log(chartData.offsets)

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
          
          const validParams = params.filter(param => 
            param && param.value !== null && param.value !== undefined
          );
          
          validParams.forEach((param: any) => {
            const value = typeof param.value === 'number' ? param.value : parseFloat(param.value);
            if (!isNaN(value)) {
              tooltip += `
                <div style="display: flex; align-items: center; margin: 4px 0;">
                  <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
                  <span style="margin-right: 8px;">${param.seriesName}:</span>
                  <span style="font-weight: bold;">${value.toFixed(3)}</span>
                </div>
              `;
            }
          });
          
          return tooltip;
        }
      },
      legend: {
        type: 'scroll',
        bottom: 10,
        left: 'center',
        textStyle: {
          color: styles.legend.color,
          fontSize: 10
        },
        itemWidth: 15,
        itemHeight: 10
      },
      grid: {
        top: '15%',
        bottom: '15%',
        left: '10%',
        right: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.offsets,
        axisLabel: {
          interval: 30,
          formatter: function(value: number) {
            return `${value}`;
          }
        },
        name: 'Date offset to Jan 01',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
          color: styles.axisName.color
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        axisLabel: {
          color: styles.axisLabel.color,
          formatter: function(value: number) {
            return `${value}`;
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
  }, [chartData, data, styles]);


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
          key={`years-${data.station_id}`}
        />
      </Box>
    </Box>
  );
}