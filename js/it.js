function setupITSphere(scene, camera, position = { x: 0, y: -60, z: -100 }) {
    const itMaterial = new THREE.MeshPhongMaterial({
        color: 0x0000ff, // Blue for IT
        emissive: 0x0000ff,
        emissiveIntensity: 1,
        shininess: 100
    });
    const itSphere = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), itMaterial);
    itSphere.position.set(position.x, position.y, position.z);
    itSphere.userData.skillName = 'Information Technology';
    scene.add(itSphere);

    function zoomToPoint(camera, position) {
        new TWEEN.Tween(camera.position)
            .to({ x: position.x, y: position.y + 30, z: position.z + 50 }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }

    function displayMessage(message) {
        document.getElementById('it-title').innerText = message;
    }

    window.addEventListener('click', function(event) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects([itSphere]);
        if (intersects.length > 0) {
            zoomToPoint(camera, itSphere.position);
            displayMessage("This is the Information Technology section. Add more details here.");
        }
    });
}

export { setupITSphere };
