'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Box, Button, IconButton, Paper, Stack, SxProps, Theme, Typography, useTheme } from '@mui/material';
import DeckGL from '@deck.gl/react';
import { IconLayer, IconLayerProps } from '@deck.gl/layers';
import { Map, ViewState } from 'react-map-gl/maplibre';
import { containerStyles, infoRowStyles, stationCardStyles, toolbarStyles, tooltipStyles } from '../style/map.styles';
import { FlyToInterpolator, MapView, MapViewState, PickingInfo } from '@deck.gl/core';
import { ZoomWidget } from '@deck.gl/widgets';
import '@deck.gl/widgets/stylesheet.css';
import IconClusterLayer from '../ext/icon_cluster_layer';
import SearchBox from './search_box';
import MapButton from './map_button';
import ExpandOutlinedIcon from '@mui/icons-material/ExpandOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { getActionButtonStyles } from '../style/action_button.styles';
import { ObservationStationFeature, ObservationStationsGeoJSON } from '@/services/response/data_response';
import DatasetsComparatorDrawer from './datasets_comparator';
import StationComparatorDrawer from './stations_comparator';


const MAP_VIEW = new MapView({
  id: 'map',
  repeat: true
});

const ZOOM = new ZoomWidget({
  placement: 'bottom-right',
  zoomInLabel: 'Zoom In',
  zoomOutLabel: 'Zoom Out'
});

// map style
export type CartoMapStyle = | 'positron' | 'positron-nolabels' | 'dark-matter' | 'dark-matter-nolabels'

const CARTO_STYLES: Record<CartoMapStyle, string> = {
  'positron': 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  'positron-nolabels': 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json',
  'dark-matter': 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  'dark-matter-nolabels': 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
};

// viewstate change with animation
interface ExtendedViewState extends MapViewState {
  transitionDuration?: number;
  transitionEasing?: (t: number) => number;
  transitionInterpolator?: any;
}

const googleMapsEasing = (t: number): number => {
  return t * t * (3 - 2 * t);
};

export interface DeckGLMapProps {
  geojson: ObservationStationsGeoJSON;
  initialViewState: ViewState;
  height?: string;
  mapStyle?: CartoMapStyle;
  style?: SxProps<Theme>;
}

