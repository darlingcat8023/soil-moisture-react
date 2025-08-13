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
import { DataSourceSets, ObservationStationFeature } from '@/services/response/data_response';
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
import { DataCompareRequest } from '@/services/request/data_request';
import { dataService } from '@/services/data_service';
import { DotsAnimation } from './dots';
import { ChartGuide } from './charts_guide';
import { Switcher } from './switcher';
import { DataCharts } from './charts/datasets_charts';


interface DatasetsComparatorDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedStation: ObservationStationFeature;
  stationList: ObservationStationFeature[]
}

const DatasetsComparatorDrawer: React.FC<DatasetsComparatorDrawerProps> = ({
  open,
  onClose,
  selectedStation,
  stationList,
}) => {
  
  const theme = useTheme();

  const [dateRange, setDateRange] = useState<DateFilterValue | null>(null);
  const [sources, setSources] = useState<ItemPickerValue | null>(null);
  const [stations, setStations] = useState<ItemPickerValue | null>(null)

  const [requestParam, setRequestParam] = useState<DataCompareRequest>({
    station_id: [],
    start_date: '',
    end_date: '',
    data_source: [],
  })
  
  const [data, setData] = useState<DataSourceSets | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [use3D, setUse3D] = useState<boolean>(false)

  useEffect(() => {
    setStations({
      selectedItems: [selectedStation.properties.station_id]
    })
    setRequestParam(prev => ({
      ...prev,
      station_id: [selectedStation.properties.station_id]
    }));
  }, [selectedStation]);

  const stationOptions = useMemo(() => {
    if (!stationList) return [];

    return stationList.map(station => ({
        value: station.properties.station_id,
        label: station.properties.station_name,
        description: `${station.geometry.coordinates[0]}, ${station.geometry.coordinates[1]}`
    }));
  }, [stationList]);


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
    if (value) {
      setRequestParam(prev => ({
        ...prev,
        data_source: value.selectedItems,
      }))
    }
  };

  const handleStationChange = (value: ItemPickerValue | null) => {
    setStations(value ? value : {selectedItems: [selectedStation.properties.station_id]});
    if (value) {
        setRequestParam(prev => ({
        ...prev,
        station_id: value.selectedItems
      }));
    }
  }

  const handleApply = async () => {
    try {
      setLoading(true);
      const response = await dataService.getDataBySets(requestParam);
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
              value={stations}
              onChange={handleStationChange}
              startIcon={<RoomOutlinedIcon sx={{size: 16}}/>}
              options={stationOptions}
              title="Stations"
              helpText="Add more staions to compare"
              searchPlaceholder="Search data sources..."
            />
            
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

            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Switcher
                checked={use3D} 
                onChange={(e: any) => setUse3D(e.target.checked)}
              />
              <Typography>3D</Typography>
            </Stack>

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
                    station_id: [selectedStation.properties.station_id],
                    start_date: '',
                    end_date: '',
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
            ) : data && dateRange ? (
              <DataCharts
                data={data}
                dateRange={dateRange}
                use3D={use3D}
              />
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

export default DatasetsComparatorDrawer;