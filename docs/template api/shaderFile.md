## Shader

shader 文件主要存储图层的着色器代码，需要注意的是 L7 在打包的时候会将我们写的 shader 字符串中的标志位进行替换。

## 常见标志位

### picking

shader 的拾取模块，用于实现图层的拾取效果，一般在顶点着色器和着色器中都需要引入。

```glsl vert
#pragma include "picking"
...
void main() {
    ...
    setPickingColor(a_PickingColor);
}
```

```glsl frag
#pragma include "picking"
...
void main() {
    ...
    gl_FragColor = filterColor(gl_FragColor);
}
```

🌟 具体方法可以参考

- https://github.com/antvis/L7/blob/master/packages/core/src/shaders/picking.vert.glsl
- https://github.com/antvis/L7/blob/master/packages/core/src/shaders/picking.frag.glsl

#### filterColor

该方法在 pick 模块中被定义，用于判断选中并实现高亮。

### projection

提供将经纬度坐标转化为平面坐标的方法

- project_offset
- project_pixel
- project_position
- project_common_position_to_clipspace 🌟 具体方法可以参考 https://github.com/antvis/L7/blob/master/packages/core/src/shaders/projection.glsl

### project

提供投影相关的工具方法。 🌟 具体方法可以参考 https://github.com/antvis/L7/blob/master/packages/core/src/shaders/project.glsl

### sdf_2d

提供 sdf 形状方法函数。 🌟 具体方法可以参考 https://github.com/antvis/L7/blob/master/packages/core/src/shaders/sdf_2d.glsl

### styleMapping & styleMapping\*

数据纹理映射的相关方法，提供了从数据纹理中取值的标准方法。 🌟 具体方法可以参考

- https://github.com/antvis/L7/blob/master/packages/core/src/shaders/styleMapping.glsl
- https://github.com/antvis/L7/blob/master/packages/core/src/shaders/styleMappingCalOpacity.glsl
- https://github.com/antvis/L7/blob/master/packages/core/src/shaders/styleMappingCalStrokeOpacity.glsl
- https://github.com/antvis/L7/blob/master/packages/core/src/shaders/styleMappingCalStrokeWidth.glsl
- https://github.com/antvis/L7/blob/master/packages/core/src/shaders/styleMappingCalThetaOffset.glsl
