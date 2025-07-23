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
import 'echarts-gl'; 

interface SpatialDataComparatorDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedStation: ObservationStationFeature | null;
}

const SpatialDataComparatorDrawer: React.FC<SpatialDataComparatorDrawerProps> = ({
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
      dates.push(i); // 使用数字索引而不是日期字符串，便于3D显示
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

  // 转换数据为3D格式 [时间索引, 数值, 深度]
  const generate3DData = (data: number[], depth: number) => {
    return data.map((value, index) => [index, value, depth]);
  };

  // 数据源配置
  const dataSources = {
    'SAMP': { depth: 10, color: '#5470c6', data: generateData(250, 20, 5) },
    'ESA': { depth: 10, color: '#73c0de', data: generateData(245, 22, 8) },
    'Observation': { depth: 20, color: '#91cc75', data: generateData(240, 25, -3) },
    'ERA5': { depth: 40, color: '#fac858', data: generateData(260, 30, 2) }
  };

  const getChartOption = () => ({
    title: {
      text: `3D Multi-Depth Station Data: ${selectedStation?.properties?.station_name || 'Unknown'}`,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      formatter: function(params: any) {
        const date = new Date(2024, 0, 1);
        date.setDate(date.getDate() + params.data[0]);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return `
          <div style="font-weight: bold;">${params.seriesName}</div>
          <div>Date: ${dateStr}</div>
          <div>Value: ${params.data[1]}</div>
          <div>Depth: ${params.data[2]}m</div>
        `;
      }
    },
    legend: {
      data: Object.keys(dataSources),
      top: 30,
      textStyle: {
        fontSize: 12
      }
    },
    grid3D: {
      boxWidth: 200,
      boxHeight: 100,
      boxDepth: 80,
      viewControl: {
        projection: 'perspective',
        autoRotate: false,
        distance: 200,
        alpha: 20,
        beta: 40
      },
      light: {
        main: {
          intensity: 1.2,
          shadow: true
        },
        ambient: {
          intensity: 0.3
        }
      }
    },
    xAxis3D: {
      type: 'value',
      name: 'Time (Days)',
      min: 0,
      max: 364,
      interval: 30,
      axisLabel: {
        formatter: function(value: number) {
          const date = new Date(2024, 0, 1);
          date.setDate(date.getDate() + value);
          return date.toLocaleDateString('en-US', { month: 'short' });
        }
      }
    },
    yAxis3D: {
      type: 'value',
      name: 'Value',
      min: 200,
      max: 300,
      interval: 25
    },
    zAxis3D: {
      type: 'value',
      name: 'Depth (m)',
      min: 0,
      max: 50,
      interval: 10,
      data: [10, 20, 40]
    },
    series: Object.entries(dataSources).map(([name, config]) => ({
      name,
      type: 'line3D',
      data: generate3DData(config.data, config.depth),
      lineStyle: {
        width: 4,
        color: config.color
      },
      itemStyle: {
        color: config.color
      },
      emphasis: {
        lineStyle: {
          width: 6
        }
      }
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

export default SpatialDataComparatorDrawer;