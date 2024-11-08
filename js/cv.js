function setupCVSphere(scene, camera, position = { x: 150, y: -60, z: -100 }) {
    const cvMaterial = new THREE.MeshPhongMaterial({
        color: 0x0000ff, // Blue for Curriculum Vitae
        emissive: 0x0000ff,
        emissiveIntensity: 100,
        shininess: 100
    });
    const cvSphere = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 16), cvMaterial);
    cvSphere.position.set(position.x, position.y, position.z);
    cvSphere.userData.skillName = 'Curriculum Vitae';
    scene.add(cvSphere);

    // Create title below the Curriculum Vitae sphere
    let textMesh = null; // Will hold the text mesh

    function createTitleText(text, position) {
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const geometry = new THREE.TextGeometry(text, {
                font: font,
                size: 5, // Adjust size to fit nicely below the sphere
                height: 1,
            });

            const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
            textMesh = new THREE.Mesh(geometry, material);

            // Position the text just below the sphere
            textMesh.position.set(position.x - 30, position.y - 18, position.z); // 20 units below
            scene.add(textMesh);
        });
    }

    // Call the function to create the title for Curriculum Vitae
    createTitleText('Curriculum Vitae', position);

    // Make the text always face the camera
    function updateTextOrientation() {
        if (textMesh) {
            textMesh.lookAt(camera.position); // Make text face the camera
        }
    }

    // Call updateTextOrientation during the animation/render loop
    function animate() {
        requestAnimationFrame(animate);
        updateTextOrientation();
    }
    animate(); // Start the animation loop

    function zoomToPoint(camera, position) {
        new TWEEN.Tween(camera.position)
            .to({ x: position.x, y: position.y + 30, z: position.z + 50 }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
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
            text.textContent = "Curriculum Vitae skills coming soon!";
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

    window.addEventListener('click', function(event) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects([cvSphere]);
        if (intersects.length > 0) {
            zoomToPoint(camera, cvSphere.position);
            showPopUp();
            displayMessage("This is the Curriculum Vitae section.");
        }
    });
}

export { setupCVSphere };