export default function DeckGLMap({
  geojson,
  initialViewState,
  height = '100%',
  mapStyle = 'positron',
  style = {}
}: DeckGLMapProps) {

  const theme = useTheme()

  const featureData = useMemo(() => geojson.features, [geojson]);

  // set current camera view
  const [viewState, setViewState] = useState<ExtendedViewState>({
    ...initialViewState,
  });

  // set using clusting layer or not
  const [useClusting, setUseClusting] = useState<boolean>(true);
  
  // set showing hover info or not
  const [hoverInfo, setHoverInfo] = useState<{
    object: ObservationStationFeature;
    x: number;
    y: number;
  } | null>(null);
  
  // set which location is selected
  const [selectedPoint, setSelectedPoint] = useState<ObservationStationFeature | null>(null);
  
  // set the comparator box is open or not
  const [dataComparatorOpen, setDataComparatorOpen] = useState<boolean>(false);
  // set the comparator box is open or not
  const [timeComparatorOpen, setTimeComparatorOpen] = useState<boolean>(false);

  // set view status change
  const handleViewStateChange = useCallback((event: any) => {
  
    setViewState({
      ...event.viewState,  
      transitionDuration: 0,
      transitionEasing: googleMapsEasing,
    });
    setHoverInfo(null);

  },[]);

  const flytoView = useCallback((longitude: number, latitude: number, zoom = 10) => {
    setViewState(prevState => ({
        ...prevState,
        longitude: longitude,
        latitude: latitude,
        zoom: zoom,
        transitionDuration: 1000,
        transitionEasing: googleMapsEasing,
        transitionInterpolator: new FlyToInterpolator({
          speed: 2
        }),
      }));
  }, [])

  // handle the action when a point was clicked
  const handlePointClick = useCallback((info: PickingInfo<ObservationStationFeature>) => {
    if (info.object) {
      setSelectedPoint(info.object);
      flytoView(info.object!.geometry.coordinates[0], info.object!.geometry.coordinates[1], 10)
    } else {
      setSelectedPoint(null)
    }
  }, []);

  // handle if the clusting view button is clicked
  const handleClustingClick = useCallback(() => {
    setHoverInfo(null);
    setUseClusting(prev => !prev);
  }, [useClusting]); // only when the button is clicked, the page will rerender

  // handle if a item on the search results is selected
  const handleSearchItemSelected = useCallback((info: ObservationStationFeature) => {
    setSelectedPoint(info);
    flytoView(info.geometry.coordinates[0], info.geometry.coordinates[1], 10)
  }, []);

  // set hover info
  const handlePointHover = useCallback((info: PickingInfo<ObservationStationFeature>) => {
    if (info.object && info.pixel) {
      setHoverInfo({
        object: info.object,
        x: info.pixel[0],
        y: info.pixel[1],
      });
    } else {
      setHoverInfo(null);
    }
  }, []); 

  // render the hover info
  const renderTooltip = useCallback(() => {
    if (!hoverInfo) return null;
    const { object, x, y } = hoverInfo;
    return (
      <Paper
        sx={tooltipStyles(x, y)}
      >
        <Typography sx={{ color: 'inherit', fontSize: 'inherit' }}>
          {object.properties?.station_name}
        </Typography>
      </Paper>
    );
  }, [hoverInfo]);


  const renderStationInfoCard = useCallback(() => {
    if (!selectedPoint) return null;

    const { properties } = selectedPoint;
    const coordinates = selectedPoint.geometry.coordinates;
    
    return (
      <Paper sx={stationCardStyles}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="h3" gutterBottom>
            {properties?.station_name || 'Unknown Station'}
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => {
              setSelectedPoint(null);
            }}
            sx={{ ml: 1, mt: -0.5 }}
          >
            <CloseOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Box>
          
          <Typography variant="body2" color="text.secondary" gutterBottom sx={infoRowStyles}>
            <TagOutlinedIcon fontSize="small" />
            <strong>Station ID:</strong> {properties?.station_id || 'N/A'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom sx={infoRowStyles}>
            <PushPinOutlinedIcon fontSize="small" />
            <strong>Coordinates:</strong> {coordinates[1].toFixed(4)}, {coordinates[0].toFixed(4)}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom sx={infoRowStyles}>
            <AccessTimeOutlinedIcon fontSize="small" />
            <strong>Data Range:</strong> {properties.record_start_date?.toString() || 'Unknown'} to {properties.record_end_date?.toString() || 'Unknown'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom sx={infoRowStyles}>
            <LayersOutlinedIcon fontSize="small" />
            <strong>Data Depth:</strong> {properties.data_depth}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
            <Stack spacing={1} direction="column">
              
              <Button 
                sx={{
                  ...getActionButtonStyles('apply', theme),
                  justifyContent: 'flex-start',
                  textAlign: 'left'
                }}
                startIcon={<CompareArrowsIcon />}
                onClick={() => {
                  if (selectedPoint) {
                    setDataComparatorOpen(true);
                  }
                }}
              >
                Compare Between Datasets
              </Button>

              <Button 
                sx={{
                  ...getActionButtonStyles('apply', theme),
                  justifyContent: 'flex-start',
                  textAlign: 'left'
                }}
                startIcon={<CompareArrowsIcon />}
                onClick={() => {
                  if (selectedPoint) {
                    setTimeComparatorOpen(true);
                  }
                }}
              >
                Compare Between Dates
              </Button>

            </Stack>
          </Box>

  
        </Box>
      </Paper>
    );
  }, [selectedPoint]);
  
  const layerProps: IconLayerProps<ObservationStationFeature> = React.useMemo(() => ({
    id: 'icon',
    data: featureData,
    pickable: true,
    getPosition: (d: ObservationStationFeature) => d.geometry.coordinates,
    iconAtlas: '/map/location-icon-atlas.png',
    iconMapping: '/map/location-icon-mapping.json'
  }), [featureData]);

  const iconLayer = React.useMemo(() => new IconLayer({
    ...layerProps,
    id: 'icon-layer',
    getIcon: () => 'marker',
    sizeUnits: 'meters',
    sizeScale: 1000,
    sizeMinPixels: 8,
    onClick: handlePointClick,
    onHover: handlePointHover,
    updateTriggers: {
      getPosition: featureData,
    }
  }), [layerProps, featureData]);

  const clusterLayer = React.useMemo(() => new IconClusterLayer<ObservationStationFeature>({
    ...layerProps, 
    id: 'cluster-layer',
    sizeScale: 30,
    onClickRef: handlePointClick,
    onHoverRef: handlePointHover,
    onViewChange: flytoView,
    updateTriggers: {
      getPosition: featureData,
    }
  }), [layerProps, featureData, flytoView]);

  const layers = React.useMemo(() => {
    const selectedLayer = useClusting ? clusterLayer : iconLayer;
    return [selectedLayer.clone({ visible: true })];
  }, [useClusting, clusterLayer, iconLayer]);

  return (
    <Box sx={containerStyles(height, style)}>
      <Box sx={toolbarStyles}>
        
        <SearchBox 
          geojson={geojson}
          onSelect={handleSearchItemSelected}
          onFocus={() => {
            setSelectedPoint(null);
          }}
        />

        <MapButton            
          ariaLabel="clusting view"
          title="clusting view"
          defaultActive={false}
          onClick={handleClustingClick}
        >
          <ExpandOutlinedIcon />
        </MapButton>

      </Box>

      {renderStationInfoCard()}

      <DeckGL
          views={MAP_VIEW}
          widgets={[ZOOM]}
          initialViewState={initialViewState}
          viewState={viewState}
          onViewStateChange={handleViewStateChange}
          controller={{
            dragRotate: false,
            doubleClickZoom: false,
            scrollZoom: {
              speed: 0.01,
              smooth: true,
            },
            dragPan: true,
            inertia: true,
            touchZoom: true,
            touchRotate: false,
          }}
          layers={layers}
          layerFilter={({layer}) => layer.props.visible !== false}
          getCursor={({isDragging, isHovering}) => {
            if (isDragging) return 'grabbing';
            if (isHovering) return 'pointer';
            return 'default';
          }}
          onClick={handlePointClick}
        >
          <Map
            reuseMaps
            mapStyle={CARTO_STYLES[mapStyle]}
          />

          {renderTooltip()}
        </DeckGL>
        
        {selectedPoint && 
          <DatasetsComparatorDrawer
            open={dataComparatorOpen}
            onClose={() => {
              setDataComparatorOpen(false);
            }}
            selectedStation={selectedPoint}
            stationList={geojson.features}
          />
        }
        
    </Box>
  );
}