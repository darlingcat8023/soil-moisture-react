import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactECharts from 'echarts-for-react';
import { DataCompareRequest, ObservationStationFeature } from '@/services/data_service';
import {
  drawerPaperStyles,
  drawerContainerStyles,
  headerStyles,
  filterSectionStyles,
  filterControlsStyles,
  chartContainerStyles,
} from '../style/data_comparator.styles';
import GoogleCloudDateFilter, { DateFilterValue } from './filter/date_picker';
import { getActionButtonStyles, getButtonGroupStyles } from '../style/action_button.styles';
import GoogleCloudItemPicker, { ItemPickerValue } from './filter/item_picker';


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
  
  const [requestParam, setRequestParam] = useState<DataCompareRequest>({
    station_id: selectedStation?.properties.station_id || '',
    start_date: '',
    end_date: ''
  })

  const [dateRange, setDateRange] = useState<DateFilterValue | null>(null);
  const [sources, setSources] = useState<ItemPickerValue | null>(null);

  useEffect(() => {
    setRequestParam(prev => ({
      ...prev,
      station_id: selectedStation?.properties?.station_id || ''
    }));
  }, [selectedStation]);

  const handleDateRangeChange = (value: DateFilterValue | null) => {
    setDateRange(value);
    if (value) {
      setRequestParam(prev => ({
        ...prev,
        start_date: value.startDate,
        end_date: value.endDate
      }));
    } else {
      setRequestParam(prev => ({
        ...prev,
        start_date: '',
        end_date: ''
      }));
    }
  };

  const handleDataSourcesChange = (value: ItemPickerValue | null) => {
    setSources(value);
    
  };

  const handleLoad = () => {
    console.log('Load data for period:', requestParam.start_date, 'to', requestParam.end_date, ', station id: ', requestParam.station_id);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: drawerPaperStyles
        }
      }}
    >
      <Box sx={drawerContainerStyles}>
        {/* Header */}
        <Box sx={headerStyles(theme)}>
          <Typography variant="h6" component="h2">
            Data Comparator Filter
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Paper elevation={0} sx={filterSectionStyles(theme)}>
          <Box sx={filterControlsStyles}>
            
            <GoogleCloudDateFilter
              title="Date Range"
              value={dateRange}
              onChange={handleDateRangeChange}
              disabled={!selectedStation}
              helpText='The maximun range is 1 year'
            />

            <GoogleCloudItemPicker
              value={sources}
              onChange={handleDataSourcesChange}
              options={[
                {
                  value: 'obervation',
                  label: 'Observation Station',
                  description: ''
                },
                {
                  value: 'smap',
                  label: 'SMAP',
                  description: ''
                },
                {
                  value: 'era5',
                  label: 'ERA5-Land',
                  description: ''
                },
                {
                  value: 'esa',
                  label: 'ESA CCI SM',
                  description: ''
                },
              ]}
              title="Data Sources"
              helpText="Select data sources you are interested in"
              searchPlaceholder="Search data sources..."
            />

            <Box sx={getButtonGroupStyles()}>
              <Button
                variant="text"
                onClick={handleLoad}
                sx={getActionButtonStyles('apply', theme)}
              >
                Apply
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  setDateRange(null)
                  setSources(null)
                  setRequestParam(prev => ({
                    ...prev,
                    start_date: '',
                    end_date: ''
                  }));
                }}
                sx={getActionButtonStyles('clear', theme)}
              >
                Reset
              </Button>
            </Box>
            
          </Box>
        </Paper>

        {/* Chart Section */}
        <Box sx={chartContainerStyles}>

        </Box>
      </Box>
    </Drawer>
  );
};

export default DataComparatorDrawer;