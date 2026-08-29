import * as THREE from 'three';

let active = null;

function disposeObject(root) {
    root.traverse((object) => {
        object.geometry?.dispose?.();
        if (Array.isArray(object.material))
            object.material.forEach((material) => material.dispose?.());
        else object.material?.dispose?.();
    });
}

function disposeActive() {
    if (!active) return;
    cancelAnimationFrame(active.raf);
    active.observer?.disconnect?.();
    active.visibilityHandler &&
        document.removeEventListener(
            'visibilitychange',
            active.visibilityHandler,
        );
    window.removeEventListener('resize', active.resize);
    active.canvas?.removeEventListener('pointermove', active.onMove);
    active.canvas?.removeEventListener('pointerleave', active.onLeave);
    disposeObject(active.campus);
    active.renderer?.dispose();
    active.renderer?.forceContextLoss?.();
    active = null;
}

export function initCampusScene() {
    const canvas = document.querySelector('[data-campus-scene]');
    if (!canvas) {
        disposeActive();
        return;
    }
    if (active?.canvas === canvas) return;
    disposeActive();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(min-width: 768px)').matches) return;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-6, 6, 4.5, -4.5, 0.1, 100);
    camera.position.set(8, 7, 9);
    camera.lookAt(0, 1, 0);

    scene.add(new THREE.HemisphereLight(0xf7f4ec, 0x4b5e64, 1.8));
    const light = new THREE.DirectionalLight(0xfff7e7, 1.9);
    light.position.set(5, 8, 6);
    scene.add(light);

    const campus = new THREE.Group();
    const baseRotation = -0.2;
    campus.rotation.y = baseRotation;
    scene.add(campus);
    const mat = (color, roughness = 0.75) =>
        new THREE.MeshStandardMaterial({ color, roughness });

    const building = new THREE.Mesh(
        new THREE.BoxGeometry(5, 2.1, 2.9),
        mat(0xe7e0d4),
    );
    building.position.y = 1.1;
    campus.add(building);
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(2.9, 1.15, 4),
        mat(0x123d50, 0.58),
    );
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 2.7;
    campus.add(roof);
    const wing = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.35, 2.4),
        mat(0xd6dfdc),
    );
    wing.position.set(-3, 0.7, -0.15);
    campus.add(wing);
    const door = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.35, 0.12),
        mat(0x1f5268, 0.4),
    );
    door.position.set(0, 0.78, 1.5);
    campus.add(door);

    const windows = mat(0xb58b3f, 0.35);
    for (let row = 0; row < 2; row += 1) {
        for (let col = -2; col <= 2; col += 1) {
            if (col === 0) continue;
            const win = new THREE.Mesh(
                new THREE.BoxGeometry(0.5, 0.42, 0.08),
                windows,
            );
            win.position.set(col * 0.86, 1 + row * 0.78, 1.48);
            campus.add(win);
        }
    }

    const ground = new THREE.Mesh(
        new THREE.CylinderGeometry(4.4, 4.4, 0.14, 40),
        mat(0xc8d4d0, 1),
    );
    campus.add(ground);
    const groundRing = new THREE.Mesh(
        new THREE.TorusGeometry(3.8, 0.035, 8, 64),
        mat(0xb58b3f, 1),
    );
    groundRing.rotation.x = Math.PI / 2;
    groundRing.position.y = 0.11;
    campus.add(groundRing);
    const sign = new THREE.Mesh(
        new THREE.BoxGeometry(1.65, 0.35, 0.08),
        mat(0xb58b3f, 0.5),
    );
    sign.position.set(0, 0.25, 2.55);
    campus.add(sign);
    const path = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.04, 3.5),
        mat(0xf2ece0, 1),
    );
    path.position.set(0, 0.09, 2.05);
    campus.add(path);
    const flagPole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.028, 1.9, 8),
        mat(0x6b756f, 1),
    );
    flagPole.position.set(2.35, 1.05, 0.8);
    campus.add(flagPole);
    const flag = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.42, 0.04),
        mat(0x1f5268, 0.6),
    );
    flag.position.set(2.68, 1.55, 0.8);
    campus.add(flag);

    const treeMat = mat(0x315f50, 1);
    const trunkMat = mat(0x70533b, 1);
    [-3.65, 3.45].forEach((x) => {
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.14, 1, 8),
            trunkMat,
        );
        trunk.position.set(x, 0.55, 0.1);
        campus.add(trunk);
        const crown = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.7, 0),
            treeMat,
        );
        crown.position.set(x, 1.42, 0.1);
        campus.add(crown);
    });

    const pointer = { x: 0, y: 0 };
    const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const aspect = Math.max(rect.width / Math.max(rect.height, 1), 1);
        const view = 4.7;
        camera.left = -view * aspect;
        camera.right = view * aspect;
        camera.top = view;
        camera.bottom = -view;
        camera.updateProjectionMatrix();
        renderer.setSize(
            Math.max(1, rect.width),
            Math.max(1, rect.height),
            false,
        );
    };
    const onMove = (event) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x =
            ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) *
            0.08;
        pointer.y =
            ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) *
            0.06;
    };
    const onLeave = () => {
        pointer.x = 0;
        pointer.y = 0;
    };

    const state = {
        raf: 0,
        canvas,
        renderer,
        campus,
        resize,
        onMove,
        onLeave,
        visible: true,
    };
    const observer = new IntersectionObserver(
        ([entry]) => {
            state.visible = entry.isIntersecting;
        },
        { threshold: 0.05 },
    );
    observer.observe(canvas);
    state.observer = observer;
    state.visibilityHandler = () => {
        state.visible = !document.hidden;
    };
    document.addEventListener('visibilitychange', state.visibilityHandler);
    active = state;

    const clock = new THREE.Clock();
    const render = () => {
        if (!document.documentElement.contains(canvas)) {
            disposeActive();
            return;
        }
        if (state.visible) {
            const t = clock.getElapsedTime();
            campus.rotation.y +=
                (baseRotation + pointer.x - campus.rotation.y) * 0.014;
            campus.rotation.x += (-pointer.y - campus.rotation.x) * 0.014;
            campus.position.y = Math.sin(t * 0.45) * 0.025;
            renderer.render(scene, camera);
        }
        state.raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    canvas.addEventListener('pointermove', onMove, { passive: true });
    canvas.addEventListener('pointerleave', onLeave, { passive: true });
    render();
}
