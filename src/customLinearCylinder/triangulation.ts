import { IEncodeFeature, lngLatToMeters } from '@antv/l7';
import { vec3 } from 'gl-matrix';
import earcut from 'earcut';
type IPosition = [number, number, number] | [number, number];
type IPath = IPosition[];
enum ShapeType3D {
  CYLINDER = 'cylinder',
  SQUARECOLUMN = 'squareColumn',
  TRIANGLECOLUMN = 'triangleColumn',
  HEXAGONCOLUMN = 'hexagonColumn',
  PENTAGONCOLUMN = 'pentagonColumn',
}

interface IExtrudeGeomety {
  positions: number[];
  index: number[];
  normals?: number[];
}

interface IGeometryCache {
  [key: string]: IExtrudeGeomety;
}

const GeometryCache: IGeometryCache = {};

enum ShapeType2D {
  CIRCLE = 'circle',
  SQUARE = 'square',
  TRIANGLE = 'triangle',
  HEXAGON = 'hexagon',
  PENTAGON = 'pentagon',
}

export function polygonPath(pointCount: number, start: number = 0): IPath {
  const step = (Math.PI * 2) / pointCount;
  const line = [];
  for (let i = 0; i < pointCount; i++) {
    line.push(step * i + (start * Math.PI) / 12);
  }
  const path: IPath = line.map((t) => {
    const x = Math.sin(t + Math.PI / 4);
    const y = Math.cos(t + Math.PI / 4);
    return [x, y, 0];
  });
  return path;
}

export function circle(): IPath {
  return polygonPath(30);
}
export function square(): IPath {
  return polygonPath(4);
}
export function triangle(): IPath {
  return polygonPath(3);
}
export function hexagon(): IPath {
  return polygonPath(6, 1);
}
export function pentagon(): IPath {
  return polygonPath(5);
}

const geometryShape = {
  [ShapeType2D.CIRCLE]: circle,
  [ShapeType2D.HEXAGON]: hexagon,
  [ShapeType2D.TRIANGLE]: triangle,
  [ShapeType2D.SQUARE]: square,
  [ShapeType2D.PENTAGON]: pentagon,
  [ShapeType3D.CYLINDER]: circle,
  [ShapeType3D.HEXAGONCOLUMN]: hexagon,
  [ShapeType3D.TRIANGLECOLUMN]: triangle,
  [ShapeType3D.SQUARECOLUMN]: square,
  [ShapeType3D.PENTAGONCOLUMN]: pentagon,
};

function computeVertexNormals(
  p1: [number, number, number],
  p2: [number, number, number],
  p3: [number, number, number],
  needFlat: boolean = false,
) {
  const cb = vec3.create();
  const ab = vec3.create();
  const normal = vec3.create();

  if (needFlat) {
    p1 = lngLatToMeters(p1) as [number, number, number];
    p2 = lngLatToMeters(p2) as [number, number, number];
    p3 = lngLatToMeters(p3) as [number, number, number];
  }
  const pA = vec3.fromValues(...p1);
  const pB = vec3.fromValues(...p2);
  const pC = vec3.fromValues(...p3);
  vec3.sub(cb, pC, pB);
  vec3.sub(ab, pA, pB);
  vec3.cross(normal, cb, ab);
  const newNormal = vec3.create();
  vec3.normalize(newNormal, normal);

  return newNormal;
}

function extrude_PolygonNormal(
  path: IPath[],
  needFlat = false, // 是否需要转成平面坐标
): IExtrudeGeomety {
  const p1 = path[0][0];
  const p2 = path[0][path[0].length - 1];
  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    path[0] = path[0].slice(0, path[0].length - 1);
  }
  const n = path[0].length;
  const flattengeo = earcut.flatten(path);
  const { vertices, dimensions } = flattengeo;
  const positions = [];
  const indexArray = [];
  const normals = [];
  // 设置顶部z值 position uv
  for (let j = 0; j < vertices.length / dimensions; j++) {
    if (dimensions === 2) {
      positions.push(vertices[j * 2], vertices[j * 2 + 1], 1, -1, -1);
    } else {
      positions.push(vertices[j * 3], vertices[j * 3 + 1], 1, -1, -1);
    }
    normals.push(0, 0, 1);
  }
  const triangles = earcut(flattengeo.vertices, flattengeo.holes, flattengeo.dimensions);
  indexArray.push(...triangles);
  for (let i = 0; i < n; i++) {
    const prePoint = flattengeo.vertices.slice(i * dimensions, (i + 1) * dimensions);
    let nextPoint = flattengeo.vertices.slice((i + 1) * dimensions, (i + 2) * dimensions);
    if (nextPoint.length === 0) {
      nextPoint = flattengeo.vertices.slice(0, dimensions);
    }
    const indexOffset = positions.length / 5;
    positions.push(
      prePoint[0],
      prePoint[1],
      1,
      0,
      0,
      nextPoint[0],
      nextPoint[1],
      1,
      0.1,
      0,
      prePoint[0],
      prePoint[1],
      0,
      0,
      0.8,
      nextPoint[0],
      nextPoint[1],
      0,
      0.1,
      0.8,
    );
    const normal = computeVertexNormals(
      [nextPoint[0], nextPoint[1], 1],
      [prePoint[0], prePoint[1], 0],
      [prePoint[0], prePoint[1], 1],
      needFlat,
    );
    normals.push(...normal, ...normal, ...normal, ...normal);
    indexArray.push(...[1, 2, 0, 3, 2, 1].map((v) => v + indexOffset));
  }
  return {
    positions,
    index: indexArray,
    normals,
  };
}

function getGeometry(shape: ShapeType3D, needFlat = false): IExtrudeGeomety {
  if (GeometryCache && GeometryCache[shape]) {
    return GeometryCache[shape];
  }
  const path = geometryShape[shape] ? geometryShape[shape]() : geometryShape.cylinder();
  const geometry = extrude_PolygonNormal([path], needFlat);
  GeometryCache[shape] = geometry;
  return geometry;
}

export function PointExtrudeTriangulation(feature: IEncodeFeature) {
  console.log('PointExtrudeTriangulation');
  const { shape } = feature;
  const { positions, index, normals } = getGeometry(shape as ShapeType3D, false);
  return {
    vertices: positions,
    indices: index,
    normals,
    size: 5,
  };
}
