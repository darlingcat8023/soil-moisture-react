import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Divider,
  Popover,
  Tooltip,
  useTheme,
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
} from '@mui/material';
import {
  HelpOutline,
  Search,
} from '@mui/icons-material';
import BaseFilterButton from '../base_filter_button';
import {
  getPopoverStyles,
  getPopoverHeaderStyles,
  getHeaderContainerStyles,
  getTitleStyles,
  getHelpButtonStyles,
  getHelpIconStyles,
  getContentAreaStyles,
  getFooterStyles,
} from '@/components/style/filter/date_picker.styles';
import { getActionButtonStyles, getButtonGroupStyles } from '@/components/style/action_button.styles';
import { 
  getSearchTextFieldStyles,
  getSearchIconStyles,
  getSelectAllLabelStyles,
  getSelectAllCheckboxStyles,
  getSelectAllTextStyles,
  getSelectAllDividerStyles,
  getOptionsListStyles,
  getOptionListItemStyles,
  getOptionLabelStyles,
  getOptionCheckboxStyles,
  getOptionLabelContainerStyles,
  getOptionPrimaryTextStyles,
  getOptionSecondaryTextStyles,
  getNoOptionsStyles,
  getDeselectAllButtonStyles
} from '@/components/style/filter/item_picker.styles';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';

export interface ItemOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ItemPickerValue {
  selectedItems: string[];
}

interface GoogleCloudItemPickerProps {
  /** Callback function when items are applied */
  onChange?: (value: ItemPickerValue | null) => void;
  /** Initial value */
  value?: ItemPickerValue | null;
  /** Available options */
  options: ItemOption[];
  /** Custom title for the filter */
  title?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Help tooltip text */
  helpText?: string;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Show select all option */
  showSelectAll?: boolean;
  /** Maximum height for options list */
  maxHeight?: number;
}

