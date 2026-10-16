import { resolve } from 'node:dns';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export const PRIZE_POSE = { rx: -19.08, ry: 100.50986217719377 };

export const FRAMING = {tiltDeg:-15,camYFactor:0.18,margin:1.05};

export const BACKING = {w:73,h:64};

function quantize(mat){
    mat.onBeforeCompile=(s)=>{
        s.fragmentShader = s.fragmentShader.replace('#include <dithering_fragment>',
`#include <dithering_fragment>
float eb = gl_FragColor.b;
float r = 6.0 / 1024.0;
eb = min(eb, textureLod(map, vMapUv + vec2( r, 0.0), 0.0).b);
eb = min(eb, textureLod(map, vMapUv + vec2(-r, 0.0), 0.0).b);
eb = min(eb, textureLod(map, vMapUv + vec2(0.0,  r), 0.0).b);
eb = min(eb, textureLod(map, vMapUv + vec2(0.0, -r), 0.0).b);
eb = min(eb, textureLod(map, vMapUv + vec2( r,  r), 0.0).b);
eb = min(eb, textureLod(map, vMapUv + vec2(-r,  r), 0.0).b);
eb = min(eb, textureLod(map, vMapUv + vec2( r, -r), 0.0).b);
eb = min(eb, textureLod(map, vMapUv + vec2(-r, -r), 0.0).b);
vec2 dX = dFdx(vMapUv), dY = dFdy(vMapUv);
float det = dX.x * dY.y - dX.y * dY.x;
vec2 d0 = vec2(0.2607, 0.8428) - vMapUv;
vec2 d1 = vec2(0.3887, 0.8428) - vMapUv;
float s0 = (d0.x * dY.y - dY.x * d0.y) / det, t0 = (dX.x * d0.y - d0.x * dX.y) / det;
float s1 = (d1.x * dY.y - dY.x * d1.y) / det, t1 = (dX.x * d1.y - d1.x * dX.y) / det;
bool catchlight = (abs(s0) < 0.5 && abs(t0) < 0.5) || (abs(s1) < 0.5 && abs(t1) < 0.5);
gl_FragColor.rgb = catchlight
  ? vec3(0.8510, 0.8314, 0.8471)
  : (gl_FragColor.b < 0.25 || eb < 0.06)
  ? vec3(0.3216, 0.3020, 0.2902)
  : (gl_FragColor.b - gl_FragColor.r > 0.08)
    ? vec3(0.5686, 0.7059, 0.8588)
    : (gl_FragColor.r - gl_FragColor.b > 0.08)
      ? vec3(0.9020, 0.7294, 0.7176)
      : vec3(0.8510, 0.8314, 0.8471);
`);
    }
}

export function createSharkScene({canvas,glbUrl,backing={...BACKING},framing= FRAMING,pose=PRIZE_POSE,preserveDrawingBuffer=false}){
    const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:false,preserveDrawingBuffer});
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000,0);
    renderer.setSize(backing.w,backing.h,false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35,backing.w/backing.h,0.1,100);
    const tilt = new THREE.Group();
    tilt.rotation.z = framing.tiltDeg * Math.PI/180;
    scene.add(tilt);
    const rig = new THREE.Group();
    tilt.add(rig);
    rig.rotation.set(pose.rx,pose.ry,0);
    const state ={rx:pose.rx,ry:pose.ry,loaded:false};
    function render(){
        rig.rotation.set(state.rx,state.ry,0);
        renderer.render(scene,camera);
    }
    const ready = new Promise((resolve,reject)=>{
        new GLTFLoader().load(glbUrl,(g)=>{
            const m = g.scene;
            const box = new THREE.Box3().setFromObject(m);
            const center = box.getCenter(new THREE.Vector3());

            let maxSq = 0;
            const v = new THREE.Vector3();
            m.traverse((o)=>{
                if(!o.isMesh||!o.material||!o.material.map) return;
                const pos = o.geometry.attributes.position;
                for(let i=0;i<pos.count;i++){
                    const d2 = v.fromBufferAttribute(pos,
                        i
                    ).applyMatrix4(o.matrixWorld).distanceToSquared(center);
                    if(d2>maxSq) maxSq = d2;
                }
            });
            const radius = Math.sqrt(maxSq)*framing.margin;
            m.position.sub(center);

            const half = camera.fov * Math.PI/360;
            const dist =radius/Math.tan(half)/Math.min(1,camera.aspect);
            camera.position.set(0,radius*framing.camYFactor,dist);
            camera.lookAt(0,0,0);
            m.traverse((o)=>{
                if(!o.isMesh) return;
                if(o.material.map){
                    const tex = o.material.map;
                    tex.generateMipmaps = false;
                    tex.minFilter = THREE.LinearFilter;
                    tex.needsUpdate = true;
                    o.material = new THREE.MeshBasicMaterial({map:tex});
                    quantize(o.material);
                }else{
                    o.visible = false;
                }
            });
            rig.add(m);
            state.loaded = true;
            render();
            resolve(api);
        },undefined,reject);
    });
    const api ={render,dispose:()=>renderer.dispose(),state,renderer,get ready(){return ready;}};
    return api;
}