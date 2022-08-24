import { BaseLayer } from '@antv/l7';
import CustomModel from './model';

export default class CustomPointSquareLayer extends BaseLayer {
  public type: string = 'CustomPointSquareLayer';

  public buildModels() {
    this.layerModel = new CustomModel(this);
    this.layerModel.initModels((models) => {
      this.models = models;
      this.layerService.updateLayerRenderList();
      this.renderLayers();
    });
  }
}
