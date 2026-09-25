import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DeckGL } from '@deck.gl/react';
import { ScatterplotLayer, IconLayer } from '@deck.gl/layers';
import maplibregl from 'maplibre-gl';
import { CAMERA_NODES, CHANDIGARH_CENTER } from '../../lib/constants';
import Minimap from './Minimap';
import { Plus, Minus, RotateCcw } from 'lucide-react';

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/dark';

const INITIAL_VIEW_STATE = {
  longitude: CHANDIGARH_CENTER[0],
  latitude: CHANDIGARH_CENTER[1],
  zoom: 12.2,
  pitch: 0,
  bearing: 0,
  maxZoom: 18,
  minZoom: 10,
};

export default function MainMap({ selectedCamera, onSelectCamera }) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // Initialize MapLibre GL base map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      attributionControl: false,
      interactive: false, // Deck.gl handles interaction
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync MapLibre viewport with Deck.gl viewState
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.jumpTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        bearing: viewState.bearing,
        pitch: viewState.pitch,
      });
    }
  }, [viewState]);

  // Fly to selected camera
  useEffect(() => {
    if (selectedCamera && selectedCamera.coords) {
      setViewState((prev) => ({
        ...prev,
        longitude: selectedCamera.coords[0],
        latitude: selectedCamera.coords[1],
        zoom: 16,
        transitionDuration: 1000
      }));
    } else {
      setViewState(INITIAL_VIEW_STATE);
    }
  }, [selectedCamera]);

  // Handle camera marker click
  const handleCameraClick = useCallback((info) => {
    if (info?.object) {
      if (onSelectCamera) onSelectCamera(info.object);
    } else {
      if (onSelectCamera) onSelectCamera(null);
    }
  }, [onSelectCamera]);

  const onViewStateChange = useCallback(({ viewState: nextViewState }) => {
    setViewState(nextViewState);
  }, []);

  // Zoom controls
  const handleZoomIn = () => {
    setViewState((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 0.75, 18) }));
  };

  const handleZoomOut = () => {
    setViewState((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 0.75, 10) }));
  };

  const handleResetView = () => {
    setViewState(INITIAL_VIEW_STATE);
    if (onSelectCamera) onSelectCamera(null);
  };

  // Deck.gl Layers
  const layers = [
    new ScatterplotLayer({
      id: 'camera-nodes',
      data: CAMERA_NODES,
      getPosition: (d) => d.coords,
      getFillColor: (d) => {
        if (selectedCamera?.id === d.id) return [59, 130, 246, 255]; // Highlight color
        return d.status === 'fault' ? [180, 120, 40, 220] : [50, 140, 90, 220];
      },
      getLineColor: [15, 21, 32, 255],
      lineWidthMinPixels: 1,
      stroked: true,
      getRadius: (d) => (selectedCamera?.id === d.id ? 15 : 10),
      radiusMinPixels: 4,
      radiusMaxPixels: 9,
      pickable: true,
      onClick: handleCameraClick,
      autoHighlight: true,
      highlightColor: [62, 123, 250, 240],
      updateTriggers: {
        getFillColor: selectedCamera?.id,
        getRadius: selectedCamera?.id
      }
    }),
  ];

  return (
    <div className="relative w-full h-full bg-[#080C14] overflow-hidden">
      {/* MapLibre Basemap Container */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />

      {/* Deck.gl Canvas Overlay */}
      <DeckGL
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        controller={{ doubleClickZoom: false, dragRotate: false }}
        layers={layers}
        getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'default')}
        onClick={(info) => {
          if (!info.object && onSelectCamera) {
            onSelectCamera(null);
          }
        }}
      />

      {/* Minimap (Bottom-Left) */}
      <Minimap viewport={viewState} />

      {/* Custom Map Controls (Bottom-Right) */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1.5 bg-[#0F1520] border border-[#1E2940] rounded-[4px] p-1 shadow-lg font-ui">
        <button
          onClick={handleZoomIn}
          className="p-2 text-[#7A8BA8] hover:text-[#E8EDF5] hover:bg-[#161D2E] rounded transition-colors"
          title="Zoom In"
        >
          <Plus size={16} strokeWidth={1.5} />
        </button>
        <div className="border-t border-[#1E2940]" />
        <button
          onClick={handleZoomOut}
          className="p-2 text-[#7A8BA8] hover:text-[#E8EDF5] hover:bg-[#161D2E] rounded transition-colors"
          title="Zoom Out"
        >
          <Minus size={16} strokeWidth={1.5} />
        </button>
        <div className="border-t border-[#1E2940]" />
        <button
          onClick={handleResetView}
          className="p-2 text-[#7A8BA8] hover:text-[#E8EDF5] hover:bg-[#161D2E] rounded transition-colors"
          title="Reset View"
        >
          <RotateCcw size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
