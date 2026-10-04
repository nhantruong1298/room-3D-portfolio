import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomObjectId } from '../types';
import { ROOM_OBJECTS_CONFIG, ROOM_STATIC_CAMERA } from '../data/cvData';
import { playSound } from '../utils/audio';

interface ThreeRoomProps {
  selectedObjectId: RoomObjectId | null;
  onSelectObject: (id: RoomObjectId) => void;
  onResetView: () => void;
}

// Generate high-resolution Kawaii Anime Screen Texture
function createWin7MonitorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Sleek Cybernetic / Dev Workspace Desktop Wallpaper
  const bgGrad = ctx.createRadialGradient(512, 270, 20, 512, 270, 560);
  bgGrad.addColorStop(0, '#0f2b48');
  bgGrad.addColorStop(0.45, '#091c33');
  bgGrad.addColorStop(0.8, '#040d1a');
  bgGrad.addColorStop(1, '#02060c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 640);

  // High-Tech Matrix / Geometric Ray lines
  ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(320 + i * 60, 0);
    ctx.lineTo(540 + i * 80, 640);
    ctx.lineTo(470 + i * 80, 640);
    ctx.lineTo(250 + i * 60, 0);
    ctx.fill();
  }

  // 2. Central Custom Developer "DevOS" Nexus Logo Emblem
  const cx = 512;
  const cy = 245;

  // Luminous blue/cyan aura
  const aura = ctx.createRadialGradient(cx, cy, 10, cx, cy, 145);
  aura.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
  aura.addColorStop(0.6, 'rgba(14, 116, 144, 0.15)');
  aura.addColorStop(1, 'rgba(2, 6, 12, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, 145, 0, Math.PI * 2);
  ctx.fill();

  // Central Geometric Hexagon Tech Shield
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  const hexRadius = 55;
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const hx = hexRadius * Math.cos(angle);
    const hy = hexRadius * Math.sin(angle);
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.closePath();
  const hexGrad = ctx.createLinearGradient(-50, -50, 50, 50);
  hexGrad.addColorStop(0, 'rgba(14, 165, 233, 0.35)');
  hexGrad.addColorStop(1, 'rgba(16, 185, 129, 0.2)');
  ctx.fillStyle = hexGrad;
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Code brackets symbol </ > in center
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "JetBrains Mono", monospace';
  ctx.fillText('</>', 0, 0);
  ctx.restore();

  // DevOS Typography
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DevOS', cx, cy + 105);
  ctx.fillStyle = 'rgba(147, 197, 253, 0.85)';
  ctx.font = '600 12px "JetBrains Mono", monospace';
  ctx.fillText('WORKSTATION • NGUYEN VAN NHAN', cx, cy + 128);

  // 3. Desktop Shortcut Icon: Resume.pdf
  ctx.textAlign = 'left';
  const iconX = 60;
  const iconY = 60;

  // Icon highlight box
  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.beginPath();
  ctx.roundRect(iconX - 10, iconY - 10, 110, 125, 6);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // PDF Document Sheet
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(iconX + 18, iconY, 54, 68, 4);
  ctx.fill();

  // Red PDF Header
  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.roundRect(iconX + 22, iconY + 6, 46, 18, 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('PDF', iconX + 34, iconY + 19);

  // Document lines
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(iconX + 24, iconY + 32, 42, 3);
  ctx.fillRect(iconX + 24, iconY + 40, 34, 3);
  ctx.fillRect(iconX + 24, iconY + 48, 38, 3);

  // Windows Shortcut Overlay Arrow
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(iconX + 12, iconY + 48, 20, 20, 3);
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#2563eb';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('↗', iconX + 16, iconY + 63);

  // Label text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px "Segoe UI", sans-serif';
  ctx.fillText('Resume', iconX + 22, iconY + 92);

  // 4. Sleek Modern Taskbar at Bottom
  const tbGrad = ctx.createLinearGradient(0, 585, 0, 640);
  tbGrad.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
  tbGrad.addColorStop(1, 'rgba(2, 6, 23, 0.98)');
  ctx.fillStyle = tbGrad;
  ctx.fillRect(0, 585, 1024, 55);

  // Top taskbar line highlight
  ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.fillRect(0, 585, 1024, 1.5);

  // Custom Start Orb (Glowing Cyan-Emerald Code Button)
  const orbGrad = ctx.createRadialGradient(32, 608, 2, 32, 608, 22);
  orbGrad.addColorStop(0, '#38bdf8');
  orbGrad.addColorStop(0.7, '#0284c7');
  orbGrad.addColorStop(1, '#0369a1');
  ctx.fillStyle = orbGrad;
  ctx.beginPath();
  ctx.arc(32, 608, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Code symbol inside orb
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('</>', 32, 609);

  // Taskbar Pinned App: Resume Button
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.beginPath();
  ctx.roundRect(70, 590, 150, 42, 6);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.stroke();

  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.roundRect(80, 598, 24, 26, 3);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px sans-serif';
  ctx.fillText('PDF', 83, 614);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px "Segoe UI", sans-serif';
  ctx.fillText('Resume', 116, 616);

  // System Tray on Right
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = '13px "Segoe UI", sans-serif';
  ctx.fillText('10:24 AM', 915, 608);
  ctx.font = '11px "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(200, 230, 255, 0.7)';
  ctx.fillText('08/26/2026', 908, 624);

  // Show Desktop aero sliver at far right
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.fillRect(1008, 585, 16, 55);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

// Generate Masculine Matte Black Ceramic Tumbler Texture
function createTumblerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, 256, 256);

  // Matte charcoal texture subtle vertical grain
  ctx.fillStyle = '#27272a';
  for (let i = 0; i < 256; i += 4) {
    ctx.fillRect(i, 0, 1, 256);
  }

  // Laser engraved clean badge
  ctx.strokeStyle = '#71717a';
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 90, 160, 76);

  ctx.fillStyle = '#e4e4e7';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('</DEV_NHAN>', 128, 136);

  return new THREE.CanvasTexture(canvas);
}

