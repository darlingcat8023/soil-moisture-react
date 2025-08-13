'use client'
import { Box, useTheme } from '@mui/material';
import { ViewState } from 'react-map-gl/maplibre';
import { PaddingOptions } from 'react-map-gl/mapbox';
import DeckGLMap from '@/components/ui/map';
import { useEffect, useState } from 'react';
import { ObservationStationsGeoJSON } from '@/services/response/data_response';
import { dataService } from '@/services/data_service';

export default function HomePage() {
  
  const NEW_ZEALAND_CENTER_VIEW_STATE: ViewState = {
    longitude: 172.0,
    latitude: -41,
    zoom: 5.3,
    bearing: 0,
    pitch: 0,
    padding: {
      top: 0
    } as PaddingOptions
  };

  const theme = useTheme();

  const [geoData, setGeoData] = useState<ObservationStationsGeoJSON>({} as ObservationStationsGeoJSON);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dataService.getObservationStations();
        setGeoData(response);
      } finally {}
    };
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      <DeckGLMap
        geojson={geoData}
        initialViewState={NEW_ZEALAND_CENTER_VIEW_STATE}
        mapStyle= {theme.palette.mode === 'light' ? "positron" : "dark-matter"}
      />
    </Box>
  );
}