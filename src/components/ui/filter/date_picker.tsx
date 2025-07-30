import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Chip,
  IconButton,
  Stack,
  Divider,
  Popover,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  HelpOutline,
  Check,
} from '@mui/icons-material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import BaseFilterButton from '../base_filter_button';
import {
  getPopoverStyles,
  getPopoverHeaderStyles,
  getHeaderContainerStyles,
  getTitleStyles,
  getHelpButtonStyles,
  getHelpIconStyles,
  getContentAreaStyles,
  getContentLayoutStyles,
  getDateSectionStyles,
  getDateInputStyles,
  getPresetSectionStyles,
  getPresetStackStyles,
  getChipStyles,
  getChipIconStyles,
  getFooterStyles,
} from '@/components/style/filter/date_picker.styles';
import { getActionButtonStyles, getButtonGroupStyles } from '@/components/style/action_button.styles';

export interface DateFilterValue {
  startDate: string;
  endDate: string;
  preset: string;
}

interface GoogleCloudDateFilterProps {
  /** Callback function when date range is applied */
  onChange?: (value: DateFilterValue | null) => void;
  /** Initial value */
  value?: DateFilterValue | null;
  /** Custom title for the filter */
  title?: string;
  /** Disabled state */
  disabled?: boolean;
  helpText?: string;
}

