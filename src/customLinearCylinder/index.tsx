import { BaseLayer } from '@antv/l7';
import CustomModel from './model';

export default class CustomlinearCylinder extends BaseLayer {
  public type: string = 'CustomLinearCylinderLayer';

  public async buildModels() {
    this.layerModel = new CustomModel(this);
    await this.initLayerModels();
  }

  protected async initLayerModels() {
    this.models.forEach((model) => model.destroy());
    this.models = [];
    this.models = await this.layerModel.initModels();
  }
}
