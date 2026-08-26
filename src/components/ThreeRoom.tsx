import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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

  // 1. Windows 7 "Harmony" Desktop Wallpaper (Radial Blue Gradient)
  const bgGrad = ctx.createRadialGradient(512, 280, 20, 512, 280, 550);
  bgGrad.addColorStop(0, '#1d78be');
  bgGrad.addColorStop(0.45, '#0d5392');
  bgGrad.addColorStop(0.8, '#06315d');
  bgGrad.addColorStop(1, '#031936');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 640);

  // Light Rays / Aurora streaks
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(350 + i * 50, 0);
    ctx.lineTo(550 + i * 70, 640);
    ctx.lineTo(490 + i * 70, 640);
    ctx.lineTo(290 + i * 50, 0);
    ctx.fill();
  }

  // 2. Central Glowing Windows 7 Flag Logo
  const drawWinPane = (x: number, y: number, w: number, h: number, c1: string, c2: string) => {
    if (!ctx) return;
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();
  };

  const cx = 512;
  const cy = 250;
  // Glow aura
  const aura = ctx.createRadialGradient(cx, cy, 10, cx, cy, 140);
  aura.addColorStop(0, 'rgba(120, 210, 255, 0.45)');
  aura.addColorStop(1, 'rgba(10, 60, 120, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, 140, 0, Math.PI * 2);
  ctx.fill();

  // 4 Panes of Windows 7
  drawWinPane(cx - 65, cy - 65, 58, 58, '#ff5544', '#cf2211'); // Red
  drawWinPane(cx + 8, cy - 65, 58, 58, '#70d635', '#3f9914');  // Green
  drawWinPane(cx - 65, cy + 8, 58, 58, '#3ca4ff', '#0769c5');  // Blue
  drawWinPane(cx + 8, cy + 8, 58, 58, '#ffd642', '#f59e0b');   // Yellow

  // Windows 7 Text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '300 28px "Segoe UI", sans-serif';
  ctx.fillText('Windows 7', cx, cy + 110);
  ctx.fillStyle = 'rgba(200, 230, 255, 0.7)';
  ctx.font = '600 13px "Segoe UI", sans-serif';
  ctx.fillText('PROFESSIONAL EDITION • NGUYEN VAN NHAN', cx, cy + 132);

  // 3. Desktop Shortcut Icon: Resume.pdf
  ctx.textAlign = 'left';
  const iconX = 60;
  const iconY = 60;

  // Icon highlight box
  ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.beginPath();
  ctx.roundRect(iconX - 10, iconY - 10, 110, 125, 6);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
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

  // 4. Windows 7 Aero Glass Taskbar at Bottom
  const tbGrad = ctx.createLinearGradient(0, 585, 0, 640);
  tbGrad.addColorStop(0, 'rgba(50, 115, 175, 0.75)');
  tbGrad.addColorStop(0.5, 'rgba(15, 55, 95, 0.92)');
  tbGrad.addColorStop(1, 'rgba(5, 20, 45, 0.98)');
  ctx.fillStyle = tbGrad;
  ctx.fillRect(0, 585, 1024, 55);

  // Top taskbar glass highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillRect(0, 585, 1024, 1.5);

  // Windows 7 Start Orb (Left corner)
  const orbGrad = ctx.createRadialGradient(28, 595, 3, 28, 605, 24);
  orbGrad.addColorStop(0, '#56b6f5');
  orbGrad.addColorStop(0.6, '#1773b8');
  orbGrad.addColorStop(1, '#063b6a');
  ctx.fillStyle = orbGrad;
  ctx.beginPath();
  ctx.arc(32, 608, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Mini flag inside orb
  ctx.fillStyle = '#ff4d4d';
  ctx.fillRect(23, 598, 7, 7);
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(32, 598, 7, 7);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(23, 607, 7, 7);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(32, 607, 7, 7);

  // Taskbar Pinned App: Resume Button
  ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.beginPath();
  ctx.roundRect(70, 590, 150, 42, 6);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
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

// Outside anime sky texture
function createAnimeSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Sunny anime sky gradient (Cyan to warm golden horizon)
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#38bdf8');
  grad.addColorStop(0.65, '#93c5fd');
  grad.addColorStop(0.88, '#fed7aa');
  grad.addColorStop(1, '#ffedd5');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Fluffy Anime Clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  function drawCloud(cx: number, cy: number, r: number) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.7, cy - r * 0.2, r * 0.8, 0, Math.PI * 2);
    ctx.arc(cx + r * 1.3, cy + r * 0.1, r * 0.75, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.5, cy + r * 0.4, r * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCloud(120, 200, 45);
  drawCloud(340, 280, 55);
  drawCloud(80, 360, 35);

  return new THREE.CanvasTexture(canvas);
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

    // Warm Sun streaming directly through the Window
    const sunLight = new THREE.DirectionalLight(0xffeed6, 2.6);
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
    monitorGlow.position.set(0, 1.1, -0.2);
    scene.add(monitorGlow);

    // Warm desk lamp glow
    const deskLampGlow = new THREE.PointLight(0xfef08a, 1.5, 2.0);
    deskLampGlow.position.set(0.9, 1.25, -0.3);
    scene.add(deskLampGlow);

    // 6. Materials (Aesthetic Anime Palette)
    const floorWoodMat = new THREE.MeshStandardMaterial({
      color: 0xdeb887, // warm honey blonde oak
      roughness: 0.38,
      metalness: 0.05,
    });

    const wallPastelMat = new THREE.MeshStandardMaterial({
      color: 0xfdfbf7, // soft warm cream anime wall
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

    const windowGlassMat = new THREE.MeshBasicMaterial({
      map: createAnimeSkyTexture(),
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

    // Soft Aesthetic Round Pastel Rug Under Chair & Desk
    const cuteRug = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.4, 0.018, 36),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.95 })
    );
    cuteRug.position.set(0, 0.009, 0.15);
    cuteRug.receiveShadow = true;
    roomGroup.add(cuteRug);

    // Outer ring border on rug
    const rugBorder = new THREE.Mesh(
      new THREE.RingGeometry(1.32, 1.4, 36),
      new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.9 })
    );
    rugBorder.rotation.x = -Math.PI / 2;
    rugBorder.position.set(0, 0.02, 0.15);
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
      color: 0xffedd5,
      transparent: true,
      opacity: 0.18,
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
    workstationGroup.position.set(0, 0, -0.6);

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

    const lampArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.28, 12), chromeMat);
    lampArm1.position.set(0, 0.14, 0);
    lampArm1.rotation.z = -0.2;
    lampGroup.add(lampArm1);

    const lampArm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.22, 12), chromeMat);
    lampArm2.position.set(-0.08, 0.34, 0);
    lampArm2.rotation.z = 0.45;
    lampGroup.add(lampArm2);

    const lampHead = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.12, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3, metalness: 0.6 })
    );
    lampHead.position.set(-0.16, 0.42, 0);
    lampHead.rotation.z = -Math.PI / 3;
    lampGroup.add(lampHead);

    const lampBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffedd5 })
    );
    lampBulb.position.set(-0.14, 0.4, 0);
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
    chairRootGroup.position.set(0, 0, 0.45);

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
    // 8. RENDER LOOP WITH ORBIT CONTROLS & SMOOTH FOCUS & CHAIR SWIVEL
    // ==========================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Gentle soothing idle breathing swivel oscillation for the chair
      if (chairSwivelGroupRef.current) {
        chairSwivelGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.8) * 0.18;
      }

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
            <span className="text-sky-200">🖥️ Windows 7 PC • Click to open</span>
          </div>
        </div>
      )}
    </div>
  );
};
