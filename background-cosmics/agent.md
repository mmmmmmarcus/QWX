# BackgroundCosmics Agent Guide

## 项目目标

这是一个纯前端、无依赖的宇宙背景项目。

当前目标不是做“炫技型动态壁纸”，而是做一个克制、电影感、偏镜头散光风格的星空背景：

- 背景基色是 `#1C1C1C`
- 画面主体只有背景，不包含正文内容
- 星星整体稀疏，存在淡入淡出和重生
- 少量星星在最亮时出现柔和镜头耀斑
- 流星低频出现，存在感弱于星星
- 整体观感应偏安静、克制、电影感，而不是卡通、游戏 UI、科技炫光

## 文件职责

- `index.html`
  只保留全屏 `canvas`，不承担视觉逻辑。

- `style.css`
  负责静态氛围层：
  - 页面底色
  - 冷暖轻微光晕
  - 颗粒噪点
  - 纵向压暗
  - `canvas` 的整体滤镜

- `script.js`
  负责动态效果：
  - 星星生成、生命周期、重生
  - 圆形星和四边形星
  - 个别星星的耀斑
  - 流星生成与动画
  - 动画循环与 resize

## 当前视觉基准

如果后续继续调整，请尽量保持以下方向：

- 不要把背景改成纯黑，维持 `#1C1C1C` 的灰黑底
- 不要把星星数量拉高到“铺满屏幕”的程度
- 不要让流星频繁出现
- 不要让所有星星都带耀斑
- 不要把耀斑改成强烈十字星芒，当前方向更偏镜头散光
- 不要加入大面积中心聚光圆斑
- 不要把颗粒做得过重，以免像脏屏或压缩噪点

## 改动建议

优先从以下位置调参，不要先重写结构。

### 想调星星数量

改 `script.js` 里的 `STAR_COUNT`

### 想调星星出现/消失节奏

改 `createStar()` 和 `respawnStar()` 中这些参数：

- `lifeSpeed`
- `pulseSpeed`
- `maxAlpha`

说明：
- `lifeSpeed` 控制一颗星从淡入到淡出再消失的整体生命周期
- `pulseSpeed` 控制生命周期中的局部亮度起伏
- `maxAlpha` 控制星星峰值亮度

### 想调星星形状比例

改 `randomStarShape()`

当前是：
- 大多数为圆形
- 少数为四边形菱形星

### 想调耀斑出现概率

改 `randomStarFlareStrength(radius)`

说明：
- 这里只决定“哪些星星有资格出现耀斑”
- 不建议让小半径星星大面积带耀斑

### 想调耀斑风格

改 `drawStarFlare(star, flareIntensity)`

说明：
- 这里已经偏“镜头散光 / bloom / ghost”
- 如果继续往这个方向走，优先调光团半径、横向 streak、ghost 强度
- 不建议重新做成锐利十字星芒

### 想调耀斑持续时间

改 `drawStars()` 中：

- `flareWindow`
- `flarePulse`
- `flareIntensity`

说明：
- 这几个值决定耀斑在峰值前后停留多久
- 改这里比直接调透明度更合理

### 想调流星频率和存在感

改 `spawnMeteor()` 以及顶部的 `nextMeteorDelay`

重点参数：

- `nextMeteorDelay`
- `length`
- `speed`
- `fade`
- `width`

原则：
- 流星应是偶发事件，不应成为主角
- 优先降低频率，而不是堆更多透明度技巧

### 想调背景氛围

改 `style.css`

优先位置：

- `body` 的多层渐变
- `body::before` 的静态细颗粒星点
- `body::after` 的噪点和纵向压暗
- `#space` 的整体滤镜

原则：
- 如果画面太“脏”，先减 `body::after` 的 `opacity`
- 如果画面太“硬”，先调 `#space` 的 `filter`
- 如果画面太“空”，优先加轻微氛围层，不要马上暴增星星数量

## 不建议做的事

- 不要引入第三方库
- 不要把星星改成大量 DOM 节点
- 不要把 CSS 动画和 Canvas 动画混成多套星空系统
- 不要为了“更明显”就直接把所有 alpha 拉高
- 不要随意增加中心光斑或大面积径向暗角

## 验证方式

这个项目没有构建步骤。

本地检查建议：

1. 直接打开 `index.html`
2. 修改 `script.js` 后运行：

```bash
node --check script.js
```

3. 在桌面端和窄屏下都确认：
   - 背景能铺满
   - 不出现滚动条
   - 星星和流星不会明显卡顿

## 后续协作约定

如果未来继续迭代，优先做“小幅调参”，避免一次性大改风格。

除非明确要求改方向，否则默认保持当前关键词：

- restrained
- cinematic
- sparse
- soft lens flare
- low-frequency meteors
