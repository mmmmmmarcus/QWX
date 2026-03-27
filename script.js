const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

const stars = [];
const meteors = [];

const DEFAULT_CONFIG = {
  starCount: 75,
  starRadiusMin: 0.35,
  starRadiusMax: 1.45,
  starMaxAlphaMin: 0.25,
  starMaxAlphaMax: 0.88,
  starLifeSpeedMin: 0.00008,
  starLifeSpeedMax: 0.00016,
  starPulseSpeedMin: 0.0018,
  starPulseSpeedMax: 0.0032,
  diamondRatio: 0.28,
  warmToneRatio: 0.18,
  coolToneRatio: 0.18,
  flareRadiusThreshold: 0.67,
  flareChance: 0.055,
  flareStrengthMin: 0.79,
  flareStrengthMax: 2.11,
  flareRotationBaseMin: -0.16,
  flareRotationBaseMax: 0.16,
  flareRotationSpeedMin: 0.00008,
  flareRotationSpeedMax: 0.0002,
  flareGlowRadiusBase: 4.9,
  flareGlowRadiusStrength: 8.9,
  flareGlowAlphaInner: 0.24,
  flareGlowAlphaMid: 0.038,
  flareGlowAlphaOuter: 0.014,
  flareStreakScaleX: 2.41,
  flareStreakScaleY: 0.18,
  flareStreakRadiusScale: 0.98,
  flareStreakArcScale: 0.68,
  flareStreakAlphaInner: 0.042,
  flareStreakAlphaMid: 0.021,
  flareGhostOffsetX: 0.22,
  flareGhostOffsetY: -0.04,
  flareGhostRadiusScale: 0.62,
  flareGhostArcScale: 0.52,
  flareGhostAlphaInner: 0.107,
  flareGhostAlphaMid: 0.018,
  flareCoreRadiusBase: 6.33,
  flareCoreRadiusStrength: 3.48,
  flareCoreAlphaInner: 0.076,
  flareCoreAlphaMid: 0.018,
  flareCrossAlpha: 0.024,
  flareCrossWidthBase: 0.18,
  flareCrossWidthStrength: 0.05,
  flareCrossLengthX: 0.4,
  flareCrossLengthY: 0.58,
  flareWindowStart: 0.5,
  flareWindowRange: 0.5,
  flareHoldPower: 0.62,
  flarePulseBase: 0.76,
  flarePulseAmplitude: 0.24,
  flarePulseTimeScale: 0.42,
  flarePulseOffsetScale: 0.7,
  flarePulseGateStart: 0.62,
  flarePulseGateRange: 0.38,
  flareIntensityPower: 0.45,
  largeStarCrossThreshold: 1.25,
  largeStarCrossAlpha: 0.18,
  largeStarCrossLineWidth: 0.45,
  largeStarCrossScale: 2.2,
  meteorSpawnXMin: 0.12,
  meteorSpawnXMax: 0.88,
  meteorSpawnYMin: -60,
  meteorSpawnYMaxFactor: 0.22,
  meteorLengthMin: 280,
  meteorLengthMax: 470,
  meteorSpeedMin: 2.7,
  meteorSpeedMax: 4.6,
  meteorAngleMin: 0.6283185307179586,
  meteorAngleMax: 0.8267349088394192,
  meteorFadeMin: 0.0038,
  meteorFadeMax: 0.006,
  meteorWidthMin: 0.8,
  meteorWidthMax: 1.8,
  meteorDelayMin: 10000,
  meteorDelayMax: 18000,
  meteorHeadAlpha: 0.9,
  meteorMidAlpha: 0.52,
  bgGlowCenterX: 0.5,
  bgGlowCenterY: 0.55,
  bgGlowRadius: 0.7,
  bgGlowInnerAlpha: 0.045,
  bgGlowMidAlpha: 0.025,
  cssBgBase: "#1c1c1c",
  cssGlowCyanAlpha: 0.05,
  cssGlowGoldAlpha: 0.025,
  cssBottomBlueAlpha: 0.06,
  cssMilkyBandOpacity: 0.16,
  cssMilkyCloudOpacity: 0.12,
  cssMilkyBandAngle: 118,
  cssMilkyBandCenter: 47,
  cssGrainOpacity: 0.5,
  cssCanvasSaturate: 0.94,
  cssCanvasContrast: 0.97,
  mobileMilkyBandOpacity: 0.24,
  mobileMilkyCloudOpacity: 0.18,
  mobileMilkyBandAngle: 106,
  mobileMilkyBandCenter: 44,
  mobileGrainOpacity: 0.42,
  mobileCanvasSaturate: 0.96,
  mobileCanvasContrast: 0.985,
  galaxyOpacity: 0,
  galaxyAngle: -0.72,
  galaxyWidth: 0.24,
  galaxyCoreStrength: 0,
  galaxyDustStrength: 0,
  galaxyDrift: 0.000018,
};

const CONFIG = structuredClone(DEFAULT_CONFIG);

