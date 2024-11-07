console.log('setupCVSphere loaded');

function setupCVSphere(scene, camera, position = { x: 200, y: -60, z: -100 }) {
    console.log('Creating CV sphere');
    const cvMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1,
        shininess: 100
    });
    const cvSphere = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), cvMaterial);
    cvSphere.position.set(position.x, position.y, position.z);
    cvSphere.userData.skillName = 'Curriculum Vitae';
    scene.add(cvSphere);

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
            displayMessage("This is the CV section. Add more details here.");
        }
    });
}

export { setupCVSphere };
