## Readme

### 说明

- L7-CustomLayer-Template 仓库并没有提供 npm 的包，若有需求用户可以自己发布 npm 包。
- L7-CustomLayer-Template 仓库提供了一些常见的 L7 自定义组件，为用户提供了使用 L7 自定义图层的模版。
- L7-CustomLayer-Template 仓库提供的自定义组件并不一定是最佳写法，更多的是提供示意。
- L7-CustomLayer-Template 仓库提供的自定义组件写法构建的图层可以认为和 L7 本身提供的图层没有区别。

### 文件目录

- 我们在 src 目录下提供了 custom 开头的各个目录，每个目录提供了一个单独的自定义图层
- 我们在 src/index.ts 下导出自定义图层
- src/utils.ts 提供了常见的方法

#### 自定义图层文件说明

自定义图层一般有四个文件，triangulation 文件不是必须的。

- index 将自定义图层继承 BaseLayer，我们在这里设置 layer 的 type
- model 设置图层的 unifrom/attribute 参数，组装图层的绘制指令
- shader 图层的着色器代码，glsl es100
- triangulation 提供图层顶点的组装方法，用户在这里配置顶点位置以及顶点属性 🌟 这里简单的说明各个文件，详细内容可以查看对应的文档。

### 其他

- 大家有什么建议、想法可以加群讨论
- 欢迎大家提 PR 增加自己自定义图层！

<img width="400px" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*D-ygSppqYtIAAAAAAAAAAAAAARQnAQ"/>
