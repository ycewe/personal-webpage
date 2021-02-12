const canvas = document.getElementById("canvas");

var
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

const
    ctx = canvas.getContext("2d"),

    minDist = 10,
    maxDist = 30,
    initialWidth = 10,
    maxLines = 7,
    initialLines = 4,
    speed = 7,
    
    directions = [
        // straight velocity
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
        // diagonal velocity
        [.7, .7],
        [.7, -.7],
        [-.7, .7],  
        [-.7, -.7]
    ],
    
    startConfig = {
        x: width / 2,
        y: height / 2,
        vx: 0,
        vy: 0,
        width: initialWidth
    };

let
    lines = [],
    frame = 0,
    timeSinceLast = 0;

function Line(config = {}) {
    this.x = config.x | 0;
    this.y = config.y | 0;
    this.width = config.width / 1.25;
    this.isDead = false;

    do {
        const direction = directions[(Math.random() * directions.length) | 0];
        
        this.vx = direction[0];
        this.vy = direction[1];
    } while (
        (this.vx === -config.vx && this.vy === -config.vy)
        || (this.vx == config.vx && this.vy === config.vy)
    )

    this.vx *= speed;
    this.vy *= speed;
    this.dist = Math.random() * (maxDist - minDist) + minDist;
}

Line.prototype.step = function() {
    let
        prevX = this.x,
        prevY = this.y;
    
    this.x += this.vx;
    this.y += this.vy;

    --this.dist;

    // cancel if exits screen
    const hasExitScreen = this.x < 0 || this.x > width || this.y < 0 || this.y > height
    this.isDead = hasExitScreen;

    // propagate
    if (this.dist <= 0 && this.width > 1) {
        this.dist = Math.random() * (maxDist - minDist) + minDist;

        if (lines.length < maxLines) {
            lines.push(new Line(this));
        
            if (Math.random() < .5) {
                lines.push(new Line(this));
            }
        }

        this.isDead = Math.random() < .2;
    }

    ctx.strokeStyle = ctx.shadowColor = getColor(this.x);
    ctx.lineWidth = this.width;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(prevX, prevY);
    ctx.stroke();
}

function getColor(x) {
    return "hsl(hue, 80%, 50%)".replace("hue", x / width * 360 + frame);
}

function animate() {
    window.requestAnimationFrame(animate);

    ++frame;

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(0, 0, 0, .02)";
    ctx.fillRect(0, 0, width, height);
    ctx.shadowBlur = .5;

    for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];

        line.step();

        if (line.isDead) { // if canceled
            lines.splice(i, 1);
            --i;
        }
    }

    // spawn new lines
    ++timeSinceLast;

    if (lines.length < maxLines && timeSinceLast > 10 && Math.random() < .5) {
        timeSinceLast = 0;

        lines.push(new Line(startConfig));

        ctx.fillStyle = ctx.shadowColor = getColor(startConfig.x);
        ctx.beginPath();
        ctx.arc(startConfig.x, startConfig.y, initialWidth, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    lines = [];
    lines = Array(initialLines).fill(new Line(startConfig))

    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, width, height);
}

init();
animate();

window.addEventListener("resize", function () {
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

    startConfig.x = width / 2;
    startConfig.y = height / 2;
  
    init();
});
