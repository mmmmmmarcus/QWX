const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

const stars = [];
const meteors = [];
const STAR_COUNT = 75;

let width = 0;
let height = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);
let lastMeteorAt = 0;
let nextMeteorDelay = random(10000, 18000);
let lastFrameTime = 0;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randomStarShape() {
  return Math.random() < 0.28 ? "diamond" : "circle";
}

function randomStarFlareStrength(radius) {
  return radius > 1.14 && Math.random() < 0.025 ? random(1.06, 1.42) : 0;
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

  stars.length = 0;
  for (let i = 0; i < STAR_COUNT; i += 1) {
    stars.push(createStar());
  }
}

function createStar() {
  const radius = random(0.35, 1.45);

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r: radius,
    maxAlpha: random(0.25, 0.88),
    lifeProgress: Math.random(),
    lifeSpeed: random(0.00008, 0.00016),
    pulseSpeed: random(0.0018, 0.0032),
    pulseOffset: random(0, Math.PI * 2),
    shape: randomStarShape(),
    flareStrength: randomStarFlareStrength(radius),
    flareRotationBase: random(-0.16, 0.16),
    flareRotationSpeed: random(0.00008, 0.0002) * (Math.random() < 0.5 ? -1 : 1),
  };
}

function respawnStar(star) {
  star.x = Math.random() * width;
  star.y = Math.random() * height;
  star.r = random(0.35, 1.45);
  star.maxAlpha = random(0.25, 0.88);
  star.lifeProgress = 0;
  star.lifeSpeed = random(0.00008, 0.00016);
  star.pulseSpeed = random(0.0018, 0.0032);
  star.pulseOffset = random(0, Math.PI * 2);
  star.shape = randomStarShape();
  star.flareStrength = randomStarFlareStrength(star.r);
  star.flareRotationBase = random(-0.16, 0.16);
  star.flareRotationSpeed = random(0.00008, 0.0002) * (Math.random() < 0.5 ? -1 : 1);
}

function spawnMeteor(now) {
  meteors.push({
    x: random(width * 0.12, width * 0.88),
    y: random(-60, height * 0.22),
    length: random(130, 220),
    speed: random(8, 14),
    angle: random(Math.PI / 5, Math.PI / 3.8),
    life: 1,
    fade: random(0.01, 0.016),
    width: random(0.8, 1.8),
  });

  lastMeteorAt = now;
  nextMeteorDelay = random(10000, 18000);
}

function drawBackgroundGlow() {
  const gradient = ctx.createRadialGradient(
    width * 0.5,
    height * 0.55,
    0,
    width * 0.5,
    height * 0.55,
    width * 0.7
  );

  gradient.addColorStop(0, "rgba(16, 28, 62, 0.045)");
  gradient.addColorStop(0.55, "rgba(7, 11, 28, 0.025)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawStarFlare(star, flareIntensity, time) {
  const glowRadius = star.r * (13.5 + star.flareStrength * 14.5);
  const rotation = star.flareRotationBase + time * star.flareRotationSpeed;
  const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowRadius);

  glow.addColorStop(0, `rgba(255, 255, 255, ${flareIntensity * 0.1})`);
  glow.addColorStop(0.36, `rgba(198, 225, 255, ${flareIntensity * 0.075})`);
  glow.addColorStop(0.78, `rgba(166, 212, 255, ${flareIntensity * 0.03})`);
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
  ctx.scale(2.55, 0.46);
  const streakGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius * 0.98);
  streakGradient.addColorStop(0, `rgba(255, 255, 255, ${flareIntensity * 0.06})`);
  streakGradient.addColorStop(0.5, `rgba(176, 214, 255, ${flareIntensity * 0.04})`);
  streakGradient.addColorStop(1, "rgba(176, 214, 255, 0)");
  ctx.beginPath();
  ctx.fillStyle = streakGradient;
  ctx.arc(0, 0, glowRadius * 0.68, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(star.x, star.y);
  ctx.rotate(rotation * 0.72);
  const ghostOffsetX = glowRadius * 0.22;
  const ghostOffsetY = -glowRadius * 0.04;
  const ghostX = ghostOffsetX;
  const ghostY = ghostOffsetY;
  const ghost = ctx.createRadialGradient(ghostX, ghostY, 0, ghostX, ghostY, glowRadius * 0.62);
  ghost.addColorStop(0, `rgba(212, 232, 255, ${flareIntensity * 0.04})`);
  ghost.addColorStop(0.74, `rgba(164, 201, 255, ${flareIntensity * 0.018})`);
  ghost.addColorStop(1, "rgba(164, 201, 255, 0)");

  ctx.beginPath();
  ctx.fillStyle = ghost;
  ctx.arc(ghostX, ghostY, glowRadius * 0.52, 0, Math.PI * 2);
  ctx.fill();

  const coreRadius = star.r * (3.4 + star.flareStrength * 1.35);
  const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, coreRadius);
  coreGlow.addColorStop(0, `rgba(255, 255, 255, ${flareIntensity * 0.055})`);
  coreGlow.addColorStop(0.46, `rgba(235, 244, 255, ${flareIntensity * 0.04})`);
  coreGlow.addColorStop(1, "rgba(235, 244, 255, 0)");
  ctx.beginPath();
  ctx.fillStyle = coreGlow;
  ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = `rgba(214, 235, 255, ${flareIntensity * 0.024})`;
  ctx.lineWidth = 0.18 + star.flareStrength * 0.05;
  ctx.lineCap = "round";
  ctx.moveTo(-glowRadius * 0.4, 0);
  ctx.lineTo(glowRadius * 0.4, 0);
  ctx.moveTo(0, -glowRadius * 0.58);
  ctx.lineTo(0, glowRadius * 0.58);
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
    const flareWindow = Math.max(0, Math.min(1, (envelope - 0.5) / 0.5));
    const flareHold = Math.pow(Math.sin(flareWindow * Math.PI), 0.62);
    const flarePulse = 0.76 + Math.sin(time * star.pulseSpeed * 0.42 + star.pulseOffset * 0.7) * 0.24;
    const flarePulseGate = Math.max(0, Math.min(1, (flarePulse - 0.62) / 0.38));
    const flareIntensity =
      star.flareStrength * flareHold * Math.pow(flarePulseGate, 0.45);

    if (alpha <= 0.01) {
      continue;
    }

    if (flareIntensity > 0.01) {
      drawStarFlare(star, flareIntensity, time);
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

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

    if (star.shape === "circle" && star.r > 1.25) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(173, 216, 255, ${alpha * 0.18})`;
      ctx.lineWidth = 0.45;
      ctx.moveTo(star.x - star.r * 2.2, star.y);
      ctx.lineTo(star.x + star.r * 2.2, star.y);
      ctx.moveTo(star.x, star.y - star.r * 2.2);
      ctx.lineTo(star.x, star.y + star.r * 2.2);
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
    gradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.life * 0.9})`);
    gradient.addColorStop(0.25, `rgba(162, 220, 255, ${meteor.life * 0.52})`);
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

  ctx.clearRect(0, 0, width, height);

  drawBackgroundGlow();
  drawStars(now, delta);

  if (meteors.length === 0 && now - lastMeteorAt > nextMeteorDelay) {
    spawnMeteor(now);
  }

  drawMeteors();
  requestAnimationFrame(animate);
}

resize();
window.addEventListener("resize", resize);
requestAnimationFrame(animate);
