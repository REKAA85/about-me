import { useEffect, useRef, useState } from "react";

// The 3D card, in CSS 3D transforms rather than WebGL: the faces are plain
// <img>s, so the art is drawn by the browser at exactly the quality of the
// flat view, and nothing heavier than this file ships with the page.
//
// The card is the back face (the artwork, facing the viewer at rest), the
// front face turned 180deg behind it, and a few paper-white layers between
// them that read as the card's edge. Click and drag spins it; letting go
// settles it onto whichever face it is nearer, carrying the flick's speed.
// One rAF loop writes the transform straight to the element, so dragging
// never re-renders React.

// Card thickness in CSS px, split across this many paper layers.
const THICKNESS = 3;
const LAYERS = 4;
const DRAG_SPEED = 0.01;
const MAX_PITCH = 0.45;

// Where the card actually is inside its image, in image pixels: the bounding
// box of the opaque pixels, and the corner radius (how far in the top row's
// opaque run starts). Cached per image, as a promise.
const boxes = new Map();

function measure(src) {
  if (!boxes.has(src)) {
    boxes.set(
      src,
      new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
          const { naturalWidth: w, naturalHeight: h } = image;
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          ctx.drawImage(image, 0, 0);
          const { data } = ctx.getImageData(0, 0, w, h);
          const opaque = (x, y) => data[(y * w + x) * 4 + 3] > 127;

          let x0 = w, y0 = h, x1 = 0, y1 = 0;
          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              if (!opaque(x, y)) continue;
              if (x < x0) x0 = x;
              if (x > x1) x1 = x;
              if (y < y0) y0 = y;
              if (y > y1) y1 = y;
            }
          }
          let start = x0;
          while (start < x1 && !opaque(start, y0)) start++;
          resolve({ w, h, x0, y0, x1: x1 + 1, y1: y1 + 1, r: start - x0 });
        };
        image.src = src;
      }),
    );
  }
  return boxes.get(src);
}

// The paper layers sit just inside the card's outline, so the face's soft
// anti-aliased rim never shows white through it when seen face-on.
function edgeStyle(box) {
  if (!box) return { display: "none" };
  const { w, h, x0, y0, x1, y1, r } = box;
  const pct = (n, of) => `${(n / of) * 100}%`;
  return {
    left: `calc(${pct(x0, w)} + 1px)`,
    top: `calc(${pct(y0, h)} + 1px)`,
    width: `calc(${pct(x1 - x0, w)} - 2px)`,
    height: `calc(${pct(y1 - y0, h)} - 2px)`,
    borderRadius: `${pct(r, x1 - x0)} / ${pct(r, y1 - y0)}`,
  };
}

export default function CardViewer({ card, still = false, label }) {
  const cardRef = useRef(null);
  const pose = useRef({ yaw: 0, pitch: 0, targetYaw: 0, targetPitch: 0, dragging: false });
  const drag = useRef(null);
  const [box, setBox] = useState(null);

  useEffect(() => {
    let live = true;
    measure(card.back.full).then((b) => live && setBox(b));
    return () => {
      live = false;
    };
  }, [card]);

  // A new card swings in from edge-on.
  useEffect(() => {
    pose.current.yaw = pose.current.targetYaw - Math.PI / 2;
  }, [card]);

  useEffect(() => {
    let frame;
    let last = performance.now();
    const tick = (now) => {
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      const p = pose.current;
      const k = 1 - Math.exp(-delta * (p.dragging ? 24 : 7));
      p.yaw += (p.targetYaw - p.yaw) * k;
      p.pitch += (p.targetPitch - p.pitch) * k;
      // A slow drift at rest, so the card reads as an object, not a picture.
      const t = now / 1000;
      const idle = p.dragging || still ? 0 : 1;
      const yaw = p.yaw + idle * Math.sin(t * 0.5) * 0.12;
      const pitch = p.pitch + idle * Math.sin(t * 0.8) * 0.04;

      const el = cardRef.current;
      el.style.transform = `rotateX(${-pitch}rad) rotateY(${yaw}rad)`;
      // The glare slides against the turn and brightens the further the
      // card is tipped from face-on.
      const turn = Math.sin(yaw);
      el.style.setProperty("--glare-x", `${50 - turn * 110}%`);
      el.style.setProperty("--glare-y", `${50 + pitch * 110}%`);
      el.style.setProperty("--glare", Math.min(Math.abs(turn) * 2.2 + Math.abs(pitch) * 1.6, 1).toFixed(3));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [still]);

  function handlePointerDown(event) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, t: event.timeStamp, v: 0 };
    pose.current.dragging = true;
  }

  function handlePointerMove(event) {
    const d = drag.current;
    if (!d) return;
    const p = pose.current;
    const dx = (event.clientX - d.x) * DRAG_SPEED;
    const dy = (event.clientY - d.y) * DRAG_SPEED;
    p.targetYaw += dx;
    p.targetPitch = Math.min(Math.max(p.targetPitch + dy, -MAX_PITCH), MAX_PITCH);
    // Radians per frame-ish, for the throw on release.
    const dt = Math.max(event.timeStamp - d.t, 1);
    d.v = (dx / dt) * 16;
    Object.assign(d, { x: event.clientX, y: event.clientY, t: event.timeStamp });
  }

  function handlePointerUp() {
    const d = drag.current;
    if (!d) return;
    const p = pose.current;
    p.dragging = false;
    p.targetYaw = Math.round((p.yaw + d.v * 10) / Math.PI) * Math.PI;
    p.targetPitch = 0;
    drag.current = null;
  }

  // Arrow keys and Enter / Space turn the card over for keyboard users.
  function handleKeyDown(event) {
    const p = pose.current;
    const step = { ArrowLeft: -Math.PI, ArrowRight: Math.PI, Enter: Math.PI, " ": Math.PI }[event.key];
    if (!step) return;
    event.preventDefault();
    p.targetYaw = Math.round(p.targetYaw / Math.PI) * Math.PI + step;
  }

  const edge = edgeStyle(box);

  return (
    <div
      className="viewer__stage"
      role="img"
      aria-label={label}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
    >
      <div ref={cardRef} className="card3d" style={box ? { "--ar": `${box.w} / ${box.h}` } : undefined}>
        {Array.from({ length: LAYERS }, (_, i) => (
          <span
            key={i}
            className="card3d__paper"
            style={{ ...edge, "--z": `${(i / (LAYERS - 1) - 0.5) * (THICKNESS - 1)}px` }}
          />
        ))}
        <Face src={card.back.full} />
        <Face src={card.front.full} turned />
      </div>
    </div>
  );
}

// One side: the art, and a glare clipped to the card by the image's own alpha.
function Face({ src, turned = false }) {
  const mask = `url("${src}")`;
  return (
    <div className={`card3d__face${turned ? " card3d__face--turned" : ""}`} style={{ "--z": `${THICKNESS / 2}px` }}>
      <img className="card3d__img" src={src} alt="" draggable={false} />
      <span className="card3d__glare" style={{ maskImage: mask, WebkitMaskImage: mask }} />
    </div>
  );
}
