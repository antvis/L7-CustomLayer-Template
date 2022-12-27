import { BaseModel, IModelUniform, IModel } from '@antv/l7';
export default class CustomModel extends BaseModel {
  getUninforms(): IModelUniform;
  initModels(): Promise<IModel[]>;
  buildModels(): Promise<IModel[]>;
  protected registerBuiltinAttributes(): void;
}
