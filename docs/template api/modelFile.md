## Model

我们在 model 文件中定义 layer 的 model 模块，组装 layer 的绘制指定。其中有几个通用的方法。

### initModels

一般来说是 model 文件的入口方法，在 index 文件中的 buildModels 方法中被调用。  
🌟 名称可以修改，不一定是 initModels，只需要和 index 文件中的 buildModels 调用方法同名即可。

### buildModels

buildModels 是创建图层绘制指定的方法，其中包含图层的顶点、顶点属性的构建、unifrom 变量的装配，绘制参数的设置等。  
🌟 类比 webgl，model 模块就是创建程序对象（program）。

### getUninforms

getUnifroms 方法在每一帧的绘制中都会被调用，我们在这里可以设置，动态调整传递给 layer 着色器程序的 unifrom 变量。

### registerBuiltinAttributes

registerBuiltinAttributes 方法注册了许多处理顶点的方法，这些方法在执行 layer.buildLayerModel 的时候被执行（也就是 layerModel.buildModels），在 layer 生命周期中只执行一次。注册的方法固定。

🌟 注册方法中 update 回调方法的参数由 triangulation 中提供的方法确定，入口是 buildModels 指定的 triangulation 方法。

```js
// 在为 shader 的顶点属性传值
this.styleAttributeService.registerStyleAttribute({
    name: 'size',
    type: AttributeType.Attribute,
    descriptor: {
    name: 'a_Size',
    buffer: {
        usage: gl.DYNAMIC_DRAW,
        data: [],
        type: gl.FLOAT,
    },
    size: 3,
    update: (
        feature: IEncodeFeature, // 当前顶点绑定的图形数据
        featureIdx: number,      // 当前图形的编号
        vertex: number[],        // 当前顶点的顶点属性数组
        attributeIdx: number,    // 顶点编号
        normal: number[],        // 当前顶点的法线 如果有
    ) => {
        ...
        reutrn [x, y, z]
    },
    },
});
```

对应在 shader 中的代码。

```glsl es 100 & vert
attribute vec3 a_Size;
...
```

### getAnimateUniforms

当图层开启 animate 方法的时候生效，写法固定，用于往 shader 中传递 u_itme 的时间参数。

```js
  public getAnimateUniforms(): IModelUniform {
    const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;
    return {
      u_aimate: this.animateOption2Array(animateOption as IAnimateOption),
      u_time: this.layer.getLayerAnimateTime(),
    };
  }
```

### clearModels

在销毁 model 的时候会调用，用于清除在 model 阶段创建的资源，是各种纹理。

```js
  public clearModels(): void {
    this.texture?.destroy();
  }
```

### 其他

在 model 中我们为了满足自己的各种需求可以定义人一定函数，主要注意不要重写即可。

- 可以参考 baseModel https://github.com/antvis/L7/blob/master/packages/layers/src/core/BaseModel.ts
