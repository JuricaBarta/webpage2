function setupCVSphere(scene, camera, position = { x: 200, y: -60, z: -100 }) {
    const cvMaterial = new THREE.MeshPhongMaterial({
        color: 0x0000ff, // Blue for Curriculum Vitae
        emissive: 0x0000ff,
        emissiveIntensity: 100,
        shininess: 100
    });
    const cvSphere = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), cvMaterial);
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
        document.getElementById('cv-title').innerText = message;
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
            displayMessage("This is the Curriculum Vitae section. Add more details here.");
        }
    });
}

export { setupCVSphere };
