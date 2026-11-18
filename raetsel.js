'use strict';
/* Rätsel 1–11: Interactive UI is local. Only a fully checked answer is sent to
   winterstern_submit_answer, which stores the chapter progress in Supabase. */
function mountWintersternPuzzle(day,root,submit){
  if(day===1)return mountDrawers(root,submit);
  if(day===2)return mountMatchsticks02(root,submit);
  if(day===3)return mountChristmasAccount(root,submit);
  if(day===4)return mountCrossword(root,submit);
  if(day===5)return mountClockCalibration(root,submit);
  if(day===6)return mountNewspaperMarks(root,submit);
  if(day===7)return mountVisitorLock(root,submit);
  if(day===8)return mountLocksmithBoard(root,submit);
  if(day===9)return mountNonogram9(root,submit);
  if(day===10)return mountBanknotes10(root,submit);
  if(day===11)return mountPhotoNegatives11(root,submit);
  if(day===12)return mountSignalCipher12(root,submit);
  if(day===13)return mountPlinth13(root,submit);
  if(day===14)return mountLeverLock14(root,submit);
  if(day===15)return mountServiceCorridor15(root,submit);
  if(day===16)return mountWitnessStatements16(root,submit);
  if(day===17)return mountFiber17(root,submit);
  if(day===18)return mountMaterialSudoku18(root,submit);
  if(day===19)return mountCipherLetter19(root,submit);
  if(day===20)return mountTimeline20(root,submit);
  if(day===21)return mountAlibi21(root,submit);
  if(day===22)return mountEvidence22(root,submit);
  if(day===23)return mountTransmission23(root,submit);
}
function mountDrawers(root,submit){
  const docs=['Tagebuch','Bauplan','Rechnungsbuch','Briefe','Register'];
  const target=['Register','Rechnungsbuch','Briefe','Tagebuch','Bauplan'];
  let slots=['','','','',''],selected=0,pending=false;
  root.innerHTML=`<div class="ws-puzzle"><h3>Archivakte 001 · Die fünf Schubladen</h3><p>Fünf Dokumente, fünf Schubladen. Ordne jedem Fach genau ein Dokument zu. Die Schubladen sind von links nach rechts nummeriert.</p><ol class="ws-list"><li>Zwischen den Briefen und dem Register liegt genau eine Schublade.</li><li>Das Register liegt weiter links als der Bauplan.</li><li>Die Briefe liegen in keiner äußeren Schublade.</li><li>Das Tagebuch liegt ebenfalls nicht außen.</li><li>Das Rechnungsbuch liegt direkt neben dem Register.</li><li>Die Briefe liegen links vom Tagebuch.</li></ol><div class="ws-drawers" id="wsDrawers"></div><p class="ws-small">Wähle zuerst eine Schublade, dann das gewünschte Dokument.</p><div id="wsDocChoices" class="ws-choice"></div><div class="ws-check"><button id="wsCheck" disabled>Alle Zuordnungen prüfen</button> <button id="wsReset" class="alt">Zurücksetzen</button></div><div class="ws-feedback" id="wsFeedback" aria-live="polite"></div><div class="ws-hints"><details><summary>Hinweis 1</summary>Briefe liegen weder außen noch rechts vom Tagebuch. Für die Briefe bleiben nur Fach 2 oder 3.</details><details><summary>Hinweis 2</summary>Lägen die Briefe in Fach 2, müsste das Register in Fach 4 liegen. Dann wäre kein gültiger Platz mehr für den Bauplan rechts vom Register.</details><details><summary>Hinweis 3 – Lösung</summary>Von links nach rechts: Register, Rechnungsbuch, Briefe, Tagebuch, Bauplan. Das Tagebuch liegt in Fach 4.</details></div></div>`;
  const q=id=>root.querySelector('#'+id);
  function paint(){q('wsDrawers').innerHTML=slots.map((d,i)=>`<button type="button" class="ws-drawer ${i===selected?'active':''}" data-slot="${i}" aria-pressed="${i===selected}"><strong>${i+1}</strong><div class="ws-handle"></div><small>${d||'Unbekannt'}</small></button>`).join('');q('wsDocChoices').innerHTML=docs.map(d=>`<button type="button" data-doc="${d}" class="${slots[selected]===d?'active':''}">${d}</button>`).join('');q('wsCheck').disabled=slots.some(v=>!v)||pending;}
  root.addEventListener('click',e=>{const slot=e.target.closest('[data-slot]');const doc=e.target.closest('[data-doc]');if(slot){selected=Number(slot.dataset.slot);paint()}if(doc){const val=doc.dataset.doc;slots=slots.map((v,i)=>i===selected?val:v===val?'':v);q('wsFeedback').textContent='';paint()}});
  q('wsReset').onclick=()=>{slots=['','','','',''];selected=0;q('wsFeedback').textContent='';paint()};
  q('wsCheck').onclick=async()=>{if(slots.some(v=>!v)||pending)return;const fb=q('wsFeedback');if(!target.every((v,i)=>slots[i]===v)){fb.innerHTML='<div class="notice bad">Noch nicht richtig. Mindestens eine Zuordnung stimmt nicht.</div>';return;}pending=true;paint();try{const ok=await submit('SCHLUESSEL');if(!ok)fb.innerHTML='<div class="notice bad">Die Zuordnung ist richtig, aber die hinterlegte Rätselantwort in der Spielleitung stimmt noch nicht. Bitte dort SCHLUESSEL eintragen.</div>'}catch(e){fb.textContent='Speichern fehlgeschlagen: '+e.message}finally{pending=false;if(q('wsCheck'))paint()}};paint();
}

/* Kapitel 02 – drei Streichholzprüfungen. Jede erlaubte Belegung wird
   erst als kompletter Zustand geprüft, keine Teil-Antwort wird verraten.
   Maus/Touch: Holz auf freie Position ziehen; alternativ Start und Ziel anklicken. */
function mountMatchsticks02(root,submit){
  const q=id=>root.querySelector('#'+id);
  const digitSegments={0:'abcdef',1:'bc',2:'abged',3:'abgcd',4:'fgbc',5:'afgcd',6:'afgecd',7:'abc',8:'abcdefg',9:'abfgcd'};
  const stages=[
    {title:'Prüfung I · Die falsche Rechnung',subtitle:'Versetze genau EIN Streichholz. Aus 6 + 4 = 3 muss eine mathematisch richtige Gleichung werden. Kein Holz entfernen oder dazulegen.',moves:1, answer:'5+4=9', result:'Ergebnis der korrigierten Rechnung: 9'},
    {title:'Prüfung II · Das beschädigte Fensterwerk',subtitle:'Versetze genau DREI Streichhölzer. Es müssen genau zwei kleine Quadrate (1 × 1) und ein großes Quadrat (2 × 2) entstehen. Weitere Quadrate sind nicht erlaubt. Jedes der 14 Hölzer muss zu mindestens einem dieser drei Quadrate gehören.',moves:3,result:'Zwei kleine und ein großes Quadrat: zusammen 3 Quadrate'},
    {title:'Prüfung III · Die doppelte Kontrolle',subtitle:'Die letzte Rechnung zeigt 0 − 0 = 5 und ist falsch. Versetze genau DREI Streichhölzer, sodass eine richtige Subtraktion entsteht. Johann notiert dazu: „Nicht jede richtige Rechnung ist die gesuchte.“ Es müssen alle vorhandenen Hölzer verwendet werden.',moves:3,result:'9 − 3 = 6: Drei Bewegungen stellen die Rechnung wieder her.'}
  ];
  const dids=[0,1,2];
  let stage=0,moves=0,selected=null,pending=false,completed=[false,false,false];
  let slots={},occupied=new Set();
  function add(id,x1,y1,x2,y2,initial=false){slots[id]=[x1,y1,x2,y2];if(initial)occupied.add(id)}
  function setup(n){slots={};occupied=new Set();moves=0;selected=null;
    if(n===0){const X=[48,202,367];const w=70,h=120,y=53;
      for(let k=0;k<3;k++){
        const x=X[k];const pieces={a:[x+12,y,x+w-12,y],b:[x+w,y+10,x+w,y+h/2-7],c:[x+w,y+h/2+7,x+w,y+h-10],d:[x+12,y+h,x+w-12,y+h],e:[x,y+h/2+7,x,y+h-10],f:[x,y+10,x,y+h/2-7],g:[x+12,y+h/2,x+w-12,y+h/2]};
        const value=[6,4,3][k];for(const [seg,coords] of Object.entries(pieces))add('d'+k+'_'+seg,...coords,digitSegments[value].includes(seg));
      }
      // Pluszeichen als zwei zugängliche Streichholzplätze
      add('op_h',156,110,192,110,true);add('op_v',174,92,174,128,true);
    }else if(n===1){
      // 3x3 Raster mit 24 möglichen Kanten und 14 beweglichen Hölzern.
      // Die Startanordnung hat genau eine zulässige Lösung mit drei Zügen
      // und der vorgegebenen Quadratverteilung (vollständig enumeriert).
      const initial=new Set([0,1,4,5,10,11,12,14,15,17,18,19,20,21]);
      let num=0;const x=62,y=22,w=72;
      for(let r=0;r<4;r++)for(let c=0;c<3;c++){
        add('h'+r+'_'+c,x+c*w,y+r*w,x+(c+1)*w,y+r*w,initial.has(num++));
      }
      for(let r=0;r<3;r++)for(let c=0;c<4;c++){
        add('v'+r+'_'+c,x+c*w,y+r*w,x+c*w,y+(r+1)*w,initial.has(num++));
      }
    }else{
      const X=[48,202,367],w=70,h=120,y=53;
      for(let k=0;k<3;k++){
        const x=X[k];const pieces={a:[x+12,y,x+w-12,y],b:[x+w,y+10,x+w,y+h/2-7],c:[x+w,y+h/2+7,x+w,y+h-10],d:[x+12,y+h,x+w-12,y+h],e:[x,y+h/2+7,x,y+h-10],f:[x,y+10,x,y+h/2-7],g:[x+12,y+h/2,x+w-12,y+h/2]};
        const value=[0,0,5][k];for(const [seg,coords] of Object.entries(pieces))add('d'+k+'_'+seg,...coords,digitSegments[value].includes(seg));
      }
      add('op_h',156,110,192,110,true);
    }
  }
  function decoded(){
    const ds=dids.map(k=>{const present='abcdefg'.split('').filter(c=>occupied.has('d'+k+'_'+c)).join('');return Object.entries(digitSegments).find(([num,segments])=>[...segments].sort().join('')===present)?.[0]??'?'});
    const op=occupied.has('op_h')?(occupied.has('op_v')?'+':'-'):'?';return ds[0]+op+ds[1]+'='+ds[2];
  }
  // Alle vorhandenen kleinen und größeren Quadrate im 3x3-Gitter zählen.
  function squareCheck(){
    const found=[];const used=new Set();
    for(let side=1;side<=3;side++)for(let r=0;r+side<=3;r++)for(let c=0;c+side<=3;c++){
      const perimeter=[];
      for(let i=0;i<side;i++)perimeter.push('h'+r+'_'+(c+i),'h'+(r+side)+'_'+(c+i),'v'+(r+i)+'_'+c,'v'+(r+i)+'_'+(c+side));
      if(perimeter.every(id=>occupied.has(id))){found.push(side);perimeter.forEach(id=>used.add(id))}
    }
    return found.filter(x=>x===1).length===2 && found.filter(x=>x===2).length===1 && found.length===3 && used.size===occupied.size;
  }
  function correct(){
    if(moves!==stages[stage].moves)return false;
    if(stage===0)return occupied.has('op_h')&&decoded()==='5+4=9';
    if(stage===1)return squareCheck();
    return occupied.has('op_h')&&!occupied.has('op_v')&&decoded()==='9-3=6';
  }
  function board(){
    const dim=stage===1?'0 0 340 273':'0 0 465 235';
    let extra='';
    if(stage!==1){extra='<text x="340" y="126" font-size="42" fill="#564733" font-family="Georgia">=</text>';
      extra+='<text x="21" y="220" font-size="11" fill="#6a5d49">Streichhölzer im Ziffernanzeige-Stil</text>';
    }else{extra='<text x="62" y="266" font-size="11" fill="#645745">Kleine und große Quadrate zählen.</text>';}
    const matches=Object.entries(slots).map(([id,coord])=>{
      const isOn=occupied.has(id), isSelected=selected===id;const [x1,y1,x2,y2]=coord;
      return `<g data-k2-slot="${id}" class="k2stick ${isOn?'on':'off'} ${isSelected?'selected':''}" role="button" tabindex="0" aria-label="${isOn?'Streichholz von':'Freier Streichholzplatz'} ${id}" aria-pressed="${isSelected}"><line class="k2hit" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><line class="k2wood" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><circle cx="${x2}" cy="${y2}" r="5" class="k2head"/></g>`
    }).join('');
    return `<svg id="k2-board" class="k2-board" viewBox="${dim}" role="group" aria-label="Bewegliche Streichholzpositionen">${extra}${matches}</svg>`;
  }
  function render(){const conf=stages[stage];const finished=completed.filter(Boolean).length;
    root.innerHTML=`<div class="ws-puzzle k2-case"><span class="k2-tag">WERKSTATT WINTER · PRÜFBLATT 002</span><h3>Die drei Prüfungen des Uhrmachers</h3><p>Schon wenige falsch liegende Streichhölzer können manches durcheinanderbringen. Es darf aber nur die angegebene Anzahl versetzt werden. <strong>Jeder Zug besteht aus dem Verschieben eines belegten Holzes auf einen freien Platz.</strong></p><div class="k2-progress" aria-label="Prüffortschritt">${stages.map((s,i)=>`<span class="${i===stage?'current':completed[i]?'passed':''}">${completed[i]?'✓ ':''}Prüfung ${i+1}</span>`).join('')}</div><div class="k2-panel"><h4>${conf.title}</h4><p>${conf.subtitle}</p><div class="k2-score"><strong>${moves} von ${conf.moves}</strong> Zügen ausgeführt <span>·</span> ${selected?'Holz markiert':'Holz antippen oder ziehen'}</div>${board()}<p class="k2-instruction">Bedienung: Erst ein belegtes Holz anklicken, danach einen freien Platz. Mit Maus oder Finger kannst du es auch direkt dorthin ziehen. Du darfst die aktuelle Prüfung jederzeit zurücksetzen.</p><div class="ws-check"><button type="button" id="k2check" ${moves!==conf.moves||pending?'disabled':''}>Prüfung ${stage+1} kontrollieren</button> <button type="button" id="k2reset" class="alt">Diese Prüfung zurücksetzen</button></div><div id="k2-feedback" aria-live="polite"></div></div><div class="ws-hints"><details><summary>Hinweis 1 – Ansatz</summary>${['Bei einer Rechnung müssen nicht nur die Ziffern stimmen. Prüfe auch, ob ein einzelnes Holz an anderer Stelle aus zwei falsch angezeigten Ziffern zwei richtige machen kann.','Achte auf die Kanten eines 2 × 2-Quadrats. Manche Hölzer können zugleich zu kleineren Quadraten gehören.','Nicht jede rechnerisch richtige Subtraktion ist die richtige. Vergleiche beide Eingangsgrößen mit den Ergebnissen der vorherigen Prüfungen.'][stage]}</details><details><summary>Hinweis 2 – Konkreter</summary>${['Prüfe die erste und letzte Ziffer gleichzeitig. Ein Holz kann von einer Ziffer zur anderen wandern.','Ein großes Quadrat beansprucht acht Randhölzer. Die kleinen Quadrate müssen Seiten mit anderen Quadraten teilen, damit alle 14 Hölzer verwendet werden.','Der erste Wert ist neun. Für den zweiten zählst du die zwei kleinen und das große Quadrat zusammen.'][stage]}</details><details><summary>Hinweis 3 – Lösung</summary>${['Versetze das untere linke Holz der 6 zum oberen linken Platz der 3. Es entsteht 5 + 4 = 9.','Lege das obere rechte senkrechte Holz waagerecht links in die zweite Gitterlinie. Setze das mittlere senkrechte Holz der zweiten Reihe in die erste Reihe (zweite Spalte). Verschiebe schließlich das untere linke senkrechte Holz ganz nach rechts unten.','Aus 0 − 0 = 5 entsteht durch drei Züge 9 − 3 = 6. Das ist die Differenz zwischen neun und drei.'][stage]}</details></div></div>`;
    q('k2check').onclick=check;q('k2reset').onclick=()=>{setup(stage);render()};
  }
  function move(from,to){if(pending||moves>=stages[stage].moves||!occupied.has(from)||occupied.has(to)||from===to)return false;
    occupied.delete(from);occupied.add(to);moves++;selected=null;render();return true;}
  function select(id){if(pending)return;
    if(selected&&selected!==id&&!occupied.has(id)){move(selected,id);return}
    if(occupied.has(id)){selected=selected===id?null:id;render();return}
  }
  let dragStart=null,dragX=0,dragY=0;
  root.addEventListener('click',ev=>{const el=ev.target.closest('[data-k2-slot]');if(el)select(el.dataset.k2Slot)});
  root.addEventListener('keydown',ev=>{if((ev.key==='Enter'||ev.key===' ')&&ev.target.matches('[data-k2-slot]')){ev.preventDefault();select(ev.target.dataset.k2Slot)}});
  root.addEventListener('pointerdown',ev=>{const el=ev.target.closest('[data-k2-slot]');if(el&&occupied.has(el.dataset.k2Slot)){dragStart=el.dataset.k2Slot;dragX=ev.clientX;dragY=ev.clientY}});
  root.addEventListener('pointerup',ev=>{if(!dragStart)return;const start=dragStart;dragStart=null;if(Math.hypot(ev.clientX-dragX,ev.clientY-dragY)<14)return;const el=document.elementFromPoint(ev.clientX,ev.clientY)?.closest('[data-k2-slot]');if(el){move(start,el.dataset.k2Slot);ev.preventDefault()}});
  async function check(){if(pending||moves!==stages[stage].moves)return;const fb=q('k2-feedback');if(!correct()){fb.innerHTML='<div class="notice bad">Noch nicht richtig. Prüfe alle Hölzer und die genaue Aufgabenbedingung; du kannst die Prüfung zurücksetzen.</div>';return}
    if(stage<2){const msg=stages[stage].result;completed[stage]=true;stage++;setup(stage);render();q('k2-feedback').innerHTML=`<div class="notice">${msg} Die nächste Prüfung ist geöffnet.</div>`;return}
    pending=true;const btn=q('k2check');btn.disabled=true;fb.innerHTML='<div class="notice">Alle drei Prüfungen bestanden. Der Archivvermerk wird geprüft …</div>';
    try{const ok=await submit('STREICHHOLZ');if(!ok){pending=false;fb.innerHTML='<div class="notice bad">Alle Streichhölzer liegen richtig. In der Spielleitung muss für Kapitel 2 jedoch die geheime Antwort STREICHHOLZ hinterlegt sein.</div>';btn.disabled=false}}catch(e){pending=false;fb.textContent='Verbindung fehlgeschlagen: '+e.message;btn.disabled=false}
  }
  setup(0);render();
}

function mountBlueprint(root,submit){
  /* NESW: W=window, D=door, B=solid wall. Interior edges must agree.
     The preset perimeter is N:WW, E:WB, S:BB, W:DD. */
  const tiles=[{id:'I',edges:['D','B','D','W']},{id:'II',edges:['B','D','W','W']},{id:'III',edges:['D','B','D','B']},{id:'IV',edges:['B','B','B','D']}];
  const positions=['Nordwest','Nordost','Südwest','Südost'];
  const rooms=['Empfang','Schauraum','Lager','Werkstatt'];
  let slots=[null,null,null,null],rotations=[0,0,0,0],roomAssignments=['','','',''],active=0,pending=false;
  const rotate=(edges,k)=>[0,1,2,3].map(i=>edges[(i-k+4)%4]);
  const pieceEdges=i=>slots[i]===null?null:rotate(tiles[slots[i]].edges,rotations[i]);
  const paths=()=>{const e=slots.map((v,i)=>pieceEdges(i));if(e.some(v=>!v))return false;
    const outer=[e[0][0],e[1][0],e[1][1],e[3][1],e[2][2],e[3][2],e[0][3],e[2][3]];
    const expected=['W','W','W','B','B','B','D','D'];
    const matches=[[0,1,1,3],[0,2,2,0],[1,2,3,0],[2,1,3,3]].every(([a,side,b,other])=>e[a][side]===e[b][other]);
    return outer.every((v,i)=>v===expected[i])&&matches;
  };
  const svg=i=>{const ed=pieceEdges(i);if(!ed)return '<div class="ws-no-tile">Fragment einsetzen</div>';
    const sides=[[14,10,86,10],[90,14,90,86],[86,90,14,90],[10,86,10,14]];
    const marks=ed.map((v,j)=>{const mid=[[50,10],[90,50],[50,90],[10,50]][j];return v==='W'?`<line x1="${mid[0]-(j%2?0:13)}" y1="${mid[1]-(j%2?13:0)}" x2="${mid[0]+(j%2?0:13)}" y2="${mid[1]+(j%2?13:0)}" stroke="#558ca0" stroke-width="7"/>`:v==='D'?`<circle cx="${mid[0]}" cy="${mid[1]}" r="9" fill="#eac68b" stroke="#ad8652" stroke-width="2"/>`:''}).join('');
    return `<svg viewBox="0 0 100 100" aria-label="Vier Kanten des Bauplanfragments"><rect x="10" y="10" width="80" height="80" fill="#f4e8d3" stroke="#594636" stroke-width="5"/>${marks}<path d="M27 36h20v28H27zM55 36h17M55 45h17M55 54h17" stroke="#ad9676" fill="none" opacity=".48"/><text x="50" y="72" text-anchor="middle" font-size="11" fill="#433527">${tiles[slots[i]].id}</text></svg>`;
  };
  root.innerHTML=`<div class="ws-puzzle"><h3>Bauakte 002 · Der zerschnittene Grundriss</h3><p>Vier zerschnittene Planfragmente gehören zu Winters Werkstatt. Setze sie in die richtige Position, drehe sie passend und benenne die Räume. Der Bauplan wird <strong>erst nach vollständiger Prüfung</strong> bewertet.</p><div class="ws-plan-legend"><div><b>Gebäuderand:</b> Norden: zwei Fenster · Westen: zwei Eingänge · Osten: oben ein Fenster, unten eine Mauer · Süden: geschlossene Wand.</div><div><b>Innenwände:</b> Öffnungen dürfen nur auf passende Öffnungen treffen. Mauer muss auf Mauer treffen.</div><div><b>Farben:</b> <span style="color:#558ca0">▰</span> Fenster · <span style="color:#ad8652">●</span> Türöffnung · durchgezogene Linie = Mauer.</div><div><b>Raumregeln:</b> Empfang und Lager haben jeweils einen eigenen Eingang von Westen. Nur vom Empfang gelangt man regulär in den Schauraum. Nur vom Lager gelangt man in die Werkstatt. Der Schauraum befindet sich nördlich der Werkstatt.</div></div><div class="ws-plan" id="wsPlan"></div><div class="ws-block"><strong id="wsSelected">Planfeld Nordwest</strong><p class="ws-small">Fragment auswählen oder die leere Fläche festlegen; ein bereits verwendetes Fragment wird beim Umsetzen automatisch freigegeben.</p><div class="ws-tiles" id="wsTiles"></div><div class="ws-orientation"><button type="button" class="alt" id="wsRotate">↻ Fragment 90° drehen</button><span id="wsDegrees" class="ws-small"></span></div><label for="wsRoom">Raumbezeichnung</label><select id="wsRoom"><option value="">Raum auswählen</option>${rooms.map(v=>`<option>${v}</option>`).join('')}</select></div><div class="ws-check"><button id="wsCheck" disabled>Bauplan prüfen</button> <button id="wsReset" class="alt">Zurücksetzen</button></div><div class="ws-feedback" id="wsFeedback" aria-live="polite"></div><div class="ws-hints"><details><summary>Hinweis 1</summary>Beginne mit den Fassaden. Der obere Rand benötigt zwei Fenster, der untere darf keine Fenster und keine Eingänge haben. Überprüfe danach die beiden westlichen Eingänge.</details><details><summary>Hinweis 2</summary>Fragment I gehört nach Nordwest und ist um 90° gedreht. Fragment II gehört nach Nordost und ist um 180° gedreht. Jetzt musst du die Türverbindungen unten ergänzen und die Räume bestimmen.</details><details><summary>Hinweis 3 – Lösung</summary>Nordwest: Fragment I, 90°, Empfang. Nordost: Fragment II, 180°, Schauraum. Südwest: Fragment III, 90° oder 270°, Lager. Südost: Fragment IV, 0°, Werkstatt. Zwei Wege: West-Eingang → Empfang → Schauraum sowie West-Eingang → Lager → Werkstatt.</details></div></div>`;
  const q=id=>root.querySelector('#'+id);
  function paint(){q('wsPlan').innerHTML=positions.map((pos,i)=>`<button type="button" class="ws-plan-cell ${active===i?'active':''}" data-place="${i}" aria-pressed="${active===i}"><strong>${pos}</strong>${svg(i)}<span class="ws-small">${roomAssignments[i]||'Raum unbekannt'}</span></button>`).join('');q('wsSelected').textContent='Planfeld '+positions[active];q('wsTiles').innerHTML=tiles.map((t,i)=>`<button type="button" data-piece="${i}" class="${slots[active]===i?'active':''}">Teil ${t.id}</button>`).join('');q('wsRoom').value=roomAssignments[active];q('wsDegrees').textContent=slots[active]===null?'Noch kein Fragment':rotations[active]*90+'°';q('wsRotate').disabled=slots[active]===null;q('wsCheck').disabled=slots.some(x=>x===null)||roomAssignments.some(x=>!x)||pending;}
  root.addEventListener('click',e=>{let p=e.target.closest('[data-place]'),tile=e.target.closest('[data-piece]');if(p){active=Number(p.dataset.place);paint()}if(tile){let idx=Number(tile.dataset.piece);slots=slots.map((v,i)=>v===idx?null:v);slots[active]=idx;rotations[active]=0;q('wsFeedback').textContent='';paint()}});
  q('wsRotate').onclick=()=>{rotations[active]=(rotations[active]+1)%4;q('wsFeedback').textContent='';paint()};
  q('wsRoom').onchange=e=>{const v=e.target.value;roomAssignments=roomAssignments.map((x,i)=>i===active?v:x===v?'':x);q('wsFeedback').textContent='';paint()};
  q('wsReset').onclick=()=>{slots=[null,null,null,null];rotations=[0,0,0,0];roomAssignments=['','','',''];active=0;q('wsFeedback').textContent='';paint()};
  q('wsCheck').onclick=async()=>{if(pending||slots.some(x=>x===null)||roomAssignments.some(x=>!x))return;const fb=q('wsFeedback');const correct=paths()&&roomAssignments.every((v,i)=>v===rooms[i]);if(!correct){fb.innerHTML='<div class="notice bad">Der Bauplan stimmt noch nicht vollständig. Prüfe Fragmente, Ausrichtung und Räume.</div>';return;}pending=true;paint();try{const ok=await submit('BAUPLAN');if(!ok)fb.innerHTML='<div class="notice bad">Der Grundriss ist richtig, aber die hinterlegte Antwort in der Spielleitung stimmt nicht. Bitte dort BAUPLAN eintragen.</div>'}catch(e){fb.textContent='Speichern fehlgeschlagen: '+e.message}finally{pending=false;if(q('wsCheck'))paint()}};paint();
}

