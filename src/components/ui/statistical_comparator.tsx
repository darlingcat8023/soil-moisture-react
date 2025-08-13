import { ObservationStationFeature, StationStatisticalInfo } from "@/services/response/data_response";
import { Box, Button, Drawer, IconButton, Paper, useTheme } from "@mui/material";
import { chartContainerStyles, drawerContainerStyles, drawerPaperStyles, filterControlsStyles, filterSectionStyles } from "../style/data_comparator.styles";
import CloseIcon from '@mui/icons-material/Close';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import GoogleCloudItemPicker, { ItemOption, ItemPickerValue } from "./filter/item_picker";
import { useEffect, useMemo, useState } from "react";
import { getActionButtonStyles, getButtonGroupStyles } from "../style/action_button.styles";
import { ObservationStatisticalRequest } from "@/services/request/data_request";
import { DotsAnimation } from "./dots";
import { dataService } from "@/services/data_service";
import { StatisticalCharts } from "./charts/statistical_charts";

interface StatisticalComparatorDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedStation: ObservationStationFeature;
}

const StatisticalComparatorDrawer: React.FC<StatisticalComparatorDrawerProps> = ({
  open,
  onClose,
  selectedStation,
}) => {

  const theme = useTheme();

  const [years, setYears] = useState<ItemPickerValue | null>(null);

  const [requestParam, setRequestParam] = useState<ObservationStatisticalRequest>({
    station_id: '',
    years: []
  })

  useEffect(() => {
    setYears(null);
    setData(null);
    setRequestParam(prev => ({
      ...prev,
      station_id: selectedStation.properties.station_id,
      years: []
    }))
  }, [selectedStation])

  const [loading, setLoading] = useState<boolean>(false); 

  const [data, setData] = useState<StationStatisticalInfo | null>(null);

  const handleYearsChange = (value: ItemPickerValue | null) => {
    setYears(value);
    if (value) {
      setRequestParam(prev => ({
        ...prev,
        years: value.selectedItems
      }))
    } else {
      setRequestParam(prev => ({
        ...prev,
        years: []
      }))
    }
  };

  const yearOptions = useMemo(() => {
    const startYear = new Date(selectedStation.properties.record_start_date).getFullYear();
    const endYear = selectedStation.properties.record_end_date ? new Date(selectedStation.properties.record_end_date).getFullYear() : new Date().getFullYear(); 
    
    return Array.from(
      { length: endYear - startYear + 1 }, 
      (_, i) => {
        const year = startYear + i;
        return {
          value: year.toString(),
          label: year.toString(),
          description: '',
        };
      }
    );
  }, [selectedStation]);

  const handleApply = async () => {
    try {
      setLoading(true);
      const response = await dataService.getStatisticalData(requestParam);
      setData(response);
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
            
            <GoogleCloudItemPicker
              value={years}
              onChange={handleYearsChange}
              options={yearOptions}
              title="Years"
              helpText="Response latency scales linearly with year count"
              searchPlaceholder="Search years..."
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
                  setYears(null);
                  setRequestParam(prev => ({
                    ...prev,
                    station_id: selectedStation.properties.station_id,
                    years: []
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
            <StatisticalCharts
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

}

export default StatisticalComparatorDrawer;