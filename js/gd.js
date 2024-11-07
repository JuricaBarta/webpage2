function setupGDSphere(scene, camera, position = { x: -200, y: -60, z: -100 }) {
    const gdMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00, // Green for Graphic Design
        emissive: 0x00ff00,
        emissiveIntensity: 1,
        shininess: 100
    });
    const gdSphere = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), gdMaterial);
    gdSphere.position.set(position.x, position.y, position.z);
    gdSphere.userData.skillName = 'Graphic Design';
    scene.add(gdSphere);

    function zoomToPoint(camera, position) {
        new TWEEN.Tween(camera.position)
            .to({ x: position.x, y: position.y + 30, z: position.z + 50 }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }

    function displayMessage(message) {
        document.getElementById('gd-title').innerText = message;
    }

    window.addEventListener('click', function(event) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects([gdSphere]);
        if (intersects.length > 0) {
            zoomToPoint(camera, gdSphere.position);
            displayMessage("This is the Graphic Design section. Add more details here.");
        }
    });
}

export { setupGDSphere };
