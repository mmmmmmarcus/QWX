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
  flareRadiusThreshold: 1.14,
  flareChance: 0.025,
  flareStrengthMin: 1.06,
  flareStrengthMax: 1.42,
  flareRotationBaseMin: -0.16,
  flareRotationBaseMax: 0.16,
  flareRotationSpeedMin: 0.00008,
  flareRotationSpeedMax: 0.0002,
  flareGlowRadiusBase: 13.5,
  flareGlowRadiusStrength: 14.5,
  flareGlowAlphaInner: 0.1,
  flareGlowAlphaMid: 0.075,
  flareGlowAlphaOuter: 0.03,
  flareStreakScaleX: 2.55,
  flareStreakScaleY: 0.46,
  flareStreakRadiusScale: 0.98,
  flareStreakArcScale: 0.68,
  flareStreakAlphaInner: 0.06,
  flareStreakAlphaMid: 0.04,
  flareGhostOffsetX: 0.22,
  flareGhostOffsetY: -0.04,
  flareGhostRadiusScale: 0.62,
  flareGhostArcScale: 0.52,
  flareGhostAlphaInner: 0.04,
  flareGhostAlphaMid: 0.018,
  flareCoreRadiusBase: 3.4,
  flareCoreRadiusStrength: 1.35,
  flareCoreAlphaInner: 0.055,
  flareCoreAlphaMid: 0.04,
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
  meteorAngleMin: Math.PI / 5,
  meteorAngleMax: Math.PI / 3.8,
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
};

const CONFIG = structuredClone(DEFAULT_CONFIG);

