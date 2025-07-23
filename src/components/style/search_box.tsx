'use client';
import { Clear, Search } from "@mui/icons-material";
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import { 
  IconButton, 
  InputAdornment, 
  TextField, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Typography,
  Box,
  Popper,
  ClickAwayListener
} from "@mui/material";
import { useCallback, useState, useMemo, useRef } from "react";
import { 
  searchBoxStyles, 
  iconStyles, 
  clearButtonStyles,
  searchResultsStyles,
  highlightStyles,
  containerStyles,
  popperStyles
} from "./search_box.styles";
import { ObservationStationFeature, ObservationStationsGeoJSON } from "@/services/data_service";

interface SearchBoxProps {
  geojson: ObservationStationsGeoJSON;
  onSelect?: (item: ObservationStationFeature) => void;
  onFocus?: () => void;
  placeholder?: string;
  maxResults?: number;
}

export default function SearchBox({ 
  geojson, 
  onSelect,
  onFocus,
  placeholder = "Search observation station",
  maxResults = 10
}: SearchBoxProps) {
  const [searchValue, setSearchValue] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const textFieldRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    setShowResults(value.length > 0);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchValue('');
    setShowResults(false);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchValue.trim() || !geojson?.features || geojson.features.length === 0) {
      return [];
    }

    const query = searchValue.toLowerCase().trim();
    const results:  (ObservationStationFeature & { _score: number })[] = [];

    for (const feature of geojson.features) {
      let score = 0;

      const searchFields = [
        { field: 'station_id', value: feature.properties.station_id },
        { field: 'station_name', value: feature.properties.station_name }
      ];

      for (const { field, value } of searchFields) {
        if (typeof value === 'string') {
          const fieldValue = value.toLowerCase();
          
          if (fieldValue.startsWith(query)) {
            score = 100;
          }
          else if (fieldValue === query) {
            score = Math.max(score, 80);
            break;
          }
          
          else if (fieldValue.includes(query)) {
            score = Math.max(score, 60);
          }
          else if (fieldValue.replace(/[\s\-_]/g, '').includes(query.replace(/[\s\-_]/g, ''))) {
            score = Math.max(score, 40);
          }
        }
      }

      if (score > 0) {
        results.push({...feature, _score: score});
      }
    }

    return results.sort((a, b) => b._score - a._score).slice(0, maxResults);
  }, [searchValue, geojson, maxResults]);

  const handleItemSelect = useCallback((item: ObservationStationFeature) => {
    setSearchValue(item.properties.station_name);
    setShowResults(false);
    onSelect?.(item);
  }, [onSelect]);

  const handleClickAway = useCallback(() => {
    setShowResults(false);
  }, []);

  const getCoordinatesText = (feature: ObservationStationFeature) => {
    const [lng, lat] = feature.geometry.coordinates;
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <strong key={index} style={highlightStyles}>{part}</strong> : 
        part
    );
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={containerStyles}>
        <TextField
          ref={textFieldRef}
          value={searchValue}
          onChange={handleSearchChange}
          onFocus={onFocus}
          placeholder={placeholder}
          variant="outlined"
          size="small"
          sx={searchBoxStyles}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={iconStyles.search} />
                </InputAdornment>
              ),
              endAdornment: searchValue && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleSearchClear}
                    sx={clearButtonStyles}
                  >
                    <Clear sx={iconStyles.clear} />
                  </IconButton>
                </InputAdornment>
              ),
            }
          }}
        />

        <Popper
          open={showResults && searchResults.length > 0}
          anchorEl={textFieldRef.current}
          placement="bottom-start"
          style={{ 
            width: textFieldRef.current?.offsetWidth || 'auto', 
            zIndex: popperStyles.zIndex 
          }}
        >
          <Paper sx={searchResultsStyles.paper}>
            <List dense>
              {searchResults.map((feature, index) => (
                <ListItem
                  key={feature.properties.station_id}
                  onClick={() => handleItemSelect(feature)}
                  sx={{
                    ...searchResultsStyles.listItem,
                  }}
                >
                  <ListItemIcon>
                    <RoomOutlinedIcon />
                  </ListItemIcon>
                  <Box sx={searchResultsStyles.textContainer}>
                    <ListItemText
                      primary={
                        <Typography sx={searchResultsStyles.primaryText}>
                          {highlightText(feature.properties.station_name, searchValue)}
                        </Typography>
                      }
                      secondary={
                        <Typography sx={searchResultsStyles.secondaryText}>
                          ID: {highlightText(feature.properties.station_id, searchValue)}
                        </Typography>
                      }
                    />
                  </Box>
                  <Typography variant="caption" sx={searchResultsStyles.coordinates}>
                    {getCoordinatesText(feature)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Popper>

        <Popper
          open={showResults && searchValue.length > 0 && searchResults.length === 0}
          anchorEl={textFieldRef.current}
          placement="bottom-start"
          style={{ 
            width: textFieldRef.current?.offsetWidth || 'auto', 
            zIndex: popperStyles.zIndex 
          }}
        >
          <Paper sx={searchResultsStyles.paper}>
            <Box sx={searchResultsStyles.noResults}>
              <Typography variant="body2">
                No results found for "{searchValue}"
              </Typography>
            </Box>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}