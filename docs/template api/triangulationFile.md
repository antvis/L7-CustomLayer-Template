## Triangulation

该文件负责根据图形的地理数据组装图层的顶点位置和顶点方法。我们需要设置每个顶点数据和对应的索引。

- 在实际绘制的时候采用 drawArrays，因此我们需要设置 indices 传入顶点的索引
- 每个顶点中除了包含位置数据外还可以包含其他属性，因此 size 大小需要根据顶点数据动态设置

```js
export function Triangulation(feature: IEncodeFeature, segmentNumber?: number) {
    ...
  return {
    vertices: positions,
    indices: indexArray,
    size: size,
  };
}
```
