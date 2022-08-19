import { IEncodeFeature } from '@antv/l7';
export type IPosition = [number, number, number] | [number, number];

export function LineArcTriangulation(feature: IEncodeFeature, segmentNumber?: number) {
  const segNum = segmentNumber ? segmentNumber : 30;
  const coordinates = feature.coordinates as IPosition[];
  const positions = [];
  const indexArray = [];
  for (let i = 0; i < segNum; i++) {
    // 上线两个顶点
    // [ x, y, z, sx,sy, tx,ty]
    positions.push(
      i,
      1,
      i,
      coordinates[0][0],
      coordinates[0][1],
      coordinates[1][0],
      coordinates[1][1],
      i,
      -1,
      i,
      coordinates[0][0],
      coordinates[0][1],
      coordinates[1][0],
      coordinates[1][1],
    );

    if (i !== segNum - 1) {
      indexArray.push(
        ...[0, 1, 2, 1, 3, 2].map((v) => {
          return i * 2 + v;
        }),
      );
    }
  }
  return {
    vertices: positions,
    indices: indexArray,
    size: 7,
  };
}
