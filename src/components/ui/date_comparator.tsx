import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import { DateRangeSets, ObservationStationFeature } from '@/services/response/data_response';
import {
  drawerPaperStyles,
  drawerContainerStyles,
  filterSectionStyles,
  filterControlsStyles,
  chartContainerStyles,
} from '../style/data_comparator.styles';
import GoogleCloudDateFilter, { DateFilterValue } from './filter/date_picker';
import { getActionButtonStyles, getButtonGroupStyles } from '../style/action_button.styles';
import GoogleCloudItemPicker, { ItemPickerValue } from './filter/item_picker';
import { DateRange, DateRangeRequest } from '@/services/request/data_request';
import { dataService } from '@/services/data_service';
import { DotsAnimation } from './dots';
import { DateRangeCharts } from './date_range_charts';


interface DateRangeComparatorDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedStation: ObservationStationFeature;
}

const DateRangeComparatorDrawer: React.FC<DateRangeComparatorDrawerProps> = ({
  open,
  onClose,
  selectedStation,
}) => {
  
  const theme = useTheme();

  const [dateRange1, setDateRange1] = useState<DateFilterValue | null>(null);
	const [dateRange2, setDateRange2] = useState<DateFilterValue | null>(null);
  const [sources, setSources] = useState<ItemPickerValue | null>(null);

  const [requestParam, setRequestParam] = useState<DateRangeRequest>({
    station_id: '',
    first_range: {} as DateRange,
    second_range: {} as DateRange,
    data_source: [],
  })
  
  const [data, setData] = useState<DateRangeSets | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setRequestParam(prev => ({
      ...prev,
      station_id: selectedStation.properties.station_id
    }));
  }, [selectedStation]);


  const handleDateRangeChange1 = (value: DateFilterValue | null) => {
    setDateRange1(value);
    if (value) {
      setRequestParam(prev => ({
        ...prev,
        first_range: {
					start_date: value.startDate,
					end_date: value.endDate,
				}
      }));
    } else {
      setRequestParam(prev => ({
        ...prev,
        first_range: {} as DateRange,
      }));
    }
  };

	const handleDateRangeChange2 = (value: DateFilterValue | null) => {
    setDateRange2(value);
    if (value) {
      setRequestParam(prev => ({
        ...prev,
        second_range: {
					start_date: value.startDate,
					end_date: value.endDate,
				}
      }));
    } else {
      setRequestParam(prev => ({
        ...prev,
        second_range: {} as DateRange,
      }));
    }
  };

  const handleDataSourcesChange = (value: ItemPickerValue | null) => {
    setSources(value);
    if (value) {
      setRequestParam(prev => ({
        ...prev,
        data_source: value.selectedItems,
      }))
    }
  };

  const handleApply = async () => {
    try {
      setLoading(true);
      const response = await dataService.getDataByRange(requestParam);
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

            <GoogleCloudItemPicker
              value={{
								selectedItems: [selectedStation.properties.station_id]
							}}
              onChange={() => {}}
              startIcon={<RoomOutlinedIcon sx={{size: 16}}/>}
              options={[
								{
									value: selectedStation.properties.station_id,
									label: selectedStation.properties.station_name,
								}
							]}
              title="Stations" 
							disabled={true}
            />
            
            <GoogleCloudDateFilter
              title="Date Range 1"
              value={dateRange1}
              onChange={handleDateRangeChange1}
              disabled={!selectedStation}
              helpText='The maximun range is 1 year'
            />

						<GoogleCloudDateFilter
              title="Date Range 2"
              value={dateRange2}
              onChange={handleDateRangeChange2}
              disabled={!selectedStation}
              helpText='The maximun range is 1 year'
            />

            <GoogleCloudItemPicker
              value={sources}
              onChange={handleDataSourcesChange}
              options={[
                {
                  value: 'observation',
                  label: 'Observation Station',
                  description: 'Observation data from NIWA'
                },
                {
                  value: 'era5_7',
                  label: 'ERA5-Land(0-7cm)',
                  description: 'ECMWF surface model Layer 1: (0-7cm)'
                },
                {
                  value: 'era5_28',
                  label: 'ERA5-Land(7-28cm)',
                  description: 'ECMWF surface model Layer 2: (7-28cm)'
                },
                {
                  value: 'era5_100',
                  label: 'ERA5-Land(28-100cm)',
                  description: 'ECMWF surface model Layer 3: (28-100cm)'
                }, 
                {
                  value: 'era5_289',
                  label: 'ERA5-Land(100-289cm)',
                  description: 'ECMWF surface model Layer 4: (100-289cm)'
                },
              ]}
              title="Data Sources"
              helpText="Response latency scales linearly with data source count"
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
                  setDateRange1(null);
									setDateRange2(null);
                  setSources(null);
                  setRequestParam(prev => ({
                    ...prev,
                    station_id: selectedStation.properties.station_id,
                    first_range: {} as DateRange,
                    second_range: {} as DateRange,
                    data_source: []
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
						<DateRangeCharts
							data={data}
						/>
					) : (
						<>
						</>
					)}
        </Box>
      </Box>
    </Drawer>
  );
};

export default DateRangeComparatorDrawer;