const PARAM_DEFS = [
  {
    group: "星星",
    items: [
      { key: "starCount", label: "星星数量", min: 20, max: 180, step: 1, type: "int", respawn: true },
      { key: "starRadiusMin", label: "星星最小半径", min: 0.1, max: 2, step: 0.01, type: "float", respawn: true },
      { key: "starRadiusMax", label: "星星最大半径", min: 0.3, max: 3, step: 0.01, type: "float", respawn: true },
      { key: "starMaxAlphaMin", label: "星星最小亮度", min: 0.05, max: 1, step: 0.01, type: "float" },
      { key: "starMaxAlphaMax", label: "星星最大亮度", min: 0.1, max: 1.2, step: 0.01, type: "float" },
      { key: "starLifeSpeedMin", label: "生命周期最慢", min: 0.00002, max: 0.0005, step: 0.00001, type: "float" },
      { key: "starLifeSpeedMax", label: "生命周期最快", min: 0.00003, max: 0.0007, step: 0.00001, type: "float" },
      { key: "starPulseSpeedMin", label: "脉动最慢", min: 0.0005, max: 0.008, step: 0.0001, type: "float" },
      { key: "starPulseSpeedMax", label: "脉动最快", min: 0.0006, max: 0.01, step: 0.0001, type: "float" },
      { key: "diamondRatio", label: "菱形星比例", min: 0, max: 1, step: 0.01, type: "float", respawn: true },
      { key: "warmToneRatio", label: "暖色星比例", min: 0, max: 0.6, step: 0.01, type: "float", respawn: true },
      { key: "coolToneRatio", label: "冷色星比例", min: 0, max: 0.6, step: 0.01, type: "float", respawn: true },
    ],
  },
  {
    group: "耀斑",
    items: [
      { key: "flareRadiusThreshold", label: "耀斑半径门槛", min: 0.4, max: 2.2, step: 0.01, type: "float", respawn: true },
      { key: "flareChance", label: "耀斑出现概率", min: 0, max: 0.2, step: 0.001, type: "float", respawn: true },
      { key: "flareStrengthMin", label: "耀斑强度最小", min: 0.2, max: 3, step: 0.01, type: "float", respawn: true },
      { key: "flareStrengthMax", label: "耀斑强度最大", min: 0.2, max: 4, step: 0.01, type: "float", respawn: true },
      { key: "flareGlowRadiusBase", label: "外层晕染基础半径", min: 2, max: 30, step: 0.1, type: "float" },
      { key: "flareGlowRadiusStrength", label: "外层晕染附加强度", min: 0, max: 30, step: 0.1, type: "float" },
      { key: "flareGlowAlphaInner", label: "外层晕染中心亮度", min: 0, max: 0.3, step: 0.001, type: "float" },
      { key: "flareGlowAlphaMid", label: "外层晕染中段亮度", min: 0, max: 0.2, step: 0.001, type: "float" },
      { key: "flareGlowAlphaOuter", label: "外层晕染边缘亮度", min: 0, max: 0.1, step: 0.001, type: "float" },
      { key: "flareStreakScaleX", label: "横向耀斑宽度", min: 1, max: 5, step: 0.01, type: "float" },
      { key: "flareStreakScaleY", label: "横向耀斑厚度", min: 0.1, max: 1.4, step: 0.01, type: "float" },
      { key: "flareStreakAlphaInner", label: "横向耀斑中心亮度", min: 0, max: 0.2, step: 0.001, type: "float" },
      { key: "flareStreakAlphaMid", label: "横向耀斑边缘亮度", min: 0, max: 0.1, step: 0.001, type: "float" },
      { key: "flareGhostAlphaInner", label: "鬼影中心亮度", min: 0, max: 0.12, step: 0.001, type: "float" },
      { key: "flareGhostAlphaMid", label: "鬼影边缘亮度", min: 0, max: 0.08, step: 0.001, type: "float" },
      { key: "flareCoreRadiusBase", label: "内层晕染基础半径", min: 0.5, max: 8, step: 0.01, type: "float" },
      { key: "flareCoreRadiusStrength", label: "内层晕染附加强度", min: 0, max: 4, step: 0.01, type: "float" },
      { key: "flareCoreAlphaInner", label: "内层晕染中心亮度", min: 0, max: 0.15, step: 0.001, type: "float" },
      { key: "flareCoreAlphaMid", label: "内层晕染边缘亮度", min: 0, max: 0.12, step: 0.001, type: "float" },
      { key: "flareCrossAlpha", label: "十字感强度", min: 0, max: 0.08, step: 0.001, type: "float" },
      { key: "flareRotationBaseMin", label: "旋转角最小", min: -1, max: 0, step: 0.01, type: "float", respawn: true },
      { key: "flareRotationBaseMax", label: "旋转角最大", min: 0, max: 1, step: 0.01, type: "float", respawn: true },
      { key: "flareRotationSpeedMin", label: "旋转速度最慢", min: 0, max: 0.001, step: 0.00001, type: "float", respawn: true },
      { key: "flareRotationSpeedMax", label: "旋转速度最快", min: 0, max: 0.002, step: 0.00001, type: "float", respawn: true },
      { key: "flareWindowStart", label: "耀斑起始时机", min: 0, max: 0.95, step: 0.01, type: "float" },
      { key: "flareWindowRange", label: "耀斑持续区间", min: 0.05, max: 1, step: 0.01, type: "float" },
      { key: "flareHoldPower", label: "耀斑停留感", min: 0.1, max: 2, step: 0.01, type: "float" },
      { key: "flarePulseBase", label: "耀斑脉动基线", min: 0, max: 1, step: 0.01, type: "float" },
      { key: "flarePulseAmplitude", label: "耀斑脉动幅度", min: 0, max: 1, step: 0.01, type: "float" },
      { key: "flarePulseGateStart", label: "耀斑触发门槛", min: 0, max: 1, step: 0.01, type: "float" },
      { key: "flarePulseGateRange", label: "耀斑触发范围", min: 0.01, max: 1, step: 0.01, type: "float" },
      { key: "flareIntensityPower", label: "耀斑衰减力度", min: 0.1, max: 2, step: 0.01, type: "float" },
    ],
  },
  {
    group: "流星",
    items: [
      { key: "meteorDelayMin", label: "流星间隔最短", min: 1000, max: 60000, step: 100, type: "int" },
      { key: "meteorDelayMax", label: "流星间隔最长", min: 1000, max: 90000, step: 100, type: "int" },
      { key: "meteorLengthMin", label: "流星尾迹最短", min: 20, max: 800, step: 1, type: "int" },
      { key: "meteorLengthMax", label: "流星尾迹最长", min: 20, max: 1200, step: 1, type: "int" },
      { key: "meteorSpeedMin", label: "流星速度最慢", min: 0.2, max: 20, step: 0.1, type: "float" },
      { key: "meteorSpeedMax", label: "流星速度最快", min: 0.2, max: 30, step: 0.1, type: "float" },
      { key: "meteorFadeMin", label: "流星消散最慢", min: 0.0005, max: 0.03, step: 0.0001, type: "float" },
      { key: "meteorFadeMax", label: "流星消散最快", min: 0.0005, max: 0.04, step: 0.0001, type: "float" },
      { key: "meteorWidthMin", label: "流星最细宽度", min: 0.2, max: 4, step: 0.1, type: "float" },
      { key: "meteorWidthMax", label: "流星最粗宽度", min: 0.2, max: 6, step: 0.1, type: "float" },
      { key: "meteorHeadAlpha", label: "流星头部亮度", min: 0.1, max: 1.5, step: 0.01, type: "float" },
      { key: "meteorMidAlpha", label: "流星尾部亮度", min: 0.05, max: 1, step: 0.01, type: "float" },
    ],
  },
  {
    group: "氛围",
    items: [
      { key: "bgGlowInnerAlpha", label: "背景辉光中心", min: 0, max: 0.15, step: 0.001, type: "float" },
      { key: "bgGlowMidAlpha", label: "背景辉光边缘", min: 0, max: 0.08, step: 0.001, type: "float" },
      { key: "galaxyOpacity", label: "银河整体强度", min: 0, max: 0.5, step: 0.001, type: "float" },
      { key: "galaxyAngle", label: "银河倾斜角", min: -1.57, max: 1.57, step: 0.01, type: "float" },
      { key: "galaxyWidth", label: "银河宽度", min: 0.08, max: 0.8, step: 0.01, type: "float" },
      { key: "galaxyCoreStrength", label: "银河中心亮度", min: 0, max: 0.18, step: 0.001, type: "float" },
      { key: "galaxyDustStrength", label: "银河尘埃亮度", min: 0, max: 0.12, step: 0.001, type: "float" },
      { key: "galaxyDrift", label: "银河轻微漂移", min: 0, max: 0.00008, step: 0.000001, type: "float" },
      { key: "cssGlowCyanAlpha", label: "冷色氛围强度", min: 0, max: 0.15, step: 0.001, type: "float", css: true },
      { key: "cssGlowGoldAlpha", label: "暖色氛围强度", min: 0, max: 0.1, step: 0.001, type: "float", css: true },
      { key: "cssBottomBlueAlpha", label: "底部蓝雾强度", min: 0, max: 0.15, step: 0.001, type: "float", css: true },
      { key: "cssMilkyBandOpacity", label: "银河带强度", min: 0, max: 0.5, step: 0.001, type: "float", css: true },
      { key: "cssMilkyCloudOpacity", label: "银河云雾强度", min: 0, max: 0.5, step: 0.001, type: "float", css: true },
      { key: "cssMilkyBandAngle", label: "银河带角度", min: 0, max: 180, step: 1, type: "int", css: true },
      { key: "cssMilkyBandCenter", label: "银河带中心位置", min: 10, max: 90, step: 1, type: "int", css: true },
      { key: "cssGrainOpacity", label: "颗粒强度", min: 0, max: 1, step: 0.01, type: "float", css: true },
      { key: "cssCanvasSaturate", label: "画布饱和度", min: 0.5, max: 1.5, step: 0.01, type: "float", css: true },
      { key: "cssCanvasContrast", label: "画布对比度", min: 0.5, max: 1.5, step: 0.01, type: "float", css: true },
      { key: "mobileMilkyBandOpacity", label: "手机银河带强度", min: 0, max: 0.6, step: 0.001, type: "float", css: true },
      { key: "mobileMilkyCloudOpacity", label: "手机银河云雾", min: 0, max: 0.6, step: 0.001, type: "float", css: true },
      { key: "mobileMilkyBandAngle", label: "手机银河角度", min: 0, max: 180, step: 1, type: "int", css: true },
      { key: "mobileMilkyBandCenter", label: "手机银河中心", min: 10, max: 90, step: 1, type: "int", css: true },
      { key: "mobileGrainOpacity", label: "手机颗粒强度", min: 0, max: 1, step: 0.01, type: "float", css: true },
      { key: "mobileCanvasSaturate", label: "手机饱和度", min: 0.5, max: 1.5, step: 0.01, type: "float", css: true },
      { key: "mobileCanvasContrast", label: "手机对比度", min: 0.5, max: 1.5, step: 0.01, type: "float", css: true },
    ],
  },
];

