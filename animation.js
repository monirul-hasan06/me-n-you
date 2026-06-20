const canvas = document.getElementById('heart-canvas');
const ctx = canvas.getContext('2d');
let width, height;

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();


function getHeartPoints(cx, cy, size, points = 24) {
    const coords = [];
    for (let i = 0; i < points; i++) {
        const t = (i / points) * 2 * Math.PI;
        // Parametric heart equation
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        const px = cx + (x * size) / 16;
        const py = cy - (y * size) / 16;
        coords.push({ x: px, y: py });
    }
    return coords;
}


class Heart {
    constructor() {
        this.size = 7 + Math.random() * 22;        // random size
        this.x = Math.random() * width;            // random x position
        this.y = height + 20 + Math.random() * 50; // start below screen
        this.speed = 0.5 + Math.random() * 1.4;    // upward speed
        this.wobble = 0.4 + Math.random() * 1.5;   // side-to-side movement
        this.phase = Math.random() * 100;          // wobble phase
        this.opacity = 0.5 + Math.random() * 0.5;  // transparency
        this.color = `hsla(${340 + Math.random() * 25}, 90%, 65%, ${this.opacity})`;
        this.points = getHeartPoints(0, 0, this.size, 20);
    }

    update() {
        this.y -= this.speed;                      // move upward
        this.x += Math.sin(this.phase + this.y * 0.012) * this.wobble * 0.3; // wobble
        
        // Reset when off screen
        if (this.y < -this.size * 2.5) {
            this.y = height + 20 + Math.random() * 40;
            this.x = Math.random() * width;
            // Re-randomize properties
            this.size = 7 + Math.random() * 22;
            this.speed = 0.5 + Math.random() * 1.4;
            this.wobble = 0.4 + Math.random() * 1.5;
            this.opacity = 0.5 + Math.random() * 0.5;
            this.color = `hsla(${340 + Math.random() * 25}, 90%, 65%, ${this.opacity})`;
            this.points = getHeartPoints(0, 0, this.size, 20);
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        const pts = this.points;
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.shadowColor = 'rgba(255, 70, 130, 0.6)';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.restore();
    }
}



const hearts = [];
const NUM_HEARTS = 45;  // number of hearts on screen

// Create hearts
for (let i = 0; i < NUM_HEARTS; i++) {
    const h = new Heart();
    h.y = Math.random() * height;  // spread initial positions
    hearts.push(h);
}

// Animation loop
function drawHearts() {
    ctx.clearRect(0, 0, width, height);
    for (let heart of hearts) {
        heart.update();  // move heart
        heart.draw(ctx); // draw heart
    }
    requestAnimationFrame(drawHearts);  // loop forever
}
drawHearts();