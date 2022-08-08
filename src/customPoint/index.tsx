import { BaseLayer } from '@antv/l7';
import CustomModel from './model';

export default class CustomPointLayer extends BaseLayer {
  public type: string = 'CustomPointLayer';

  public buildModels() {
    this.layerModel = new CustomModel(this);
    this.layerModel.initModels((models) => {
      this.models = models;
      this.layerService.updateLayerRenderList();
      this.renderLayers();
    });
  }
}