let width = 0;
let height = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);
let lastMeteorAt = 0;
let nextMeteorDelay = 0;
let lastFrameTime = 0;
let needsRespawn = false;
let isPanelOpen = false;

const ui = createControlPanel();
applyCSSConfig();
resetMeteorTimer();

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function formatValue(value, def) {
  if (def.type === "int") {
    return String(Math.round(value));
  }

  if (Math.abs(value) >= 1000) {
    return value.toFixed(0);
  }

  if (Math.abs(value) >= 10) {
    return value.toFixed(2);
  }

  if (Math.abs(value) >= 1) {
    return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  }

  return value.toFixed(5).replace(/0+$/, "").replace(/\.$/, "");
}

function coerceValue(value, def) {
  const num = Number(value);
  if (Number.isNaN(num)) {
    return CONFIG[def.key];
  }

  const clamped = clamp(num, def.min, def.max);
  return def.type === "int" ? Math.round(clamped) : clamped;
}

function setConfigValue(key, value) {
  CONFIG[key] = value;

  if (key === "starRadiusMin" && CONFIG.starRadiusMin > CONFIG.starRadiusMax) {
    CONFIG.starRadiusMax = CONFIG.starRadiusMin;
    syncControl("starRadiusMax");
  }
  if (key === "starRadiusMax" && CONFIG.starRadiusMax < CONFIG.starRadiusMin) {
    CONFIG.starRadiusMin = CONFIG.starRadiusMax;
    syncControl("starRadiusMin");
  }
  if (key === "starMaxAlphaMin" && CONFIG.starMaxAlphaMin > CONFIG.starMaxAlphaMax) {
    CONFIG.starMaxAlphaMax = CONFIG.starMaxAlphaMin;
    syncControl("starMaxAlphaMax");
  }
  if (key === "starMaxAlphaMax" && CONFIG.starMaxAlphaMax < CONFIG.starMaxAlphaMin) {
    CONFIG.starMaxAlphaMin = CONFIG.starMaxAlphaMax;
    syncControl("starMaxAlphaMin");
  }
  if (key === "starLifeSpeedMin" && CONFIG.starLifeSpeedMin > CONFIG.starLifeSpeedMax) {
    CONFIG.starLifeSpeedMax = CONFIG.starLifeSpeedMin;
    syncControl("starLifeSpeedMax");
  }
  if (key === "starLifeSpeedMax" && CONFIG.starLifeSpeedMax < CONFIG.starLifeSpeedMin) {
    CONFIG.starLifeSpeedMin = CONFIG.starLifeSpeedMax;
    syncControl("starLifeSpeedMin");
  }
  if (key === "starPulseSpeedMin" && CONFIG.starPulseSpeedMin > CONFIG.starPulseSpeedMax) {
    CONFIG.starPulseSpeedMax = CONFIG.starPulseSpeedMin;
    syncControl("starPulseSpeedMax");
  }
  if (key === "starPulseSpeedMax" && CONFIG.starPulseSpeedMax < CONFIG.starPulseSpeedMin) {
    CONFIG.starPulseSpeedMin = CONFIG.starPulseSpeedMax;
    syncControl("starPulseSpeedMin");
  }
  if (key === "flareStrengthMin" && CONFIG.flareStrengthMin > CONFIG.flareStrengthMax) {
    CONFIG.flareStrengthMax = CONFIG.flareStrengthMin;
    syncControl("flareStrengthMax");
  }
  if (key === "flareStrengthMax" && CONFIG.flareStrengthMax < CONFIG.flareStrengthMin) {
    CONFIG.flareStrengthMin = CONFIG.flareStrengthMax;
    syncControl("flareStrengthMin");
  }
  if (key === "meteorDelayMin" && CONFIG.meteorDelayMin > CONFIG.meteorDelayMax) {
    CONFIG.meteorDelayMax = CONFIG.meteorDelayMin;
    syncControl("meteorDelayMax");
  }
  if (key === "meteorDelayMax" && CONFIG.meteorDelayMax < CONFIG.meteorDelayMin) {
    CONFIG.meteorDelayMin = CONFIG.meteorDelayMax;
    syncControl("meteorDelayMin");
  }
  if (key === "meteorLengthMin" && CONFIG.meteorLengthMin > CONFIG.meteorLengthMax) {
    CONFIG.meteorLengthMax = CONFIG.meteorLengthMin;
    syncControl("meteorLengthMax");
  }
  if (key === "meteorLengthMax" && CONFIG.meteorLengthMax < CONFIG.meteorLengthMin) {
    CONFIG.meteorLengthMin = CONFIG.meteorLengthMax;
    syncControl("meteorLengthMin");
  }
  if (key === "meteorSpeedMin" && CONFIG.meteorSpeedMin > CONFIG.meteorSpeedMax) {
    CONFIG.meteorSpeedMax = CONFIG.meteorSpeedMin;
    syncControl("meteorSpeedMax");
  }
  if (key === "meteorSpeedMax" && CONFIG.meteorSpeedMax < CONFIG.meteorSpeedMin) {
    CONFIG.meteorSpeedMin = CONFIG.meteorSpeedMax;
    syncControl("meteorSpeedMin");
  }
  if (key === "meteorFadeMin" && CONFIG.meteorFadeMin > CONFIG.meteorFadeMax) {
    CONFIG.meteorFadeMax = CONFIG.meteorFadeMin;
    syncControl("meteorFadeMax");
  }
  if (key === "meteorFadeMax" && CONFIG.meteorFadeMax < CONFIG.meteorFadeMin) {
    CONFIG.meteorFadeMin = CONFIG.meteorFadeMax;
    syncControl("meteorFadeMin");
  }
  if (key === "meteorWidthMin" && CONFIG.meteorWidthMin > CONFIG.meteorWidthMax) {
    CONFIG.meteorWidthMax = CONFIG.meteorWidthMin;
    syncControl("meteorWidthMax");
  }
  if (key === "meteorWidthMax" && CONFIG.meteorWidthMax < CONFIG.meteorWidthMin) {
    CONFIG.meteorWidthMin = CONFIG.meteorWidthMax;
    syncControl("meteorWidthMin");
  }

  syncControl(key);
  applyCSSConfig();
}

