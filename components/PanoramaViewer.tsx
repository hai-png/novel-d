import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Layers, Plus, Minus, Sun, Camera, Move } from 'lucide-react';

export type PanoramaMode = 'normal' | 'split' | 'interactive';

export interface Hotspot {
  position: [number, number, number];
  label: string;
  description?: string;
}

export interface PanoramaViewerProps {
  mode: PanoramaMode;
  imageSrc: string;
  imageSrcBefore?: string;
  imageSrcAfter?: string;
  hotspots?: Hotspot[];
  variants?: { name: string; src: string }[];
  onVariantChange?: (src: string) => void;
  hotspotsOpenByDefault?: boolean;
  initialRotation?: number; // in degrees
}

// ─── Utility functions (outside component, no hooks) ───
function loadTexture(src: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('Empty image source'));
      return;
    }
    new THREE.TextureLoader().load(
      src,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        resolve(tex);
      },
      undefined,
      (err) => {
        console.error(`[PanoramaViewer] Failed to load: ${src}`, err);
        reject(new Error(`Failed to load: ${src}`));
      }
    );
  });
}

function setMeshTexture(mesh: THREE.Mesh, texture: THREE.Texture) {
  const mat = mesh.material as THREE.MeshBasicMaterial;
  if (mat.map) mat.map.dispose();
  mat.map = texture;
  mat.opacity = 1; // Make the mesh visible once texture is loaded
  mat.transparent = true; // Ensure transparency is enabled
  mat.needsUpdate = true;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({
  mode,
  imageSrc,
  imageSrcBefore,
  imageSrcAfter,
  hotspots = [],
  variants = [],
  onVariantChange,
  hotspotsOpenByDefault = false,
  initialRotation = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  // Use array to track multiple active hotspots when all should be open
  const [activeHotspots, setActiveHotspots] = useState<number[]>(
    hotspotsOpenByDefault ? hotspots.map((_, i) => i) : []
  );
  const [hotspotScreenPos, setHotspotScreenPos] = useState<
    { id: number; x: number; y: number; visible: boolean }[]
  >([]);
  const [isControlsActive, setIsControlsActive] = useState(false);

  // ── Three.js object refs ──
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const sceneBeforeRef = useRef<THREE.Scene | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const sphereBeforeRef = useRef<THREE.Mesh | null>(null);
  const rafRef = useRef<number>(0);

  // ── Mutable refs so animation loop reads latest values ──
  const sliderPosRef = useRef(sliderPos);
  const hotspotsRef = useRef(hotspots);

  useEffect(() => {
    sliderPosRef.current = sliderPos;
  }, [sliderPos]);
  useEffect(() => {
    hotspotsRef.current = hotspots;
  }, [hotspots]);

  // ════════════════════════════════════════════════════════
  // EFFECT 1 — Initialise Three.js scene
  // Runs ONLY when `mode` changes (or on first mount).
  // Camera, controls, renderer survive across texture swaps
  // so viewing direction is preserved.
  // ════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0.1);
    cameraRef.current = camera;

    // ── Controls ──
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = -0.3;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.addEventListener('start', () => setIsControlsActive(true));
    controls.addEventListener('end', () => setIsControlsActive(false));
    controlsRef.current = controls;

    // Apply initial rotation after controls are created
    if (initialRotation !== 0) {
      // For OrbitControls with camera at center looking outward,
      // we need to set the initial azimuthal angle by rotating the camera position
      const rotation = THREE.MathUtils.degToRad(initialRotation);
      // Rotate camera position around Y axis
      const x = Math.sin(rotation) * 0.1;
      const z = Math.cos(rotation) * 0.1;
      camera.position.set(x, 0, z);
      controls.update();
    }

    // ── Geometry (sphere flipped inward) ──
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    if (mode === 'split') {
      // Before scene
      const sceneBefore = new THREE.Scene();
      const meshBefore = new THREE.Mesh(
        geometry.clone(),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
      );
      sceneBefore.add(meshBefore);
      sceneBeforeRef.current = sceneBefore;
      sphereBeforeRef.current = meshBefore;

      // After scene
      const sceneAfter = new THREE.Scene();
      const meshAfter = new THREE.Mesh(
        geometry.clone(),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
      );
      sceneAfter.add(meshAfter);
      sceneRef.current = sceneAfter;
      sphereRef.current = meshAfter;
    } else {
      // Single scene for normal & interactive
      const scene = new THREE.Scene();
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
      );
      scene.add(mesh);
      sceneRef.current = scene;
      sphereRef.current = mesh;
    }

    // ── Animation loop ──
    let prevHotspotJson = '';

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      controls.update();

      // Render
      if (mode === 'split' && sceneBeforeRef.current && sceneRef.current) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        const splitX = (sliderPosRef.current / 100) * w;

        renderer.setScissorTest(true);
        renderer.setViewport(0, 0, w, h);

        renderer.setScissor(0, 0, splitX, h);
        renderer.render(sceneBeforeRef.current, camera);

        renderer.setScissor(splitX, 0, w - splitX, h);
        renderer.render(sceneRef.current, camera);

        renderer.setScissorTest(false);
      } else if (sceneRef.current) {
        renderer.render(sceneRef.current, camera);
      }

      // Project hotspots → screen coords (only update state when changed)
      if (mode === 'interactive' && hotspotsRef.current.length > 0) {
        const v = new THREE.Vector3();
        const positions = hotspotsRef.current.map((h, i) => {
          v.set(h.position[0], h.position[1], h.position[2]);
          v.project(camera);
          return {
            id: i,
            x: Math.round((v.x * 0.5 + 0.5) * container.clientWidth),
            y: Math.round((v.y * -0.5 + 0.5) * container.clientHeight),
            visible: v.z <= 1,
          };
        });
        const json = JSON.stringify(positions);
        if (json !== prevHotspotJson) {
          prevHotspotJson = json;
          setHotspotScreenPos(positions);
        }
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    // ── Resize ──
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── Cleanup ──
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
      controls.dispose();

      // Dispose materials & textures
      [sphereRef.current, sphereBeforeRef.current].forEach((mesh) => {
        if (mesh) {
          const mat = mesh.material as THREE.MeshBasicMaterial;
          if (mat.map) mat.map.dispose();
          mat.dispose();
          mesh.geometry.dispose();
        }
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();

      sceneRef.current = null;
      sceneBeforeRef.current = null;
      sphereRef.current = null;
      sphereBeforeRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // ════════════════════════════════════════════════════════
  // EFFECT 2 — Load texture for normal / interactive modes
  //
  // Runs on mount AND when imageSrc changes.
  // Camera & controls are untouched → viewing direction stays.
  // Uses a retry poll so it never misses the mesh even if
  // the init effect hasn't committed yet.
  // On variant swap the old texture stays visible (no spinner)
  // until the new one is ready → seamless transition.
  // ════════════════════════════════════════════════════════
  useEffect(() => {
    if (mode === 'split') return;
    if (!imageSrc) return;

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout>;

    const attempt = () => {
      if (cancelled) return;

      // Mesh might not exist yet on first mount — retry
      if (!sphereRef.current) {
        retryTimer = setTimeout(attempt, 30);
        return;
      }

      const mat = sphereRef.current.material as THREE.MeshBasicMaterial;
      const isFirstLoad = !mat.map; // no texture yet → show spinner

      if (isFirstLoad) setLoading(true);
      setError(null);

      loadTexture(imageSrc)
        .then((tex) => {
          if (cancelled || !sphereRef.current) return;
          setMeshTexture(sphereRef.current, tex);
          setLoading(false);
        })
        .catch((err) => {
          if (cancelled) return;
          console.error(err);
          if (isFirstLoad) {
            setError(`Image not found: ${imageSrc}`);
            setLoading(false);
          }
        });
    };

    attempt();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
    };
  }, [imageSrc, mode]);

  // ════════════════════════════════════════════════════════
  // EFFECT 3 — Load textures for split mode
  // ════════════════════════════════════════════════════════
  useEffect(() => {
    if (mode !== 'split') return;

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout>;

    const attempt = () => {
      if (cancelled) return;

      if (!sphereBeforeRef.current || !sphereRef.current) {
        retryTimer = setTimeout(attempt, 30);
        return;
      }

      setLoading(true);
      setError(null);

      const meshBefore = sphereBeforeRef.current;
      const meshAfter = sphereRef.current;

      Promise.all([
        imageSrcBefore
          ? loadTexture(imageSrcBefore).then((t) => {
              if (!cancelled && meshBefore) setMeshTexture(meshBefore, t);
            })
          : Promise.resolve(),
        imageSrcAfter
          ? loadTexture(imageSrcAfter).then((t) => {
              if (!cancelled && meshAfter) setMeshTexture(meshAfter, t);
            })
          : Promise.resolve(),
      ])
        .then(() => {
          if (!cancelled) setLoading(false);
        })
        .catch((err) => {
          if (!cancelled) {
            console.error(err);
            setError('Failed to load split panoramas');
            setLoading(false);
          }
        });
    };

    attempt();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
    };
  }, [mode, imageSrcBefore, imageSrcAfter]);

  // ── Zoom ──
  const handleZoom = (delta: number) => {
    if (cameraRef.current) {
      cameraRef.current.fov = Math.max(
        30,
        Math.min(100, cameraRef.current.fov + delta)
      );
      cameraRef.current.updateProjectionMatrix();
    }
  };

  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-neutral-900 overflow-hidden select-none cursor-move group"
    >
      {/* ── Loading spinner ── */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-900">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* ── Error overlay ── */}
      {error && !loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-900">
          <div className="text-center px-6">
            <p className="text-red-400 text-sm mb-2">{error}</p>
            <p className="text-neutral-600 text-xs">
              Make sure image files exist in <code className="text-neutral-400">/public</code>
            </p>
          </div>
        </div>
      )}

      {/* ═══════ SPLIT VIEW UI ═══════ */}
      {mode === 'split' && (
        <>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute top-1/2 left-0 w-full z-30 opacity-0 cursor-ew-resize h-20 -translate-y-1/2"
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white z-20 pointer-events-none shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-3 bg-neutral-900" />
                <div className="w-0.5 h-3 bg-neutral-900" />
              </div>
            </div>
          </div>
          <div className="absolute top-6 left-6 bg-black/60 backdrop-blur px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest text-white border border-white/10 z-20">
            Original State
          </div>
          <div className="absolute top-6 right-6 bg-white text-neutral-950 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest border border-white z-20 shadow-lg">
            Virtual Staging
          </div>
        </>
      )}

      {/* ═══════ INTERACTIVE VIEW UI ═══════ */}
      {mode === 'interactive' && (
        <>
          {/* Top HUD Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-30 pointer-events-none">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full pointer-events-auto">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                  Live Fusion Engine
                </span>
              </div>
              <span className="text-[10px] text-white/40 font-mono pl-2">
                FPS: 60 | LAT: 12ms
              </span>
            </div>
          </div>

          {/* Right Toolbar */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30 pointer-events-none">
            {[
              { icon: Sun, label: 'Lighting' },
              { icon: Camera, label: 'Capture' },
            ].map((item, i) => (
              <button
                key={i}
                className="pointer-events-auto w-10 h-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 hover:scale-110 transition-all group relative"
              >
                <item.icon size={18} />
                <span className="absolute right-full mr-3 bg-black/80 px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-8 right-6 flex flex-col gap-2 z-30">
            <button
              onClick={() => handleZoom(-5)}
              className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-neutral-200 transition-colors"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={() => handleZoom(5)}
              className="w-10 h-10 bg-black/60 backdrop-blur border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <Minus size={18} />
            </button>
          </div>

          {/* Floating Hotspots */}
          {hotspotScreenPos.map((pos) => {
            if (!pos.visible) return null;
            const hotspot = hotspots[pos.id];
            const isActive = activeHotspots.includes(pos.id);

            return (
              <div
                key={pos.id}
                className="absolute z-20 pointer-events-none"
                style={{
                  left: 0,
                  top: 0,
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                }}
              >
                <button
                  onClick={() => {
                    setActiveHotspots(prev => 
                      prev.includes(pos.id) 
                        ? prev.filter(id => id !== pos.id)
                        : [...prev, pos.id]
                    );
                  }}
                  className={`pointer-events-auto -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                    isActive
                      ? 'bg-white text-black scale-110'
                      : 'bg-black/40 text-white border border-white/50 hover:bg-white hover:text-black'
                  }`}
                >
                  <span className="absolute inset-0 rounded-full bg-white/30 animate-ping opacity-75" />
                  <Plus
                    size={16}
                    className={`relative z-10 transition-transform ${
                      isActive ? 'rotate-45' : ''
                    }`}
                  />
                </button>

                {/* Info Card */}
                <div
                  className={`absolute left-6 top-1/2 -translate-y-1/2 ml-4 w-72 bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl transition-all duration-300 origin-left shadow-2xl z-30 ${
                    isActive
                      ? 'opacity-100 scale-100 pointer-events-auto'
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                  style={{
                    display: isActive ? 'block' : 'none'
                  }}
                >
                  <h4 className="text-white font-display text-lg mb-2">
                    {hotspot.label}
                  </h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {hotspot.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Variant Configurator */}
          {variants.length > 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-6">
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-1.5 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {variants.map((v, i) => {
                    const isActive = imageSrc === v.src;
                    return (
                      <button
                        key={i}
                        onClick={() => onVariantChange?.(v.src)}
                        className={`flex-1 min-w-[100px] py-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                          isActive
                            ? 'bg-white text-neutral-950 shadow-md'
                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span
                          className={`text-xs font-bold tracking-wider uppercase ${
                            isActive
                              ? 'text-neutral-950'
                              : 'text-neutral-500'
                          }`}
                        >
                          {v.name}
                        </span>
                        {isActive && (
                          <div className="w-1 h-1 bg-neutral-950 rounded-full mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══════ NORMAL VIEW UI ═══════ */}
      {mode === 'normal' && (
        <div className="absolute top-6 left-6 z-20">
          <div className="bg-black/50 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
            <Layers size={14} className="text-white/60" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">
              3D Context
            </span>
          </div>
        </div>
      )}

      {/* ── Drag hint (fades when user starts dragging) ── */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
          isControlsActive ? 'opacity-0' : 'opacity-100'
        } delay-500`}
      >
        <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 text-white/70 text-xs flex items-center gap-2">
          <Move size={14} />
          <span>Drag to explore</span>
        </div>
      </div>
    </div>
  );
};

export default PanoramaViewer;