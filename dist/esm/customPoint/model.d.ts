import { BaseModel, IModelUniform, IModel } from '@antv/l7';
export default class CustomModel extends BaseModel {
  getUninforms(): IModelUniform;
  initModels(callbackModel: (models: IModel[]) => void): void;
  buildModels(callbackModel: (models: IModel[]) => void): Promise<void>;
  protected registerBuiltinAttributes(): void;
}