function syncControl(key) {
  const control = ui.controls.get(key);
  if (!control) {
    return;
  }

  const value = CONFIG[key];
  control.range.value = value;
  control.number.value = value;
  control.value.textContent = formatValue(value, control.def);
}

function resetMeteorTimer() {
  nextMeteorDelay = random(CONFIG.meteorDelayMin, CONFIG.meteorDelayMax);
}

function randomStarShape() {
  return Math.random() < CONFIG.diamondRatio ? "diamond" : "circle";
}

function randomStarTone() {
  const value = Math.random();

  if (value < CONFIG.warmToneRatio) {
    return {
      fill: [255, 232, 222],
      line: [255, 206, 186],
    };
  }

  if (value < CONFIG.warmToneRatio + CONFIG.coolToneRatio) {
    return {
      fill: [226, 240, 255],
      line: [184, 212, 255],
    };
  }

  return {
    fill: [255, 255, 255],
    line: [214, 230, 255],
  };
}

function randomStarFlareStrength(radius) {
  return radius > CONFIG.flareRadiusThreshold && Math.random() < CONFIG.flareChance
    ? random(CONFIG.flareStrengthMin, CONFIG.flareStrengthMax)
    : 0;
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  respawnAllStars();
}

function respawnAllStars() {
  stars.length = 0;
  for (let i = 0; i < CONFIG.starCount; i += 1) {
    stars.push(createStar());
  }
}

