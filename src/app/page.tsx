'use client'
import { Box } from '@mui/material';
import { ViewState } from 'react-map-gl/maplibre';
import { PaddingOptions } from 'react-map-gl/mapbox';
import DeckGLMap from '@/components/ui/map';
import { useEffect, useState } from 'react';
import { ObservationStationsGeoJSON } from '@/services/response/data_response';

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

  const [geoData, setGeoData] = useState<ObservationStationsGeoJSON>({} as ObservationStationsGeoJSON);

  useEffect(() => {
    fetch('/map/testdata.json')
      .then(response => response.json())
      .then((data: ObservationStationsGeoJSON) => {
        setGeoData(data);
      })
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
        mapStyle='positron'
      />
    </Box>
  );
}