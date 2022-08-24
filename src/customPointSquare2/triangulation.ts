import { IEncodeFeature } from '@antv/l7';
import { calculateCentroid } from '../utils';

export function PointFillTriangulation(feature: IEncodeFeature) {
  const { size = 0.25 } = feature;
  const len = Array.isArray(size) ? 0.25 : size;
  const coordinates = calculateCentroid(feature.coordinates);

  const v0 = [...coordinates];
  v0[0] -= len;
  v0[1] += len;

  const v0uv = [0, 0];

  const v1 = [...coordinates];
  v1[0] += len;
  v1[1] += len;

  const v1uv = [1, 0];

  const v2 = [...coordinates];
  v2[0] += len;
  v2[1] -= len;

  const v2uv = [1, 1];

  const v3 = [...coordinates];
  v3[0] -= len;
  v3[1] -= len;

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
    size: coordinates.length + 2,
  };
}
