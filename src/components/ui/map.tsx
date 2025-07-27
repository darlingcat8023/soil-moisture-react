'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Button, Divider, IconButton, Paper, SxProps, Theme, Typography } from '@mui/material';
import DeckGL from '@deck.gl/react';
import { IconLayer, IconLayerProps } from '@deck.gl/layers';
import { Map, ViewState } from 'react-map-gl/maplibre';
import { ObservationStationFeature, ObservationStationsGeoJSON } from '@/services/data_service';
import { containerStyles, infoRowStyles, stationCardStyles, toolbarStyles, tooltipStyles } from '../style/map.styles';
import { FlyToInterpolator, MapView, PickingInfo } from '@deck.gl/core';
import { ZoomWidget } from '@deck.gl/widgets';
import '@deck.gl/widgets/stylesheet.css';
import IconClusterLayer from '../ext/icon_cluster_layer';
import SearchBox from '../style/search_box';
import MapButton from './map_button';
import ExpandOutlinedIcon from '@mui/icons-material/ExpandOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import { getPillButtonStyles } from '../style/pill_button.styles';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import DataComparatorDrawer from './data_comparator';
import { easeCubicInOut, easeQuadInOut, easeLinear } from 'd3-ease';
import SpatialDataComparatorDrawer from './3d_data_comparator';
import { throttle } from 'lodash';


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
interface ExtendedViewState extends ViewState {
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
  
  // set current camera view
  const [viewState, setViewState] = useState<ExtendedViewState>({
    ...initialViewState,
    transitionDuration: 0,
    transitionEasing: googleMapsEasing,
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
  const [comparatorOpen, setComparatorOpen] = useState<boolean>(false);

  const prevViewState = useRef<ExtendedViewState>({
    ...initialViewState,
    transitionDuration: 0,
    transitionEasing: googleMapsEasing,
  });

  const isUserInteracting = useRef(false);
  const lastInteractionTime = useRef(Date.now());
  
 const isViewStateChanged = (prev: ExtendedViewState, current: ExtendedViewState): boolean => {
    const tolerance = 0.0005;
    return (
      Math.abs(prev.longitude - current.longitude) > tolerance ||
      Math.abs(prev.latitude - current.latitude) > tolerance ||
      Math.abs(prev.zoom - current.zoom) > tolerance
    );
  };

  // set view status change
  const handleViewStateChange = useCallback(
    throttle((event: any) => {
      const newState = event.viewState;
      isUserInteracting.current = true;
      lastInteractionTime.current = Date.now();
      
      if (isViewStateChanged(prevViewState.current, newState)) {
        const updatedState: ExtendedViewState = {
          ...newState,
          transitionDuration: 0,
          transitionEasing: googleMapsEasing,
        };
        
        setViewState(updatedState);
        prevViewState.current = newState;
        setHoverInfo(null);
      }

      setTimeout(() => {
        if (Date.now() - lastInteractionTime.current >= 400) {
          isUserInteracting.current = false;
        }
      }, 500);
    }, 32),
    []
  );

  const flytoView = useCallback((longitude: number, latitude: number, zoom = 10) => {
    setViewState(prevState => ({
        ...prevState,
        longitude: longitude,
        latitude: latitude,
        zoom: zoom,
        transitionDuration: 1000,
        transitionEasing: easeQuadInOut,
        transitionInterpolator: new FlyToInterpolator(),
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

  // if focus on search box deselect existing location
  const handleSearchFocus = useCallback(() => {
    setSelectedPoint(null);
  }, [])

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

  // close comparetor card
  const handleCloseCard = useCallback(() => {
    setSelectedPoint(null);
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

  const handleOpenComparator = useCallback(() => {
    if (selectedPoint) {
      setComparatorOpen(true);
      console.log('Opening comparator for station:', selectedPoint.properties?.station_name);
    }
  }, []);

  const handleCloseComparator = useCallback(() => {
    setComparatorOpen(false);
  }, []);

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
            onClick={handleCloseCard}
            sx={{ ml: 1, mt: -0.5 }}
          >
            <CloseOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
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

          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              sx={getPillButtonStyles('primary', 'small')}
              startIcon={<CompareArrowsIcon />}
              onClick={handleOpenComparator}
            >
              Open Comparator
            </Button>
          </Box>

  
        </Box>
      </Paper>
    );
  }, [selectedPoint]);

  
  const layerProps: IconLayerProps<ObservationStationFeature> = React.useMemo(() => ({
    id: 'icon',
    data: geojson.features,
    pickable: true,
    getPosition: (d: ObservationStationFeature) => d.geometry.coordinates,
    iconAtlas: '/map/location-icon-atlas.png',
    iconMapping: '/map/location-icon-mapping.json'
  }), [geojson.features]);

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
      getPosition: geojson.features,
    }
  }), [layerProps, geojson.features]);

  const clusterLayer = React.useMemo(() => new IconClusterLayer<ObservationStationFeature>({
    ...layerProps, 
    id: 'cluster-layer',
    sizeScale: 30,
    onClickRef: handlePointClick,
    onHoverRef: handlePointHover,
    onViewStateChangeRef: handleViewStateChange,
    updateTriggers: {
      getPosition: geojson.features,
    }
  }), [layerProps, geojson.features]);

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
          onFocus={handleSearchFocus}
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
          viewState={viewState}
          onViewStateChange={handleViewStateChange}
          controller={{
            dragRotate: false,
            doubleClickZoom: false,
            scrollZoom: {
              speed: 0.005,
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

        <DataComparatorDrawer
          open={comparatorOpen}
          onClose={handleCloseComparator}
          selectedStation={selectedPoint}
        />
    </Box>
  );
}