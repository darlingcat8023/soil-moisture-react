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
import { DataSets, ObservationStationFeature } from '@/services/response/data_response';
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
import { DataCompareRequest } from '@/services/request/data_request';
import { dataService } from '@/services/data_service';
import { DotsAnimation } from './dots';
import { ChartGuide } from './charts_guide';


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
  const [data, setData] = useState<DataSets | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleApply = async () => {
    try {
      setLoading(true);
      const response = await dataService.getObservationData(requestParam);
      setData(response);
      console.log(response);
    } finally {
      setLoading(false);
    }
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

        <Paper elevation={0} sx={filterSectionStyles(theme)}>
          <Box sx={filterControlsStyles}>

            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
            
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
                  description: 'baseline data from NIWA'
                },
                {
                  value: 'smap',
                  label: 'SMAP',
                  description: 'satellite data from NASA'
                },
                {
                  value: 'era5',
                  label: 'ERA5-Land',
                  description: 'reanalysis data from ECMWF'
                },
                {
                  value: 'esa',
                  label: 'ESA CCI SM',
                  description: 'mixed data from ESA'
                },
              ]}
              title="Data Sources"
              helpText="Select data sources you are interested in"
              searchPlaceholder="Search data sources..."
            />

            <Box sx={getButtonGroupStyles()}>
              <Button
                variant="text"
                onClick={handleApply}
                sx={getActionButtonStyles('apply', theme)}
                disabled={loading}
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
            {loading ? (
              <DotsAnimation size="medium" />
            ) : data ? (
              <h2>loaded</h2>
            ) : (
              <ChartGuide
                hasDateRange={!!dateRange}
                hasDataSources={!!sources}
                selectedStation={selectedStation}
              />
            )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default DataComparatorDrawer;