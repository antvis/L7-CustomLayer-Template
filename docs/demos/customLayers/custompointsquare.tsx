import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import { CustomPointSquareLayer } from 'l7-customlayer-template';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'light',
        center: [120, 30],
        zoom: 6.45,
      }),
    });

    const layer = new CustomPointSquareLayer()
      .source(
        [
          {
            lng: 120,
            lat: 30,
            lng1: 120.5,
            lat1: 29.5,
          },
          {
            lng: 121,
            lat: 30,
            lng1: 121.5,
            lat1: 29.5,
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
            x1: 'lng1',
            y1: 'lat1',
          },
        },
      )
      .shape('circle')
      .size(20)
      .color('#f00')
      .active(true);
    scene.on('loaded', () => {
      scene.addLayer(layer);
      layer.on('click', () => {
        alert('click');
      });
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
