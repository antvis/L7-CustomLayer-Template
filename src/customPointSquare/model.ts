import { BaseModel, IModelUniform, IModel, IEncodeFeature, gl, AttributeType } from '@antv/l7';
import { PointFillTriangulation } from './triangulation';
import { frag, vert } from './shader';

interface ICustomLayerStyleOptions {
  opacity: number;
  strokeOpacity: number;
  strokeWidth: number;
  stroke: string;
  len: number;
  rotate: number;
}

export default class CustomModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      stroke = [1.0, 0.0, 0.0, 1.0],
      strokeOpacity = 1.0,
      strokeWidth = 0,
      len = 0.25,
      rotate = 0,
    } = this.layer.getLayerConfig() as ICustomLayerStyleOptions;
    return {
      u_len: len,
      u_rotate: rotate,
      u_opacity: opacity,
      u_stroke_opacity: strokeOpacity,
      u_stroke_width: strokeWidth,
      u_stroke_color: stroke as number[],
    };
  }

  public initModels(callbackModel: (models: IModel[]) => void) {
    this.buildModels(callbackModel);
  }

  public async buildModels(callbackModel: (models: IModel[]) => void) {
    this.layer
      .buildLayerModel({
        moduleName: 'customPointSquare',
        vertexShader: vert,
        fragmentShader: frag,
        triangulation: PointFillTriangulation,
        depth: { enable: false },
      })
      .then((model) => {
        callbackModel([model]);
      })
      .catch((err) => {
        console.warn(err);
        callbackModel([]);
      });
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_uv',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          return [vertex[2], vertex[3]];
        },
      },
    });
  }
}