/* Rätsel 3: No individual field is evaluated before the player presses the
   check button. The full result is then submitted through the existing
   Supabase answer RPC; the secret answer must be 99 in the chapter editor. */
function mountChristmasAccount(root,submit){
  const symbols=[
    {icon:'🎄',label:'Tannenbaum'},
    {icon:'🔔',label:'Glocke'},
    {icon:'⭐',label:'Stern'},
    {icon:'🎁',label:'Geschenk'},
    {icon:'🕯️',label:'Kerze'}
  ];
  const expected=[9,6,5,13,7,99];
  let pending=false;
  root.innerHTML=`<div class="ws-puzzle ws-account">
    <div class="ws-account-header"><span class="ws-kicker">WERKSTATT WINTER · ABRECHNUNG 03</span><h3>Die Weihnachtsbestellungen</h3><p>Bernd hat die Zahlen einer alten Weihnachtsabrechnung durch Symbole ersetzt. Jedes Symbol steht immer für dieselbe Zahl.</p><p><strong>Ermittle alle fünf Symbolwerte und berechne dann die letzte Rechnung.</strong> Erst nach dem Klick auf „Abrechnung prüfen“ erfährst du, ob alles stimmt.</p></div>
    <div class="ws-account-paper" aria-label="Die fünf Gleichungen">
      <div class="ws-equation"><span>🎄 + 🎄 + ⭐</span><strong>= 23</strong></div>
      <div class="ws-equation"><span>🎄 + 🔔</span><strong>= 15</strong></div>
      <div class="ws-equation"><span>🔔 + 🔔 + ⭐</span><strong>= 17</strong></div>
      <div class="ws-equation"><span>🎁 + ⭐</span><strong>= 18</strong></div>
      <div class="ws-equation"><span>🎁 − 🕯️</span><strong>= 6</strong></div>
    </div>
    <div class="ws-account-finale"><span class="ws-kicker">DIE LETZTE RECHNUNG</span><div class="ws-final-formula">( 🎁 + ⭐ ) × ( 🔔 + 🔔 − 🕯️ ) + 🎄 = ?</div><p class="ws-small">Zuerst die Klammern, dann die Multiplikation, zuletzt die Addition.</p></div>
    <div class="ws-block"><h4>Deine Berechnungen</h4><div class="ws-account-inputs">
      ${symbols.map((v,i)=>`<label class="ws-account-field" for="wsAccount${i}"><span>${v.icon} ${v.label}</span><input id="wsAccount${i}" type="number" inputmode="numeric" step="1" placeholder="Wert" autocomplete="off" data-ws-number="${i}" /></label>`).join('')}
    </div><label class="ws-account-field ws-account-total" for="wsAccount5"><span>Ergebnis der Schlussrechnung</span><input id="wsAccount5" type="number" inputmode="numeric" step="1" placeholder="Endergebnis" autocomplete="off" data-ws-number="5" /></label></div>
    <div class="ws-check"><button id="wsCheck" type="button" disabled>Abrechnung prüfen</button> <button id="wsReset" class="alt" type="button">Zurücksetzen</button></div>
    <div class="ws-feedback" id="wsFeedback" aria-live="polite"></div>
    <div class="ws-hints"><details><summary>Hinweis 1 – Zwei Gleichungen vergleichen</summary>Vergleiche die erste und die dritte Gleichung. Dort stehen jeweils zwei gleiche Symbole und ein Stern. Der Unterschied von 6 kommt allein von den beiden Tannenbäumen und den beiden Glocken.</details>
    <details><summary>Hinweis 2 – Die ersten Symbolwerte</summary>Ein Tannenbaum ist um 3 größer als eine Glocke. Zusammen ergeben sie 15. Also ist die Glocke 6 und der Tannenbaum 9. Berechne damit den Stern, das Geschenk und die Kerze.</details>
    <details><summary>Hinweis 3 – Vollständige Lösung</summary>Tannenbaum = 9, Glocke = 6, Stern = 5, Geschenk = 13, Kerze = 7. Letzte Rechnung: (13 + 5) × (6 + 6 − 7) + 9 = 18 × 5 + 9 = <strong>99</strong>.</details></div>
  </div>`;
  const q=id=>root.querySelector('#'+id);
  const inputs=[...root.querySelectorAll('[data-ws-number]')];
  const valid=()=>inputs.every(el=>el.value.trim()!==''&&Number.isInteger(Number(el.value)));
  const paint=()=>{q('wsCheck').disabled=!valid()||pending};
  root.addEventListener('input',e=>{if(e.target.matches('[data-ws-number]')){q('wsFeedback').textContent='';paint()}});
  q('wsReset').onclick=()=>{inputs.forEach(el=>el.value='');q('wsFeedback').textContent='';paint()};
  q('wsCheck').onclick=async()=>{
    if(pending||!valid())return;
    const feedback=q('wsFeedback');
    const actual=inputs.map(el=>Number(el.value));
    if(!actual.every((value,index)=>value===expected[index])){
      feedback.innerHTML='<div class="notice bad">Noch nicht richtig. Mindestens ein Wert stimmt nicht. Prüfe deine Rechnungen erneut.</div>';
      return;
    }
    pending=true;paint();
    try{
      const result=await submit('99');
      if(!result){feedback.innerHTML='<div class="notice bad">Die Rechnung ist richtig, aber die gespeicherte Lösung für Kapitel 3 stimmt noch nicht. Bitte in der Spielleitung als geheime Antwort 99 hinterlegen.</div>'}
    }catch(e){feedback.textContent='Der Spielstand konnte nicht gespeichert werden: '+e.message}
    finally{pending=false;if(q('wsCheck'))paint()}
  };
  paint();
}


const WINTERSTERN_CROSSWORD_04={"rows":12,"cols":20,"words":[{"answer":"AMEISENKUCHEN","row":6,"col":1,"dir":"H","clue":"Gugelhupf mit Schokostreuseln","number":10},{"answer":"ZIFFERNBLATT","row":0,"col":13,"dir":"V","clue":"Uhrfläche mit Zahlen oder Markierungen","number":1},{"answer":"TASCHENUHR","row":2,"col":11,"dir":"V","clue":"Zeitmesser für die Westentasche","number":5},{"answer":"APFELSAFT","row":3,"col":11,"dir":"H","clue":"Getränk aus gepresstem Obst","number":6},{"answer":"BAUMARKT","row":9,"col":9,"dir":"H","clue":"Fachgeschäft für Heimwerkerbedarf","number":13},{"answer":"UHRWERK","row":2,"col":3,"dir":"V","clue":"Mechanisches Innenleben eines Zeitmessers","number":4},{"answer":"BAMBERG","row":7,"col":13,"dir":"H","clue":"Universitätsstadt an der Regnitz","number":12},{"answer":"CABRIO","row":4,"col":0,"dir":"H","clue":"Fahrzeug mit versenkbarem Dach","number":8},{"answer":"MINUTE","row":2,"col":0,"dir":"H","clue":"Sechzig Sekunden","number":3},{"answer":"ARCHIV","row":6,"col":18,"dir":"V","clue":"Sammlung historischer Unterlagen","number":11},{"answer":"ZEIGER","row":0,"col":13,"dir":"H","clue":"Bewegliches Element auf einem Ziffernblatt","number":1},{"answer":"PENDEL","row":4,"col":7,"dir":"V","clue":"Schwingendes Teil einer Standuhr","number":9},{"answer":"CATAN","row":1,"col":19,"dir":"V","clue":"Spiel um Siedlungen und Rohstoffe","number":2},{"answer":"FEDER","row":11,"col":7,"dir":"H","clue":"Speichert Energie im Uhrwerk","number":14},{"answer":"SUP","row":3,"col":16,"dir":"V","clue":"Stehend paddeln, kurz","number":7}],"marks":[{"r":11,"c":18,"n":1},{"r":4,"c":4,"n":2},{"r":9,"c":16,"n":3},{"r":4,"c":3,"n":4},{"r":1,"c":13,"n":5},{"r":6,"c":7,"n":6},{"r":11,"c":8,"n":7}]};

/* Kapitel 4: Alle persönlichen Begriffe sind Teil des geprüften gemeinsamen
   Kreuzwortgitters. Keine Einzelwort- oder Zellrückmeldung vor der Prüfung. */
function mountCrossword(root, submit) {
  const data=WINTERSTERN_CROSSWORD_04;
  const {rows,cols,words,marks}=data;
  const expected=new Map(), cellWords=new Map(), numbers=new Map();
  words.forEach((w,id)=>{
    const start=`${w.row},${w.col}`;
    numbers.set(start,w.number);
    for(let k=0;k<w.answer.length;k++){
      const r=w.row+(w.dir==='V'?k:0),c=w.col+(w.dir==='H'?k:0),key=`${r},${c}`;
      if(expected.has(key)&&expected.get(key)!==w.answer[k])throw Error('Kreuzwortkonflikt '+key);
      expected.set(key,w.answer[k]);
      if(!cellWords.has(key))cellWords.set(key,[]);
      cellWords.get(key).push(id);
    }
  });
  const gold=new Map(marks.map(m=>[`${m.r},${m.c}`,m.n]));
  let selectedWord=null,selectedKey=null,pending=false;
  const inputs=new Map();
  root.innerHTML=`<div class="ws-puzzle ws-crossword"><div class="ws-kicker">ARCHIVAKTE 004 · AUSSTELLUNGSREGISTER</div>
    <h3>Namen im Schnee</h3><p>Löse die 15 Begriffe. Die sieben goldenen Felder ergeben in nummerierter Reihenfolge das Lösungswort.</p>
    <p class="ws-small">Klicke ein Feld oder einen Hinweis an. Erneutes Klicken auf ein Kreuzungsfeld wechselt die Schreibrichtung. Es wird erst nach vollständiger Eingabe geprüft.</p>
    <div class="ws-cw-layout"><div class="ws-cw-main"><div class="ws-cw-scroll"><div class="ws-cw-grid" id="wsCwGrid" role="group" aria-label="Kreuzworträtsel"></div></div>
    <div class="ws-cw-current" id="wsCwCurrent" aria-live="polite">Wähle ein Wort.</div><strong>Die sieben Lösungsbuchstaben</strong><div class="ws-cw-extract" id="wsCwExtract"></div>
    <div class="ws-check"><button type="button" id="wsCwCheck" disabled>Kreuzworträtsel prüfen</button> <button type="button" id="wsCwReset" class="alt">Eingaben löschen</button></div>
    <div id="wsCwFeedback" class="ws-feedback" aria-live="polite"></div></div>
    <div class="ws-cw-clues"><div><h4>Waagerecht</h4><div id="wsCwAcross"></div></div><div><h4>Senkrecht</h4><div id="wsCwDown"></div></div></div></div>
    <div class="ws-hints"><details><summary>Hinweis 1 – Einstieg</summary>Beginne mit den Begriffen, die dir sofort einfallen. Kreuzende Wörter teilen sich Buchstaben. Die Nummern in den goldenen Kästchen geben die Reihenfolge des Lösungsworts vor.</details>
    <details><summary>Hinweis 2 – Konkrete Hilfe</summary>„Fahrzeug mit versenkbarem Dach“ ergibt CABRIO; das Spiel mit Siedlungen und Rohstoffen heißt CATAN. Die Uhrfläche heißt ZIFFERNBLATT – mit n. Die Universitätsstadt an der Regnitz ist BAMBERG.</details>
    <details><summary>Hinweis 3 – Vollständige Lösung</summary>Alle Begriffe: APFELSAFT, BAMBERG, CABRIO, AMEISENKUCHEN, BAUMARKT, CATAN, SUP, ZIFFERNBLATT, TASCHENUHR, UHRWERK, PENDEL, ZEIGER, MINUTE, ARCHIV und FEDER. Das Lösungswort lautet <strong>VITRINE</strong>.<div id="wsCwSolution" class="ws-cw-solution"></div></details></div></div>`;
  const q=id=>root.querySelector('#'+id);
  const grid=q('wsCwGrid');grid.style.gridTemplateColumns=`repeat(${cols},var(--ws-cw-cell))`;
  function keysFor(id){const w=words[id];return Array.from({length:w.answer.length},(_,k)=>`${w.row+(w.dir==='V'?k:0)},${w.col+(w.dir==='H'?k:0)}`)}
  function activate(id,key,focus=true){
    selectedWord=id;selectedKey=key;
    const set=new Set(keysFor(id));
    grid.querySelectorAll('.ws-cw-cell').forEach(el=>{
      el.classList.toggle('ws-cw-active',set.has(el.dataset.key));
      el.classList.toggle('ws-cw-selected',el.dataset.key===key);
    });
    root.querySelectorAll('[data-ws-word]').forEach(el=>el.classList.toggle('ws-cw-clue-active',Number(el.dataset.wsWord)===id));
    const w=words[id];q('wsCwCurrent').textContent=`${w.number} ${w.dir==='H'?'waagerecht':'senkrecht'} · ${w.clue}`;
    if(focus)inputs.get(key)?.focus({preventScroll:true});
  }
  function select(key){const ids=cellWords.get(key)||[];if(!ids.length)return;
    let id=(selectedKey===key&&ids.length>1)?ids.find(v=>v!==selectedWord):ids.includes(selectedWord)?selectedWord:ids[0];
    activate(id,key);
  }
  function extracted(){q('wsCwExtract').innerHTML='';marks.slice().sort((a,b)=>a.n-b.n).forEach(m=>{
    const el=document.createElement('span');el.className='ws-cw-ex';
    const n=document.createElement('small');n.textContent=m.n;el.append(n,document.createTextNode(inputs.get(`${m.r},${m.c}`)?.value||'·'));q('wsCwExtract').appendChild(el);
  });}
  function ready(){return [...inputs.values()].every(i=>!!i.value)}
  function state(){q('wsCwCheck').disabled=!ready()||pending;q('wsCwFeedback').textContent=''}
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const key=`${r},${c}`,cell=document.createElement('div');cell.className='ws-cw-cell';cell.dataset.key=key;
    if(!expected.has(key)){cell.classList.add('ws-cw-block');grid.appendChild(cell);continue;}
    if(gold.has(key))cell.classList.add('ws-cw-gold');
    if(numbers.has(key)){const span=document.createElement('span');span.className='ws-cw-num';span.textContent=numbers.get(key);cell.append(span)}
    const input=document.createElement('input');input.type='text';input.maxLength=1;input.autocomplete='off';input.spellcheck=false;input.autocapitalize='characters';input.setAttribute('aria-label',`Zeile ${r+1}, Spalte ${c+1}`);
    input.addEventListener('focus',()=>{if(selectedKey!==key)select(key)});
    cell.addEventListener('click',()=>select(key));
    input.addEventListener('input',()=>{input.value=(input.value||'').toUpperCase().replace(/[^A-ZÄÖÜ]/g,'').slice(-1);state();extracted();if(input.value&&selectedWord!==null){const keys=keysFor(selectedWord),idx=keys.indexOf(key);if(idx>=0&&idx<keys.length-1)activate(selectedWord,keys[idx+1])}});
    input.addEventListener('keydown',e=>{if(selectedWord===null)return;const keys=keysFor(selectedWord),idx=keys.indexOf(key);let next=null;
      if(e.key==='Backspace'&&!input.value&&idx>0)next=keys[idx-1];
      else if((e.key==='ArrowRight'||e.key==='ArrowDown')&&idx<keys.length-1)next=keys[idx+1];
      else if((e.key==='ArrowLeft'||e.key==='ArrowUp')&&idx>0)next=keys[idx-1];
      if(next){e.preventDefault();activate(selectedWord,next)}
    });
    cell.appendChild(input);inputs.set(key,input);
    if(gold.has(key)){const n=document.createElement('span');n.className='ws-cw-mark';n.textContent=gold.get(key);cell.append(n)}
    grid.appendChild(cell);
  }
  for(const [dir,targetId] of [['H','wsCwAcross'],['V','wsCwDown']]){
    words.map((w,id)=>({...w,id})).filter(w=>w.dir===dir).sort((a,b)=>a.number-b.number).forEach(w=>{
      const btn=document.createElement('button');btn.type='button';btn.className='ws-cw-clue';btn.dataset.wsWord=w.id;
      btn.innerHTML=`<strong>${w.number}.</strong> ${w.clue} <small>(${w.answer.length})</small>`;
      btn.addEventListener('click',()=>activate(w.id,keysFor(w.id)[0]));q(targetId).appendChild(btn);
    });
  }
  q('wsCwReset').onclick=()=>{inputs.forEach(i=>i.value='');q('wsCwFeedback').textContent='';state();extracted()};
  q('wsCwCheck').onclick=async()=>{
    if(pending||!ready())return;
    const f=q('wsCwFeedback');
    if(![...expected].every(([key,val])=>inputs.get(key).value===val)){
      f.innerHTML='<div class="notice bad">Noch nicht richtig. Mindestens ein Buchstabe stimmt nicht. Einzelne Fehler werden nicht angezeigt.</div>';return;
    }
    pending=true;q('wsCwCheck').disabled=true;
    try{const ok=await submit('VITRINE');if(!ok)f.innerHTML='<div class="notice bad">Das Kreuzworträtsel ist richtig, aber die geheime Antwort für Kapitel 4 muss in der Spielleitung VITRINE lauten.</div>'}
    catch(e){f.textContent='Speichern fehlgeschlagen: '+e.message}
    finally{pending=false;if(q('wsCwCheck'))q('wsCwCheck').disabled=false}
  };
  q('wsCwSolution').textContent=Array.from({length:rows},(_,r)=>Array.from({length:cols},(_,c)=>expected.get(`${r},${c}`)||'■').join(' ')).join('\n');
  extracted();state();
}

/* Kapitel 5: Wegezeiten + Uhrabweichungen + Kontrollcode. Erst vollständige
   lokale Prüfung, dann die bestehende Supabase-Serverfunktion aufrufen. */
function mountClockCalibration(root,submit){
  const routes=['Empfang → Lager','Lager → Werkstatt','Werkstatt → Büro','Büro → Dunkelkammer'];
  const names=['Lager','Werkstatt-Nebenuhr','Büro','Dunkelkammer'];
  const times=['16:28','16:38','16:58','17:16'];
  const choices=[['-3','3 Minuten nach'],['-4','4 Minuten nach'],['-7','7 Minuten nach'],['-9','9 Minuten nach'],['+3','3 Minuten vor'],['+4','4 Minuten vor'],['+7','7 Minuten vor'],['+9','9 Minuten vor']];
  const expectedDurations=[11,14,9,13],expectedOffsets=['-3','-7','+4','+9'];
  let pending=false;
  root.innerHTML=`<div class="ws-puzzle ws-clock"><div class="ws-kicker">WERKSTATT WINTER · PRÜFPROTOKOLL 05</div><h3>Die Uhren, die alle etwas anderes behaupten</h3>
  <p>Johann Winter kontrolliert fünf Uhren. Die Empfangsuhr zeigt um <strong>16:20 Uhr</strong> die tatsächliche Zeit. Die übrigen Uhren haben konstante Abweichungen.</p><p><strong>Auftrag:</strong> Rekonstruiere die vier Wegzeiten, berechne die Abweichungen der Uhren und ermittle den Kontrollcode.</p>
  <div class="ws-clock-paper"><h4>Abgelesene Uhrzeiten</h4><table><thead><tr><th>Station</th><th>Uhrzeit laut Anzeige</th></tr></thead><tbody><tr><td>Empfang (richtig)</td><td>16:20</td></tr>${names.map((n,i)=>`<tr><td>${n}</td><td>${times[i]}</td></tr>`).join('')}</tbody></table><p class="ws-small">Alle Zeiten wurden bei der jeweiligen Station abgelesen; die Wegzeiten enthalten die Kontrollen.</p>
  <h4>Winters fünf Hinweise</h4><ol class="ws-list"><li>Der gesamte Kontrollgang dauerte <strong>47 Minuten</strong>.</li><li>Der erste und der dritte Abschnitt dauerten zusammen <strong>20 Minuten</strong>.</li><li>Der zweite Abschnitt dauerte <strong>3 Minuten länger als der erste</strong>.</li><li>Der letzte Abschnitt dauerte <strong>länger als der erste, aber kürzer als der zweite</strong>.</li><li>Zwischen dem längsten und dem kürzesten Abschnitt lagen genau <strong>5 Minuten</strong>.</li></ol><p class="ws-small">Alle Wegzeiten sind ganze positive Minuten.</p></div>
  <div class="ws-clock-section"><h4>Stufe 1 · Wegzeiten</h4><div class="ws-clock-fields">${routes.map((r,i)=>`<label>${i+1}. ${r}<input type="number" min="1" step="1" inputmode="numeric" autocomplete="off" placeholder="Minuten" data-ws-clock-minute="${i}"></label>`).join('')}</div></div>
  <div class="ws-clock-section"><h4>Stufe 2 · Uhrabweichungen</h4><p class="ws-small">Berechne die tatsächlichen Ankunftszeiten und vergleiche sie mit den Anzeigen.</p><div class="ws-clock-fields">${names.map((n,i)=>`<label>${n}<select data-ws-clock-offset="${i}"><option value="">Abweichung auswählen</option>${choices.map(([val,label])=>`<option value="${val}">${label}</option>`).join('')}</select></label>`).join('')}</div></div>
  <div class="ws-clock-section"><h4>Stufe 3 · Winters Kontrollcode</h4><p>Sortiere die vier fehlerhaften Uhren nach ihrer Abweichung: zuerst die am stärksten nachgehende, zuletzt die am stärksten vorgehende. Schreibe nur die vier Minutenzahlen hintereinander.</p><label>Vierstelliger Kontrollcode<input type="text" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off" id="wsClockCode" placeholder="0000"></label></div>
  <div class="ws-check"><button id="wsClockCheck" type="button" disabled>Kalibrierung prüfen</button> <button id="wsClockReset" type="button" class="alt">Zurücksetzen</button></div><div class="ws-feedback" id="wsClockFeedback" aria-live="polite"></div>
  <div class="ws-hints"><details><summary>Hinweis 1 – Mit vier Unbekannten rechnen</summary>Nenne die Wegzeiten A, B, C und D. A + C = 20 und B = A + 3. D liegt zwischen A und B. Weil alle Zeiten ganze Minuten sind, bleiben für D nur zwei Möglichkeiten.</details>
  <details><summary>Hinweis 2 – Der entscheidende Ausschluss</summary>D ist entweder A + 1 oder A + 2. Weil B + D = 27, führt D = A + 1 zu einer unzulässigen halben Minute. Es bleibt D = A + 2 und damit A = 11.</details>
  <details><summary>Hinweis 3 – Vollständige Lösung</summary>Wegzeiten: <strong>11, 14, 9, 13 Minuten</strong>. Uhrabweichungen: Lager 3 nach, Werkstatt 7 nach, Büro 4 vor, Dunkelkammer 9 vor. Der Kontrollcode lautet <strong>7349</strong>.</details></div></div>`;
  const q=id=>root.querySelector('#'+id);
  const mins=[...root.querySelectorAll('[data-ws-clock-minute]')];
  const offsets=[...root.querySelectorAll('[data-ws-clock-offset]')];
  const code=q('wsClockCode');
  const ready=()=>mins.every(x=>x.value.trim()!==''&&Number.isInteger(Number(x.value))&&Number(x.value)>0)&&offsets.every(x=>!!x.value)&&/^\d{4}$/.test(code.value);
  const paint=()=>{q('wsClockCheck').disabled=!ready()||pending};
  function change(){q('wsClockFeedback').textContent='';paint()}
  root.querySelectorAll('[data-ws-clock-minute], [data-ws-clock-offset], #wsClockCode').forEach(x=>{x.addEventListener('input',change);x.addEventListener('change',change)});
  q('wsClockReset').onclick=()=>{mins.forEach(x=>x.value='');offsets.forEach(x=>x.value='');code.value='';change()};
  q('wsClockCheck').onclick=async()=>{
    if(!ready()||pending)return;
    const f=q('wsClockFeedback');
    const ok=mins.every((x,i)=>Number(x.value)===expectedDurations[i])&&offsets.every((x,i)=>x.value===expectedOffsets[i])&&code.value==='7349';
    if(!ok){f.innerHTML='<div class="notice bad">Noch nicht richtig. Mindestens eine Angabe stimmt nicht. Überprüfe die Wegzeiten, die Uhrabweichungen und den Code.</div>';return}
    pending=true;paint();
    try{const saved=await submit('7349');if(!saved)f.innerHTML='<div class="notice bad">Die Kalibrierung ist korrekt, aber die geheime Antwort für Kapitel 5 muss in der Spielleitung 7349 lauten.</div>'}
    catch(e){f.textContent='Speichern fehlgeschlagen: '+e.message}
    finally{pending=false;if(q('wsClockCheck'))paint()}
  };
  paint();
}


/* Kapitel 6: Papierschnipsel werden außerhalb des Bildschirms zusammengesetzt.
   Der Spieler ordnet sechs Kontrollmarken chronologisch. Keine positionsweise
   Rückmeldung; ausschließlich die komplett richtige Folge wird über Supabase
   gespeichert. Geheime Antwort in der Spielleitung: 641829. */
