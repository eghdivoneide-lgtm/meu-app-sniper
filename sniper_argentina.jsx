import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";

// ══════════════════════════════════════════════════════
// DADOS — Liga Profesional Argentina 2026 (Rodadas 1–11)
// ══════════════════════════════════════════════════════
const RAW = [
  ["Rodada 1","Tigre",2,0,"Estudiantes Rio Cuarto"],["Rodada 1","Argentinos Juniors",1,0,"Sarmiento Junin"],
  ["Rodada 1","Boca Juniors",1,0,"Dep. Riestra"],["Rodada 1","Rosario Central",1,2,"Belgrano"],
  ["Rodada 1","Gimnasia L.P.",2,1,"Racing Club"],["Rodada 1","Estudiantes Rio Cuarto",0,0,"Argentinos Juniors"],
  ["Rodada 1","Lanús",2,1,"Union Santa Fe"],["Rodada 1","Belgrano",1,1,"Tigre"],
  ["Rodada 1","Dep. Riestra",0,1,"Defensa y Justicia"],["Rodada 1","Estudiantes",2,1,"Boca Juniors"],
  ["Rodada 1","River Plate",2,0,"Gimnasia L.P."],["Rodada 1","Racing Club",1,2,"Rosario Central"],
  ["Rodada 1","Aldosivi",0,0,"Barracas Central"],["Rodada 1","Atl. Tucuman",0,0,"Central Córdoba"],
  ["Rodada 1","Newell's Old Boys",1,1,"Independiente"],
  ["Rodada 2","Gimnasia L.P.",3,1,"Aldosivi"],["Rodada 2","Rosario Central",0,0,"River Plate"],
  ["Rodada 2","Boca Juniors",2,0,"Newell's Old Boys"],["Rodada 2","Barracas Central",1,1,"Dep. Riestra"],
  ["Rodada 2","Talleres Córdoba",1,2,"Platense"],["Rodada 2","Atl. Tucuman",1,1,"Huracán"],
  ["Rodada 2","Independiente",1,1,"Vélez Sarsfield"],["Rodada 2","San Lorenzo",1,0,"Central Córdoba"],
  ["Rodada 2","Sarmiento Junin",1,0,"Banfield"],["Rodada 2","Aldosivi",1,1,"Rosario Central"],
  ["Rodada 2","Central Córdoba",1,0,"Union Santa Fe"],
  ["Rodada 3","Instituto",2,2,"Lanús"],["Rodada 3","Ind. Rivadavia",2,1,"Sarmiento Junin"],
  ["Rodada 3","Banfield",2,1,"Estudiantes Rio Cuarto"],["Rodada 3","Union Santa Fe",4,0,"Gimnasia Mendoza"],
  ["Rodada 3","Argentinos Juniors",0,0,"Belgrano"],["Rodada 3","Defensa y Justicia",0,0,"Estudiantes"],
  ["Rodada 3","Tigre",3,1,"Racing Club"],["Rodada 3","Barracas Central",2,0,"Gimnasia L.P."],
  ["Rodada 3","Gimnasia Mendoza",1,0,"Instituto"],["Rodada 3","Vélez Sarsfield",2,1,"Boca Juniors"],
  ["Rodada 3","Huracán",1,0,"San Lorenzo"],["Rodada 3","Platense",0,1,"Independiente"],
  ["Rodada 3","Sarmiento Junin",2,1,"Atl. Tucuman"],["Rodada 3","Newell's Old Boys",2,3,"Defensa y Justicia"],
  ["Rodada 3","Belgrano",1,0,"Banfield"],["Rodada 3","River Plate",1,4,"Tigre"],
  ["Rodada 3","Racing Club",2,1,"Argentinos Juniors"],
  ["Rodada 4","Banfield",0,2,"Racing Club"],["Rodada 4","Defensa y Justicia",1,1,"Vélez Sarsfield"],
  ["Rodada 4","Union Santa Fe",0,0,"San Lorenzo"],["Rodada 4","Independiente",2,0,"Lanús"],
  ["Rodada 4","Argentinos Juniors",1,0,"River Plate"],["Rodada 4","Tigre",1,0,"Aldosivi"],
  ["Rodada 4","Estudiantes Rio Cuarto",0,1,"Ind. Rivadavia"],["Rodada 4","Lanús",1,1,"Talleres Córdoba"],
  ["Rodada 4","Estudiantes",1,0,"Dep. Riestra"],
  ["Rodada 5","Dep. Riestra",1,1,"Newell's Old Boys"],["Rodada 5","Instituto",2,0,"Central Córdoba"],
  ["Rodada 5","Rosario Central",2,0,"Barracas Central"],["Rodada 5","Boca Juniors",0,0,"Platense"],
  ["Rodada 5","Gimnasia L.P.",0,0,"Estudiantes"],["Rodada 5","Ind. Rivadavia",0,1,"Belgrano"],
  ["Rodada 5","Atl. Tucuman",4,0,"Estudiantes Rio Cuarto"],["Rodada 5","Talleres Córdoba",2,1,"Gimnasia Mendoza"],
  ["Rodada 5","Huracán",1,0,"Sarmiento Junin"],["Rodada 5","Dep. Riestra",0,0,"Huracán"],
  ["Rodada 5","Banfield",3,0,"Newell's Old Boys"],["Rodada 5","Platense",1,0,"Barracas Central"],
  ["Rodada 5","Ind. Rivadavia",3,2,"Independiente"],["Rodada 5","Rosario Central",0,1,"Talleres Córdoba"],
  ["Rodada 5","Gimnasia Mendoza",0,1,"Gimnasia L.P."],["Rodada 5","Boca Juniors",0,0,"Racing Club"],
  ["Rodada 5","Instituto",2,1,"Atl. Tucuman"],["Rodada 5","Estudiantes",1,0,"Sarmiento Junin"],
  ["Rodada 5","Defensa y Justicia",1,1,"Belgrano"],
  ["Rodada 6","Boca Juniors",1,1,"Gimnasia Mendoza"],["Rodada 6","Union Santa Fe",1,0,"Aldosivi"],
  ["Rodada 6","Vélez Sarsfield",1,0,"River Plate"],["Rodada 6","San Lorenzo",2,0,"Estudiantes Rio Cuarto"],
  ["Rodada 6","Central Córdoba",0,0,"Tigre"],["Rodada 6","Gimnasia Mendoza",1,1,"Independiente"],
  ["Rodada 6","Belgrano",3,1,"Atl. Tucuman"],["Rodada 6","Central Córdoba",2,0,"Talleres Córdoba"],
  ["Rodada 6","San Lorenzo",1,1,"Instituto"],["Rodada 6","Platense",0,0,"Defensa y Justicia"],
  ["Rodada 7","Estudiantes Rio Cuarto",2,0,"Huracán"],["Rodada 7","River Plate",3,1,"Banfield"],
  ["Rodada 7","Sarmiento Junin",1,3,"Union Santa Fe"],["Rodada 7","Racing Club",1,1,"Ind. Rivadavia"],
  ["Rodada 7","Vélez Sarsfield",0,0,"Dep. Riestra"],["Rodada 7","Newell's Old Boys",0,2,"Estudiantes"],
  ["Rodada 7","Barracas Central",2,1,"Tigre"],["Rodada 7","Gimnasia L.P.",1,2,"Rosario Central"],
  ["Rodada 7","Lanús",0,3,"Boca Juniors"],["Rodada 7","Ind. Rivadavia",1,1,"River Plate"],
  ["Rodada 7","Estudiantes",0,1,"Vélez Sarsfield"],["Rodada 7","Dep. Riestra",0,0,"Platense"],
  ["Rodada 7","Defensa y Justicia",1,1,"Lanús"],["Rodada 7","Tigre",2,2,"Gimnasia L.P."],
  ["Rodada 7","Instituto",1,2,"Union Santa Fe"],["Rodada 7","Argentinos Juniors",1,1,"Barracas Central"],
  ["Rodada 7","Newell's Old Boys",0,2,"Rosario Central"],["Rodada 7","Talleres Córdoba",0,0,"San Lorenzo"],
  ["Rodada 7","Independiente",2,0,"Central Córdoba"],
  ["Rodada 8","Sarmiento Junin",0,0,"Racing Club"],["Rodada 8","Tigre",1,1,"Vélez Sarsfield"],
  ["Rodada 8","Independiente",4,4,"Union Santa Fe"],["Rodada 8","Atl. Tucuman",0,3,"Racing Club"],
  ["Rodada 8","Huracán",3,1,"Belgrano"],["Rodada 8","Sarmiento Junin",1,0,"Estudiantes Rio Cuarto"],
  ["Rodada 8","Banfield",2,0,"Aldosivi"],
  ["Rodada 9","Union Santa Fe",1,1,"Boca Juniors"],["Rodada 9","Tigre",1,1,"Argentinos Juniors"],
  ["Rodada 9","River Plate",2,0,"Sarmiento Junin"],["Rodada 9","Belgrano",0,0,"Talleres Córdoba"],
  ["Rodada 9","Gimnasia L.P.",2,3,"Ind. Rivadavia"],["Rodada 9","Rosario Central",2,1,"Banfield"],
  ["Rodada 9","Platense",0,2,"Vélez Sarsfield"],["Rodada 9","Talleres Córdoba",2,0,"Instituto"],
  ["Rodada 9","Estudiantes Rio Cuarto",0,1,"Belgrano"],["Rodada 9","Dep. Riestra",0,0,"Gimnasia Mendoza"],
  ["Rodada 9","Defensa y Justicia",1,1,"Central Córdoba"],["Rodada 9","Ind. Rivadavia",1,2,"Barracas Central"],
  ["Rodada 9","Atl. Tucuman",1,1,"Aldosivi"],["Rodada 9","Boca Juniors",1,1,"San Lorenzo"],
  ["Rodada 9","Argentinos Juniors",0,0,"Rosario Central"],["Rodada 9","Banfield",1,2,"Gimnasia L.P."],
  ["Rodada 9","Newell's Old Boys",1,1,"Platense"],
  ["Rodada 10","Atl. Tucuman",1,0,"Gimnasia L.P."],["Rodada 10","Estudiantes",0,1,"Lanús"],
  ["Rodada 10","Huracán",1,2,"River Plate"],
  ["Rodada 11","Banfield",1,0,"Tigre"],["Rodada 11","Central Córdoba",1,0,"Dep. Riestra"],
  ["Rodada 11","Gimnasia Mendoza",1,2,"Estudiantes"],["Rodada 11","Lanús",5,0,"Newell's Old Boys"],
  ["Rodada 11","Instituto",2,1,"Independiente"],["Rodada 11","Racing Club",2,0,"Estudiantes Rio Cuarto"],
  ["Rodada 11","San Lorenzo",2,5,"Defensa y Justicia"],["Rodada 11","Aldosivi",0,0,"Huracán"],
  ["Rodada 11","Barracas Central",2,1,"Atl. Tucuman"],
];

