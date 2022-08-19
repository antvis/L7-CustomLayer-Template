import { BaseLayer } from '@antv/l7';
import CustomModel from './model';

export default class CustomArcLineLayer extends BaseLayer {
  public type: string = 'CustomArcLineLayer';

  public buildModels() {
    this.layerModel = new CustomModel(this);
    this.layerModel.initModels((models) => {
      this.models = models;
      this.layerService.updateLayerRenderList();
      this.renderLayers();
    });
  }
}
