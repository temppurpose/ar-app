// Copyright (c) 2021 8th Wall, Inc.
/* globals AFRAME */

// Component that places trees where the ground is clicked
AFRAME.registerComponent('tap-place-cursor', {
  init() {
    this.raycaster = new THREE.Raycaster();
    this.camera = document.getElementById('camera');
    this.threeCamera = this.camera.getObject3D('camera');
    this.ground = document.getElementById('ground');

    // 2D coordinates of the raycast origin, in normalized device coordinates (NDC)---X and Y
    // components should be between -1 and 1.  Here we want the cursor in the center of the screen.
    this.rayOrigin = new THREE.Vector2(0, 0);
    this.cursorLocation = new THREE.Vector3(0, 0, 0);

    const baseElement = document.getElementById('base');
    const resetButton = document.getElementById('reset-button');
    const dashboard = document.getElementById('dashboard');

    this.el.sceneEl.addEventListener('click', (event) => {
      // if product not placed yet
      if (document.getElementById('base').getAttribute('product-placed') === '0') {
        // Set pos of product according to reticle pointer
        baseElement.setAttribute('position', this.el.object3D.position);
        // Make visible
        baseElement.object3D.visible = true;

        // Remove animation before adding to be safe
        baseElement.removeAttribute('animation');

        // Scale Up pop animation
        baseElement.setAttribute('animation', {
          property: 'scale',
          from: '0.001 0.001, 0.001',
          to: '1 1 1',
          easing: 'easeOutElastic',
          dur: 1500,
        });

        // Set the product-placed flag
        document.getElementById('base').setAttribute('product-placed', '1');

        // Hide Reticle
        document.getElementById('reticle').object3D.visible = false;

        // Show dashboard UI
        dashboard.classList.remove('hide');
      }
    });
    
    resetButton.onclick = () => {
      // Hide the base
      baseElement.object3D.visible = false;

      // Show Reticle
      document.getElementById('reticle').object3D.visible = true;

      // Set the product-placed flag
      document.getElementById('base').setAttribute('product-placed', '0');

      // Hide dashboard UI
      dashboard.classList.add('hide');
    }
  },
  tick() {
    // Raycast from camera to 'ground'
    this.raycaster.setFromCamera(this.rayOrigin, this.threeCamera)
    const intersects = this.raycaster.intersectObject(this.ground.object3D, true)
    if (intersects.length > 0) {
      const [intersect] = intersects
      this.cursorLocation = intersect.point
    }
    this.el.object3D.position.y = 0.1
    this.el.object3D.position.lerp(this.cursorLocation, 0.4)
    this.el.object3D.rotation.y = this.threeCamera.rotation.y
  },
});