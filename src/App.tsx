import React, { useState, useEffect, useRef } from 'react';
import { Canvas, extend, Object3DNode, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Effects, PerspectiveCamera } from '@react-three/drei';
import { UnrealBloomPass } from 'three-stdlib';
import Figure8Particles from './components/Figure8Particles';
import Stats from 'stats.js';

extend({ UnrealBloomPass });

// Extend JSX namespace
declare global {
  namespace JSX {
    interface IntrinsicElements {
      unrealBloomPass: Object3DNode<UnrealBloomPass, typeof UnrealBloomPass>
    }
  }
}

const EditableValue: React.FC<{
  value: number;
  setValue: (value: number) => void;
  step: number;
  sliderMin: number;
  sliderMax: number;
}> = ({ value, setValue, step, sliderMin, sliderMax }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());

  useEffect(() => {
    setTempValue(value.toFixed(step < 1 ? 2 : 0));
  }, [value, step]);

  const handleSubmit = () => {
    setIsEditing(false);
    const newValue = Number(tempValue);
    if (!isNaN(newValue)) {
      setValue(Math.min(Math.max(newValue, sliderMin), sliderMax));
    } else {
      setTempValue(value.toFixed(step < 1 ? 2 : 0));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (isEditing) {
    return (
      <input
        type="number"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        step={step}
        style={{ width: '50px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none' }}
      />
    );
  }

  return (
    <span onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
      {value.toFixed(step < 1 ? 2 : 0)}
    </span>
  );
};

const Controls: React.FC<{
  particleCount: number;
  setParticleCount: (count: number) => void;
  brightness: number;
  setBrightness: (brightness: number) => void;
  particleSize: number;
  setParticleSize: (size: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  noise: number;
  setNoise: (noise: number) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
}> = ({ 
  particleCount, 
  setParticleCount, 
  brightness, 
  setBrightness, 
  particleSize, 
  setParticleSize, 
  speed, 
  setSpeed, 
  noise, 
  setNoise, 
  opacity, 
  setOpacity
}) => {
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      color: 'white',
      fontFamily: '"Roboto", sans-serif',
      fontSize: '14px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: '10px',
      borderRadius: '8px',
      display: 'grid',
      gridTemplateColumns: 'auto 50px 140px',
      columnGap: '10px',
      rowGap: '5px',
      alignItems: 'center',
    }}>
      {[ 
        { label: 'Particle Count:', value: particleCount, setValue: setParticleCount, step: 1000, min: 100, max: 1000000 },
        { label: 'Brightness:', value: brightness, setValue: setBrightness, step: 0.01, min: 0, max: 1 },
        { label: 'Opacity:', value: opacity, setValue: setOpacity, step: 0.01, min: 0, max: 1 },
        { label: 'Particle Size:', value: particleSize, setValue: setParticleSize, step: 0.001, min: 0.001, max: 0.05 },
        { label: 'Speed:', value: speed, setValue: setSpeed, step: 0.01, min: 0, max: 2 },
        { label: 'Noise:', value: noise, setValue: setNoise, step: 0.01, min: 0, max: 1 },
      ].map(({ label, value, setValue, step, min, max }) => (
        <React.Fragment key={label}>
          <label style={{ marginRight: '5px' }}>{label}</label>
          <EditableValue value={value} setValue={setValue} step={step} sliderMin={min} sliderMax={max} />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={Math.min(Math.max(value, min), max)}
            onChange={(e) => setValue(Number(e.target.value))}
            style={{ width: '100%', margin: '0' }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

const FPSStats: React.FC = () => {
  const { gl } = useThree();
  const stats = useRef<Stats>();

  useEffect(() => {
    stats.current = new Stats();
    stats.current.showPanel(0);
    stats.current.dom.style.cssText = 'position:fixed;top:0;right:0;cursor:pointer;opacity:0.9;z-index:10000';
    gl.domElement.parentNode?.appendChild(stats.current.dom);

    return () => {
      gl.domElement.parentNode?.removeChild(stats.current!.dom);
    };
  }, [gl]);

  useFrame(() => {
    stats.current?.update();
  });

  return null;
};

const CameraController: React.FC<{ currentShape: number }> = ({ currentShape }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    if (currentShape === 0) {
      // Figure 8 camera position
      camera.position.set(0, 0, 5);
    } else if (currentShape === 1) {
      // Cube camera position
      camera.position.set(3, 3, 3);
    }
    camera.lookAt(0, 0, 0);
  }, [currentShape, camera]);

  return null;
};

const App: React.FC = () => {
  const [particleCount, setParticleCount] = useState(100000);
  const [brightness, setBrightness] = useState(0.7);
  const [particleSize, setParticleSize] = useState(0.001);
  const [speed, setSpeed] = useState(0.15);
  const [noise, setNoise] = useState(0.2);
  const [opacity, setOpacity] = useState(0.7);

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black', position: 'relative' }}>
      <Canvas>
        <CameraController currentShape={0} />
        <PerspectiveCamera makeDefault fov={60} />
        <FPSStats />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <Figure8Particles
          particleCount={particleCount}
          particleSize={particleSize}
          speed={speed}
          noise={noise}
          opacity={opacity}
        />
        <Effects disableGamma>
          <unrealBloomPass threshold={0.1} strength={brightness} radius={0.8} />
        </Effects>
      </Canvas>
      <Controls
        particleCount={particleCount}
        setParticleCount={setParticleCount}
        brightness={brightness}
        setBrightness={setBrightness}
        particleSize={particleSize}
        setParticleSize={setParticleSize}
        speed={speed}
        setSpeed={setSpeed}
        noise={noise}
        setNoise={setNoise}
        opacity={opacity}
        setOpacity={setOpacity}
      />
    </div>
  );
};

export default App;
