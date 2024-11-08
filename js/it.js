function setupITSphere(scene, camera, position = { x: -150, y: -60, z: -100 }) {
    const itMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000, // Red for Information Technology
        emissive: 0xff0000,
        emissiveIntensity: 100,
        shininess: 100
    });

    // Create a rotating cube
    const itCube = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), itMaterial);
    itCube.position.set(position.x, position.y, position.z);
    itCube.userData.skillName = 'Information Technology';
    scene.add(itCube);

    // Create title below the cube
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
            textMesh.position.set(position.x - 45, position.y - 30, position.z);
            scene.add(textMesh);
        });
    }

    createTitleText('Information Technology', position);

    function updateTextOrientation() {
        if (textMesh) {
            textMesh.lookAt(camera.position);
        }
    }

    // Call updateTextOrientation during the animation/render loop
    function animate() {
        requestAnimationFrame(animate);
        updateTextOrientation();
        itCube.rotation.x += 0.01; // Make the cube rotate around the X-axis
        itCube.rotation.y += 0.01; // Make the cube rotate around the Y-axis
    }
    animate();

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
            text.textContent = "Information Technology skills coming soon!";
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

        const intersects = raycaster.intersectObjects([itCube]);
        if (intersects.length > 0) {
            zoomToPoint(camera, itCube.position);
            showPopUp();
            displayMessage("This is the Information Technology section.");
        }
    });
}

export { setupITSphere };