const PARAM_DEFS = [
  {
    group: "Stars",
    items: [
      { key: "starCount", label: "Star count", min: 20, max: 180, step: 1, type: "int", respawn: true },
      { key: "starRadiusMin", label: "Star radius min", min: 0.1, max: 2, step: 0.01, type: "float", respawn: true },
      { key: "starRadiusMax", label: "Star radius max", min: 0.3, max: 3, step: 0.01, type: "float", respawn: true },
      { key: "starMaxAlphaMin", label: "Star alpha min", min: 0.05, max: 1, step: 0.01, type: "float" },
      { key: "starMaxAlphaMax", label: "Star alpha max", min: 0.1, max: 1.2, step: 0.01, type: "float" },
      { key: "starLifeSpeedMin", label: "Life speed min", min: 0.00002, max: 0.0005, step: 0.00001, type: "float" },
      { key: "starLifeSpeedMax", label: "Life speed max", min: 0.00003, max: 0.0007, step: 0.00001, type: "float" },
      { key: "starPulseSpeedMin", label: "Pulse speed min", min: 0.0005, max: 0.008, step: 0.0001, type: "float" },
      { key: "starPulseSpeedMax", label: "Pulse speed max", min: 0.0006, max: 0.01, step: 0.0001, type: "float" },
      { key: "diamondRatio", label: "Diamond ratio", min: 0, max: 1, step: 0.01, type: "float", respawn: true },
      { key: "warmToneRatio", label: "Warm tone ratio", min: 0, max: 0.6, step: 0.01, type: "float", respawn: true },
      { key: "coolToneRatio", label: "Cool tone ratio", min: 0, max: 0.6, step: 0.01, type: "float", respawn: true },
    ],
  },
  {
    group: "Flares",
    items: [
      { key: "flareRadiusThreshold", label: "Flare radius threshold", min: 0.4, max: 2.2, step: 0.01, type: "float", respawn: true },
      { key: "flareChance", label: "Flare chance", min: 0, max: 0.2, step: 0.001, type: "float", respawn: true },
      { key: "flareStrengthMin", label: "Flare strength min", min: 0.2, max: 3, step: 0.01, type: "float", respawn: true },
      { key: "flareStrengthMax", label: "Flare strength max", min: 0.2, max: 4, step: 0.01, type: "float", respawn: true },
      { key: "flareGlowRadiusBase", label: "Glow radius base", min: 2, max: 30, step: 0.1, type: "float" },
      { key: "flareGlowRadiusStrength", label: "Glow radius strength", min: 0, max: 30, step: 0.1, type: "float" },
      { key: "flareGlowAlphaInner", label: "Glow alpha inner", min: 0, max: 0.3, step: 0.001, type: "float" },
      { key: "flareGlowAlphaMid", label: "Glow alpha mid", min: 0, max: 0.2, step: 0.001, type: "float" },
      { key: "flareGlowAlphaOuter", label: "Glow alpha outer", min: 0, max: 0.1, step: 0.001, type: "float" },
      { key: "flareStreakScaleX", label: "Streak scale X", min: 1, max: 5, step: 0.01, type: "float" },
      { key: "flareStreakScaleY", label: "Streak scale Y", min: 0.1, max: 1.4, step: 0.01, type: "float" },
      { key: "flareStreakAlphaInner", label: "Streak alpha inner", min: 0, max: 0.2, step: 0.001, type: "float" },
      { key: "flareStreakAlphaMid", label: "Streak alpha mid", min: 0, max: 0.1, step: 0.001, type: "float" },
      { key: "flareGhostAlphaInner", label: "Ghost alpha inner", min: 0, max: 0.12, step: 0.001, type: "float" },
      { key: "flareGhostAlphaMid", label: "Ghost alpha mid", min: 0, max: 0.08, step: 0.001, type: "float" },
      { key: "flareCoreRadiusBase", label: "Core radius base", min: 0.5, max: 8, step: 0.01, type: "float" },
      { key: "flareCoreRadiusStrength", label: "Core radius strength", min: 0, max: 4, step: 0.01, type: "float" },
      { key: "flareCoreAlphaInner", label: "Core alpha inner", min: 0, max: 0.15, step: 0.001, type: "float" },
      { key: "flareCoreAlphaMid", label: "Core alpha mid", min: 0, max: 0.12, step: 0.001, type: "float" },
      { key: "flareCrossAlpha", label: "Cross alpha", min: 0, max: 0.08, step: 0.001, type: "float" },
      { key: "flareRotationBaseMin", label: "Rotation base min", min: -1, max: 0, step: 0.01, type: "float", respawn: true },
      { key: "flareRotationBaseMax", label: "Rotation base max", min: 0, max: 1, step: 0.01, type: "float", respawn: true },
      { key: "flareRotationSpeedMin", label: "Rotation speed min", min: 0, max: 0.001, step: 0.00001, type: "float", respawn: true },
      { key: "flareRotationSpeedMax", label: "Rotation speed max", min: 0, max: 0.002, step: 0.00001, type: "float", respawn: true },
      { key: "flareWindowStart", label: "Flare window start", min: 0, max: 0.95, step: 0.01, type: "float" },
      { key: "flareWindowRange", label: "Flare window range", min: 0.05, max: 1, step: 0.01, type: "float" },
      { key: "flareHoldPower", label: "Flare hold power", min: 0.1, max: 2, step: 0.01, type: "float" },
      { key: "flarePulseBase", label: "Flare pulse base", min: 0, max: 1, step: 0.01, type: "float" },
      { key: "flarePulseAmplitude", label: "Flare pulse amplitude", min: 0, max: 1, step: 0.01, type: "float" },
      { key: "flarePulseGateStart", label: "Flare gate start", min: 0, max: 1, step: 0.01, type: "float" },
      { key: "flarePulseGateRange", label: "Flare gate range", min: 0.01, max: 1, step: 0.01, type: "float" },
      { key: "flareIntensityPower", label: "Flare intensity power", min: 0.1, max: 2, step: 0.01, type: "float" },
    ],
  },
  {
    group: "Meteors",
    items: [
      { key: "meteorDelayMin", label: "Meteor delay min", min: 1000, max: 60000, step: 100, type: "int" },
      { key: "meteorDelayMax", label: "Meteor delay max", min: 1000, max: 90000, step: 100, type: "int" },
      { key: "meteorLengthMin", label: "Meteor length min", min: 20, max: 800, step: 1, type: "int" },
      { key: "meteorLengthMax", label: "Meteor length max", min: 20, max: 1200, step: 1, type: "int" },
      { key: "meteorSpeedMin", label: "Meteor speed min", min: 0.2, max: 20, step: 0.1, type: "float" },
      { key: "meteorSpeedMax", label: "Meteor speed max", min: 0.2, max: 30, step: 0.1, type: "float" },
      { key: "meteorFadeMin", label: "Meteor fade min", min: 0.0005, max: 0.03, step: 0.0001, type: "float" },
      { key: "meteorFadeMax", label: "Meteor fade max", min: 0.0005, max: 0.04, step: 0.0001, type: "float" },
      { key: "meteorWidthMin", label: "Meteor width min", min: 0.2, max: 4, step: 0.1, type: "float" },
      { key: "meteorWidthMax", label: "Meteor width max", min: 0.2, max: 6, step: 0.1, type: "float" },
      { key: "meteorHeadAlpha", label: "Meteor head alpha", min: 0.1, max: 1.5, step: 0.01, type: "float" },
      { key: "meteorMidAlpha", label: "Meteor mid alpha", min: 0.05, max: 1, step: 0.01, type: "float" },
    ],
  },
  {
    group: "Atmosphere",
    items: [
      { key: "bgGlowInnerAlpha", label: "BG glow inner", min: 0, max: 0.15, step: 0.001, type: "float" },
      { key: "bgGlowMidAlpha", label: "BG glow mid", min: 0, max: 0.08, step: 0.001, type: "float" },
      { key: "cssGlowCyanAlpha", label: "CSS cyan glow", min: 0, max: 0.15, step: 0.001, type: "float", css: true },
      { key: "cssGlowGoldAlpha", label: "CSS gold glow", min: 0, max: 0.1, step: 0.001, type: "float", css: true },
      { key: "cssBottomBlueAlpha", label: "CSS bottom blue", min: 0, max: 0.15, step: 0.001, type: "float", css: true },
      { key: "cssMilkyBandOpacity", label: "Milky band opacity", min: 0, max: 0.5, step: 0.001, type: "float", css: true },
      { key: "cssMilkyCloudOpacity", label: "Milky cloud opacity", min: 0, max: 0.5, step: 0.001, type: "float", css: true },
      { key: "cssMilkyBandAngle", label: "Milky band angle", min: 0, max: 180, step: 1, type: "int", css: true },
      { key: "cssMilkyBandCenter", label: "Milky band center", min: 10, max: 90, step: 1, type: "int", css: true },
      { key: "cssGrainOpacity", label: "Grain opacity", min: 0, max: 1, step: 0.01, type: "float", css: true },
      { key: "cssCanvasSaturate", label: "Canvas saturate", min: 0.5, max: 1.5, step: 0.01, type: "float", css: true },
      { key: "cssCanvasContrast", label: "Canvas contrast", min: 0.5, max: 1.5, step: 0.01, type: "float", css: true },
      { key: "mobileMilkyBandOpacity", label: "Mobile milky opacity", min: 0, max: 0.6, step: 0.001, type: "float", css: true },
      { key: "mobileMilkyCloudOpacity", label: "Mobile milky cloud", min: 0, max: 0.6, step: 0.001, type: "float", css: true },
      { key: "mobileMilkyBandAngle", label: "Mobile milky angle", min: 0, max: 180, step: 1, type: "int", css: true },
      { key: "mobileMilkyBandCenter", label: "Mobile milky center", min: 10, max: 90, step: 1, type: "int", css: true },
      { key: "mobileGrainOpacity", label: "Mobile grain opacity", min: 0, max: 1, step: 0.01, type: "float", css: true },
      { key: "mobileCanvasSaturate", label: "Mobile saturate", min: 0.5, max: 1.5, step: 0.01, type: "float", css: true },
      { key: "mobileCanvasContrast", label: "Mobile contrast", min: 0.5, max: 1.5, step: 0.01, type: "float", css: true },
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
      fill: [255, 243, 238],
      line: [255, 223, 214],
    };
  }

  if (value < CONFIG.warmToneRatio + CONFIG.coolToneRatio) {
    return {
      fill: [239, 247, 255],
      line: [205, 225, 255],
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
  fab.textContent = "调";

  const panel = document.createElement("aside");
  panel.className = "control-panel";

  panel.innerHTML = `
    <div class="control-panel__header">
      <div>
        <h2>参数面板</h2>
        <p>实时调参，可复制 JSON 发回给我</p>
      </div>
      <button type="button" class="control-panel__close" aria-label="Close panel">×</button>
    </div>
    <div class="control-panel__actions">
      <button type="button" data-action="reset">重置默认</button>
      <button type="button" data-action="copy">复制参数 JSON</button>
    </div>
    <div class="control-panel__groups"></div>
    <div class="control-panel__export">
      <label for="config-export">导出参数</label>
      <textarea id="config-export" readonly spellcheck="false"></textarea>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  const groupsRoot = panel.querySelector(".control-panel__groups");
  const exportField = panel.querySelector("#config-export");
  const closeBtn = panel.querySelector(".control-panel__close");
  const copyBtn = panel.querySelector('[data-action="copy"]');
  const resetBtn = panel.querySelector('[data-action="reset"]');
  const controls = new Map();

  for (const group of PARAM_DEFS) {
    const section = document.createElement("section");
    section.className = "control-group";

    const title = document.createElement("h3");
    title.textContent = group.group;
    section.appendChild(title);

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
      section.appendChild(row);

      controls.set(def.key, { def, range, number, value });
    }

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
        copyBtn.textContent = "复制参数 JSON";
      }, 1400);
    } catch {
      document.execCommand("copy");
      copyBtn.textContent = "已复制";
      setTimeout(() => {
        copyBtn.textContent = "复制参数 JSON";
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
