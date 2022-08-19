import {
  BaseModel,
  IModelUniform,
  IModel,
  ILayer,
  polygonFillTriangulation,
  IEncodeFeature,
  gl,
  AttributeType,
} from '@antv/l7';
import { frag, vert } from './shader';

interface ICustomLayerStyleOptions {
  opacity: number;
}

export default class CustomModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const { opacity = 1 } = this.layer.getLayerConfig() as ICustomLayerStyleOptions;
    return {
      u_opacity: opacity,
    };
  }

  public initModels(callbackModel: (models: IModel[]) => void) {
    this.buildModels(callbackModel);
  }

  public async buildModels(callbackModel: (models: IModel[]) => void) {
    this.layer
      .buildLayerModel({
        moduleName: 'customPolygon',
        vertexShader: vert,
        fragmentShader: frag,
        triangulation: polygonFillTriangulation,
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

  protected registerBuiltinAttributes() {}
}
