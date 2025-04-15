const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let projectile = { x: 50, y: canvas.height - 50, radius: 5, visible: true };
let target = generateTarget();
let isLaunched = false;
let velocity = 0;
let angle = 0;
let time = 0;
let interval;
let explosionTimer = 0;

function generateTarget() {
    const x = Math.floor(Math.random() * 700) + 200;
    const y = canvas.height - (Math.floor(Math.random() * 200) + 100);
    return { x: x, y: y, width: 20, height: 20, visible: true };
}

function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw calibration marks
    for (let i = 50; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, canvas.height - 5);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.fillText(i + "m", i - 10, canvas.height - 10);
    }

    // Draw terrain slope
    ctx.fillStyle = "#996633";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(0, canvas.height - 50);
    ctx.lineTo(canvas.width / 2, canvas.height - 80);
    ctx.lineTo(canvas.width, canvas.height - 30);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Draw target
    if (target.visible) {
        ctx.fillStyle = "red";
        ctx.fillRect(target.x, target.y, target.width, target.height);
        ctx.fillStyle = "black";
        ctx.fillText(`Elevation: ${canvas.height - target.y} m`, target.x - 10, target.y - 5);
    }

    // Draw projectile
    if (projectile.visible) {
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();
    }

    // Explosion effect
    if (explosionTimer > 0) {
        ctx.beginPath();
        ctx.arc(target.x + target.width / 2, target.y + target.height / 2, 15, 0, Math.PI * 2);
        ctx.fillStyle = "orange";
        ctx.fill();
        explosionTimer--;
        if (explosionTimer === 0) {
            resetScene();
        }
    }
}

function launchProjectile() {
    if (isLaunched) return;

    velocity = parseFloat(document.getElementById('velocity').value);
    angle = parseFloat(document.getElementById('angle').value) * Math.PI / 180;
    time = 0;
    isLaunched = true;
    projectile.visible = true;

    interval = setInterval(() => {
        time += 0.1;
        const g = 9.8;
        projectile.x = 50 + velocity * Math.cos(angle) * time;
        projectile.y = canvas.height - 50 - (velocity * Math.sin(angle) * time - 0.5 * g * time * time);

        // Check hit
        if (
            projectile.x > target.x &&
            projectile.x < target.x + target.width &&
            projectile.y > target.y &&
            projectile.y < target.y + target.height
        ) {
            score++;
            document.getElementById("score").innerText = "Score: " + score;
            target.visible = false;
            projectile.visible = false;
            explosionTimer = 30;
            clearInterval(interval);
            isLaunched = false;
        }

        // Stop if off-screen
        if (projectile.y > canvas.height || projectile.x > canvas.width) {
            clearInterval(interval);
            isLaunched = false;
        }

        drawScene();
    }, 30);
}

function resetScene() {
    projectile = { x: 50, y: canvas.height - 50, radius: 5, visible: true };
    target = generateTarget();
    drawScene();
}

resetScene(); // Initialize first draw
setInterval(drawScene, 30);
