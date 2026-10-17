import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const networkDefinitions = [
  { position: [-2.45, 1.38, 0], port: [-0.88, 0.34, 0.48], color: 0x31b9ff },
  { position: [2.45, 1.38, 0], port: [0.88, 0.34, 0.48], color: 0x7ce6ff },
  { position: [-2.45, -1.38, 0], port: [-0.88, -0.34, 0.48], color: 0x168cff },
  { position: [2.45, -1.38, 0], port: [0.88, -0.34, 0.48], color: 0x56d8c9 },
];

const networkTopologies = [
  {
    hub: 1,
    nodes: [[-0.48, 0.22], [0, 0.34], [0.48, 0.16], [-0.28, -0.25], [0.32, -0.28]],
    connections: [[0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 4]],
  },
  {
    hub: 2,
    nodes: [[-0.5, 0.26], [-0.48, -0.25], [0, 0], [0.46, 0.3], [0.5, -0.24], [0.05, -0.34]],
    connections: [[0, 2], [1, 2], [2, 3], [2, 4], [2, 5], [3, 4]],
  },
  {
    hub: 0,
    nodes: [[-0.42, 0.28], [0.08, 0.3], [0.48, 0.05], [0.24, -0.3], [-0.32, -0.28], [-0.52, 0]],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  },
  {
    hub: 2,
    nodes: [[-0.5, 0.27], [-0.16, 0.27], [0.17, 0.05], [0.5, 0.29], [-0.17, -0.28], [0.5, -0.25]],
    connections: [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5], [3, 5], [4, 5]],
  },
];

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function edgeMaterial(color, opacity) {
  return new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
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
    scene.fog = new THREE.FogExp2(0x03070c, 0.045);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 0, 8.6);

    const system = new THREE.Group();
    system.rotation.x = -0.18;
    system.rotation.y = -0.08;
    scene.add(system);

    const controller = new THREE.Group();
    system.add(controller);

    const controllerBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.95, 1.18, 0.72),
      new THREE.MeshStandardMaterial({
        color: 0x07111d,
        emissive: 0x06294a,
        emissiveIntensity: 0.3,
        metalness: 0.84,
        roughness: 0.28,
      }),
    );
    controller.add(controllerBody);

    controller.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(controllerBody.geometry),
      edgeMaterial(0x31b9ff, 0.74),
    ));

    const frontPanel = new THREE.Mesh(
      new THREE.BoxGeometry(1.65, 0.88, 0.035),
      new THREE.MeshBasicMaterial({ color: 0x02060a, transparent: true, opacity: 0.94 }),
    );
    frontPanel.position.z = 0.375;
    controller.add(frontPanel);

    const ports = [];
    const portGeometry = new THREE.BoxGeometry(0.22, 0.18, 0.08);
    networkDefinitions.forEach(({ port, color }) => {
      const portMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a1d2c,
        emissive: color,
        emissiveIntensity: 1.1,
        metalness: 0.55,
        roughness: 0.24,
      });
      const portMesh = new THREE.Mesh(portGeometry, portMaterial);
      portMesh.position.set(...port);
      controller.add(portMesh);
      ports.push(portMesh);
    });

    const statusBars = [];
    for (let index = 0; index < 7; index += 1) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.04, 0.025),
        new THREE.MeshBasicMaterial({ color: index < 5 ? 0x31b9ff : 0x56d8c9, transparent: true, opacity: 0.64 }),
      );
      bar.position.set(-0.38 + index * 0.13, 0, 0.405);
      controller.add(bar);
      statusBars.push(bar);
    }

    const controllerScan = new THREE.Mesh(
      new THREE.PlaneGeometry(1.55, 0.025),
      new THREE.MeshBasicMaterial({
        color: 0xa9f3ff,
        transparent: true,
        opacity: 0.68,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    controllerScan.position.set(0, -0.4, 0.425);
    controller.add(controllerScan);

    const routeCurves = [];
    const routeMaterials = [];
    const networkGroups = [];
    const nodeMaterials = [];
    const packetGroups = [];

    networkDefinitions.forEach((definition, networkIndex) => {
      const [networkX, networkY] = definition.position;
      const topology = networkTopologies[networkIndex];
      const network = new THREE.Group();
      network.position.set(networkX, networkY, -0.02);
      system.add(network);
      networkGroups.push(network);

      const platform = new THREE.Mesh(
        new THREE.BoxGeometry(1.38, 0.9, 0.08),
        new THREE.MeshStandardMaterial({
          color: 0x06101a,
          emissive: 0x052039,
          emissiveIntensity: 0.28,
          metalness: 0.75,
          roughness: 0.34,
          transparent: true,
          opacity: 0.88,
        }),
      );
      platform.position.z = -0.08;
      network.add(platform);
      network.add(new THREE.LineSegments(new THREE.EdgesGeometry(platform.geometry), edgeMaterial(definition.color, 0.46)));

      const connectionPositions = [];
      topology.connections.forEach(([from, to]) => {
        const startNode = topology.nodes[from];
        const endNode = topology.nodes[to];
        connectionPositions.push(startNode[0], startNode[1], 0.02, endNode[0], endNode[1], 0.02);
      });
      const localGeometry = new THREE.BufferGeometry();
      localGeometry.setAttribute("position", new THREE.Float32BufferAttribute(connectionPositions, 3));
      network.add(new THREE.LineSegments(localGeometry, edgeMaterial(definition.color, 0.42)));

      const nodes = new THREE.Group();
      topology.nodes.forEach(([x, y], nodeIndex) => {
        const isHub = nodeIndex === topology.hub;
        const material = new THREE.MeshStandardMaterial({
          color: 0x081725,
          emissive: definition.color,
          emissiveIntensity: isHub ? 1.8 : 0.82,
          metalness: 0.62,
          roughness: 0.3,
        });
        const node = new THREE.Mesh(
          new THREE.BoxGeometry(isHub ? 0.22 : 0.16, isHub ? 0.22 : 0.16, isHub ? 0.24 : 0.16),
          material,
        );
        node.position.set(x, y, 0.1);
        nodes.add(node);
        nodeMaterials.push(material);
      });
      network.add(nodes);

      const port = new THREE.Vector3(...definition.port);
      const edgeX = networkX < 0 ? networkX + 0.69 : networkX - 0.69;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(edgeX, networkY, 0.08),
        new THREE.Vector3(networkX * 0.58, networkY * 0.86, 0.18),
        new THREE.Vector3(port.x * 1.35, port.y * 1.42, 0.3),
        port,
      ]);
      routeCurves.push(curve);

      const routeMaterial = edgeMaterial(definition.color, 0.34);
      routeMaterials.push(routeMaterial);
      system.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(72)), routeMaterial));

      const packets = [];
      for (let packetIndex = 0; packetIndex < 4; packetIndex += 1) {
        const packet = new THREE.Mesh(
          new THREE.BoxGeometry(0.075, 0.075, 0.075),
          new THREE.MeshBasicMaterial({
            color: packetIndex === 0 ? 0xffffff : definition.color,
            transparent: true,
            opacity: packetIndex === 0 ? 1 : 0.78,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        system.add(packet);
        packets.push(packet);
      }
      packetGroups.push(packets);
    });

    const random = seededRandom(47);
    const backgroundPositions = new Float32Array(520 * 3);
    for (let index = 0; index < backgroundPositions.length; index += 3) {
      backgroundPositions[index] = (random() - 0.5) * 18;
      backgroundPositions[index + 1] = (random() - 0.5) * 9;
      backgroundPositions[index + 2] = -2 - random() * 12;
    }
    const background = new THREE.Points(
      new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(backgroundPositions, 3)),
      new THREE.PointsMaterial({ color: 0x356d99, size: 0.022, transparent: true, opacity: 0.46, depthWrite: false }),
    );
    scene.add(background);

    const grid = new THREE.GridHelper(13, 22, 0x174a72, 0x0b2336);
    grid.rotation.x = Math.PI / 2;
    grid.position.z = -0.62;
    grid.material.transparent = true;
    grid.material.opacity = 0.22;
    system.add(grid);

    scene.add(new THREE.AmbientLight(0x92dfff, 1.05));
    const keyLight = new THREE.PointLight(0x168cff, 18, 17, 2);
    keyLight.position.set(3.5, 3.1, 4.8);
    scene.add(keyLight);
    const edgeLight = new THREE.PointLight(0x56d8c9, 8, 13, 2);
    edgeLight.position.set(-3.2, -2.4, 3.2);
    scene.add(edgeLight);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = new THREE.Vector2();
    const point = new THREE.Vector3();
    const targetScale = new THREE.Vector3(1, 1, 1);
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
      camera.position.z = size.width < 760 ? 10.8 : 8.6;
      system.position.set(size.width < 760 ? 0.9 : 1.78, size.width < 760 ? 0.55 : 0, 0);
      system.scale.setScalar(size.width < 760 ? 0.62 : 1);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }

    function updatePackets(elapsed, motion) {
      packetGroups.forEach((packets, routeIndex) => {
        packets.forEach((packet, packetIndex) => {
          const offset = elapsed * (0.12 + routeIndex * 0.008) * motion + packetIndex / packets.length + routeIndex * 0.11;
          const progress = ((offset % 1) + 1) % 1;
          routeCurves[routeIndex].getPoint(progress, point);
          packet.position.copy(point);
          const pulse = 0.82 + Math.sin(elapsed * 5 + packetIndex) * 0.18 * motion;
          packet.scale.setScalar(pulse);
        });
      });
    }

    function draw(now) {
      frame = requestAnimationFrame(draw);
      if (!active || document.hidden) return;
      const elapsed = Math.max(0, (now - start) / 1000);
      const motion = reducedMotion.matches ? 0 : 1;
      const activeNetwork = Math.floor(elapsed / 2.6) % networkDefinitions.length;

      system.rotation.x += ((pointer.y * -0.045 * motion - 0.18) - system.rotation.x) * 0.035;
      system.rotation.y += ((pointer.x * 0.07 * motion - 0.08) - system.rotation.y) * 0.035;
      controllerScan.position.y = -0.4 + (((elapsed * 0.22 * motion) % 1) * 0.8);
      controllerScan.material.opacity = motion ? 0.42 + Math.sin(elapsed * 4) * 0.16 : 0.42;

      routeMaterials.forEach((material, index) => {
        material.opacity = index === activeNetwork ? 0.78 : 0.26;
        ports[index].material.emissiveIntensity = index === activeNetwork ? 2.8 : 0.9;
        const emphasis = index === activeNetwork ? 1.025 : 1;
        targetScale.setScalar(emphasis);
        networkGroups[index].scale.lerp(targetScale, 0.035);
      });
      statusBars.forEach((bar, index) => {
        bar.material.opacity = 0.38 + ((Math.sin(elapsed * 3.2 + index * 0.7) + 1) * 0.22 * motion);
      });
      nodeMaterials.forEach((material, index) => {
        material.emissiveIntensity = 0.7 + ((Math.sin(elapsed * 2.4 + index * 0.58) + 1) * 0.26 * motion);
      });
      updatePackets(elapsed, motion);
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
    updatePackets(0, 0);
    renderer.render(scene, camera);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener("pointermove", handlePointer);
      document.removeEventListener("visibilitychange", handleVisibility);
      scene.traverse((object) => {
        object.geometry?.dispose?.();
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
        else object.material?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="hero-scene" ref={host} aria-hidden="true" />;
}
