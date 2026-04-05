import { useEffect, useRef } from 'react';

const COLORS = ['#00f0ff', '#ff00cc', '#ffee00', '#ffffff', '#88ff00', '#ff4400'];

function randBetween(a, b) {
  return a + Math.random() * (b - a);
}

/** Generates a jagged lightning path along one edge of the card */
function lightningPath(ctx, x1, y1, x2, y2, segments = 12, offset = 12) {
  const dx = (x2 - x1) / segments;
  const dy = (y2 - y1) / segments;
  // perpendicular direction
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len;
  const ny = dx / len;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const bx = x1 + dx * i;
    const by = y1 + dy * i;
    // bolt tapers off at ends
    const amp = Math.sin(t * Math.PI) * randBetween(-offset, offset);
    ctx.lineTo(bx + nx * amp, by + ny * amp);
  }
  ctx.lineTo(x2, y2);
}

export default function LightningBorder({ active, children }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(frameRef.current);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    let tick = 0;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    function draw() {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, w, h);

      const pad = 3;
      const edges = [
        [pad, pad, w - pad, pad],         // top
        [w - pad, pad, w - pad, h - pad], // right
        [w - pad, h - pad, pad, h - pad], // bottom
        [pad, h - pad, pad, pad],         // left
      ];

      // draw 2-3 bolt layers per edge
      for (const [x1, y1, x2, y2] of edges) {
        const layers = tick % 2 === 0 ? 2 : 3;
        for (let l = 0; l < layers; l++) {
          const color = COLORS[Math.floor(Math.random() * COLORS.length)];
          const segs = Math.floor(randBetween(8, 18));
          const offset = randBetween(4, 14);

          ctx.save();
          ctx.strokeStyle = color;
          ctx.lineWidth = randBetween(0.5, 1.5);
          ctx.shadowColor = color;
          ctx.shadowBlur = randBetween(4, 12);
          ctx.globalAlpha = randBetween(0.55, 1);
          lightningPath(ctx, x1, y1, x2, y2, segs, offset);
          ctx.stroke();
          ctx.restore();
        }
      }

      // small branch sparks at corners randomly
      if (Math.random() > 0.5) {
        const corners = [[pad, pad], [w - pad, pad], [w - pad, h - pad], [pad, h - pad]];
        const [cx, cy] = corners[Math.floor(Math.random() * corners.length)];
        for (let s = 0; s < 3; s++) {
          const ex = cx + randBetween(-20, 20);
          const ey = cy + randBetween(-20, 20);
          const color = COLORS[Math.floor(Math.random() * COLORS.length)];
          ctx.save();
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.6;
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          ctx.globalAlpha = randBetween(0.4, 0.9);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
          ctx.restore();
        }
      }

      tick++;
      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%' }}
    >
      {active && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10,
            borderRadius: 'var(--border-radius)',
          }}
        />
      )}
      {children}
    </div>
  );
}