function mountNewspaperMarks(root,submit){
  const marks=['1','2','4','6','8','9'];
  const target=['6','4','1','8','2','9'];
  let order=['','','','','',''],selected=0,pending=false;
  root.innerHTML=`<div class="ws-puzzle ws-newspaper">
    <div class="ws-kicker">ARCHIVAKTE 006 · FALKENBRÜCKER BOTE</div>
    <h3>Die sechs Kontrollmarken</h3>
    <p>Setze die zerrissene Zeitung wieder zusammen. In den kleinen Meldungen aus Werkstatt und Ausstellungsbüro findest du <strong>sechs Kontrollmarken</strong>, jeweils zusammen mit einer Uhr und einer Uhrzeit.</p>
    <div class="ws-bernd"><div class="ws-bernd-avatar" aria-hidden="true">B</div><div><strong>Bernd flüstert:</strong> „Moment mal … Lager, Werkstatt, Büro, Dunkelkammer? Die Räume kommen mir bekannt vor! Waren das nicht die Uhren, die alle falsch gingen? Ich hoffe, du hast dir die Abweichungen gemerkt. Ich jedenfalls nicht.“</div></div>
    <p><strong>Dein Auftrag:</strong> Ermittle die tatsächlichen Uhrzeiten und sortiere die sechs Kontrollmarken vom frühesten bis zum spätesten Vorgang. Die Kalibrierungsnotiz aus Kapitel 5 findest du jederzeit im <strong>Archiv</strong> oben in der Navigation.</p>
    <p class="ws-small">Ein Hinweis zur Lesart: Eine „Kontrollmarke“ ist die Kennzahl eines Vorgangs – nicht die Nummer einer Uhr. Die Reihenfolge auf der Zeitungsseite spielt keine Rolle.</p>
    <div class="ws-mark-order" id="wsMarkOrder" role="group" aria-label="Chronologische Reihenfolge der sechs Kontrollmarken"></div>
    <div class="ws-mark-picker-title" id="wsMarkTitle">Erste Position auswählen</div>
    <div class="ws-mark-choice" id="wsMarkChoice"></div>
    <div class="ws-check"><button type="button" id="wsMarkCheck" disabled>Reihenfolge prüfen</button> <button type="button" id="wsMarkReset" class="alt">Zurücksetzen</button></div>
    <div class="ws-feedback" id="wsMarkFeedback" aria-live="polite"></div>
    <div class="ws-hints">
      <details><summary>Hinweis 1 – Wo soll ich suchen?</summary>Die sechs Kennzahlen stehen in kurzen Meldungen über die Vorbereitungen der Winterausstellung. Zu jeder gehört eine abgelesene Uhrzeit. Die angezeigte Zeit ist nicht unbedingt die tatsächliche.</details>
      <details><summary>Hinweis 2 – So korrigierst du die Zeit</summary>Die Lageruhr geht drei Minuten nach: zu ihrer angezeigten Uhrzeit addierst du drei Minuten. Die Bürouhr geht vier Minuten vor: dort ziehst du vier Minuten ab. Kontrollmarke 6 liegt nach der Korrektur bei 14:02 Uhr und ist der früheste Vorgang.</details>
      <details><summary>Hinweis 3 – Vollständige Lösung</summary>Nach Korrektur: Marke 6 = 14:02, Marke 4 = 14:11, Marke 1 = 14:19, Marke 8 = 14:27, Marke 2 = 14:36, Marke 9 = 14:48. Richtige Reihenfolge: <strong>6 – 4 – 1 – 8 – 2 – 9</strong>. Der sechsstellige Code lautet <strong>641829</strong>.</details>
    </div>
  </div>`;
  const q=id=>root.querySelector('#'+id);
  function paint(){
    q('wsMarkOrder').innerHTML=order.map((m,i)=>`<button type="button" class="ws-mark-slot ${selected===i?'active':''}" data-mark-slot="${i}" aria-pressed="${selected===i}" aria-label="Position ${i+1}: ${m||'unbelegt'}"><small>${i+1}.</small><strong>${m||'?'}</strong></button>`).join('');
    q('wsMarkTitle').textContent=`Position ${selected+1}: Kontrollmarke auswählen`;
    q('wsMarkChoice').innerHTML=marks.map(m=>`<button type="button" data-mark-value="${m}" class="${order[selected]===m?'active':''}">${m}</button>`).join('');
    q('wsMarkCheck').disabled=order.some(v=>!v)||pending;
  }
  root.addEventListener('click',e=>{
    const slot=e.target.closest('[data-mark-slot]'),mark=e.target.closest('[data-mark-value]');
    if(slot){selected=Number(slot.dataset.markSlot);q('wsMarkFeedback').textContent='';paint()}
    if(mark){const val=mark.dataset.markValue;
      order=order.map((v,i)=>i===selected?val:v===val?'':v);
      q('wsMarkFeedback').textContent='';
      const nextEmpty=order.findIndex(x=>!x);
      if(nextEmpty>=0)selected=nextEmpty;
      paint();
    }
  });
  q('wsMarkReset').onclick=()=>{order=['','','','','',''];selected=0;q('wsMarkFeedback').textContent='';paint()};
  q('wsMarkCheck').onclick=async()=>{
    if(pending||order.some(v=>!v))return;
    const fb=q('wsMarkFeedback');
    if(!target.every((v,i)=>order[i]===v)){
      fb.innerHTML='<div class="notice bad">Noch nicht richtig. Mindestens eine Kontrollmarke steht an der falschen Stelle. Einzelne Positionen werden nicht bewertet.</div>';return;
    }
    pending=true;paint();
    try{
      const saved=await submit('641829');
      if(!saved)fb.innerHTML='<div class="notice bad">Die Reihenfolge stimmt, aber die geheime Antwort für Kapitel 6 muss in der Spielleitung 641829 lauten.</div>';
    }catch(e){fb.textContent='Speichern fehlgeschlagen: '+e.message}
    finally{pending=false;if(q('wsMarkCheck'))paint()}
  };
  paint();
}


/* Kapitel 7 – historisches Zahlenschloss. Lokale Gesamtprüfung, erst dann Supabase. */
function mountVisitorLock(root,submit){
  const trials=[
    {code:'8103',placed:0,misplaced:1},
    {code:'5960',placed:0,misplaced:0},
    {code:'9768',placed:0,misplaced:2},
    {code:'2675',placed:0,misplaced:2},
    {code:'9870',placed:0,misplaced:2},
    {code:'7492',placed:1,misplaced:2}
  ];
  let wheels=[null,null,null,null],busy=false,open=false;
  const note=(t,i)=>`<article class="ws7-slip ws7-slip-${i+1}" aria-label="Archivnotiz ${i+1}">
    <span class="ws7-slip-index">Öffnungsversuch ${String(i+1).padStart(2,'0')}</span>
    <strong class="ws7-slip-code">${t.code}</strong>
    <div class="ws7-pen-rule"></div>
    <div class="ws7-slip-info"><span><i class="ws7-indicator" aria-hidden="true">●</i> ${t.placed} richtig platziert</span><span><i class="ws7-indicator ws7-indicator-amber" aria-hidden="true">↔</i> ${t.misplaced} am falschen Platz</span></div>
  </article>`;
  root.innerHTML=`<section class="ws-puzzle ws-lock7">
    <div class="ws7-topline"><span>AKTE VII · BESUCHERREGISTER</span><span>FALKENBRÜCK · 1928</span></div>
    <h3>Das verschlossene Besucherregister</h3>
    <p>Vier Zahlen verschließen das Register. Sechs frühere Versuche wurden auf kleinen Archivzetteln festgehalten. Finde die einzige Kombination, die zu allen Notizen passt.</p>
    <div class="ws7-brief"><strong>Regeln des Archivars:</strong> Vier verschiedene Ziffern, keine Null am Anfang. „Richtig platziert“ zählt die richtige Ziffer am richtigen Platz. „Falscher Platz“ zählt eine im Code vorkommende Ziffer an einer anderen Stelle. Alle Angaben sind exakt.</div>
    <div class="ws7-scene">
      <div class="ws7-lockzone">
        <div class="ws7-label">REGISTERSCHRANK Nº 07</div>
        <div class="ws7-lock-illustration" id="ws7LockGraphic">
          <svg class="ws7-bow" viewBox="0 0 290 150" role="img" aria-label="Alter Schlossbügel aus Metall"><defs><linearGradient id="ws7metal" x1="0" x2="1"><stop offset="0" stop-color="#40362b"/><stop offset=".2" stop-color="#e8d4a1"/><stop offset=".43" stop-color="#887345"/><stop offset=".75" stop-color="#d0b478"/><stop offset="1" stop-color="#3f3425"/></linearGradient></defs><path d="M71 146V84C71-12 219-12 219 84V146" fill="none" stroke="#352a21" stroke-width="30" stroke-linejoin="round"/><path d="M71 146V84C71-12 219-12 219 84V146" fill="none" stroke="url(#ws7metal)" stroke-width="23" stroke-linejoin="round"/><path d="M78 129V84C78 8 212 8 212 84V129" fill="none" stroke="#fff4ce" stroke-width="3" opacity=".6"/></svg>
          <div class="ws7-lock-body"><span class="ws7-rivet ws7-rivet-a"></span><span class="ws7-rivet ws7-rivet-b"></span><span class="ws7-rivet ws7-rivet-c"></span><span class="ws7-rivet ws7-rivet-d"></span>
            <div class="ws7-engraving">J. WINTER <span>·</span> FALKENBRÜCK</div>
            <div class="ws7-wheel-board" role="group" aria-label="Vier Zahlenwalzen">
              ${[0,1,2,3].map(i=>`<div class="ws7-wheel-set"><button type="button" data-ws7-up="${i}" class="ws7-wheel-arrow" aria-label="Ziffer ${i+1} erhöhen">▲</button><div class="ws7-wheel" id="ws7Digit${i}" aria-label="Ziffer ${i+1} noch nicht gewählt">—</div><button type="button" data-ws7-down="${i}" class="ws7-wheel-arrow" aria-label="Ziffer ${i+1} verringern">▼</button></div>`).join('')}
            </div>
            <div class="ws7-lock-footer">SCHLOSSWERK 1928 <span>IV · 07</span></div>
          </div>
          <div class="ws7-open-seal" id="ws7OpenSeal" hidden><strong>GEÖFFNET</strong><small>Archivzugang freigegeben</small></div>
        </div>
        <div class="ws7-controls"><button type="button" id="ws7Reset" class="ws7-reset">↺ &nbsp; Zurücksetzen</button><button type="button" id="ws7Check" class="ws7-check" disabled>Schloss prüfen</button></div>
        <div class="ws7-feedback" id="ws7Feedback" aria-live="polite"></div>
        <p class="ws7-quiet">Es erfolgt keine Kontrolle einzelner Zahlen. Erst wenn alle vier eingestellt sind, wird die gesamte Kombination geprüft.</p>
      </div>
      <div class="ws7-noteboard"><div class="ws7-noteboard-head"><span>HINTERLASSENE NOTIZEN</span><span>6 Versuche</span></div><div class="ws7-slips">${trials.map(note).join('')}</div><p class="ws7-pencilnote">Anmerkung des Archivars: Nicht genannte Ziffern wurden beim jeweiligen Versuch nicht erkannt.</p></div>
    </div>
    <div class="ws7-bernd"><div class="ws7-bernd-mark">B</div><p>„Vier Zahlenräder und sechs missglückte Versuche. Ich hätte das Schloss ja längst geöffnet, aber ich wollte dir schließlich auch etwas Arbeit übrig lassen.“ <em>– Bernd</em></p></div>
    <div class="ws7-hints"><h4>Falls du Unterstützung brauchst</h4><details><summary>Hinweis 1 – Ziffern ausschließen</summary><p>Beginne mit 5960. Hier stimmt keine Ziffer. Deshalb kommen 5, 9, 6 und 0 im Code nicht vor.</p></details><details><summary>Hinweis 2 – Die Position der 8</summary><p>Aus 9768 und 2675 folgt, dass 7, 8 und 2 im Code vorkommen. In den Versuchen 8103, 9870 und 9768 ist die 8 jeweils falsch platziert. Für sie bleibt nur die dritte Stelle.</p></details><details><summary>Hinweis 3 – Vollständige Lösung</summary><p>Die gesuchte Kombination ist <strong>7284</strong>. Stelle die vier Walzen entsprechend ein und klicke auf „Schloss prüfen“.</p></details></div>
  </section>`;
  const q=id=>root.querySelector('#'+id);
  const isReady=()=>wheels.every(x=>x!==null)&&wheels[0]!==0&&new Set(wheels).size===4;
  function paint(){wheels.forEach((v,i)=>{const el=q('ws7Digit'+i);el.textContent=v===null?'—':String(v);el.setAttribute('aria-label',`Ziffer ${i+1}: ${v===null?'noch nicht gewählt':v}`)});q('ws7Check').disabled=!isReady()||busy||open;q('ws7Reset').disabled=busy||open;}
  function adjust(i,direction){if(busy||open)return;wheels[i]=wheels[i]===null?(direction>0?0:9):(wheels[i]+direction+10)%10;q('ws7Feedback').textContent='';paint()}
  root.querySelectorAll('[data-ws7-up]').forEach(el=>el.addEventListener('click',()=>adjust(Number(el.dataset.ws7Up),1)));
  root.querySelectorAll('[data-ws7-down]').forEach(el=>el.addEventListener('click',()=>adjust(Number(el.dataset.ws7Down),-1)));
  q('ws7Reset').addEventListener('click',()=>{wheels=[null,null,null,null];q('ws7Feedback').textContent='';paint()});
  q('ws7Check').addEventListener('click',async()=>{
    if(!isReady()||busy||open)return;
    const fb=q('ws7Feedback');
    if(wheels.join('')!=='7284'){fb.innerHTML='<div class="ws7-error"><strong>Das Schloss bleibt verschlossen.</strong><span>Die Kombination ist noch nicht richtig. Welche Stelle falsch ist, wird nicht verraten.</span></div>';return;}
    busy=true;paint();
    try{const ok=await submit('7284');if(ok){open=true;if(q('ws7LockGraphic'))q('ws7LockGraphic').classList.add('ws7-unlocked');if(q('ws7OpenSeal'))q('ws7OpenSeal').hidden=false;if(q('ws7Feedback'))q('ws7Feedback').innerHTML='<div class="ws7-success"><strong>Klack. Das Schloss springt auf.</strong><span>Das Besucherregister wurde freigegeben.</span></div>';}else{fb.innerHTML='<div class="ws7-error"><strong>Die Kombination stimmt.</strong><span>Die hinterlegte geheime Antwort für Kapitel 7 muss in der Spielleitung 7284 lauten.</span></div>'}}
    catch(e){fb.textContent='Spielstand konnte nicht gespeichert werden: '+e.message}
    finally{busy=false;if(q('ws7Check'))paint()}
  });
  paint();
}