const GoogleCloudDateFilter: React.FC<GoogleCloudDateFilterProps> = ({
  onChange,
  value,
  title = "Time Range",
  helpText = "",
  disabled = false
}) => {

  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(value?.preset || '');
  const [fromDate, setFromDate] = useState(value?.startDate || '');
  const [toDate, setToDate] = useState(value?.endDate || '');
  
  const [appliedPreset, setAppliedPreset] = useState(value?.preset || '');
  const [appliedFromDate, setAppliedFromDate] = useState(value?.startDate || '');
  const [appliedToDate, setAppliedToDate] = useState(value?.endDate || '');
  
  const [hasBeenUsed, setHasBeenUsed] = useState(!!value);

  useEffect(() => {
    if (value) {
      setSelectedPreset(value.preset);
      setFromDate(value.startDate);
      setToDate(value.endDate);
      setAppliedPreset(value.preset);
      setAppliedFromDate(value.startDate);
      setAppliedToDate(value.endDate);
      setHasBeenUsed(true);
    } else {
      setSelectedPreset('');
      setFromDate('');
      setToDate('');
      setAppliedPreset('');
      setAppliedFromDate('');
      setAppliedToDate('');
      setHasBeenUsed(false);
    }
  }, [value]);

  const open = Boolean(anchorEl);

  const presetOptions = [
    { value: 'custom-range', label: 'Custom range' },
    { value: 'last-30-days', label: 'Last 30 days' },
    { value: 'last-90-days', label: 'Last 90 days' },
    { value: 'last-180-days', label: 'Last 180 days' },
    { value: 'last-1-year', label: 'Last 1 year' },
    { value: 'year-to-date', label: 'Year to date' },
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePresetClick = (value: string) => {
    setSelectedPreset(value);
    
    const today = dayjs();
    switch (value) {
      case 'last-30-days':
        setFromDate(today.subtract(30, 'day').format('YYYY-MM-DD'));
        setToDate(today.format('YYYY-MM-DD'));
        break;
      case 'last-90-days':
        setFromDate(today.subtract(90, 'day').format('YYYY-MM-DD'));
        setToDate(today.format('YYYY-MM-DD'));
        break;
      case 'last-180-days':
        setFromDate(today.subtract(180, 'day').format('YYYY-MM-DD'));
        setToDate(today.format('YYYY-MM-DD'));
        break;
      case 'last-1-year':
        setFromDate(today.subtract(365, 'day').format('YYYY-MM-DD'));
        setToDate(today.format('YYYY-MM-DD'));
        break;
      case 'year-to-date':
        setFromDate(today.startOf('year').format('YYYY-MM-DD'));
        setToDate(today.format('YYYY-MM-DD'));
        break;
      case 'custom-range':
        // Don't change dates when selecting custom range
        break;
    }
  };

  const formatDisplayDate = (date: string) => {
    return dayjs(date).format('M/D/YY');
  };

  const hasChanges = () => {
    return selectedPreset !== appliedPreset || 
           fromDate !== appliedFromDate || 
           toDate !== appliedToDate;
  };

  const getDisplayText = () => {
    if (!appliedPreset) {
      return 'Select date range';
    }
    if (appliedPreset === 'custom-range') {
      return `${formatDisplayDate(appliedFromDate)} - ${formatDisplayDate(appliedToDate)}`;
    }
    return presetOptions.find(opt => opt.value === appliedPreset)?.label || 'Custom range';
  };

  const handleApply = () => {
    if (hasChanges()) {
      setAppliedPreset(selectedPreset);
      setAppliedFromDate(fromDate);
      setAppliedToDate(toDate);
      setHasBeenUsed(true);
      
      // Call onChange callback with the new value
      onChange?.({
        startDate: fromDate,
        endDate: toDate,
        preset: selectedPreset
      });
    }
    handleClose();
  };

  const handleClear = () => {
    setSelectedPreset('');
    setFromDate('');
    setToDate('');
    setAppliedPreset('');
    setAppliedFromDate('');
    setAppliedToDate('');
    setHasBeenUsed(false);
    onChange?.(null);
    
  };

  const handleCancel = () => {
    setSelectedPreset(appliedPreset);
    setFromDate(appliedFromDate);
    setToDate(appliedToDate);
    handleClose();
  };

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    if (field === 'from') {
      setFromDate(value);
    } else {
      setToDate(value);
    }
    setSelectedPreset('custom-range');
  };

  const buttonDisplayText = hasBeenUsed 
    ? `${title}: ${getDisplayText()}` 
    : `${title}: Select date range`;

  return (
    <Box>
      <BaseFilterButton
        displayText={buttonDisplayText}
        startIcon={<CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />}
        hasBeenUsed={hasBeenUsed}
        hasChanges={hasChanges()}
        onClick={handleClick}
        disabled={disabled}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: getPopoverStyles(theme)
        }}
      >
        {/* Header */}
        <Box sx={getPopoverHeaderStyles()}>
          <Box sx={getHeaderContainerStyles()}>
            <Typography variant="h6" sx={getTitleStyles(theme)}>
              {title}
            </Typography>
            <Tooltip 
              title={helpText}
              placement="top"
              arrow
            >
              <IconButton size="small" sx={getHelpButtonStyles(theme)}>
                <HelpOutline sx={getHelpIconStyles()} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Content area */}
        <Box sx={getContentAreaStyles()}>
          <Box sx={getContentLayoutStyles()}>
            {/* Left side: Custom date selection area */}
            <Box sx={getDateSectionStyles()}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={2}>
                  <DatePicker
                    label="From"
                    maxDate={toDate ? dayjs(toDate) : dayjs()}
                    value={fromDate ? dayjs(fromDate) : null}
                    onChange={(newValue) => {
                      handleDateChange('from', newValue?.format('YYYY-MM-DD') || '');
                    }}
                    disabled={disabled}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: getDateInputStyles(theme),
                      }
                    }}
                  />
                  <DatePicker
                    label="To"
                    minDate={fromDate ? dayjs(fromDate) : undefined}
                    maxDate={dayjs()}
                    value={toDate ? dayjs(toDate) : null}
                    onChange={(newValue) => {
                      handleDateChange('to', newValue?.format('YYYY-MM-DD') || '');
                    }}
                    disabled={disabled}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: getDateInputStyles(theme),
                      }
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Box>

            {/* Right side: Preset options */}
            <Box sx={getPresetSectionStyles()}>
              <Stack direction="row" spacing={1} sx={getPresetStackStyles()}>
                {presetOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    variant={selectedPreset === option.value ? "filled" : "outlined"}
                    onClick={() => handlePresetClick(option.value)}
                    icon={selectedPreset === option.value ? <Check sx={getChipIconStyles()} /> : undefined}
                    sx={getChipStyles(selectedPreset === option.value, theme)}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Footer buttons */}
        <Box sx={getFooterStyles()}>
          <Button
            variant="text"
            onClick={handleClear}
            sx={getActionButtonStyles('clear', theme)}
          >
            Clear
          </Button>

          <Box sx={getButtonGroupStyles()}>
            <Button
              variant="text"
              onClick={handleCancel}
              sx={getActionButtonStyles('cancel', theme)}
            >
              Cancel
            </Button>
            <Button
              variant="text"
              onClick={handleApply}
              disabled={!fromDate || !toDate || !hasChanges()}
              sx={getActionButtonStyles('apply', theme)}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default GoogleCloudDateFilter;