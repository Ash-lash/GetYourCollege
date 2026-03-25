import React, { useRef, useEffect } from 'react';

/**
 * Faithful recreation of the antigravity.google animated ring-particle background.
 * Particles orbit in concentric rings, and the cursor REPELS them in real-time.
 */
const Antigravity = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── mouse ────────────────────────────────────────────── */
    const mouse = { x: -9999, y: -9999 };
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMove);

    /* ── build rings ───────────────────────────────────────── */
    const RINGS = [
      { r: 120, count: 40, speed:  0.0007, size: 2.5 },
      { r: 220, count: 80, speed: -0.0005, size: 2.2 },
      { r: 330, count: 120, speed:  0.0004, size: 1.8 },
      { r: 450, count: 160, speed: -0.0003, size: 1.5 },
      { r: 580, count: 200, speed:  0.0002, size: 1.2 },
    ];

    const particles = [];
    RINGS.forEach(ring => {
      for (let i = 0; i < ring.count; i++) {
        const angle = (i / ring.count) * Math.PI * 2;
        particles.push({
          baseR: ring.r,
          angle,
          speed: ring.speed,
          size: ring.size,
          // current position (lerped)
          x: 0,
          y: 0,
          // "home" position before mouse influence
          tx: 0,
          ty: 0,
          opacity: 0.15 + Math.random() * 0.6,
        });
      }
    });

    let t = 0;

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      particles.forEach(p => {
        /* advance orbit angle */
        p.angle += p.speed;

        /* pulse radius slightly */
        const pulse = Math.sin(t * 0.008 + p.angle * 2) * 6;
        const r = p.baseR + pulse;

        /* home position */
        p.tx = cx + Math.cos(p.angle) * r;
        p.ty = cy + Math.sin(p.angle) * r;

        /* mouse repel */
        const dx = p.tx - mouse.x;
        const dy = p.ty - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const REPEL_R = 160;
        let rx = 0, ry = 0;
        if (dist < REPEL_R && dist > 0) {
          const force = (REPEL_R - dist) / REPEL_R;
          rx = (dx / dist) * force * 100;
          ry = (dy / dist) * force * 100;
        }

        /* lerp toward target */
        p.x += (p.tx + rx - p.x) * 0.12;
        p.y += (p.ty + ry - p.y) * 0.12;

        /* colour based on distance from mouse */
        const closeness = Math.max(0, 1 - dist / 300);
        const r1 = Math.round(99  + closeness * 156);  // 99 → 255
        const g1 = Math.round(102 - closeness * 102);  // 102 → 0
        const b1 = Math.round(241 - closeness * 100);  // 241 → 141
        const alpha = p.opacity + closeness * 0.4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r1},${g1},${b1},${alpha})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default Antigravity;
