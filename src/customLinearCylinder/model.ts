import {
  BaseModel,
  IModelUniform,
  IModel,
  IEncodeFeature,
  gl,
  AttributeType,
  ITexture2D,
} from '@antv/l7';
import { generateColorRamp, getMask, IColorRamp } from '@antv/l7-utils';
import { frag, vert } from './shader';
import { calculateCentroid } from '../utils';
import { PointExtrudeTriangulation } from './triangulation';

interface ICustomLayerStyleOptions {
  opacity: number;
  rampColors?: IColorRamp;
}

export default class CustomModel extends BaseModel {
  protected colorTexture!: ITexture2D;

  public getUninforms(): IModelUniform {
    const { opacity = 1 } = this.layer.getLayerConfig() as ICustomLayerStyleOptions;

    if (this.rendererService.getDirty()) {
      this.colorTexture.bind();
    }

    return {
      u_opacity: opacity,
      u_texture: this.colorTexture, // 贴图
    };
  }

  public async initModels(): Promise<IModel[]> {
    this.updateTexture();
    return await this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const model = await this.layer.buildLayerModel({
      moduleName: 'customLinearCylinder',
      vertexShader: vert,
      fragmentShader: frag,
      triangulation: PointExtrudeTriangulation,
      depth: { enable: true },
    });
    return [model];
  }

  protected registerBuiltinAttributes() {
    // point layer size;
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
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size } = feature;
          if (size) {
            let buffersize: number[] = [];
            if (Array.isArray(size)) {
              buffersize = size.length === 2 ? [size[0], size[0], size[1]] : size;
            }
            if (!Array.isArray(size)) {
              buffersize = [size, size, size];
            }
            return buffersize;
          } else {
            return [2, 2, 2];
          }
        },
      },
    });

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
          normal: number[],
        ) => {
          return normal;
        },
      },
    });
    this.styleAttributeService.registerStyleAttribute({
      name: 'pos',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Pos',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (feature: IEncodeFeature, featureIdx: number) => {
          const coordinates = calculateCentroid(feature.coordinates);
          return [coordinates[0], coordinates[1], 0];
        },
      },
    });
  }

  public clearModels(): void {
    this.colorTexture?.destroy();
  }

  private updateTexture = () => {
    const { createTexture2D } = this.rendererService;
    if (this.colorTexture) {
      this.colorTexture.destroy();
    }
    const { rampColors } = this.layer.getLayerConfig() as ICustomLayerStyleOptions;
    const imageData = generateColorRamp(rampColors as IColorRamp);
    this.colorTexture = createTexture2D({
      data: new Uint8Array(imageData.data),
      width: imageData.width,
      height: imageData.height,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      min: gl.NEAREST,
      mag: gl.NEAREST,
      flipY: false,
    });
  };
}
