import { Canvas, extend } from "@react-three/fiber";
import { MeshLineGeometry, MeshLineMaterial, raycast } from "meshline";
import { Html, OrbitControls } from "@react-three/drei";
import mapper from "./mapper";
import { useControls } from "leva";
import Lerper from "./Lerper";
import { useEffect, useState } from "react";
extend({ MeshLineGeometry, MeshLineMaterial });

function App() {
  let { numArrays, smooth, bend, lineV, cubeV, darkMode } = useControls({
    numArrays: 100,
    smooth: 10,
    bend: 0.07,
    lineV: true,
    cubeV: false,
    darkMode: false,
  });
  const colors = ["#FD8A8A", "#F1F7B5", "#A8D1D1", "#9EA1D4"];
  const pointArrays = [...Array(numArrays)].map(() => {
    let a = {
      x: mapper(Math.random(), 0, 1, -5, 5),
      y: mapper(Math.random(), 0, 1, 0, 5),
      z: mapper(Math.random(), 0, 1, -5, 5),
    };
    let b = {
      x: mapper(Math.random(), 0, 1, -5, 5),
      y: mapper(Math.random(), 0, 1, 0, 5),
      z: mapper(Math.random(), 0, 1, -5, 5),
    };
    const xLerp = Lerper(a.x, b.x, smooth);
    const yLerp = Lerper(a.y, b.y, smooth);
    const zLerp = Lerper(a.z, b.z, smooth);
    const color = colors[Math.floor(Math.random() * colors.length)];
    return { xLerp, yLerp, zLerp, color };
  });

  return (
    <div>
      <Canvas
        style={{
          width: "100vw",
          height: "100vh",
          background: darkMode ? "#000000" : "#F0F0F0",
        }}
      >
        <group>
          {pointArrays.map((points) => (
            <>
              {Array.from({ length: smooth + 2 }).map((_, i) => (
                <group>
                  {lineV && (
                    <mesh raycast={raycast}>
                      <meshLineGeometry
                        points={[
                          points.xLerp[i],
                          points.yLerp[i] +
                            bend * (i - 0) * (i - (points.yLerp.length - 1)),
                          points.zLerp[i],
                          points.xLerp[i + 1],
                          points.yLerp[i + 1] +
                            bend *
                              (i + 1 - 0) *
                              (i + 1 - (points.yLerp.length - 1)),
                          points.zLerp[i + 1],
                        ]}
                      />
                      <meshLineMaterial lineWidth={0.1} color={points.color} />
                    </mesh>
                  )}
                  {cubeV && (
                    <mesh
                      scale={0.1}
                      position={[
                        points.xLerp[i],
                        points.yLerp[i] +
                          bend * (i - 0) * (i - (points.yLerp.length - 1)),
                        points.zLerp[i],
                      ]}
                    >
                      <boxGeometry />
                      <meshBasicMaterial color="lime" />
                      {darkMode && (
                        <Html distanceFactor={10}>
                          <div className="content" style={{ color: "#ffffff" }}>
                            {i}
                          </div>
                        </Html>
                      )}
                      {!darkMode && (
                        <Html distanceFactor={10}>
                          <div className="content" style={{ color: "#000000" }}>
                            {i}
                          </div>
                        </Html>
                      )}
                    </mesh>
                  )}
                </group>
              ))}
            </>
          ))}
        </group>
        <gridHelper />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
