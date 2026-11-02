"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { paintings, works } from "./workData";

function MushroomScene({ progress }: { progress: number }) {
  const mount = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => {
    if (!mount.current) return;
    const el = mount.current, scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 100); camera.position.set(0, 0, 8);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance", precision: "mediump" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35)); renderer.outputColorSpace = THREE.SRGBColorSpace; el.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xe8edf2, 0x6c5f50, 2.4));
    const key = new THREE.DirectionalLight(0xfff4e8, 4.2); key.position.set(-3, 6, 5); scene.add(key);
    const blue = new THREE.PointLight(0xb8ddff, 2, 12); blue.position.set(3, 0, 4); scene.add(blue);
    const group = new THREE.Group(); scene.add(group);
    new STLLoader().load(new URL("mushroom.stl", document.baseURI).href, geometry => {
      geometry.computeBoundingBox(); geometry.center(); const box = geometry.boundingBox!;
      const scale = 1.95 / Math.max(box.max.x-box.min.x, box.max.y-box.min.y, box.max.z-box.min.z);
      geometry.scale(scale, scale, scale); geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color:0xe8dfd4, roughness:.72, metalness:0 }));
      mesh.rotation.set(-Math.PI/2, 0, -.12); const position=geometry.getAttribute("position"),point=new THREE.Vector3(),rotated=new THREE.Vector3(),rotationMatrix=new THREE.Matrix4().makeRotationFromEuler(mesh.rotation);let minY=Infinity,maxY=-Infinity;for(let i=0;i<position.count;i++){point.fromBufferAttribute(position,i);rotated.copy(point).applyMatrix4(rotationMatrix);minY=Math.min(minY,rotated.y);maxY=Math.max(maxY,rotated.y)}let baseX=0,baseZ=0,baseCount=0;const baseBand=minY+(maxY-minY)*.035;for(let i=0;i<position.count;i++){point.fromBufferAttribute(position,i);rotated.copy(point).applyMatrix4(rotationMatrix);if(rotated.y<=baseBand){baseX+=rotated.x;baseZ+=rotated.z;baseCount++}}mesh.position.set(baseCount?-baseX/baseCount:0,-minY,baseCount?-baseZ/baseCount:0); group.add(mesh);
    });
    const network = new THREE.Group(); network.position.y = -1.88; network.visible=false; scene.add(network);
    const hyphaMaterials: THREE.MeshStandardMaterial[] = [];
    const hyphae: Array<{mesh:THREE.Mesh; birth:number; indexCount:number}> = [];
    const growthPaths: THREE.CatmullRomCurve3[] = [];
    let seed = 7823;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const makeHypha = (start: THREE.Vector3, angle: number, length: number, radius: number, depth: number) => {
      const side = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
      const end = start.clone().addScaledVector(side, length).add(new THREE.Vector3((random()-.5)*.26, -.24-length*.16-random()*.16, (random()-.5)*.2));
      const quarter = start.clone().lerp(end,.32).add(new THREE.Vector3((random()-.5)*.2,(random()-.5)*.16,(random()-.5)*.2));
      const threeQuarter = start.clone().lerp(end,.7).add(new THREE.Vector3((random()-.5)*.28,(random()-.5)*.18,(random()-.5)*.28));
      const curve = new THREE.CatmullRomCurve3([start, quarter, threeQuarter, end]);
      const material = new THREE.MeshStandardMaterial({ color:0xc8e7e8, emissive:0x82d9e6, emissiveIntensity:1.35, roughness:.62, transparent:true, opacity:0 });
      hyphaMaterials.push(material);
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 8, radius, 4, false), material);
      const birth = (3-depth)*.13 + random()*.065;
      const indexCount = tube.geometry.index?.count || 0;
      tube.geometry.setDrawRange(0, 0); tube.userData.phase = random()*Math.PI*2;
      hyphae.push({mesh:tube,birth,indexCount}); growthPaths.push(curve); network.add(tube);
      if(depth > 0) {
        const forks = depth >= 2 ? 2 : (random()>.52 ? 2 : 1);
        for(let f=0;f<forks;f++) makeHypha(end, angle+(f ? 1 : -1)*(.28+random()*.42), length*(.58+random()*.13), radius*.58, depth-1);
      }
      if(depth === 0 && random()>.42) {
        const tip = new THREE.PointLight(0xa8efff, 0, .72, 2); tip.position.copy(end); tip.userData.phase=random()*Math.PI*2; network.add(tip);
      }
    };
    for(let i=0;i<10;i++) makeHypha(new THREE.Vector3((random()-.5)*.16,(random()-.5)*.07,(random()-.5)*.16), (i/10)*Math.PI*2+(random()-.5)*.24, .86+random()*.52, .012+random()*.008, 3);
    const fineMaterial = new THREE.LineBasicMaterial({color:0xcaf4f1,transparent:true,opacity:0});
    const fineHyphae: Array<{line:THREE.Line; birth:number; count:number}> = [];
    for(let i=0;i<72;i++) {
      const a=random()*Math.PI*2, distance=.55+random()*3.15, startRadius=random()*.85;
      const start=new THREE.Vector3(Math.cos(a)*startRadius,-random()*.45,Math.sin(a)*startRadius*.55);
      const end=new THREE.Vector3(Math.cos(a+(random()-.5)*.35)*distance,-.7-random()*1.7,Math.sin(a)*distance*.62);
      const curve=new THREE.CatmullRomCurve3([start,start.clone().lerp(end,.35).add(new THREE.Vector3((random()-.5)*.25,(random()-.5)*.14,(random()-.5)*.2)),start.clone().lerp(end,.7).add(new THREE.Vector3((random()-.5)*.3,(random()-.5)*.18,(random()-.5)*.26)),end]);
      const geometry=new THREE.BufferGeometry().setFromPoints(curve.getPoints(10));geometry.setDrawRange(0,0);
      const line=new THREE.Line(geometry,fineMaterial);fineHyphae.push({line,birth:.28+random()*.42,count:11});network.add(line);
    }
    const particleCount = 36;
    const particlePositions = new Float32Array(particleCount*3);
    const particleRules = Array.from({length:particleCount},(_,i)=>({path:growthPaths[i%growthPaths.length],offset:random(),speed:.035+random()*.065,birth:.28+random()*.32}));
    const particleGeometry = new THREE.BufferGeometry(); particleGeometry.setAttribute("position",new THREE.BufferAttribute(particlePositions,3));
    const nutrientParticles = new THREE.Points(particleGeometry,new THREE.PointsMaterial({color:0xd9ffff,size:.045,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true})); network.add(nutrientParticles);
    const soilCount = 120, soilPositions = new Float32Array(soilCount*3);
    for(let i=0;i<soilCount;i++){const radius=.25+random()*3.8,angle=random()*Math.PI*2;soilPositions[i*3]=Math.cos(angle)*radius;soilPositions[i*3+1]=-.08-random()*2.45;soilPositions[i*3+2]=Math.sin(angle)*radius*.66;}
    const soilGeometry=new THREE.BufferGeometry();soilGeometry.setAttribute("position",new THREE.BufferAttribute(soilPositions,3));
    const soilParticles=new THREE.Points(soilGeometry,new THREE.PointsMaterial({color:0xa99d8d,size:.018,transparent:true,opacity:0,depthWrite:false}));network.add(soilParticles);
    let groundY=0,raf=0,lastRender=0,active=true; const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h,true);renderer.domElement.style.display="block";camera.aspect=w/h;camera.updateProjectionMatrix();const downPixels=w<=760?24:38,groundRatio=(w<=760?.486:.575)+downPixels/h,visibleHeight=2*camera.position.z*Math.tan(THREE.MathUtils.degToRad(camera.fov*.5));groundY=(.5-groundRatio)*visibleHeight}; const ro=new ResizeObserver(resize);ro.observe(el);resize();
    const tick=(t:number)=>{raf=0;if(!active||document.hidden)return;if(t-lastRender<32){raf=requestAnimationFrame(tick);return}lastRender=t;const p=progressRef.current,growth=Math.max(0,Math.min(1,(p-.16)*1.38));group.rotation.y=t*.00013+p*.5;group.position.set(0,groundY,0);if(!network.visible){blue.intensity=2+p*4;camera.position.z=8-p*.65;renderer.render(scene,camera);raf=requestAnimationFrame(tick);return}
      hyphaMaterials.forEach((material,i)=>{material.opacity=Math.min(1,growth*1.4)*(.6+.18*Math.sin(t*.0012+i*.77));material.emissiveIntensity=1.05+p*1.3+.22*Math.sin(t*.001+i)});
      hyphae.forEach(({mesh,birth,indexCount})=>{const local=Math.max(0,Math.min(1,(growth-birth)/.29));mesh.geometry.setDrawRange(0,Math.floor(indexCount*local))});
      fineHyphae.forEach(({line,birth,count},i)=>{const local=Math.max(0,Math.min(1,(growth-birth)/(.16+(i%7)*.012)));line.geometry.setDrawRange(0,Math.floor(count*local))});
      const particleArray=particleGeometry.attributes.position.array as Float32Array;
      particleRules.forEach((rule,i)=>{const active=Math.max(0,(growth-rule.birth)*2.2),u=Math.min(1,((t*.001*rule.speed+rule.offset)%1)*(.2+active)),point=rule.path.getPointAt(u);particleArray[i*3]=point.x;particleArray[i*3+1]=point.y;particleArray[i*3+2]=point.z});particleGeometry.attributes.position.needsUpdate=true;
      (nutrientParticles.material as THREE.PointsMaterial).opacity=Math.max(0,(growth-.25)*1.6);(soilParticles.material as THREE.PointsMaterial).opacity=growth*.24;soilParticles.rotation.y=t*.000008;fineMaterial.opacity=Math.max(0,(growth-.38)*.52);network.children.forEach(child=>{if(child instanceof THREE.PointLight)child.intensity=growth*(.45+.25*Math.sin(t*.0018+child.userData.phase))});network.rotation.y=-.15+t*.000025;blue.intensity=2+p*4;camera.position.z=8-p*.65;renderer.render(scene,camera);raf=requestAnimationFrame(tick)};
    const wake=()=>{if(active&&!document.hidden&&!raf){lastRender=0;raf=requestAnimationFrame(tick)}};const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else wake()};const io=new IntersectionObserver(([entry])=>{active=entry.isIntersecting;if(active)wake();else{cancelAnimationFrame(raf);raf=0}},{threshold:0});io.observe(el);document.addEventListener("visibilitychange",visibility);wake();
    return()=>{cancelAnimationFrame(raf);io.disconnect();document.removeEventListener("visibilitychange",visibility);ro.disconnect();renderer.dispose();el.removeChild(renderer.domElement)};
  }, []);
  return <div className="three-stage" ref={mount} aria-label="Rotating 3D mushroom with glowing mycelium" />;
}

