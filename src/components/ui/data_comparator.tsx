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
import { getPillButtonStyles } from '../style/pill_button.styles';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined';


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

  useEffect(() => {
    setRequestParam(prev => ({
      ...prev,
      station_id: selectedStation?.properties?.station_id || ''
    }));
  }, [selectedStation]);

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
            Data Comparator
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Paper elevation={0} sx={filterSectionStyles(theme)}>
          <Box sx={filterControlsStyles}>
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker 
                label="Start Date"
                value={requestParam.start_date ? dayjs(requestParam.start_date) : null}
                onChange={(newValue) => {
                    setRequestParam(prev => ({
                      ...prev,
                      start_date: newValue?.format('YYYY-MM-DD') || '',
                    }))
                }}
              />
              <DatePicker 
                label="End Date" 
                maxDate={dayjs()}
                value={requestParam.end_date ? dayjs(requestParam.end_date) : null}
                onChange={(newValue) => {
                    setRequestParam(prev => ({
                      ...prev,
                      end_date: newValue?.format('YYYY-MM-DD') || '',
                    }))
                }}
              />
            </LocalizationProvider>
            
            <Button
              onClick={handleLoad}
              startIcon={<SyncOutlinedIcon />}
              sx={getPillButtonStyles('primary', 'small')}
            >
              Fetch
            </Button>
            
            <Button
              onClick={() => {
                setRequestParam(prev => ({
                  ...prev,
                  start_date: '',
                  end_date: ''
                }));
              }}
              startIcon={<RotateLeftOutlinedIcon />}
              sx={getPillButtonStyles('outlined', 'small')}
            >
              Reset
            </Button>
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