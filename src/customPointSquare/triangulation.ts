import { IEncodeFeature } from '@antv/l7';

export function PointFillTriangulation(feature: IEncodeFeature) {
  const [p1, p2] = feature.coordinates as [number, number][];
  const v0 = [...p1];
  const v0uv = [0, 0];
  const v1 = [p2[0], p1[1]];
  const v1uv = [1, 0];
  const v2 = [...p2];
  const v2uv = [1, 1];
  const v3 = [p1[0], p2[1]];
  const v3uv = [0, 1];

  // p1
  // v0 ----- v1
  // |        |
  // |        |
  // |        |
  // v3 ----- v2
  //          p2

  return {
    vertices: [...v0, ...v0uv, ...v1, ...v1uv, ...v2, ...v2uv, ...v3, ...v3uv],
    indices: [0, 1, 2, 2, 3, 0],
    size: 4,
  };
}
