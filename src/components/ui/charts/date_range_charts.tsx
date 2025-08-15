import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material';
import { DateRangeSets } from "@/services/response/data_response";
import { getChartStyles } from '../../style/data_chart.sytles';
import Papa from 'papaparse';

interface DateRangeChartProps {
  data: DateRangeSets;
}

export const DateRangeCharts: React.FC<DateRangeChartProps> = ({
  data
}) => {
  const theme = useTheme();
  const styles = useMemo(() => getChartStyles(theme), [theme]);

  const handleCSVExport = () => {
    if (!chartData) {
      return;
    }

    try {
      const csvData: any[][] = [];
      
      const headers = ['Date'];

      chartData.dataSources.forEach((sourceKey: string) => {
        
        let unit = '';
        for (const range of chartData.ranges) {
          const seriesInfo = range.seriesMap.get(sourceKey);
          if (seriesInfo && seriesInfo.dataSource) {
            unit = seriesInfo.dataSource.data_series?.[0]?.unit || '';
            break;
          }
        }
        const columnHeader = `${sourceKey}${unit ? ` (${unit})` : ''}`;
        headers.push(columnHeader);
      });
      
      csvData.push(headers);
      
      
      chartData.ranges.forEach((range: any) => {
        
        range.originalDates.forEach((date: string) => {
          const row = [new Date(date).toLocaleDateString('en-NZ')];
          
          
          chartData.dataSources.forEach((sourceKey: string) => {
            const seriesInfo = range.seriesMap.get(sourceKey);
            if (seriesInfo && seriesInfo.dataSource) {
              const value = seriesInfo.valueMap.get(date);
              row.push(value !== null && value !== undefined ? Number(value).toFixed(3) : '');
            } else {
              row.push('');
            }
          });
          
          csvData.push(row);
        });
      });

      const csv = Papa.unparse(csvData);
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'soil-moisture-data-by-range.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('CSV export failed:', error);
    }
  }

  const chartData = useMemo(() => {
    if (!data?.ranges || Object.keys(data.ranges).length === 0) {
      return null;
    }

    const allRanges: any[] = [];
    const allDataSources = new Set<string>();
    let maxDayCount = 0;

    Object.entries(data.ranges).forEach(([rangeKey, rangeData]) => {
      const rangeDates = new Set<string>();
      const rangeSeriesMap = new Map<string, any>();

      Object.entries(rangeData.data_sources).forEach(([sourceKey, dataSource]) => {
        allDataSources.add(sourceKey);

        dataSource.data_series.forEach(series => {
          rangeDates.add(series.date);
        });

        const valueMap = new Map<string, number>();
        dataSource.data_series.forEach(series => {
          valueMap.set(series.date, Number(series.value));
        });

        rangeSeriesMap.set(sourceKey, {
          dataSource,
          valueMap
        });
      });

      const sortedDates = Array.from(rangeDates).sort();
      maxDayCount = Math.max(maxDayCount, sortedDates.length);

      allRanges.push({
        rangeKey,
        dateRange: rangeData.date_range,
        originalDates: sortedDates,
        seriesMap: rangeSeriesMap,
        startDate: sortedDates[0] 
      });
    });

    const generateStandardDateRange = (startDate: string, dayCount: number): string[] => {
      const start = new Date(startDate);
      const dates: string[] = [];
      
      for (let i = 0; i < dayCount; i++) {
        const current = new Date(start);
        current.setDate(start.getDate() + i);
        dates.push(current.toISOString().split('T')[0]);
      }
      
      return dates;
    };

    allRanges.forEach(range => {
      range.standardDates = generateStandardDateRange(range.startDate, maxDayCount);
    });

    const series: any[] = [];
    const xAxes: any[] = [];

    allRanges.forEach((range, rangeIndex) => {
      xAxes.push({
        type: 'category',
        boundaryGap: false,
        data: range.standardDates,
        gridIndex: 0,
        position: rangeIndex === 0 ? 'bottom' : 'top',
        offset: rangeIndex * 40,
        axisLabel: {
          color: styles.axisLabel.color,
          formatter: function(value: string) {
            return new Date(value).toLocaleDateString('en-NZ', {
              month: 'short',
              day: 'numeric'
            });
          }
        }
      });

      Array.from(allDataSources).forEach((sourceKey, sourceIndex) => {
        const seriesInfo = range.seriesMap.get(sourceKey);
        
        if (seriesInfo && seriesInfo.valueMap && seriesInfo.dataSource) {
          const seriesData = range.standardDates.map((date: string) => {
            if (range.originalDates.includes(date)) {
              return seriesInfo.valueMap.get(date) ?? null;
            }
            return null;
          });

          const unit = seriesInfo.dataSource.data_series?.[0]?.unit || '';

          series.push({
            name: seriesInfo.dataSource.display_name,
            type: 'line',
            xAxisIndex: rangeIndex,
            yAxisIndex: 0,
            lineStyle: {
              width: styles.line2D.width,
            },
            symbolSize: 0,
            emphasis: {
              focus: 'series',
              lineStyle: {
                width: styles.line2D.emphasis.width
              },
              symbolSize: 4,
            },
            data: seriesData,
            connectNulls: false, 
            unit: unit,
            rangeKey: range.rangeKey,
            sourceKey: sourceKey
          });
        }
      });
    });

    if ((data.field_capacity || data.wilting_point)) {
      series.push({
        name: 'Reference Line',
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
                formatter: `Field Capacity: ${Number(data.field_capacity)}`,
              }
            }] : []),
            ...(data.wilting_point ? [{
              yAxis: data.wilting_point,
              label: {
                position: 'start',
                formatter: `Wilting Point: ${Number(data.wilting_point)}`,
              }
            }] : [])
          ]
        }
      } as any);
    }

    return {
      ranges: allRanges,
      series: series,
      xAxes: xAxes,
      maxDayCount: maxDayCount,
      dataSources: Array.from(allDataSources)
    };
  }, [data, styles]);

  const option = useMemo(() => {
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
          
          let tooltip = ``;
          
          const validParams = params.filter(param => 
            param && 
            param.value !== null && 
            param.value !== undefined &&
            param.seriesName !== 'Reference Line'
          );
          
          validParams.forEach((param: any) => {
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
          });
          
          return tooltip;
        }
      },
      legend: styles.legend,
      grid: styles.grid,
      xAxis: chartData.xAxes,
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

  if (!chartData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No data available for date range comparison
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Station: {data?.station_name || 'Unknown'} (ID: {data?.station_id || 'Unknown'})
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ 
        height: 700,
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
          key={`date-ranges-${data.station_id}`}
        />
      </Box>
    </Box>
  );
};