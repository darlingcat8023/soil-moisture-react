import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material';
import { DateRangeSets } from "@/services/response/data_response";
import { getChartStyles } from '../style/data_chart.sytles';

interface DateRangeChartProps {
  data: DateRangeSets;
}

export const DateRangeCharts: React.FC<DateRangeChartProps> = ({
  data
}) => {
  const theme = useTheme();
  const styles = useMemo(() => getChartStyles(theme), [theme]);

  const chartData = useMemo(() => {
    if (!data?.ranges || Object.keys(data.ranges).length === 0) {
      return null;
    }

    const allRanges: any[] = [];
    const allDataSources = new Set<string>();
    let maxDayCount = 0;

    // 第一遍遍历：找到最大天数
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
        startDate: sortedDates[0] // 保存原始开始日期
      });
    });

    // 为每个范围生成标准化的日期轴（从各自开始日期延伸maxDayCount天）
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

    // 第二遍遍历：为每个范围生成标准化的日期轴和数据
    allRanges.forEach(range => {
      // 生成从开始日期延伸maxDayCount天的标准日期轴
      range.standardDates = generateStandardDateRange(range.startDate, maxDayCount);
    });

    const series: any[] = [];
    const xAxes: any[] = [];

    allRanges.forEach((range, rangeIndex) => {
      // 创建X轴 - 每个X轴使用标准化的日期范围
      xAxes.push({
        type: 'category',
        boundaryGap: false,
        data: range.standardDates, // 使用标准化的日期范围
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

      // 为当前范围的每个数据源创建系列
      Array.from(allDataSources).forEach((sourceKey, sourceIndex) => {
        const seriesInfo = range.seriesMap.get(sourceKey);
        
        if (seriesInfo && seriesInfo.valueMap && seriesInfo.dataSource) {
          // 将原始数据映射到标准化的日期轴
          const seriesData = range.standardDates.map((date: string) => {
            // 只有在原始数据范围内的日期才有值
            if (range.originalDates.includes(date)) {
              return seriesInfo.valueMap.get(date) ?? null;
            }
            return null; // 超出原始范围的日期用null填充
          });

          const unit = seriesInfo.dataSource.data_series?.[0]?.unit || '';

          series.push({
            name: `${range.rangeKey} - ${seriesInfo.dataSource.display_name}`,
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
            connectNulls: false, // 不连接null值
            unit: unit,
            rangeKey: range.rangeKey,
            sourceKey: sourceKey
          });
        }
      });
    });

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
          
          let tooltip = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
          
          // 只显示有数据的系列
          const validParams = params.filter(param => 
            param && param.value !== null && param.value !== undefined
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
      xAxis: chartData.xAxes,
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
        name: 'Value',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
          color: styles.axisName.color
        }
      },
      series: chartData.series
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
          key={`date-ranges-${data.station_id}`}
        />
      </Box>
    </Box>
  );
};