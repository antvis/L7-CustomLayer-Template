import {
  BaseModel,
  IModelUniform,
  IModel,
  ILayerConfig,
  IEncodeFeature,
  gl,
  IAnimateOption,
  AttributeType,
} from '@antv/l7';
import { LineArcTriangulation } from './triangulation';
import { frag, vert } from './shader';

interface ICustomLayerStyleOptions {
  opacity: number;
  segmentNumber?: number;
  thetaOffset?: number; // 可选参数、设置弧线的偏移量
}

export default class CustomModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      segmentNumber = 30,
      thetaOffset = 0.314,
    } = this.layer.getLayerConfig() as ICustomLayerStyleOptions;
    return {
      u_opacity: opacity,
      u_thetaOffset: thetaOffset,
      segmentNumber,
    };
  }

  public async initModels(): Promise<IModel[]> {
    return await this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const { segmentNumber = 30 } = this.layer.getLayerConfig() as ICustomLayerStyleOptions;
    const model = await this.layer.buildLayerModel({
      moduleName: 'customArcLine',
      vertexShader: vert,
      fragmentShader: frag,
      triangulation: LineArcTriangulation,
      depth: { enable: false },
      segmentNumber,
    });
    return [model];
  }

  public getAnimateUniforms(): IModelUniform {
    const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;
    return {
      u_aimate: this.animateOption2Array(animateOption as IAnimateOption),
      u_time: this.layer.getLayerAnimateTime(),
    };
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size = 1 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'instance', // 弧线起始点信息
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Instance',
        buffer: {
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 4,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          return [vertex[3], vertex[4], vertex[5], vertex[6]];
        },
      },
    });
  }
}
