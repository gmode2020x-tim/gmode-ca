import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const networkDefinitions = [
  { position: [-2.45, 1.42, -0.22], port: [-0.72, 0.66, 0.46], color: 0x31b9ff },
  { position: [2.45, 1.42, -0.5], port: [0.72, 0.66, 0.46], color: 0x7ce6ff },
  { position: [-2.45, -1.42, 0.16], port: [-0.72, -0.66, 0.46], color: 0x168cff },
  { position: [2.45, -1.42, -0.06], port: [0.72, -0.66, 0.46], color: 0x56d8c9 },
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

    const statusBars = [];
    const controllerModuleYs = [-0.69, -0.23, 0.23, 0.69];
    controllerModuleYs.forEach((moduleY, moduleIndex) => {
      const moduleBody = new THREE.Mesh(
        new THREE.BoxGeometry(1.32, 0.38, 0.8),
        new THREE.MeshStandardMaterial({
          color: 0x08131f,
          emissive: moduleIndex % 2 ? 0x05233c : 0x062b48,
          emissiveIntensity: 0.34,
          metalness: 0.9,
          roughness: 0.24,
        }),
      );
      moduleBody.position.y = moduleY;
      controller.add(moduleBody);
      const moduleEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(moduleBody.geometry),
        edgeMaterial(moduleIndex % 2 ? 0x3a779e : 0x31b9ff, 0.66),
      );
      moduleEdges.position.y = moduleY;
      controller.add(moduleEdges);

      const frontPanel = new THREE.Mesh(
        new THREE.BoxGeometry(1.05, 0.24, 0.035),
        new THREE.MeshBasicMaterial({ color: 0x010509, transparent: true, opacity: 0.96 }),
      );
      frontPanel.position.set(0, moduleY, 0.415);
      controller.add(frontPanel);

      for (let lightIndex = 0; lightIndex < 5; lightIndex += 1) {
        const light = new THREE.Mesh(
          new THREE.BoxGeometry(0.075, 0.035, 0.025),
          new THREE.MeshBasicMaterial({
            color: lightIndex === 4 ? 0x56d8c9 : 0x31b9ff,
            transparent: true,
            opacity: 0.62,
          }),
        );
        light.position.set(-0.36 + lightIndex * 0.12, moduleY, 0.445);
        controller.add(light);
        statusBars.push(light);
      }

      for (let ventIndex = 0; ventIndex < 4; ventIndex += 1) {
        const vent = new THREE.Mesh(
          new THREE.BoxGeometry(0.025, 0.15, 0.025),
          new THREE.MeshBasicMaterial({ color: 0x17354b, transparent: true, opacity: 0.7 }),
        );
        vent.position.set(0.27 + ventIndex * 0.055, moduleY, 0.445);
        controller.add(vent);
      }
    });

    [-0.72, 0.72].forEach((x) => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 1.92, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x101b26, metalness: 0.94, roughness: 0.2 }),
      );
      rail.position.x = x;
      controller.add(rail);
    });

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.18, 1.12),
      new THREE.MeshStandardMaterial({ color: 0x071019, metalness: 0.9, roughness: 0.24 }),
    );
    base.position.y = -1.02;
    controller.add(base);
    const baseTrim = new THREE.Mesh(
      new THREE.BoxGeometry(1.48, 0.12, 0.96),
      new THREE.MeshStandardMaterial({ color: 0x0c1e2d, emissive: 0x073b66, emissiveIntensity: 0.45, metalness: 0.82, roughness: 0.24 }),
    );
    baseTrim.position.y = -0.89;
    controller.add(baseTrim);
    const topCap = baseTrim.clone();
    topCap.scale.set(0.86, 0.78, 0.86);
    topCap.position.y = 0.93;
    controller.add(topCap);

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

    const controllerScan = new THREE.Mesh(
      new THREE.PlaneGeometry(1.08, 0.022),
      new THREE.MeshBasicMaterial({
        color: 0xa9f3ff,
        transparent: true,
        opacity: 0.68,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    controllerScan.position.set(0, -0.84, 0.46);
    controller.add(controllerScan);

    const routeCurves = [];
    const routeMaterials = [];
    const networkGroups = [];
    const nodeMaterials = [];
    const packetGroups = [];
    const gpsBeamMaterials = [];
    const satelliteGroups = [];
    const wifiArcMaterials = [];

    networkDefinitions.forEach((definition, networkIndex) => {
      const [networkX, networkY, networkZ] = definition.position;
      const topology = networkTopologies[networkIndex];
      const network = new THREE.Group();
      network.position.set(networkX, networkY, networkZ);
      network.rotation.set(networkIndex < 2 ? -0.04 : 0.055, networkX < 0 ? 0.08 : -0.08, networkX < 0 ? -0.025 : 0.025);
      system.add(network);
      networkGroups.push(network);

      const lowerPlatform = new THREE.Mesh(
        new THREE.BoxGeometry(1.16, 0.72, 0.12),
        new THREE.MeshStandardMaterial({
          color: 0x08131d,
          emissive: 0x04192c,
          emissiveIntensity: 0.24,
          metalness: 0.86,
          roughness: 0.28,
        }),
      );
      lowerPlatform.position.z = -0.17;
      network.add(lowerPlatform);

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

      if (networkIndex === 0) {
        const receiverMaterial = new THREE.MeshStandardMaterial({
          color: 0x081725,
          emissive: definition.color,
          emissiveIntensity: 1.5,
          metalness: 0.62,
          roughness: 0.3,
        });
        const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.18), receiverMaterial);
        receiver.position.set(0, -0.27, 0.11);
        network.add(receiver);
        nodeMaterials.push(receiverMaterial);

        const satellitePositions = [[-0.42, 0.24], [0, 0.31], [0.42, 0.2]];
        const gpsConnections = [];
        satellitePositions.forEach(([x, y], satelliteIndex) => {
          const satellite = new THREE.Group();
          satellite.position.set(x, y, 0.12);
          const satelliteMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a1926,
            emissive: definition.color,
            emissiveIntensity: 0.82,
            metalness: 0.78,
            roughness: 0.26,
          });
          const body = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.13), satelliteMaterial);
          const panelGeometry = new THREE.BoxGeometry(0.11, 0.055, 0.035);
          const leftPanel = new THREE.Mesh(panelGeometry, satelliteMaterial);
          const rightPanel = new THREE.Mesh(panelGeometry, satelliteMaterial);
          leftPanel.position.x = -0.11;
          rightPanel.position.x = 0.11;
          satellite.add(body, leftPanel, rightPanel);
          satellite.rotation.z = satelliteIndex === 1 ? 0 : satelliteIndex === 0 ? -0.12 : 0.12;
          network.add(satellite);
          satelliteGroups.push(satellite);
          nodeMaterials.push(satelliteMaterial);
          gpsConnections.push(x, y, 0.05, 0, -0.27, 0.05);
        });
        const gpsGeometry = new THREE.BufferGeometry();
        gpsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(gpsConnections, 3));
        const gpsMaterial = edgeMaterial(definition.color, 0.48);
        gpsBeamMaterials.push(gpsMaterial);
        network.add(new THREE.LineSegments(gpsGeometry, gpsMaterial));
      } else if (networkIndex === 1) {
        const routerMaterial = new THREE.MeshStandardMaterial({
          color: 0x081725,
          emissive: definition.color,
          emissiveIntensity: 1.55,
          metalness: 0.62,
          roughness: 0.3,
        });
        const router = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.13, 0.18), routerMaterial);
        router.position.set(0, -0.3, 0.11);
        network.add(router);
        nodeMaterials.push(routerMaterial);

        [-0.48, 0.48].forEach((x) => {
          const clientMaterial = new THREE.MeshStandardMaterial({
            color: 0x081725,
            emissive: definition.color,
            emissiveIntensity: 0.78,
            metalness: 0.58,
            roughness: 0.32,
          });
          const client = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), clientMaterial);
          client.position.set(x, 0.2, 0.1);
          network.add(client);
          nodeMaterials.push(clientMaterial);
        });

        [0.18, 0.31, 0.44].forEach((radius) => {
          const arc = new THREE.EllipseCurve(0, -0.22, radius, radius * 0.78, Math.PI * 0.2, Math.PI * 0.8);
          const points = arc.getPoints(28).map(({ x, y }) => new THREE.Vector3(x, y, 0.07));
          const arcMaterial = edgeMaterial(definition.color, 0.48);
          wifiArcMaterials.push(arcMaterial);
          network.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), arcMaterial));
        });
      } else {
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
      }

      const port = new THREE.Vector3(...definition.port);
      const edgeX = networkX < 0 ? networkX + 0.69 : networkX - 0.69;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(edgeX, networkY, networkZ + 0.08),
        new THREE.Vector3(networkX * 0.58, networkY * 0.86, networkZ * 0.45 + 0.18),
        new THREE.Vector3(port.x * 1.35, port.y * 1.42, 0.3),
        port,
      ]);
      routeCurves.push(curve);

      const routeMaterial = edgeMaterial(definition.color, 0.34);
      routeMaterials.push(routeMaterial);
      system.add(new THREE.Mesh(
        new THREE.TubeGeometry(curve, 72, 0.018, 5, false),
        new THREE.MeshBasicMaterial({
          color: definition.color,
          transparent: true,
          opacity: 0.18,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ));
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

    const pedestalGlow = new THREE.Mesh(
      new THREE.RingGeometry(0.72, 1.62, 64),
      new THREE.MeshBasicMaterial({
        color: 0x168cff,
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    pedestalGlow.scale.y = 0.2;
    pedestalGlow.position.set(0, -1.14, -0.2);
    system.add(pedestalGlow);

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
      camera.position.z = size.width < 760 ? 13.5 : 8.6;
      system.position.set(size.width < 760 ? 0.3 : 1.78, size.width < 760 ? 0.55 : 0, 0);
      system.scale.setScalar(size.width < 760 ? 0.64 : 1);
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
      controllerScan.position.y = -0.84 + (((elapsed * 0.2 * motion) % 1) * 1.68);
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
      gpsBeamMaterials.forEach((material) => {
        material.opacity = 0.28 + ((Math.sin(elapsed * 3.4) + 1) * 0.22 * motion);
      });
      satelliteGroups.forEach((satellite, index) => {
        satellite.rotation.z += Math.sin(elapsed * 1.6 + index) * 0.0008 * motion;
      });
      wifiArcMaterials.forEach((material, index) => {
        const wave = (Math.sin(elapsed * 4.2 - index * 0.85) + 1) / 2;
        material.opacity = 0.18 + wave * 0.62 * motion;
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
