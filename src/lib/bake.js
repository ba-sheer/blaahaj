import { createSharkScene,BACKING,PRIZE_POSE } from "./shark-scene";
import { GLB_URL } from "./assets";

let scenePromise = null;
const cache = new Map();

function getScene(){
    scenePromise ??= (async()=>
    {
        const canvas = document.createElement('canvas');
        const scene = createSharkScene({
            canvas,glbUrl:GLB_URL,backing:{...BACKING},
            pose:PRIZE_POSE,preserveDrawingBuffer:true
        });
        await scene.ready;
        return{scene,canvas};
    })();
    return scenePromise;
}
const rad = (d)=>(Number(d)||0)*Math.PI/180;

export async function bakeShark(rx=0,ry=0) {
    const key=`${rx}:${ry}`;
    if(cache.has(key))return cache.get(key);
    const {scene,canvas}= await getScene();
    scene.state.rx = PRIZE_POSE.rx +rad(rx);
    scene.state.ry = PRIZE_POSE.ry +rad(ry);
    scene.render();
    const url = canvas.toDataURL('image/png');
    cache.set(key,url);
    return url;
    
}