const GoogleCloudItemPicker: React.FC<GoogleCloudItemPickerProps> = ({
  onChange,
  value,
  options,
  title = "Items",
  disabled = false,
  helpText = "Select items from the list. You can search to filter options.",
  searchPlaceholder = "Type to filter",
  showSelectAll = true,
  maxHeight = 300,
}) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>(value?.selectedItems || []);
  const [appliedItems, setAppliedItems] = useState<string[]>(value?.selectedItems || []);
  const [hasBeenUsed, setHasBeenUsed] = useState(!!value);
  const [searchTerm, setSearchTerm] = useState('');

  // Sync with external value changes
  useEffect(() => {
    if (value) {
      setSelectedItems(value.selectedItems);
      setAppliedItems(value.selectedItems);
      setHasBeenUsed(true);
    } else {
      setSelectedItems([]);
      setAppliedItems([]);
      setHasBeenUsed(false);
    }
  }, [value]);

  const open = Boolean(anchorEl);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    
    const query = searchTerm.toLowerCase();
    return options.filter(option => 
      option.label.toLowerCase().includes(query) ||
      option.value.toLowerCase().includes(query) ||
      option.description?.toLowerCase().includes(query)
    );
  }, [options, searchTerm]);

  // Check if all filtered items are selected
  const isAllSelected = useMemo(() => {
    const availableOptions = filteredOptions.filter(opt => !opt.disabled);
    return availableOptions.length > 0 && 
           availableOptions.every(opt => selectedItems.includes(opt.value));
  }, [filteredOptions, selectedItems]);

  // Check if some (but not all) filtered items are selected
  const isIndeterminate = useMemo(() => {
    const availableOptions = filteredOptions.filter(opt => !opt.disabled);
    const selectedCount = availableOptions.filter(opt => selectedItems.includes(opt.value)).length;
    return selectedCount > 0 && selectedCount < availableOptions.length;
  }, [filteredOptions, selectedItems]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemToggle = useCallback((itemValue: string) => {
    setSelectedItems(prev => 
      prev.includes(itemValue)
        ? prev.filter(item => item !== itemValue)
        : [...prev, itemValue]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    const availableOptions = filteredOptions.filter(opt => !opt.disabled);
    
    if (isAllSelected) {
      // Deselect all filtered items
      const filteredValues = availableOptions.map(opt => opt.value);
      setSelectedItems(prev => prev.filter(item => !filteredValues.includes(item)));
    } else {
      // Select all filtered items
      const filteredValues = availableOptions.map(opt => opt.value);
      setSelectedItems(prev => {
        const newItems = [...prev];
        filteredValues.forEach(value => {
          if (!newItems.includes(value)) {
            newItems.push(value);
          }
        });
        return newItems;
      });
    }
  }, [filteredOptions, isAllSelected]);

  const handleDeselectAll = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const hasChanges = () => {
    if (selectedItems.length !== appliedItems.length) return true;
    return !selectedItems.every(item => appliedItems.includes(item));
  };

  const getDisplayText = () => {
    if (appliedItems.length === 0) {
      return 'All';
    }
    if (appliedItems.length === 1) {
      const option = options.find(opt => opt.value === appliedItems[0]);
      return option?.label || appliedItems[0];
    }
    return `${appliedItems.length} selected`;
  };

  const handleApply = () => {
    if (hasChanges()) {
      setAppliedItems([...selectedItems]);
      setHasBeenUsed(selectedItems.length > 0); // Update hasBeenUsed based on whether there are selections
      
      if (selectedItems.length > 0) {
        onChange?.({
          selectedItems: [...selectedItems]
        });
      } else {
        // If no items selected, treat as cleared
        onChange?.(null);
      }
    }
    handleClose();
  };

  const handleCancel = () => {
    setSelectedItems([...appliedItems]);
    setSearchTerm('');
    handleClose();
  };

  const buttonDisplayText = hasBeenUsed 
    ? `${title}: ${getDisplayText()}` 
    : `${title}: Select sources`;

  return (
    <Box>
      <BaseFilterButton
        displayText={buttonDisplayText}
        startIcon={<FilterListOutlinedIcon sx={{ fontSize: 16 }} />}
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
          sx: {
            ...getPopoverStyles(theme),
            minWidth: 400,
            maxWidth: 500,
          }
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
          {/* Search Box */}
          <TextField
            fullWidth
            size="small"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={disabled}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={getSearchIconStyles(theme)} />
                </InputAdornment>
              ),
            }}
            sx={getSearchTextFieldStyles(theme)}
          />

          {/* Select All Option */}
          {showSelectAll && filteredOptions.length > 0 && (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                    disabled={disabled}
                    size="small"
                    sx={getSelectAllCheckboxStyles(theme)}
                  />
                }
                label={
                  <Typography sx={getSelectAllTextStyles()}>
                    Select all
                  </Typography>
                }
                sx={getSelectAllLabelStyles(theme)}
              />
              <Divider sx={getSelectAllDividerStyles(theme)} />
            </>
          )}

          {/* Options List */}
          <Box sx={getOptionsListStyles(maxHeight)}>
            <List dense>
              {filteredOptions.map((option) => (
                <ListItem
                  key={option.value}
                  sx={getOptionListItemStyles(theme)}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedItems.includes(option.value)}
                        onChange={() => handleItemToggle(option.value)}
                        disabled={disabled || option.disabled}
                        size="small"
                        sx={getOptionCheckboxStyles(theme)}
                      />
                    }
                    label={
                      <Box sx={getOptionLabelContainerStyles()}>
                        <Typography sx={getOptionPrimaryTextStyles(theme, option.disabled)}>
                          {option.label}
                        </Typography>
                        {option.description && (
                          <Typography sx={getOptionSecondaryTextStyles(theme)}>
                            {option.description}
                          </Typography>
                        )}
                      </Box>
                    }
                    sx={getOptionLabelStyles()}
                  />
                </ListItem>
              ))}
            </List>

            {filteredOptions.length === 0 && (
              <Box sx={getNoOptionsStyles(theme)}>
                No options found
              </Box>
            )}
          </Box>
        </Box>

        {/* Footer buttons */}
        <Box sx={getFooterStyles()}>
          {/* Left side - Deselect All button */}
          <Button
            variant="text"
            onClick={handleDeselectAll}
            disabled={selectedItems.length === 0 || disabled}
            sx={getDeselectAllButtonStyles(theme)}
          >
            Deselect all
          </Button>

          {/* Right side button group */}
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
              disabled={!hasChanges() || disabled}
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

export default GoogleCloudItemPicker;