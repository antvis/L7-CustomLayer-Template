import { BaseLayer } from '@antv/l7';
export default class CustomPointLayer extends BaseLayer {
  type: string;
  buildModels(): Promise<void>;
  protected initLayerModels(): Promise<void>;
}
