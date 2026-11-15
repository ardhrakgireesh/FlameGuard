import { useEffect, useRef } from "react";

// Living space background: parallax stars, comets, tumbling asteroids that
// flee your cursor (anti-gravity), a glowing cursor trail and click bursts.
export default function Starfield() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, t = 0, nextComet = 60;

    const mouse = { x: -9999, y: -9999, nx: 0, ny: 0, px: 0, py: 0 };
    let stars = [], comets = [], rocks = [], sparks = [], trail = [];

    const rand = (a, b) => a + Math.random() * (b - a);

    const makeRock = () => {
      const r = rand(10, 36);
      const pts = Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        const d = r * rand(0.7, 1.15);
        return [Math.cos(a) * d, Math.sin(a) * d];
      });
      const vx = rand(-0.35, 0.35), vy = rand(-0.25, 0.25);
      return {
        x: rand(0, w), y: rand(0, h), r, pts,
        bvx: vx, bvy: vy, vx, vy,
        rot: rand(0, 6.28), spin: rand(-0.012, 0.012),
        hue: rand(200, 235),
      };
    };

    const init = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = reduce ? 80 : Math.min(420, Math.floor((w * h) / 4500));
      stars = Array.from({ length: n }, () => ({
        x: rand(0, w), y: rand(0, h),
        z: rand(0.15, 1),
        r: rand(0.3, 1.6),
        tw: rand(0, 6.28),
        hue: Math.random() < 0.2 ? rand(15, 40) : rand(200, 240),
      }));
      rocks = reduce ? [] : Array.from({ length: Math.max(5, Math.floor(w / 220)) }, makeRock);
      comets = [];
    };

    const spawnComet = () => {
      const fromTop = Math.random() < 0.5;
      const speed = rand(7, 13);
      const ang = rand(0.45, 0.8);
      comets.push({
        x: fromTop ? rand(w * 0.2, w * 1.1) : w + 40,
        y: fromTop ? -40 : rand(0, h * 0.6),
        vx: -Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        len: rand(120, 240),
        hue: Math.random() < 0.6 ? 200 : 30,
        life: 1,
      });
    };

    const burst = (x, y) => {
      for (let i = 0; i < 34; i++) {
        const a = rand(0, 6.28), s = rand(1, 6);
        sparks.push({
          x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
          life: 1, hue: Math.random() < 0.5 ? rand(20, 45) : rand(195, 215),
        });
      }
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.nx = e.clientX / w - 0.5;
      mouse.ny = e.clientY / h - 0.5;
      document.documentElement.style.setProperty("--mx", mouse.nx.toFixed(3));
      document.documentElement.style.setProperty("--my", mouse.ny.toFixed(3));
      trail.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (trail.length > 26) trail.shift();
    };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    const onClick = (e) => burst(e.clientX, e.clientY);

    const drawNebulaDust = () => {
      // faint colored haze that shifts with the cursor
      const g = ctx.createRadialGradient(
        w * (0.3 + mouse.nx * 0.05), h * 0.25, 0,
        w * (0.3 + mouse.nx * 0.05), h * 0.25, w * 0.5
      );
      g.addColorStop(0, "rgba(90,70,200,0.10)");
      g.addColorStop(1, "rgba(90,70,200,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      drawNebulaDust();

      // stars with parallax depth
      mouse.px += (mouse.nx - mouse.px) * 0.05;
      mouse.py += (mouse.ny - mouse.py) * 0.05;
      for (const s of stars) {
        s.y -= 0.04 + s.z * 0.18;
        if (s.y < -4) { s.y = h + 4; s.x = rand(0, w); }
        const sx = s.x - mouse.px * 60 * s.z;
        const sy = s.y - mouse.py * 60 * s.z;
        const tw = 0.55 + 0.45 * Math.sin(t * 0.03 + s.tw);
        ctx.globalAlpha = Math.min(1, (0.25 + s.z * 0.75) * tw);
        ctx.fillStyle = `hsl(${s.hue},80%,${80 + s.z * 15}%)`;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r * (0.6 + s.z * 0.6), 0, 6.283);
        ctx.fill();
        if (s.r > 1.35) {
          ctx.globalAlpha *= 0.25;
          ctx.beginPath();
          ctx.arc(sx, sy, s.r * 3.2, 0, 6.283);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // comets
      if (!reduce) {
        nextComet -= 1;
        if (nextComet <= 0) { spawnComet(); nextComet = rand(120, 320); }
      }
      comets = comets.filter((c) => c.x > -300 && c.y < h + 300);
      for (const c of comets) {
        c.x += c.vx; c.y += c.vy;
        const mag = Math.hypot(c.vx, c.vy);
        const tx = c.x - (c.vx / mag) * c.len;
        const ty = c.y - (c.vy / mag) * c.len;
        const g = ctx.createLinearGradient(c.x, c.y, tx, ty);
        g.addColorStop(0, `hsla(${c.hue},100%,88%,0.95)`);
        g.addColorStop(0.3, `hsla(${c.hue},100%,65%,0.35)`);
        g.addColorStop(1, `hsla(${c.hue},100%,60%,0)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        const hg = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 16);
        hg.addColorStop(0, "rgba(255,255,255,0.95)");
        hg.addColorStop(0.4, `hsla(${c.hue},100%,70%,0.5)`);
        hg.addColorStop(1, `hsla(${c.hue},100%,60%,0)`);
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 16, 0, 6.283);
        ctx.fill();
      }

      // asteroids: drift, tumble, and float away from the cursor
      for (const r of rocks) {
        const dx = r.x - mouse.x, dy = r.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 190) {
          const f = (1 - d / 190) * 0.9;
          r.vx += (dx / (d || 1)) * f;
          r.vy += (dy / (d || 1)) * f;
          r.spin += (dx > 0 ? 1 : -1) * f * 0.002;
        }
        r.vx += (r.bvx - r.vx) * 0.02;
        r.vy += (r.bvy - r.vy) * 0.02;
        r.spin *= 0.995;
        r.x += r.vx - mouse.px * 0.4;
        r.y += r.vy - mouse.py * 0.4;
        r.rot += r.spin;
        if (r.x < -60) r.x = w + 60;
        if (r.x > w + 60) r.x = -60;
        if (r.y < -60) r.y = h + 60;
        if (r.y > h + 60) r.y = -60;

        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.rotate(r.rot);
        ctx.shadowColor = `hsla(${r.hue},90%,60%,0.35)`;
        ctx.shadowBlur = 18;
        const rg = ctx.createRadialGradient(-r.r * 0.3, -r.r * 0.3, r.r * 0.1, 0, 0, r.r * 1.2);
        rg.addColorStop(0, `hsl(${r.hue},25%,38%)`);
        rg.addColorStop(1, `hsl(${r.hue},35%,10%)`);
        ctx.fillStyle = rg;
        ctx.strokeStyle = `hsla(${r.hue},80%,75%,0.45)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        r.pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.beginPath();
        ctx.arc(r.r * 0.25, r.r * 0.2, r.r * 0.22, 0, 6.283);
        ctx.fill();
        ctx.restore();
      }

      // click sparks
      sparks = sparks.filter((s) => s.life > 0.02);
      for (const s of sparks) {
        s.x += s.vx; s.y += s.vy;
        s.vx *= 0.97; s.vy *= 0.97;
        s.life *= 0.95;
        ctx.globalAlpha = s.life;
        ctx.fillStyle = `hsl(${s.hue},100%,70%)`;
        ctx.shadowColor = `hsl(${s.hue},100%,60%)`;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2, 0, 6.283);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // cursor trail
      for (const p of trail) p.life *= 0.9;
      trail = trail.filter((p) => p.life > 0.05);
      for (const p of trail) {
        ctx.globalAlpha = p.life * 0.55;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 20 * p.life + 4);
        g.addColorStop(0, "rgba(255,190,110,0.9)");
        g.addColorStop(1, "rgba(255,150,60,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 20 * p.life + 4, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", init);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return <canvas ref={ref} className="starfield" />;
}