const ROUNDS = ["Rodada 1","Rodada 2","Rodada 3","Rodada 4","Rodada 5","Rodada 6","Rodada 7","Rodada 8","Rodada 9","Rodada 10","Rodada 11"];
const TEAM_COLORS = ["#38bdf8","#34d399","#f59e0b","#f87171","#a78bfa","#fb923c","#4ade80","#60a5fa","#e879f9","#facc15","#2dd4bf","#fb7185","#818cf8","#a3e635","#94a3b8"];

// ══════════════════════════════════════════════════════
// MATH — POISSON
// ══════════════════════════════════════════════════════
function poissonPMF(k, lam) {
  if (lam <= 0) return k === 0 ? 1 : 0;
  let log = -lam + k * Math.log(lam);
  for (let i = 1; i <= k; i++) log -= Math.log(i);
  return Math.exp(log);
}
function poissonSample(lam) {
  const L = Math.exp(-lam); let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}
function buildPoissonData(matches) {
  const t = {}; let tH = 0, tA = 0, n = 0;
  matches.forEach(([, home, gH, gV, away]) => {
    [home, away].forEach(nm => { if (!t[nm]) t[nm] = { hG:0,hGC:0,hN:0,aG:0,aGC:0,aN:0 }; });
    t[home].hG+=gH; t[home].hGC+=gV; t[home].hN++;
    t[away].aG+=gV; t[away].aGC+=gH; t[away].aN++;
    tH+=gH; tA+=gV; n++;
  });
  const avgH = tH/n, avgA = tA/n;
  const s = {};
  Object.entries(t).forEach(([nm, v]) => {
    const hN=v.hN||1, aN=v.aN||1;
    s[nm] = { attH:(v.hG/hN)/avgH, defH:(v.hGC/hN)/avgA, attA:(v.aG/aN)/avgA, defA:(v.aGC/aN)/avgH };
  });
  return { s, avgH, avgA };
}
function projectMatch(home, away, pd) {
  const { s, avgH, avgA } = pd;
  if (!s[home]||!s[away]) return null;
  const lH = s[home].attH * s[away].defA * avgH;
  const lA = s[away].attA * s[home].defH * avgA;
  const MAX = 7;
  const matrix = Array.from({length:MAX+1}, (_,i) => Array.from({length:MAX+1}, (_,j) => poissonPMF(i,lH)*poissonPMF(j,lA)));
  let win=0,draw=0,loss=0,o15=0,o25=0,o35=0,btts=0;
  const scores = [];
  for (let i=0;i<=MAX;i++) for (let j=0;j<=MAX;j++) {
    const p = matrix[i][j];
    if (i>j) win+=p; else if(i===j) draw+=p; else loss+=p;
    if (i+j>1.5) o15+=p; if (i+j>2.5) o25+=p; if (i+j>3.5) o35+=p;
    if (i>0&&j>0) btts+=p;
    scores.push({score:`${i}×${j}`,prob:p});
  }
  scores.sort((a,b)=>b.prob-a.prob);
  // Asian Handicap −0.5, −1 (home fav), +0.5, +1
  let ah_h05=0, ah_h1=0, ah_a05=0, ah_a1=0;
  for (let i=0;i<=MAX;i++) for (let j=0;j<=MAX;j++) {
    const p = matrix[i][j];
    if (i>j) ah_h05+=p;                    // Home -0.5: home wins
    if (i-j>=2) ah_h1+=p;                  // Home -1: home wins by 2+
    if (i-j===1) ah_h1+=p*0.5;             // Home -1: push half
    if (i>=j) ah_a05+=p;                    // Away +0.5: away wins or draw
    if (j-i>=-1) ah_a1+=p;                 // Away +1: away wins, draw, or lose by 1
  }
  return { lH, lA, win, draw, loss, o15, o25, o35, btts, ah_h05, ah_h1, ah_a05, ah_a1, top5:scores.slice(0,5), matrix };
}

// ══════════════════════════════════════════════════════
// MONTE CARLO SIMULATION
// ══════════════════════════════════════════════════════
function runMonteCarlo(stats, pd, nSims=1500) {
  const TOTAL = 38, PLAYED = 11, REM = TOTAL - PLAYED;
  const res = {};
  stats.forEach(t => res[t.name]={ch:0,lib:0,sul:0,rel:0});
  for (let sim=0; sim<nSims; sim++) {
    const pts = {};
    stats.forEach(t => { pts[t.name] = t.Pts; });
    const teams = stats.map(t=>t.name);
    for (let r=0; r<REM; r++) {
      const shuffled = [...teams].sort(()=>Math.random()-0.5);
      for (let i=0; i<shuffled.length-1; i+=2) {
        const h=shuffled[i], a=shuffled[i+1];
        const proj = projectMatch(h,a,pd);
        if (!proj) continue;
        const gH=poissonSample(proj.lH), gA=poissonSample(proj.lA);
        if (gH>gA) pts[h]+=3; else if(gH===gA){pts[h]+=1;pts[a]+=1;} else pts[a]+=3;
      }
    }
    const ranked = Object.entries(pts).sort((a,b)=>b[1]-a[1]).map(([n])=>n);
    ranked.forEach((n,i)=>{
      if(i===0) res[n].ch++;
      if(i<4) res[n].lib++;
      if(i<8) res[n].sul++;
      if(i>=ranked.length-4) res[n].rel++;
    });
  }
  return stats.map(t=>({
    name:t.name, Pts:t.Pts, P:t.P,
    ppg: t.P ? (t.Pts/t.P).toFixed(2) : "0.00",
    projPts: Math.round(t.P ? t.Pts/t.P*TOTAL : 0),
    ch: (res[t.name].ch/nSims*100).toFixed(1),
    lib: (res[t.name].lib/nSims*100).toFixed(1),
    sul: (res[t.name].sul/nSims*100).toFixed(1),
    rel: (res[t.name].rel/nSims*100).toFixed(1),
  })).sort((a,b)=>parseFloat(b.lib)-parseFloat(a.lib));
}

