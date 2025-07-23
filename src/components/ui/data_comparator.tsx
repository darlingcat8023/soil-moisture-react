import React, { useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactECharts from 'echarts-for-react';
import { ObservationStationFeature } from '@/services/data_service';
import {
  drawerPaperStyles,
  drawerContainerStyles,
  headerStyles,
  filterSectionStyles,
  filterControlsStyles,
  dateFieldStyles,
  buttonStyles,
  chartContainerStyles,
  chartStyles
} from '../style/data_comparator.styles';

interface DataComparatorDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedStation: ObservationStationFeature | null;
}

const DataComparatorDrawer: React.FC<DataComparatorDrawerProps> = ({
  open,
  onClose,
  selectedStation
}) => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // 生成365天的日期数组
  const generateDates = () => {
    const dates = [];
    const startDate = new Date(2024, 0, 1); // 2024年1月1日
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return dates;
  };

  // 生成模拟数据（200-300范围内）
  const generateData = (baseValue: number, variance: number, trend: number = 0) => {
    const data = [];
    for (let i = 0; i < 365; i++) {
      // 添加季节性变化
      const seasonalEffect = Math.sin((i / 365) * 2 * Math.PI) * 15;
      // 添加趋势
      const trendEffect = (i / 365) * trend;
      // 添加随机噪声
      const noise = (Math.random() - 0.5) * variance;
      
      let value = baseValue + seasonalEffect + trendEffect + noise;
      // 确保值在200-300范围内
      value = Math.max(200, Math.min(300, value));
      data.push(Math.round(value * 10) / 10); // 保留一位小数
    }
    return data;
  };

  // 数据源配置
  const dataSources = {
    'SAMP (10m)': { depth: 10, color: '#5470c6', lineType: 'solid', data: generateData(250, 20, 5) },
    'ESA (10m)': { depth: 10, color: '#73c0de', lineType: 'solid', data: generateData(245, 22, 8) },
    'Observation (20m)': { depth: 20, color: '#91cc75', lineType: 'solid', data: generateData(240, 25, -3) },
    'ERA5 (40m)': { depth: 40, color: '#fac858', lineType: 'solid', data: generateData(260, 30, 2) }
  };

  const getChartOption = () => ({
    title: {
      text: `Multi-Depth Station Data: ${selectedStation?.properties?.station_name || 'Unknown'}`,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function(params: any) {
        let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
        
        const depthGroups: { [key: number]: any[] } = {};
        params.forEach((param: any) => {
          const depth = dataSources[param.seriesName as keyof typeof dataSources].depth;
          if (!depthGroups[depth]) depthGroups[depth] = [];
          depthGroups[depth].push(param);
        });

        Object.keys(depthGroups).sort((a, b) => Number(a) - Number(b)).forEach(depth => {
          result += `<div style="margin: 6px 0; padding: 4px; background-color: #f5f5f5; border-radius: 4px;">`;
          result += `<div style="font-weight: bold; color: #666; font-size: 12px;">Depth ${depth}m:</div>`;
          depthGroups[Number(depth)].forEach((param: any) => {
            const seriesName = param.seriesName.split(' (')[0]; 
            result += `
              <div style="display: flex; align-items: center; margin: 2px 0; padding-left: 8px;">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; margin-right: 8px;"></span>
                <span style="min-width: 80px;">${seriesName}:</span>
                <span style="font-weight: bold;">${param.value}</span>
              </div>
            `;
          });
          result += `</div>`;
        });
        
        return result;
      }
    },
    legend: {
      data: Object.keys(dataSources),
      top: 30,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '80px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: generateDates()
    },
    yAxis: {
      type: 'value',
      min: 200,
      max: 300,
      interval: 20,
      axisLabel: {
        formatter: '{value}'
      },
      name: 'Value',
      nameLocation: 'middle',
      nameGap: 40
    },
    series: Object.entries(dataSources).map(([name, config]) => ({
      name,
      type: 'line',
      smooth: true,
      lineStyle: {
        width: 1,
      },
      emphasis: {
        focus: 'series',
      },
      data: config.data
    }))
  });

  const handleLoad = () => {
    console.log('Load data for period:', startDate, 'to', endDate);
    // TODO: 实现数据加载逻辑
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    console.log('Reset filters');
    // TODO: 实现重置逻辑
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: drawerPaperStyles
      }}
      SlideProps={{
        direction: 'up'
      }}
    >
      <Box sx={drawerContainerStyles}>
        {/* Header */}
        <Box sx={headerStyles(theme)}>
          <Typography variant="h6" component="h2">
            Data Comparator
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Filter Section */}
        <Paper elevation={0} sx={filterSectionStyles(theme)}>
          <Box sx={filterControlsStyles}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
              sx={dateFieldStyles}
            />
            
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
              sx={dateFieldStyles}
            />
            
            <Button
              variant="contained"
              onClick={handleLoad}
              size="small"
              sx={buttonStyles}
            >
              Load
            </Button>
            
            <Button
              variant="outlined"
              onClick={handleReset}
              size="small"
              sx={buttonStyles}
            >
              Reset
            </Button>
          </Box>
        </Paper>

        {/* Chart Section */}
        <Box sx={chartContainerStyles}>
          <ReactECharts
            option={getChartOption()}
            style={chartStyles}
            opts={{ renderer: 'canvas' }}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default DataComparatorDrawer;