function createStar() {
  const radius = random(CONFIG.starRadiusMin, CONFIG.starRadiusMax);

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r: radius,
    maxAlpha: random(CONFIG.starMaxAlphaMin, CONFIG.starMaxAlphaMax),
    lifeProgress: Math.random(),
    lifeSpeed: random(CONFIG.starLifeSpeedMin, CONFIG.starLifeSpeedMax),
    pulseSpeed: random(CONFIG.starPulseSpeedMin, CONFIG.starPulseSpeedMax),
    pulseOffset: random(0, Math.PI * 2),
    shape: randomStarShape(),
    tone: randomStarTone(),
    flareStrength: randomStarFlareStrength(radius),
    flareRotationBase: random(CONFIG.flareRotationBaseMin, CONFIG.flareRotationBaseMax),
    flareRotationSpeed:
      random(CONFIG.flareRotationSpeedMin, CONFIG.flareRotationSpeedMax) *
      (Math.random() < 0.5 ? -1 : 1),
  };
}

function respawnStar(star) {
  star.x = Math.random() * width;
  star.y = Math.random() * height;
  star.r = random(CONFIG.starRadiusMin, CONFIG.starRadiusMax);
  star.maxAlpha = random(CONFIG.starMaxAlphaMin, CONFIG.starMaxAlphaMax);
  star.lifeProgress = 0;
  star.lifeSpeed = random(CONFIG.starLifeSpeedMin, CONFIG.starLifeSpeedMax);
  star.pulseSpeed = random(CONFIG.starPulseSpeedMin, CONFIG.starPulseSpeedMax);
  star.pulseOffset = random(0, Math.PI * 2);
  star.shape = randomStarShape();
  star.tone = randomStarTone();
  star.flareStrength = randomStarFlareStrength(star.r);
  star.flareRotationBase = random(CONFIG.flareRotationBaseMin, CONFIG.flareRotationBaseMax);
  star.flareRotationSpeed =
    random(CONFIG.flareRotationSpeedMin, CONFIG.flareRotationSpeedMax) *
    (Math.random() < 0.5 ? -1 : 1);
}

function spawnMeteor(now) {
  meteors.push({
    x: random(width * CONFIG.meteorSpawnXMin, width * CONFIG.meteorSpawnXMax),
    y: random(CONFIG.meteorSpawnYMin, height * CONFIG.meteorSpawnYMaxFactor),
    length: random(CONFIG.meteorLengthMin, CONFIG.meteorLengthMax),
    speed: random(CONFIG.meteorSpeedMin, CONFIG.meteorSpeedMax),
    angle: random(CONFIG.meteorAngleMin, CONFIG.meteorAngleMax),
    life: 1,
    fade: random(CONFIG.meteorFadeMin, CONFIG.meteorFadeMax),
    width: random(CONFIG.meteorWidthMin, CONFIG.meteorWidthMax),
  });

  lastMeteorAt = now;
  resetMeteorTimer();
}

