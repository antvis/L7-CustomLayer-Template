import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import { CustomPointLayer, CustomPolygonLayer } from 'l7-customlayer-template';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'light',
        center: [105, 30],
        zoom: 4,
      }),
    });

    const layer = new CustomPolygonLayer()
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [104.4140625, 35.460669951495305],
                  [98.7890625, 24.206889622398023],
                  [111.796875, 27.371767300523047],
                  [104.4140625, 35.460669951495305],
                ],
              ],
            },
          },
        ],
      })
      .shape('fill')
      .color('#ff0')
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
