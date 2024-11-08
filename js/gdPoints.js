function createGDPoints(scene, camera) {
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Adjusted coordinates for the points (further back and above the pyramid)
    const points = [
        { name: 'Illustrator', position: { x: -40, y: 60, z: -200 } },  // Upper left point
        { name: 'InDesign', position: { x: 0, y: 60, z: -200 } },       // Upper center point
        { name: 'Photoshop', position: { x: 40, y: 60, z: -200 } },      // Upper right point
        { name: 'Adobe', position: { x: 0, y: -30, z: -200 } }           // Lower center point
    ];

    // Create spheres for each point
    const spheres = points.map(point => {
        const geometry = new THREE.SphereGeometry(5, 16, 16);
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(point.position.x, point.position.y, point.position.z);
        sphere.userData.skillName = point.name;  // Store the name in user data
        scene.add(sphere);

        // Create labels for each point (showing their names)
        createLabel(point.name, point.position, scene);

        return sphere;
    });

    // Create lines to connect the spheres
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
    createConnectingLines(spheres, lineMaterial, scene);

    // Function to create labels below each point
    function createLabel(name, position, scene) {
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const geometry = new THREE.TextGeometry(name, {
                font: font,
                size: 5,
                height: 1,
            });
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const textMesh = new THREE.Mesh(geometry, material);
            textMesh.position.set(position.x - 15, position.y - 15, position.z);
            scene.add(textMesh);
        });
    }

    // Function to create lines connecting spheres
    function createConnectingLines(spheres, material, scene) {
        // Connect upper points
        const lineGeometry1 = new THREE.BufferGeometry().setFromPoints([ 
            spheres[0].position, spheres[1].position, spheres[2].position 
        ]);
        const line1 = new THREE.Line(lineGeometry1, material);
        scene.add(line1);

        // Connect bottom point (Adobe) to upper points (Illustrator, InDesign, Photoshop)
        const lineGeometry2 = new THREE.BufferGeometry().setFromPoints([ 
            spheres[0].position, spheres[3].position 
        ]);
        const line2 = new THREE.Line(lineGeometry2, material);
        scene.add(line2);

        const lineGeometry3 = new THREE.BufferGeometry().setFromPoints([ 
            spheres[1].position, spheres[3].position 
        ]);
        const line3 = new THREE.Line(lineGeometry3, material);
        scene.add(line3);

        const lineGeometry4 = new THREE.BufferGeometry().setFromPoints([ 
            spheres[2].position, spheres[3].position 
        ]);
        const line4 = new THREE.Line(lineGeometry4, material);
        scene.add(line4);
    }

    // Click event listener to handle interaction with points
    window.addEventListener('click', (event) => {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        raycaster.setFromCamera(mouse, camera);

        // Check if any of the points are clicked
        points.forEach(point => {
            const intersects = raycaster.intersectObject(scene.getObjectByName(point.name));
            if (intersects.length > 0) {
                displayPopUp(point.name); // Display popup if clicked
            }
        });
    });

    // Function to display a pop-up when a point is clicked
    function displayPopUp(skillName) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        popup.style.color = 'white';
        popup.style.borderRadius = '10px';
        popup.style.zIndex = '9999';
        popup.style.width = '250px';
        popup.textContent = `${skillName} skill coming soon!`;
        document.body.appendChild(popup);

        setTimeout(() => {
            document.body.removeChild(popup);
        }, 3000);
    }
}

export { createGDPoints };
