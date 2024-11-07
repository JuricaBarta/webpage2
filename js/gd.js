function setupGDSphere(scene, camera, position = { x: 0, y: -60, z: -200 }) {
    const gdMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00, // Green for Graphic Design
        emissive: 0x00ff00,
        emissiveIntensity: 100,
        shininess: 100
    });

    // Create the pyramid (pointing up)
    const pyramid = new THREE.Mesh(new THREE.ConeGeometry(10, 15, 4), gdMaterial);
    pyramid.position.set(position.x, position.y, position.z);
    scene.add(pyramid);

    // Create title below the pyramid
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
            textMesh.lookAt(camera.position); // Make the text always face the camera
        }
    }

    // Call updateTextOrientation during the animation/render loop
    function animate() {
        requestAnimationFrame(animate);
        updateTextOrientation();
        pyramid.rotation.x += 0.01; // Rotate pyramid around X-axis
        pyramid.rotation.y += 0.01; // Rotate pyramid around Y-axis
        pyramid.rotation.z += 0.01; // Rotate pyramid around Z-axis
    }
    animate();

    function zoomToPoint(camera, position, callback) {
        console.log("Zooming to position:", position); // Debugging line
        // Smooth zooming to the pyramid from a "frog's perspective" (lower and closer)
        new TWEEN.Tween(camera.position)
            .to({ 
                x: position.x, 
                y: position.y - 30,  // Lower the camera (look up at the pyramid)
                z: position.z + 10   // Bring the camera closer to the pyramid
            }, 1000) // Adjust zoom level here
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                // After zoom completes, make the camera look up at the pyramid
                camera.lookAt(position.x, position.y + 10, position.z); // Look up at the pyramid
                callback(); // Trigger the callback
            })
            .start();
    }

    // Create pop-up window with a close button
    function showPopUp() {
        console.log("Showing popup"); // Debugging line
        // Create the pop-up window (if it doesn't already exist)
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
            popup.style.alignItems = 'center';
            popup.innerHTML = `
                <h2>Graphic Design Skill Tree</h2>
                <p>This is the Graphic Design skill tree.</p>
                <button id="close-popup" style="color: white; background-color: red; border: none; padding: 5px 10px; cursor: pointer; border-radius: 5px;">X Close</button>
            `;
            document.body.appendChild(popup);

            // Close button functionality
            const closeButton = document.getElementById('close-popup');
            closeButton.addEventListener('click', () => {
                popup.remove(); // Remove the pop-up when the button is clicked
            });
        }
    }

    // Display message on click
    function displayMessage(message) {
        document.getElementById('gd-title').innerText = message;
    }

    window.addEventListener('click', function (event) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        raycaster.setFromCamera(mouse, camera);
    
        const intersects = raycaster.intersectObjects([pyramid]);
        console.log("Intersects:", intersects);  // Debugging line
        if (intersects.length > 0) {
            // Zoom into the pyramid from a frog's perspective and call showPopUp after zoom
            zoomToPoint(camera, intersects[0].object.position, () => {
                // After zoom completes, display the message and show the pop-up window
                displayMessage("This is the Graphic Design section. Add more details here.");
                showPopUp();
            });
        }
    });
}

export { setupGDSphere };