/* Kapitel 8: Logikregister + manuelle Caesar-Chiffre. Die historische Schlüsselwand bleibt. */
function mountLocksmithBoard(root,submit){
 const keys=[
  {n:1,teeth:[2,4,1,3,2],groove:1,shoulder:14,bow:0,face:0},
  {n:2,teeth:[2,4,1,3,2],groove:2,shoulder:14,bow:1,face:0},
  {n:3,teeth:[2,4,2,3,2],groove:2,shoulder:14,bow:2,face:0},
  {n:4,teeth:[2,4,1,3,2],groove:2,shoulder:12,bow:3,face:0},
  {n:5,teeth:[2,4,1,3,2],groove:0,shoulder:14,bow:4,face:0},
  {n:6,teeth:[2,3,1,4,2],groove:2,shoulder:14,bow:5,face:1},
  {n:7,teeth:[1,4,2,3,2],groove:2,shoulder:14,bow:6,face:0}
 ];
 const areas=[['E','Eingang'],['L','Lager'],['B','Büro'],['A','Archiv'],['D','Dunkelkammer'],['V','Vitrine']];
 const answer=['E','V','L','B','A','V','D'];
 const names=['Marta Seidel','Friedrich Keller','Konrad Voss','Nora Weiss','Johann Winter','Elise Brandt','Ernst Albrecht'];
 const encode=s=>s.toUpperCase().replace(/[A-Z]/g,c=>String.fromCharCode(65+(c.charCodeAt(0)-65+3)%26));
 const records=names.map((name,i)=>({n:i+1,encoded:encode(name)}));
 const ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 let chosen=1,assignment=Array(7).fill(''),shift=0,busy=false,solved=false;
 const q=id=>root.querySelector('#'+id);
 const shape=(k,mirrored=false,scaled=false)=>{
   const height=scaled?252:180, width=scaled?112:80;
   const shx=width/2,top=scaled?44:31,bot=height-33;
   const teeth=mirrored?[...k.teeth].reverse():k.teeth;
   // Five distinct steps projected from the key shaft toward the right edge.
   const levels=teeth.map((t,i)=>`${shx+8+t*6},${bot-63+i*12}`);
   const outline=`M${shx+8},${bot-67} L${levels[0]} `+levels.map((p,i)=>`${i===0?'':'L'}${p} L${shx+8+teeth[i]*6},${bot-55+i*12}`).join(' ')+` L${shx+8},${bot+2} Z`;
   const flourishes=['M-11 -2q11 -18 22 0 M-10 5q10 13 20 0','M-11 0a11 11 0 1 0 22 0a11 11 0 1 0-22 0','M-10 -4q10 -16 20 0q-10 16-20 0','M-11 1h22m-11-11v22','M0-12l4 8 9 2-6 7 1 9-8-4-8 4 1-9-6-7 9-2z','M-10 0q10-20 20 0q-10 20-20 0','M-9-9l18 18m0-18l-18 18'][k.bow];
   return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Schlüssel ${k.n}; gravierte Nummer ${k.n}" class="ws8-key-svg">
    <defs><linearGradient id="ws8gold${k.n}${scaled?'b':'s'}" x1="0" x2="1"><stop stop-color="#624522"/><stop offset=".26" stop-color="#d5b679"/><stop offset=".55" stop-color="#f5d99b"/><stop offset=".82" stop-color="#8b602e"/><stop offset="1" stop-color="#3e2b1c"/></linearGradient></defs>
    <g fill="none" stroke="url(#ws8gold${k.n}${scaled?'b':'s'})" stroke-width="7" stroke-linejoin="round"><circle cx="${shx}" cy="${top}" r="21"/><g transform="translate(${shx} ${top})" stroke-width="3">${`<path d="${flourishes}"/>`}</g></g>
    <rect x="${shx-5}" y="${top+22}" width="10" height="${bot-top-19}" rx="2" fill="url(#ws8gold${k.n}${scaled?'b':'s'})" stroke="#604522" stroke-width="1.5"/>
    <path d="${outline}" fill="url(#ws8gold${k.n}${scaled?'b':'s'})" stroke="#5c4427" stroke-width="1.5" stroke-linejoin="round" />
    <rect x="${shx-9}" y="${bot-84}" width="21" height="${k.shoulder===14?8:5}" rx="2" fill="#927044" stroke="#e9c78b" stroke-width="1"/>
    ${k.groove?`<rect x="${shx+3}" y="${bot-82+k.groove*8}" width="5" height="8" rx="1" fill="#3e2c1e"/>`:''}
   </svg>`;
 };

 root.innerHTML=`<section class="ws-puzzle ws-locksmith8 ws8-logic">
  <div class="ws8-kicker">FALKENBRÜCKER SCHLOSSEREI · AUSGABEBUCH 1928</div>
  <h3>Das Geheimnis des Schließbuchs</h3>
  <p>Das Register enthält sieben nummerierte Schlüssel: einer für den Eingang, einer für das Lager, einer für das Büro, einer für das Archiv, einer für die Dunkelkammer und <strong>zwei für die Ausstellungsvitrine</strong>. Welche Nummer gehört wohin? Die Form der Schlüssel hilft hierbei <strong>nicht</strong> – entscheidend sind die sechs überlieferten Registerhinweise.</p>
  <div class="ws8-bernd"><strong>Bernd:</strong> „Die Schlüssel habe ich ordentlich aufgehängt. Die Zuordnungen habe ich allerdings nicht mehr im Kopf. Vielleicht liegt das an den hundert Jahren dazwischen.“</div>
  <div class="ws8-stage">
   <div class="ws8-cork-frame"><div class="ws8-cork-head"><strong>SCHLÜSSELBRETT</strong><span>Haken 1–7 · Schlosserei</span></div><div class="ws8-hooks" id="ws8Hooks"></div>
    <div class="ws8-cork-notes"><div class="ws8-note"><span class="ws8-pin"></span><strong>REGISTER-VORSCHRIFT</strong><span>Jeder Bereich hat genau einen Schlüssel – nur die Vitrine hat zwei.</span><small>Die Hakenreihenfolge ist unverändert.</small></div><div class="ws8-note ws8-note-2"><span class="ws8-pin"></span><strong>VERMERK DES SCHLOSSERS</strong><span>Die Griffverzierungen sind nicht relevant. Ausschlaggebend ist allein die Zuordnung im Register.</span><small>Kein technischer Schablonenvergleich.</small></div></div>
   </div>
   <div class="ws8-workbench"><div class="ws8-work-head"><span>SCHLÜSSELAKTEN</span><small>Ermittlungsbogen</small></div>
    <div class="ws8-workpaper"><strong id="ws8Current">Haken 1</strong><div class="ws8-key-detail" id="ws8Detail"></div>
     <p class="ws8-quiet">Du kannst die sieben Schlüssel an der Wand einzeln betrachten. Die Zuordnung erfolgt unten im Schließregister.</p>
     <div class="ws8-current-assignment" id="ws8CurrentAssignment"></div>
    </div>
   </div>
  </div>
  <div class="ws8-ledger ws8-logic-ledger"><div class="ws8-book-head">BESCHÄDIGTES SCHLIESSBUCH <small>Beilage V–14 · 1928</small></div>
   <p>Sechs überlieferte Randvermerke schränken die ursprüngliche Hakenordnung ein. <strong>Alle Angaben gelten gleichzeitig.</strong></p>
   <ol class="ws8-logic-clues">
    <li>Der <strong>Eingangsschlüssel</strong> hing vor beiden Vitrinenschlüsseln.</li>
    <li>Der Eingangsschlüssel hing außerdem vor dem <strong>Lagerschlüssel</strong>.</li>
    <li>Der <strong>Archivschlüssel</strong> hing genau zwei Haken rechts vom Lagerschlüssel.</li>
    <li>Der Schlüssel zur <strong>Dunkelkammer</strong> hing an einem Haken mit ungerader Nummer.</li>
    <li>Zwischen dem <strong>Archivschlüssel</strong> und dem <strong>Dunkelkammer-Schlüssel</strong> hing der Vitrinenschlüssel mit der höheren Hakennummer.</li>
    <li>Der <strong>Büroschlüssel</strong> hing genau zwei Haken vom Vitrinenschlüssel mit der höheren Nummer entfernt.</li>
   </ol>
   <div class="ws8-logic-grid" aria-label="Zuordnung der sieben Schlüssel zu Räumen">${keys.map(k=>`<label class="ws8-assign"><span>Haken <b>${k.n}</b></span><select id="ws8Area${k.n}" aria-label="Bereich für Schlüssel ${k.n}"><option value="">– Bereich wählen –</option>${areas.map(a=>`<option value="${a[0]}">${a[1]}</option>`).join('')}</select></label>`).join('')}</div>
   <p class="ws8-quiet">Jeder der fünf übrigen Bereiche kommt einmal vor, die Vitrine zweimal. Es gibt nur eine vollständige Anordnung, die alle sechs Vermerke erfüllt.</p>
  </div>
  <div class="ws8-ledger"><div class="ws8-book-head">VERSCHLÜSSELTES AUSGABEBUCH <small>Einträge nach Hakennummer</small></div>
   <p>Die Namen sind nach demselben Alphabetversatz verschlüsselt. Am Rand steht das Kontrollpaar <strong>VITRINE ↔ YLWULQH</strong>. Ermittle den Versatz, verwende die <strong>Alphabetstreifen</strong> und entziffere selbst die Namen zu den beiden Vitrinenschlüsseln. Die Scheibe übersetzt keine Namen automatisch.</p>
   <div class="ws8-wheel"><button type="button" id="ws8ShiftDown" aria-label="Alphabetverschiebung zurück">◀</button><div><small>ALPHABETVERSATZ</small><strong id="ws8Shift">0</strong></div><button type="button" id="ws8ShiftUp" aria-label="Alphabetverschiebung vorwärts">▶</button></div>
   <div class="ws8-alpha"><div><small>KLARTEXT</small><code>${ABC}</code></div><div><small>GEHEIMTEXT</small><code id="ws8Alphabet"></code></div></div>
   <div class="ws8-ledger-scroll"><table><thead><tr><th>Haken</th><th>Verschlüsselter Name</th></tr></thead><tbody>${records.map(r=>`<tr><td>${r.n}</td><td class="ws8-encoded">${r.encoded}</td></tr>`).join('')}</tbody></table></div>
   <p class="ws8-quiet">Die Buchstaben werden mit dem Alphabetversatz ersetzt. Leerzeichen bleiben erhalten. Trage nur die beiden gesuchten, selbst entzifferten Namen ein.</p>
   <div class="ws8-names"><label>Name zum kleineren Vitrinenschlüssel<input id="ws8NameLow" autocomplete="off" placeholder="Vor- und Nachname"></label><label>Name zum größeren Vitrinenschlüssel<input id="ws8NameHigh" autocomplete="off" placeholder="Vor- und Nachname"></label></div>
  </div>
  <div class="ws8-submit"><div><strong>Ermittlungsbefund</strong><span>Alle sieben Schlüssel zuordnen, beide Namen eintragen, dann gemeinsam prüfen.</span></div><div><button type="button" id="ws8Reset" class="alt">Zurücksetzen</button> <button type="button" id="ws8Check">Gesamten Befund prüfen</button></div></div>
  <div id="ws8Feedback" aria-live="polite"></div>
  <div class="ws8-hints"><h4>Hinweise</h4>
   <details><summary>Hinweis 1 – Eine Reihenfolge finden</summary>Schreibe E, L, B, A, D und zweimal V auf. Die beiden Vitrinenschlüssel sind unterscheidbar: der kleinere und der größere Haken. Suche zunächst nach Positionen, die für Eingang und Dunkelkammer überhaupt noch möglich sind.</details>
   <details><summary>Hinweis 2 – Zwei Vermerke kombinieren</summary>Das Archiv liegt zwei Haken rechts vom Lager. Zwischen Archiv und Dunkelkammer liegt der zweite Vitrinenschlüssel. Wenn du diese drei Hinweise miteinander verknüpfst und den ungeraden Dunkelkammer-Haken berücksichtigst, bleiben nur wenige Möglichkeiten.</details>
   <details><summary>Hinweis 3 – Ausgabebuch entschlüsseln</summary>Die eindeutige Hakenfolge lautet <strong>Eingang – Vitrine – Lager – Büro – Archiv – Vitrine – Dunkelkammer</strong>. Nutze für die Namen der Haken <strong>2 und 6</strong> das Kontrollpaar VITRINE ↔ YLWULQH; der Alphabetversatz beträgt drei Buchstaben. Die Namen werden nicht automatisch eingeblendet.</details>
  </div>
 </section>`;
 const renderBoard=()=>{
  q('ws8Hooks').innerHTML=keys.map(k=>`<button type="button" class="ws8-hook-slot ${chosen===k.n?'ws8-current':''}" data-ws8-key="${k.n}" aria-pressed="${chosen===k.n}" aria-label="Schlüssel ${k.n} ansehen"><span class="ws8-hook-tag">${k.n}</span><span class="ws8-brass-hook"></span><span class="ws8-hang-key">${shape(k)}</span><span class="ws8-hook-label">HAKEN ${k.n}</span></button>`).join('');
  q('ws8Current').textContent=`Schlüssel an Haken ${chosen}`;
  q('ws8Detail').innerHTML=`<div class="ws8-detail-figure">${shape(keys[chosen-1],false,true)}</div><span class="ws8-detail-tag">NR. ${chosen}</span>`;
  q('ws8CurrentAssignment').textContent='Zuordnung: '+(areas.find(a=>a[0]===assignment[chosen-1])?.[1]||'noch offen');
 };
 const paintShift=()=>{q('ws8Shift').textContent=shift;q('ws8Alphabet').textContent=ABC.slice(shift)+ABC.slice(0,shift)};
 root.addEventListener('click',e=>{const k=e.target.closest('[data-ws8-key]');if(k){chosen=Number(k.dataset.ws8Key);renderBoard()}});
 keys.forEach(k=>q('ws8Area'+k.n).addEventListener('change',e=>{assignment[k.n-1]=e.target.value;if(chosen===k.n)renderBoard();q('ws8Feedback').textContent=''}));
 q('ws8ShiftUp').onclick=()=>{shift=(shift+1)%26;paintShift()};
 q('ws8ShiftDown').onclick=()=>{shift=(shift+25)%26;paintShift()};
 q('ws8Reset').onclick=()=>{assignment.fill('');keys.forEach(k=>q('ws8Area'+k.n).value='');shift=0;chosen=1;q('ws8NameLow').value='';q('ws8NameHigh').value='';q('ws8Feedback').textContent='';paintShift();renderBoard()};
 const normalize=s=>s.toUpperCase().trim().replace(/\s+/g,' ').replace(/Ä/g,'AE').replace(/Ö/g,'OE').replace(/Ü/g,'UE').replace(/ß/g,'SS');
 q('ws8Check').onclick=async()=>{
  if(busy||solved)return;
  const a=assignment;
  if(a.some(x=>!x)){q('ws8Feedback').innerHTML='<p class="ws8-warning">Ordne zunächst alle sieben Schlüssel zu. Einzelne Einträge werden nicht bewertet.</p>';return;}
  const counts=areas.map(([key])=>a.filter(x=>x===key).length);
  if(counts.some((n,i)=>n!==(areas[i][0]==='V'?2:1))){q('ws8Feedback').innerHTML='<p class="ws8-warning">Jeder Bereich braucht genau einen Schlüssel, nur die Vitrine zwei.</p>';return;}
  if(!a.every((x,i)=>x===answer[i])||shift!==3||normalize(q('ws8NameLow').value)!=='FRIEDRICH KELLER'||normalize(q('ws8NameHigh').value)!=='ELISE BRANDT'){
   q('ws8Feedback').innerHTML='<p class="ws8-warning">Der Gesamtbefund ist noch nicht stimmig. Prüfe Hakenfolge, Alphabetversatz und beide Namen. Die fehlerhafte Teilaufgabe wird nicht verraten.</p>';return;
  }
  busy=true;q('ws8Check').disabled=true;
  try{const ok=await submit('KELLER-BRANDT');if(ok){solved=true;q('ws8Feedback').innerHTML='<p class="ws8-success">Schließbuch rekonstruiert. Friedrich Keller und Elise Brandt waren zwei verzeichnete Schlüsselberechtigte. Das belegt noch keine Verwendung des Schlüssels.</p>'}else{q('ws8Feedback').innerHTML='<p class="ws8-warning">Die Lösung stimmt. Trage in der Spielleitung für Kapitel 8 die geheime Antwort KELLER-BRANDT ein.</p>'}}
  catch(e){q('ws8Feedback').textContent='Speichern fehlgeschlagen: '+e.message}
  finally{busy=false;if(!solved)q('ws8Check').disabled=false}
 };
 paintShift();renderBoard();
}

/* Kapitel 09 · Das Nonogramm der Vorführungsmappe
   20×20, einmalige Lösung (per MILP über alle Zeilen-/Spaltenmuster überprüft).
   Rückmeldungen ausschließlich nach vollständigem Prüfklick. */
function mountNonogram9(root,submit){
 const N=20;
 const rows=[[2],[6],[2],[4],[6],[2,5],[4],[8],[2,7],[8,3],[6],[1,6,1],[6,5],[14],[6,3,5],[4,8,4],[20],[4],[4],[6]];
 const cols=[[1],[2],[3],[4],[1,5],[2,4,1],[1,3,5],[1,2,1,8,1],[1,2,8,5],[20],[12,7],[1,17],[1,2,2,4,2,1],[1,3,5],[2,4,1],[1,5],[4],[3],[2],[1]];
 const answer=[[0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,0,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,0,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,1,0,1,1,1,1,1,1,0,1,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,0],[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],[0,0,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,0],[0,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0]];
 const cells=Array.from({length:N},()=>Array(N).fill(0)); // 0 leer, 1 ausgefüllt, 2 X
 let mode=1,pending=false,finished=false,history=[];
 root.innerHTML=`<section class="ws-puzzle ws-nonogram9">
  <div class="ws9-overline">FALKENBRÜCK · VORFÜHRUNGSMAPPE · BLATT 09</div>
  <h3>Das Zeichen der Vorführungsmappe</h3>
  <p>Zwischen Martas Aufzeichnungen liegt ein kariertes Blatt. Statt einer Zeichnung enthält es nur Zahlen an den Rändern. Welche Kennzeichnung verbirgt sich im Raster?</p>
  <div class="ws9-bernd"><strong>Bernd:</strong> „Zwanzig Kästchen in jede Richtung! Ich wollte ja mithelfen, aber mein Stift ist leider plötzlich verschwunden. Unter meiner Mütze ist er jedenfalls nicht.“</div>
  <div class="ws9-instructions"><div class="ws9-stamp">WERKSTATT WINTER<br>14. DEZ. 1928</div><div><strong>So liest du das Raster</strong><p>Jede Zahl bezeichnet eine zusammenhängende Gruppe ausgefüllter Kästchen. Mehrere Zahlen in einer Reihe bedeuten mehrere Gruppen – dazwischen bleibt mindestens ein Kästchen frei. Die Zahlen stehen in der richtigen Reihenfolge. Das gilt sowohl waagerecht als auch senkrecht.</p><p>Markiere die passenden Felder. Mit <b>× Leer</b> kannst du ausgeschlossene Kästchen kennzeichnen. Es werden keine einzelnen Reihen bewertet.</p></div></div>
  <div class="ws9-toolbars"><div class="ws9-modes" role="group" aria-label="Zeichenwerkzeug"><button type="button" id="ws9Fill" class="ws9-mode active" aria-pressed="true">■ Ausfüllen</button><button type="button" id="ws9Cross" class="ws9-mode" aria-pressed="false">× Leer markieren</button></div><div class="ws9-tools"><button type="button" class="alt" id="ws9Undo">↶ Rückgängig</button><button type="button" class="alt" id="ws9Reset">Neu beginnen</button></div></div>
  <div class="ws9-scroll-label">Auf kleineren Bildschirmen kannst du das Blatt seitlich verschieben.</div>
  <div class="ws9-board-scroll" tabindex="0" aria-label="Nonogramm seitlich verschiebbar"><div class="ws9-paper"><div class="ws9-grid" id="ws9Grid" role="group" aria-label="Nonogramm mit 20 Zeilen und 20 Spalten"></div></div></div>
  <div class="ws9-bottom"><div class="ws9-status"><div class="ws9-ink-dot"></div><span id="ws9Count">0 Kästchen ausgefüllt</span></div><button type="button" id="ws9Check" disabled>Vollständiges Bild prüfen</button></div>
  <div class="ws9-feedback" id="ws9Feedback" aria-live="polite"></div>
  <div class="ws9-hints"><strong>Hinweise aus der Vorführungsmappe</strong><details><summary>Hinweis 1</summary>Suche zuerst die Zeile mit der Zahl 20. Sie ist vollständig ausgefüllt. In den beiden Spalten mit der Zahl 20 sind ebenfalls alle Kästchen schwarz.</details><details><summary>Hinweis 2</summary>Das Bild ist oben schmal und wird nach unten breiter. Die oberen drei Zeilen enthalten 2, 6 und 2 zusammenhängende Felder. Achte auf die kurzen Lücken zwischen manchen Zweigen.</details><details><summary>Hinweis 3 – vollständige Lösung</summary>Es entsteht eine Tanne. Das Lösungswort lautet <strong>TANNE</strong>. Zeichne von oben nach unten die Gruppen entsprechend der Zahlen; die lange, vollständig ausgefüllte Reihe ist die 17. Zeile. Wenn du nicht alles zeichnen möchtest, kannst du die Lösung unten durch „Lösung ins Raster übernehmen“ eintragen.</details><button type="button" class="alt ws9-hintfill" id="ws9HintFill" hidden>Lösung ins Raster übernehmen</button></div>
  <div id="ws9DemoReveal" class="ws9-proof" hidden><div class="ws9-overline">ARCHIVFUND B08 · FREIGESCHALTET</div><h4>Martas Vorführungsmappe</h4><p>Für den 14. Dezember ist eine Vorführung von <strong>18:00 bis 18:25 Uhr</strong> im Nebenraum angekündigt. Die Mappe trägt das Zeichen einer Tanne. Das ist zunächst ein Vorführungsplan – ob Marta tatsächlich durchgehend dort war, muss noch unabhängig überprüft werden.</p><p><b>Päckchensymbol:</b> Tanne</p></div>
 </section>`;
 const q=id=>root.querySelector('#'+id);
 function renderGrid(){
  const grid=q('ws9Grid');let html='<div class="ws9-corner">ZEILEN<br>SPALTEN</div>';
  for(let c=0;c<N;c++)html+=`<div class="ws9-col-clue ${c%5===0?'ws9-group-left':''}" aria-label="Spalte ${c+1}: ${cols[c].join(', ')}">${cols[c].map(v=>`<span>${v}</span>`).join('')}</div>`;
  for(let r=0;r<N;r++){
   html+=`<div class="ws9-row-clue ${r%5===0?'ws9-group-top':''}" aria-label="Zeile ${r+1}: ${rows[r].join(', ')}"><span class="ws9-row-index">${String(r+1).padStart(2,'0')}</span>${rows[r].map(v=>`<b>${v}</b>`).join('')}</div>`;
   for(let c=0;c<N;c++)html+=`<button type="button" class="ws9-cell ${r%5===0?'ws9-group-top':''} ${c%5===0?'ws9-group-left':''}" data-r="${r}" data-c="${c}" aria-label="Zeile ${r+1}, Spalte ${c+1}, unmarkiert" aria-pressed="false"></button>`;
  }
  grid.innerHTML=html;paint();
 }
 function paint(){
  root.querySelectorAll('.ws9-cell').forEach(el=>{
   const r=+el.dataset.r,c=+el.dataset.c,v=cells[r][c];
   el.classList.toggle('filled',v===1);el.classList.toggle('cross',v===2);
   el.textContent=v===2?'×':'';
   el.setAttribute('aria-label',`Zeile ${r+1}, Spalte ${c+1}, ${v===1?'ausgefüllt':v===2?'leer markiert':'unmarkiert'}`);
   el.setAttribute('aria-pressed',v===1?'true':'false');
  });
  const count=cells.flat().filter(x=>x===1).length;
  q('ws9Count').textContent=`${count} Kästchen ausgefüllt`;
  q('ws9Check').disabled=pending||finished||count===0;
  q('ws9Undo').disabled=!history.length||pending||finished;
  q('ws9Fill').classList.toggle('active',mode===1);q('ws9Cross').classList.toggle('active',mode===2);
  q('ws9Fill').setAttribute('aria-pressed',mode===1?'true':'false');q('ws9Cross').setAttribute('aria-pressed',mode===2?'true':'false');
 }
 function modify(r,c,v){if(finished||pending)return;const old=cells[r][c],next=old===v?0:v;if(next===old)return;history.push({r,c,old});cells[r][c]=next;q('ws9Feedback').textContent='';paint();}
 q('ws9Grid').addEventListener('click',ev=>{const cell=ev.target.closest('.ws9-cell');if(cell&&q('ws9Grid').contains(cell))modify(+cell.dataset.r,+cell.dataset.c,mode);});
 q('ws9Grid').addEventListener('contextmenu',ev=>{const cell=ev.target.closest('.ws9-cell');if(cell){ev.preventDefault();modify(+cell.dataset.r,+cell.dataset.c,2);}});
 q('ws9Fill').onclick=()=>{mode=1;paint()};q('ws9Cross').onclick=()=>{mode=2;paint()};
 q('ws9Undo').onclick=()=>{if(!history.length)return;const {r,c,old}=history.pop();cells[r][c]=old;q('ws9Feedback').textContent='';paint()};
 q('ws9Reset').onclick=()=>{if(finished)return;if(cells.some(row=>row.some(x=>x!==0))&&!confirm('Möchtest du alle Markierungen auf diesem Blatt löschen?'))return;cells.forEach(row=>row.fill(0));history=[];q('ws9Feedback').textContent='';paint()};
 q('ws9HintsPlaceholder');
 const hintDetails=Array.from(root.querySelectorAll('.ws9-hints details'));
 hintDetails[2].addEventListener('toggle',()=>{q('ws9HintFill').hidden=!hintDetails[2].open});
 q('ws9HintFill').onclick=()=>{if(finished)return;for(let r=0;r<N;r++)for(let c=0;c<N;c++)cells[r][c]=answer[r][c]?1:2;history=[];paint();q('ws9Feedback').textContent='Die Lösung ist ins Raster übertragen. Prüfe das vollständige Bild.'};
 q('ws9Check').onclick=async()=>{
  if(pending||finished)return;pending=true;paint();
  const correct=cells.every((line,r)=>line.every((v,c)=>(v===1)===(answer[r][c]===1)));
  if(!correct){q('ws9Feedback').innerHTML='<div class="ws9-error">Das Bild stimmt noch nicht. Prüfe die Zahlen an den Rändern. Einzelne Reihen werden nicht bewertet.</div>';pending=false;paint();return;}
  try{
   const result=await submit('TANNE');
   if(result){finished=true;q('ws9DemoReveal').hidden=false;q('ws9Feedback').innerHTML='<div class="ws9-success">Richtig! Die Zeichnung zeigt eine Tanne. Du hast die Vorführungsmappe entschlüsselt.</div>'}
   else q('ws9Feedback').innerHTML='<div class="ws9-error">Die Überprüfung konnte nicht bestätigt werden. Bitte versuche es erneut.</div>';
  }catch(e){q('ws9Feedback').textContent='Die Verbindung zur Ablage ist fehlgeschlagen. Bitte erneut prüfen.'}
  pending=false;paint();
 };
 renderGrid();
}

/* Kapitel 10 · Konrads Anzahlung. Physische acht Scheine, digitales Kassenbuch.
   18 Kombinationen mit 270 RM; genau eine besitzt Endziffernsumme 157. */
function mountBanknotes10(root, submit) {
 const bills=[{id:'K-4813',val:20},{id:'K-4928',val:20},{id:'K-5141',val:50},{id:'K-5256',val:50},{id:'K-5372',val:50},{id:'K-6019',val:100},{id:'K-6135',val:100},{id:'K-6284',val:100}];
 const winning=['K-4813','K-5141','K-6019','K-6284'];
 let selected=[],deposit='',offer='',pending=false,done=false;
 const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const note=b=>`<button type="button" class="ws10-paperbill" data-bill="${b.id}" aria-pressed="false"><span class="ws10-bill-top">FALKENBRÜCKER ARCHIV · SPIELGELD</span><span class="ws10-bill-value">${b.val}<small> REICHSMARK</small></span><span class="ws10-bill-motif">${b.val===20?'✧ FALKENBRÜCK ✧':b.val===50?'⚒ WERKSTATT ⚒':'◉ UHRWERK ◉'}</span><span class="ws10-bill-serial">${b.id}</span><span class="ws10-bill-foot">REQUISITE · KEIN ZAHLUNGSMITTEL</span></button>`;
 root.innerHTML=`<section class="ws-puzzle ws10-case">
  <div class="ws10-top">FALKENBRÜCK · FINANZAKTE B09 · 14. DEZEMBER 1928</div>
  <h3>Konrads geheimnisvolle Anzahlung</h3>
  <p>In einem Umschlag liegen acht nachgebildete Banknoten. Laut einem alten Kassenvermerk gehörten nur vier davon zu einer vorgelegten Anzahlung. Welche waren es, und wie hoch war Konrads tatsächliches Kaufangebot für die Winterstern?</p>
  <div class="ws10-bernd"><strong>Bernd:</strong> „Acht Scheine, aber nur vier gehören zusammen? Na wunderbar. Bei Geld werde ich schon vom Zuschauen nervös.“</div>
  <div class="ws10-columns"><div class="ws10-ledger"><div class="ws10-ledger-head">KASSENBUCH · ABSCHRIFT</div><h4>Auszug vom 14. Dezember 1928</h4>
   <table><tbody><tr><td>Bargeldbestand zu Beginn</td><td>630 RM</td></tr><tr><td>Werkstattmaterial, ausgezahlt</td><td>−110 RM</td></tr><tr><td>Vorgelegte Anzahlung K. Voss</td><td>???</td></tr><tr><td>Zwischenzeitlich gezählter Bestand</td><td>790 RM</td></tr></tbody></table>
   <div class="ws10-scribble">„Vier Banknoten vorgelegt. Die Summe der jeweils letzten zwei Ziffern ihrer Seriennummern beträgt <b>157</b>. Die Anzahlung entspricht genau <b>einem Zehntel</b> des angebotenen Kaufpreises.“</div>
   <div class="ws10-disclaimer">Die Scheine wurden nur zur Prüfung vorgelegt; der Betrag wurde nicht endgültig vereinnahmt.</div>
  </div><div class="ws10-investigation"><div class="ws10-label">DEINE ERMITTLUNGSNOTIZ</div>
   <label for="ws10Deposit">I. Höhe der Anzahlung in Reichsmark</label><input id="ws10Deposit" type="number" min="0" step="1" inputmode="numeric" placeholder="Betrag berechnen">
   <div class="ws10-label ws10-label-space">II. Wähle die vier vorgelegten Scheine</div><p class="ws10-help">Nutze die echten Scheine im Umschlag: Die Seriennummern entscheiden. Hier sind sie zur Eingabe noch einmal abgebildet.</p>
   <div class="ws10-bills">${bills.map(note).join('')}</div><div id="ws10Selected" class="ws10-count">0 von 4 Scheinen ausgewählt</div>
   <label class="ws10-label-space" for="ws10Offer">III. Gesamter angebotener Kaufpreis in Reichsmark</label><input id="ws10Offer" type="number" min="0" step="1" inputmode="numeric" placeholder="Kaufpreis berechnen">
  </div></div>
  <div class="ws10-actions"><button type="button" class="alt" id="ws10Reset">Zurücksetzen</button><button type="button" id="ws10Check" disabled>Gesamten Befund prüfen</button></div>
  <div id="ws10Feedback" aria-live="polite"></div>
  <div class="ws10-hints"><strong>Johann Winters Hinweise</strong>
   <details><summary>Hinweis 1</summary>Der Kassenbestand ohne Anzahlung wäre 630 − 110 = 520 RM. Wie viel muss hinzukommen, damit 790 RM erreicht werden?</details>
   <details><summary>Hinweis 2</summary>270 RM lassen sich mit vier dieser Scheine nur als 20 + 50 + 100 + 100 RM bilden. Vergleiche nun jeweils die letzten zwei Ziffern der Seriennummern.</details>
   <details><summary>Hinweis 3 – Vollständige Lösung</summary>Anzahlung: 270 RM. Scheine: K-4813, K-5141, K-6019, K-6284. Kontrollsumme: 13 + 41 + 19 + 84 = 157. Kaufangebot: 2.700 RM.</details>
  </div>
  <div class="ws10-reveal" id="ws10Reveal" hidden><div class="ws10-label">BEWEISSTÜCK B09 · KAUFANGEBOT FREIGELEGT</div><h4>Johann Winters Ablehnung</h4><p>Konrad Voss bot 2.700 Reichsmark für die Winterstern und legte 270 Reichsmark als Anzahlung vor. Johann Winter lehnte den Verkauf ausdrücklich ab; die vorgelegten Banknoten wurden zurückgegeben.</p><p>Das könnte Konrad ein Motiv gegeben haben. Dass er deshalb die Uhr gestohlen hat, ist damit nicht belegt.</p><p><strong>Päckchensymbol: Diamant.</strong></p></div>
 </section>`;
 const q=id=>root.querySelector('#'+id);
 const ready=()=>deposit!==''&&offer!==''&&selected.length===4;
 function paint(){root.querySelectorAll('[data-bill]').forEach(b=>{const yes=selected.includes(b.dataset.bill);b.classList.toggle('ws10-selected',yes);b.setAttribute('aria-pressed',String(yes))});q('ws10Selected').textContent=selected.length+' von 4 Scheinen ausgewählt';q('ws10Check').disabled=!ready()||pending||done;q('ws10Reset').disabled=pending||done;}
 root.querySelectorAll('[data-bill]').forEach(btn=>btn.addEventListener('click',()=>{if(done||pending)return;const id=btn.dataset.bill;if(selected.includes(id))selected=selected.filter(x=>x!==id);else if(selected.length<4)selected.push(id);q('ws10Feedback').textContent='';paint()}));
 q('ws10Deposit').oninput=e=>{deposit=e.target.value.trim();q('ws10Feedback').textContent='';paint()};q('ws10Offer').oninput=e=>{offer=e.target.value.trim();q('ws10Feedback').textContent='';paint()};
 q('ws10Reset').onclick=()=>{selected=[];deposit='';offer='';q('ws10Deposit').value='';q('ws10Offer').value='';q('ws10Feedback').textContent='';paint()};
 q('ws10Check').onclick=async()=>{if(!ready()||pending||done)return;const right=Number(deposit)===270&&Number(offer)===2700&&selected.length===4&&winning.every(id=>selected.includes(id));
   if(!right){q('ws10Feedback').innerHTML='<div class="ws10-error">Der Befund ist noch nicht vollständig richtig. Prüfe die Kassenrechnung, die Seriennummern und die Höhe des Angebots.</div>';return;}
   pending=true;paint();try{const ok=await submit('2700');if(ok){done=true;q('ws10Reveal').hidden=false;q('ws10Feedback').innerHTML='<div class="ws10-success">Richtig ermittelt. Johann Winters Antwort wird sichtbar.</div>';}else q('ws10Feedback').innerHTML='<div class="ws10-error">Der Befund ist richtig, aber die hinterlegte Antwort konnte nicht bestätigt werden. Bitte Kapitel 10 in der Spielleitung auf 2700 einstellen.</div>';}
   catch(e){q('ws10Feedback').innerHTML='<div class="ws10-error">Speichern fehlgeschlagen. Bitte erneut versuchen.</div>';}finally{pending=false;paint();}
 };
 paint();
}

/* Kapitel 11 – Manipulierte Glasnegative. Alle visuellen Fakten sind im SVG und den drei Beweisakten konsistent. */
function mountPhotoNegatives11(root,submit){
  const plates=['12','18','23','31','42','47'];
  const pairKinds=[
    {value:'plate',label:'Plattenfehler / Kratzer auf dem Negativ'},
    {value:'glass',label:'Kratzer auf der Vitrinenscheibe'},
    {value:'watch',label:'Echter Uhrschaden / Kerben an der Uhr'}
  ];
  const pairOptions=['12-31','18-47','23-42'];
  let pairs=[['',''],['',''],['','']];
  let kinds=['','',''];
  let decisive='';
  let reason='';
  let archive='';
  let pending=false, solved=false;
  const q=id=>root.querySelector('#'+id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normPair=(a,b)=>[a,b].filter(Boolean).sort((x,y)=>Number(x)-Number(y)).join('-');
  const usedPlates=()=>pairs.flat().filter(Boolean);
  function hintSummary(kind){
    if(kind==='plate')return 'Dieselbe Spur taucht auf zwei Fotos an derselben Stelle im Bild auf – unabhängig vom Motiv.';
    if(kind==='glass')return 'Die Linie verschiebt sich relativ zur Uhr, sobald sich der Blickwinkel ändert.';
    if(kind==='watch')return 'Die zwei Kerben bleiben relativ zur römischen VII an derselben Stelle.';
    return 'Noch keine Einordnung gewählt.';
  }
  function render(){
    root.innerHTML=`<section class="ws-puzzle ws11p"><div class="ws11p-kicker">DUNKELKAMMER BECK · AKTE B10 · KAPITEL 11</div><h3>Die Fotobeweise aus der Dunkelkammer</h3><p>Die eigentliche Bildanalyse findet mit deinen <strong>ausgedruckten Fotokarten</strong> statt. Auf der Website dokumentierst du nur deinen Befund. Bilde drei Paare aus je zwei Aufnahmen, entscheide, welche Art von Spur jedes Paar zeigt, und bestimme daraus das echte Beweispaar.</p><div class="ws11p-bernd"><strong>Bernd:</strong> „Die Fotos liegen doch alle bei dir auf dem Tisch. Ich trau der Technik heute sowieso nicht – lass uns lieber mit echten Abzügen arbeiten.“</div><div class="ws11p-layout"><div class="ws11p-board"><div class="ws11p-panel"><h4>So gehst du vor</h4><ol><li>Lege die sechs Fotografien aus.</li><li>Suche immer zwei Bilder, die dieselbe Spur zeigen.</li><li>Ordne jedes Paar einer Ursache zu: <em>Plattenfehler</em>, <em>Vitrinenglas</em> oder <em>echte Kerben an der Uhr</em>.</li><li>Nur ein Paar beweist die echte Winterstern.</li></ol></div><div class="ws11p-panel ws11p-note"><h4>Noras Notizzettel</h4><img src="noras_dunkelkammer_notizen.png" alt="Noras handschriftliche Dunkelkammer-Notizen"><p class="ws11p-small">Dieser Zettel liegt idealerweise auch gedruckt bei. Hier siehst du ihn zur Kontrolle noch einmal digital.</p></div></div><div class="ws11p-form"><div class="ws11p-panel"><h4>Ermittlung protokollieren</h4>${[1,2,3].map(i=>`<div class="ws11p-pair"><div class="ws11p-pairhead">Paar ${i}</div><div class="ws11p-pairgrid"><label>Foto A<select id="ws11pA${i}"><option value="">Platte wählen</option>${plates.map(p=>`<option value="${p}">Platte ${p}</option>`).join('')}</select></label><label>Foto B<select id="ws11pB${i}"><option value="">Platte wählen</option>${plates.map(p=>`<option value="${p}">Platte ${p}</option>`).join('')}</select></label></div><label>Welche Spur zeigt dieses Paar?<select id="ws11pKind${i}"><option value="">Einordnung wählen</option>${pairKinds.map(k=>`<option value="${k.value}">${k.label}</option>`).join('')}</select></label><div class="ws11p-mini" id="ws11pHint${i}">${hintSummary(kinds[i-1])}</div></div>`).join('')}<div class="ws11p-panel ws11p-panel-sub"><label>Welches Plattenpaar ist das entscheidende Beweispaar?<select id="ws11pDecisive"><option value="">Beweispaar wählen</option>${pairOptions.map(v=>`<option value="${v}">${v.replace('-', ' – ')}</option>`).join('')}</select></label><label>Warum ist dieses Paar beweiskräftig?<select id="ws11pReason"><option value="">Begründung wählen</option><option value="ring">Die zwei Kerben bleiben relativ zum Ziffernring bei VII an derselben Stelle.</option><option value="shift">Der Kratzer verschiebt sich im Verhältnis zur Uhr.</option><option value="plate">Dieselbe Linie erscheint an exakt derselben Bildstelle auf zwei verschiedenen Motiven.</option></select></label><label>Welche einzelne Platte wird als Archivantwort hinterlegt?<select id="ws11pArchive"><option value="">Archivplatte wählen</option>${plates.map(p=>`<option value="${p}">Platte ${p}</option>`).join('')}</select></label></div><div class="ws-check"><button type="button" class="alt" id="ws11pReset">Zurücksetzen</button> <button type="button" id="ws11pCheck" ${pending?'disabled':''}>Befund prüfen</button></div><div id="ws11pFeedback" class="ws-feedback" aria-live="polite"></div><div id="ws11pReveal" class="ws11p-reveal" ${solved?'':'hidden'}><small>BEWEISSTÜCK B10 · ARCHIVVERMERK</small><h4>Der entscheidende Beweis stammt von Platte 42</h4><p>Das Paar <strong>23 – 42</strong> zeigt dieselbe Uhr aus zwei Blickwinkeln. Die zwei kleinen Kerben bei der römischen VII bleiben an derselben Stelle relativ zum Ziffernring. Damit handelt es sich nicht um einen Kratzer auf Glas oder Fotoplatte, sondern um ein echtes Merkmal der Winterstern.</p><p><strong>Archivantwort für die Website:</strong> GLAS42</p></div></div></div><div class="ws11p-hints ws-hints"><details><summary>Hinweis 1</summary>Es gibt drei Ursache-Gruppen: Plattenfehler, Glas/Kratzer vor der Uhr und echte Beschädigung an der Uhr. Jede kommt genau einmal vor.</details><details><summary>Hinweis 2</summary>Das echte Beweispaar zeigt dieselbe Uhr aus zwei unterschiedlichen Blickwinkeln. Nur dabei bleiben die zwei Kerben bei VII relativ zur Uhr stabil.</details><details><summary>Hinweis 3 – Vollständige Lösung</summary>Paare: <strong>12–31</strong> (Plattenfehler), <strong>18–47</strong> (Vitrinenscheibe) und <strong>23–42</strong> (echter Uhrschaden). Entscheidendes Beweispaar: <strong>23–42</strong>. Archivantwort: <strong>GLAS42</strong>.</details></div></section>`;

    for(let i=1;i<=3;i++){
      q('ws11pA'+i).value=pairs[i-1][0];
      q('ws11pB'+i).value=pairs[i-1][1];
      q('ws11pKind'+i).value=kinds[i-1];
      q('ws11pHint'+i).textContent=hintSummary(kinds[i-1]);
    }
    q('ws11pDecisive').value=decisive;
    q('ws11pReason').value=reason;
    q('ws11pArchive').value=archive;

    const duplicates = usedPlates().length !== new Set(usedPlates()).size;
    const pairReady = pairs.every(([a,b])=>a&&b&&a!==b) && kinds.every(Boolean);
    const overallReady = pairReady && decisive && reason && archive;
    q('ws11pCheck').disabled = pending || solved || !overallReady || duplicates;
    if(duplicates){q('ws11pFeedback').innerHTML='<div class="notice bad">Eine Platte wurde mehrfach verwendet. Jede der sechs Platten darf genau einmal vorkommen.</div>'}

    for(let i=1;i<=3;i++){
      q('ws11pA'+i).onchange=e=>{pairs[i-1][0]=e.target.value; render();};
      q('ws11pB'+i).onchange=e=>{pairs[i-1][1]=e.target.value; render();};
      q('ws11pKind'+i).onchange=e=>{kinds[i-1]=e.target.value; render();};
    }
    q('ws11pDecisive').onchange=e=>{decisive=e.target.value; render();};
    q('ws11pReason').onchange=e=>{reason=e.target.value; render();};
    q('ws11pArchive').onchange=e=>{archive=e.target.value; render();};
    q('ws11pReset').onclick=()=>{pairs=[['',''],['',''],['','']];kinds=['','',''];decisive='';reason='';archive='';pending=false; if(q('ws11pReveal')) q('ws11pReveal').hidden=true; render();};
    q('ws11pCheck').onclick=async()=>{
      const feedback=q('ws11pFeedback');
      const normalized=pairs.map(([a,b],idx)=>({pair:normPair(a,b),kind:kinds[idx]}));
      const unique=new Set(usedPlates());
      if(unique.size!==6 || usedPlates().length!==6 || pairs.some(([a,b])=>!a||!b||a===b)){
        feedback.innerHTML='<div class="notice bad">Bitte bilde zuerst drei vollständige Paare aus insgesamt sechs unterschiedlichen Platten.</div>';
        return;
      }
      const expected={
        '12-31':'plate',
        '18-47':'glass',
        '23-42':'watch'
      };
      const pairOk = normalized.length===3 && normalized.every(x=>expected[x.pair]===x.kind) && Object.keys(expected).every(key=>normalized.some(x=>x.pair===key));
      const overallOk = pairOk && decisive==='23-42' && reason==='ring' && archive==='42';
      if(!overallOk){
        feedback.innerHTML='<div class="notice bad">Der Befund ist noch nicht stimmig. Prüfe die Paarbildung und die Zuordnung der Spuren noch einmal an den gedruckten Fotos.</div>';
        return;
      }
      pending=true; render();
      try{
        const ok=await submit('GLAS42');
        if(ok){
          solved=true;
          render();
          q('ws11pReveal').hidden=false;
          q('ws11pFeedback').innerHTML='<div class="notice">Die Auswertung ist korrekt. Die Dunkelkammer-Akte wurde als gelöst vermerkt.</div>';
        }else{
          feedback.innerHTML='<div class="notice bad">Deine Auswertung ist korrekt. Bitte in der Spielleitung bei Kapitel 11 als geheime Antwort <strong>GLAS42</strong> hinterlegen.</div>';
        }
      }catch(e){
        feedback.innerHTML='<div class="notice bad">Die Auswertung ist korrekt, konnte aber gerade nicht gespeichert werden. Bitte erneut versuchen.</div>';
      }finally{pending=false; render(); if(solved && q('ws11pReveal')) q('ws11pReveal').hidden=false;}
    };
  }
  render();
}

/* Kapitel 12 · Die verschwundene Viertelstunde.
   Keine Teilauswertung und keine Anzeige, ob eine einzelne Angabe stimmt. */
function mountSignalCipher12(root, submit) {
  // Kapitel 12: exakt eine falsche Aussage unter sieben Vermerken.
  // Exhaustiv geprüft: 120 Permutationen -> nur 43-39-41-42-40 erfüllt genau sechs Aussagen.
  const plates=[39,40,41,42,43];
  const times=['18:02','18:06','18:11','18:15','18:21'];
  const clues=[
    ['A','Platte 39 wurde vor Platte 40 aufgenommen.'],
    ['B','Die Aufnahme 41 entstand zeitlich zwischen den Aufnahmen 42 und 43.'],
    ['C','Zwischen Platte 39 und Platte 42 wurde genau eine weitere Aufnahme gemacht.'],
    ['D','Platte 39 wurde früher aufgenommen als Platte 42.'],
    ['E','Platte 41 entstand unmittelbar nach Platte 39.'],
    ['F','Platte 42 wurde vor Platte 40 belichtet.'],
    ['G','Zwischen den Aufnahmen 42 und 41 lag genau eine weitere Belichtung.']
  ];
  // 1928 war es durchaus möglich, Negative erst später und nicht chronologisch zu nummerieren.
  // Die Bildmotive sind reine Illustrationen, keine zusätzlichen Reihenfolgehinweise.
  const byPlate={39:'nora_platte_39.jpg',40:'nora_platte_40.jpg',41:'nora_platte_41.jpg',42:'nora_platte_42.jpg',43:'nora_platte_43.jpg'};
  const solution=[43,39,41,42,40];
  let order=[40,42,39,43,41],held=null,selected=null,pending=false,finished=false;
  const $=id=>root.querySelector('#'+id);
  const assertions=orderList=>{
    const pos=Object.fromEntries(orderList.map((n,i)=>[n,i]));
    return [pos[39]<pos[40],Math.min(pos[42],pos[43])<pos[41]&&pos[41]<Math.max(pos[42],pos[43]),Math.abs(pos[39]-pos[42])===2,pos[39]<pos[42],pos[41]===pos[39]+1,pos[42]<pos[40],Math.abs(pos[42]-pos[41])===2];
  };
  // Beim Entwickeln muss garantiert sein, dass die einzelnen Bedingungen exakt eine Lösung zulassen.
  let valid=0;
  function verifyPermutation(a=[],left=plates){if(!left.length){if(assertions(a).filter(Boolean).length===6){valid++;if(a.join('-')!==solution.join('-'))throw Error('K12: widersprüchlicher Datensatz');}return;}
    left.forEach(n=>verifyPermutation([...a,n],left.filter(x=>x!==n)));}
  verifyPermutation();if(valid!==1)throw Error('K12: keine eindeutige Lösung');
  function card(n,i){return `<button type="button" class="ws12f-photo" draggable="${!finished}" data-plate="${n}" aria-label="Platte ${n}, derzeit an Position ${i+1}"><span class="ws12f-photo-clip"></span><span class="ws12f-image"><img src="${byPlate[n]}" alt="Historische Fotografie von der Winterausstellung, Platte ${n}" draggable="false"></span><span class="ws12f-photo-meta"><b>PLATTE ${n}</b><small>BECK · 1928</small></span></button>`}
  root.innerHTML=`<section class="ws-puzzle ws12f">
    <div class="ws12f-eyebrow">DUNKELKAMMER NORA BECK · FALKENBRÜCK · 14. DEZEMBER 1928</div><h3>Die verschwundene Viertelstunde</h3>
    <p class="ws12f-intro">Im Kontaktregister sind fünf Aufnahmezeiten erhalten, aber die Zuordnung zu den Fotoplatten fehlt. Sieben Randvermerke beschreiben die Reihenfolge. <strong>Genau einer wurde falsch übertragen.</strong></p>
    <div class="ws12f-bernd"><strong>Bernd:</strong> „Ich würde die Bilder nach Schönheit sortieren. Aber du willst vermutlich schon wieder die Wahrheit herausfinden.“</div>
    <div class="ws12f-scene"><div class="ws12f-table">
      <div class="ws12f-tablehead"><span>NORAS KONTAKTBOGEN · REKONSTRUKTION</span><span>V / 1928</span></div>
      <p class="ws12f-tableinstruction">Lege die fünf Fotografien <strong>zeitlich von links nach rechts</strong>. Ziehe eine Karte auf eine andere oder klicke zwei Karten nacheinander an, um ihre Plätze zu tauschen. Die Fotomotive selbst sind keine Zeitbelege.</p>
      <div class="ws12f-photo-grid" id="ws12fCards"></div>
      <div class="ws12f-times">${times.map((t,i)=>`<div class="ws12f-time"><span>${String(i+1).padStart(2,'0')}</span><b>${t}</b></div>`).join('')}</div>
      <div class="ws12f-worknote"><span>IN DER AKTE FESTGEHALTEN</span><p>Die Plattennummern wurden <strong>erst bei der späteren Archivierung</strong> vergeben. Sie geben nicht die Reihenfolge der Belichtungen an. Die fünf Uhrzeiten stammen aus Noras geprüfter Zeitliste.</p></div>
    </div><aside class="ws12f-note"><span class="ws12f-paperclip"></span><div class="ws12f-notehead"><small>HANDABSCHRIFT · NORA BECK</small><h4>Randvermerke</h4><span>14. XII. 1928</span></div>
      <p class="ws12f-notesub">Bei der Übertragung in die Registratur ist <em>eine</em> der sieben Aussagen verfälscht worden.</p>
      ${clues.map(([l,t])=>`<div class="ws12f-clue"><span>${l}.</span><p>${t}</p></div>`).join('')}
      <div class="ws12f-sign">N. Beck <span>✎</span></div>
    </aside></div>
    <div class="ws12f-verification"><div class="ws12f-stamp">PRÜFBOGEN NR. XII</div><h4>Den Befund protokollieren</h4><p>Prüfe erst, wenn du alle fünf Platten geordnet und die fehlerhafte Aussage bestimmt hast. Es gibt keine Rückmeldung zu einzelnen Antworten.</p>
    <div class="ws12f-fields"><label>Welcher Vermerk ist falsch?<select id="ws12fWrong"><option value="">Vermerk auswählen</option>${clues.map(([l])=>`<option value="${l}">${l}</option>`).join('')}</select></label>
    <label>Wann wurde Platte 42 belichtet?<select id="ws12fTime"><option value="">Uhrzeit auswählen</option>${times.map(t=>`<option value="${t}">${t}</option>`).join('')}</select></label>
    <label class="ws12f-full">Was lässt sich zu Konrad Voss feststellen?<select id="ws12fConclusion"><option value="">Befund auswählen</option><option value="after">Die Uhr war um 18:15 noch da; nach seiner Austragung um 18:12 könnte er zurückgekehrt sein.</option><option value="innocent">Er kann mit dem Verschwinden keinesfalls etwas zu tun haben.</option><option value="guilty">Sein Kaufangebot beweist, dass er die Uhr gestohlen hat.</option><option value="before">Die Uhr muss schon vor seiner Austragung entwendet worden sein.</option></select></label></div>
    <div class="ws12f-buttons"><button type="button" class="alt" id="ws12fReset">Neu ordnen</button><button type="button" id="ws12fCheck">Gesamten Befund prüfen</button></div><div id="ws12fFeedback" class="ws-feedback" aria-live="polite"></div>
    <div id="ws12fReveal" class="ws12f-reveal" hidden><small>AKTENVERMERK · B12</small><h4>Die Winterstern war um 18:15 Uhr noch in der Vitrine</h4><p>Die Reihenfolge <strong>43 – 39 – 41 – 42 – 40</strong> erfüllt sechs Aussagen. <strong>G</strong> ist falsch übertragen: Zwischen 41 und 42 lag keine weitere Aufnahme. Platte 42 gehört zur vierten Zeitmarke <strong>18:15 Uhr</strong>. Die zwei Kerben nahe VII identifizieren die Winterstern.</p><p>Konrad Voss wurde um 18:12 Uhr ausgetragen. Eine spätere Rückkehr ist nicht ausgeschlossen.</p></div></div>
    <div class="ws12f-hints ws-hints"><details><summary>Hinweis 1</summary>Beginne mit der unmittelbaren Nachbarschaft zweier Platten. Welche Vermerke bestätigen oder ergänzen diese Reihenfolge?</details><details><summary>Hinweis 2</summary>Die Vermerke C, D und E können zusammen eine Dreierfolge festlegen. Berücksichtige dabei, dass genau ein anderer Vermerk falsch sein kann. Prüfe alle sieben Aussagen gegen deine vollständige Reihenfolge.</details><details><summary>Hinweis 3 – starke Hilfe</summary>Die Reihenfolge beginnt mit Platte 43 und endet mit Platte 40. Platte 39 liegt unmittelbar vor 41. Überprüfe die verbleibenden Positionen und bestimme den falschen Vermerk.</details></div>
  </section>`;
  function update(){
    $('ws12fCards').innerHTML=order.map(card).join('');
    $('ws12fCards').querySelectorAll('.ws12f-photo').forEach(b=>{
      const num=Number(b.dataset.plate);
      b.classList.toggle('ws12f-active',selected===num);
      b.addEventListener('click',()=>{
        if(pending||finished)return;
        if(selected===null){selected=num;update();return}
        if(selected!==num){const a=order.indexOf(selected),z=order.indexOf(num);[order[a],order[z]]=[order[z],order[a]];}
        selected=null;$('ws12fFeedback').textContent='';update();
      });
      b.addEventListener('dragstart',ev=>{if(pending||finished){ev.preventDefault();return}held=num;ev.dataTransfer.setData('text/plain',String(num));ev.dataTransfer.effectAllowed='move';});
      b.addEventListener('dragover',ev=>{if(pending||finished)return;ev.preventDefault();ev.dataTransfer.dropEffect='move';});
      b.addEventListener('drop',ev=>{if(pending||finished)return;ev.preventDefault();const from=Number(ev.dataTransfer.getData('text/plain')||held);if(!plates.includes(from)||from===num)return;const a=order.indexOf(from),z=order.indexOf(num);[order[a],order[z]]=[order[z],order[a]];selected=null;update();});
      b.addEventListener('dragend',()=>{held=null;});
    });
    $('ws12fCheck').disabled=pending||finished;
  }
  $('ws12fReset').addEventListener('click',()=>{if(pending||finished)return;order=[40,42,39,43,41];selected=null;['ws12fWrong','ws12fTime','ws12fConclusion'].forEach(id=>$(id).value='');$('ws12fFeedback').textContent='';update()});
  $('ws12fCheck').addEventListener('click',async()=>{
    if(pending||finished)return;
    const wrong=$('ws12fWrong').value,when=$('ws12fTime').value,conclusion=$('ws12fConclusion').value;
    if(!wrong||!when||!conclusion){$('ws12fFeedback').innerHTML='<div class="notice bad">Bitte zuerst alle drei Befundfelder ausfüllen.</div>';return;}
    if(order.join('-')!==solution.join('-')||wrong!=='G'||when!=='18:15'||conclusion!=='after'){$('ws12fFeedback').innerHTML='<div class="notice bad">Die Rekonstruktion ist noch nicht vollständig schlüssig. Prüfe Reihenfolge, die sieben Aussagen und deine Schlussfolgerung erneut.</div>';return}
    pending=true;update();
    try{const ok=await submit('STERN');if(ok){finished=true;$('ws12fReveal').hidden=false;$('ws12fFeedback').innerHTML='<div class="notice">Die Rekonstruktion ist bestätigt. Der Aufnahmezeitpunkt wurde gesichert.</div>';}else $('ws12fFeedback').innerHTML='<div class="notice bad">Dein Befund stimmt. Bitte in der Spielleitung die geheime Antwort für Kapitel 12 auf STERN prüfen.</div>';}catch(e){$('ws12fFeedback').innerHTML='<div class="notice bad">Die Antwort konnte nicht gespeichert werden. Bitte versuche es erneut.</div>'}finally{pending=false;update()}
  });
  update();
}
function mountPlinth13(root,submit){
 const expected={F3:'E',A1:'A',C6:'C',E1:'F',B3:'B',D5:'D'};
 const points=Object.keys(expected);
 const solution=['AAAFFF','AB..FF','AB..EE','BB..DE','BCDDDE','CCCCDE'];
 const values=Object.fromEntries(points.map(p=>[p,'']));
 let pending=false,complete=false;
 const q=id=>root.querySelector('#'+id);
 const opts='<option value="">Platte auswählen</option>'+Array.from('ABCDEF',c=>`<option value="${c}">${c}</option>`).join('');
 const sample=(filled)=>`<div class="ws13new-tablet"><div class="ws13new-grid">${solution.map((row,y)=>Array.from(row,(letter,x)=>{const hole=letter==='.';return `<div class="ws13new-cell ${hole?'hole':filled?'piece-'+letter:''}">${filled&&!hole?letter:''}${hole?'<span class="ws13new-dimple"></span>':''}</div>`}).join('')).join('')}</div><div class="ws13new-cols">${'ABCDEF'.split('').map(x=>`<span>${x}</span>`).join('')}</div><div class="ws13new-rows">${[1,2,3,4,5,6].map(x=>`<span>${x}</span>`).join('')}</div></div>`;
 root.innerHTML=`<section class="ws-puzzle ws13new"><div class="ws13new-top"><div><span class="ws13new-kicker">FALKENBRÜCK · BAUAKTE XIII · 1928</span><h3>Der unmögliche Sockel</h3><p>Sechs Verstärkungsplatten sollen den massiven Sockel der Winterstern bilden. Der Werkstattplan zeigt allerdings sechs Felder, in denen gar kein Holz liegen darf. Rekonstruiere mit deinen <strong>ausgeschnittenen Kartonteilen</strong>, wie die Konstruktion tatsächlich aufgebaut werden kann.</p></div><div class="ws13new-seal" aria-hidden="true">JW <small>1928</small></div></div><div class="ws13new-bernd"><strong>Bernd:</strong> „Sechs Holzstücke und sechs Felder ohne Holz. Der Schreiner hat bestimmt nicht geschummelt. Aber falls doch, finden wir es jetzt heraus.“</div><div class="ws13new-layout"><div class="ws13new-left"><div class="ws13new-drawing"><div class="ws13new-rulerhead"><span>WERKSTATTZEICHNUNG Nº 13</span><span>MASSSTAB · 1 : 5</span></div><div class="ws13new-blueprint">${sample(false)}<div class="ws13new-compass" aria-hidden="true"><span>N</span><b>✦</b></div></div><div class="ws13new-legend"><span><i class="ws13new-box-swatch"></i> Belegbare Holzfläche</span><span><i class="ws13new-cavity-swatch"></i> Hohlraum</span></div><p class="ws13new-fine">Der Plan ist eine Draufsicht. Die sechs markierten dunklen Felder müssen frei bleiben. Die Teile dürfen gedreht, aber nicht umgedreht werden.</p></div><div class="ws13new-note"><div class="ws13new-pin"></div><h4>Aus der Werkstatt Winters</h4><p><strong>Arbeitsanweisung:</strong> Alle sechs Profile A–F sind einzubauen. Jedes besteht aus fünf gleich großen Feldern. Zwischen den Verstärkungsplatten darf kein Spalt bleiben.</p><p>Die Teile haben eine markierte Vorderseite. Eine vollständige Konstruktion gelingt ohne das Wenden eines Teils.</p><small>Beilage: Sechs ausgeschnittene Holzprofile · A bis F</small></div></div><div class="ws13new-right"><div class="ws13new-formhead"><div>PRÜFPROTOKOLL XIII</div><span>6 Messpunkte</span></div><p>Übertrage die Plattenbuchstaben an den angegebenen Rasterpunkten deiner <strong>fertig zusammengesetzten</strong> Konstruktion. Die Prüfung erfolgt erst, wenn alle sechs Punkte ausgefüllt sind.</p><div class="ws13new-positions">${points.map((p,i)=>`<label class="ws13new-position"><span><b>${String(i+1).padStart(2,'0')}</b> Punkt ${p}</span><select id="ws13new${p}" aria-label="Platte an Messpunkt ${p}">${opts}</select></label>`).join('')}</div><div class="ws13new-actions"><button type="button" class="alt" id="ws13newReset">Zurücksetzen</button><button type="button" id="ws13newCheck" disabled>Gesamte Konstruktion prüfen</button></div><div id="ws13newFeedback" aria-live="polite"></div><div id="ws13newReveal" class="ws13new-reveal" hidden><div class="ws13new-kicker">FREIGESCHALTET · KONSTRUKTIONSBEFUND B12</div><h4>Das Innere des Sockels ist nicht massiv.</h4><p>Die sechs Profile lassen einen zusammenhängenden Hohlraum frei. Die alte Angabe „massiver Holzsockel“ beschreibt also lediglich sein Äußeres. Ob sich jemand diesen Raum tatsächlich zunutze gemacht hat, ist weiterhin unklar.</p><div class="ws13new-proof">${sample(true)}</div><p><strong>Die nächste Frage:</strong> Wie konnte man den Innenraum öffnen? Genau das wird in Kapitel 14 untersucht.</p></div></div></div><div class="ws13new-hints ws-hints"><details><summary>Hinweis 1 · Wo anfangen?</summary>Betrachte zuerst die untere Außenkante und die zwei seitlichen Engstellen. Nicht jede Platte passt in diese Bereiche, selbst wenn du sie drehst.</details><details><summary>Hinweis 2 · Die schwierige Ecke</summary>Ein Bauteil mit drei Feldern in einer geraden Reihe kann die obere linke Kante besetzen. Das winkelförmige Teil A eignet sich für diesen Bereich. Probiere dann die untere Kante.</details><details><summary>Hinweis 3 · Vollständige Lösung</summary>Die Anordnung lautet zeilenweise: <strong>AAAFFF / AB··FF / AB··EE / BB··DE / BCDDDE / CCCCDE</strong>. Die Punkte ergeben <strong>A, B, C, D, E, F</strong>. Archivcode: <strong>SOCKEL</strong>.</details></div></section>`;
 const ready=()=>points.every(p=>values[p]);
 function update(){q('ws13newCheck').disabled=pending||complete||!ready()}
 for(const p of points)q('ws13new'+p).addEventListener('change',e=>{values[p]=e.target.value;q('ws13newFeedback').textContent='';update()});
 q('ws13newReset').onclick=()=>{if(pending||complete)return;for(const p of points){values[p]='';q('ws13new'+p).value=''}q('ws13newFeedback').textContent='';update()};
 q('ws13newCheck').onclick=async()=>{
  if(!ready()||pending||complete)return;
  if(!points.every(p=>values[p]===expected[p])){q('ws13newFeedback').innerHTML='<div class="notice bad">Noch nicht richtig. Mindestens ein Kontrollpunkt passt nicht zur eindeutigen Konstruktion. Einzelne Angaben werden nicht bewertet.</div>';return;}
  pending=true;update();
  try{
   const ok=await submit('SOCKEL');
   if(ok){complete=true;q('ws13newReveal').hidden=false;q('ws13newFeedback').innerHTML='<div class="notice">Die sechs Messpunkte stimmen. Der Konstruktionsbefund wurde freigeschaltet.</div>';}
   else q('ws13newFeedback').innerHTML='<div class="notice bad">Die Konstruktion stimmt. Bitte in der Spielleitung die geheime Antwort SOCKEL für Kapitel 13 hinterlegen.</div>';
  }catch(e){q('ws13newFeedback').innerHTML='<div class="notice bad">Der Befund stimmt, aber das Speichern ist fehlgeschlagen. Bitte versuche es erneut.</div>'}
  finally{pending=false;update()}
 };
 update();
}


/* Kapitel 14 – Uhrmacher-Fuenfhebelwerk.
   Mechanik mathematisch mit BFS geprueft (5 Schalter x 3 Modulo-6-Zaehler).
   Das Ziel erfordert mindestens 9 gueltige Bewegungen; verschiedene optimale Wege
   sind zulaessig. Nur der gesamte Befund wird geprueft. */
function mountLeverLock14(root,submit){
  const NAMES=['A','B','C','D','E'];
  const TITLES=['Hauptsperre','Laufrad','Anker','Sperrklinke','Freigabe'];
  const DELTAS=[[0,0,0],[1,1,0],[0,1,2],[2,0,1],[1,2,1]];
  const TARGET={mask:21,wheels:[3,3,1]};
  const MAX=9;
  const q=id=>root.querySelector('#'+id);
  let mask=0,wheels=[0,0,0],history=[],pending=false,won=false,feedback='';
  const get=(m,i)=>!!(m&(1<<i));
  function blocked(i){
    const A=get(mask,0),B=get(mask,1),C=get(mask,2),D=get(mask,3),E=get(mask,4);
    if(i===0&&A&&(B||C))return 'Die Hauptsperre A kann erst abgesenkt werden, wenn B und C unten stehen.';
    if((i===1||i===2)&&!A)return 'Die Hebel B und C sind von der Hauptsperre A verriegelt.';
    if(i===3&&!B)return 'D ist gesperrt, solange B nicht angehoben ist.';
    if(i===3&&E)return 'E hält den Riegel D fest. Senke E zuerst ab.';
    if(i===4&&!C)return 'E kann nur bewegt werden, solange der Anker C angehoben ist.';
    if(i===4&&D)return 'D blockiert den Freigabehebel E.';
    return '';
  }
  const teethPath=(cx,cy,r)=>{
    let p='';const steps=16;
    for(let i=0;i<steps*4;i++){
      const angle=2*Math.PI*i/(steps*4)-Math.PI/2;
      const rr=(i%4===1||i%4===2)?r+7:r;
      p+=(i?'L':'M')+(cx+Math.cos(angle)*rr).toFixed(2)+','+(cy+Math.sin(angle)*rr).toFixed(2);
    }
    return p+'Z';
  };
  function wheelSVG(idx){
    const pos=wheels[idx];
    const teeth=teethPath(70,70,49);
    const spokes=Array.from({length:6},(_,i)=>{
      const ang=(i*60+pos*60)*Math.PI/180;
      return `<line x1="70" y1="70" x2="${(70+36*Math.cos(ang)).toFixed(1)}" y2="${(70+36*Math.sin(ang)).toFixed(1)}" stroke="#76542c" stroke-width="5"/>`;
    }).join('');
    return `<svg class="ws14-gear-art" viewBox="0 0 140 140" role="img" aria-label="Zählrad ${idx+1}, Stellung ${pos}"><defs><radialGradient id="ws14br${idx}"><stop stop-color="#f6dba0"/><stop offset=".63" stop-color="#b38b4e"/><stop offset="1" stop-color="#634323"/></radialGradient></defs><g style="transform-origin:70px 70px;transform:rotate(${pos*60}deg)"><path d="${teeth}" fill="url(#ws14br${idx})" stroke="#5d411d" stroke-width="2"/><circle cx="70" cy="70" r="42" fill="none" stroke="#e3be78" stroke-width="2"/>${spokes}<circle cx="70" cy="70" r="15" fill="#634527" stroke="#ead19c" stroke-width="4"/><circle cx="70" cy="70" r="5" fill="#e4d0a4"/></g></svg>`;
  }
  const roman = ['0','I','II','III','IV','V'];
  function render(){
    root.innerHTML=`<section class="ws-puzzle ws14"><div class="ws14-kicker">WERKSTATT WINTER · SCHLOSSPRÜFSTAND · AKTE 014</div><h3>Das Fünfhebelwerk</h3><p>Der verborgene Sockelverschluss ist kein gewöhnliches Schloss. Fünf Hebel greifen in drei Rastwerke ein. Jede gültige Bewegung verschiebt bestimmte Zählräder um eine feste Anzahl von Zähnen. <strong>Öffne den Riegel mit höchstens neun Bewegungen.</strong></p>
    <div class="ws14-bernd"><strong>Bernd:</strong> „Fünf Hebel und neun Handgriffe? Ich würde ja einen Dietrich nehmen, aber Johann hat offenbar sogar seine Geheimnisse mechanisiert.“</div>
    <div class="ws14-main"><div class="ws14-housing"><div class="ws14-inscription"><span>J. WINTER · 1928</span><span>MECHANISCHER PRÜFSTAND Nr. IV</span></div><div class="ws14-gears">${wheels.map((_,i)=>`<div class="ws14-gear"><div class="ws14-wheel-name">${['I · Klinkenrad','II · Antriebsrad','III · Sperrrad'][i]}</div>${wheelSVG(i)}<div class="ws14-counter">${roman[wheels[i]]}<span>/ V</span></div><div class="ws14-target">Soll: ${roman[TARGET.wheels[i]]}</div></div>`).join('')}</div><div class="ws14-iron"><span>MESSINGHEBEL – AUFWÄRTS / ABWÄRTS</span><span class="ws14-stroke">${history.length} / ${MAX} Rastvorgänge</span></div><div class="ws14-levers">${NAMES.map((id,i)=>{const up=get(mask,i);return `<button type="button" class="ws14-lever ${up?'is-up':''}" data-ws14-move="${i}" ${pending||won||history.length>=MAX?'disabled':''} aria-label="Hebel ${id}, derzeit ${up?'oben':'unten'}, betätigen" aria-pressed="${up}"><span class="ws14-lever-label">${id}</span><span class="ws14-lever-art"><span class="ws14-lever-stick"></span><span class="ws14-lever-grip"></span><span class="ws14-lever-base"></span></span><span class="ws14-lever-status">${up?'OBEN':'UNTEN'}</span><small>${TITLES[i]}</small></button>`;}).join('')}</div><div class="ws14-targetplate"><div><strong>ZIELSTELLUNG</strong><span>Räder: III · III · I</span><span>Hebel: A ↑ · B ↓ · C ↑ · D ↓ · E ↑</span></div><div class="ws14-lockicon">${won?'OFFEN':'VERRIEGELT'}</div></div></div>
    <div class="ws14-ledger"><article class="ws14-paper"><div class="ws14-handhead">Aus Johanns Werkstattbuch</div><h4>Die Sperrfolge</h4><p>Alle drei Zählräder beginnen bei <strong>Null</strong>. Nach <strong>V</strong> folgt wieder Null. Beim Anheben und Senken rückt die Sperrklinke stets <em>vorwärts</em> – niemals rückwärts.</p><div class="ws14-rules"><p><b>A</b> ist die Hauptsperre: B und C lassen sich nur bewegen, wenn A oben ist. A kann erst wieder abgesenkt werden, wenn B und C unten stehen.</p><p><b>D</b> bewegt sich nur bei angehobenem B und abgesenktem E.</p><p><b>E</b> bewegt sich nur bei angehobenem C und abgesenktem D.</p></div><table><thead><tr><th>Hebel</th><th>Rad I</th><th>Rad II</th><th>Rad III</th></tr></thead><tbody>${NAMES.map((n,i)=>`<tr><td><b>${n}</b></td>${DELTAS[i].map(v=>`<td>${v?'+'+v:'–'}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="ws14-annotation">Jede gültige Betätigung zählt als <strong>ein Rastvorgang</strong>. Nach dem neunten Vorgang sperrt der Prüfstand bis zum Zurücksetzen. Verwende die Werkstattnotizen, nicht bloßes Raten.</p></article><div class="ws14-paper ws14-check"><div class="ws14-handhead">Prüfkarte · Hohlraumverschluss</div><h4>Verschlussprotokoll</h4><div class="ws14-history"><strong>Bewegungsfolge</strong><div class="ws14-history-items">${history.length?history.map((h,i)=>`<span>${i+1}. ${h.label}</span>`).join(''):'<em>Noch keine Hebel betätigt</em>'}</div></div><div class="ws14-checkstate" id="ws14MovementNote" aria-live="polite">${feedback||'Betätige die Hebel und beobachte, welche Räder weiterlaufen.'}</div><div class="ws14-commands"><button type="button" class="alt" id="ws14Undo" ${history.length===0||pending||won?'disabled':''}>Letzte Bewegung zurück</button><button type="button" class="alt" id="ws14Reset" ${pending?'disabled':''}>Neu beginnen</button></div><button type="button" class="ws14-check-btn" id="ws14Check" ${pending||won||history.length!==MAX?'disabled':''}>Verschluss prüfen</button><div class="ws14-checkfeedback" id="ws14Feedback" aria-live="polite"></div>${won?'<div class="ws14-reveal"><small>BEWEISSTÜCK B13 · FREIGEGEBEN</small><h4>Der Revisionsverschluss ist geöffnet</h4><p>Der Mechanismus gibt den verborgenen Zugang zum Sockel frei. Doch ob die Winterstern jemals darin lag, muss erst die weitere Spurensicherung zeigen.</p></div>':''}</div></div></div>
    <div class="ws14-hints ws-hints"><details><summary>Hinweis 1 – Ohne Sperren geht nichts</summary>Beginne mit A, sonst kommst du weder an B noch an C heran. B muss angehoben sein, wenn du D betätigen willst; C muss oben sein, wenn du E betätigst.</details><details><summary>Hinweis 2 – Finde die Wechselwirkung</summary>D benötigt B oben, E dagegen C oben und D unten. Einige Hebel müssen daher zweimal bewegt werden. D und E können nicht gleichzeitig oben sein.</details><details><summary>Hinweis 3 – Vollständiger Lösungsweg</summary>Eine kürzeste Folge mit genau neun Bewegungen lautet: <strong>A – B – C – D – D – B – E – E – E</strong>. Die Räder stehen dann auf <strong>III / III / I</strong>; A, C und E stehen oben, B und D unten. Andere gleich kurze, physikalisch gültige Folgen können ebenfalls funktionieren.</details></div></section>`;
    root.querySelectorAll('[data-ws14-move]').forEach(btn=>btn.onclick=()=>{
      const i=Number(btn.dataset.ws14Move);
      const why=blocked(i);
      if(why){feedback=why;render();return}
      if(pending||won||history.length>=MAX)return;
      history.push({mask,wheels:[...wheels],label:NAMES[i]});
      mask ^= 1<<i;
      wheels=wheels.map((v,j)=>(v+DELTAS[i][j])%6);
      feedback=`Hebel ${NAMES[i]} betätigt. ${MAX-history.length} Rastvorgänge verbleiben.`;
      render();
    });
    q('ws14Undo').onclick=()=>{
      const last=history.pop();if(!last)return;
      mask=last.mask;wheels=last.wheels;
      feedback='Letzte Betätigung zurückgenommen.';render();
    };
    q('ws14Reset').onclick=()=>{mask=0;wheels=[0,0,0];history=[];feedback='Der Prüfstand steht wieder auf Null.';won=false;render()};
    q('ws14Check').onclick=async()=>{
      if(history.length!==MAX||pending||won)return;
      const success=mask===TARGET.mask&&wheels.every((v,i)=>v===TARGET.wheels[i]);
      if(!success){feedback='Der Riegel hält. Eine oder mehrere Endstellungen stimmen nicht. Du kannst Bewegungen zurücknehmen oder neu beginnen.';render();return}
      pending=true;render();
      try{
        const ok=await submit('RIEGEL');
        if(ok){won=true;feedback='Klack. Die Sperre löst sich. Das Werk ist geöffnet.';}
        else feedback='Das Werk ist richtig eingestellt, aber die geheime Antwort in der Spielleitung muss RIEGEL lauten.';
      }catch(e){feedback='Das Werk ist richtig eingestellt, aber die Speicherung hat nicht funktioniert. Versuche es erneut.'}
      finally{pending=false;render()}
    };
  }
  render();
}


/* Kapitel 15 – Der versperrte Wartungsgang
   Schiebeblock-Rätsel im Stil eines historischen Stellplans.
   Der burgunderrote Revisionswagen muss durch die Wartungsöffnung rechts ausfahren. */
function mountServiceCorridor15(root,submit){
  const q=id=>root.querySelector('#'+id);
  const pieces=[
    {id:'X',name:'Revisionswagen',kind:'Zielstück',dir:'H',len:2,row:2,col:0,color:'target'},
    {id:'H',name:'Samtkiste',kind:'Kiste',dir:'H',len:2,row:0,col:0,color:'maple'},
    {id:'F',name:'Sockelteil',kind:'Bauteil',dir:'H',len:3,row:0,col:2,color:'walnut'},
    {id:'A',name:'Werkzeugbank',kind:'Bank',dir:'H',len:2,row:1,col:4,color:'oak'},
    {id:'E',name:'Stativkiste',kind:'Kiste',dir:'V',len:2,row:1,col:2,color:'cedar'},
    {id:'B',name:'Standuhrgehäuse',kind:'Gehäuse',dir:'V',len:3,row:2,col:5,color:'ebony'},
    {id:'G',name:'Rohrständer',kind:'Ständer',dir:'V',len:3,row:3,col:1,color:'ash'},
    {id:'D',name:'Klappvitrine',kind:'Vitrine',dir:'H',len:2,row:3,col:3,color:'teak'},
    {id:'I',name:'Leerkiste',kind:'Kiste',dir:'V',len:2,row:4,col:0,color:'maple'},
    {id:'C',name:'Transportbock',kind:'Bock',dir:'V',len:2,row:4,col:3,color:'oak'},
    {id:'J',name:'Ablagetisch',kind:'Tisch',dir:'H',len:2,row:5,col:4,color:'cedar'}
  ];
  const start=Object.fromEntries(pieces.map(p=>[p.id,{row:p.row,col:p.col}]));
  let state=JSON.parse(JSON.stringify(start));
  let selected='X',drag=null,moves=0,pending=false,won=false,message='';

  const BOARD=6;
  const has=(id)=>pieces.find(p=>p.id===id);
  const occupied=(ignore=null)=>{
    const grid=[...Array(BOARD)].map(()=>Array(BOARD).fill(null));
    for(const p of pieces){
      if(p.id===ignore)continue;
      const pos=state[p.id];
      for(let k=0;k<p.len;k++){
        const r=pos.row+(p.dir==='V'?k:0), c=pos.col+(p.dir==='H'?k:0);
        grid[r][c]=p.id;
      }
    }
    return grid;
  };
  const clampRange=(id)=>{
    const piece=has(id),pos=state[id],grid=occupied(id);
    let min=piece.dir==='H'?pos.col:pos.row;
    let max=min;
    if(piece.dir==='H'){
      let c=pos.col-1;
      while(c>=0 && !grid[pos.row][c]){min=c;c--}
      c=pos.col+piece.len;
      while(c<BOARD && !grid[pos.row][c]){max=c-piece.len+1;c++}
    }else{
      let r=pos.row-1;
      while(r>=0 && !grid[r][pos.col]){min=r;r--}
      r=pos.row+piece.len;
      while(r<BOARD && !grid[r][pos.col]){max=r-piece.len+1;r++}
    }
    return {min,max};
  };
  const solved=()=>state.X.col===4;
  const movePiece=(id,target)=>{
    const piece=has(id),pos=state[id],range=clampRange(id);
    const next=Math.max(range.min,Math.min(range.max,target));
    const from=piece.dir==='H'?pos.col:pos.row;
    if(next===from)return false;
    if(piece.dir==='H')state[id]={...pos,col:next};
    else state[id]={...pos,row:next};
    moves++;
    if(solved())unlock();
    else {message=`${piece.name} verschoben. Der Wartungsgang ist noch nicht frei.`; render();}
    return true;
  };
  async function unlock(){
    if(won||pending)return;
    pending=true;
    message='Der Revisionswagen erreicht die Wartungsöffnung. Der Stellplan bestätigt den Zugang.';
    render();
    try{
      const ok=await submit('ZUGANG');
      if(ok){won=true; message='Der Revisionswagen ist durch den freigeräumten Gang gefahren. Befund zu Kapitel 15 wurde gesichert.';}
      else message='Das Rätsel ist gelöst. Bitte in der Spielleitung als Antwort für Kapitel 15 ZUGANG hinterlegen.';
    }catch(e){message='Der Gang ist freigelegt, aber die Speicherung ist fehlgeschlagen. Bitte erneut versuchen.';}
    finally{pending=false;render();}
  }
  const reset=()=>{state=JSON.parse(JSON.stringify(start));selected='X';moves=0;drag=null;pending=false;won=false;message='';render();};
  function controls(id){
    const piece=has(id),range=clampRange(id),pos=state[id],cur=piece.dir==='H'?pos.col:pos.row;
    const canBack=cur>range.min,canFwd=cur<range.max;
    const backLabel=piece.dir==='H'?'← nach links':'↑ nach oben';
    const fwdLabel=piece.dir==='H'?'→ nach rechts':'↓ nach unten';
    return `<div class="ws15-controls"><button type="button" class="alt" data-ws15-step="-1" ${!canBack||pending||won?'disabled':''}>${backLabel}</button><button type="button" class="alt" data-ws15-step="1" ${!canFwd||pending||won?'disabled':''}>${fwdLabel}</button></div>`;
  }
  const captions={X:'Revision',H:'Samt',F:'Sockel',A:'Werkzeug',E:'Stative',B:'Standuhr',G:'Rohre',D:'Vitrine',I:'Leer',C:'Transport',J:'Ablage'};
  const pictograms={X:'▤',H:'▦',F:'▥',A:'⚒',E:'▥',B:'◷',G:'║',D:'◇',I:'▤',C:'▥',J:'▤'};
  let dragSuppressClick=false;
  function render(){
    const sel=has(selected),sPos=state[selected],range=clampRange(selected);
    const list=pieces.map(p=>`<button type="button" class="ws15-object ${selected===p.id?'active':''}" data-ws15-select="${p.id}"><span><b>${p.name}</b><small>${p.dir==='H'?'waagrecht':'senkrecht'} · ${p.len} Felder</small></span><i>${p.id==='X'?'★':pictograms[p.id]}</i></button>`).join('');
    root.innerHTML=`<section class="ws-puzzle ws15"><div class="ws15-head"><div><span class="ws15-kicker">FALKENBRÜCK · STELLPLAN XV · WARTUNGSGANG</span><h3>Der versperrte Wartungsgang</h3><p>Johanns Stellmodell zeigt, wie Möbel und Transportmaterial den Wartungsbereich versperren. <strong>Schiebe den roten Revisionswagen in der dritten Reihe bis zur Öffnung rechts.</strong> Jedes Stück läuft nur in seiner vorgegebenen Richtung. Drehen ist nicht möglich.</p></div><div class="ws15-seal"><span>J.W.</span><small>1928</small></div></div><div class="ws15-bernd"><strong>Bernd:</strong> „Einfach den ganzen Raum aufräumen wäre natürlich auch eine Möglichkeit. Aber Johann bestand ja auf seinen Plänen.“</div><div class="ws15-layout"><div class="ws15-boardcard"><div class="ws15-boardtop"><span>STELLMODELL · SCHAURAUM</span><span>6 × 6 Stellfelder · Ansicht von oben</span></div><div class="ws15-board-wrap"><div class="ws15-exit-note">WARTUNGSÖFFNUNG →</div><div class="ws15-board" id="ws15Board" aria-label="Verschiebbares Stellmodell mit elf Gegenständen"><div class="ws15-grid" aria-hidden="true"></div><div class="ws15-exit" aria-hidden="true"></div>${pieces.map(p=>{const pos=state[p.id];return `<button type="button" class="ws15-piece ws15-prop-${p.id} ${p.color} ${selected===p.id?'selected':''} ${p.id==='X'?'goal':''}" data-piece="${p.id}" title="${p.name} · ${p.dir==='H'?'waagrecht':'senkrecht'} verschiebbar" aria-label="${p.name}, ${p.dir==='H'?'waagrecht':'senkrecht'}, ${p.len} Felder" aria-pressed="${selected===p.id}" style="--row:${pos.row};--col:${pos.col};--span:${p.len};--dir:${p.dir==='H'?'row':'col'};left:${pos.col*100/6}%;top:${pos.row*100/6}%;width:${(p.dir==='H'?p.len:1)*100/6}%;height:${(p.dir==='V'?p.len:1)*100/6}%"><span class="ws15-prop-art" aria-hidden="true"><span class="ws15-prop-detail">${pictograms[p.id]}</span></span><span class="ws15-piece-caption">${captions[p.id]}</span></button>`}).join('')}</div><div class="ws15-guide">Stücke direkt ziehen oder rechts mit den Pfeiltasten verschieben. Antippen wählt einen Gegenstand aus.</div></div><div class="ws15-boardmeta"><div><strong>${moves}</strong><span>Bewegungen</span></div><div><strong>${won?'frei':'blockiert'}</strong><span>Wartungsweg</span></div><div><strong>${sel.dir==='H'?'↔':'↕'}</strong><span>gewählte Richtung</span></div></div></div><div class="ws15-side"><div class="ws15-note"><div class="ws15-note-pin"></div><span class="ws15-overline">WERKSTATTKARTE</span><h4>Gewählter Gegenstand</h4><div class="ws15-current"><strong>${sel.name}</strong><span>${sel.kind} · ${sel.len} Rasterfelder · ${sel.dir==='H'?'waagrecht':'senkrecht'}</span></div><p>Aktuelle ${sel.dir==='H'?'Spalte':'Reihe'}: <strong>${(sel.dir==='H'?sPos.col:sPos.row)+1}</strong> von 6<br>Freie Startpositionen: <strong>${range.min+1}–${range.max+1}</strong></p>${controls(selected)}<div class="ws15-actions"><button type="button" class="alt" id="ws15Reset" ${pending?'disabled':''}>Anfangsaufstellung wiederherstellen</button></div><div id="ws15Feedback" class="ws15-feedback ${won?'good':''}" aria-live="polite">${message||'Wähle ein Möbelstück und schiebe es in Richtung seiner Längsachse.'}</div>${won?`<div class="ws15-reveal"><small>ERMITTLUNGSBEFUND · KAPITEL 15</small><h4>Der Zugang lässt sich freiräumen.</h4><p>Das Stellmodell zeigt, dass ein Bewegungsweg zum Wartungsbereich möglich war. <strong>Es beweist nicht</strong>, dass die Möbel am Tatabend tatsächlich so verschoben wurden.</p><p><strong>Weiterführende Frage:</strong> Was berichteten die damaligen Zeuginnen und Zeugen?</p></div>`:''}</div><div class="ws15-ledger"><div class="ws15-ledgerhead">Gegenstandsverzeichnis</div>${list}</div></div></div><div class="ws15-hints ws-hints"><details><summary>Hinweis 1 · Die entscheidende Reihe</summary>Der Revisionswagen fährt in der dritten Reihe. Prüfe, welche senkrechten Gegenstände diese Reihe kreuzen und in welche Richtung sie ausweichen könnten.</details><details><summary>Hinweis 2 · Erst Platz schaffen</summary>Das Standuhrgehäuse am rechten Rand lässt sich nach oben schieben, sobald die Werkzeugbank Platz gemacht hat. Plane danach die mittleren Blockaden.</details><details><summary>Hinweis 3 · Vollständiger Lösungsweg</summary>Eine mögliche Folge lautet: <strong>Werkzeugbank nach links, Standuhrgehäuse 2 nach oben, Klappvitrine nach rechts, Transportbock nach oben, Stativkiste 2 nach unten, Revisionswagen 2 nach rechts, Rohrständer 1 nach oben, Ablagetisch 3 nach links, Transportbock 1 nach unten, Klappvitrine nach links, Standuhrgehäuse 3 nach unten, Revisionswagen 2 nach rechts</strong>. Archivcode: <strong>ZUGANG</strong>.</details></div></section>`;

    const board=q('ws15Board');
    const unit=()=>board.clientWidth/BOARD;
    board.addEventListener('pointerdown',e=>{
      if(pending||won)return;
      const el=e.target.closest('[data-piece]');if(!el||!board.contains(el))return;
      const id=el.dataset.piece,piece=has(id),pos=state[id];
      selected=id;
      board.querySelectorAll('[data-piece]').forEach(x=>{x.classList.toggle('selected',x===el);x.setAttribute('aria-pressed',String(x===el));});
      drag={id,el,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,base:piece.dir==='H'?pos.col:pos.row,range:clampRange(id),axis:piece.dir,cell:unit(),active:false};
      board.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    board.addEventListener('pointermove',e=>{
      if(!drag||drag.pointerId!==e.pointerId)return;
      const d=drag.axis==='H'?e.clientX-drag.startX:e.clientY-drag.startY;
      const min=(drag.range.min-drag.base)*drag.cell,max=(drag.range.max-drag.base)*drag.cell;
      const px=Math.max(min,Math.min(max,d));
      if(Math.abs(d)>4)drag.active=true;
      drag.el.classList.toggle('is-dragging',drag.active);
      drag.el.style.transform=drag.axis==='H'?`translate3d(${px}px,0,0)`:`translate3d(0,${px}px,0)`;
    });
    const finish=e=>{
      if(!drag||drag.pointerId!==e.pointerId)return;
      const d=drag.axis==='H'?e.clientX-drag.startX:e.clientY-drag.startY;
      const target=Math.max(drag.range.min,Math.min(drag.range.max,Math.round(drag.base+d/drag.cell)));
      const id=drag.id;
      drag.el.style.transform='';drag=null;
      if(!movePiece(id,target))render();
    };
    board.addEventListener('pointerup',finish);
    board.addEventListener('pointercancel',()=>{drag=null;render();});
    board.querySelectorAll('[data-piece]').forEach(el=>el.addEventListener('keydown',e=>{
      if(pending||won)return;
      const p=has(el.dataset.piece);
      const forward=p.dir==='H'?'ArrowRight':'ArrowDown';
      const backward=p.dir==='H'?'ArrowLeft':'ArrowUp';
      if(e.key!==forward&&e.key!==backward)return;
      e.preventDefault();selected=p.id;const pos=state[p.id],from=p.dir==='H'?pos.col:pos.row;
      if(!movePiece(p.id,from+(e.key===forward?1:-1)))render();
    }));
    root.querySelectorAll('[data-ws15-select]').forEach(btn=>btn.onclick=()=>{selected=btn.dataset.ws15Select;render()});
    root.querySelectorAll('[data-ws15-step]').forEach(btn=>btn.onclick=()=>{
      const p=has(selected),pos=state[selected],from=p.dir==='H'?pos.col:pos.row;
      movePiece(selected,from+Number(btn.dataset.ws15Step));
    });
    q('ws15Reset').onclick=reset;
  }
  render();
}


/* Kapitel 16 – Zeugenaussagen aus dem physischen Polizeinotizbuch.
   Genau eine 15-bit-Loesung erfuellt alle acht Pruefregeln. */
function mountWitnessStatements16(root,submit){
  const WITNESSES=[
    {id:'A',name:'Klara Vogt',role:'Empfangsdienst'},
    {id:'B',name:'Nora Beck',role:'Fotografin'},
    {id:'C',name:'Marta Seidel',role:'Vorführende'},
    {id:'D',name:'Friedrich Keller',role:'Werkstattleiter'},
    {id:'E',name:'Elise Brandt',role:'Ausstellungsgehilfin'}
  ];
  const expected={A1:'w',A2:'f',A3:'w',B1:'f',B2:'w',B3:'w',C1:'w',C2:'w',C3:'f',D1:'f',D2:'w',D3:'f',E1:'w',E2:'f',E3:'w'};
  let values=Object.fromEntries(Object.keys(expected).map(k=>[k,'']));
  let pending=false,won=false,feedback='';
  const q=id=>root.querySelector('#'+id);
  const complete=()=>Object.values(values).every(Boolean);
  function paint(){
    const count=Object.values(values).filter(Boolean).length;
    root.innerHTML=`<section class="ws-puzzle ws16"><div class="ws16-top"><div><span class="ws16-kicker">POLIZEIPROTOKOLL XVI · FALKENBRÜCK, 14. DEZEMBER 1928</span><h3>Die widersprüchlichen Zeugenaussagen</h3><p>Fünf handschriftliche Polizeinotizen wurden im Fall Winterstern sichergestellt. Nicht jede Beobachtung stimmt. Nutze die <strong>fünf gedruckten Zeugenseiten</strong> und den gesonderten Vermerk zur Widerspruchsprüfung. Kennzeichne alle fünfzehn Aussagen als richtig oder falsch.</p></div><div class="ws16-stamp">KRIMINAL-<br>POLIZEI<br><b>1928</b></div></div><div class="ws16-bernd"><strong>Bernd:</strong> „Fünf Leute, fünfzehn Aussagen – und nicht einmal ein anständiges Protokoll ohne Widerspruch. Die Polizei hatte damals offenbar mehr Tinte als Geduld.“</div><div class="ws16-layout"><div class="ws16-log"><div class="ws16-loghead"><strong>Niederschriften A–E</strong><span>15 Einzelangaben</span></div>${WITNESSES.map(w=>`<div class="ws16-witness"><div class="ws16-witness-head"><span class="ws16-letter">${w.id}</span><div><strong>${w.name}</strong><small>${w.role}</small></div><i>BLATT ${w.id}</i></div><div class="ws16-statements">${[1,2,3].map(n=>{const key=w.id+n;return `<div class="ws16-line"><div class="ws16-line-id">${key}</div><div class="ws16-buttons" role="group" aria-label="Aussage ${key} beurteilen"><button type="button" class="${values[key]==='w'?'active':''}" data-ws16="${key}" data-ws16-val="w" aria-pressed="${values[key]==='w'}">Richtig</button><button type="button" class="${values[key]==='f'?'active wrong':''}" data-ws16="${key}" data-ws16-val="f" aria-pressed="${values[key]==='f'}">Falsch</button></div></div>`}).join('')}</div></div>`).join('')}</div><div class="ws16-side"><div class="ws16-pin"></div><div class="ws16-paper"><span class="ws16-paper-id">ZUSATZBLATT ZUM VERNEHMUNGSPROTOKOLL</span><h4>Die Widerspruchsprüfung</h4><p>Die einzelnen Aussagen stehen auf deinen gedruckten Unterlagen. Die Kreuzregeln findest du auf Blatt 6. Verwende am besten zunächst einen Bleistift, bevor du dich hier festlegst.</p><div class="ws16-count"><strong>${count}<small> / 15</small></strong><span>Aussagen eingeordnet</span></div><div class="ws16-progress"><span style="width:${Math.round(count/15*100)}%"></span></div><p class="ws16-small">Es werden keine einzelnen Antworten bestätigt. Die Prüfung bewertet nur das vollständige Protokoll.</p><button type="button" class="ws16-submit" id="ws16Submit" ${!complete()||pending||won?'disabled':''}>Gesamtes Protokoll prüfen</button><button type="button" class="alt ws16-reset" id="ws16Reset" ${pending||won?'disabled':''}>Alle Markierungen löschen</button><div id="ws16Feedback" aria-live="polite">${feedback?`<div class="notice ${won?'':'bad'}">${feedback}</div>`:''}</div>${won?`<div class="ws16-reveal"><small>BEWEISSTÜCK B15 · AUSWERTUNG</small><h4>Die Aussagen sind widerspruchsfrei eingeordnet.</h4><p><strong>Gesichert:</strong> Friedrich Keller wurde um 18:16 Uhr am Empfang gesehen. Martas Vorführung war zwar bis 18:25 Uhr angesetzt, sie war während dieses Zeitraums jedoch kurz nicht durchgehend am Platz.</p><p>Außerdem ist eine offene Verpackungskiste kurz vor dem Fund der leeren Vitrine erwähnt worden. Der Bericht benennt damit Fragen für die weitere Ermittlung, <strong>aber keinen Täter</strong>.</p></div>`:''}</div><div class="ws16-sidefoot">„Nicht jeder Irrtum ist eine Lüge. Wer sich täuscht, kann dieselbe Spur hinterlassen.“ <span>— Aktenrandnotiz</span></div></div></div><div class="ws16-hints ws-hints"><details><summary>Hinweis 1 · Mit den Personengruppen beginnen</summary>Auf dem Polizeivermerk steht, wie viele zutreffende Aussagen jede der fünf Personen gemacht hat. Verwende das als Einschränkung bei der Zuordnung.</details><details><summary>Hinweis 2 · Die Kreuzregeln auswerten</summary>Suche zuerst die Kombinationen B1/E1/E2, A2/C3/E3 und B1/D2/E1. Jede Kombination legt eine bestimmte Anzahl zutreffender Aussagen fest.</details><details><summary>Hinweis 3 · Vollständige Lösung</summary>A: <b>richtig / falsch / richtig</b>. B: <b>falsch / richtig / richtig</b>. C: <b>richtig / richtig / falsch</b>. D: <b>falsch / richtig / falsch</b>. E: <b>richtig / falsch / richtig</b>. Antwort: <b>PROTOKOLL</b>.</details></div></section>`;
    root.querySelectorAll('[data-ws16]').forEach(btn=>btn.onclick=()=>{if(pending||won)return;values[btn.dataset.ws16]=btn.dataset.ws16Val;feedback='';paint()});
    q('ws16Reset').onclick=()=>{values=Object.fromEntries(Object.keys(expected).map(k=>[k,'']));feedback='';paint()};
    q('ws16Submit').onclick=async()=>{
      if(!complete()||pending||won)return;
      if(!Object.keys(expected).every(k=>values[k]===expected[k])){
        feedback='Es gibt noch einen Widerspruch im Protokoll. Prüfe die gedruckten Verknüpfungen noch einmal. Einzelne Fehler werden nicht angezeigt.';paint();return;
      }
      pending=true;paint();
      try{
        const ok=await submit('PROTOKOLL');
        if(ok){won=true;feedback='Das Zeugenaussagenprotokoll ist korrekt ausgewertet und wurde gesichert.';}
        else feedback='Alle Aussagen stimmen. Bitte in der Spielleitung die geheime Antwort PROTOKOLL eintragen.';
      }catch(e){feedback='Die Auswertung stimmt, aber die Speicherung ist fehlgeschlagen. Bitte erneut versuchen.';}
      finally{pending=false;paint();}
    };
  }
  paint();
}

function mountFiber17(root,submit){
  let sample='',row='',col='',rotation='',symbol='',complete=false,pending=false,feedback='';
  const q=id=>root.querySelector('#'+id);
  const samples=[['A','Arbeitsschürze · Marta'],['B','Verpackungsband'],['C','Kameragurt · Nora'],['D','Mantelfutter · Keller'],['E','Halstuch · Voss']];
  const symbols=[['FEDER','Feder'],['BLATT','Blatt'],['MOND','Mond'],['ANKER','Anker'],['STERN','Stern']];
  function render(){
    root.innerHTML=`<section class="ws-puzzle ws17"><div class="ws17-kicker">KRIMINALTECHNIK · FALKENBRÜCK · FUND NR. F-17</div><div class="ws17-top"><div><h3>Der blaue Faden</h3><p>In der Nähe des Ausstellungssockels wurde ein kurzer blauer Faden gesichert. Zuerst hielt man ihn für einen Teil von Martas Schürze. Jetzt liegen fünf Vergleichsproben vor – und die Ähnlichkeit einzelner Kreuzungen reicht nicht aus.</p></div><div class="ws17-stamp">F17 <small>GEPRÜFT?</small></div></div><div class="ws17-bernd"><strong>Bernd:</strong> „Blau ist blau, dachte ich. Dann hat der Prüfer mir fünf verschiedene blaue Stoffe unter die Nase gehalten. Ich nehme das zurück.“</div><div class="ws17-table"><div class="ws17-topleft"><div class="ws17-heading">MATERIALPRÜFTISCH · 1928</div><div class="ws17-plate"><div class="ws17-plate-title">GESICHERTER AUSSCHNITT · F-17</div><div class="ws17-symbolboard"><span>×</span><span>◇</span><span>•</span><span>×</span><span>◇</span></div><p>Untersuche den <strong>4 × 5-Fundausschnitt</strong> aus deinem gedruckten Untersuchungsbogen. Lege ihn gedanklich über die fünf größeren Gewebemuster. Das passende Stück kann um <strong>180° gedreht</strong> sein.</p><div class="ws17-folio">Nur ein Vergleich darf in sämtlichen 20 Feldern übereinstimmen.</div></div><div class="ws17-instructions"><h4>Was du untersuchen musst</h4><ol><li>Finde die passende Probe A–E.</li><li>Bestimme die Startreihe und Startspalte des 4 × 5-Ausschnitts im 6 × 8-Muster.</li><li>Prüfe, ob der Fund gedreht wurde.</li><li>Übertrage das Päckchensymbol der Probe.</li></ol></div></div><div class="ws17-report"><div class="ws17-reporthead"><small>ARCHIV XVII / F-17</small><h4>Vergleichsprotokoll</h4><p>Trage nur den vollständigen Befund ein. Vorher wird keine einzelne Angabe kontrolliert.</p></div><label>Welche Probe enthält das Fundmuster?<select id="ws17Sample"><option value="">Probe auswählen</option>${samples.map(v=>`<option value="${v[0]}">Probe ${v[0]} · ${v[1]}</option>`).join('')}</select></label><div class="ws17-double"><label>Startreihe<select id="ws17Row"><option value="">Reihe</option>${[1,2,3].map(i=>`<option>${i}</option>`).join('')}</select></label><label>Startspalte<select id="ws17Col"><option value="">Spalte</option>${[1,2,3,4].map(i=>`<option>${i}</option>`).join('')}</select></label></div><label>Ausrichtung des Fundes<select id="ws17Rotation"><option value="">Ausrichtung auswählen</option><option value="0">0° · nicht gedreht</option><option value="180">180° · halbe Drehung</option></select></label><label>Symbol des passenden Etiketts<select id="ws17Symbol"><option value="">Symbol auswählen</option>${symbols.map(v=>`<option value="${v[0]}">${v[1]}</option>`).join('')}</select></label><div class="ws17-actions"><button class="alt" type="button" id="ws17Reset" ${pending||complete?'disabled':''}>Zurücksetzen</button><button type="button" id="ws17Check" ${!(sample&&row&&col&&rotation&&symbol)||pending||complete?'disabled':''}>Gesamten Faserbefund prüfen</button></div><div id="ws17Feedback" aria-live="polite">${feedback?`<div class="notice ${complete?'':'bad'}">${feedback}</div>`:''}</div>${complete?'<div class="ws17-reveal"><small>BEWEISSTÜCK B16 · FREIGEGEBEN</small><h4>Die blaue Faser gehört zum Verpackungsmuster.</h4><p>Unter den fünf vorgelegten Proben stimmt allein das blaue Verpackungsband vollständig mit dem Fund überein. Eine Herkunft von Martas Schürze wird durch diesen Mustervergleich nicht gestützt.</p><p><strong>Wichtig:</strong> Die Übereinstimmung identifiziert noch keine Person. Wer dieses Band erhielt oder benutzte, muss gesondert untersucht werden.</p></div>':''}</div></div><div class="ws17-hints ws-hints"><details><summary>Hinweis 1 · Der Ausschnitt ist nicht die ganze Probe</summary>Vergleiche immer alle 20 Zeichen im 4 × 5-Fundmuster. Der Fund kann an verschiedenen Stellen jeder 6 × 8-Probe liegen.</details><details><summary>Hinweis 2 · Eine halbe Drehung</summary>Denke an eine Drehung um 180°. Suche bei der Probe mit dem Verpackungsband in den inneren Reihen nach einer passenden Folge.</details><details><summary>Hinweis 3 · Vollständige Lösung</summary><strong>Probe B</strong>, Startreihe <strong>2</strong>, Startspalte <strong>3</strong>, Fund um <strong>180°</strong> gedreht, Symbol <strong>BLATT</strong>.</details></div></section>`;
    q('ws17Sample').value=sample;q('ws17Row').value=row;q('ws17Col').value=col;q('ws17Rotation').value=rotation;q('ws17Symbol').value=symbol;
    for(const [id,assign] of [['ws17Sample',v=>sample=v],['ws17Row',v=>row=v],['ws17Col',v=>col=v],['ws17Rotation',v=>rotation=v],['ws17Symbol',v=>symbol=v]])q(id).onchange=e=>{assign(e.target.value);feedback='';render()};
    q('ws17Reset').onclick=()=>{sample=row=col=rotation=symbol='';feedback='';render()};
    q('ws17Check').onclick=async()=>{
      if(pending||complete||!(sample&&row&&col&&rotation&&symbol))return;
      if(!(sample==='B'&&row==='2'&&col==='3'&&rotation==='180'&&symbol==='BLATT')){feedback='Die fünf Angaben sind noch nicht gemeinsam schlüssig. Prüfe den gedruckten Vergleichsbogen erneut.';render();return;}
      pending=true;render();try{const ok=await submit('BLATT');if(ok){complete=true;feedback='Der vollständige Faserbefund ist korrekt.';}else feedback='Der Befund stimmt. Bitte in der Spielleitung als geheime Antwort BLATT eintragen.';}catch(e){feedback='Der Befund stimmt, konnte aber nicht gespeichert werden. Bitte erneut versuchen.';}finally{pending=false;render()}
    };
  }render();
}


/* Kapitel 18: Papier-Sudoku, digitales Zahlenschloss, nach erfolgreicher Lösung das vollständige Sudoku. */
function mountMaterialSudoku18(root,submit){
  const TARGET='98461';
  const MARKS=[10,22,40,51,68];
  const LETTERS=['I','II','III','IV','V'];
  const POS=['Z2 · S2','Z3 · S5','Z5 · S5','Z6 · S7','Z8 · S6'];
  const SOLUTION=['687492531','492153876','153687924','219365487','365748192','748219653','576824319','824931765','931576248'];
  const CLUES=['','8','','','','2','','3','','4','','2','','','','','7','','','5','','6','','','9','','','','','','','','5','4','','','','','','7','','','','','','','','8','2','1','','','','3','','','','','8','2','','','','','','','','4','','','','7','6','','9','','','','7','','','4',''];
  let digits=['','','','',''],pending=false,done=false,message='';
  const q=id=>root.querySelector('#'+id);
  function solutionTable(){
    return `<div class="ws18paper-solution" role="table" aria-label="Vollständig gelöstes Sudoku">${SOLUTION.join('').split('').map((digit,i)=>`<div role="cell" class="ws18paper-cell ${MARKS.includes(i)?'marked':''} ${Math.floor(i/9)%3===0?'blocktop':''} ${i%9===0||i%9===3||i%9===6?'blockleft':''}"><span>${digit}</span>${MARKS.includes(i)?`<small>${LETTERS[MARKS.indexOf(i)]}</small>`:''}</div>`).join('')}</div>`;
  }
  function render(){
    const filled=digits.filter(Boolean).length;
    root.innerHTML=`<section class="ws-puzzle ws18paper">
    <div class="ws18paper-heading"><div><div class="ws18paper-kicker">FALKENBRÜCK · MATERIALARCHIV · AKTE XVIII</div><h3>Bernds Zahlenordnung</h3><p>Auf dem vergilbten Registerblatt wartet ein Sudoku mit fünf goldenen Markierungen. <strong>Das Rätsel löst du auf deinem ausgedruckten Blatt.</strong> Die Zahlen der Felder I bis V öffnen das Archivschloss.</p></div><div class="ws18paper-seal">XVIII<small>J. WINTER</small></div></div>
    <div class="ws18paper-bernd"><strong>Bernd:</strong> „Ich bin ja für Bleistift und Radiergummi. Wenn deine fünf Zahlen stimmen, mache ich dir das Archivfach auf. Wahrscheinlich.“</div>
    <div class="ws18paper-layout">
      <div class="ws18paper-left">
        <div class="ws18paper-paper"><div class="ws18paper-stamp">REGISTRATUR XVIII · VERSIEGELT</div><h4>Das Registerblatt</h4><p>Du findest das Sudoku in deinem Umschlag zu Kapitel 18. Fülle das <strong>9 × 9-Raster</strong> auf Papier aus. In jeder Zeile, Spalte und jedem 3 × 3-Block stehen die Ziffern 1 bis 9 genau einmal.</p><div class="ws18paper-mini"><span>01</span><i></i><span>02</span><i></i><span>03</span><i></i><span>04</span><i></i><span>05</span><i></i><span>06</span><i></i><span>07</span><i></i><span>08</span><i></i><span>09</span></div><p>Übertrage anschließend die fünf besonders markierten Zahlen in der Reihenfolge <strong>I – II – III – IV – V</strong>.</p><div class="ws18paper-note">Die vollständig gelöste Zahlenordnung wird <strong>erst nach Öffnung des Schlosses</strong> angezeigt.</div></div>
        <div class="ws18paper-record"><div class="ws18paper-ink">Aus Johanns Register</div><p>„Ein Zahlenschloss, fünf Einträge. Nicht die schnellste Lösung zählt, sondern die richtige Reihenfolge.“</p><small>W. · 1928</small></div>
      </div>
      <div class="ws18paper-lockcase"><div class="ws18paper-metal"><div class="ws18paper-metalhead"><span>MECHANISCHES ARCHIVSCHLOSS</span><span>Nº XVIII</span></div><div class="ws18paper-lockmark" aria-hidden="true"><span class="ws18paper-keyhole"></span></div><h4>Fünf Ziffern. Ein Archivfach.</h4><p>Stelle die Zahlen aus den goldenen Feldern deines Papier-Sudokus ein.</p><div class="ws18paper-wheels">${LETTERS.map((l,i)=>`<label class="ws18paper-wheel"><span>${l}</span><select id="ws18paperDigit${i}" aria-label="Ziffer ${l}"><option value="">–</option>${Array.from({length:9},(_,n)=>`<option value="${n+1}">${n+1}</option>`).join('')}</select><small>${POS[i]}</small></label>`).join('')}</div>
          <div class="ws18paper-counter">${filled} von 5 Zahlen eingestellt</div>
          <div class="ws18paper-actions"><button type="button" class="alt" id="ws18paperReset" ${done||pending?'disabled':''}>Zahlen zurücksetzen</button><button type="button" id="ws18paperCheck" ${filled!==5||pending||done?'disabled':''}>Schloss prüfen</button></div><div id="ws18paperFeedback" aria-live="polite" class="ws18paper-feedback">${message}</div>
        </div></div>
      </div>
    </div>
    ${done?`<div class="ws18paper-reveal" id="ws18paperReveal"><div class="ws18paper-revealhead">ARCHIVSCHLOSS GEÖFFNET · VOLLSTÄNDIGE AUFLÖSUNG</div><h4>Die entschlüsselte Zahlenordnung</h4><p>Hier ist das vollständig ausgefüllte Sudoku zum Vergleich mit deinem Papierbogen. Die goldenen Felder ergeben <strong>${TARGET}</strong>.</p>${solutionTable()}<div class="ws18paper-finding"><small>BEWEISSTÜCK B17 · MATERIALSACHBUCH</small><h4>Ein Materialeintrag fällt auf.</h4><p>Am 14. Dezember 1928 um <strong>17:40 Uhr</strong> wurde eine Rolle blauen Verpackungsbandes an <strong>Elise Brandt</strong> ausgegeben. Das belegt ihren Zugang zum Material – nicht, dass sie die Faser am Sockel hinterlassen oder die Uhr entwendet hat.</p><p><strong>Päckchensymbol:</strong> Buch</p></div></div>`:''}
    <div class="ws18paper-hints ws-hints"><details><summary>Hinweis 1 · Eine sichere Zahl</summary>Im Feld <strong>Zeile 2, Spalte 2</strong> steht eine <strong>9</strong>. Trage sie fest in dein Papier-Sudoku ein. Das ist zugleich Markierung I.</details><details><summary>Hinweis 2 · Eine weitere feste Zahl</summary>Das Feld <strong>Zeile 3, Spalte 5</strong> enthält eine <strong>8</strong>. Damit kannst du Zeile 3, Spalte 5 und den mittleren oberen 3 × 3-Block erneut durchgehen. Dies ist Markierung II.</details><details><summary>Hinweis 3 · Vollständige Lösung</summary>Die fünf markierten Felder lauten <strong>I=9, II=8, III=4, IV=6, V=1</strong>. Der Schloss-Code lautet <strong>98461</strong>. Das vollständige Sudoku erscheint nach dem Öffnen des Schlosses.</details></div>
    </section>`;
    LETTERS.forEach((l,i)=>{const field=q('ws18paperDigit'+i);field.value=digits[i];field.onchange=e=>{digits[i]=e.target.value;message='';render()}});
    q('ws18paperReset').onclick=()=>{digits=['','','','',''];message='';render()};
    q('ws18paperCheck').onclick=async()=>{
      if(digits.some(x=>!x)||pending||done)return;
      if(digits.join('')!==TARGET){message='Das Schloss bleibt verschlossen. Überprüfe die fünf Zahlen auf deinem Papierblatt.';render();return;}
      pending=true;message='Der Verschluss wird geprüft …';render();
      try{
        const result=await submit(TARGET);
        if(result){done=true;message='Das Archivfach ist offen.';}
        else message='Die Zahlen stimmen. Bitte in der Spielleitung bei Kapitel 18 die geheime Antwort 98461 hinterlegen.';
      }catch(e){message='Die Zahlen stimmen, doch das Speichern ist fehlgeschlagen. Bitte erneut prüfen.'}
      finally{pending=false;render()}
    };
  }
  render();
}


/* Kapitel 19: Kombinationschiffre. Schluessel, Versatz und Kennwort werden auf Papier ermittelt.
   Serverseitige Antwort in der Spielleitung: LOTSE. */
function mountCipherLetter19(root,submit){
  let pending=false;
  const q=id=>root.querySelector('#'+id);
  root.innerHTML=`<section class="ws-puzzle ws19">
    <div class="ws19-head"><div><div class="ws19-kicker">FALKENBRÜCK · AKTE XIX · VERTRAULICHE KORRESPONDENZ</div><h3>Der Brief mit dem Schiffssiegel</h3><p>Ein verschlüsselter Brief, fünf Hafenbelege und eine Kontrollkarte. Nur zusammen geben die Unterlagen den Inhalt frei.</p></div><div class="ws19-seal" aria-label="Schiffssiegel">XIX <small>SCHIFF</small></div></div>
    <div class="ws19-quote"><strong>Bernd:</strong> „Fünf Hafenbelege. Das ist immerhin übersichtlicher als mein Schreibtisch.“</div>
    <div class="ws19-layout"><div class="ws19-paper"><div class="ws19-topline">KORRESPONDENZREGISTER · ABSCHRIFT</div><h4>Drei Dokumente, ein Brief</h4><p>Nutze die ausgedruckten Unterlagen zu Kapitel 19. Das Schlüsselwort und die Buchstabenverschiebung stehen nicht unmittelbar im Geheimtext: Sie müssen aus den Belegen erschlossen werden.</p><div class="ws19-steps"><div><span>01</span> Bringe die fünf Hafenbelege in ihre zeitliche Reihenfolge und lies die Kontrollbuchstaben.</div><div><span>02</span> Rekonstruiere damit die ursprüngliche Spaltenordnung des verschlüsselten Briefes.</div><div><span>03</span> Vergleiche die zwei Kontrollwörter und entschlüssele den Brief. Das letzte Kennwort öffnet das Archiv.</div></div><p class="ws19-small">Keine einzelnen Zwischenschritte werden online bewertet. Die gesamte Aufgabe ist ohne Website auf Papier lösbar.</p></div>
    <div class="ws19-safe"><small>ARCHIVSCHLOSS Nº XIX</small><h4>Welches Kennwort steht am Ende?</h4><label for="ws19Answer">Kennwort aus dem entschlüsselten Brief</label><div class="ws19-entry"><input id="ws19Answer" type="text" autocomplete="off" maxlength="20" placeholder="Kennwort" aria-label="Kennwort"><button type="button" id="ws19Check">Befund prüfen</button></div><p id="ws19Feedback" aria-live="polite"></p><div class="ws19-caution">Der Brief kann ein finanzielles Motiv begründen. Ein Angebot beweist weder eine Auszahlung noch die Tat.</div></div></div>
    <div class="ws19-hints ws-hints"><details><summary>Hinweis 1 · Hafenbelege</summary>Ignoriere die Belegnummern. Sortiere die fünf Uhrzeiten der Abfertigung aufsteigend. Die danebenstehenden Kontrollbuchstaben bilden das fünfstellige Schlüsselwort.</details><details><summary>Hinweis 2 · Spaltenordnung</summary>Das Schlüsselwort lautet <strong>HAFEN</strong>. Die fünf verschlüsselten Abschnitte wurden alphabetisch nach A, E, F, H, N ausgelesen. Verteile sie auf die ursprünglichen Spalten H, A, F, E, N (also 4–1–3–2–5). Das Prüfwort HAUS wird in der verschobenen Version zu KDXV.</details><details><summary>Hinweis 3 · Klartext</summary>Lies die wiederhergestellte Tabelle zeilenweise und setze jeden Buchstaben um drei Stellen im Alphabet zurück. Der Brief beginnt mit <strong>ELISEBRANDT</strong>. Die Provision ist ausgeschrieben. Das letzte Kennwort lautet <strong>LOTSE</strong>.</details></div>
  </section>`;
  const input=q('ws19Answer'),button=q('ws19Check'),feedback=q('ws19Feedback');
  const doCheck=async()=>{
    if(pending)return;
    const raw=input.value.trim().toUpperCase();
    if(raw!=='LOTSE'){feedback.textContent=raw?'Das Kennwort stimmt nicht. Prüfe die letzten Wörter der entschlüsselten Abschrift.':'Bitte gib das Kennwort aus dem Brief ein.';return;}
    pending=true;button.disabled=true;feedback.textContent='Der Befund wird geprüft …';
    try{const ok=await submit('LOTSE');if(!ok)feedback.textContent='Das Kennwort stimmt. In der Spielleitung muss für Kapitel 19 noch LOTSE als geheime Antwort gespeichert werden.';}
    catch(e){feedback.textContent='Das Kennwort stimmt, aber das Speichern ist fehlgeschlagen. Bitte erneut prüfen.';}
    finally{pending=false;if(button.isConnected)button.disabled=false;}
  };
  button.onclick=doCheck;input.onkeydown=e=>{if(e.key==='Enter')doCheck();};
}


/* Kapitel 20: Papierzeitachse, Gesamtprüfung ohne schrittweise Lösungen. */
function mountTimeline20(root,submit){
  const observations=[
    {id:'Q',label:'Geräusch am Sockel',clock:'Saaluhr',display:'18:24',actual:'18:20'},
    {id:'R',label:'Elise wieder am Empfang',clock:'Empfangsuhr',display:'18:23',actual:'18:23'},
    {id:'S',label:'Glasplatte 42 / Winterstern sichtbar',clock:'Werkstatt-Nebenuhr',display:'18:08',actual:'18:15'},
    {id:'T',label:'Elise verlässt den Empfang',clock:'Saaluhr',display:'18:21',actual:'18:17'},
    {id:'U',label:'Leere Vitrine festgestellt',clock:'Saaluhr',display:'18:28',actual:'18:24'},
    {id:'V',label:'Keller am Empfang gesehen',clock:'Empfangsuhr',display:'18:16',actual:'18:16'},
    {id:'W',label:'Tür im Wartungsflur schließt',clock:'Werkstatt-Nebenuhr',display:'18:12',actual:'18:19'}
  ];
  let entered=Object.fromEntries(observations.map(o=>[o.id,''])),begin='',end='',conclusion='',pending=false,feedback='';
  const slots=Array.from({length:15},(_,i)=>'18:'+String(12+i).padStart(2,'0'));
  const q=id=>root.querySelector('#'+id);
  function timeline(){let out='<div class="ws20-axis" role="img" aria-label="Zeitachse von 18:12 bis 18:26">';
    for(let i=12;i<=26;i++){let time='18:'+String(i).padStart(2,'0');let ids=observations.filter(o=>entered[o.id]===time).map(o=>o.id).join(', ');out+=`<div class="ws20-minute"><strong>${i}</strong><span>${ids||'·'}</span></div>`;}
    return out+'</div>';
  }
  function render(){
    const count=Object.values(entered).filter(Boolean).length;
    root.innerHTML=`<section class="ws-puzzle ws20"><div class="ws20-head"><small>POLIZEIDIENSTSTELLE FALKENBRÜCK · ZEITPRÜFUNG XX</small><h3>Die sechs Minuten</h3><p>Drei Uhren, sieben Beobachtungen, ein zu prüfendes Zeitfenster. Nutze die gedruckten Kalibrierungsbelege und Ereigniskarten. Alle Zeiten sind auf Normalzeit umzurechnen.</p></div>
      <div class="ws20-sheet"><div class="ws20-sheethead"><strong>KONTROLLBOGEN · 14. DEZEMBER 1928</strong><span>${count}/7 Zeiten eingetragen</span></div>
      <div class="ws20-entries">${observations.map(o=>`<label class="ws20-entry"><span class="ws20-id">${o.id}</span><span><strong>${o.label}</strong><small>${o.clock} zeigt ${o.display} Uhr</small></span><select data-ws20-time="${o.id}" aria-label="Normalzeit Beobachtung ${o.id}"><option value="">Normalzeit …</option>${slots.map(t=>`<option value="${t}" ${entered[o.id]===t?'selected':''}>${t}</option>`).join('')}</select></label>`).join('')}</div>
      <h4>Gemeinsame Zeitachse</h4>${timeline()}<p class="ws20-muted">Die Buchstaben erscheinen erst, wenn du ihnen eine Normalzeit zuordnest. Mehrere Beobachtungen können theoretisch dieselbe Minute betreffen.</p></div>
      <div class="ws20-verdict"><h4>Ermittlungsbefund</h4><p>In welchem Zeitraum ist Elise zwischen ihren beiden belegten Beobachtungen <em>nicht am Empfang beobachtet</em>?</p><div class="ws20-range"><label>Beginn<select id="ws20Begin"><option value="">Auswählen</option>${slots.map(t=>`<option ${begin===t?'selected':''}>${t}</option>`).join('')}</select></label><label>Ende<select id="ws20End"><option value="">Auswählen</option>${slots.map(t=>`<option ${end===t?'selected':''}>${t}</option>`).join('')}</select></label></div><label>Welche Schlussfolgerung ist aus den Unterlagen zulässig?<select id="ws20Conclusion"><option value="">Aussage auswählen</option><option value="guilt" ${conclusion==='guilt'?'selected':''}>Elise ist damit als Täterin bewiesen.</option><option value="chance" ${conclusion==='chance'?'selected':''}>Elise hat in diesem Zeitraum eine mögliche Gelegenheit; ihr konkreter Aufenthaltsort und die Täterschaft sind damit nicht bewiesen.</option><option value="alibi" ${conclusion==='alibi'?'selected':''}>Elise hat ein lückenloses Alibi.</option></select></label><div class="ws20-buttons"><button type="button" class="alt" id="ws20Reset" ${pending?'disabled':''}>Zurücksetzen</button><button type="button" id="ws20Check" ${count!==7||!begin||!end||!conclusion||pending?'disabled':''}>Gesamte Zeitachse prüfen</button></div><p class="ws20-feedback" id="ws20Feedback" aria-live="polite">${feedback}</p></div>
      <div class="ws20-hints ws-hints"><details><summary>Hinweis 1 · Referenzuhr</summary>Die Empfangsuhr ist die Normalzeit. Vergleiche bei den Kontrollsignalen jeweils die gleichzeitig abgelesene Anzeige der Saaluhr und der Werkstatt-Nebenuhr mit ihr.</details><details><summary>Hinweis 2 · Die Gangfehler</summary>Die Werkstatt-Nebenuhr geht sieben Minuten nach: addiere sieben Minuten. Die Saaluhr geht vier Minuten vor: ziehe vier Minuten ab. Die Empfangsuhr wird nicht korrigiert.</details><details><summary>Hinweis 3 · Vollständige Auswertung</summary>S=18:15, V=18:16, T=18:17, W=18:19, Q=18:20, R=18:23, U=18:24. Elise wird zuletzt um 18:17 beim Verlassen des Empfangs und um 18:23 bei der Rückkehr beobachtet. Das ist eine Gelegenheit, aber kein Tatbeweis.</details></div></section>`;
    root.querySelectorAll('[data-ws20-time]').forEach(el=>el.onchange=()=>{entered[el.dataset.ws20Time]=el.value;feedback='';render()});
    q('ws20Begin').onchange=e=>{begin=e.target.value;feedback='';render()};q('ws20End').onchange=e=>{end=e.target.value;feedback='';render()};q('ws20Conclusion').onchange=e=>{conclusion=e.target.value;feedback='';render()};
    q('ws20Reset').onclick=()=>{entered=Object.fromEntries(observations.map(o=>[o.id,'']));begin='';end='';conclusion='';feedback='';render()};
    q('ws20Check').onclick=async()=>{
      if(pending)return;
      const match=observations.every(o=>entered[o.id]===o.actual)&&begin==='18:17'&&end==='18:23'&&conclusion==='chance';
      if(!match){feedback='Noch stimmt nicht alles überein. Kontrolliere sämtliche Uhrkorrekturen und die Schlussfolgerung. Einzelne Ergebnisse werden nicht bewertet.';render();return;}
      pending=true;feedback='Die vollständige Rekonstruktion wird im Archiv geprüft …';render();
      try{const ok=await submit('ZEITFENSTER');if(!ok)feedback='Die Rekonstruktion ist korrekt. In der Spielleitung muss für Kapitel 20 ZEITFENSTER als geheime Antwort hinterlegt sein.';}
      catch(e){feedback='Die Rekonstruktion stimmt, aber die Speicherung konnte nicht abgeschlossen werden. Bitte erneut versuchen.';}
      finally{pending=false;if(q('ws20Check'))render();}
    };
  }
  render();
}

/* Kapitel 21 – Raumwege und Alibi. Papierkarte ist vollständige Datengrundlage. */
function mountAlibi21(root,submit){
 const q=id=>root.querySelector('#'+id);
 const paths={EA:'',ES:'',SA:''};let early='',late='',verdict='',busy=false,feedback='';
 const routes={EA:[['E-G-A','5'],['E-H-A','7'],['E-H-G-A','7']],ES:[['E-H-S','5'],['E-G-S','6'],['E-G-H-S','7']],SA:[['S-A','4'],['S-H-A','8'],['S-G-A','7']]};
 const labels={EA:'Empfang → Archiv',ES:'Empfang → Sockel',SA:'Sockel → Archiv'};
 const choose=(id)=>`<label class="ws21-route"><span>${labels[id]}</span><select data-route="${id}"><option value="">Kürzeste zulässige Verbindung …</option>${routes[id].map(([r,t])=>`<option value="${r}" ${paths[id]===r?'selected':''}>${r.replaceAll('-',' → ')} · ${t} Minuten</option>`).join('')}</select></label>`;
 const times=Array.from({length:16},(_,i)=>`18:${String(i+12).padStart(2,'0')}`);
 const selectTime=(id,value)=>`<select id="${id}"><option value="">Zeit wählen</option>${times.map(t=>`<option value="${t}" ${t===value?'selected':''}>${t}</option>`).join('')}</select>`;
 function render(){
 root.innerHTML=`<section class="ws-puzzle ws21"><div class="ws21-heading"><small>POLIZEIDIENSTSTELLE FALKENBRÜCK · AKTE XXI · WEGEPRÜFUNG</small><h3>Der Weg, der nicht möglich war</h3><p>Prüfe Kellers Alibi anhand des Gebäudeplans. Nur eingezeichnete, für Keller passierbare Wege zählen. Zeiten sind Mindestgehzeiten einschließlich der Türen. Eine Person kann nicht gleichzeitig an zwei Orten sein.</p></div>
 <div class="ws21-quote">Die Hinweise aus Kapitel 20 bleiben gültig: Um 18:15 Uhr war die Winterstern noch zu sehen, um 18:24 Uhr wurde die Vitrine leer vorgefunden.</div>
 <div class="ws21-columns"><div class="ws21-panel"><h4>1 · Wegprüfung</h4><p>Welche der auf dem Druckplan angegebenen zulässigen Routen ist jeweils am schnellsten? Die Bezeichner entsprechen den Buchstaben der Räume.</p>${choose('EA')}${choose('ES')}${choose('SA')}<p class="ws21-small">Die gestrichelte Verbindung E–S ist eine gesperrte Servicetür. Keller besitzt laut Schlüsselregister keinen Zugang. Sie zählt nicht als Weg.</p></div>
 <div class="ws21-panel"><h4>2 · Zeitgrenzen</h4><p>Keller wird um <strong>18:16 Uhr am Empfang</strong> und um <strong>18:22 Uhr im Archiv</strong> bezeugt. Rechne die Grenzen eines denkbaren Sockelbesuchs aus.</p><label>Früheste Ankunft am Sockel nach 18:16 Uhr${selectTime('ws21Early',early)}</label><label>Späteste Abreise vom Sockel für Ankunft im Archiv um 18:22 Uhr${selectTime('ws21Late',late)}</label><div class="ws21-timehint">Ein Besuch dazwischen wäre nur möglich, wenn Ankunft ≤ Abreise ist.</div></div></div>
 <div class="ws21-panel ws21-verdict"><h4>3 · Ermittlungsbefund</h4><label>Welche Aussage wird durch Wege und Zeitbelege gestützt?<select id="ws21Verdict"><option value="">Befund auswählen</option><option value="cleared" ${verdict==='cleared'?'selected':''}>Keller kann im Tatfenster den Sockel nicht persönlich erreicht haben; eine anderweitige Beteiligung ist damit nicht geprüft.</option><option value="guilty" ${verdict==='guilty'?'selected':''}>Die Wegeberechnung beweist, dass Elise die Uhr entwendet hat.</option><option value="uncertain" ${verdict==='uncertain'?'selected':''}>Keller hätte den Sockel jederzeit erreichen können.</option></select></label><div class="ws21-actions"><button type="button" class="alt" id="ws21Reset">Zurücksetzen</button><button type="button" id="ws21Check" ${busy?'disabled':''}>Gesamten Befund prüfen</button></div><div id="ws21Feedback" aria-live="polite" class="ws21-feedback">${feedback}</div></div>
 <div class="ws21-hints ws-hints"><details><summary>Hinweis 1 · Der Plan</summary>Berücksichtige nicht nur Streckenlängen, sondern auch die verschlossene Servicetür E–S. Für Keller ist diese Abkürzung nicht nutzbar.</details><details><summary>Hinweis 2 · Vorwärts und rückwärts</summary>Rechne ab Empfang 18:16 vorwärts bis zum Sockel und ab Archiv 18:22 rückwärts bis zum spätesten Verlassen des Sockels. Vergleiche beide Grenzen.</details><details><summary>Hinweis 3 · Vollständige Wegprüfung</summary>Die kürzesten Wege sind E–G–A = 5 Minuten, E–H–S = 5 Minuten und S–A = 4 Minuten. Ein Sockelbesuch könnte erst um 18:21 Uhr beginnen, müsste aber bereits 18:18 Uhr enden. Vor 18:16 und nach 18:22 scheitert ein Sockelaufenthalt außerdem an den Gehzeiten zum bekannten Tatfenster.</details></div></section>`;
 root.querySelectorAll('[data-route]').forEach(el=>el.onchange=()=>{paths[el.dataset.route]=el.value;feedback='';render()});
 q('ws21Early').onchange=e=>{early=e.target.value;feedback='';render()};q('ws21Late').onchange=e=>{late=e.target.value;feedback='';render()};q('ws21Verdict').onchange=e=>{verdict=e.target.value;feedback='';render()};
 q('ws21Reset').onclick=()=>{for(const id in paths)paths[id]='';early='';late='';verdict='';feedback='';render()};
 q('ws21Check').onclick=async()=>{
  const correct=paths.EA==='E-G-A'&&paths.ES==='E-H-S'&&paths.SA==='S-A'&&early==='18:21'&&late==='18:18'&&verdict==='cleared';
  if(!correct){feedback='Der Befund ist noch nicht stimmig. Prüfe die passierbaren Wege und die zeitlichen Grenzen zusammen. Es werden keine Einzelantworten bewertet.';render();return;}
  if(busy)return;busy=true;feedback='Der Befund wird geprüft …';render();
  try{const ok=await submit('WEGSPERRE');feedback=ok?'Kellers Weg zum Sockel ist innerhalb des Tatfensters ausgeschlossen.':'Die Berechnung stimmt. Hinterlege für Kapitel 21 in der Spielleitung WEGSPERRE als geheime Antwort.';}
  catch(e){feedback='Richtig gelöst, aber die Speicherung konnte nicht bestätigt werden. Bitte erneut versuchen.';}
  finally{busy=false;if(q('ws21Check'))render()}
 };
 }
 render();
}



/* Kapitel 22 – Aktenprüfung: neun Aussagen + Aktenbelege; erst vollständiger Befund wird eingereicht. */
function mountEvidence22(root,submit){
  const rows=[
    ['01','Winterstern um 18:15 Uhr noch sichtbar','B','A','L','Q','F'],
    ['02','Vitrine bereits um 18:15 Uhr leer','W','A','I','Q','X'],
    ['03','Elise verlässt um 18:17 Uhr den Empfang','B','B','C','Q','F'],
    ['04','Elise um 18:20 Uhr am Sockel gesehen','O','C','H','Q','F'],
    ['05','Geräusch sicher von der Sockelklappe','O','C','T','Q','F'],
    ['06','Keller kann im Tatfenster persönlich am Sockel sein','W','D','S','Q','F'],
    ['07','800 RM als Provision angeboten','B','E','P','Q','F'],
    ['08','800 RM nachweislich ausgezahlt','O','E','U','Q','F'],
    ['09','Elise von 18:17 bis 18:23 durchgehend am Empfang','W','B','R','Q','F']
  ];
  const idx={B:0,W:1,O:2};const vals=rows.map(()=>({status:'',evidence:''}));let pending=false,feedback='';
  const opts=[['','Wählen'],['B','Belegt'],['W','Widerlegt'],['O','Offen']];
  const letterOptions=r=>{const v=['Q','F','X'];v[idx[r[2]]]=r[4];return v};
  function render(){
    const done=vals.filter(v=>v.status&&v.evidence).length;
    const word=rows.map((r,i)=>vals[i].status?letterOptions(r)[idx[vals[i].status]]:'·').join('');
    root.innerHTML=`<section class="ws-puzzle ws22"><div class="ws22-head"><small>FALKENBRÜCK · AKTE XXII · SONNENPRÜFUNG</small><h3>Das Urteil der Akten</h3><p>Neun Behauptungen, fünf Aktenstücke. Unterscheide gesicherte Fakten, widerlegte Behauptungen und offene Fragen. Nutze die drei gedruckten Seiten. Jede Aussage braucht einen zugeordneten Aktenbeleg.</p></div><div class="ws22-advice"><strong>Die Regel:</strong> Belegt = aus den Unterlagen nachweisbar · Widerlegt = den Unterlagen widersprechend · Offen = nicht entscheidbar. Verdacht ist kein Beweis.</div><div class="ws22-status">Prüfvermerke: <strong>${done} / 9</strong></div><div class="ws22-list">${rows.map((r,i)=>`<div class="ws22-card"><div class="ws22-num">${r[0]}</div><div class="ws22-content"><strong>${r[1]}</strong><div class="ws22-controls"><label>Einordnung<select data-status="${i}">${opts.map(([v,l])=>`<option value="${v}" ${vals[i].status===v?'selected':''}>${l}</option>`).join('')}</select></label><label>Aktenbeleg<select data-evidence="${i}"><option value="">Beleg wählen</option>${['A','B','C','D','E'].map(v=>`<option ${vals[i].evidence===v?'selected':''}>${v}</option>`).join('')}</select></label></div></div></div>`).join('')}</div><div class="ws22-finale"><h4>Archivkennwort</h4><p>Übertrage die Buchstaben aus der gedruckten B/W/O-Tabelle in Kartenreihenfolge.</p><div class="ws22-letters" aria-label="Kennwort aus der Zuordnung">${word.split('').map(v=>`<span>${v}</span>`).join('')}</div><p class="ws22-hint-text">Das Kennwort wird erst bestätigt, wenn alle neun Urteile und die neun Belegzuordnungen stimmen.</p><div class="ws22-actions"><button type="button" class="alt" id="ws22Reset">Zurücksetzen</button><button type="button" id="ws22Check" ${done!==9||pending?'disabled':''}>Gesamten Befund prüfen</button></div><div id="ws22Feedback" class="ws22-feedback" role="status" aria-live="polite">${feedback}</div></div><div class="ws22-hints ws-hints"><details><summary>Hinweis 1 · Wann ist etwas offen?</summary>Ein Beleg über ein Angebot beweist nicht die Auszahlung. Ein Geräusch beweist nicht dessen Ursache. Unterscheide Aussage und Interpretation.</details><details><summary>Hinweis 2 · Drei besonders wichtige Belege</summary>Beleg A klärt den Zustand der Vitrine um 18:15. Beleg D klärt Kellers persönliche Wegemöglichkeit. Beleg E unterscheidet Provisionsangebot und tatsächliche Zahlung.</details><details><summary>Hinweis 3 · Die Ordnung</summary>Belegt sind die Karten 01, 03 und 07. Widerlegt sind 02, 06 und 09. Offen bleiben 04, 05 und 08. Suche zu jeder Karte noch den passenden Aktenbeleg, bevor du prüfst.</details></div></section>`;
    root.querySelectorAll('[data-status]').forEach(el=>el.onchange=()=>{vals[Number(el.dataset.status)].status=el.value;feedback='';render()});
    root.querySelectorAll('[data-evidence]').forEach(el=>el.onchange=()=>{vals[Number(el.dataset.evidence)].evidence=el.value;feedback='';render()});
    root.querySelector('#ws22Reset').onclick=()=>{vals.forEach(v=>{v.status='';v.evidence=''});feedback='';render()};
    root.querySelector('#ws22Check').onclick=async()=>{
      if(pending||done!==9)return;
      if(!rows.every((r,i)=>vals[i].status===r[2]&&vals[i].evidence===r[3])){feedback='Mindestens eine Aussage oder ihre Belegzuordnung stimmt nicht. Prüfe den Gesamtbefund erneut; Einzelantworten werden nicht bewertet.';render();return}
      pending=true;feedback='Der vollständige Aktenbefund wird geprüft …';render();
      try{const ok=await submit('LICHTSPUR');feedback=ok?'Der Aktenbefund ist bestätigt. Offene Fragen bleiben für die nächsten Ermittlungen offen.':'Der Befund stimmt. In der Spielleitung muss für Kapitel 22 LICHTSPUR als geheime Antwort hinterlegt sein.'}
      catch(e){feedback='Alle Urteile stimmen, aber die Speicherung ist fehlgeschlagen. Bitte erneut versuchen.'}
      finally{pending=false;render()}
    };
  }
  render();
}


/* Kapitel 23: sieben beidseitige Kupplungsplatten, unabhängige Endpunktprüfung. */
function mountTransmission23(root,submit){
  const node=[['KREIS','1'],['DREIECK','2'],['RAUTE','3'],['STERN','1'],['KREIS','4'],['DREIECK','3'],['RAUTE','2'],['STERN','4']];
  const parts=[
    {id:'D',name:'Schlüsselwelle',l:0,r:1},
    {id:'G',name:'Antriebsstift',l:2,r:1},
    {id:'B',name:'Rastklinke',l:2,r:3},
    {id:'F',name:'Nockenscheibe',l:4,r:3},
    {id:'A',name:'Zugschieber',l:4,r:5},
    {id:'E',name:'Klappenriegel',l:6,r:5},
    {id:'C',name:'Revisionsklappe',l:6,r:7}
  ];
  const reference=Object.fromEntries(parts.map(p=>[p.id,p]));
  let order=Array(7).fill(''),turn=Array(7).fill(''),judgment='',pending=false,feedback='';
  const fmt=n=>node[n].join(' / ');
  const options=selected=>'<option value="">Platte wählen</option>'+['A','B','C','D','E','F','G'].map(v=>`<option value="${v}" ${selected===v?'selected':''}>${v}</option>`).join('');
  const states=[['','Ausrichtung wählen'],['normal','Unverändert'],['gedreht','Um 180° gedreht']];
  const view=(p,o)=>{if(!p||!o)return '—'; const item=reference[p];return fmt(o==='normal'?item.l:item.r)+' → '+fmt(o==='normal'?item.r:item.l)};
  function render(){
    const count=order.filter((v,i)=>v&&turn[i]).length;
    root.innerHTML=`<section class="ws-puzzle ws23"><div class="ws23-header"><small>FALKENBRÜCK · AKTE XXIII · TECHNISCHE REKONSTRUKTION</small><h3>Die verborgene Übertragung</h3><p>Sieben Kupplungsplatten verbinden die Schlüsselwelle mit der Sockelklappe. Nutze das Druckmaterial und setze die Kette lückenlos zusammen: Zwei Anschlussmarken müssen jeweils gleichzeitig übereinstimmen.</p></div>
     <div class="ws23-note"><strong>Aus Akte XIII/XIV:</strong> Ein Hohlraum und ein Revisionsverschluss sind konstruktiv bekannt. <strong>Aus Akte XX/XXII:</strong> Ein metallisches Geräusch um 18:20 Uhr ist dokumentiert, seine Ursache aber noch nicht bewiesen.</div>
     <div class="ws23-board"><div class="ws23-station"><span>START</span><strong>${fmt(0)}</strong><small>Schlüsselwelle</small></div>
     ${Array.from({length:7},(_,i)=>`<div class="ws23-line"><span class="ws23-index">${i+1}</span><label>Platte<select data-ws23-id="${i}">${options(order[i])}</select></label><label>Ausrichtung<select data-ws23-turn="${i}">${states.map(([v,lab])=>`<option value="${v}" ${v===turn[i]?'selected':''}>${lab}</option>`).join('')}</select></label><span class="ws23-ports">${view(order[i],turn[i])}</span></div>`).join('')}
     <div class="ws23-station"><span>ZIEL</span><strong>${fmt(7)}</strong><small>Revisionsklappe</small></div></div>
     <div class="ws23-judgment"><h4>Was darfst du aus der Rekonstruktion schließen?</h4><label>Technischer Befund<select id="ws23Judgment"><option value="">Befund wählen</option><option value="possible" ${judgment==='possible'?'selected':''}>Der mechanische Weg zur Klappe ist nachvollziehbar; wer sie um 18:20 Uhr betätigte, ist dadurch nicht bewiesen.</option><option value="proof" ${judgment==='proof'?'selected':''}>Damit ist Elise als Bedienerin der Klappe um 18:20 Uhr bewiesen.</option><option value="impossible" ${judgment==='impossible'?'selected':''}>Die Klappe lässt sich grundsätzlich nicht betätigen.</option></select></label><div class="ws23-buttons"><button type="button" class="alt" id="ws23Reset" ${pending?'disabled':''}>Zurücksetzen</button><button type="button" id="ws23Check" ${pending||count!==7||!judgment?'disabled':''}>Vollständige Übertragung prüfen</button></div><div class="ws23-feedback" role="status" aria-live="polite">${feedback}</div></div>
     <div class="ws23-hints ws-hints"><details><summary>Hinweis 1 · Anschlüsse</summary>Jede Kupplungsstelle hat eine Form und eine Kerbzahl. Beide müssen an der Berührungsstelle übereinstimmen. Die Bezeichnungen auf den Platten sind eine zusätzliche technische Orientierung.</details><details><summary>Hinweis 2 · Anfänge und Drehungen</summary>Die Startmarke lautet KREIS/1. Damit beginnt Platte D. Der nächste Anschluss lautet DREIECK/2. Einige Platten liegen im Druckmaterial rückwärts: Eine halbe Drehung vertauscht ihren linken und rechten Anschluss.</details><details><summary>Hinweis 3 · Gesamtkette</summary>Die Folge ist <strong>D – G – B – F – A – E – C</strong>. G, F und E werden jeweils um 180° gedreht. Die mechanische Möglichkeit belegt noch keine Person und keine tatsächliche Betätigung.</details></div></section>`;
    root.querySelectorAll('[data-ws23-id]').forEach(el=>el.onchange=()=>{const i=Number(el.dataset.ws23Id);order[i]=el.value;feedback='';render()});
    root.querySelectorAll('[data-ws23-turn]').forEach(el=>el.onchange=()=>{turn[Number(el.dataset.ws23Turn)]=el.value;feedback='';render()});
    root.querySelector('#ws23Judgment').onchange=e=>{judgment=e.target.value;feedback='';render()};
    root.querySelector('#ws23Reset').onclick=()=>{order=Array(7).fill('');turn=Array(7).fill('');judgment='';feedback='';render()};
    root.querySelector('#ws23Check').onclick=async()=>{
      if(pending)return;
      if(new Set(order).size!==7){feedback='Jede Platte darf nur einmal eingesetzt werden.';render();return;}
      let current=0,valid=true;
      for(let i=0;i<7;i++){const p=reference[order[i]],flipped=turn[i]==='gedreht';const left=flipped?p.r:p.l,right=flipped?p.l:p.r;if(left!==current){valid=false;break;}current=right;}
      if(!valid||current!==7||judgment!=='possible'){feedback='Mindestens ein Anschluss oder der Ermittlungsbefund passt nicht. Prüfe die vollständige Kette; Einzelstellen werden nicht freigegeben.';render();return;}
      pending=true;feedback='Die rekonstruierte Übertragung wird geprüft …';render();
      try{const ok=await submit('KUPPLUNG');feedback=ok?'Der mechanische Übertragungsweg ist rekonstruiert. Die Täterschaft bleibt Gegenstand des Finales.':'Die Kette stimmt. Bitte in der Spielleitung KUPPLUNG als Geheimantwort für Kapitel 23 hinterlegen.';}
      catch(e){feedback='Richtig gelöst, aber das Speichern hat nicht funktioniert. Bitte erneut versuchen.';}
      finally{pending=false;render();}
    };
  }
  render();
}
