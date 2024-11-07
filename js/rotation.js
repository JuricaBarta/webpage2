import { setupCVSphere } from './cv.js';
import { setupITSphere } from './it.js';
import { setupGDSphere } from './gd.js';

// Set up scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('torq3').appendChild(renderer.domElement);

// Load texture for the background sphere
const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load('images/torq3.jpeg');

// Create a sphere geometry to be used as the background
const geometry = new THREE.SphereGeometry(500, 60, 40); // Radius 500 to make it large
const material = new THREE.MeshBasicMaterial({
    map: backgroundTexture,
    side: THREE.BackSide // This makes sure the texture is visible from the inside of the sphere
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Adjust the camera position inside the sphere
camera.position.set(0, 0, 0);  // Position the camera at the center of the sphere
camera.lookAt(0, 0, -1); // Make the camera look at the center of the sphere

// Add a point light for illumination
const pointLight = new THREE.PointLight(0xffffff, 1.5, 1000); // White light with intensity 1.5
pointLight.position.set(0, 0, 100); // Position the light slightly farther
scene.add(pointLight);

// Set up skill spheres and add titles below them
setupCVSphere(scene, camera);
setupITSphere(scene, camera);
setupGDSphere(scene, camera);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update(); // Update tweens during each frame
    renderer.render(scene, camera);
}

animate();

// Resize handling
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Rotation control: Only horizontal rotation (Y-axis)
let isDragging = false;
let previousMousePosition = { x: 0 };

window.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
        isDragging = true;
        previousMousePosition.x = event.clientX;
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

window.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        previousMousePosition.x = event.clientX;
        scene.rotation.y -= deltaX * 0.01; // Horizontal rotation only
    }
});

// Zoom functionality using the mouse wheel
window.addEventListener('wheel', (event) => {
    event.preventDefault(); // Prevent default scroll behavior
    const zoomSpeed = 10; // Adjust zoom speed as needed
    camera.position.z += event.deltaY * zoomSpeed * 0.01; // Move the camera in/out based on wheel movement
    camera.position.z = Math.max(10, Math.min(1000, camera.position.z)); // Limit zoom range
}, { passive: false });
