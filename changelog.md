# 2022/12/27 升级 L7 2.12.0 渲染流程改动

1. index.tsx 文件方法改造，改造原有 buildModels 方法

```tsx
// old
  public buildModels() {
    this.layerModel = new CustomModel(this);
    this.layerModel.initModels((models) => {
      this.models = models;
      this.layerService.updateLayerRenderList();
      this.renderLayers();
    });
  }
```

```tsx
// new
  public async buildModels() {
    this.layerModel = new CustomModel(this);
    await this.initLayerModels();
  }

  protected async initLayerModels() {
    this.models.forEach((model) => model.destroy());
    this.models = [];
    this.models = await this.layerModel.initModels();
  }
```

2. 改造 model.ts 将 initModels/buildModels 的回调写法改为返回 Promise<IModel[]>

```ts
// old
public initModels(callbackModel: (models: IModel[]) => void) {
    this.buildModels(callbackModel);
  }

  public async buildModels(callbackModel: (models: IModel[]) => void) {
    this.layer
      .buildLayerModel({
        moduleName: 'customPolygon',
        vertexShader: vert,
        fragmentShader: frag,
        triangulation: polygonFillTriangulation,
        depth: { enable: false },
      })
      .then((model) => {
        callbackModel([model]);
      })
      .catch((err) => {
        console.warn(err);
        callbackModel([]);
      });
  }
```

```ts
// new
```