// ══════════════════════════════════════════════════════
// STATS POR TIME
// ══════════════════════════════════════════════════════
const W5 = [0.08,0.12,0.17,0.25,0.38];
function buildStats(matches) {
  const T = {};
  const ens = n => { if(!T[n]) T[n]={name:n,P:0,W:0,D:0,L:0,GF:0,GA:0,hP:0,hW:0,hD:0,hL:0,hGF:0,hGA:0,aP:0,aW:0,aD:0,aL:0,aGF:0,aGA:0,o15:0,o25:0,o35:0,btts:0,clean:0,history:[]}; };
  matches.forEach(([rod, home, gH, gV, away]) => {
    ens(home); ens(away);
    const rH=gH>gV?"V":gH===gV?"E":"D", rA=gV>gH?"V":gH===gV?"E":"D";
    const tot=gH+gV;
    [home,away].forEach(nm=>{
      T[nm].P++; T[nm].o15+=tot>1.5?1:0; T[nm].o25+=tot>2.5?1:0; T[nm].o35+=tot>3.5?1:0;
      T[nm].btts+=(gH>0&&gV>0)?1:0;
    });
    T[home].GF+=gH; T[home].GA+=gV; T[home].hP++; T[home].hGF+=gH; T[home].hGA+=gV;
    T[away].GF+=gV; T[away].GA+=gH; T[away].aP++; T[away].aGF+=gV; T[away].aGA+=gH;
    if(gH>gV){T[home].W++;T[home].hW++;T[away].L++;T[away].aL++;}
    else if(gH===gV){T[home].D++;T[home].hD++;T[away].D++;T[away].aD++;}
    else{T[home].L++;T[home].hL++;T[away].W++;T[away].aW++;}
    if(gV===0) T[home].clean++;
    if(gH===0) T[away].clean++;
    T[home].history.push({r:rH,gf:gH,ga:gV,opp:away,rod,home:true});
    T[away].history.push({r:rA,gf:gV,ga:gH,opp:home,rod,home:false});
  });
  return Object.values(T).map(t=>{
    const l5=t.history.slice(-5);
    const mom=l5.reduce((a,h,i)=>a+(h.r==="V"?3*W5[i]:h.r==="E"?W5[i]:0),0)/3*100;
    const winPct=t.P?(t.W/t.P)*100:0;
    const gdN=Math.max(0,Math.min(100,50+((t.GF-t.GA)/Math.max(t.P,1))*20));
    const homeDom=t.hP?(t.hW/t.hP)*100:0;
    const sniper=Math.round(winPct*0.30+mom*0.35+gdN*0.20+homeDom*0.15);
    let unb=0; for(let i=t.history.length-1;i>=0&&t.history[i].r!=="D";i--) unb++;
    let wstrk=0; for(let i=t.history.length-1;i>=0&&t.history[i].r==="V";i--) wstrk++;
    let scstrk=0; for(let i=t.history.length-1;i>=0&&t.history[i].gf>0;i--) scstrk++;
    let noWin=0; for(let i=t.history.length-1;i>=0&&t.history[i].r!=="V";i--) noWin++;
    return {
      ...t, Pts:t.W*3+t.D, GD:t.GF-t.GA,
      form:l5.map(h=>h.r).join(""),
      momentum:Math.round(mom),
      sniper, unb, wstrk, scstrk, noWin,
      avgGF:t.P?(t.GF/t.P).toFixed(2):"0.00",
      avgGA:t.P?(t.GA/t.P).toFixed(2):"0.00",
      avgTot:t.P?((t.GF+t.GA)/t.P).toFixed(2):"0.00",
      pO15:t.P?Math.round(t.o15/t.P*100):0,
      pO25:t.P?Math.round(t.o25/t.P*100):0,
      pO35:t.P?Math.round(t.o35/t.P*100):0,
      pBTTS:t.P?Math.round(t.btts/t.P*100):0,
      pClean:t.P?Math.round(t.clean/t.P*100):0,
    };
  });
}

// ══════════════════════════════════════════════════════
// CHART DATA BUILDERS
// ══════════════════════════════════════════════════════
function buildRoundEvolution(matches, topTeams) {
  const pts = {}; topTeams.forEach(t=>pts[t]=0);
  return ROUNDS.map(rod => {
    matches.filter(m=>m[0]===rod).forEach(([,home,gH,gV,away])=>{
      if(pts[home]!==undefined||pts[away]!==undefined){
        if(gH>gV){if(pts[home]!==undefined)pts[home]+=3;}
        else if(gH===gV){if(pts[home]!==undefined)pts[home]+=1;if(pts[away]!==undefined)pts[away]+=1;}
        else{if(pts[away]!==undefined)pts[away]+=3;}
      }
    });
    const snap = { round: rod.replace("Rodada ","R") };
    topTeams.forEach(t=>snap[t]=pts[t]);
    return snap;
  });
}
function buildGoalsPerRound(matches) {
  return ROUNDS.map(rod=>{
    const ms=matches.filter(m=>m[0]===rod);
    const goals=ms.reduce((s,m)=>s+m[2]+m[3],0);
    return { round:rod.replace("Rodada ","R"), goals, avg:ms.length?(goals/ms.length).toFixed(1):0, jogos:ms.length };
  });
}
function buildScoreDistribution(matches) {
  const d={};
  matches.forEach(([,, gH, gV])=>{ const k=`${gH}×${gV}`; d[k]=(d[k]||0)+1; });
  return Object.entries(d).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([score,cnt])=>({score,cnt}));
}
function buildRadarData(team) {
  if (!team) return [];
  const maxGF=2.5, maxMom=100, maxWin=100, maxOver=80, maxDef=100;
  return [
    {subject:"Ataque",value:Math.min(100,parseFloat(team.avgGF)/maxGF*100)},
    {subject:"Defesa",value:Math.max(0,100-parseFloat(team.avgGA)/2*100)},
    {subject:"Forma",value:team.momentum},
    {subject:"Vitórias",value:team.P?team.W/team.P*100:0},
    {subject:"Over 2.5",value:team.pO25},
    {subject:"CS",value:team.pClean},
  ];
}

