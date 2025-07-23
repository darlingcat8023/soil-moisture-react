'use client'
import { Box } from '@mui/material';
import { ViewState } from 'react-map-gl/maplibre';
import { PaddingOptions } from 'react-map-gl/mapbox';
import DeckGLMap from '@/components/ui/map';
import { useEffect, useState } from 'react';
import { ObservationStationsGeoJSON } from '@/services/data_service';

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
        width: '100%',    // 视口宽度
        height: '100%',   // 视口高度
        margin: 0,         // 移除默认边距
        padding: 0,        // 移除默认内边距
        overflow: 'hidden' // 防止滚动条
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