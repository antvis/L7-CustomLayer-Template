import { Scene } from '@antv/l7';
import { GaodeMap, GaodeMapV2 } from '@antv/l7-maps';
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
            color: '#f00',
          },
          {
            lng: 120.5,
            lat: 30,
            color: '#ff0',
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
      )
      .color('color')
      .active(true)
      .style({
        len: 25,
        rotate: Math.PI / 4,
        opacity: 0.5,
      });

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
