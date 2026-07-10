import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const scanlineShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uScanlineIntensity: { value: 0.15 },
    uChromaticAberration: { value: 0.02 },
    uGlitchIntensity: { value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uScanlineIntensity;
    uniform float uChromaticAberration;
    uniform float uGlitchIntensity;
    varying vec2 vUv;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;

      float scanline = sin(uv.y * 800.0 + uTime * 10.0) * uScanlineIntensity;
      float grid = step(0.98, fract(uv.x * 50.0)) + step(0.98, fract(uv.y * 50.0));
      float noise = random(uv + uTime) * 0.1;

      float glitchTrigger = step(0.95, random(vec2(floor(uTime * 20.0), 0.0)));
      float offset = (random(vec2(uTime, vUv.y)) - 0.5) * uGlitchIntensity * glitchTrigger;
      uv.x += offset;

      vec4 colorR = texture2D(tDiffuse, uv + vec2(uChromaticAberration, 0.0));
      vec4 colorB = texture2D(tDiffuse, uv - vec2(uChromaticAberration, 0.0));
      vec4 color = texture2D(tDiffuse, uv);

      color.r = colorR.r;
      color.b = colorB.b;

      color.rgb -= scanline;
      color.rgb += vec3(grid * 0.1);
      color.rgb += vec3(noise);
      color.rgb *= (1.0 - length(vUv - 0.5) * 0.8);

      gl_FragColor = color;
    }
  `,
};

export default function RetroScanlineHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0B0C10);
    scene.fog = new THREE.Fog(0x0B0C10, 3, 12);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Text Group
    const textGroup = new THREE.Group();

    // Create text geometry using basic geometry (fallback approach)
    // Since we can't load the font JSON easily, we'll create a stylized wireframe box
    // that represents the text area with animated wireframe elements
    const textGeometry1 = new THREE.BoxGeometry(4.5, 1.2, 0.4, 12, 4, 2);
    const textGeometry2 = new THREE.BoxGeometry(4.0, 1.0, 0.35, 10, 3, 2);

    const textMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });

    const textMesh1 = new THREE.Mesh(textGeometry1, textMaterial);
    textMesh1.position.z = 0;

    const textMesh2 = new THREE.Mesh(textGeometry2, textMaterial.clone());
    textMesh2.position.z = 0;
    textMesh2.scale.x = 0.9;
    textMesh2.scale.y = 0.9;
    textMesh2.rotation.y = Math.PI * 0.05;
    (textMesh2.material as THREE.MeshBasicMaterial).opacity = 0.4;

    textGroup.add(textMesh1);
    textGroup.add(textMesh2);
    scene.add(textGroup);

    // Grid helper
    const grid = new THREE.GridHelper(20, 20, 0xff6b6b, 0x1f2833);
    grid.position.y = -1.5;
    grid.position.z = -2;
    scene.add(grid);

    // Floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 15;
    }
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xff6b6b,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Mouse tracking
    let mouseX = 0,
      mouseY = 0,
      targetX = 0,
      targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.001;
      targetY = (e.clientY - window.innerHeight / 2) * 0.001;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const scanlinePass = new ShaderPass(scanlineShader);
    composer.addPass(scanlinePass);

    // Animation
    const clock = new THREE.Clock();
    let reqId: number;

    const animate = () => {
      const time = clock.getElapsedTime();

      scanlinePass.uniforms.uTime.value = time;

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      textGroup.rotation.y = mouseX * 2;
      textGroup.rotation.x = mouseY * 2;
      textGroup.position.y = Math.sin(time) * 0.1;

      particles.rotation.y = time * 0.05;
      particles.position.y = Math.sin(time * 0.3) * 0.2;

      composer.render();
      reqId = requestAnimationFrame(animate);
    };

    animate();

    // Resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      composer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
}