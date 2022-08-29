import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import { CustomPointSquareLayer } from 'l7-customlayer-template';

const data = [
  { count: 6, dLong: 116.4748, dLat: 39.9 },
  { count: 12, dLong: 116.4748, dLat: 39.9038 },
  { count: 4, dLong: 116.4748, dLat: 39.9076 },
  { count: 8, dLong: 116.4748, dLat: 39.9114 },
  { count: 23, dLong: 116.47975, dLat: 39.9114 },
  { count: 18, dLong: 116.47975, dLat: 39.9152 },
  { count: 2, dLong: 116.4748, dLat: 39.9152 },
  { count: 7, dLong: 116.4847, dLat: 39.9114 },
  { count: 3, dLong: 116.4847, dLat: 39.919 },
  { count: 7, dLong: 116.48965, dLat: 39.919 },
  { count: 9, dLong: 116.47975, dLat: 39.9038 },
];

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'light',
        center: [116.4748, 39.9],
        zoom: 13,
      }),
    });

    const layer = new CustomPointSquareLayer()
      .source(data, {
        parser: {
          type: 'json',
          x: 'dLong',
          y: 'dLat',
        },
      })
      .color('count', ['#f8f0fc', '#eebefa', '#da77f2', '#cc5de8'])
      .active(true)
      .style({
        len: 0.0025,
        // rotate: Math.PI / 4,
        opacity: 0.5,
        strokeWidth: 0.015,
        stroke: '#9c36b5',
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
