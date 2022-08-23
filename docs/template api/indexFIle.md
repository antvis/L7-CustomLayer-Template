## Index

- index 文件用于定义自己的图层类，一般只需要继承 BaseLayer 类即可。
- 重写 buildModel 方法，使用自己定义的 layerModel
- 设置 layer 的 type
- buildModels 会在 L7 的代码中被自动调用，执行 layerModel.initModels 方法
  - 🌟 layerModel.initModels 就是 model 文件中的方法

```js
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

```
