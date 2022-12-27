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

  public async initModels(): Promise<IModel[]> {
    return await this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const model = await this.layer.buildLayerModel({
      moduleName: 'customPolygon',
      vertexShader: vert,
      fragmentShader: frag,
      triangulation: polygonFillTriangulation,
      depth: { enable: false },
    });
    return [model];
  }

  protected registerBuiltinAttributes() {}
}
