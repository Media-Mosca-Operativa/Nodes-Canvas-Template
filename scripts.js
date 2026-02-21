const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Coordenadas del mouse
let mouse = { x: null, y: null, radius: 100 };

// Actualizar posición del mouse
window.addEventListener('mousemove', function(e){
  mouse.x = e.x;
  mouse.y = e.y;
});

// Determinar cantidad de nodos según tamaño de pantalla
function getNodeCount() {
  const width = window.innerWidth;
  if (width < 768) return 100;       // Pantalla pequeña
  else if (width < 1200) return 250; // Pantalla mediana
  else return 500;                    // Pantalla grande
}

// Clase de cada nodo
class Node {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = 3;
  }

  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = 'white';
    ctx.fill();
  }

  update(){
    this.x += this.vx;
    this.y += this.vy;

    if(this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if(this.y < 0 || this.y > canvas.height) this.vy *= -1;

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let dist = Math.sqrt(dx*dx + dy*dy);
    if(dist < mouse.radius){
      let angle = Math.atan2(dy, dx);
      this.x -= Math.cos(angle) * 2;
      this.y -= Math.sin(angle) * 2;
    }

    this.draw();
  }
}

// Array de nodos
let nodesArray = [];

// Inicializar nodos
function init(){
  nodesArray = [];
  const nodeCount = getNodeCount(); // Se ajusta según pantalla
  for(let i=0; i<nodeCount; i++){
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    nodesArray.push(new Node(x, y));
  }
}

// Conectar nodos cercanos
function connect(){
  for(let i=0; i<nodesArray.length; i++){
    for(let j=i; j<nodesArray.length; j++){
      let dx = nodesArray[i].x - nodesArray[j].x;
      let dy = nodesArray[i].y - nodesArray[j].y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 100){
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${1 - dist/100})`;
        ctx.lineWidth = 1;
        ctx.moveTo(nodesArray[i].x, nodesArray[i].y);
        ctx.lineTo(nodesArray[j].x, nodesArray[j].y);
        ctx.stroke();
      }
    }
  }
}

// Animación principal
function animate(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  nodesArray.forEach(node => node.update());
  connect();
  requestAnimationFrame(animate);
}

// Ajustar canvas y reiniciar nodos al cambiar tamaño
window.addEventListener('resize', function(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

// Ejecutar
init();
animate();
