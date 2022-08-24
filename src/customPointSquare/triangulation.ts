import { IEncodeFeature } from '@antv/l7';
import { calculateCentroid } from '../utils';

export function PointFillTriangulation(feature: IEncodeFeature) {
  const coordinates = calculateCentroid(feature.coordinates);

  const v0 = [...coordinates];

  const v0uv = [0, 0];

  const v1 = [...coordinates];

  const v1uv = [1, 0];

  const v2 = [...coordinates];

  const v2uv = [1, 1];

  const v3 = [...coordinates];

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
