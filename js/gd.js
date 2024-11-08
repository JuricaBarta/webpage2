import { createGDPoints } from './gdPoints.js';

// Function to set up the Graphic Design sphere and interactions
function setupGDSphere(scene, camera, position = { x: 0, y: -80, z: -200 }) {
    const gdMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00, // Green color for Graphic Design
        emissive: 0x00ff00,
        emissiveIntensity: 0.5,
        shininess: 100
    });

    const pyramid = new THREE.Mesh(new THREE.ConeGeometry(10, 15, 4), gdMaterial);
    pyramid.position.set(position.x, position.y, position.z);
    scene.add(pyramid);

    createGDPoints(scene);

    let textMesh = null;
    function createTitleText(text, position) {
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const geometry = new THREE.TextGeometry(text, {
                font: font,
                size: 5,
                height: 1,
            });
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
            textMesh = new THREE.Mesh(geometry, material);
            textMesh.position.set(position.x - 20, position.y - 30, position.z);
            scene.add(textMesh);
        });
    }

    createTitleText('Graphic Design', position);

    function updateTextOrientation() {
        if (textMesh) {
            textMesh.lookAt(camera.position);
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        updateTextOrientation();
        pyramid.rotation.x += 0.01;
        pyramid.rotation.y += 0.01;
        pyramid.rotation.z += 0.01;
    }
    animate();

    // Handle click to interact with pyramid
    window.addEventListener('click', function (event) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects([pyramid]);

        if (intersects.length > 0) {
            // If the pyramid is clicked, show popup and start camera rotation
            displayMessage("This is the Graphic Design section. Add more details here.");
            showPopUp();
            enableCameraRotation(pyramid, camera); // Enable camera rotation around the pyramid
        }
    });

    function enableCameraRotation(pyramid, camera) {
        const rotationRadius = 30; // Adjust the radius of the circular camera path
        const rotationSpeed = 0.005; // Speed of rotation
        let angle = 0; // Initial angle

        // Track mouse movement and rotate the camera around the pyramid only when mouse is pressed
        window.addEventListener('mousemove', function (event) {
            angle += (event.movementX * rotationSpeed);
        });

        function updateCameraPosition() {
            // Calculate the camera's new position based on the current angle
            const x = pyramid.position.x + rotationRadius * Math.sin(angle);
            const z = pyramid.position.z + rotationRadius * Math.cos(angle);

            // Set the camera to a lower height (e.g., pyramid.position.y - 30)
            camera.position.set(x, pyramid.position.y - 30, z); // Adjust the height here
            camera.lookAt(pyramid.position); // Always look at the pyramid
        }

        function animateRotation() {
            requestAnimationFrame(animateRotation);
            updateCameraPosition();
        }
        animateRotation();
    }

    function showPopUp() {
        const existingPopup = document.getElementById('popup');
        if (!existingPopup) {
            const popup = document.createElement('div');
            popup.id = 'popup';
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.padding = '20px';
            popup.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            popup.style.color = 'white';
            popup.style.borderRadius = '10px';
            popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
            popup.style.zIndex = '9999';
            popup.style.display = 'flex';
            popup.style.flexDirection = 'column';
            popup.style.textAlign = 'center';
            popup.style.width = '250px';  // Adjust the width of the popup to ensure the X button has space
    
            // Create the text layer
            const textLayer = document.createElement('div');
            textLayer.style.marginTop = '20px';  // Ensure text has space from the top
            const text = document.createElement('p');
            text.textContent = "Graphic Design skills coming soon!";
            textLayer.appendChild(text);
            popup.appendChild(textLayer);
    
            // Create the X button layer (upper right corner)
            const buttonLayer = document.createElement('div');
            buttonLayer.style.position = 'absolute';
            buttonLayer.style.top = '10px';
            buttonLayer.style.right = '10px';
    
            const closeButton = document.createElement('button');
            closeButton.textContent = 'X';
            closeButton.style.backgroundColor = 'red';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.padding = '5px 10px';
            closeButton.style.cursor = 'pointer';
            closeButton.onclick = () => {
                closePopUp();
                location.reload(); // Refresh the page to reset everything back to rotation.js
            };
    
            buttonLayer.appendChild(closeButton);
            popup.appendChild(buttonLayer);
    
            document.body.appendChild(popup);
        }
    }
    
    

    function closePopUp() {
        const popup = document.getElementById('popup');
        if (popup) {
            popup.remove();
        }
    }

    function resetCameraPosition() {
        // Original camera position
        camera.position.set(0, 0, 0);  // Position the camera at the center of the sphere
        camera.lookAt(0, 0, -300); // Make the camera look at the center of the sphere
    }

    function displayMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.style.position = 'absolute';
        messageDiv.style.top = '10px';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translateX(-50%)';
        messageDiv.style.padding = '10px';
        messageDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        messageDiv.style.color = 'white';
        messageDiv.style.borderRadius = '5px';
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }
}

export { setupGDSphere };