function drawGalaxy(time) {
  if (CONFIG.galaxyOpacity <= 0.0005) {
    return;
  }

  const cx = width * 0.5;
  const cy = height * 0.52;
  const drift = time * CONFIG.galaxyDrift;
  const major = Math.max(width, height) * 0.92;
  const minor = Math.max(width, height) * CONFIG.galaxyWidth * 0.44;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(CONFIG.galaxyAngle);
  ctx.globalCompositeOperation = "screen";

  const band = ctx.createLinearGradient(-major, 0, major, 0);
  band.addColorStop(0, "rgba(120, 140, 176, 0)");
  band.addColorStop(0.12, `rgba(136, 154, 192, ${CONFIG.galaxyDustStrength * CONFIG.galaxyOpacity * 0.26})`);
  band.addColorStop(0.24, `rgba(188, 202, 228, ${CONFIG.galaxyDustStrength * CONFIG.galaxyOpacity * 0.72})`);
  band.addColorStop(0.33, `rgba(228, 234, 246, ${CONFIG.galaxyCoreStrength * CONFIG.galaxyOpacity * 1.15})`);
  band.addColorStop(0.44, `rgba(174, 188, 220, ${CONFIG.galaxyDustStrength * CONFIG.galaxyOpacity * 0.34})`);
  band.addColorStop(0.58, `rgba(220, 228, 244, ${CONFIG.galaxyCoreStrength * CONFIG.galaxyOpacity * 1.26})`);
  band.addColorStop(0.68, `rgba(168, 182, 214, ${CONFIG.galaxyDustStrength * CONFIG.galaxyOpacity * 0.33})`);
  band.addColorStop(0.82, `rgba(198, 208, 232, ${CONFIG.galaxyDustStrength * CONFIG.galaxyOpacity * 0.52})`);
  band.addColorStop(1, "rgba(120, 140, 176, 0)");

  ctx.save();
  ctx.scale(1.04, Math.max(0.16, CONFIG.galaxyWidth));
  ctx.beginPath();
  ctx.fillStyle = band;
  ctx.ellipse(0, Math.sin(drift * 42000) * 8, major, minor, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const knots = [
    { x: -0.34, y: -0.05, rx: 0.22, ry: 0.16, a: 1.12 },
    { x: -0.08, y: 0.02, rx: 0.18, ry: 0.12, a: 0.74 },
    { x: 0.14, y: -0.03, rx: 0.24, ry: 0.15, a: 1.24 },
    { x: 0.36, y: 0.04, rx: 0.16, ry: 0.11, a: 0.66 },
  ];

  for (const knot of knots) {
    const gx = major * knot.x;
    const gy = minor * knot.y;
    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, major * knot.rx);
    grad.addColorStop(0, `rgba(236, 240, 250, ${CONFIG.galaxyCoreStrength * CONFIG.galaxyOpacity * knot.a})`);
    grad.addColorStop(0.38, `rgba(196, 208, 232, ${CONFIG.galaxyDustStrength * CONFIG.galaxyOpacity * knot.a * 0.62})`);
    grad.addColorStop(1, "rgba(150, 166, 206, 0)");

    ctx.save();
    ctx.scale(1, Math.max(0.18, CONFIG.galaxyWidth * knot.ry / knot.rx));
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(gx, gy / Math.max(0.18, CONFIG.galaxyWidth * knot.ry / knot.rx), major * knot.rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  for (let i = 0; i < 18; i += 1) {
    const t = i / 17;
    const x = -major * 0.78 + major * 1.56 * t;
    const y = Math.sin(t * Math.PI * 3 + drift * 18000) * minor * 0.16;
    const dust = ctx.createRadialGradient(x, y, 0, x, y, major * 0.06);
    const dustAlpha = CONFIG.galaxyDustStrength * CONFIG.galaxyOpacity * (0.12 + (i % 4) * 0.05);
    dust.addColorStop(0, `rgba(232, 236, 246, ${dustAlpha})`);
    dust.addColorStop(0.42, `rgba(188, 198, 224, ${dustAlpha * 0.45})`);
    dust.addColorStop(1, "rgba(160, 176, 216, 0)");
    ctx.beginPath();
    ctx.fillStyle = dust;
    ctx.arc(x, y, major * 0.06, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawBackgroundGlow() {
  const gradient = ctx.createRadialGradient(
    width * CONFIG.bgGlowCenterX,
    height * CONFIG.bgGlowCenterY,
    0,
    width * CONFIG.bgGlowCenterX,
    height * CONFIG.bgGlowCenterY,
    width * CONFIG.bgGlowRadius
  );

  gradient.addColorStop(0, `rgba(16, 28, 62, ${CONFIG.bgGlowInnerAlpha})`);
  gradient.addColorStop(0.55, `rgba(7, 11, 28, ${CONFIG.bgGlowMidAlpha})`);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawStarFlare(star, flareIntensity, time) {
  const glowRadius = star.r * (CONFIG.flareGlowRadiusBase + star.flareStrength * CONFIG.flareGlowRadiusStrength);
  const rotation = star.flareRotationBase + time * star.flareRotationSpeed;
  const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowRadius);

  glow.addColorStop(0, `rgba(255, 255, 255, ${flareIntensity * CONFIG.flareGlowAlphaInner})`);
  glow.addColorStop(0.36, `rgba(198, 225, 255, ${flareIntensity * CONFIG.flareGlowAlphaMid})`);
  glow.addColorStop(0.78, `rgba(166, 212, 255, ${flareIntensity * CONFIG.flareGlowAlphaOuter})`);
  glow.addColorStop(1, "rgba(166, 212, 255, 0)");

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  ctx.beginPath();
  ctx.fillStyle = glow;
  ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(star.x, star.y);
  ctx.rotate(rotation);
  ctx.scale(CONFIG.flareStreakScaleX, CONFIG.flareStreakScaleY);
  const streakGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius * CONFIG.flareStreakRadiusScale);
  streakGradient.addColorStop(0, `rgba(255, 255, 255, ${flareIntensity * CONFIG.flareStreakAlphaInner})`);
  streakGradient.addColorStop(0.5, `rgba(176, 214, 255, ${flareIntensity * CONFIG.flareStreakAlphaMid})`);
  streakGradient.addColorStop(1, "rgba(176, 214, 255, 0)");
  ctx.beginPath();
  ctx.fillStyle = streakGradient;
  ctx.arc(0, 0, glowRadius * CONFIG.flareStreakArcScale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(star.x, star.y);
  ctx.rotate(rotation * 0.72);
  const ghostX = glowRadius * CONFIG.flareGhostOffsetX;
  const ghostY = glowRadius * CONFIG.flareGhostOffsetY;
  const ghost = ctx.createRadialGradient(ghostX, ghostY, 0, ghostX, ghostY, glowRadius * CONFIG.flareGhostRadiusScale);
  ghost.addColorStop(0, `rgba(212, 232, 255, ${flareIntensity * CONFIG.flareGhostAlphaInner})`);
  ghost.addColorStop(0.74, `rgba(164, 201, 255, ${flareIntensity * CONFIG.flareGhostAlphaMid})`);
  ghost.addColorStop(1, "rgba(164, 201, 255, 0)");

  ctx.beginPath();
  ctx.fillStyle = ghost;
  ctx.arc(ghostX, ghostY, glowRadius * CONFIG.flareGhostArcScale, 0, Math.PI * 2);
  ctx.fill();

  const coreRadius = star.r * (CONFIG.flareCoreRadiusBase + star.flareStrength * CONFIG.flareCoreRadiusStrength);
  const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, coreRadius);
  coreGlow.addColorStop(0, `rgba(255, 255, 255, ${flareIntensity * CONFIG.flareCoreAlphaInner})`);
  coreGlow.addColorStop(0.46, `rgba(235, 244, 255, ${flareIntensity * CONFIG.flareCoreAlphaMid})`);
  coreGlow.addColorStop(1, "rgba(235, 244, 255, 0)");
  ctx.beginPath();
  ctx.fillStyle = coreGlow;
  ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = `rgba(214, 235, 255, ${flareIntensity * CONFIG.flareCrossAlpha})`;
  ctx.lineWidth = CONFIG.flareCrossWidthBase + star.flareStrength * CONFIG.flareCrossWidthStrength;
  ctx.lineCap = "round";
  ctx.moveTo(-glowRadius * CONFIG.flareCrossLengthX, 0);
  ctx.lineTo(glowRadius * CONFIG.flareCrossLengthX, 0);
  ctx.moveTo(0, -glowRadius * CONFIG.flareCrossLengthY);
  ctx.lineTo(0, glowRadius * CONFIG.flareCrossLengthY);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawStars(time, delta) {
  for (const star of stars) {
    star.lifeProgress += delta * star.lifeSpeed;

    if (star.lifeProgress >= 1) {
      respawnStar(star);
    }

    const envelope = Math.sin(star.lifeProgress * Math.PI);
    const pulse = 0.82 + Math.sin(time * star.pulseSpeed + star.pulseOffset) * 0.18;
    const alpha = Math.max(0, Math.min(0.92, envelope * star.maxAlpha * pulse));
    const flareWindow = Math.max(0, Math.min(1, (envelope - CONFIG.flareWindowStart) / CONFIG.flareWindowRange));
    const flareHold = Math.pow(Math.sin(flareWindow * Math.PI), CONFIG.flareHoldPower);
    const flarePulse =
      CONFIG.flarePulseBase +
      Math.sin(time * star.pulseSpeed * CONFIG.flarePulseTimeScale + star.pulseOffset * CONFIG.flarePulseOffsetScale) *
        CONFIG.flarePulseAmplitude;
    const flarePulseGate = Math.max(
      0,
      Math.min(1, (flarePulse - CONFIG.flarePulseGateStart) / CONFIG.flarePulseGateRange)
    );
    const flareIntensity = star.flareStrength * flareHold * Math.pow(flarePulseGate, CONFIG.flareIntensityPower);

    if (alpha <= 0.01) {
      continue;
    }

    if (flareIntensity > 0.01) {
      drawStarFlare(star, flareIntensity, time);
    }

    const [fillR, fillG, fillB] = star.tone.fill;
    const [lineR, lineG, lineB] = star.tone.line;

    ctx.beginPath();
    ctx.fillStyle = `rgba(${fillR}, ${fillG}, ${fillB}, ${alpha})`;

    if (star.shape === "diamond") {
      ctx.moveTo(star.x, star.y - star.r * 1.3);
      ctx.lineTo(star.x + star.r * 1.08, star.y);
      ctx.lineTo(star.x, star.y + star.r * 1.3);
      ctx.lineTo(star.x - star.r * 1.08, star.y);
      ctx.closePath();
    } else {
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    }

    ctx.fill();

    if (star.shape === "circle" && star.r > CONFIG.largeStarCrossThreshold) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${lineR}, ${lineG}, ${lineB}, ${alpha * CONFIG.largeStarCrossAlpha})`;
      ctx.lineWidth = CONFIG.largeStarCrossLineWidth;
      ctx.moveTo(star.x - star.r * CONFIG.largeStarCrossScale, star.y);
      ctx.lineTo(star.x + star.r * CONFIG.largeStarCrossScale, star.y);
      ctx.moveTo(star.x, star.y - star.r * CONFIG.largeStarCrossScale);
      ctx.lineTo(star.x, star.y + star.r * CONFIG.largeStarCrossScale);
      ctx.stroke();
    }
  }
}

function drawMeteors() {
  for (let i = meteors.length - 1; i >= 0; i -= 1) {
    const meteor = meteors[i];
    const dx = Math.cos(meteor.angle) * meteor.speed;
    const dy = Math.sin(meteor.angle) * meteor.speed;

    meteor.x += dx;
    meteor.y += dy;
    meteor.life -= meteor.fade;

    const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
    const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;

    const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.life * CONFIG.meteorHeadAlpha})`);
    gradient.addColorStop(0.25, `rgba(162, 220, 255, ${meteor.life * CONFIG.meteorMidAlpha})`);
    gradient.addColorStop(1, "rgba(162, 220, 255, 0)");

    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = meteor.width;
    ctx.moveTo(meteor.x, meteor.y);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();

    if (meteor.life <= 0 || meteor.x - meteor.length > width || meteor.y - meteor.length > height) {
      meteors.splice(i, 1);
    }
  }
}

function animate(now) {
  const delta = lastFrameTime ? now - lastFrameTime : 16;
  lastFrameTime = now;

  if (needsRespawn) {
    respawnAllStars();
    meteors.length = 0;
    resetMeteorTimer();
    needsRespawn = false;
  }

  ctx.clearRect(0, 0, width, height);

  drawBackgroundGlow();
  drawGalaxy(now);
  drawStars(now, delta);

  if (meteors.length === 0 && now - lastMeteorAt > nextMeteorDelay) {
    spawnMeteor(now);
  }

  drawMeteors();
  requestAnimationFrame(animate);
}

function createControlPanel() {
  const fab = document.createElement("button");
  fab.className = "control-fab";
  fab.type = "button";
  fab.setAttribute("aria-label", "Open tuning panel");
  fab.textContent = "参";

  const panel = document.createElement("aside");
  panel.className = "control-panel";

  panel.innerHTML = `
    <div class="control-panel__header">
      <div>
        <h2>参数</h2>
        <p>极简调参，可复制 JSON</p>
      </div>
      <button type="button" class="control-panel__close" aria-label="Close panel">×</button>
    </div>
    <div class="control-panel__actions">
      <button type="button" data-action="reset">重置</button>
      <button type="button" data-action="copy">复制 JSON</button>
    </div>
    <div class="control-panel__groups"></div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  const groupsRoot = panel.querySelector(".control-panel__groups");
  const exportField = document.createElement("textarea");
  const closeBtn = panel.querySelector(".control-panel__close");
  const copyBtn = panel.querySelector('[data-action="copy"]');
  const resetBtn = panel.querySelector('[data-action="reset"]');
  const controls = new Map();

  for (const group of PARAM_DEFS) {
    const section = document.createElement("section");
    section.className = "control-group";

    const title = document.createElement("button");
    title.type = "button";
    title.className = "control-group__toggle";
    title.textContent = group.group;
    section.appendChild(title);

    const body = document.createElement("div");
    body.className = "control-group__body";
    if (group.group !== "耀斑") {
      section.classList.add("is-collapsed");
    }
    title.addEventListener("click", () => {
      section.classList.toggle("is-collapsed");
    });

    for (const def of group.items) {
      const row = document.createElement("label");
      row.className = "control-row";

      const head = document.createElement("div");
      head.className = "control-row__head";
      const name = document.createElement("span");
      name.textContent = def.label;
      const value = document.createElement("span");
      value.className = "control-row__value";
      value.textContent = formatValue(CONFIG[def.key], def);
      head.appendChild(name);
      head.appendChild(value);

      const inputs = document.createElement("div");
      inputs.className = "control-row__inputs";
      const range = document.createElement("input");
      range.type = "range";
      range.min = String(def.min);
      range.max = String(def.max);
      range.step = String(def.step);
      range.value = String(CONFIG[def.key]);

      const number = document.createElement("input");
      number.type = "number";
      number.min = String(def.min);
      number.max = String(def.max);
      number.step = String(def.step);
      number.value = String(CONFIG[def.key]);

      const onInput = (rawValue) => {
        const nextValue = coerceValue(rawValue, def);
        setConfigValue(def.key, nextValue);
        updateExportField();

        if (def.respawn) {
          needsRespawn = true;
        }
        if (def.key.startsWith("meteor")) {
          meteors.length = 0;
          resetMeteorTimer();
        }
      };

      range.addEventListener("input", () => onInput(range.value));
      number.addEventListener("change", () => onInput(number.value));

      inputs.appendChild(range);
      inputs.appendChild(number);
      row.appendChild(head);
      row.appendChild(inputs);
      body.appendChild(row);

      controls.set(def.key, { def, range, number, value });
    }

    section.appendChild(body);
    groupsRoot.appendChild(section);
  }

  function updateExportField() {
    exportField.value = JSON.stringify(CONFIG, null, 2);
  }

  function openPanel() {
    isPanelOpen = true;
    panel.classList.add("is-open");
    fab.classList.add("is-hidden");
  }

  function closePanel() {
    isPanelOpen = false;
    panel.classList.remove("is-open");
    fab.classList.remove("is-hidden");
  }

  fab.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);
  copyBtn.addEventListener("click", async () => {
    updateExportField();
    exportField.select();
    try {
      await navigator.clipboard.writeText(exportField.value);
      copyBtn.textContent = "已复制";
      setTimeout(() => {
        copyBtn.textContent = "复制 JSON";
      }, 1400);
    } catch {
      document.execCommand("copy");
      copyBtn.textContent = "已复制";
      setTimeout(() => {
        copyBtn.textContent = "复制 JSON";
      }, 1400);
    }
  });
  resetBtn.addEventListener("click", () => {
    Object.assign(CONFIG, structuredClone(DEFAULT_CONFIG));
    for (const key of controls.keys()) {
      syncControl(key);
    }
    applyCSSConfig();
    meteors.length = 0;
    resetMeteorTimer();
    needsRespawn = true;
    updateExportField();
  });

  updateExportField();

  return { fab, panel, exportField, controls, updateExportField, openPanel, closePanel };
}

function applyCSSConfig() {
  const root = document.documentElement;
  root.style.setProperty("--bg-base", CONFIG.cssBgBase);
  root.style.setProperty("--glow-cyan", `rgba(78, 122, 180, ${CONFIG.cssGlowCyanAlpha})`);
  root.style.setProperty("--glow-gold", `rgba(196, 164, 117, ${CONFIG.cssGlowGoldAlpha})`);
  root.style.setProperty("--bottom-blue", `rgba(43, 59, 120, ${CONFIG.cssBottomBlueAlpha})`);
  root.style.setProperty("--milky-band-opacity", String(CONFIG.cssMilkyBandOpacity));
  root.style.setProperty("--milky-cloud-opacity", String(CONFIG.cssMilkyCloudOpacity));
  root.style.setProperty("--milky-band-angle", `${CONFIG.cssMilkyBandAngle}deg`);
  root.style.setProperty("--milky-band-center", `${CONFIG.cssMilkyBandCenter}%`);
  root.style.setProperty("--grain-opacity", String(CONFIG.cssGrainOpacity));
  root.style.setProperty("--canvas-saturate", String(CONFIG.cssCanvasSaturate));
  root.style.setProperty("--canvas-contrast", String(CONFIG.cssCanvasContrast));
  root.style.setProperty("--mobile-milky-band-opacity", String(CONFIG.mobileMilkyBandOpacity));
  root.style.setProperty("--mobile-milky-cloud-opacity", String(CONFIG.mobileMilkyCloudOpacity));
  root.style.setProperty("--mobile-milky-band-angle", `${CONFIG.mobileMilkyBandAngle}deg`);
  root.style.setProperty("--mobile-milky-band-center", `${CONFIG.mobileMilkyBandCenter}%`);
  root.style.setProperty("--mobile-grain-opacity", String(CONFIG.mobileGrainOpacity));
  root.style.setProperty("--mobile-canvas-saturate", String(CONFIG.mobileCanvasSaturate));
  root.style.setProperty("--mobile-canvas-contrast", String(CONFIG.mobileCanvasContrast));
  ui?.updateExportField?.();
}

resize();
window.addEventListener("resize", resize);
requestAnimationFrame(animate);
