import React from 'react';
import { Box, Typography, Chip, useTheme } from '@mui/material';
import { 
  LocationOn as LocationIcon,
  DateRange as DateIcon,
  DataUsage as DataIcon,
  TrendingUp as ChartIcon 
} from '@mui/icons-material';
import {
  emptyStateContainerStyles,
  emptyStateIconStyles,
  emptyStateTitleStyles,
  emptyStateDescriptionStyles,
  progressChipsContainerStyles,
  progressStepsContainerStyles,
  stepItemContainerStyles,
  stepLabelStyles,
  configSummaryContainerStyles,
  readyStateContainerStyles
} from '../style/charts_guide.styles';

interface ChartGuideProps {
  hasDateRange: boolean;
  hasDataSources: boolean;
  selectedStation: any;
}

export const ChartGuide: React.FC<ChartGuideProps> = ({
  hasDateRange,
  hasDataSources,
  selectedStation,
}) => {
  const theme = useTheme();
  
  const steps = [
    { id: 'station', completed: !!selectedStation, label: 'Station Selected' },
    { id: 'date', completed: hasDateRange, label: 'Date Range Set' },
    { id: 'sources', completed: hasDataSources, label: 'Data Sources Chosen' }
  ];
  
  const completedSteps = steps.filter(step => step.completed).length;
  const allCompleted = completedSteps === 3;

  // 第一步：选择站点
  if (!selectedStation) {
    return (
      <Box sx={emptyStateContainerStyles}>
        <LocationIcon sx={emptyStateIconStyles(theme, 'primary')} />
        <Typography variant="h5" gutterBottom sx={emptyStateTitleStyles}>
          Select a Station
        </Typography>
        <Typography variant="body1" sx={emptyStateDescriptionStyles}>
          Choose an observation station from the map to start comparing environmental data across different sources
        </Typography>
        
        <Box sx={progressChipsContainerStyles}>
          <Chip 
            label="1" 
            variant="filled" 
            size="small" 
            color="primary"
          />
          <Chip 
            label="2" 
            variant="outlined" 
            size="small" 
            color="default" 
          />
          <Chip 
            label="3" 
            variant="outlined" 
            size="small" 
            color="default" 
          />
        </Box>
        <Typography variant="caption" color="text.disabled">
          Step 1 of 3
        </Typography>
      </Box>
    );
  }

  // 第二步和第三步：配置筛选条件
  if (!allCompleted) {
    return (
      <Box sx={emptyStateContainerStyles}>
        <DataIcon sx={emptyStateIconStyles(theme, 'warning')} />
        
        <Typography variant="h5" gutterBottom sx={emptyStateTitleStyles}>
          Configure Your Comparison
        </Typography>
        
        <Typography variant="body1" sx={emptyStateDescriptionStyles}>
          {!hasDateRange 
            ? "Select a date range to specify the time period for data comparison"
            : "Choose data sources to compare against the observation station data"
          }
        </Typography>

        <Box sx={progressStepsContainerStyles}>
          {steps.map((step, index) => {
            const stepStatus = step.completed 
              ? 'completed' 
              : index === completedSteps 
              ? 'current' 
              : 'pending';
            
            return (
              <Box key={step.id} sx={stepItemContainerStyles}>
                <Chip 
                  label={index + 1} 
                  size="small"
                  // 修改这里：已完成的使用 primary 而不是 success
                  color={step.completed ? "primary" : index === completedSteps ? "warning" : "default"}
                  variant={step.completed ? "filled" : "outlined"}
                />
                <Typography 
                  variant="caption" 
                  sx={stepLabelStyles(theme, stepStatus)}
                >
                  {step.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
        
        <Typography variant="caption" color="text.disabled">
          Step {completedSteps + 1} of 3
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={readyStateContainerStyles}>
      <ChartIcon sx={emptyStateIconStyles(theme, 'success')} />
      
      <Typography variant="h5" gutterBottom sx={emptyStateTitleStyles}>
        Ready to Compare Data
      </Typography>
      
      <Typography variant="body1" sx={emptyStateDescriptionStyles}>
        All filters are configured. Generate your comparison chart by clicking Apply button.
      </Typography>

      <Box sx={configSummaryContainerStyles}>
        <Chip 
          label={selectedStation?.properties?.name || 'Station'} 
          size="small" 
          color="primary" 
        />
        {/* 修改这里：使用 primary 而不是 success */}
        <Chip label="Date Range Set" size="small" color="primary" />
        <Chip label="Sources Selected" size="small" color="primary" />
      </Box>
      
      <Typography variant="caption" color="primary.main">
        ✓ All requirements met
      </Typography>
    </Box>
  );
};