# L7-CustomLayer-Template

- 详细文档 https://github.com/antvis/L7-CustomLayer-Template/tree/master/docs/template%20api

## Usage

在引入图层后和 L7 普通的图层使用保持一致

```js
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import { CustomPointLayer } from 'l7-customlayer-template';

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

    const layer = new CustomPointLayer()
      .source([{ lng: 120, lat: 30 }], {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
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
```

## Getting Started

Install dependencies,

```bash
$ npm i
```

Start the dev server,

```bash
$ npm start
```

Build documentation,

```bash
$ npm run docs:build
```

Run test,

```bash
$ npm test
```

Build library via `father`,

```bash
$ npm run build
```
