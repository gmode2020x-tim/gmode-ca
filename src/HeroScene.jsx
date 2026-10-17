import React, { useEffect, useRef } from "react";
import { Satellite, Wifi } from "lucide-react";

export default function HeroScene() {
  const host = useRef(null);

  useEffect(() => {
    const scene = host.current;
    if (!scene) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function handlePointer(event) {
      if (reducedMotion.matches) return;
      const bounds = scene.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / Math.max(1, bounds.width)) - 0.5;
      const y = ((event.clientY - bounds.top) / Math.max(1, bounds.height)) - 0.5;
      scene.style.setProperty("--scene-x", `${x * -12}px`);
      scene.style.setProperty("--scene-y", `${y * -8}px`);
    }

    function resetPointer() {
      scene.style.setProperty("--scene-x", "0px");
      scene.style.setProperty("--scene-y", "0px");
    }

    scene.addEventListener("pointermove", handlePointer, { passive: true });
    scene.addEventListener("pointerleave", resetPointer);

    return () => {
      scene.removeEventListener("pointermove", handlePointer);
      scene.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return (
    <div className="hero-scene" ref={host} aria-hidden="true">
      <div className="hero-scene__motion">
        <img
          className="hero-scene__image"
          src="/brand/gmode-controller-network-hero.png"
          alt=""
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <div className="hero-scene__glow" />
      <div className="hero-scene__scan" />
      <span className="hero-scene__signal hero-scene__signal--one" />
      <span className="hero-scene__signal hero-scene__signal--two" />
      <span className="hero-scene__signal hero-scene__signal--three" />
      <span className="hero-scene__signal hero-scene__signal--four" />
      <span className="hero-scene__marker hero-scene__marker--gps"><Satellite size={18} /></span>
      <span className="hero-scene__marker hero-scene__marker--wifi"><Wifi size={18} /></span>
    </div>
  );
}
