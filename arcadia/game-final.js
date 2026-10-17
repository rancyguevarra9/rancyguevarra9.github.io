/* Focused playability fixes: smooth driving, animated duels, rotating mazes. */
function startRidge(){
  let distance=0,fuel=82,velocity=0,press={up:false,down:false},cans=[],rocks=[],nextFuel=820,nextRock=1160,bodyAngle=0,angularVelocity=0,verticalVelocity=0,carY=null,grounded=true,lastGroundAngle=0,pickups=0;
  const road=x=>402+Math.sin(x*.0037)*67+Math.sin(x*.009)*27+Math.sin(x*.022)*9;
  const drawHillCar=(x,y,angle)=>{ctx.save();ctx.translate(x,y);ctx.rotate(angle);rounded(-42,-25,82,30,10,'#ff78bd');rounded(-14,-40,42,21,8,'#f8d8ee');ctx.fillStyle='#151a2b';ctx.beginPath();ctx.arc(-27,14,13,0,Math.PI*2);ctx.arc(28,14,13,0,Math.PI*2);ctx.fill();ctx.fillStyle='#a9c4f6';ctx.fillRect(-8,-35,22,13);ctx.restore();};
  gameState={press};
  function populate(world){while(nextFuel<world+1550){cans.push({x:nextFuel,taken:false});nextFuel+=760+Math.random()*360;}while(nextRock<world+1550){rocks.push({x:nextRock,hit:false});nextRock+=540+Math.random()*340;}}
  function loop(){
    if(!running)return;
    const carX=220;
    let world=distance,rearY=road(world+carX-28),frontY=road(world+carX+28),groundAngle=Math.atan2(frontY-rearY,56),steepness=Math.sin(groundAngle);
    if(press.up){velocity+=.088;fuel-=.03+velocity*.008;}
    if(press.down)velocity-=.075;
    velocity-=Math.max(0,steepness)*.015;
    velocity*=.995;
    velocity=Math.max(0,Math.min(3.55,velocity));
    distance+=velocity;
    world=distance;rearY=road(world+carX-28);frontY=road(world+carX+28);groundAngle=Math.atan2(frontY-rearY,56);
    const groundY=(rearY+frontY)/2-27;
    // Stable, predictable handling: the road shapes speed rather than throwing the car around.
    carY=groundY;bodyAngle+=(groundAngle-bodyAngle)*.18;grounded=true;
    populate(world);
    bg('#2d4d7c','#101a2e');
    for(let x=0;x<canvas.width;x+=7){const ground=road(x+world);ctx.fillStyle='#194d42';ctx.fillRect(x,ground,8,canvas.height-ground);ctx.fillStyle='#4a9b67';ctx.fillRect(x,ground,8,6);}
    for(const can of cans){const sx=can.x-world;if(sx>-45&&sx<1005&&!can.taken){drawFuelCan(sx,road(can.x)-42);if(Math.abs(sx-carX)<31){can.taken=true;fuel=Math.min(100,fuel+27);pickups++;beep(620,.07);}}}
    for(const rock of rocks){const sx=rock.x-world;if(sx>-35&&sx<995&&!rock.hit){drawBoulder(sx,road(rock.x)-4);if(Math.abs(sx-carX)<29){rock.hit=true;const hardHit=velocity>1.28;velocity*=hardHit?.32:.62;fuel=Math.max(0,fuel-(hardHit?10:4));beep(210,.09);}}}
    drawHillCar(carX,carY,bodyAngle);rounded(30,29,235,17,9,'#ffffff25');rounded(30,29,Math.max(0,235*fuel/100),17,9,fuel<25?'#ff6b75':'#ffca4b');text(`FUEL ${Math.ceil(fuel)}%`,30,72,14,'#e7ecff');text(`${Math.floor(distance)}m`,910,63,22,'#fff','right');text(press.up?'GAS · MANAGE SPEED':'COAST / BRAKE · SAVE FUEL',910,88,12,press.up?'#ffdc76':'#bed0ec','right');setScore(distance*.52+pickups*18);
    if(fuel<=0){endGame('Out of fuel');return;}
    animation=requestAnimationFrame(loop);
  }
  loop();
}
function actionFighter(x,y,color,flip,pose,frame){
  const active=pose&&pose.frames>0, progress=active?1-pose.frames/pose.total:0;
  const wobble=Math.sin(frame*.13+(flip?1:0))*2;
  const lunge=active?(pose.type==='kick'?20:15)*Math.sin(progress*Math.PI):0;
  const recoil=pose.type==='hit'?-14*Math.sin(progress*Math.PI):0;
  ctx.save();ctx.translate(x+(flip?-1:1)*(lunge+recoil),y+wobble);ctx.scale(flip?-1:1,1);
  ctx.strokeStyle=color;ctx.lineWidth=12;ctx.lineCap='round';ctx.lineJoin='round';
  const punch=active&&pose.type==='punch',kick=active&&pose.type==='kick',block=active&&pose.type==='guard',hit=active&&pose.type==='hit';
  const lean=(punch?12:kick?15:block?-8:hit?-12:0)*Math.sin(progress*Math.PI);
  ctx.beginPath();ctx.arc(lean*.12,-94,19,0,Math.PI*2);ctx.moveTo(lean*.12,-75);ctx.lineTo(lean,-28);
  // Arms: long extension for punch, raised guard, relaxed idle movement.
  ctx.moveTo(lean*.55,-61);ctx.lineTo(punch?64:block?30:29,punch?-68:block?-88:-42);
  ctx.moveTo(lean*.55,-61);ctx.lineTo(block?42:-29,block?-54:-39);
  // Legs: a clear kicking leg, a planted supporting leg, and a small idle walk.
  ctx.moveTo(lean,-28);ctx.lineTo(kick?68:25,kick?-2:24);
  ctx.moveTo(lean,-28);ctx.lineTo(kick?-20:-25,kick?27:25);
  ctx.stroke();
  if(active&&(punch||kick)){ctx.fillStyle='#fff2a8';ctx.beginPath();ctx.arc(punch?68:72,punch?-68:-2,7,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}
function startDuel(){
  let player=100,enemy=100,guard=0,cool=0,enemyCool=150,frame=0;
  let playerPose={type:'idle',frames:0,total:1},enemyPose={type:'idle',frames:0,total:1},impact=0;
  const animate=(target,type,frames)=>target=== 'player' ? playerPose={type,frames,total:frames} : enemyPose={type,frames,total:frames};
  const strike=(type)=>{if(cool||!running)return;const isKick=type==='kick',damage=isKick?16:10;cool=isKick?54:38;animate('player',type,cool);const guarded=guard>0;enemy-=guarded?Math.ceil(damage*.35):damage;impact=12;setScore(score+(isKick?36:24));beep(isKick?380:520,.06);};
  gameState={punch:()=>strike('punch'),kick:()=>strike('kick'),attack:()=>strike('punch'),guard:()=>{if(cool)return;guard=52;animate('player','guard',52);beep(260,.04);}};
  function loop(){if(!running)return;frame++;cool=Math.max(0,cool-1);guard=Math.max(0,guard-1);playerPose.frames=Math.max(0,playerPose.frames-1);enemyPose.frames=Math.max(0,enemyPose.frames-1);impact=Math.max(0,impact-1);enemyCool--;if(enemyCool<=0){const type=Math.random()>.48?'kick':'punch',damage=type==='kick'?15:10;animate('enemy',type,type==='kick'?54:38);player-=guard?Math.ceil(damage*.2):damage;impact=12;enemyCool=120+Math.random()*62;beep(type==='kick'?250:315,.05);}bg('#26122f','#0b0b1a');for(let i=0;i<18;i++){ctx.fillStyle='#ffffff0e';ctx.fillRect(i*58,0,1,canvas.height);}ctx.strokeStyle='#ffb8e433';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(90,440);ctx.lineTo(870,440);ctx.stroke();drawHealth(58,42,330,player,'#ff70ad','YOU');drawHealth(572,42,330,enemy,'#9582ff','RIVAL');actionFighter(310,415,guard?'#bceaff':'#ef79bd',false,playerPose,frame);actionFighter(655,415,'#8e81ff',true,enemyPose,frame);if(impact){text('✦',480,278,28,'#fff0ae','center');}text(guard?'GUARDING · RELEASE TO STRIKE':'A PUNCH · D KICK · S GUARD',480,500,15,guard?'#bdeaff':'#e7d7ef','center');if(enemy<=0){setScore(score+150);endGame('Rival defeated');return;}if(player<=0){endGame('Round over');return;}animation=requestAnimationFrame(loop);}loop();
}
function startOrbit(){let angle=-Math.PI/2,signal={angle:Math.random()*Math.PI*2,dist:350},caught=0;gameState={left:false,right:false};function loop(){if(!running)return;if(gameState.left)angle-=.04;if(gameState.right)angle+=.04;signal.dist-=.38+Math.min(score*.0025,.3);if(signal.dist<148){const delta=Math.atan2(Math.sin(signal.angle-angle),Math.cos(signal.angle-angle));if(Math.abs(delta)<.55){caught++;setScore(score+35);beep(620,.07);signal={angle:Math.random()*Math.PI*2,dist:350};}else{endGame('Core breached');return;}}bg('#101838','#080d20');text(`SIGNALS CAUGHT ${caught}`,480,65,18,'#c7ddff','center');drawOrbit(angle,signal);animation=requestAnimationFrame(loop);}loop();}
function startMaze(){
  const key=(col,row)=>`${col},${row}`;
  const routeLength=walls=>{const queue=[[0,0,0]],seen=new Set([key(0,0)]);while(queue.length){const [col,row,steps]=queue.shift();if(col===7&&row===4)return steps;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=col+dx,ny=row+dy,id=key(nx,ny);if(nx>=0&&nx<8&&ny>=0&&ny<5&&!walls.has(id)&&!seen.has(id)){seen.add(id);queue.push([nx,ny,steps+1]);}}}return 0;};
  // Carve one clearly different, guaranteed route per level. All other cells become walls.
  // This avoids the old random-wall fallback that could show the same board twice.
  const buildMaze=level=>{
    const minimum=Math.min(12+level*2,25);
    for(let attempt=0;attempt<180;attempt++){
      const path=[[0,0]],visited=new Set([key(0,0)]);
      const shuffle=items=>items.sort(()=>Math.random()-.5);
      const carve=(col,row)=>{
        if(col===7&&row===4)return true;
        const directions=shuffle([[1,0],[-1,0],[0,1],[0,-1]]);
        for(const [dx,dy] of directions){
          const nx=col+dx,ny=row+dy,id=key(nx,ny);
          if(nx<0||nx>7||ny<0||ny>4||visited.has(id))continue;
          visited.add(id);path.push([nx,ny]);
          if(carve(nx,ny))return true;
          path.pop();visited.delete(id);
        }
        return false;
      };
      if(carve(0,0)&&path.length-1>=minimum){
        const route=new Set(path.map(([col,row])=>key(col,row))),walls=new Set();
        for(let row=0;row<5;row++)for(let col=0;col<8;col++)if(!route.has(key(col,row)))walls.add(key(col,row));
        return walls;
      }
    }
    // A final safe fallback; normally unreachable because the route is carved above.
    return new Set(['1,0','1,1','3,1','4,1','6,1','1,3','2,3','4,3','6,3','6,4']);
  };
  const roundTime=level=>Math.max(1320,2700-(level-1)*210);
  let x=0,y=0,level=1,timer=roundTime(1),walls=buildMaze(1);
  function drawBoard(){const cell=70,startX=200,startY=95;for(let row=0;row<5;row++)for(let col=0;col<8;col++)rounded(startX+col*cell,startY+row*cell,cell-7,cell-7,8,walls.has(`${col},${row}`)?'#26324d':'#1b3654');rounded(startX+7*cell,startY+4*cell,cell-7,cell-7,8,'#e8bc55');rounded(startX+x*cell,startY+y*cell,cell-7,cell-7,8,'#6edcf0');text('EXIT',startX+7*cell+31,startY+4*cell+40,12,'#28314e','center');}
  gameState={move:(dx,dy)=>{const nx=x+dx,ny=y+dy;if(nx<0||nx>7||ny<0||ny>4||walls.has(`${nx},${ny}`))return;x=nx;y=ny;beep(420,.035);if(x===7&&y===4){level++;setScore(score+100);walls=buildMaze(level);x=0;y=0;timer=roundTime(level);}}};
  function loop(){if(!running)return;timer--;bg('#18354a','#0a1424');text(`LEVEL ${level}`,220,65,18,'#d6e6ff');text(`TIME ${Math.ceil(timer/60)}s`,740,65,18,'#f7dc89');drawBoard();if(timer<=0){endGame('Time out');return;}animation=requestAnimationFrame(loop);}loop();
}

function startDash(){
  const lanes=[300,480,660];let lane=1,moveCooldown=0,elapsed=0,spawn=75,obstacles=[];
  gameState={move:direction=>{if(moveCooldown)return;lane=Math.max(0,Math.min(2,lane+(direction==='left'?-1:1)));moveCooldown=12;beep(420,.035);}};
  function drawCar(x,y,color){rounded(x-34,y-27,68,54,13,color);rounded(x-20,y-20,40,19,7,'#d6f4ff');ctx.fillStyle='#101a35';ctx.fillRect(x-39,y-18,7,16);ctx.fillRect(x+32,y-18,7,16);ctx.fillRect(x-39,y+4,7,16);ctx.fillRect(x+32,y+4,7,16);}
  function loop(){if(!running)return;elapsed++;moveCooldown=Math.max(0,moveCooldown-1);const level=Math.floor(score/90),pace=Math.min(4.5,1.45+level*.22+elapsed*.0006);spawn--;if(spawn<=0){let target=Math.floor(Math.random()*3);if(obstacles.filter(item=>item.lane===target&&item.y<160).length)target=(target+1+Math.floor(Math.random()*2))%3;obstacles.push({lane:target,y:-70,color:['#ff77ab','#ffca62','#9b8cff'][Math.floor(Math.random()*3)]});spawn=Math.max(42,98-level*5-Math.floor(elapsed/520));}for(const item of obstacles)item.y+=pace;bg('#10234b','#080e25');for(let index=0;index<3;index++){rounded(lanes[index]-56,78,112,398,14,'#1d407b');ctx.strokeStyle='#7ea7e955';ctx.lineWidth=2;ctx.setLineDash([13,14]);ctx.beginPath();ctx.moveTo(lanes[index],88);ctx.lineTo(lanes[index],462);ctx.stroke();ctx.setLineDash([]);}for(const item of obstacles){drawCar(lanes[item.lane],item.y,item.color);if(item.lane===lane&&item.y>360&&item.y<450){endGame('Traffic caught you');return;}}obstacles=obstacles.filter(item=>item.y<600);drawCar(lanes[lane],414,'#65e4ff');text(`SURVIVE ${Math.floor(elapsed/60)}s`,40,62,18,'#d9ecff');text(`PACE ${pace.toFixed(1)}`,915,62,15,'#9ecaff','right');setScore(score+.12);animation=requestAnimationFrame(loop);}loop();
}

function startStack(){
  let stackX=330,stackWidth=300,stackY=430,blockX=170,blockWidth=190,blockY=98,direction=1,falling=false,levels=0,layers=[];
  gameState={drop:()=>{if(!falling){falling=true;beep(480,.05);}}};
  function loop(){if(!running)return;const speed=Math.min(3.05,1.7+levels*.12);if(!falling){blockX+=direction*speed;if(blockX<92||blockX+blockWidth>868){direction*=-1;blockX=Math.max(92,Math.min(868-blockWidth,blockX));}}else{blockY+=7;if(blockY+25>=stackY){const left=Math.max(blockX,stackX),right=Math.min(blockX+blockWidth,stackX+stackWidth),overlap=right-left;if(overlap<18){endGame('Stack slipped');return;}layers.push({x:left,y:stackY-25,w:overlap,color:levels%2?'#ff81bf':'#79e4dd'});stackX=left;stackWidth=overlap;stackY-=30;levels++;setScore(score+Math.round(18+overlap*.18));beep(620,.07);if(levels===11){endGame('Tower complete');return;}blockWidth=Math.max(42,stackWidth);blockX=direction>0?96:864-blockWidth;blockY=92;falling=false;direction*=-1;}}bg('#251449','#100b2a');for(let i=0;i<11;i++){ctx.fillStyle='#ffffff09';ctx.fillRect(0,90+i*34,960,1);}rounded(250,430,460,28,5,'#654aa9');layers.forEach(layer=>rounded(layer.x,layer.y,layer.w,25,5,layer.color));rounded(blockX,blockY,blockWidth,25,5,'#ffcf70');text(`LAYER ${levels+1} / 11`,40,62,18,'#f4d7ff');text(falling?'DROPPING':'SPACE TO DROP',915,62,15,falling?'#ffcf70':'#bcb0ff','right');setScore(score+.015);animation=requestAnimationFrame(loop);}loop();
}

// Faster, still controllable flight pace for Sky Skip.
function startSky(){
  let y=270,vy=0,world=0,gates=[],cleared=0,nextGate=2700;
  for(let i=1;i<=6;i++)gates.push({x:570+i*355,gap:160+Math.random()*205,half:108,passed:false});
  gameState={boost:()=>{vy=-4.45;beep(420,.035);}};
  function loop(){
    if(!running)return;
    world+=3.05+Math.min(cleared*.04,.45);vy+=.17;y+=vy;
    bg('#2062a3','#17244d');drawCloud(150-world*.06,110);drawCloud(720-world*.08,175);
    for(const gate of gates){const x=gate.x-world;if(x>-60&&x<1020){rounded(x,0,46,gate.gap-gate.half,12,'#8b6bff');rounded(x,gate.gap+gate.half,46,540-(gate.gap+gate.half),12,'#8b6bff');if(!gate.passed&&x<175){gate.passed=true;cleared++;setScore(score+30);beep(650,.06);}}if(x<150&&x+46>125&&(y<gate.gap-gate.half+8||y>gate.gap+gate.half-8)){endGame('Gate missed');return;}}
    gates=gates.filter(gate=>gate.x-world>-100);
    while(gates.length<6){nextGate=Math.max(nextGate,world+1280)+330+Math.random()*120;gates.push({x:nextGate,gap:150+Math.random()*235,half:Math.max(82,108-Math.floor(cleared/5)*3),passed:false});}
    ctx.save();ctx.translate(150,y);ctx.rotate(vy*.07);rounded(-25,-14,50,28,14,'#ff77bd');ctx.fillStyle='#fff3fa';ctx.beginPath();ctx.moveTo(-7,-8);ctx.lineTo(22,0);ctx.lineTo(-7,8);ctx.fill();ctx.restore();
    if(y<18||y>522){endGame('Out of bounds');return;}animation=requestAnimationFrame(loop);
  }loop();
}

// Memory games need readable beats even when the arcade runs at a faster pace.
function startEcho(){
  let sequence=[Math.floor(Math.random()*4),Math.floor(Math.random()*4),Math.floor(Math.random()*4)],phase='watch',frame=0,shown=-1,player=0,flash=-1,flashFrames=0;
  const pads=[[285,185],[525,185],[285,335],[525,335]];
  gameState={tap:(x,y)=>{
    if(phase!=='play')return;
    const hit=pads.findIndex(([px,py])=>x>=px&&x<=px+150&&y>=py&&y<=py+105);
    if(hit<0)return;
    flash=hit;flashFrames=12;
    if(hit!==sequence[player]){endGame('Sequence broken');return;}
    beep(520+hit*90,.08);player++;
    if(player===sequence.length){
      setScore(score+sequence.length*25);
      const nextLength=sequence.length+1;
      sequence=Array.from({length:nextLength},()=>Math.floor(Math.random()*4));
      phase='watch';frame=0;shown=-1;player=0;
    }
  }};
  function loop(){
    if(!running)return;frame++;flashFrames=Math.max(0,flashFrames-1);
    bg('#172149','#0d1329');
    if(phase==='watch'){
      const step=Math.floor(frame/72);
      if(step<sequence.length){flash=sequence[step];if(shown!==step){shown=step;beep(430+flash*75,.09);}}
      else if(frame>sequence.length*72+36){phase='play';flash=-1;}
    } else if(!flashFrames) flash=-1;
    text(phase==='watch'?'WATCH THE LIGHTS':'YOUR TURN · REPEAT THE PATTERN',480,95,19,'#dce8ff','center');
    text(`ROUND ${sequence.length-2}`,480,505,17,'#a9c4ff','center');drawEchoPads(flash);
    animation=requestAnimationFrame(loop);
  }loop();
}

// Endless tower: the camera shifts the completed stack down instead of ending at 11 layers.
function startStack(){
  let stackX=330,stackWidth=300,stackY=430,blockX=170,blockWidth=190,blockY=98,direction=1,falling=false,levels=0,layers=[];
  gameState={drop:()=>{if(!falling){falling=true;beep(480,.05);}}};
  function loop(){
    if(!running)return;
    const speed=Math.min(4.4,1.9+levels*.09);
    if(!falling){blockX+=direction*speed;if(blockX<92||blockX+blockWidth>868){direction*=-1;blockX=Math.max(92,Math.min(868-blockWidth,blockX));}}
    else {blockY+=8;if(blockY+25>=stackY){const left=Math.max(blockX,stackX),right=Math.min(blockX+blockWidth,stackX+stackWidth),overlap=right-left;if(overlap<18){endGame('Stack slipped');return;}layers.push({x:left,y:stackY-25,w:overlap,color:levels%2?'#ff81bf':'#79e4dd'});stackX=left;stackWidth=overlap;stackY-=30;levels++;if(stackY<155){layers.forEach(layer=>layer.y+=180);stackY+=180;}setScore(score+Math.round(18+overlap*.18));beep(620,.07);blockWidth=Math.max(42,stackWidth);blockX=direction>0?96:864-blockWidth;blockY=92;falling=false;direction*=-1;}}
    bg('#251449','#100b2a');for(let i=0;i<11;i++){ctx.fillStyle='#ffffff09';ctx.fillRect(0,90+i*34,960,1);}rounded(250,430,460,28,5,'#654aa9');layers.forEach(layer=>rounded(layer.x,layer.y,layer.w,25,5,layer.color));rounded(blockX,blockY,blockWidth,25,5,'#ffcf70');text(`LAYER ${levels+1}`,40,62,18,'#f4d7ff');text(falling?'DROPPING':'SPACE TO DROP',915,62,15,falling?'#ffcf70':'#bcb0ff','right');setScore(score+.015);animation=requestAnimationFrame(loop);
  }loop();
}