// ══════════════════════════════════════════════════════
// COMPONENTES VISUAIS
// ══════════════════════════════════════════════════════
const FC={V:"bg-green-500 text-white",E:"bg-yellow-400 text-gray-900",D:"bg-red-600 text-white"};
function Chip({r}){return<span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${FC[r]}`}>{r}</span>;}
function Bar({pct,color="bg-sky-500"}){return<div className="w-full bg-gray-800 rounded-full h-1.5"><div className={`${color} h-1.5 rounded-full`} style={{width:`${Math.min(100,pct)}%`}}/></div>;}
function StatCard({icon,label,value,sub,color="text-sky-300"}){
  return<div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
    <div className="text-2xl mb-1">{icon}</div>
    <div className={`text-xl font-extrabold ${color}`}>{value}</div>
    <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    {sub&&<div className="text-xs text-gray-700 mt-0.5">{sub}</div>}
  </div>;
}
function ProbBar({label,value,color}){
  return<div className="flex items-center gap-2 text-sm">
    <span className="text-gray-400 w-36 text-right text-xs">{label}</span>
    <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden">
      <div className={`${color} h-4 rounded-full flex items-center justify-end pr-1`} style={{width:`${Math.max(4,value*100)}%`}}>
        <span className="text-white text-xs font-bold">{(value*100).toFixed(1)}%</span>
      </div>
    </div>
  </div>;
}
function SniperBadge({score}){
  const cl=score>=75?"bg-green-600 text-white":score>=55?"bg-yellow-600 text-white":score>=40?"bg-orange-700 text-white":"bg-red-800 text-white";
  const label=score>=75?"FORTE":score>=55?"MÉDIO":score>=40?"FRACO":"RISCO";
  return<span className={`text-xs font-black px-2 py-0.5 rounded-full ${cl}`}>{label} {score}</span>;
}

// ══════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════
const TABS=[
  {id:"cls",label:"📊 Classificação"},{id:"cf",label:"🏠 Casa/Fora"},
  {id:"forma",label:"🔥 Forma"},{id:"charts",label:"📈 Gráficos"},
  {id:"gols",label:"⚽ Over/BTTS"},{id:"poi",label:"🎯 Poisson"},
  {id:"ev",label:"💰 EV Calculator"},{id:"mc",label:"🎲 Simulação"},
  {id:"sniper",label:"🏆 Sniper"},
];

export default function App(){
  const [tab,setTab]=useState("cls");
  const [sortBy,setSortBy]=useState("Pts");
  const [search,setSearch]=useState("");
  const [chartTab,setChartTab]=useState("evo");
  const [radarTeam,setRadarTeam]=useState("River Plate");
  const [poiH,setPoiH]=useState("River Plate");
  const [poiA,setPoiA]=useState("Boca Juniors");
  const [evH,setEvH]=useState("River Plate");
  const [evA,setEvA]=useState("Boca Juniors");
  const [evOdds,setEvOdds]=useState({o1:"",oX:"",o2:"",oO15:"",oO25:"",oO35:"",oU25:"",oBTTS:"",oAH_h:"",oAH_a:""});
  const [mcRun,setMcRun]=useState(false);
  const [mcData,setMcData]=useState(null);

  const stats=useMemo(()=>buildStats(RAW),[]);
  const pd=useMemo(()=>buildPoissonData(RAW),[]);
  const allTeams=useMemo(()=>stats.map(t=>t.name).sort(),[stats]);
  const top8=useMemo(()=>[...stats].sort((a,b)=>b.Pts-a.Pts||b.GD-a.GD).slice(0,8).map(t=>t.name),[stats]);

  const sorted=useMemo(()=>{
    let list=[...stats];
    if(search) list=list.filter(t=>t.name.toLowerCase().includes(search.toLowerCase()));
    if(sortBy==="Pts") list.sort((a,b)=>b.Pts-a.Pts||b.GD-a.GD||b.GF-a.GF);
    else if(sortBy==="Gols") list.sort((a,b)=>parseFloat(b.avgTot)-parseFloat(a.avgTot));
    else if(sortBy==="Over") list.sort((a,b)=>b.pO25-a.pO25);
    else if(sortBy==="BTTS") list.sort((a,b)=>b.pBTTS-a.pBTTS);
    else if(sortBy==="Momentum") list.sort((a,b)=>b.momentum-a.momentum);
    else if(sortBy==="Sniper") list.sort((a,b)=>b.sniper-a.sniper);
    return list;
  },[stats,sortBy,search]);

  const poiResult=useMemo(()=>projectMatch(poiH,poiA,pd),[poiH,poiA,pd]);
  const evResult=useMemo(()=>projectMatch(evH,evA,pd),[evH,evA,pd]);
  const h2hPoi=useMemo(()=>RAW.filter(([,h,,, a])=>(h===poiH&&a===poiA)||(h===poiA&&a===poiH)),[poiH,poiA]);
  const h2hEV=useMemo(()=>RAW.filter(([,h,,,a])=>(h===evH&&a===evA)||(h===evA&&a===evH)),[evH,evA]);

  const evoData=useMemo(()=>buildRoundEvolution(RAW,top8),[top8]);
  const goalsData=useMemo(()=>buildGoalsPerRound(RAW),[]);
  const scoreDist=useMemo(()=>buildScoreDistribution(RAW),[]);
  const radarData=useMemo(()=>buildRadarData(stats.find(t=>t.name===radarTeam)),[stats,radarTeam]);

  const leagueG=useMemo(()=>{
    const n=RAW.length, g=RAW.reduce((s,m)=>s+m[2]+m[3],0);
    return {n,g,avgG:(g/n).toFixed(2),o25:RAW.filter(m=>m[2]+m[3]>2.5).length,btts:RAW.filter(m=>m[2]>0&&m[3]>0).length,draw:RAW.filter(m=>m[2]===m[3]).length,zz:RAW.filter(m=>m[2]===0&&m[3]===0).length};
  },[]);

  const evAnalysis=useMemo(()=>{
    if(!evResult) return null;
    const p=v=>{ const n=parseFloat(v); return n>1?n:null; };
    return [
      {label:"1 — Vitória Mandante",odd:p(evOdds.o1),est:evResult.win},
      {label:"X — Empate",odd:p(evOdds.oX),est:evResult.draw},
      {label:"2 — Vitória Visitante",odd:p(evOdds.o2),est:evResult.loss},
      {label:"Over 1.5",odd:p(evOdds.oO15),est:evResult.o15},
      {label:"Over 2.5",odd:p(evOdds.oO25),est:evResult.o25},
      {label:"Over 3.5",odd:p(evOdds.oO35),est:evResult.o35},
      {label:"Under 2.5",odd:p(evOdds.oU25),est:1-evResult.o25},
      {label:"BTTS (Ambas Marcam)",odd:p(evOdds.oBTTS),est:evResult.btts},
      {label:"Handicap −0.5 (Mandante)",odd:p(evOdds.oAH_h),est:evResult.ah_h05},
      {label:"Handicap +0.5 (Visitante)",odd:p(evOdds.oAH_a),est:evResult.ah_a05},
    ].map(it=>{
      if(!it.odd) return {...it,imp:null,ev:null,valor:false};
      const imp=1/it.odd;
      return {...it,imp,ev:(it.est-imp)*100,valor:it.est>imp};
    });
  },[evResult,evOdds]);

  const topSniper=useMemo(()=>[...stats].sort((a,b)=>b.sniper-a.sniper).slice(0,10),[stats]);

  const handleMC=()=>{
    setMcRun(true);
    setTimeout(()=>{ setMcData(runMonteCarlo(stats,pd,1500)); setMcRun(false); },50);
  };

  const TH="px-3 py-2.5 text-center text-xs uppercase tracking-wider text-gray-500 font-semibold";
  const TD="px-3 py-2.5 text-center text-sm";

  return(
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-950 via-sky-900 to-indigo-950 border-b border-sky-900/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <span className="text-5xl">🇦🇷</span>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Liga Profesional Argentina 2026</h1>
            <p className="text-sky-400 text-xs mt-0.5">
              Sniper Analytics v3.0 · Poisson · Monte Carlo · EV · Handicap · {stats.length} times · {RAW.length} jogos · R1–R11
            </p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-2 flex overflow-x-auto">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`px-3 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${tab===t.id?"border-sky-400 text-sky-300 bg-gray-800/60":"border-transparent text-gray-500 hover:text-white"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">

        {/* ═══ CLASSIFICAÇÃO ═══ */}
        {tab==="cls"&&(
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Buscar time..."
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-sky-500 w-44"/>
              <div className="flex gap-1 flex-wrap">
                {["Pts","Gols","Over","BTTS","Momentum","Sniper"].map(s=>(
                  <button key={s} onClick={()=>setSortBy(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${sortBy===s?"bg-sky-700 border-sky-600 text-white":"bg-gray-900 border-gray-700 text-gray-400 hover:text-white"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-900/80">
                    {["#","Time","PJ","V","E","D","GP","GC","SG","PTS","Forma","Momentum","Over 2.5","BTTS","Sniper"].map(h=>(
                      <th key={h} className={`${TH} ${h==="Time"||h==="#"?"text-left":""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((t,i)=>(
                    <tr key={t.name} className={`border-t border-gray-800/60 hover:bg-gray-800/30 transition-colors ${i<4?"border-l-2 border-l-sky-500":i<8?"border-l-2 border-l-green-600":"border-l-2 border-l-transparent"}`}>
                      <td className="px-3 py-2.5 text-gray-600 text-xs font-mono">{i+1}</td>
                      <td className="px-3 py-2.5 font-semibold text-white whitespace-nowrap text-sm">{t.name}</td>
                      <td className={TD+" text-gray-500"}>{t.P}</td>
                      <td className={TD+" text-green-400 font-bold"}>{t.W}</td>
                      <td className={TD+" text-yellow-400"}>{t.D}</td>
                      <td className={TD+" text-red-400"}>{t.L}</td>
                      <td className={TD}>{t.GF}</td>
                      <td className={TD}>{t.GA}</td>
                      <td className={TD+` font-semibold ${t.GD>0?"text-green-400":t.GD<0?"text-red-400":"text-gray-500"}`}>{t.GD>0?`+${t.GD}`:t.GD}</td>
                      <td className={TD}><span className="bg-blue-800 text-white font-black px-2 py-0.5 rounded-lg text-sm">{t.Pts}</span></td>
                      <td className="px-2 py-2.5"><div className="flex gap-0.5 justify-center">{t.form.split("").map((r,idx)=><Chip key={idx} r={r}/>)}{[...Array(5-t.form.length)].map((_,idx)=><span key={idx} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-gray-600 text-xs">–</span>)}</div></td>
                      <td className={TD}><div className="flex flex-col gap-0.5 items-center w-16"><span className={`text-xs font-bold ${t.momentum>=70?"text-green-400":t.momentum>=45?"text-yellow-400":"text-red-400"}`}>{t.momentum}%</span><Bar pct={t.momentum} color={t.momentum>=70?"bg-green-500":t.momentum>=45?"bg-yellow-500":"bg-red-500"}/></div></td>
                      <td className={TD+` font-bold ${t.pO25>=60?"text-green-400":t.pO25>=40?"text-yellow-400":"text-red-400"}`}>{t.pO25}%</td>
                      <td className={TD+` font-bold ${t.pBTTS>=60?"text-green-400":t.pBTTS>=40?"text-yellow-400":"text-red-400"}`}>{t.pBTTS}%</td>
                      <td className={TD}><SniperBadge score={t.sniper}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-700">
              <span><span className="inline-block w-2 h-4 bg-sky-500 rounded mr-1 align-middle"></span>Libertadores (1–4)</span>
              <span><span className="inline-block w-2 h-4 bg-green-600 rounded mr-1 align-middle ml-2"></span>Sul-Americana (5–8)</span>
            </div>
          </div>
        )}

        {/* ═══ CASA vs FORA ═══ */}
        {tab==="cf"&&(
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {[{title:"🏠 Desempenho em Casa",key:"h"},{title:"✈️ Desempenho Fora",key:"a"}].map(({title,key})=>(
                <div key={key}>
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{title}</h2>
                  <div className="overflow-x-auto rounded-xl border border-gray-800">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-gray-900/80">
                        {["#","Time","PJ","V","E","D","GP","GC","SG","PTS","Méd. GM"].map(h=><th key={h} className={`${TH} ${h==="Time"||h==="#"?"text-left":""}`}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {[...stats].sort((a,b)=>{
                          const pA=key==="h"?a.hW*3+a.hD:a.aW*3+a.aD;
                          const pB=key==="h"?b.hW*3+b.hD:b.aW*3+b.aD;
                          return pB-pA;
                        }).map((t,i)=>{
                          const pj=key==="h"?t.hP:t.aP, w=key==="h"?t.hW:t.aW, d=key==="h"?t.hD:t.aD, l=key==="h"?t.hL:t.aL;
                          const gf=key==="h"?t.hGF:t.aGF, ga=key==="h"?t.hGA:t.aGA;
                          const pts=w*3+d, avg=pj?(gf/pj).toFixed(2):"0.00";
                          return(
                            <tr key={t.name} className="border-t border-gray-800/60 hover:bg-gray-800/30">
                              <td className="px-3 py-2 text-gray-600 text-xs">{i+1}</td>
                              <td className="px-3 py-2 font-semibold text-white whitespace-nowrap text-xs">{t.name}</td>
                              <td className={TD+" text-gray-500"}>{pj}</td>
                              <td className={TD+" text-green-400 font-bold"}>{w}</td>
                              <td className={TD+" text-yellow-400"}>{d}</td>
                              <td className={TD+" text-red-400"}>{l}</td>
                              <td className={TD}>{gf}</td>
                              <td className={TD}>{ga}</td>
                              <td className={TD+` font-semibold ${gf-ga>0?"text-green-400":gf-ga<0?"text-red-400":"text-gray-500"}`}>{gf-ga>0?`+${gf-ga}`:gf-ga}</td>
                              <td className={TD}><span className="bg-blue-800 text-white font-black px-2 py-0.5 rounded text-xs">{pts}</span></td>
                              <td className={TD+" text-green-400 font-semibold"}>{avg}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
            {/* Diferença Casa/Fora */}
            <div>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">⚡ Diferença Casa vs Fora (PPG)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {[...stats].sort((a,b)=>{
                  const dA=(a.hP?(a.hW*3+a.hD)/a.hP:0)-(a.aP?(a.aW*3+a.aD)/a.aP:0);
                  const dB=(b.hP?(b.hW*3+b.hD)/b.hP:0)-(b.aP?(b.aW*3+b.aD)/b.aP:0);
                  return Math.abs(dB)-Math.abs(dA);
                }).slice(0,12).map(t=>{
                  const ppgH=t.hP?(t.hW*3+t.hD)/t.hP:0, ppgA=t.aP?(t.aW*3+t.aD)/t.aP:0, diff=ppgH-ppgA;
                  return(
                    <div key={t.name} className="bg-gray-900 rounded-xl p-3 border border-gray-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm text-white">{t.name}</span>
                        <span className={`font-black text-sm ${diff>0.5?"text-green-400":diff<-0.5?"text-red-400":"text-gray-400"}`}>{diff>0?"+":""}{diff.toFixed(2)} PPG</span>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <div className="flex-1 text-center bg-sky-900/40 rounded p-1.5">
                          <div className="text-sky-300 font-bold">{ppgH.toFixed(2)}</div>
                          <div className="text-gray-600">Casa PPG</div>
                        </div>
                        <div className="flex-1 text-center bg-orange-900/40 rounded p-1.5">
                          <div className="text-orange-300 font-bold">{ppgA.toFixed(2)}</div>
                          <div className="text-gray-600">Fora PPG</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══ FORMA & MOMENTUM ═══ */}
        {tab==="forma"&&(
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...stats].sort((a,b)=>b.momentum-a.momentum).map(t=>{
              const l5=t.history.slice(-5);
              return(
                <div key={t.name} className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-white text-sm">{t.name}</h3>
                      <p className="text-xs text-gray-600">{t.P} jogos · {t.W}V {t.D}E {t.L}D · {t.GF}/{t.GA}</p>
                    </div>
                    <div className={`text-xl font-black ${t.momentum>=70?"text-green-400":t.momentum>=45?"text-yellow-400":"text-red-400"}`}>{t.momentum}%</div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {l5.map((h,i)=>(
                      <div key={i} className={`flex-1 rounded-lg p-1.5 text-center border ${h.r==="V"?"bg-green-900/50 border-green-800":h.r==="E"?"bg-yellow-900/50 border-yellow-800":"bg-red-900/50 border-red-900"}`}>
                        <div className={`text-xs font-black ${h.r==="V"?"text-green-400":h.r==="E"?"text-yellow-400":"text-red-400"}`}>{h.r}</div>
                        <div className="text-xs text-white font-semibold">{h.gf}–{h.ga}</div>
                        <div className="text-xs text-gray-600 truncate">{h.home?"🏠":"✈️"}</div>
                      </div>
                    ))}
                    {[...Array(5-l5.length)].map((_,i)=><div key={i} className="flex-1 rounded-lg p-1.5 border border-gray-800 bg-gray-800/30"/>)}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs mb-2">
                    {t.unb>=3&&<span className="text-green-400 font-semibold">🛡️ Invicto {t.unb}</span>}
                    {t.wstrk>=2&&<span className="text-green-400 font-semibold">🔥 {t.wstrk} vitórias</span>}
                    {t.noWin>=4&&<span className="text-red-400 font-semibold">❌ Sem vencer há {t.noWin}</span>}
                    {t.scstrk>=4&&<span className="text-orange-400 font-semibold">⚽ Marcou em {t.scstrk} seguidos</span>}
                    {t.pClean>=40&&<span className="text-blue-400 font-semibold">🧤 CS {t.pClean}%</span>}
                  </div>
                  <Bar pct={t.momentum} color={t.momentum>=70?"bg-green-500":t.momentum>=45?"bg-yellow-500":"bg-red-500"}/>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ GRÁFICOS ═══ */}
        {tab==="charts"&&(
          <div>
            <div className="flex gap-2 mb-5 flex-wrap">
              {[{id:"evo",label:"Evolução de Pontos"},{id:"gols",label:"Gols por Rodada"},{id:"dist",label:"Distribuição Placares"},{id:"radar",label:"Radar por Time"}].map(ct=>(
                <button key={ct.id} onClick={()=>setChartTab(ct.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${chartTab===ct.id?"bg-sky-700 border-sky-600 text-white":"bg-gray-900 border-gray-700 text-gray-400 hover:text-white"}`}>{ct.label}</button>
              ))}
            </div>

            {chartTab==="evo"&&(
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Evolução de Pontos — Top 8 Times</h3>
                <ResponsiveContainer width="100%" height={380}>
                  <LineChart data={evoData} margin={{top:5,right:20,left:0,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937"/>
                    <XAxis dataKey="round" tick={{fill:"#6b7280",fontSize:11}}/>
                    <YAxis tick={{fill:"#6b7280",fontSize:11}}/>
                    <Tooltip contentStyle={{backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"8px",fontSize:"12px"}}/>
                    <Legend wrapperStyle={{fontSize:"11px"}}/>
                    {top8.map((t,i)=><Line key={t} type="monotone" dataKey={t} stroke={TEAM_COLORS[i]} strokeWidth={2} dot={false} name={t}/>)}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {chartTab==="gols"&&(
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Gols por Rodada</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={goalsData} margin={{top:5,right:20,left:0,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937"/>
                    <XAxis dataKey="round" tick={{fill:"#6b7280",fontSize:11}}/>
                    <YAxis tick={{fill:"#6b7280",fontSize:11}}/>
                    <Tooltip contentStyle={{backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"8px",fontSize:"12px"}} formatter={(v,n)=>[n==="goals"?v:`${v} gols/jogo`,n==="goals"?"Total Gols":"Média"]}/>
                    <Legend wrapperStyle={{fontSize:"11px"}}/>
                    <Bar dataKey="goals" fill="#38bdf8" name="Total Gols" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {goalsData.map(g=>(
                    <div key={g.round} className="bg-gray-800 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-500">{g.round}</div>
                      <div className="text-sky-300 font-black text-sm">{g.avg}</div>
                      <div className="text-gray-600 text-xs">gols/jogo</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {chartTab==="dist"&&(
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Placares Mais Frequentes — Liga Inteira</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={scoreDist} layout="vertical" margin={{top:5,right:40,left:40,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937"/>
                    <XAxis type="number" tick={{fill:"#6b7280",fontSize:11}}/>
                    <YAxis dataKey="score" type="category" tick={{fill:"#e2e8f0",fontSize:12}} width={45}/>
                    <Tooltip contentStyle={{backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"8px",fontSize:"12px"}} formatter={v=>[`${v} jogos`,"Ocorrências"]}/>
                    <Bar dataKey="cnt" name="Jogos" radius={[0,4,4,0]}>
                      {scoreDist.map((_, i) => <Cell key={i} fill={i===0?"#38bdf8":i===1?"#34d399":i===2?"#f59e0b":"#6b7280"}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {chartTab==="radar"&&(
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Radar Analítico</h3>
                  <select value={radarTeam} onChange={e=>setRadarTeam(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-sky-500">
                    {allTeams.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#374151"/>
                      <PolarAngleAxis dataKey="subject" tick={{fill:"#9ca3af",fontSize:11}}/>
                      <Radar dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.25} strokeWidth={2}/>
                      <Tooltip contentStyle={{backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"8px",fontSize:"12px"}} formatter={v=>[`${v.toFixed(1)}%`]}/>
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {radarData.map(d=>(
                      <div key={d.subject}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">{d.subject}</span>
                          <span className={`font-bold ${d.value>=70?"text-green-400":d.value>=45?"text-yellow-400":"text-red-400"}`}>{d.value.toFixed(1)}%</span>
                        </div>
                        <Bar pct={d.value} color={d.value>=70?"bg-green-500":d.value>=45?"bg-yellow-500":"bg-red-500"}/>
                      </div>
                    ))}
                    {stats.find(t=>t.name===radarTeam)&&(
                      <div className="mt-4 bg-gray-800 rounded-xl p-3 text-xs space-y-1">
                        {(()=>{ const t=stats.find(tt=>tt.name===radarTeam);
                          return<>
                            <div className="flex justify-between"><span className="text-gray-500">Over 1.5 / 2.5 / 3.5</span><span className="text-white font-bold">{t.pO15}% / {t.pO25}% / {t.pO35}%</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">BTTS</span><span className="text-green-400 font-bold">{t.pBTTS}%</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Clean Sheets</span><span className="text-blue-400 font-bold">{t.pClean}%</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Média Gols Total</span><span className="text-sky-400 font-bold">{t.avgTot}/jogo</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Sniper Score</span><SniperBadge score={t.sniper}/></div>
                          </>;
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ OVER/BTTS ═══ */}
        {tab==="gols"&&(
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <StatCard icon="⚽" label="Média Gols/Jogo" value={leagueG.avgG} sub={`${leagueG.g} gols em ${leagueG.n} jogos`}/>
              <StatCard icon="📈" label="Over 2.5 %" value={`${Math.round(leagueG.o25/leagueG.n*100)}%`} sub={`${leagueG.o25}/${leagueG.n} jogos`}/>
              <StatCard icon="🎯" label="BTTS %" value={`${Math.round(leagueG.btts/leagueG.n*100)}%`} sub={`${leagueG.btts}/${leagueG.n} jogos`}/>
              <StatCard icon="🤝" label="Empates %" value={`${Math.round(leagueG.draw/leagueG.n*100)}%`} sub={`0×0: ${leagueG.zz} jogos`}/>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-900/80">
                    {["#","Time","PJ","Méd.GM","Méd.GS","Méd.Tot","Over 1.5","Over 2.5","Over 3.5","BTTS","Clean Sheet"].map(h=>(
                      <th key={h} className={`${TH} ${h==="Time"||h==="#"?"text-left":""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...stats].sort((a,b)=>b.pO25-a.pO25).map((t,i)=>(
                    <tr key={t.name} className="border-t border-gray-800/60 hover:bg-gray-800/30">
                      <td className="px-3 py-2 text-gray-600 text-xs">{i+1}</td>
                      <td className="px-3 py-2 font-semibold text-white whitespace-nowrap text-xs">{t.name}</td>
                      <td className={TD+" text-gray-500"}>{t.P}</td>
                      <td className={TD+" text-green-400 font-semibold"}>{t.avgGF}</td>
                      <td className={TD+" text-red-400"}>{t.avgGA}</td>
                      <td className={TD+" text-sky-300 font-bold"}>{t.avgTot}</td>
                      <td className={TD+` font-bold ${t.pO15>=75?"text-green-400":t.pO15>=55?"text-yellow-400":"text-gray-400"}`}>{t.pO15}%</td>
                      <td className={TD+` font-bold ${t.pO25>=60?"text-green-400":t.pO25>=40?"text-yellow-400":"text-red-400"}`}>{t.pO25}%</td>
                      <td className={TD+` font-bold ${t.pO35>=40?"text-green-400":t.pO35>=25?"text-yellow-400":"text-gray-500"}`}>{t.pO35}%</td>
                      <td className={TD+` font-bold ${t.pBTTS>=60?"text-green-400":t.pBTTS>=40?"text-yellow-400":"text-red-400"}`}>{t.pBTTS}%</td>
                      <td className={TD+" text-blue-400 font-semibold"}>{t.pClean}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ POISSON ═══ */}
        {tab==="poi"&&(
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[{label:"🏠 Mandante",val:poiH,set:setPoiH},{label:"✈️ Visitante",val:poiA,set:setPoiA}].map(f=>(
                <div key={f.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <label className="block text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">{f.label}</label>
                  <select value={f.val} onChange={e=>f.set(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500">
                    {allTeams.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              ))}
            </div>
            {poiResult&&(
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatCard icon="📐" label={`λ ${poiH}`} value={poiResult.lH.toFixed(2)} sub="gols esperados"/>
                  <StatCard icon="📐" label={`λ ${poiA}`} value={poiResult.lA.toFixed(2)} sub="gols esperados"/>
                  <StatCard icon="⚽" label="Total esperado" value={(poiResult.lH+poiResult.lA).toFixed(2)} sub={`Over 2.5: ${(poiResult.o25*100).toFixed(1)}%`}/>
                  <StatCard icon="🎯" label="BTTS" value={`${(poiResult.btts*100).toFixed(1)}%`} sub="ambas marcam"/>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Probabilidades Completas</h3>
                  <ProbBar label={`Vitória ${poiH}`} value={poiResult.win} color="bg-green-600"/>
                  <ProbBar label="Empate" value={poiResult.draw} color="bg-yellow-500"/>
                  <ProbBar label={`Vitória ${poiA}`} value={poiResult.loss} color="bg-red-600"/>
                  <ProbBar label="Over 1.5" value={poiResult.o15} color="bg-sky-600"/>
                  <ProbBar label="Over 2.5" value={poiResult.o25} color="bg-blue-600"/>
                  <ProbBar label="Over 3.5" value={poiResult.o35} color="bg-indigo-600"/>
                  <ProbBar label="Under 2.5" value={1-poiResult.o25} color="bg-orange-600"/>
                  <ProbBar label="BTTS" value={poiResult.btts} color="bg-pink-600"/>
                  <ProbBar label={`Handicap -0.5 (${poiH})`} value={poiResult.ah_h05} color="bg-teal-600"/>
                  <ProbBar label={`Handicap +0.5 (${poiA})`} value={poiResult.ah_a05} color="bg-purple-600"/>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">🎯 Top 5 Placares Mais Prováveis</h3>
                  <div className="flex gap-3 flex-wrap">
                    {poiResult.top5.map((s,i)=>(
                      <div key={s.score} className={`flex flex-col items-center rounded-xl px-6 py-3 border ${i===0?"bg-sky-900/40 border-sky-600":"bg-gray-800 border-gray-700"}`}>
                        <div className={`text-2xl font-black ${i===0?"text-sky-300":"text-white"}`}>{s.score}</div>
                        <div className={`text-sm font-bold ${i===0?"text-sky-400":"text-gray-400"}`}>{(s.prob*100).toFixed(1)}%</div>
                        {i===0&&<div className="text-xs text-sky-700 mt-0.5">⭐ Mais provável</div>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 overflow-x-auto">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">🔢 Matriz Completa de Placares (0–4)</h3>
                  <table className="text-xs text-center">
                    <thead><tr><th className="px-2 py-1 text-gray-600">Man↓ / Vis→</th>{[0,1,2,3,4].map(j=><th key={j} className="px-3 py-1 text-gray-400 font-bold">{j}</th>)}</tr></thead>
                    <tbody>{[0,1,2,3,4].map(i=>(
                      <tr key={i}><td className="px-2 py-1.5 text-gray-400 font-bold">{i}</td>
                        {[0,1,2,3,4].map(j=>{
                          const p=(poiResult.matrix[i]?.[j]??0)*100;
                          const isTop=poiResult.top5.some(s=>s.score===`${i}×${j}`);
                          return<td key={j} className={`px-3 py-1.5 rounded font-semibold ${isTop?"bg-sky-800 text-sky-200":p>5?"text-yellow-400":p>2?"text-gray-300":"text-gray-600"}`}>{p.toFixed(1)}%</td>;
                        })}
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                {h2hPoi.length>0&&(
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">⚔️ H2H — {poiH} vs {poiA}</h3>
                    <div className="space-y-2">
                      {h2hPoi.map(([rod,home,gH,gV,away],i)=>(
                        <div key={i} className="flex items-center gap-2 text-sm bg-gray-800 rounded-lg px-3 py-2">
                          <span className="text-gray-600 text-xs w-20">{rod}</span>
                          <span className="font-semibold text-white flex-1 text-right text-xs">{home}</span>
                          <span className="font-black text-sky-300 mx-2">{gH}–{gV}</span>
                          <span className="font-semibold text-white flex-1 text-xs">{away}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ═══ EV CALCULATOR ═══ */}
        {tab==="ev"&&(
          <div className="space-y-5">
            <div className="bg-gray-900 rounded-xl p-4 border border-sky-900/50">
              <p className="text-sm text-sky-300"><span className="font-black">💡 Como usar:</span> Selecione os times → o Poisson calcula as probabilidades reais → insira as odds da casa → veja o EV de cada mercado. <span className="text-green-400 font-bold">Verde = aposta com valor estatístico.</span></p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{label:"🏠 Mandante",val:evH,set:setEvH},{label:"✈️ Visitante",val:evA,set:setEvA}].map(f=>(
                <div key={f.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <label className="block text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">{f.label}</label>
                  <select value={f.val} onChange={e=>f.set(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500">
                    {allTeams.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Digite as Odds (deixe vazio para não calcular)</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[{k:"o1",l:`1 — ${evH}`},{k:"oX",l:"X — Empate"},{k:"o2",l:`2 — ${evA}`},{k:"oO15",l:"Over 1.5"},{k:"oO25",l:"Over 2.5"},{k:"oO35",l:"Over 3.5"},{k:"oU25",l:"Under 2.5"},{k:"oBTTS",l:"BTTS"},{k:"oAH_h",l:`AH -0.5 (${evH})`},{k:"oAH_a",l:`AH +0.5 (${evA})`}].map(f=>(
                  <div key={f.k}>
                    <label className="block text-xs text-gray-600 mb-1 truncate">{f.l}</label>
                    <input type="number" step="0.01" min="1.01" value={evOdds[f.k]}
                      onChange={e=>setEvOdds(p=>({...p,[f.k]:e.target.value}))}
                      placeholder="ex: 2.10"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-sky-500 placeholder-gray-700"/>
                  </div>
                ))}
              </div>
            </div>
            {evResult&&evAnalysis&&(
              <div className="rounded-xl border border-gray-800 overflow-hidden">
                <div className="bg-gray-900 px-4 py-3 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white">{evH}</span>
                    <span className="text-gray-500 text-xs">vs</span>
                    <span className="font-black text-white">{evA}</span>
                    <span className="ml-auto text-xs text-gray-600">λ: {evResult.lH.toFixed(2)} × {evResult.lA.toFixed(2)}</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-800/60">
                  {evAnalysis.map((it,i)=>(
                    <div key={i} className={`px-4 py-3 flex items-center gap-3 ${it.valor?"bg-green-950/30 border-l-2 border-l-green-500":""}`}>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-white">{it.label}</div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          Prob. real (Poisson): <span className="text-sky-400 font-bold">{(it.est*100).toFixed(1)}%</span>
                          {it.imp&&<> · Implícita da odd: <span className="text-orange-400 font-bold">{(it.imp*100).toFixed(1)}%</span></>}
                        </div>
                      </div>
                      <div className="text-right min-w-28">
                        {it.odd?(
                          <>
                            <div className="text-xs text-gray-500 mb-0.5">Odd: {it.odd.toFixed(2)}</div>
                            <div className={`font-black text-base ${it.valor?"text-green-400":"text-red-400"}`}>{it.ev>0?"+":""}{it.ev.toFixed(1)} p.p.</div>
                            <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${it.valor?"bg-green-700 text-green-100":"bg-red-900 text-red-400"}`}>{it.valor?"✅ VALOR":"❌ SEM VALOR"}</div>
                          </>
                        ):<span className="text-xs text-gray-700">—</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 bg-gray-900/50 text-xs text-gray-700 border-t border-gray-800">EV = Prob.Real − Prob.Implícita · Positivo indica edge sobre a casa</div>
              </div>
            )}
            {h2hEV.length>0&&(
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">⚔️ H2H — {evH} vs {evA}</h3>
                <div className="space-y-1.5">
                  {h2hEV.map(([rod,home,gH,gV,away],i)=>(
                    <div key={i} className="flex items-center gap-2 text-xs bg-gray-800 rounded-lg px-3 py-2">
                      <span className="text-gray-600 w-20">{rod}</span>
                      <span className="font-semibold text-white flex-1 text-right">{home}</span>
                      <span className="font-black text-sky-300 mx-2">{gH}–{gV}</span>
                      <span className="font-semibold text-white flex-1">{away}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ SIMULAÇÃO MONTE CARLO ═══ */}
        {tab==="mc"&&(
          <div className="space-y-5">
            <div className="bg-gray-900 rounded-xl p-4 border border-sky-900/50">
              <p className="text-sm text-sky-300"><span className="font-black">🎲 Monte Carlo:</span> Simula 1.500 vezes as rodadas restantes usando o modelo Poisson de cada time para projetar campeão, classificados para Libertadores e rebaixados.</p>
            </div>
            <button onClick={handleMC} disabled={mcRun}
              className={`w-full py-3 rounded-xl font-black text-white text-base transition-all ${mcRun?"bg-gray-700 cursor-wait":"bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 active:scale-95"}`}>
              {mcRun?"⏳ Simulando 1.500 cenários...":"🚀 Executar Simulação Monte Carlo"}
            </button>
            {mcData&&(
              <div className="overflow-x-auto rounded-xl border border-gray-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-900/80">
                      {["#","Time","Pts Atual","PPG","Pts Proj.","🏆 Campeão","🔵 Libertadores","🟢 Sul-Americana","🔴 Rebaixado"].map(h=>(
                        <th key={h} className={`${TH} ${h==="Time"||h==="#"?"text-left":""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mcData.map((t,i)=>(
                      <tr key={t.name} className={`border-t border-gray-800/60 hover:bg-gray-800/30 ${i<4?"border-l-2 border-l-sky-500":i<8?"border-l-2 border-l-green-600":i>=mcData.length-4?"border-l-2 border-l-red-700":"border-l-2 border-l-transparent"}`}>
                        <td className="px-3 py-2.5 text-gray-600 text-xs">{i+1}</td>
                        <td className="px-3 py-2.5 font-semibold text-white whitespace-nowrap text-xs">{t.name}</td>
                        <td className={TD}><span className="bg-blue-800 text-white font-black px-2 py-0.5 rounded text-xs">{t.Pts}</span></td>
                        <td className={TD+" text-gray-400"}>{t.ppg}</td>
                        <td className={TD+" font-bold text-sky-300"}>{t.projPts}</td>
                        <td className={TD}><span className={`font-black ${parseFloat(t.ch)>=15?"text-yellow-300":parseFloat(t.ch)>=5?"text-yellow-500":"text-gray-600"}`}>{t.ch}%</span></td>
                        <td className={TD}><div className="flex flex-col items-center gap-0.5"><span className={`font-bold ${parseFloat(t.lib)>=50?"text-green-400":parseFloat(t.lib)>=20?"text-yellow-400":parseFloat(t.lib)>=5?"text-gray-400":"text-gray-700"}`}>{t.lib}%</span><Bar pct={parseFloat(t.lib)} color="bg-sky-500"/></div></td>
                        <td className={TD}><span className={`font-semibold ${parseFloat(t.sul)>=50?"text-green-400":"text-gray-500"}`}>{t.sul}%</span></td>
                        <td className={TD}><span className={`font-bold ${parseFloat(t.rel)>=30?"text-red-400":parseFloat(t.rel)>=10?"text-orange-400":"text-gray-700"}`}>{t.rel}%</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-2 bg-gray-900/50 text-xs text-gray-700 border-t border-gray-800">Baseado em 1.500 simulações · Rodadas 12–38 (27 restantes) · Cada rodada usa λ Poisson de cada time</div>
              </div>
            )}
          </div>
        )}

        {/* ═══ SNIPER TOP 10 ═══ */}
        {tab==="sniper"&&(
          <div>
            <div className="bg-gray-900 rounded-xl p-4 border border-sky-900/50 mb-5">
              <p className="text-sm text-sky-300"><span className="font-black">Sniper Score v3.0</span> · Taxa de vitória 30% + Momentum ponderado (últ. 5 jogos com pesos crescentes) 35% + Saldo de gols normalizado 20% + Domínio em casa 15%. FORTE ≥75 · MÉDIO ≥55 · FRACO ≥40.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topSniper.map((t,i)=>{
                const medal=["🥇","🥈","🥉"][i]??`${i+1}º`;
                const l5=t.history.slice(-5);
                const poiProj=pd.s[t.name]?{attH:(pd.s[t.name].attH*pd.avgH).toFixed(2),attA:(pd.s[t.name].attA*pd.avgA).toFixed(2)}:{attH:"—",attA:"—"};
                return(
                  <div key={t.name} className={`rounded-xl p-5 border ${i<3?"border-sky-700/60 bg-gradient-to-br from-gray-900 to-sky-950/30":"border-gray-800 bg-gray-900"}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{medal}</span>
                        <div>
                          <h3 className="font-black text-white">{t.name}</h3>
                          <p className="text-xs text-gray-600">{t.W}V {t.D}E {t.L}D · {t.P}PJ · {t.GF}/{t.GA} gols</p>
                        </div>
                      </div>
                      <SniperBadge score={t.sniper}/>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {l5.map((h,idx)=><Chip key={idx} r={h.r}/>)}
                      {[...Array(5-l5.length)].map((_,idx)=><span key={idx} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-gray-600 text-xs">–</span>)}
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs mb-3">
                      {[{label:"Momentum",val:`${t.momentum}%`,color:t.momentum>=70?"text-green-400":"text-yellow-400"},
                        {label:"Over 2.5",val:`${t.pO25}%`,color:t.pO25>=60?"text-green-400":"text-yellow-400"},
                        {label:"BTTS",val:`${t.pBTTS}%`,color:t.pBTTS>=60?"text-green-400":"text-yellow-400"},
                        {label:"λ Casa",val:poiProj.attH,color:"text-sky-400"},
                      ].map(s=>(
                        <div key={s.label} className="bg-gray-800 rounded-lg p-2">
                          <div className={`font-bold text-sm ${s.color}`}>{s.val}</div>
                          <div className="text-gray-600">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-xs mb-3">
                      {t.unb>=3&&<span className="bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full border border-green-800">🛡️ Invicto {t.unb}</span>}
                      {t.wstrk>=2&&<span className="bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full border border-green-800">🔥 {t.wstrk} vitórias</span>}
                      {t.scstrk>=3&&<span className="bg-orange-900/50 text-orange-400 px-2 py-0.5 rounded-full border border-orange-800">⚽ Marcou em {t.scstrk}</span>}
                      {t.pClean>=50&&<span className="bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded-full border border-blue-800">🧤 CS {t.pClean}%</span>}
                    </div>
                    <Bar pct={t.sniper} color={t.sniper>=75?"bg-green-500":t.sniper>=55?"bg-yellow-500":"bg-orange-600"}/>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
      <div className="text-center py-5 text-xs text-gray-800 border-t border-gray-900 mt-4">
        Sniper Analytics v3.0 · Liga Profesional Argentina 2026 · Poisson · Monte Carlo · EV · R1–R11
      </div>
    </div>
  );
}