// Outside winter sky texture with falling snow (call update() every frame)
function createWinterSkyTexture(): { texture: THREE.CanvasTexture; update: (t: number) => void } {
  const SIZE = 512;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  if (!ctx) return { texture, update: () => {} };

  // Static background drawn once to an offscreen canvas
  const bg = document.createElement('canvas');
  bg.width = SIZE;
  bg.height = SIZE;
  const bgCtx = bg.getContext('2d');
  if (bgCtx) {
    // Overcast winter sky gradient (cool grey-blue to pale horizon)
    const grad = bgCtx.createLinearGradient(0, 0, 0, SIZE);
    grad.addColorStop(0, '#94a3b8');
    grad.addColorStop(0.55, '#cbd5e1');
    grad.addColorStop(0.8, '#e2e8f0');
    grad.addColorStop(1, '#f1f5f9');
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, SIZE, SIZE);

    // Pale winter sun behind the clouds
    const sun = bgCtx.createRadialGradient(380, 140, 0, 380, 140, 70);
    sun.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    sun.addColorStop(1, 'rgba(255, 255, 255, 0)');
    bgCtx.fillStyle = sun;
    bgCtx.fillRect(0, 0, SIZE, SIZE);

    // Soft grey snow clouds
    const drawCloud = (cx: number, cy: number, r: number) => {
      bgCtx.beginPath();
      bgCtx.arc(cx, cy, r, 0, Math.PI * 2);
      bgCtx.arc(cx + r * 0.7, cy - r * 0.2, r * 0.8, 0, Math.PI * 2);
      bgCtx.arc(cx + r * 1.3, cy + r * 0.1, r * 0.75, 0, Math.PI * 2);
      bgCtx.arc(cx + r * 0.5, cy + r * 0.4, r * 0.9, 0, Math.PI * 2);
      bgCtx.fill();
    };
    bgCtx.fillStyle = 'rgba(241, 245, 249, 0.75)';
    drawCloud(60, 90, 50);
    drawCloud(300, 60, 60);
    drawCloud(180, 170, 40);

    // Distant snowy hills
    bgCtx.fillStyle = '#e2e8f0';
    bgCtx.beginPath();
    bgCtx.moveTo(0, 400);
    bgCtx.quadraticCurveTo(130, 330, 260, 390);
    bgCtx.quadraticCurveTo(390, 340, SIZE, 380);
    bgCtx.lineTo(SIZE, SIZE);
    bgCtx.lineTo(0, SIZE);
    bgCtx.fill();

    // Snow-covered pine trees
    const drawPine = (x: number, baseY: number, h: number) => {
      bgCtx.fillStyle = '#334155';
      bgCtx.fillRect(x - h * 0.04, baseY - h * 0.12, h * 0.08, h * 0.12);
      for (let i = 0; i < 3; i++) {
        const tierY = baseY - h * 0.12 - i * h * 0.26;
        const w = h * (0.42 - i * 0.1);
        bgCtx.fillStyle = '#1e3a3a';
        bgCtx.beginPath();
        bgCtx.moveTo(x - w, tierY);
        bgCtx.lineTo(x, tierY - h * 0.38);
        bgCtx.lineTo(x + w, tierY);
        bgCtx.fill();
        // Snow cap on each tier
        bgCtx.fillStyle = '#f8fafc';
        bgCtx.beginPath();
        bgCtx.moveTo(x - w * 0.45, tierY - h * 0.2);
        bgCtx.lineTo(x, tierY - h * 0.38);
        bgCtx.lineTo(x + w * 0.45, tierY - h * 0.2);
        bgCtx.fill();
      }
    };
    drawPine(70, 440, 120);
    drawPine(150, 430, 90);
    drawPine(420, 445, 130);
    drawPine(480, 425, 80);

    // Snowy ground in front
    bgCtx.fillStyle = '#f8fafc';
    bgCtx.beginPath();
    bgCtx.moveTo(0, 440);
    bgCtx.quadraticCurveTo(256, 410, SIZE, 445);
    bgCtx.lineTo(SIZE, SIZE);
    bgCtx.lineTo(0, SIZE);
    bgCtx.fill();
  }

  // Falling snowflakes
  const flakes = Array.from({ length: 140 }, () => ({
    x: Math.random() * SIZE,
    y: Math.random() * SIZE,
    r: 0.8 + Math.random() * 2.2,
    speed: 18 + Math.random() * 30,
    drift: Math.random() * Math.PI * 2,
  }));

  let lastT = 0;
  const update = (t: number) => {
    const dt = Math.min(t - lastT, 0.1);
    lastT = t;
    ctx.drawImage(bg, 0, 0);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (const f of flakes) {
      f.y += f.speed * f.r * 0.5 * dt;
      if (f.y > SIZE + 4) {
        f.y = -4;
        f.x = Math.random() * SIZE;
      }
      const x = (f.x + Math.sin(t * 0.8 + f.drift) * 6 + SIZE) % SIZE;
      ctx.beginPath();
      ctx.arc(x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    texture.needsUpdate = true;
  };
  update(0);

  return { texture, update };
}

// Christmas wallpaper: warm cream with soft red stripes, gold stars and snowflakes
function createChristmasWallpaperTexture(): THREE.CanvasTexture {
  const SIZE = 256;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  if (!ctx) return texture;

  ctx.fillStyle = '#fbf3e4';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Soft vertical red stripes
  ctx.fillStyle = 'rgba(185, 28, 28, 0.12)';
  ctx.fillRect(0, 0, 18, SIZE);
  ctx.fillRect(128, 0, 18, SIZE);

  // Small gold stars
  const drawStar = (cx: number, cy: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 === 0 ? r : r * 0.45;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill();
  };
  ctx.fillStyle = '#d4a017';
  drawStar(73, 64, 9);
  drawStar(201, 192, 9);

  // Small green snowflakes
  const drawSnowflake = (cx: number, cy: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const a = (Math.PI / 3) * i;
      ctx.moveTo(cx - Math.cos(a) * r, cy - Math.sin(a) * r);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    ctx.stroke();
  };
  ctx.strokeStyle = 'rgba(21, 128, 61, 0.55)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  drawSnowflake(201, 64, 9);
  drawSnowflake(73, 192, 9);

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const ThreeRoom: React.FC<ThreeRoomProps> = ({
  selectedObjectId,
  onSelectObject,
  onResetView,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredComputer, setHoveredComputer] = useState<boolean>(false);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const interactiveMeshesRef = useRef<Set<THREE.Object3D>>(new Set());

  // Chair swivel pivot ref for rotation animation
  const chairSwivelGroupRef = useRef<THREE.Group | null>(null);

  // Tracking pointer for Drag vs Click disambiguation
  const pointerDownPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pointerDownTime = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  // Camera smooth focus transition
  const isAnimatingFocus = useRef<boolean>(false);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(...ROOM_STATIC_CAMERA.position));
  const targetCamLook = useRef<THREE.Vector3>(new THREE.Vector3(...ROOM_STATIC_CAMERA.target));
  const targetFov = useRef<number>(ROOM_STATIC_CAMERA.fov);

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Setup Three.js Anime Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a); // dark cosmic container background

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      ROOM_STATIC_CAMERA.fov,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(...ROOM_STATIC_CAMERA.position);
    camera.lookAt(...ROOM_STATIC_CAMERA.target);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and soft shadows
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls: Smooth, gentle 360 rotation around center
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.35; // Gentle and slower rotation speed
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // don't go below floor
    controls.minPolarAngle = 0.2; // don't flip inverted
    controls.minDistance = 2.4;
    controls.maxDistance = 12.0;
    controls.target.set(...ROOM_STATIC_CAMERA.target);
    controlsRef.current = controls;

    // 5. Lighting: Warm Cozy Anime Golden Hour / Daylight
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4);
    scene.add(ambientLight);

    // Cool winter daylight streaming through the Window
    const sunLight = new THREE.DirectionalLight(0xe0ecff, 2.0);
    sunLight.position.set(2.8, 4.5, -4.5);
    sunLight.target.position.set(0, 0.5, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 16;
    sunLight.shadow.camera.left = -4;
    sunLight.shadow.camera.right = 4;
    sunLight.shadow.camera.top = 4;
    sunLight.shadow.camera.bottom = -4;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);
    scene.add(sunLight.target);

    // Front soft pastel fill light
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.9);
    fillLight.position.set(4, 5, 5);
    scene.add(fillLight);

    // Monitor soft cyan underglow LED
    const monitorGlow = new THREE.PointLight(0x38bdf8, 2.2, 3.2);
    monitorGlow.position.set(0.85, 1.1, -1.16);
    scene.add(monitorGlow);

    // Warm desk lamp glow
    const deskLampGlow = new THREE.PointLight(0xfef08a, 1.5, 2.0);
    deskLampGlow.position.set(0.11, 1.12, -1.62); // just below the desk lamp bulb
    scene.add(deskLampGlow);

    // 6. Materials (Aesthetic Anime Palette)
    const floorWoodMat = new THREE.MeshStandardMaterial({
      color: 0xdeb887, // warm honey blonde oak
      roughness: 0.38,
      metalness: 0.05,
    });

    const wallPastelMat = new THREE.MeshStandardMaterial({
      map: createChristmasWallpaperTexture(), // Christmas wallpaper
      roughness: 0.85,
    });

    const woodTrimMat = new THREE.MeshStandardMaterial({
      color: 0xc49a6c,
      roughness: 0.5,
    });

    const deskTopMat = new THREE.MeshStandardMaterial({
      color: 0xfbf8f2, // clean minimalist warm white/cream oak
      roughness: 0.3,
    });

    const deskWoodMat = new THREE.MeshStandardMaterial({
      color: 0xd9a774, // warm blonde wood for legs & trim
      roughness: 0.45,
    });

    const pastelMatDesk = new THREE.MeshStandardMaterial({
      color: 0x18181b, // stealth matte dark charcoal/black desk pad
      roughness: 0.8,
    });

    const monitorBezelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // sleek matte dark gunmetal
      roughness: 0.2,
      metalness: 0.8,
    });

    const monitorScreenMat = new THREE.MeshStandardMaterial({
      map: createWin7MonitorTexture(),
      roughness: 0.15,
      emissive: 0xffffff,
      emissiveIntensity: 0.38,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.92,
      roughness: 0.12,
    });

    const chairFabricMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // masculine dark slate / carbon
      roughness: 0.6,
    });

    const chairCushionMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.5,
    });

    const winterSky = createWinterSkyTexture();
    const windowGlassMat = new THREE.MeshBasicMaterial({
      map: winterSky.texture,
    });

    const curtainMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      transparent: true,
      opacity: 0.82,
    });

    const tumblerMat = new THREE.MeshStandardMaterial({
      map: createTumblerTexture(),
      roughness: 0.25,
      metalness: 0.6,
    });

    // 7. BUILD MINIMALIST ANIME ROOM: ROOM + WINDOW + COMPUTER + SWIVEL CHAIR
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    // Floor Base (Beveled & warm)
    const floor = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.15, 4.6), floorWoodMat);
    floor.position.set(0, -0.075, 0);
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Parquet Floor Tile Grooves
    for (let p = -2.1; p <= 2.1; p += 0.3) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(4.58, 0.004, 0.015),
        new THREE.MeshBasicMaterial({ color: 0xb58b5b })
      );
      line.position.set(0, 0.002, p);
      roomGroup.add(line);
    }

    // Back Wall
    const wallBack = new THREE.Mesh(new THREE.BoxGeometry(4.6, 3.4, 0.15), wallPastelMat);
    wallBack.position.set(0, 1.65, -2.3);
    wallBack.receiveShadow = true;
    roomGroup.add(wallBack);

    // Left Wall
    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.4, 4.6), wallPastelMat);
    wallLeft.position.set(-2.3, 1.65, 0);
    wallLeft.receiveShadow = true;
    roomGroup.add(wallLeft);

    // Wooden Baseboards
    const trimB = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.14, 0.04), woodTrimMat);
    trimB.position.set(0, 0.07, -2.21);
    roomGroup.add(trimB);

    const trimL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 4.6), woodTrimMat);
    trimL.position.set(-2.21, 0.07, 0);
    roomGroup.add(trimL);

    // ==========================================
    // CHRISTMAS WALL DECOR: PINE-GREEN WAINSCOTING, TWINKLING GARLAND & WREATH
    // ==========================================
    const WAINSCOT_H = 0.9;
    const wainscotMat = new THREE.MeshStandardMaterial({ color: 0x1f4d3a, roughness: 0.7 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.35, metalness: 0.6 });

    const wainscotBack = new THREE.Mesh(new THREE.BoxGeometry(4.45, WAINSCOT_H, 0.015), wainscotMat);
    wainscotBack.position.set(0.075, WAINSCOT_H / 2, -2.217);
    wainscotBack.receiveShadow = true;
    roomGroup.add(wainscotBack);

    const wainscotLeft = new THREE.Mesh(new THREE.BoxGeometry(0.015, WAINSCOT_H, 4.45), wainscotMat);
    wainscotLeft.position.set(-2.217, WAINSCOT_H / 2, 0.075);
    wainscotLeft.receiveShadow = true;
    roomGroup.add(wainscotLeft);

    // Gold chair rail on top of the wainscoting
    const railBack = new THREE.Mesh(new THREE.BoxGeometry(4.45, 0.035, 0.03), goldMat);
    railBack.position.set(0.075, WAINSCOT_H, -2.21);
    roomGroup.add(railBack);

    const railLeft = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.035, 4.45), goldMat);
    railLeft.position.set(-2.21, WAINSCOT_H, 0.075);
    roomGroup.add(railLeft);

    // Pine garland with twinkling string lights along the top of both walls
    const garlandMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.9 });
    const bulbColors = [0xef4444, 0x22c55e, 0xfacc15, 0x3b82f6];
    const twinkleBulbs: { mat: THREE.MeshStandardMaterial; phase: number }[] = [];

    const addGarland = (from: THREE.Vector3, to: THREE.Vector3, sag: number, swags: number) => {
      const points: THREE.Vector3[] = [];
      const SEGMENTS = swags * 16;
      for (let i = 0; i <= SEGMENTS; i++) {
        const t = i / SEGMENTS;
        const p = from.clone().lerp(to, t);
        p.y -= Math.abs(Math.sin(t * swags * Math.PI)) * sag;
        points.push(p);
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const garland = new THREE.Mesh(new THREE.TubeGeometry(curve, SEGMENTS * 2, 0.035, 8, false), garlandMat);
      garland.castShadow = true;
      roomGroup.add(garland);

      const BULBS = swags * 6;
      for (let i = 0; i <= BULBS; i++) {
        const mat = new THREE.MeshStandardMaterial({
          color: bulbColors[i % bulbColors.length],
          emissive: bulbColors[i % bulbColors.length],
          emissiveIntensity: 1,
          roughness: 0.3,
        });
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), mat);
        bulb.position.copy(curve.getPointAt(i / BULBS));
        bulb.position.y -= 0.035;
        roomGroup.add(bulb);
        twinkleBulbs.push({ mat, phase: Math.random() * Math.PI * 2 });
      }
    };

    addGarland(new THREE.Vector3(-2.17, 3.2, -2.17), new THREE.Vector3(2.3, 3.2, -2.17), 0.12, 5);
    addGarland(new THREE.Vector3(-2.17, 3.2, -2.17), new THREE.Vector3(-2.17, 3.2, 2.3), 0.12, 5);

    // Christmas wreath on the left wall above the aquarium
    const wreathGroup = new THREE.Group();
    wreathGroup.position.set(-2.19, 2.15, 0.55);
    wreathGroup.rotation.y = Math.PI / 2;

    const wreath = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.065, 12, 32), garlandMat);
    wreath.castShadow = true;
    wreathGroup.add(wreath);

    // Red berries scattered around the wreath
    const berryMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + 0.2;
      const berry = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), berryMat);
      berry.position.set(Math.cos(a) * 0.2, Math.sin(a) * 0.2, 0.06);
      wreathGroup.add(berry);
    }

    // Red ribbon bow at the bottom
    const bowMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 });
    for (const side of [-1, 1]) {
      const loop = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 12), bowMat);
      loop.rotation.z = side * Math.PI / 2;
      loop.position.set(side * 0.05, -0.2, 0.07);
      wreathGroup.add(loop);
    }
    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 10), bowMat);
    knot.position.set(0, -0.2, 0.08);
    wreathGroup.add(knot);
    roomGroup.add(wreathGroup);

    // ==========================================
    // CHRISTMAS TREE (GLB MODEL) IN THE BACK-LEFT CORNER
    // ==========================================
    // The GLB has geometry only (no materials/UVs), so it is colored per vertex:
    // red tree skirt, brown trunk, gold star, pine-green foliage with light snow on top.
    new GLTFLoader().load('models/christmas_tree.glb', (gltf) => {
      const TREE_HEIGHT = 2.0;
      const treeRoot = gltf.scene;

      const box = new THREE.Box3().setFromObject(treeRoot);
      const size = box.getSize(new THREE.Vector3());
      const scale = TREE_HEIGHT / size.y;
      treeRoot.scale.setScalar(scale);
      treeRoot.position.set(-1.37, -box.min.y * scale, -1.37);

      const snow = new THREE.Color(0xe6eef2);
      const skirt = new THREE.Color(0xa11d2b);
      const trunk = new THREE.Color(0x5b3a1e);
      const star = new THREE.Color(0xf5c518);
      const leafDark = new THREE.Color(0x0f3d24);
      const leafLight = new THREE.Color(0x1f7a45);
      const ornamentCandidates: { pos: THREE.Vector3; normal: THREE.Vector3 }[] = [];

      treeRoot.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        const geo = mesh.geometry;
        geo.computeVertexNormals();

        const pos = geo.attributes.position;
        const nrm = geo.attributes.normal;
        const colors = new Float32Array(pos.count * 3);
        const c = new THREE.Color();
        const { min, max } = box;
        const h = max.y - min.y;

        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const z = pos.getZ(i);
          const t = (y - min.y) / h; // 0 = bottom, 1 = top
          const r = Math.hypot(x, z);
          const ny = nrm.getY(i);

          if (t < 0.06) c.copy(skirt); // red tree skirt on the base
          else if (t < 0.15 && r < 0.15 * h) c.copy(trunk);
          else if (t > 0.83) c.copy(star);
          else if (ny > 0.85) c.copy(snow).lerp(leafLight, 0.15); // light snow on branch tops
          else {
            // Darker green at the bottom, fresher green toward the top
            c.copy(leafDark).lerp(leafLight, 0.35 + t * 0.5 + (Math.random() - 0.5) * 0.15);
            // Outward-facing foliage spots are candidates for ornaments
            if (t > 0.2 && t < 0.78 && Math.abs(ny) < 0.4 && i % 23 === 0) {
              ornamentCandidates.push({
                pos: new THREE.Vector3(x, y, z),
                normal: new THREE.Vector3(nrm.getX(i), ny, nrm.getZ(i)),
              });
            }
          }
          colors.set([c.r, c.g, c.b], i * 3);
        }
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        mesh.material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75 });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      });

      // Twinkling baubles placed on the outer foliage
      // Classic red / gold / silver palette for the baubles
      const baubleColors = [0xc81e3a, 0xe0a82e, 0xd8dde3, 0xc81e3a, 0xe0a82e];
      const ORNAMENTS = 36;
      for (let k = 0; k < ORNAMENTS && ornamentCandidates.length > 0; k++) {
        const pick = ornamentCandidates.splice(Math.floor(Math.random() * ornamentCandidates.length), 1)[0];
        const color = baubleColors[k % baubleColors.length];
        const mat = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.4,
          roughness: 0.2,
          metalness: 0.5,
        });
        const bauble = new THREE.Mesh(new THREE.SphereGeometry(0.04 / scale, 14, 14), mat);
        bauble.position.copy(pick.pos).addScaledVector(pick.normal, 0.02 / scale);
        treeRoot.add(bauble);
        twinkleBulbs.push({ mat, phase: Math.random() * Math.PI * 2 });
      }

      // Warm glow from the tree lights
      const treeGlow = new THREE.PointLight(0xffd59e, 1.2, 2.2);
      treeGlow.position.set(-1.0, 1.1, -1.0);
      roomGroup.add(treeGlow);

      roomGroup.add(treeRoot);
    });

    // Soft Aesthetic Round Pastel Rug Under Chair & Desk
    const cuteRug = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.4, 0.018, 36),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.95 })
    );
    cuteRug.position.set(0.85, 0.009, -0.6);
    cuteRug.receiveShadow = true;
    roomGroup.add(cuteRug);

    // Outer ring border on rug
    const rugBorder = new THREE.Mesh(
      new THREE.RingGeometry(1.32, 1.4, 36),
      new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.9 })
    );
    rugBorder.rotation.x = -Math.PI / 2;
    rugBorder.position.set(0.85, 0.02, -0.6);
    roomGroup.add(rugBorder);

    // ==========================================
    // A. CỬA SỔ ANIME (ANIME WINDOW WITH SUNSHINE & SHEER CURTAINS)
    // ==========================================
    const windowGroup = new THREE.Group();
    windowGroup.position.set(0.6, 1.9, -2.22);

    // Outer Window Frame
    const winFrameOuter = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 0.08), woodTrimMat);
    windowGroup.add(winFrameOuter);

    // Glass with Anime Sky View
    const winGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.64, 1.64), windowGlassMat);
    winGlass.position.set(0, 0, 0.042);
    windowGroup.add(winGlass);

    // Window Mullions / Cross Frame
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.64, 0.03), woodTrimMat);
    crossV.position.set(0, 0, 0.05);
    windowGroup.add(crossV);

    const crossH = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.06, 0.03), woodTrimMat);
    crossH.position.set(0, 0.1, 0.05);
    windowGroup.add(crossH);

    // Window Sill
    const winSill = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.06, 0.18), woodTrimMat);
    winSill.position.set(0, -0.92, 0.08);
    winSill.castShadow = true;
    windowGroup.add(winSill);

    // Curtain Rod (Thanh treo rèm)
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.3, 16), chromeMat);
    rod.rotation.z = Math.PI / 2;
    rod.position.set(0, 0.98, 0.14);
    windowGroup.add(rod);

    // Left Curtain (Rèm trắng thả mềm)
    const curtainL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.9, 0.04), curtainMat);
    curtainL.position.set(-0.85, -0.05, 0.14);
    curtainL.castShadow = true;
    windowGroup.add(curtainL);

    // Right Curtain
    const curtainR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.9, 0.04), curtainMat);
    curtainR.position.set(0.85, -0.05, 0.14);
    curtainR.castShadow = true;
    windowGroup.add(curtainR);

    // Soft Sunlight Beam polygon hitting the floor
    const sunBeamGeo = new THREE.PlaneGeometry(1.7, 2.8);
    const sunBeamMat = new THREE.MeshBasicMaterial({
      color: 0xdbeafe,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
    });
    const sunBeamFloor = new THREE.Mesh(sunBeamGeo, sunBeamMat);
    sunBeamFloor.rotation.x = -Math.PI / 2;
    sunBeamFloor.rotation.z = 0.25;
    sunBeamFloor.position.set(0.7, 0.022, -0.4);
    roomGroup.add(sunBeamFloor);

    roomGroup.add(windowGroup);

    // ==========================================
    // B. MÁY TÍNH & BÀN LÀM VIỆC ANIME (WORKSTATION - ONLY INTERACTIVE TARGET)
    // ==========================================
    const workstationGroup = new THREE.Group();
    workstationGroup.position.set(0.85, 0, -1.56); // Sát tường cửa sổ (mép sau bàn chạm mép bậu cửa sổ)

    // 1. Desk Top (Bo tròn góc, bề mặt sáng mịn ấm áp)
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.06, 0.95), deskTopMat);
    deskTop.position.set(0, 0.78, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    workstationGroup.add(deskTop);

    // Desk Edge Trim
    const deskEdgeTrim = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.02, 0.97), deskWoodMat);
    deskEdgeTrim.position.set(0, 0.745, 0);
    workstationGroup.add(deskEdgeTrim);

    // Desk 4 Wooden Cylindrical Legs with Brass/Chrome tips
    const legCoords = [
      [-0.95, -0.38],
      [0.95, -0.38],
      [-0.95, 0.38],
      [0.95, 0.38],
    ];
    legCoords.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.75, 16), deskWoodMat);
      leg.position.set(lx, 0.375, lz);
      leg.castShadow = true;
      workstationGroup.add(leg);

      const legTip = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.06, 16), chromeMat);
      legTip.position.set(lx, 0.03, lz);
      workstationGroup.add(legTip);
    });

    // 2. Large Pastel Desk Mat
    const deskMat = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.008, 0.6), pastelMatDesk);
    deskMat.position.set(0, 0.814, 0.08);
    deskMat.receiveShadow = true;
    workstationGroup.add(deskMat);

    // 3. Curved Ultra-Wide Gaming/Dev Monitor (Sleek Gunmetal Bezel & V-Stand, No Cat Ears)
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(0, 1.25, -0.16);

    // Modern Geometric V-Shaped Metal Stand Base
    const monBaseLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 0.32), chromeMat);
    monBaseLeft.position.set(-0.12, -0.44, 0.05);
    monBaseLeft.rotation.y = 0.35;
    monBaseLeft.castShadow = true;
    monitorGroup.add(monBaseLeft);

    const monBaseRight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 0.32), chromeMat);
    monBaseRight.position.set(0.12, -0.44, 0.05);
    monBaseRight.rotation.y = -0.35;
    monBaseRight.castShadow = true;
    monitorGroup.add(monBaseRight);

    // Heavy-duty Ergonomic Monitor Arm / Pillar
    const monStem = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.44, 0.06), monitorBezelMat);
    monStem.position.set(0, -0.23, -0.05);
    monitorGroup.add(monStem);

    // Sleek Ultra-Wide Monitor Chassis (Dark Gunmetal Finish)
    const monBody = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.68, 0.038), monitorBezelMat);
    monBody.castShadow = true;
    monitorGroup.add(monBody);

    // Ambient Cyan Backlight Strip on the Rear of Monitor
    const backGlowMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.02, 0.01),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    backGlowMesh.position.set(0, 0.05, -0.022);
    monitorGroup.add(backGlowMesh);

    // Monitor Screen with Windows 7 Desktop
    const monScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.64), monitorScreenMat);
    monScreen.position.set(0, 0, 0.021);
    monitorGroup.add(monScreen);

    workstationGroup.add(monitorGroup);

    // 4. Sleek Matte Black Mechanical Gaming Keyboard
    const kbGroup = new THREE.Group();
    kbGroup.position.set(0, 0.825, 0.18);

    const kbBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.018, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3, metalness: 0.5 })
    );
    kbGroup.add(kbBody);

    // Stealth Dark Keycaps with Subtle Cyan Backlight Accents
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 12; c++) {
        const isAccent = (r === 3 && c >= 4 && c <= 7) || (r === 0 && c === 0) || (r === 1 && c === 11);
        const key = new THREE.Mesh(
          new THREE.BoxGeometry(0.027, 0.01, 0.027),
          new THREE.MeshStandardMaterial({
            color: isAccent ? 0x0284c7 : 0x27272a,
            roughness: 0.35,
          })
        );
        key.position.set(-0.19 + c * 0.034, 0.012, -0.05 + r * 0.033);
        kbGroup.add(key);
      }
    }
    workstationGroup.add(kbGroup);

    // 5. Sleek Ergonomic Matte Black Gaming Mouse
    const mouseGroup = new THREE.Group();
    mouseGroup.position.set(0.36, 0.83, 0.18);

    const mouseMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.065, 0.026, 0.105),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.25, metalness: 0.3 })
    );
    mouseGroup.add(mouseMesh);

    // Blue LED Scroll Wheel
    const scrollWheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.012, 12),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    scrollWheel.rotation.z = Math.PI / 2;
    scrollWheel.position.set(0, 0.014, -0.02);
    mouseGroup.add(scrollWheel);

    workstationGroup.add(mouseGroup);

    // 6. Masculine Matte Black Insulated Coffee Tumbler
    const mugGroup = new THREE.Group();
    mugGroup.position.set(-0.55, 0.87, 0.12);

    const tumblerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.036, 0.11, 20), tumblerMat);
    tumblerBody.castShadow = true;
    mugGroup.add(tumblerBody);

    const tumblerLid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.044, 0.044, 0.015, 20),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2 })
    );
    tumblerLid.position.set(0, 0.058, 0);
    mugGroup.add(tumblerLid);

    workstationGroup.add(mugGroup);

    // 7. Desktop Gaming / Workstation PC Case (Right side of desk)
    const pcCaseGroup = new THREE.Group();
    pcCaseGroup.position.set(0.82, 1.05, 0.02);

    // Main Chassis (Matte Black)
    const pcChassis = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.48, 0.44),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.7 })
    );
    pcChassis.castShadow = true;
    pcCaseGroup.add(pcChassis);

    // Tempered Glass Left Side Panel
    const glassSide = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.44),
      new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        transmission: 0.7,
        opacity: 0.85,
        transparent: true,
        roughness: 0.1,
      })
    );
    glassSide.position.set(-0.122, 0, 0);
    glassSide.rotation.y = -Math.PI / 2;
    pcCaseGroup.add(glassSide);

    // Internal Glowing GPU & Cooler Lights
    const gpuMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.08, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8 })
    );
    gpuMesh.position.set(-0.02, -0.05, 0.02);
    pcCaseGroup.add(gpuMesh);

    const gpuLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.005, 0.015, 0.18),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    gpuLight.position.set(-0.042, -0.04, 0.02);
    pcCaseGroup.add(gpuLight);

    // Front Dual Glowing Icy Blue LED Fans
    for (let f = 0; f < 2; f++) {
      const fanRing = new THREE.Mesh(
        new THREE.RingGeometry(0.055, 0.065, 24),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
      );
      fanRing.position.set(0, -0.08 + f * 0.16, 0.222);
      pcCaseGroup.add(fanRing);
    }

    workstationGroup.add(pcCaseGroup);

    // 8. Modern Minimalist Desk Lamp (Dark Gunmetal Finish)
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-0.85, 0.81, -0.22);

    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.016, 16), monitorBezelMat);
    lampGroup.add(lampBase);

    // Angle the lamp so its arm reaches toward the front-right, over the desk mat
    lampGroup.rotation.y = -Math.PI / 4;

    // Arm segment between two joints (in the lamp's local XY plane)
    const addLampArm = (from: THREE.Vector2, to: THREE.Vector2) => {
      const dir = to.clone().sub(from);
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, dir.length(), 12), chromeMat);
      arm.position.set((from.x + to.x) / 2, (from.y + to.y) / 2, 0);
      arm.rotation.z = Math.atan2(-dir.x, dir.y);
      lampGroup.add(arm);
    };

    const lampBaseTop = new THREE.Vector2(0, 0.008);
    const lampElbow = new THREE.Vector2(-0.05, 0.3);
    const lampHeadJoint = new THREE.Vector2(0.12, 0.44);
    addLampArm(lampBaseTop, lampElbow);
    addLampArm(lampElbow, lampHeadJoint);

    // Small joint knuckles
    [lampElbow, lampHeadJoint].forEach((j) => {
      const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), monitorBezelMat);
      knuckle.position.set(j.x, j.y, 0);
      lampGroup.add(knuckle);
    });

    // Shade points down toward the desk (cone apex faces away from the light direction)
    const lightDir = new THREE.Vector2(0.45, -0.89).normalize();
    const lampHead = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.12, 16, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.3,
        metalness: 0.6,
        side: THREE.DoubleSide,
      })
    );
    lampHead.position.set(lampHeadJoint.x + lightDir.x * 0.04, lampHeadJoint.y + lightDir.y * 0.04, 0);
    lampHead.rotation.z = Math.atan2(lightDir.x, -lightDir.y);
    lampGroup.add(lampHead);

    const lampBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffedd5 })
    );
    lampBulb.position.set(lampHeadJoint.x + lightDir.x * 0.07, lampHeadJoint.y + lightDir.y * 0.07, 0);
    lampGroup.add(lampBulb);

    workstationGroup.add(lampGroup);

    // Minimalist succulent in sleek geometric slate planter
    const miniPlantGroup = new THREE.Group();
    miniPlantGroup.position.set(-0.85, 0.81, 0.12);

    const miniPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.04, 0.07, 16),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 })
    );
    miniPlantGroup.add(miniPot);

    for (let p = 0; p < 6; p++) {
      const ang = (p * Math.PI * 2) / 6;
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.025, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5 })
      );
      leaf.position.set(Math.cos(ang) * 0.03, 0.05, Math.sin(ang) * 0.03);
      miniPlantGroup.add(leaf);
    }
    workstationGroup.add(miniPlantGroup);

    roomGroup.add(workstationGroup);

    // Register ONLY workstation / computer meshes for interaction
    const interactiveSet = new Set<THREE.Object3D>();
    interactiveMeshesRef.current = interactiveSet;

    workstationGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.userData.isComputer = true;
        interactiveSet.add(child);
      }
    });

    // ==========================================
    // C. GHẾ XOAY CÔNG THÁI HỌC ANIME (ERGONOMIC SWIVEL OFFICE CHAIR)
    // ==========================================
    const chairRootGroup = new THREE.Group();
    chairRootGroup.position.set(0.85, 0, -0.51);

    // 1. Fixed Chair Base: 5-star chrome spider base with caster wheels
    const chairBaseGroup = new THREE.Group();

    const starCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 16), chromeMat);
    starCenter.position.set(0, 0.08, 0);
    chairBaseGroup.add(starCenter);

    // 5 Spokes & Caster Wheels
    for (let s = 0; s < 5; s++) {
      const angle = (s * Math.PI * 2) / 5;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.025, 0.32), chromeMat);
      spoke.position.set(Math.sin(angle) * 0.16, 0.07, Math.cos(angle) * 0.16);
      spoke.rotation.y = angle;
      chairBaseGroup.add(spoke);

      // Rolling Caster Wheel
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.028, 0.02, 12),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(Math.sin(angle) * 0.32, 0.03, Math.cos(angle) * 0.32);
      chairBaseGroup.add(wheel);
    }

    // Chrome Gas Lift Cylinder
    const gasLift = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.38, 16), chromeMat);
    gasLift.position.set(0, 0.25, 0);
    chairBaseGroup.add(gasLift);

    chairRootGroup.add(chairBaseGroup);

    // 2. Swivel Upper Group (Rotating seat, backrest, armrests & cushion)
    const chairSwivelGroup = new THREE.Group();
    chairSwivelGroup.position.set(0, 0.44, 0);
    chairSwivelGroupRef.current = chairSwivelGroup;

    // Chair Seat Base plate
    const seatBasePlate = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.04, 0.46), monitorBezelMat);
    seatBasePlate.position.set(0, 0, 0);
    seatBasePlate.castShadow = true;
    chairSwivelGroup.add(seatBasePlate);

    // Ergonomic Curved Thick Cushion (Đệm ngồi êm ái)
    const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.48), chairCushionMat);
    seatCushion.position.set(0, 0.05, 0);
    seatCushion.castShadow = true;
    chairSwivelGroup.add(seatCushion);

    // Ergonomic Backrest Spine (Trục lưng ghế cong nhẹ)
    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.65, 0.04), chromeMat);
    spine.position.set(0, 0.36, -0.23);
    spine.rotation.x = -0.08;
    chairSwivelGroup.add(spine);

    // Breathable Ergonomic Curved Backrest (Lưng tựa)
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.54, 0.05), chairFabricMat);
    backrest.position.set(0, 0.38, -0.21);
    backrest.rotation.x = -0.08;
    backrest.castShadow = true;
    chairSwivelGroup.add(backrest);

    // Lumbar Support Pillow (Gối đệm thắt lưng)
    const lumbar = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.14, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 })
    );
    lumbar.position.set(0, 0.22, -0.18);
    lumbar.rotation.x = -0.08;
    chairSwivelGroup.add(lumbar);

    // Integrated Headrest (Tựa đầu)
    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.06), chairCushionMat);
    headrest.position.set(0, 0.68, -0.24);
    headrest.rotation.x = -0.05;
    chairSwivelGroup.add(headrest);

    // Left Armrest with soft pad
    const armLGroup = new THREE.Group();
    armLGroup.position.set(-0.27, 0.12, 0);
    const armLStem = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.22, 12), chromeMat);
    armLStem.position.set(0, 0, 0);
    armLGroup.add(armLStem);
    const armLPad = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.024, 0.26), monitorBezelMat);
    armLPad.position.set(0, 0.11, 0.02);
    armLGroup.add(armLPad);
    chairSwivelGroup.add(armLGroup);

    // Right Armrest with soft pad
    const armRGroup = new THREE.Group();
    armRGroup.position.set(0.27, 0.12, 0);
    const armRStem = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.22, 12), chromeMat);
    armRStem.position.set(0, 0, 0);
    armRGroup.add(armRStem);
    const armRPad = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.024, 0.26), monitorBezelMat);
    armRPad.position.set(0, 0.11, 0.02);
    armRGroup.add(armRPad);
    chairSwivelGroup.add(armRGroup);

    chairRootGroup.add(chairSwivelGroup);
    roomGroup.add(chairRootGroup);

    // ==========================================
    // D. CÂY CẢNH 3D HOẠT HỌA RUNG RINH TRONG GIÓ (ANIMATED BOTANICAL PLANTS)
    // ==========================================
    const animatedTreeBranches: {
      group: THREE.Group;
      baseRotX: number;
      baseRotZ: number;
      phase: number;
      speed: number;
      amp: number;
    }[] = [];

    const animatedVines: {
      group: THREE.Group;
      baseRotZ: number;
      phase: number;
    }[] = [];

    // 1. Chậu cây Monstera nhiệt đới lớn góc phòng (x: -1.75, z: -1.65)
    const largeTreeGroup = new THREE.Group();
    largeTreeGroup.position.set(-1.75, 0, -1.65);

    // Đế đỡ chậu bằng gỗ tự nhiên (4 chân)
    const potStandGroup = new THREE.Group();
    const standRing = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 20), deskWoodMat);
    standRing.position.set(0, 0.08, 0);
    potStandGroup.add(standRing);

    for (let legI = 0; legI < 4; legI++) {
      const legAng = (legI * Math.PI) / 2 + Math.PI / 4;
      const standLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.014, 0.16, 12), deskWoodMat);
      standLeg.position.set(Math.cos(legAng) * 0.18, 0.08, Math.sin(legAng) * 0.18);
      standLeg.castShadow = true;
      potStandGroup.add(standLeg);
    }
    largeTreeGroup.add(potStandGroup);

    // Chậu sứ phong cách Bắc Âu tối giản
    const potMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.25,
      metalness: 0.05,
    });
    const potBody = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.42, 24), potMat);
    potBody.position.set(0, 0.29, 0);
    potBody.castShadow = true;
    potBody.receiveShadow = true;
    largeTreeGroup.add(potBody);

    // Lớp đất hữu cơ sẫm màu
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x271c19, roughness: 0.95 });
    const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 20), soilMat);
    soil.position.set(0, 0.49, 0);
    largeTreeGroup.add(soil);

    // Thân cây & các cành lá Monstera xum xuê đung đưa
    const leafMatDark = new THREE.MeshStandardMaterial({
      color: 0x166534,
      roughness: 0.35,
      side: THREE.DoubleSide,
    });
    const leafMatLight = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.35,
      side: THREE.DoubleSide,
    });
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.5 });

    // Tạo 7 cành lá tỏa ra các hướng với góc nghiêng và độ cao khác nhau
    const branchConfigs = [
      { angle: 0.2, pitch: 0.55, length: 0.75, leafScale: 1.05, height: 0.5, mat: leafMatDark },
      { angle: 1.1, pitch: 0.48, length: 0.85, leafScale: 1.2, height: 0.52, mat: leafMatLight },
      { angle: 2.0, pitch: 0.62, length: 0.7, leafScale: 0.95, height: 0.51, mat: leafMatDark },
      { angle: 2.9, pitch: 0.5, length: 0.9, leafScale: 1.25, height: 0.54, mat: leafMatLight },
      { angle: 3.8, pitch: 0.58, length: 0.8, leafScale: 1.1, height: 0.52, mat: leafMatDark },
      { angle: 4.8, pitch: 0.45, length: 0.95, leafScale: 1.3, height: 0.55, mat: leafMatLight },
      { angle: 5.6, pitch: 0.6, length: 0.72, leafScale: 1.0, height: 0.5, mat: leafMatDark },
    ];

    branchConfigs.forEach((cfg, idx) => {
      const branchGroup = new THREE.Group();
      branchGroup.position.set(0, cfg.height, 0);
      branchGroup.rotation.y = cfg.angle;

      const subPivot = new THREE.Group();
      subPivot.rotation.z = cfg.pitch;

      // Thân cành thon dần
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.015, cfg.length, 10),
        stemMat
      );
      stem.position.set(0, cfg.length / 2, 0);
      stem.castShadow = true;
      subPivot.add(stem);

      // Lá Monstera hình quạt trái tim mềm mại
      const leafGroup = new THREE.Group();
      leafGroup.position.set(0, cfg.length, 0);
      leafGroup.rotation.z = 0.35;

      const leafCenter = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, 0.28 * cfg.leafScale, 0.008),
        stemMat
      );
      leafCenter.position.set(0, (0.14 * cfg.leafScale), 0);
      leafGroup.add(leafCenter);

      // Mặt lá xòe cánh đôi
      const leafWingGeo = new THREE.ConeGeometry(0.12 * cfg.leafScale, 0.32 * cfg.leafScale, 16);
      leafWingGeo.scale(1.3, 1, 0.12);
      const leafMesh = new THREE.Mesh(leafWingGeo, cfg.mat);
      leafMesh.position.set(0, 0.16 * cfg.leafScale, 0);
      leafMesh.castShadow = true;
      leafGroup.add(leafMesh);

      subPivot.add(leafGroup);
      branchGroup.add(subPivot);
      largeTreeGroup.add(branchGroup);

      // Đưa vào danh sách hoạt họa với độ lệch pha khác nhau
      animatedTreeBranches.push({
        group: subPivot,
        baseRotX: subPivot.rotation.x,
        baseRotZ: subPivot.rotation.z,
        phase: idx * 0.9,
        speed: 1.2 + (idx % 3) * 0.25,
        amp: 0.045 + (idx % 2) * 0.02,
      });
    });

    // Old corner plant replaced by the Christmas tree model
    // roomGroup.add(largeTreeGroup);

    // 2. Chậu cây leo bậu cửa sổ (Window sill hanging ivy)
    const windowPlantGroup = new THREE.Group();
    windowPlantGroup.position.set(0.15, 1.04, -2.14);

    const winPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.038, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.6 })
    );
    windowPlantGroup.add(winPot);

    // Dây leo buông rủ đung đưa nhẹ theo làn gió cửa sổ
    for (let v = 0; v < 3; v++) {
      const vineGroup = new THREE.Group();
      vineGroup.position.set(-0.02 + v * 0.025, 0.02, 0.04);

      const vineLength = 0.22 + v * 0.08;
      for (let s = 0; s < 5; s++) {
        const leafBud = new THREE.Mesh(
          new THREE.SphereGeometry(0.014, 8, 8),
          leafMatLight
        );
        leafBud.scale.set(1.4, 0.8, 0.6);
        leafBud.position.set((s % 2 === 0 ? 0.012 : -0.012), -s * (vineLength / 5), 0.005);
        vineGroup.add(leafBud);
      }

      windowPlantGroup.add(vineGroup);
      animatedVines.push({
        group: vineGroup,
        baseRotZ: 0,
        phase: v * 1.3,
      });
    }
    roomGroup.add(windowPlantGroup);

    // ==========================================
    // E. HỒ CÁ CẢNH THỦY SINH VỚI CÁ BƠI LỘI & BỌT KHÍ OXY (ILLUMINATED AQUARIUM)
    // ==========================================
    const aquariumRoot = new THREE.Group();
    // Xoay 90° để mặt lưng tủ áp sát tường trái, mặt trước hướng vào giữa phòng
    aquariumRoot.position.set(-1.95, 0, 0.55);
    aquariumRoot.rotation.y = Math.PI / 2;

    // 1. Tủ đỡ hồ cá bằng gỗ phong cách hiện đại (Modern Aquarium Cabinet)
    const cabinetMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Gỗ màu than đen sang trọng đồng bộ với góc làm việc
      roughness: 0.35,
      metalness: 0.2,
    });
    const cabinetBody = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.68, 0.44), cabinetMat);
    cabinetBody.position.set(0, 0.38, 0);
    cabinetBody.castShadow = true;
    cabinetBody.receiveShadow = true;
    aquariumRoot.add(cabinetBody);

    // Mặt tủ trên viền gỗ sáng
    const cabinetTopTrim = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.025, 0.46), deskWoodMat);
    cabinetTopTrim.position.set(0, 0.725, 0);
    cabinetTopTrim.castShadow = true;
    aquariumRoot.add(cabinetTopTrim);

    // 4 chân kim loại mạ chrome
    const cabLegCoords = [
      [-0.38, -0.17],
      [0.38, -0.17],
      [-0.38, 0.17],
      [0.38, 0.17],
    ];
    cabLegCoords.forEach(([cx, cz]) => {
      const cLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.014, 0.08, 12), chromeMat);
      cLeg.position.set(cx, 0.04, cz);
      cLeg.castShadow = true;
      aquariumRoot.add(cLeg);
    });

    // Cánh tủ với 2 tay nắm kim loại thanh mảnh
    for (let d = -1; d <= 1; d += 2) {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.14, 10), chromeMat);
      handle.position.set(d * 0.06, 0.42, 0.225);
      aquariumRoot.add(handle);
    }

    // 2. Bể kính trong suốt không viền (Rimless Glass Tank)
    const tankGroup = new THREE.Group();
    tankGroup.position.set(0, 0.95, 0);

    const glassTankMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 0.3,
      transparent: true,
      roughness: 0.05,
      metalness: 0.1,
      ior: 1.5,
    });
    const tankOuter = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.42, 0.38), glassTankMat);
    tankOuter.castShadow = true;
    tankGroup.add(tankOuter);

    // Khối nước bên trong màu xanh ngọc lam trong vắt
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.38,
      roughness: 0.1,
      emissive: 0x0284c7,
      emissiveIntensity: 0.2,
    });
    const waterMesh = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.36, 0.34), waterMat);
    waterMesh.position.set(0, -0.015, 0);
    tankGroup.add(waterMesh);

    // Lớp cát trắng mịn dưới đáy hồ (White Sand Substrate)
    const sandMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.74, 0.025, 0.34),
      new THREE.MeshStandardMaterial({ color: 0xf5eedc, roughness: 0.95 })
    );
    sandMesh.position.set(0, -0.19, 0);
    sandMesh.receiveShadow = true;
    tankGroup.add(sandMesh);

    // Những viên đá cuội & lũa thủy sinh decor (Aquascaping Rocks & Driftwood)
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 });
    const rock1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.045), rockMat);
    rock1.position.set(-0.24, -0.155, -0.06);
    rock1.rotation.set(0.3, 0.6, 0.2);
    tankGroup.add(rock1);

    const rock2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.035), rockMat);
    rock2.position.set(-0.18, -0.165, 0.05);
    tankGroup.add(rock2);

    const rock3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.05), rockMat);
    rock3.position.set(0.22, -0.15, -0.04);
    tankGroup.add(rock3);

    // Thân gỗ lũa uốn cong nghệ thuật
    const woodDrift = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.02, 0.24, 8),
      new THREE.MeshStandardMaterial({ color: 0x3f2e21, roughness: 0.9 })
    );
    woodDrift.rotation.set(0.4, 0.3, 1.1);
    woodDrift.position.set(-0.14, -0.12, -0.04);
    tankGroup.add(woodDrift);

    // Cây rong rêu thủy sinh mềm mại đung đưa trong nước (Waving Seaweeds)
    const animatedSeaweeds: {
      group: THREE.Group;
      speed: number;
      phase: number;
      amp: number;
    }[] = [];

    const seaweedMat1 = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const seaweedMat2 = new THREE.MeshStandardMaterial({
      color: 0x059669,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });

    const plantAnchors = [
      { x: -0.22, z: -0.08, blades: 5, h: 0.22, mat: seaweedMat1 },
      { x: 0.2, z: 0.06, blades: 6, h: 0.25, mat: seaweedMat2 },
      { x: 0.02, z: -0.09, blades: 4, h: 0.18, mat: seaweedMat1 },
    ];

    plantAnchors.forEach((pa, cIdx) => {
      const clump = new THREE.Group();
      clump.position.set(pa.x, -0.18, pa.z);

      for (let b = 0; b < pa.blades; b++) {
        const bladeGeo = new THREE.PlaneGeometry(0.018, pa.h);
        bladeGeo.translate(0, pa.h / 2, 0);
        const blade = new THREE.Mesh(bladeGeo, pa.mat);
        blade.rotation.y = (b * Math.PI) / pa.blades;
        blade.rotation.x = 0.08 * (b - 2);
        clump.add(blade);
      }

      tankGroup.add(clump);
      animatedSeaweeds.push({
        group: clump,
        speed: 2.2 + cIdx * 0.4,
        phase: cIdx * 1.5,
        amp: 0.12,
      });
    });

    // Hệ thống sủi bọt khí oxy sinh động (Air Stone & Bubbles)
    const bubbler = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.015, 12),
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 })
    );
    bubbler.position.set(0.24, -0.17, -0.08);
    tankGroup.add(bubbler);

    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0xf0fdf4,
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.8,
    });

    const animatedBubbles: {
      mesh: THREE.Mesh;
      speed: number;
      minY: number;
      maxY: number;
      baseX: number;
      baseZ: number;
      phase: number;
    }[] = [];

    for (let b = 0; b < 7; b++) {
      const bSize = 0.005 + (b % 3) * 0.003;
      const bubble = new THREE.Mesh(new THREE.SphereGeometry(bSize, 8, 8), bubbleMat);
      const startY = -0.16 + (b / 7) * 0.32;
      bubble.position.set(0.24, startY, -0.08);
      tankGroup.add(bubble);

      animatedBubbles.push({
        mesh: bubble,
        speed: 0.14 + (b % 3) * 0.04,
        minY: -0.16,
        maxY: 0.16,
        baseX: 0.24,
        baseZ: -0.08,
        phase: b * 0.8,
      });
    }

    // Đèn LED chiếu sáng hồ cá trên nắp (Slim LED Light Bar & Cyan Ambient Glow)
    const lightBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.02, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 })
    );
    lightBar.position.set(0, 0.22, 0);
    tankGroup.add(lightBar);

    const ledGlowStrip = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.005, 0.03),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    ledGlowStrip.position.set(0, 0.208, 0);
    tankGroup.add(ledGlowStrip);

    // Ánh sáng xanh ngọc lung linh tỏa ra xung quanh góc phòng
    const aquaLight = new THREE.PointLight(0x38bdf8, 1.8, 2.5);
    aquaLight.position.set(0, 0.05, 0);
    tankGroup.add(aquaLight);

    // 3. ĐÀN CÁ BƠI LỘI SINH ĐỘNG (ANIMATED SWIMMING FISH)
    const animatedFishList: {
      group: THREE.Group;
      tailGroup: THREE.Group;
      speed: number;
      radiusX: number;
      radiusZ: number;
      radiusY: number;
      offsetPhase: number;
      baseY: number;
      tailSpeed: number;
    }[] = [];

    // Helper tạo một chú cá với cấu tạo thân hình thoi và vây đuôi có thể uốn lượn
    const createFish = (
      bodyColor: number,
      tailColor: number,
      accentColor: number,
      scale = 1.0
    ) => {
      const fishRoot = new THREE.Group();

      // Thân cá thuôn nhọn theo trục Z (mũi hướng về +Z, đuôi ở -Z)
      const bodyGeo = new THREE.SphereGeometry(0.028 * scale, 12, 10);
      bodyGeo.scale(0.5, 0.8, 1.8);
      const fishMat = new THREE.MeshStandardMaterial({
        color: bodyColor,
        roughness: 0.2,
        metalness: 0.3,
      });
      const fishBody = new THREE.Mesh(bodyGeo, fishMat);
      fishRoot.add(fishBody);

      // Sọc neon hoặc bụng cá lấp lánh
      const stripeGeo = new THREE.BoxGeometry(0.006 * scale, 0.015 * scale, 0.07 * scale);
      const stripeMat = new THREE.MeshBasicMaterial({ color: accentColor });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(0, 0.005 * scale, 0);
      fishRoot.add(stripe);

      // Hai mắt cá tròn đáng yêu
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
      const eyeGeo = new THREE.SphereGeometry(0.004 * scale, 8, 8);
      const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
      eyeL.position.set(0.014 * scale, 0.008 * scale, 0.032 * scale);
      fishRoot.add(eyeL);

      const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
      eyeR.position.set(-0.014 * scale, 0.008 * scale, 0.032 * scale);
      fishRoot.add(eyeR);

      // Vây lưng cá (Dorsal Fin)
      const dorsalFin = new THREE.Mesh(
        new THREE.BoxGeometry(0.003 * scale, 0.025 * scale, 0.035 * scale),
        new THREE.MeshStandardMaterial({
          color: tailColor,
          transparent: true,
          opacity: 0.85,
        })
      );
      dorsalFin.position.set(0, 0.028 * scale, -0.01 * scale);
      fishRoot.add(dorsalFin);

      // Khớp vây đuôi riêng biệt để uốn lượn khi bơi
      const tailPivot = new THREE.Group();
      tailPivot.position.set(0, 0, -0.045 * scale);

      const finGeo = new THREE.ConeGeometry(0.025 * scale, 0.065 * scale, 8);
      finGeo.scale(0.12, 1, 1);
      finGeo.rotateX(-Math.PI / 2);
      const caudalFin = new THREE.Mesh(
        finGeo,
        new THREE.MeshStandardMaterial({
          color: tailColor,
          transparent: true,
          opacity: 0.88,
          side: THREE.DoubleSide,
        })
      );
      caudalFin.position.set(0, 0, -0.03 * scale);
      tailPivot.add(caudalFin);
      fishRoot.add(tailPivot);

      return { fishRoot, tailPivot };
    };

    // Cá số 1: Cá Koi mini vàng cam rực rỡ
    const fish1Data = createFish(0xf97316, 0xfdba74, 0xffffff, 1.15);
    tankGroup.add(fish1Data.fishRoot);
    animatedFishList.push({
      group: fish1Data.fishRoot,
      tailGroup: fish1Data.tailPivot,
      speed: 0.75,
      radiusX: 0.26,
      radiusZ: 0.1,
      radiusY: 0.05,
      offsetPhase: 0,
      baseY: 0.02,
      tailSpeed: 9.5,
    });

    // Cá số 2: Cá Neon Tetra phát sáng xanh ngọc & đuôi đỏ thắm
    const fish2Data = createFish(0x0284c7, 0xef4444, 0x38bdf8, 0.85);
    tankGroup.add(fish2Data.fishRoot);
    animatedFishList.push({
      group: fish2Data.fishRoot,
      tailGroup: fish2Data.tailPivot,
      speed: 0.95,
      radiusX: 0.24,
      radiusZ: 0.11,
      radiusY: 0.06,
      offsetPhase: 2.4,
      baseY: -0.05,
      tailSpeed: 12.0,
    });

    // Cá số 3: Cá Bảy Màu (Guppy) vàng hoàng kim uyển chuyển
    const fish3Data = createFish(0xeab308, 0xf59e0b, 0xfef08a, 0.95);
    tankGroup.add(fish3Data.fishRoot);
    animatedFishList.push({
      group: fish3Data.fishRoot,
      tailGroup: fish3Data.tailPivot,
      speed: 0.65,
      radiusX: 0.22,
      radiusZ: 0.08,
      radiusY: 0.04,
      offsetPhase: 4.6,
      baseY: 0.07,
      tailSpeed: 8.5,
    });

    aquariumRoot.add(tankGroup);
    roomGroup.add(aquariumRoot);

    // ==========================================
    // 8. RENDER LOOP WITH ORBIT CONTROLS & ANIMATIONS
    // ==========================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Falling snow outside the window
      winterSky.update(elapsedTime);

      // Twinkling Christmas garland lights
      twinkleBulbs.forEach((b) => {
        b.mat.emissiveIntensity = 0.5 + 0.7 * (0.5 + 0.5 * Math.sin(elapsedTime * 2.5 + b.phase));
      });

      // 1. Dao động ghế xoay thư giãn
      if (chairSwivelGroupRef.current) {
        chairSwivelGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.8) * 0.18;
      }

      // 2. Hoạt họa cành lá cây Monstera lớn đung đưa nhịp nhàng
      animatedTreeBranches.forEach((br) => {
        br.group.rotation.x =
          br.baseRotX + Math.sin(elapsedTime * br.speed + br.phase) * br.amp;
        br.group.rotation.z =
          br.baseRotZ + Math.cos(elapsedTime * (br.speed * 0.85) + br.phase) * br.amp;
      });

      // 3. Hoạt họa dây leo bậu cửa sổ đung đưa theo gió
      animatedVines.forEach((v) => {
        v.group.rotation.z =
          v.baseRotZ + Math.sin(elapsedTime * 1.5 + v.phase) * 0.08;
      });

      // 4. Hoạt họa cây rong rêu thủy sinh trong hồ cá
      animatedSeaweeds.forEach((sw) => {
        sw.group.rotation.z =
          Math.sin(elapsedTime * sw.speed + sw.phase) * sw.amp;
        sw.group.rotation.x =
          Math.cos(elapsedTime * (sw.speed * 0.7) + sw.phase) * (sw.amp * 0.6);
      });

      // 5. Hoạt họa bọt khí oxy nổi lên liên tục
      animatedBubbles.forEach((b) => {
        b.mesh.position.y += b.speed * delta;
        b.mesh.position.x = b.baseX + Math.sin(elapsedTime * 3.5 + b.phase) * 0.006;
        b.mesh.position.z = b.baseZ + Math.cos(elapsedTime * 3.0 + b.phase) * 0.006;
        if (b.mesh.position.y > b.maxY) {
          b.mesh.position.y = b.minY;
        }
      });

      // 6. Hoạt họa cá bơi lội 3D và vẫy đuôi tự nhiên
      animatedFishList.forEach((fish) => {
        const t = elapsedTime * fish.speed + fish.offsetPhase;
        const currX = Math.sin(t) * fish.radiusX;
        const currZ = Math.cos(t * 1.25) * fish.radiusZ;
        const currY = fish.baseY + Math.sin(t * 1.7) * fish.radiusY;

        // Điểm tiếp theo để định hướng góc nhìn bơi
        const dt = 0.06;
        const nextT = t + dt * fish.speed;
        const nextX = Math.sin(nextT) * fish.radiusX;
        const nextZ = Math.cos(nextT * 1.25) * fish.radiusZ;
        const nextY = fish.baseY + Math.sin(nextT * 1.7) * fish.radiusY;

        fish.group.position.set(currX, currY, currZ);
        fish.group.lookAt(nextX, nextY, nextZ);

        // Vẫy đuôi cá theo nhịp
        fish.tailGroup.rotation.y =
          Math.sin(elapsedTime * fish.tailSpeed + fish.offsetPhase) * 0.45;
      });

      // Smooth camera interpolation towards target
      if (isAnimatingFocus.current && cameraRef.current && controlsRef.current) {
        const cam = cameraRef.current;
        const ctrl = controlsRef.current;

        cam.position.lerp(targetCamPos.current, Math.min(1, delta * 4.5));
        ctrl.target.lerp(targetCamLook.current, Math.min(1, delta * 4.5));

        if (Math.abs(cam.fov - targetFov.current) > 0.1) {
          cam.fov += (targetFov.current - cam.fov) * Math.min(1, delta * 4.0);
          cam.updateProjectionMatrix();
        }

        if (
          cam.position.distanceTo(targetCamPos.current) < 0.05 &&
          ctrl.target.distanceTo(targetCamLook.current) < 0.05
        ) {
          isAnimatingFocus.current = false;
        }
      }

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Camera zoom target whenever selectedObjectId changes
  useEffect(() => {
    if (selectedObjectId === 'computer') {
      const config = ROOM_OBJECTS_CONFIG.find((o) => o.id === 'computer');
      if (config) {
        targetCamPos.current = new THREE.Vector3(...config.camera.position);
        targetCamLook.current = new THREE.Vector3(...config.camera.target);
        targetFov.current = config.camera.fov || 30;
        isAnimatingFocus.current = true;
        playSound('zoom');
      }
    } else {
      // Return to isometric overview
      targetCamPos.current = new THREE.Vector3(...ROOM_STATIC_CAMERA.position);
      targetCamLook.current = new THREE.Vector3(...ROOM_STATIC_CAMERA.target);
      targetFov.current = ROOM_STATIC_CAMERA.fov;
      isAnimatingFocus.current = true;
    }
  }, [selectedObjectId]);

  // Pointer event handlers: Drag (Rotate) vs Click (Open Computer)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    pointerDownTime.current = Date.now();
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || !cameraRef.current) return;

    const distMoved = Math.hypot(
      e.clientX - pointerDownPos.current.x,
      e.clientY - pointerDownPos.current.y
    );
    if (distMoved > 5) {
      isDragging.current = true;
      setHoveredComputer(false);
      setHoverPos(null);
      return;
    }

    if (selectedObjectId) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseRef.current.set(x, y);

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const meshes = Array.from(interactiveMeshesRef.current);
    const intersects = raycasterRef.current.intersectObjects(meshes, false);

    if (intersects.length > 0) {
      setHoveredComputer(true);
      setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      container.style.cursor = 'pointer';
      return;
    }

    setHoveredComputer(false);
    setHoverPos(null);
    container.style.cursor = 'default';
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    const dist = Math.hypot(dx, dy);
    const duration = Date.now() - pointerDownTime.current;

    // Strict Click Check: only when click moved < 6px and duration < 350ms
    if (dist < 6 && duration < 350) {
      const container = containerRef.current;
      if (!container || !cameraRef.current) return;

      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.set(x, y);

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const meshes = Array.from(interactiveMeshesRef.current);
      const intersects = raycasterRef.current.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        playSound('click');
        onSelectObject('computer');
      }
    }
  };

  return (
    <div
      ref={containerRef}
      id="three-anime-room-canvas"
      className="relative w-full h-full overflow-hidden select-none touch-none bg-slate-950"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Floating Hover Tooltip ONLY for Computer */}
      {hoveredComputer && hoverPos && !selectedObjectId && !isDragging.current && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-14 transition-all duration-75"
          style={{ left: hoverPos.x, top: hoverPos.y }}
        >
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 text-white backdrop-blur-md border border-sky-400/40 shadow-xl shadow-black/80 text-xs font-semibold animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span className="text-sky-200">🖥️ Developer PC • Click to open</span>
          </div>
        </div>
      )}
    </div>
  );
};
