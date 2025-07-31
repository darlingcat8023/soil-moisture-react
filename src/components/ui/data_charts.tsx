import React, { useMemo } from 'react';
import { Box, Typography, Alert, Chip } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material';
import { DataSets } from "@/services/response/data_response";
import { DateFilterValue } from "./filter/date_picker";

interface DataChartProps {
  data: DataSets;
  dateRange: DateFilterValue;
}

export const DataCharts: React.FC<DataChartProps> = ({
  data,
  dateRange
}) => {
  const theme = useTheme();

  // 处理图表数据
  const chartData = useMemo(() => {
    if (!data?.data_sources || data.data_sources.length === 0) {
      return null;
    }

    // 收集所有日期并排序
    const allDates = new Set<string>();
    data.data_sources.forEach(source => {
      source.data_series.forEach(series => {
        // 如果已经是日期字符串，直接使用
        const dateKey = series.date;
        allDates.add(dateKey);
      });
    });
    
    const sortedDates = Array.from(allDates).sort();

    // 为每个数据源创建系列
    const series = data.data_sources.map((source, index) => {
      // 创建日期到值的映射
      const valueMap = new Map<string, number>();
      source.data_series.forEach(series => {
        const dateKey = series.date;
        valueMap.set(dateKey, series.value);
      });

      // 为所有日期创建数据点
      const seriesData = sortedDates.map(date => {
        return valueMap.get(date) ?? null;
      });

      return {
        name: source.name,
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
        },
        symbolSize: 6,
        emphasis: {
          focus: 'series',
          lineStyle: {
            width: 4
          },
          symbolSize: 8
        },
        data: seriesData,
        connectNulls: false, // 不连接空值点
      };
    });

    return {
      dates: sortedDates,
      series: series
    };
  }, [data]);

  // ECharts 配置
  const option = useMemo(() => {
    if (!chartData) return {};

    return {
      title: {
        text: 'Environmental Data Comparison',
        left: 'center',
        textStyle: {
          color: theme.palette.text.primary,
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: theme.palette.grey[600]
          }
        },
        formatter: function(params: any[]) {
          if (!params || params.length === 0) return '';
          
          let tooltip = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
          
          params.forEach((param: any) => {
            if (param && param.value !== null && param.value !== undefined) {
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
            }
          });
          
          return tooltip;
        }
      },
      legend: {
        type: 'scroll',
        top: 10,           // 改为顶部
        left: 'center',    // 居中对齐
        textStyle: {
          color: theme.palette.text.primary
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',     // 减少底部空间
        top: '20%',        // 增加顶部空间给图例
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.dates,
        min: dateRange.startDate,  // 设置起点
        max: dateRange.endDate,    // 设置终点
        axisLabel: {
          color: theme.palette.text.secondary,
          formatter: function(value: string) {
            return new Date(value).toLocaleDateString('en-NZ', {
              month: 'short',
              day: 'numeric'
            });
          }
        },
        axisLine: {
          lineStyle: {
            color: theme.palette.divider
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: theme.palette.text.secondary,
          formatter: '{value}'
        },
        axisLine: {
          lineStyle: {
            color: theme.palette.divider
          }
        },
        splitLine: {
          lineStyle: {
            color: theme.palette.divider,
            type: 'dashed'
          }
        }
      },
      series: chartData.series,
      backgroundColor: 'transparent'
    };
  }, [chartData, theme]);

  // 生成数据源信息Chips
  const renderDataSourceInfo = () => {
    if (!data?.data_sources) return null;

    return (
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {data.data_sources.map((source, index) => (
          <Chip
            key={index}
            label={`${source.name} (${source.data_depth})`}
            size="small"
            variant="outlined"
            color="primary"
          />
        ))}
      </Box>
    );
  };

  if (!chartData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No data available for the selected criteria
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      
      {renderDataSourceInfo()}
      
      <Box sx={{ 
        height: 500, 
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
        />
      </Box>
      
    </Box>
  );
};