function PortfolioMycelium() {
  const sectionRef = useRef<HTMLDivElement>(null), canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const section=sectionRef.current,canvas=canvasRef.current;if(!section||!canvas)return;const context=canvas.getContext("2d");if(!context)return;
    let width=0,height=0,frame=0,running=false,animation=0,seed=4391,nextAgentId=1,cultureStart=0,lastTime=0,initialized=false;
    const maxAgents=720;
    const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
    type Agent={id:number;x:number;y:number;angle:number;bias:number;pull:number;root:boolean;vein:number;wander:number;speed:number;life:number;age:number;generation:number;alpha:number;depth:number};
    type MeshNode={x:number;y:number;id:number;depth:number};
    let agents:Agent[]=[];const meshCells=new Map<string,MeshNode>(),meshCellSize=48;
    const resize=()=>{width=section.clientWidth;height=section.clientHeight;const maxCanvasPixels=5000000,dpr=Math.min(window.devicePixelRatio || 1,1.25,Math.sqrt(maxCanvasPixels/Math.max(1,width*height)));canvas.width=Math.floor(width*dpr);canvas.height=Math.floor(height*dpr);canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;context.setTransform(dpr,0,0,dpr,0,0)};
    const addSeed=(x:number,y:number,targetAngle:number,count:number,generation=0)=>{for(let i=0;i<count;i++){const speed=.82+random()*.62,jitter=(random()-.5)*.12;agents.push({id:nextAgentId++,x,y,angle:Math.PI/2+(targetAngle-Math.PI/2)*.35+jitter,bias:targetAngle+jitter,pull:.01,root:true,vein:random()>.86?1.4:.58+random()*.48,wander:random()*Math.PI*2,speed,life:generation===0?height/speed*1.2:430+random()*680,age:0,generation,alpha:.28+random()*.22,depth:(random()-.5)*1.5})}};
    const addCultureSeed=(x:number,y:number,angle:number)=>{const speed=.48+random()*.56,drift=(random()-.5)*.42;agents.push({id:nextAgentId++,x,y,angle:angle+drift*.45,bias:angle+drift,pull:.018,root:false,vein:1,wander:random()*Math.PI*2,speed,life:300+random()*520,age:0,generation:1,alpha:.18+random()*.23,depth:(random()-.5)*1.8})};
    const initialize=()=>{resize();context.clearRect(0,0,width,height);agents=[];meshCells.clear();nextAgentId=1;const seedCount=24;for(let i=0;i<seedCount;i++){const fan=.11*Math.PI+(i/(seedCount-1))*.78*Math.PI;addSeed(width*.5+(random()-.5)*8,0,fan,1)}addSeed(width*.5,0,Math.PI/2,4);cultureStart=Math.max(height*.22,innerHeight*.95);const bandHeight=Math.max(560,innerHeight*.82);for(let bandTop=cultureStart;bandTop<height-80;bandTop+=bandHeight){for(let i=0;i<8;i++){const y=Math.min(height-2,bandTop+(i+.15+random()*.7)*bandHeight/8);addCultureSeed(1,y,0);addCultureSeed(width-1,y,Math.PI)}}};
    const grow=(time:number)=>{animation=0;if(!running)return;if(time-lastTime<32){animation=requestAnimationFrame(grow);return}lastTime=time;frame++;for(let pass=0;pass<2;pass++){const newborn:Agent[]=[];for(const agent of agents){if(agent.age++>agent.life)continue;const oldX=agent.x,oldY=agent.y,oldDepth=agent.depth,broad=Math.sin(agent.y*.0037+agent.x*.0023)+Math.cos(agent.x*.0054-agent.y*.0012),fine=Math.sin(agent.y*.016+Math.cos(agent.x*.012)*2.3),rootWander=agent.root?Math.sin(agent.age*.041+agent.wander)*.018+Math.sin(agent.age*.013+agent.wander*1.73)*.01+(random()<.012?(random()-.5)*.1:0):0,cultureWander=agent.root?0:Math.sin(agent.age*.032+agent.wander)*.012+Math.sin(agent.age*.009+agent.wander*1.6)*.006+(random()<.01?(random()-.5)*.07:0);agent.angle+=broad*.014+fine*.009+(random()-.5)*.068+rootWander+cultureWander;agent.angle+=(agent.bias-agent.angle)*agent.pull;if(agent.root){const upwardAllowance=agent.generation>=4?.1*Math.PI:.0,minAngle=upwardAllowance?-upwardAllowance:.06*Math.PI,maxAngle=upwardAllowance?Math.PI+upwardAllowance:.94*Math.PI;agent.angle=Math.max(minAngle,Math.min(maxAngle,agent.angle))}agent.depth=Math.max(-1,Math.min(1,agent.depth+Math.sin(agent.y*.009+agent.x*.004)*.008+(random()-.5)*.025));agent.x+=Math.cos(agent.angle)*agent.speed;agent.y+=Math.sin(agent.angle)*agent.speed;if(agent.x<0||agent.x>width||agent.y<0||agent.y>height)continue;const oldScale=1+oldDepth*.2,newScale=1+agent.depth*.2,oldProjectedX=width*.5+(oldX-width*.5)*oldScale,newProjectedX=width*.5+(agent.x-width*.5)*newScale,oldProjectedY=oldY+oldDepth*15,newProjectedY=agent.y+agent.depth*15,taper=Math.max(.05,1-agent.age/agent.life),depthLight=.58+(agent.depth+1)*.21;context.beginPath();context.moveTo(oldProjectedX,oldProjectedY);context.lineTo(newProjectedX,newProjectedY);context.strokeStyle=`rgba(194,235,229,${agent.alpha*(.34+taper*.48)*depthLight})`;context.shadowColor="rgba(118,224,226,.55)";context.shadowBlur=agent.root?2:0;const rootWidth=agent.generation===0?.46+agent.vein*.62:Math.max(.14,.92-agent.generation*.095),widthPulse=agent.root?.94+.045*Math.sin(agent.age*.11+agent.wander)+.025*Math.sin(agent.age*.37+agent.wander*2.1):.9+.08*Math.sin(agent.age*.09+agent.wander);context.lineWidth=agent.root?rootWidth*widthPulse*taper*(.82+(agent.depth+1)*.2):Math.max(.1,(1.18-agent.generation*.105)*widthPulse*taper*(.78+(agent.depth+1)*.22));context.stroke();context.shadowBlur=0;
        if(agent.root&&newProjectedY<cultureStart&&agent.age%8===0){const cx=Math.floor(newProjectedX/meshCellSize),cy=Math.floor(newProjectedY/meshCellSize);let bridge:MeshNode|undefined;for(let dx=-1;dx<=1&&!bridge;dx++){for(let dy=-1;dy<=1;dy++){const candidate=meshCells.get(`${cx+dx}:${cy+dy}`);if(!candidate||candidate.id===agent.id)continue;const distance=Math.hypot(candidate.x-newProjectedX,candidate.y-newProjectedY);if(distance>18&&distance<70&&random()<.14){bridge=candidate;break}}}if(bridge){const midX=(newProjectedX+bridge.x)/2+(random()-.5)*9,midY=(newProjectedY+bridge.y)/2+(random()-.5)*9;context.beginPath();context.moveTo(newProjectedX,newProjectedY);context.quadraticCurveTo(midX,midY,bridge.x,bridge.y);context.strokeStyle=`rgba(194,235,229,${.065+depthLight*.06})`;context.lineWidth=.18+random()*.3;context.stroke()}meshCells.set(`${cx}:${cy}`,{x:newProjectedX,y:newProjectedY,id:agent.id,depth:agent.depth})}
        const branchChance=agent.generation<10?(agent.root?.012:.013)+agent.age/agent.life*.006:0;if(random()<branchChance&&agents.length+newborn.length<maxAgents){const side=random()>.5?1:-1,turn=agent.root?.3+random()*1.02:.16+random()*.5,childGeneration=agent.generation+1,upwardAllowance=childGeneration>=4?.1*Math.PI:0,minAngle=upwardAllowance?-upwardAllowance:.06*Math.PI,maxAngle=upwardAllowance?Math.PI+upwardAllowance:.94*Math.PI,newAngle=agent.root?Math.max(minAngle,Math.min(maxAngle,agent.angle+side*turn)):agent.angle+side*turn,newBias=agent.root?newAngle:agent.bias+side*turn*.32;newborn.push({...agent,id:nextAgentId++,angle:newAngle,bias:newBias,vein:Math.max(.34,agent.vein*(.62+random()*.18)),wander:agent.wander+(random()-.5)*2.4,speed:agent.speed*(.62+random()*.24),life:200+random()*560,age:0,generation:childGeneration,alpha:agent.alpha*.86,depth:Math.max(-1,Math.min(1,agent.depth+(random()-.5)*.65))})}}agents=agents.filter(a=>a.age<=a.life&&a.x>=0&&a.x<=width&&a.y>=0&&a.y<=height).concat(newborn)}if(frame<720&&agents.length)animation=requestAnimationFrame(grow);else running=false};
    const start=()=>{if(!initialized){initialize();initialized=true}if(!running){running=true;lastTime=0;animation=requestAnimationFrame(grow)}};
    const stop=()=>{running=false;cancelAnimationFrame(animation);animation=0};
    const io=new IntersectionObserver(([entry])=>{if(entry.isIntersecting)start();else stop()},{rootMargin:"0px"});io.observe(section);const ro=new ResizeObserver(()=>{if(frame===0)resize()});ro.observe(section);return()=>{io.disconnect();ro.disconnect();stop()};
  },[]);
  return <div className="portfolio-culture" ref={sectionRef}><canvas ref={canvasRef} aria-label="A luminous mycelium network growing downward through the portfolio"/><div className="culture-status"><i/> NETWORK / GROWING DOWNWARD</div></div>;
}

