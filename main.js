import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- SCENE SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 40, 100);

// --- LIGHTING ---
// Point light to simulate the Sun's light
const pointLight = new THREE.PointLight(0xffffff, 3, 300);
scene.add(pointLight);

// Ambient light for general scene illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// --- PLANET DATA ---
const planetData = [
    { name: 'Mercury', radius: 1, distance: 20, color: 0x888888, speed: 0.4 },
    { name: 'Venus', radius: 1.5, distance: 30, color: 0xffa500, speed: 0.25 },
    { name: 'Earth', radius: 1.6, distance: 42, color: 0x0077ff, speed: 0.18 },
    { name: 'Mars', radius: 1.2, distance: 55, color: 0xff4500, speed: 0.1 },
    { name: 'Jupiter', radius: 4, distance: 80, color: 0xffd700, speed: 0.05 },
    { name: 'Saturn', radius: 3.5, distance: 110, color: 0xf0e68c, speed: 0.03 },
    { name: 'Uranus', radius: 2.5, distance: 135, color: 0xadd8e6, speed: 0.02 },
    { name: 'Neptune', radius: 2.4, distance: 160, color: 0x4466ff, speed: 0.01 },
];

// --- OBJECT CREATION ---
// Sun
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({
    emissive: 0xffff00,
    emissiveIntensity: 1,
    map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/sun.jpg')
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets, Orbits, and storage arrays
const planets = [];
const orbitPaths = [];

planetData.forEach(data => {
    // Planet material with emissive property to be visible in the dark
    const planetMaterial = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.3
    });
    const planetMesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 32, 32), planetMaterial);
    
    // Orbit pivot
    const orbit = new THREE.Object3D();
    scene.add(orbit);
    
    planetMesh.position.x = data.distance;
    orbit.add(planetMesh);

    planets.push({ ...data, mesh: planetMesh, orbit: orbit });

    // Visual orbit path
    const orbitPathGeometry = new THREE.BufferGeometry().setFromPoints(
        new THREE.Path().absarc(0, 0, data.distance, 0, 2 * Math.PI).getSpacedPoints(100)
    );
    const orbitPathMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });
    const orbitPath = new THREE.Line(orbitPathGeometry, orbitPathMaterial);
    orbitPath.rotation.x = Math.PI / 2;
    scene.add(orbitPath);
    orbitPaths.push(orbitPath);

    // Saturn's rings
    if (data.name === 'Saturn') {
        const ringGeometry = new THREE.RingGeometry(data.radius + 1.2, data.radius + 3.5, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xaaaaaa, 
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = -0.4 * Math.PI;
        planetMesh.add(ring);
    }
});

// --- BONUS: BACKGROUND STARS ---
function addStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        const distSq = x * x + y * y + z * z;
        if (distSq > 300 * 300) {
            starVertices.push(x, y, z);
        }
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}
addStars();

// --- UI & INTERACTION SETUP ---

// Planet speed controls
const planetControlsContainer = document.getElementById('planet-controls');
planets.forEach(planet => {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'planet-control';
    
    const label = document.createElement('label');
    label.innerText = planet.name;
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 1;
    slider.step = 0.01;
    slider.value = planet.speed;
    
    const speedValue = document.createElement('span');
    speedValue.innerText = planet.speed.toFixed(2);
    
    slider.addEventListener('input', (event) => {
        planet.speed = parseFloat(event.target.value);
        speedValue.innerText = planet.speed.toFixed(2);
    });
    
    controlDiv.appendChild(label);
    controlDiv.appendChild(slider);
    controlDiv.appendChild(speedValue);
    planetControlsContainer.appendChild(controlDiv);
});

// --- Draggable UI Panel ---
// Note: Assumes your panel's title has id="drag-handle" in index.html
const panel = document.querySelector('.ui-panel');
const dragHandle = document.getElementById('drag-handle');

let isDragging = false;
let offsetX, offsetY;

dragHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    
    panel.style.right = 'auto'; // Switch from right to left/top positioning
    
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', onStopDrag);
    
    e.preventDefault();
});

function onDrag(e) {
    if (!isDragging) return;
    panel.style.left = `${e.clientX - offsetX}px`;
    panel.style.top = `${e.clientY - offsetY}px`;
}

function onStopDrag() {
    isDragging = false;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', onStopDrag);
}


// --- BONUS FEATURES: Pause/Resume, Dark Mode, Tooltips, Camera ---
let isPaused = false;
const pauseResumeBtn = document.getElementById('pause-resume-btn');
pauseResumeBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseResumeBtn.innerText = isPaused ? 'Resume' : 'Pause';
});

const themeToggleBtn = document.getElementById('theme-toggle-btn');
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggleBtn.innerText = isDarkMode ? 'Light Mode' : 'Dark Mode';

    if (isDarkMode) {
        scene.background = new THREE.Color(0x111118);
        ambientLight.intensity = 0.1;
        orbitPaths.forEach(path => path.material.color.set(0xcccccc));
    } else {
        scene.background = new THREE.Color(0xf0f2f5);
        ambientLight.intensity = 0.2;
        orbitPaths.forEach(path => path.material.color.set(0x333333));
    }
});
scene.background = new THREE.Color(0xf0f2f5); // Set initial background color

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('tooltip');

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    tooltip.style.left = `${event.clientX + 10}px`;
    tooltip.style.top = `${event.clientY + 10}px`;
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// --- ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    if (isPaused) return;

    const elapsedTime = clock.getElapsedTime();

    // Animate planets
    planets.forEach(planet => {
        planet.orbit.rotation.y = elapsedTime * planet.speed;
        planet.mesh.rotation.y += 0.005;
    });

    sun.rotation.y += 0.0005;

    // Handle tooltips
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));
    
    if (intersects.length > 0) {
        const planetInfo = planets.find(p => p.mesh === intersects[0].object);
        if (planetInfo) {
            tooltip.style.display = 'block';
            tooltip.innerText = planetInfo.name;
        }
    } else {
        tooltip.style.display = 'none';
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();