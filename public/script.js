/* =============================================
   NexaDeploy — script.js
   Features:
   - Aurora particle canvas background
   - Custom cursor with smooth trail
   - Typewriter terminal animation
   - Live uptime counter
   - Scroll reveal observer
   - Stack card dynamic color
   - Nav scroll shadow
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── 1. AURORA CANVAS BACKGROUND ─── */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let W, H;

    function resizeCanvas() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particles
    const PARTICLE_COUNT = 80;
    const particles = [];

    class Particle {
        constructor() { this.reset(true); }
        reset(init = false) {
            this.x = Math.random() * W;
            this.y = init ? Math.random() * H : H + 20;
            this.size = Math.random() * 1.8 + 0.4;
            this.speedY = -(Math.random() * 0.4 + 0.1);
            this.speedX = (Math.random() - 0.5) * 0.15;
            this.alpha = 0;
            this.maxAlpha = Math.random() * 0.45 + 0.1;
            this.life = 0;
            this.maxLife = Math.random() * 300 + 200;
            // Color: teal / cyan / purple mix
            const colors = ['0,229,160', '0,207,255', '124,58,255', '0,180,220'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life++;
            const progress = this.life / this.maxLife;
            if (progress < 0.2) {
                this.alpha = (progress / 0.2) * this.maxAlpha;
            } else if (progress > 0.7) {
                this.alpha = ((1 - progress) / 0.3) * this.maxAlpha;
            } else {
                this.alpha = this.maxAlpha;
            }
            if (this.life >= this.maxLife || this.y < -20) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    // Aurora blobs (soft moving gradients)
    const blobs = [
        { x: 0.15, y: 0.25, r: 0.35, color: '0,229,160', speed: 0.0004, offset: 0 },
        { x: 0.75, y: 0.55, r: 0.28, color: '124,58,255', speed: 0.0003, offset: 2 },
        { x: 0.45, y: 0.85, r: 0.3,  color: '0,207,255', speed: 0.00035, offset: 4 },
    ];

    let animTime = 0;

    function drawAurora() {
        ctx.clearRect(0, 0, W, H);

        // Draw aurora blobs
        blobs.forEach(b => {
            const bx = (b.x + Math.sin(animTime * b.speed + b.offset) * 0.08) * W;
            const by = (b.y + Math.cos(animTime * b.speed * 1.3 + b.offset) * 0.06) * H;
            const br = b.r * Math.min(W, H);

            const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
            grad.addColorStop(0, `rgba(${b.color},0.07)`);
            grad.addColorStop(0.5, `rgba(${b.color},0.03)`);
            grad.addColorStop(1, `rgba(${b.color},0)`);

            ctx.beginPath();
            ctx.ellipse(bx, by, br * 1.6, br, Math.sin(animTime * 0.0002) * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        });

        // Draw particles
        particles.forEach(p => { p.update(); p.draw(); });

        // Draw hexagonal grid (very faint)
        drawHexGrid();

        animTime++;
        requestAnimationFrame(drawAurora);
    }

    function drawHexGrid() {
        const size = 40;
        const w = size * 2;
        const h = Math.sqrt(3) * size;
        ctx.strokeStyle = 'rgba(0,229,160,0.025)';
        ctx.lineWidth = 0.8;

        for (let row = -1; row < H / h + 2; row++) {
            for (let col = -1; col < W / w + 2; col++) {
                const x = col * w * 0.75;
                const y = row * h + (col % 2 === 0 ? 0 : h / 2);
                drawHex(x, y, size * 0.88);
            }
        }
    }

    function drawHex(cx, cy, r) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = cx + r * Math.cos(angle);
            const py = cy + r * Math.sin(angle);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
    }

    drawAurora();


    /* ─── 2. CUSTOM CURSOR ─── */
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursor-trail');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let tx = mx, ty = my;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top = my + 'px';
    });

    function animTrail() {
        tx += (mx - tx) * 0.14;
        ty += (my - ty) * 0.14;
        trail.style.left = tx + 'px';
        trail.style.top = ty + 'px';
        requestAnimationFrame(animTrail);
    }
    animTrail();

    // Enlarge on hover
    const hoverEls = document.querySelectorAll('a, button, .stack-card, .metric-card, .flow-node, .af-card');
    hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '18px';
            cursor.style.height = '18px';
            trail.style.width = '48px';
            trail.style.height = '48px';
            trail.style.borderColor = 'rgba(0,229,160,0.6)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '10px';
            cursor.style.height = '10px';
            trail.style.width = '32px';
            trail.style.height = '32px';
            trail.style.borderColor = 'rgba(0,229,160,0.35)';
        });
    });


    /* ─── 3. TERMINAL TYPEWRITER ─── */
    const termOutput = document.getElementById('terminal-output');
    const termLines = [
        { type: 'cmd',     text: '$ git push origin main' },
        { type: 'dim',     text: '  → Triggering GitHub Actions...' },
        { type: 'spacer',  text: '' },
        { type: 'info',    text: '✓  Security audit passed' },
        { type: 'info',    text: '✓  Running 124 tests...' },
        { type: 'ok',      text: '✓  All tests passed (1m 18s)' },
        { type: 'info',    text: '✓  Building Docker image...' },
        { type: 'ok',      text: '✓  Image built: nexadeploy:sha-a3f2c9d' },
        { type: 'info',    text: '✓  Pushing to ECR registry...' },
        { type: 'ok',      text: '✓  Push complete' },
        { type: 'warn',    text: '⏳ Deploying to EC2...' },
        { type: 'spacer',  text: '' },
        { type: 'ok',      text: '✓  Deployment successful!' },
        { type: 'dim',     text: '   Zero downtime · SSL active · Health 100%' },
        { type: 'prompt',  text: '$ ' },
    ];

    const colorMap = {
        cmd:    'color:#c8caec;',
        dim:    'color:#333358;',
        ok:     'color:#00e5a0;',
        info:   'color:#00cfff;',
        warn:   'color:#f59e0b;',
        spacer: '',
        prompt: 'color:#00e5a0;',
    };

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    async function runTerminal() {
        await sleep(600);
        for (const line of termLines) {
            const div = document.createElement('div');
            div.style.cssText = `font-family:'JetBrains Mono',monospace;font-size:0.76rem;line-height:1.85;${colorMap[line.type] || ''}`;

            if (line.type === 'spacer') {
                div.innerHTML = '&nbsp;';
                termOutput.appendChild(div);
                await sleep(80);
                continue;
            }

            if (line.type === 'prompt') {
                // Add blinking cursor at end
                div.innerHTML = line.text + '<span class="t-cursor"></span>';
                termOutput.appendChild(div);
                break;
            }

            termOutput.appendChild(div);

            // Typewriter effect for cmd lines, instant for others
            if (line.type === 'cmd') {
                for (let i = 0; i <= line.text.length; i++) {
                    div.textContent = line.text.slice(0, i);
                    termOutput.scrollTop = termOutput.scrollHeight;
                    await sleep(40);
                }
                await sleep(300);
            } else {
                div.textContent = line.text;
                termOutput.scrollTop = termOutput.scrollHeight;
                await sleep(120);
            }
        }
    }

    runTerminal();


    /* ─── 4. LIVE UPTIME COUNTER ─── */
    let seconds = 0;
    const heroUptime = document.getElementById('hero-uptime');
    const metricUptime = document.getElementById('metric-uptime');

    function formatUptime(s) {
        if (s < 60) return s + 's';
        if (s < 3600) return Math.floor(s / 60) + 'm ' + (s % 60) + 's';
        return Math.floor(s / 3600) + 'h ' + Math.floor((s % 3600) / 60) + 'm';
    }

    setInterval(() => {
        seconds++;
        const fmt = formatUptime(seconds);
        if (heroUptime) heroUptime.textContent = fmt;
        if (metricUptime) metricUptime.textContent = fmt;
    }, 1000);


    /* ─── 5. SCROLL REVEAL ─── */
    const reveals = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 100);
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    reveals.forEach(el => revealObs.observe(el));


    /* ─── 6. STACK CARD DYNAMIC BOTTOM COLOR ─── */
    document.querySelectorAll('.stack-card').forEach(card => {
        const color = card.dataset.color;
        if (color) card.style.setProperty('--c', color);
    });


    /* ─── 7. NAV SCROLL SHADOW ─── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.style.boxShadow = '0 4px 32px rgba(0,0,0,0.4)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });


    /* ─── 8. SMOOTH NAV LINKS ─── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    /* ─── 9. PIPELINE STAGE HOVER ANIMATION ─── */
    document.querySelectorAll('.ps-stage.done, .ps-stage.active').forEach(stage => {
        stage.addEventListener('mouseenter', () => {
            stage.querySelector('.ps-icon').style.transform = 'scale(1.12)';
        });
        stage.addEventListener('mouseleave', () => {
            stage.querySelector('.ps-icon').style.transform = 'scale(1)';
        });
    });


    /* ─── 10. METRIC CARDS STAGGER ON SCROLL ─── */
    const metricCards = document.querySelectorAll('.metric-card');
    const metricObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 80);
                metricObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    metricCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.16,1,0.3,1)';
        metricObs.observe(card);
    });


    /* ─── 11. CONSOLE GREETING ─── */
    console.log('%c NexaDeploy ', 'background:#00e5a0;color:#000;font-weight:bold;font-size:16px;padding:4px 8px;border-radius:4px;');
    console.log('%c 3rd Year Project — Mayur Mahindrakar ', 'color:#00cfff;font-size:12px;');
    console.log('%c AWS · Docker · GitHub Actions · Nginx · SSL ', 'color:#7c3aff;font-size:11px;');

});