export default function Home() {
  const [progress,setProgress]=useState(0);
  useEffect(()=>{const onScroll=()=>setProgress(Math.min(1,scrollY/(innerHeight*1.25)));onScroll();addEventListener("scroll",onScroll,{passive:true});return()=>removeEventListener("scroll",onScroll)},[]);
  const jump=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  return <main className="site-shell">
    <div className="grain" aria-hidden="true" />
    <nav className="topbar" aria-label="Portfolio navigation"><button onClick={()=>scrollTo({top:0,behavior:"smooth"})}>SY / FIELD NOTES</button><div><span>PORTFOLIO 2026</span><button onClick={()=>jump("paintings")}>PAINTINGS ↘</button><button onClick={()=>jump("about")}>ABOUT ↘</button></div></nav>
    <section className="hero" style={{"--p":progress} as React.CSSProperties}><div className="sky"/><div className="hero-copy"><p className="eyebrow">ART · CODE · CHARACTER</p><h1>Born from<br/><em>curiosity.</em></h1></div><MushroomScene progress={progress}/><p className="hero-note">A living archive of things I’ve drawn,<br/>built, rendered, and taught to speak.</p><div className="soil"><div className="soil-depth"/><div className="scroll-cue"><span>SCROLL TO FOLLOW THE ROOTS</span><i/></div><div className="growth-rules"><span>GROWTH MODEL / 7823</span><span>BRANCH θ 16—40°</span><span>NUTRIENT FLOW / ACTIVE</span></div></div></section>
    <section className="work-network" aria-label="Selected work growing along a mycelium network"><PortfolioMycelium/><div className="network-intro"><p className="eyebrow light">THE NETWORK / 2022—NOW</p><p>Follow the organism downward. Each living node opens one project.</p></div>{works.map((work,i)=><a className={`work-node node-${i+1}`} href={`work/${work.slug}/`} key={work.slug}><div className="work-thumb"><img src={`media/${work.cover.src}`} alt={work.cover.alt} style={{objectPosition:work.coverPosition}} loading="lazy" decoding="async"/><span>{work.n}</span><i>{work.medium}</i></div><div className="node-copy"><span>{work.type}</span><h3>{work.title}</h3><p>{work.note}</p><b>OPEN PROJECT ↗</b></div></a>)}</section>
    <section className="paintings" id="paintings"><div className="paintings-head"><p className="eyebrow">PAINTINGS · IN BETWEEN</p><h2>Between the<br/><em>projects.</em></h2><p>Pieces that don’t belong to a larger project: slow looking, done for its own sake.</p></div><div className="paintings-row">{paintings.map(p=><figure key={p.src} style={{"--ar":p.w/p.h} as React.CSSProperties}><img src={`media/${p.src}`} alt={p.alt} width={p.w} height={p.h} loading="lazy" decoding="async"/><figcaption>{p.caption}</figcaption></figure>)}</div></section>
    <section className="study"><p className="eyebrow">WHERE THE ROOTS TRAVELED</p><h2>Learning in<br/><em>new ecosystems.</em></h2><div className="school-grid"><article><b>UCLA</b><span>SUMMER SESSIONS 2025</span><ul className="course-list"><li><i>THEATER 72</i>Production Practice<small>Costume and millinery for the stage: researching 1791, rendering, and building a hat for Marie Antoinette’s flight to Varennes.</small></li><li><i>DESMA 2</i>AI &amp; Art<small>Making art with, and about, artificial intelligence.</small></li></ul></article><article><b>STANFORD</b><span>SUMMER SESSION 2026</span><ul className="course-list"><li><i>CS 148</i>Intro to Computer Graphics &amp; Imaging<small>How images are modeled, lit and rendered. The Mycelium Village mushroom first became a mesh that summer.</small></li><li><i>ENGLISH 182</i>Critical Game Studies<small>Reading games as culture. I wrote “Before Words: How Sky: Children of the Light Builds Trust Between Players.”</small></li><li><i>MS&amp;E 75</i>Redefining Creativity<small>Treating creativity as a practice that can be studied and trained.</small></li></ul></article></div></section>
    <footer id="about"><div><p className="eyebrow">A SMALL SELF-PORTRAIT</p><h2>Part artist.<br/>Part engineer.<br/><em>Entirely curious.</em></h2></div><div className="about-text"><p>I’m interested in the strange little bridges between things: a clay face and a polygon mesh, a squirrel VTuber and a quiet evening after dinner, a stray cat and the person who might take it home.</p><a href="mailto:hello@example.com">LET’S CONNECT ↗</a></div><div className="footer-line"><span>MADE WITH THREE.JS + MYCELIUM</span><span>SHANGHAI / 2026</span><span>↑ BACK TO LIGHT</span></div></footer>
  </main>;
}
