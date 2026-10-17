import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const nodePositions = [
  [-2.05, 0.2, 0.35],
  [-0.9, 1.8, 0.55],
  [1.25, 1.45, -0.2],
  [2.1, -0.15, 0.5],
  [0.72, -1.85, 0.1],
  [-1.15, -1.55, -0.55],
];

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export default function HeroScene() {
  const host = useRef(null);

  useEffect(() => {
    const container = host.current;
    if (!container) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      container.dataset.fallback = "true";
      return undefined;
    }

    container.dataset.fallback = "false";
    renderer.setClearColor(0x03070c, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.domElement.className = "hero-scene__canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x03070c, 0.052);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 0, 8.2);

    const system = new THREE.Group();
    scene.add(system);

    const shellGeometry = new THREE.IcosahedronGeometry(2.15, 3);
    const shell = new THREE.Mesh(
      shellGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x168cff,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      }),
    );
    system.add(shell);

    const vertexPoints = new THREE.Points(
      shellGeometry,
      new THREE.PointsMaterial({
        color: 0x55d8ff,
        size: 0.026,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    system.add(vertexPoints);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.62, 2),
      new THREE.MeshStandardMaterial({
        color: 0x06101c,
        emissive: 0x0878e8,
        emissiveIntensity: 0.28,
        roughness: 0.2,
        metalness: 0.9,
        transparent: true,
        opacity: 0.76,
      }),
    );
    system.add(core);
    const coreWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.72, 1),
      new THREE.MeshBasicMaterial({
        color: 0x8fe8ff,
        wireframe: true,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    system.add(coreWire);

    const rings = [
      [2.55, 0.01, 0.18, 0.32],
      [2.78, 0.008, -0.72, -0.2],
    ].map(([radius, tube, x, z], index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, 5, 180),
        new THREE.MeshBasicMaterial({
          color: index ? 0x28547c : 0x168cff,
          transparent: true,
          opacity: index ? 0.34 : 0.58,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      ring.rotation.set(x, index ? 0.9 : -0.36, z);
      system.add(ring);
      return ring;
    });

    const nodeGeometry = new THREE.SphereGeometry(0.095, 14, 10);
    const nodes = new THREE.InstancedMesh(
      nodeGeometry,
      new THREE.MeshStandardMaterial({
        color: 0x8fe8ff,
        emissive: 0x168cff,
        emissiveIntensity: 2.3,
        roughness: 0.25,
      }),
      nodePositions.length,
    );
    const nodeMatrix = new THREE.Matrix4();
    nodePositions.forEach((position, index) => {
      nodeMatrix.makeTranslation(...position);
      nodes.setMatrixAt(index, nodeMatrix);
    });
    system.add(nodes);

    const curves = [
      new THREE.CatmullRomCurve3(nodePositions.slice(0, 4).map((point) => new THREE.Vector3(...point))),
      new THREE.CatmullRomCurve3([0, 3, 4, 5].map((index) => new THREE.Vector3(...nodePositions[index]))),
      new THREE.CatmullRomCurve3([1, 2, 4, 5].map((index) => new THREE.Vector3(...nodePositions[index]))),
    ];
    curves.forEach((curve, index) => {
      const material = new THREE.LineBasicMaterial({
        color: index === 1 ? 0x55d8ff : 0x168cff,
        transparent: true,
        opacity: index === 1 ? 0.42 : 0.3,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      system.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(90)), material));
    });

    const signalCount = 30;
    const signalPositions = new Float32Array(signalCount * 3);
    const signalGeometry = new THREE.BufferGeometry();
    signalGeometry.setAttribute("position", new THREE.BufferAttribute(signalPositions, 3));
    const signals = new THREE.Points(
      signalGeometry,
      new THREE.PointsMaterial({
        color: 0xc5f4ff,
        size: 0.08,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    system.add(signals);

    const random = seededRandom(47);
    const starPositions = new Float32Array(660 * 3);
    for (let index = 0; index < starPositions.length; index += 3) {
      starPositions[index] = (random() - 0.5) * 18;
      starPositions[index + 1] = (random() - 0.5) * 10;
      starPositions[index + 2] = -2 - random() * 12;
    }
    const stars = new THREE.Points(
      new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(starPositions, 3)),
      new THREE.PointsMaterial({ color: 0x3b78a6, size: 0.025, transparent: true, opacity: 0.52, depthWrite: false }),
    );
    scene.add(stars);

    scene.add(new THREE.AmbientLight(0x9bdcff, 0.85));
    const keyLight = new THREE.PointLight(0x168cff, 19, 18, 2);
    keyLight.position.set(3.4, 2.8, 4.5);
    scene.add(keyLight);
    const edgeLight = new THREE.PointLight(0x55d8ff, 10, 14, 2);
    edgeLight.position.set(-3.2, -2.2, 2.8);
    scene.add(edgeLight);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = new THREE.Vector2();
    const size = { width: 0, height: 0 };
    let frame = 0;
    let active = true;
    let start = performance.now();

    function layout() {
      const bounds = container.getBoundingClientRect();
      size.width = Math.max(1, Math.round(bounds.width));
      size.height = Math.max(1, Math.round(bounds.height));
      renderer.setSize(size.width, size.height, false);
      camera.aspect = size.width / size.height;
      camera.position.z = size.width < 760 ? 9.8 : 8.2;
      system.position.set(size.width < 760 ? 1.45 : 1.75, size.width < 760 ? 0.65 : 0, 0);
      system.scale.setScalar(size.width < 760 ? 0.78 : 1);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }

    function updateSignals(elapsed) {
      const point = new THREE.Vector3();
      for (let index = 0; index < signalCount; index += 1) {
        const curve = curves[index % curves.length];
        const offset = elapsed * (0.055 + (index % 5) * 0.008) + index / signalCount;
        const progress = ((offset % 1) + 1) % 1;
        curve.getPoint(progress, point);
        point.toArray(signalPositions, index * 3);
      }
      signalGeometry.attributes.position.needsUpdate = true;
    }

    function draw(now) {
      frame = requestAnimationFrame(draw);
      if (!active || document.hidden) return;
      const elapsed = (now - start) / 1000;
      const motion = reducedMotion.matches ? 0 : 1;
      shell.rotation.y = elapsed * 0.035 * motion;
      vertexPoints.rotation.y = shell.rotation.y;
      core.rotation.set(elapsed * 0.08 * motion, elapsed * 0.11 * motion, elapsed * 0.04 * motion);
      coreWire.rotation.set(-elapsed * 0.055 * motion, elapsed * 0.075 * motion, -elapsed * 0.035 * motion);
      rings[0].rotation.z = 0.32 + elapsed * 0.025 * motion;
      rings[1].rotation.y = 0.9 - elapsed * 0.02 * motion;
      system.rotation.x += ((pointer.y * -0.08 * motion) - system.rotation.x) * 0.035;
      system.rotation.y += ((pointer.x * 0.11 * motion) - system.rotation.y) * 0.035;
      updateSignals(elapsed * motion);
      renderer.render(scene, camera);
    }

    function handlePointer(event) {
      const bounds = container.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * 2 - 1;
      pointer.y = ((event.clientY - bounds.top) / Math.max(1, bounds.height)) * 2 - 1;
    }

    function handleVisibility() {
      if (!document.hidden) start = performance.now();
    }

    const resizeObserver = new ResizeObserver(layout);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) start = performance.now();
    }, { threshold: 0.02 });
    resizeObserver.observe(container);
    visibilityObserver.observe(container);
    container.addEventListener("pointermove", handlePointer, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    layout();
    updateSignals(0);
    renderer.render(scene, camera);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener("pointermove", handlePointer);
      document.removeEventListener("visibilitychange", handleVisibility);
      shellGeometry.dispose();
      nodeGeometry.dispose();
      signalGeometry.dispose();
      scene.traverse((object) => {
        if (object.geometry && object.geometry !== shellGeometry && object.geometry !== nodeGeometry && object.geometry !== signalGeometry) object.geometry.dispose();
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
        else object.material?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="hero-scene" ref={host} aria-hidden="true" />;
}
