{
const $=s=>document.querySelector(s);
const IC={
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
 map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
 paw:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="10" r="2.2"/><circle cx="10" cy="6" r="2.2"/><circle cx="14" cy="6" r="2.2"/><circle cx="18" cy="10" r="2.2"/><path d="M12 11c-3 0-6 4-6 6.5S8 21 12 21s6-1 6-3.5S15 11 12 11z"/></svg>',
 cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
 more:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>'
};
const TABS=[['inicio','Inicio','home'],['mapa','Mapa','map'],['animales','Animales','paw'],['agenda','Agenda','cal'],['mas','Más','more']];
const TAB_OF={inicio:'inicio',info:'inicio',mapa:'mapa',punto:'mapa',animales:'animales',ficha:'animales',zonas:'animales',agenda:'agenda',ruta:'agenda',servicios:'mas',contacto:'mas',mas:'mas',ajustes:'mas'};
const SPECIES=[
 {id:'oso',em:'🐻',n:'Oso andino',s:'Tremarctos ornatus',g:'Mamíferos',st:'Vulnerable',c:'vu',z:'Bosque andino',hab:'Bosques y páramos andinos, de 500 a 4.000 m',ali:'Omnívoro: bromelias, frutos, raíces e insectos',cur:'Es el único oso de Sudamérica; las manchas claras de su cara son únicas en cada individuo.',p:'1'},
 {id:'condor',em:'🦅',n:'Cóndor andino',s:'Vultur gryphus',g:'Aves',st:'En peligro',c:'en',z:'Páramo',hab:'Páramos y acantilados de los Andes',ali:'Carroñero',cur:'Ave nacional del Ecuador; Valentino vive en Amaru desde 2010.',p:'2'},
 {id:'jaguar',em:'🐆',n:'Jaguar',s:'Panthera onca',g:'Mamíferos',st:'En peligro',c:'en',z:'Bosque húmedo tropical',hab:'Selva amazónica',ali:'Carnívoro',cur:'Es el felino más grande de América.',p:'4'},
 {id:'puma',em:'🐈',n:'Puma',s:'Puma concolor',g:'Mamíferos',st:'Casi amenazada',c:'vu',z:'Felinos',hab:'Desde la costa hasta el páramo',ali:'Carnívoro',cur:'Puede saltar más de 5 m de longitud.',p:'7'},
 {id:'leon',em:'🦁',n:'León africano',s:'Panthera leo',g:'Mamíferos',st:'Vulnerable',c:'vu',z:'Felinos',hab:'Sabanas de África',ali:'Carnívoro',cur:'Especie exótica que vive en Amaru con fines educativos.',p:'7'},
 {id:'tortuga',em:'🐢',n:'Tortuga gigante de Galápagos',s:'Chelonoidis sp.',g:'Reptiles',st:'Vulnerable',c:'vu',z:'Bosque seco',hab:'Zonas secas y altas de Galápagos',ali:'Herbívora',cur:'Su digestión puede durar de 1 a 3 semanas.',p:'6'},
 {id:'perezoso',em:'🦥',n:'Perezoso de dos dedos',s:'Choloepus didactylus',g:'Mamíferos',st:'Preocupación menor',c:'lc',z:'Bosque húmedo tropical',hab:'Selva amazónica',ali:'Hojas y frutos',cur:'Baja de los árboles una vez por semana.',p:'4'},
 {id:'cocodrilo',em:'🐊',n:'Cocodrilo americano',s:'Crocodylus acutus',g:'Reptiles',st:'Vulnerable',c:'vu',z:'Humedal',hab:'Manglares y ríos de la costa',ali:'Carnívoro',cur:'Puede pasar meses sin comer.',p:'5'},
 {id:'guacamayo',em:'🦜',n:'Guacamayo',s:'Ara sp.',g:'Aves',st:'Preocupación menor',c:'lc',z:'Bosque nublado',hab:'Bosques tropicales',ali:'Semillas y frutos',cur:'En el Bosque Encantado vuela libre junto a los monos.',p:'3'},
 {id:'rana',em:'🐸',n:'Jambato y ranas andinas',s:'Atelopus sp.',g:'Anfibios',st:'En peligro crítico',c:'en',z:'Centro de anfibios',hab:'Arroyos andinos',ali:'Insectos',cur:'Amaru tiene un centro de conservación de anfibios.',p:'3'}
];
const POIS=[
 // tipo, etiqueta, x, y, color, texto
 ['parq','P',0.15,0.91,'#3b6ea5','Parqueadero'],
 ['info','i',0.30,0.865,'#3b6ea5','Entrada, boletería e información'],
 ['bano','WC',0.375,0.845,'#3b6ea5','Baños de la entrada'],
 ['rec','1',0.27,0.69,'#1E5B3A','Santuario del Oso Andino'],
 ['rec','2',0.19,0.53,'#1E5B3A','Aviario de Rapaces y Cóndor'],
 ['mir','👁',0.10,0.42,'#7A4E2D','Mirador de Cuenca'],
 ['rec','3',0.35,0.385,'#1E5B3A','Bosque Encantado: monos y guacamayos'],
 ['comida','🍴',0.53,0.30,'#E3A72F','Cafetería y bar del volcán'],
 ['descanso','🪑',0.46,0.335,'#E3A72F','Zona de descanso con mesas cubiertas'],
 ['bano','WC',0.60,0.34,'#3b6ea5','Baños de mitad de recorrido'],
 ['tienda','🛍',0.67,0.30,'#E3A72F','Tienda de recuerdos'],
 ['aux','+',0.45,0.27,'#C0392B','Primeros auxilios (propuesto)'],
 ['rec','4',0.77,0.33,'#1E5B3A','Selva: jaguar, oncilla, tapir y perezosos'],
 ['rec','5',0.85,0.49,'#1E5B3A','Pantano de cocodrilos'],
 ['rec','6',0.73,0.605,'#1E5B3A','Bosque seco: cactus y tortugas de Galápagos'],
 ['mir','👁',0.90,0.63,'#7A4E2D','Mirador del valle'],
 ['rec','7',0.64,0.745,'#1E5B3A','Felinos: león africano y puma'],
 ['bano','WC',0.52,0.84,'#3b6ea5','Baños de la salida'],
 ['salida','⇥',0.445,0.885,'#3b6ea5','Salida']
];
function mapSVG(sel){
  const W=1000,H=1800,X=x=>x*W,Y=y=>(0.05+(y-0.2)*1.15)*H;
  const trail=`M ${X(.30)} ${Y(.865)} C ${X(.30)} ${Y(.78)} ${X(.24)} ${Y(.74)} ${X(.27)} ${Y(.69)} S ${X(.15)} ${Y(.60)} ${X(.19)} ${Y(.53)} S ${X(.26)} ${Y(.42)} ${X(.35)} ${Y(.385)} S ${X(.47)} ${Y(.30)} ${X(.56)} ${Y(.30)} S ${X(.70)} ${Y(.30)} ${X(.77)} ${Y(.33)} S ${X(.88)} ${Y(.42)} ${X(.85)} ${Y(.49)} S ${X(.72)} ${Y(.55)} ${X(.73)} ${Y(.605)} S ${X(.70)} ${Y(.71)} ${X(.64)} ${Y(.745)} S ${X(.47)} ${Y(.80)} ${X(.445)} ${Y(.885)}`;
  const zones=[['Bosque andino',.22,.70,190,150,'#cfe2c2','l'],['Páramo',.17,.52,180,170,'#e6e0bf','l'],['Bosque nublado',.33,.385,170,130,'#c4dccd','t'],['Plaza central',.56,.30,170,105,'#f3e3b8',[.60,.235]],['Bosque húmedo',.79,.34,180,140,'#b9d8bf',[.82,.25]],['Humedal',.86,.49,130,110,'#bcd9e3','r'],['Bosque seco',.72,.615,170,120,'#eadcc0','b'],['Felinos',.63,.75,160,110,'#e8cfb8','b']];
  const lab=z=>{const cx=X(z[1]),cy=Y(z[2]);if(Array.isArray(z[6]))return [X(z[6][0]),Y(z[6][1]),'middle'];if(z[6]==='t')return [cx,cy-z[4]*1.15+40,'middle'];if(z[6]==='b')return [cx,cy+z[4]*1.15-18,'middle'];if(z[6]==='l')return [cx-z[3]+18,cy+z[4]*1.15-30,'start'];return [cx+z[3]-14,cy+z[4]*1.15-14,'end'];};
  const routeStops=sel&&sel.route?sel.route:null;
  return `<svg class="map" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mapa ilustrado del Bioparque Amaru">
  <defs><pattern id="tr" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="8" cy="10" r="5" fill="#cfdcc8"/><circle cx="28" cy="30" r="4" fill="#cfdcc8"/></pattern>
  <marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#fff"/></marker></defs>
  <rect width="${W}" height="${H}" fill="#e7eee0"/><rect width="${W}" height="${H}" fill="url(#tr)" opacity=".7"/>
  <path d="M0 ${Y(.95)} C ${X(.3)} ${Y(.93)} ${X(.7)} ${Y(.97)} ${W} ${Y(.94)} L ${W} ${H} L 0 ${H}z" fill="#d7dccf"/>
  <text x="${X(.5)}" y="${Y(.975)}" font-size="30" font-weight="700" fill="#6b7468" text-anchor="middle">Vía lastrada (600 m) · Autopista Cuenca–Azogues</text>
  ${zones.map(z=>`<ellipse cx="${X(z[1])}" cy="${Y(z[2])}" rx="${z[3]}" ry="${z[4]*1.15}" fill="${z[5]}" opacity=".95"/>`).join('')}
  <path d="${trail}" fill="none" stroke="#a37b52" stroke-width="30" stroke-linecap="round"/>
  <path d="${trail}" fill="none" stroke="${routeStops?'#E3A72F':'#c9a57c'}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${routeStops?'none':'2 26'}"/>
  <path d="${trail}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="1 60" marker-mid="url(#ar)"/>
  <rect x="${X(.05)}" y="${Y(.88)}" width="210" height="100" rx="16" fill="#cdd5dd"/>
  ${POIS.map((p,i)=>{const big=p[0]==='rec';const r=big?30:24;const dim=sel&&sel.filter&&!sel.filter.includes(p[0])?0.25:1;const hi=sel&&sel.poi===i;
   return `<g opacity="${dim}">${hi?`<circle cx="${X(p[2])}" cy="${Y(p[3])}" r="${r+16}" fill="${p[4]}" opacity=".25"/>`:''}<circle cx="${X(p[2])}" cy="${Y(p[3])}" r="${r}" fill="${p[4]}" stroke="#fff" stroke-width="5"/><text x="${X(p[2])}" y="${Y(p[3])+ (p[1].length>2?7:9)}" font-size="${p[1].length>1&&!/[^\x00-\x7F]/.test(p[1])?20:26}" font-weight="800" fill="#fff" text-anchor="middle">${p[1]}</text></g>`}).join('')}
  ${zones.map(z=>{const l=lab(z);return `<text x="${l[0]}" y="${l[1]}" font-size="30" font-weight="800" fill="#2f3b33" text-anchor="${l[2]}" paint-order="stroke" stroke="#f4f7f0" stroke-width="8">${z[0]}</text>`}).join('')}
  </svg>`;
}
const S={};
S.splash=()=>`<div class="splash"><div class="logo"><svg width="86" height="86" viewBox="0 0 100 100"><path d="M20 70 C 20 40, 50 40, 50 55 S 80 70, 80 40" fill="none" stroke="#1E5B3A" stroke-width="10" stroke-linecap="round"/><circle cx="80" cy="36" r="7" fill="#E3A72F"/></svg></div><div style="font-size:34px;font-weight:800">Amaru</div><div style="opacity:.9">Bioparque · Cuenca</div><div style="margin-top:30px;width:200px"><a class="btn ocre" href="#inicio">Empezar visita</a></div><div style="opacity:.75;font-size:13px">Español · English</div></div>`;
S.inicio=()=>`<div class="top"><p>¡Hola! Bienvenido a</p><h1>Bioparque Amaru</h1><div style="margin-top:10px"><span class="pill ok">● Abierto hoy · 9:00 a 18:00</span></div></div>
<div class="wrap"><div class="search">🔍 Buscar animales, zonas o servicios</div>
<div class="sec">Accesos rápidos</div>
<div class="grid6">
<a class="qa" href="#mapa"><span class="em">🗺️</span>Mapa</a><a class="qa" href="#animales"><span class="em">🐾</span>Animales</a><a class="qa" href="#info"><span class="em">🎟️</span>Horarios y precios</a>
<a class="qa" href="#agenda"><span class="em">📅</span>Actividades</a><a class="qa" href="#servicios"><span class="em">🚻</span>Servicios</a><a class="qa" href="#contacto"><span class="em">📞</span>Contacto</a></div>
<div class="sec">Hoy en Amaru <a href="#agenda">Ver agenda</a></div>
<div class="card"><div class="list">
<a class="item" href="#ficha"><span class="av">🐻</span><div><div class="t1">Charla del oso andino</div><div class="t2">11:00 · Santuario del Oso Andino</div></div><span class="chev">›</span></a>
<a class="item" href="#agenda"><span class="av">🦅</span><div><div class="t1">Alimentación del cóndor</div><div class="t2">12:00 · Aviario de Rapaces</div></div><span class="chev">›</span></a>
<a class="item" href="#agenda"><span class="av">🦁</span><div><div class="t1">Alimentación de leones</div><div class="t2">13:00 · Felinos</div></div><span class="chev">›</span></a></div></div>
<div class="sec">Recorrido sugerido</div>
<a class="card row" href="#ruta" style="text-decoration:none;color:inherit"><span class="av" style="background:var(--ocre2)">🥾</span><div><div class="t1">Ruta Principal</div><div class="t2">4 km · unas 4 horas · dificultad media</div></div><span class="chev">›</span></a>
<div class="card" style="margin-top:12px;background:var(--ocre2);border-color:#f1dca4"><div class="t1">Antes de subir</div><div class="t2" style="color:#5b4400;margin-top:4px">Lleva zapatos cómodos, agua y protector solar. El sendero es de tierra y piedra, con subidas.</div></div></div>`;
S.info=()=>`<div class="bar"><a class="back" href="#inicio">‹</a><h2>Horarios y precios</h2></div><div class="wrap">
<div class="card"><div class="row"><span class="av">🕘</span><div><div class="t1">Lunes a domingo</div><div class="t2">9:00 a 18:00</div></div><span class="pill ok" style="margin-left:auto">Abierto</span></div></div>
<div class="sec">Entradas</div>
<div class="card"><div class="list">
<div class="item"><div><div class="t1">Adultos</div><div class="t2">18 a 64 años</div></div><b style="margin-left:auto;font-size:18px">$10,00</b></div>
<div class="item"><div><div class="t1">Jóvenes</div><div class="t2">13 a 17 años</div></div><b style="margin-left:auto;font-size:18px">$7,00</b></div>
<div class="item"><div><div class="t1">Niños</div><div class="t2">2 a 12 años</div></div><b style="margin-left:auto;font-size:18px">$6,00</b></div>
<div class="item"><div><div class="t1">Tercera edad</div><div class="t2">Desde 65 años</div></div><b style="margin-left:auto;font-size:18px">$5,00</b></div></div>
<div class="note">Grupos y estudiantes: descuentos con reserva previa de una semana al 099 378 1679.</div></div>
<div class="sec">Recomendaciones</div>
<div class="card"><div class="list">
<div class="item"><span class="av">👟</span><div class="t2"><b style="color:var(--tinta)">Calzado cómodo:</b> sendero de tierra, piedra y madera, con subidas y bajadas.</div></div>
<div class="item"><span class="av">⏱️</span><div class="t2"><b style="color:var(--tinta)">Reserva unas 4 horas.</b> El recorrido es de un solo sentido.</div></div>
<div class="item"><span class="av">🌦️</span><div class="t2"><b style="color:var(--tinta)">Si llovió,</b> el sendero puede estar resbaloso.</div></div>
<div class="item"><span class="av">🚫</span><div class="t2"><b style="color:var(--tinta)">No alimentes a los animales</b> ni ingreses comida a las zonas de aves libres.</div></div></div></div>
<div style="margin-top:14px"><a class="btn sec2" href="#contacto">Cómo llegar</a></div></div>`;
S.animales=()=>`<div class="bar"><h2 style="padding-left:6px">Animales</h2><a class="back" href="#zonas" title="Explorar por zonas">⧉</a></div><div class="wrap">
<div class="search">🔍 Buscar por nombre</div>
<div class="chips" style="margin-top:12px"><span class="chip on">Todos</span><span class="chip">Mamíferos</span><span class="chip">Aves</span><span class="chip">Reptiles</span><span class="chip">Anfibios</span></div>
<div class="sec">${SPECIES.length} especies destacadas <a href="#zonas">Por zonas</a></div>
<div class="cards2">${SPECIES.slice(0,8).map(s=>`<a class="an" href="#ficha"><div class="ph">${s.em}</div><div class="bd"><div class="t1" style="font-size:14px">${s.n}</div><div style="margin-top:6px"><span class="pill ${s.c}">${s.st}</span></div></div></a>`).join('')}</div></div>`;
S.ficha=()=>{const s=SPECIES[0];return `<div class="hero"><a class="back bk" href="#animales">‹</a><span class="lang">ES | EN</span>${s.em}</div>
<div class="wrap"><div class="row" style="justify-content:space-between"><div><div style="font-size:24px;font-weight:800">${s.n}</div><div class="t2"><i>${s.s}</i></div></div><span class="pill ${s.c}">${s.st}</span></div>
<div class="audio" style="margin-top:14px"><span class="play">▶</span><div style="flex:1"><div class="t1" style="font-size:13.5px">Narración educativa · 0:45</div><div class="wave" style="margin-top:6px"></div></div><span class="t2">🔊 Sonido</span></div>
<div class="kv" style="margin-top:12px"><div class="card"><b>Hábitat</b>${s.hab}</div><div class="card"><b>Alimentación</b>${s.ali}</div><div class="card"><b>Grupo</b>Mamífero · Nativo</div><div class="card"><b>Zona en Amaru</b>${s.z} · parada 1</div></div>
<div class="card" style="margin-top:12px;background:var(--ocre2);border-color:#f1dca4"><div class="t1">¿Sabías que…?</div><div class="t2" style="color:#5b4400;margin-top:4px">${s.cur}</div></div>
<div class="sec">Conservación</div><div class="card row"><span class="av">🌱</span><div><div class="t1">Centro de Rescate y Tránsito</div><div class="t2">Especie asociada · rehabilitación de fauna</div></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px"><a class="btn" href="#punto">Ver en el mapa</a><a class="btn sec2" href="#ruta">En qué ruta está</a></div></div>`};
S.zonas=()=>`<div class="bar"><a class="back" href="#animales">‹</a><h2>Explorar por zonas</h2></div><div class="wrap">
<div class="t2">Elige una bioregión para ver sus recintos y especies.</div>
<div class="card" style="margin-top:12px"><div class="list">
${[['🌿','Bosque andino','Santuario del Oso Andino','1 recinto · 1 especie'],['🏔️','Páramo','Aviario de Rapaces y Cóndor','1 recinto · 3 especies'],['☁️','Bosque nublado','Bosque Encantado','2 recintos · 12 especies'],['🌴','Bosque húmedo tropical','Selva amazónica','4 recintos · 9 especies'],['💧','Humedal','Pantano de cocodrilos','1 recinto · 4 especies'],['🌵','Bosque seco','Cactus y tortugas de Galápagos','2 recintos · 5 especies'],['🦁','Felinos','León africano y puma','2 recintos · 2 especies']].map(z=>`<a class="item" href="#punto"><span class="av">${z[0]}</span><div><div class="t1">${z[1]}</div><div class="t2">${z[2]} · ${z[3]}</div></div><span class="chev">›</span></a>`).join('')}
</div></div><div class="note">El número de recintos y especies se cargará desde la API (bioregions y enclosures).</div></div>`;
S.agenda=()=>`<div class="bar"><h2 style="padding-left:6px">Agenda</h2></div><div class="wrap">
<div class="seg"><span class="on">Hoy</span><span>Eventos</span></div>
<div class="sec">Actividades del día</div>
<div class="card"><div class="list">
<div class="item"><div class="date">11:00<small>charla</small></div><div><div class="t1">Charla del oso andino</div><div class="t2">Santuario del Oso Andino · parada 1</div></div></div>
<div class="item"><div class="date">12:00<small>comida</small></div><div><div class="t1">Alimentación del cóndor</div><div class="t2">Aviario de Rapaces · parada 2</div></div></div>
<div class="item"><div class="date">13:00<small>comida</small></div><div><div class="t1">Alimentación de leones</div><div class="t2">Felinos · parada 7</div></div></div></div>
<div class="note">Fines de semana y feriados. Confirma en la boletería.</div></div>
<div class="sec">Recorridos sugeridos</div>
<a class="card row" href="#ruta" style="text-decoration:none;color:inherit"><span class="av" style="background:var(--ocre2)">🥾</span><div><div class="t1">Ruta Principal</div><div class="t2">240 min · dificultad media · 7 paradas</div></div><span class="chev">›</span></a>
<a class="card row" href="#ruta" style="text-decoration:none;color:inherit;margin-top:10px"><span class="av" style="background:var(--ocre2)">🦅</span><div><div class="t1">Sendero de Aves y Rapaces</div><div class="t2">90 min · dificultad baja</div></div><span class="chev">›</span></a>
<div class="sec">Próximos eventos</div>
<div class="card"><div class="list">
<div class="item"><div class="date">🌕<small>luna llena</small></div><div><div class="t1">Safari nocturno</div><div class="t2">Recorrido guiado con linternas · unas 4 horas · cupos limitados</div></div></div>
<div class="item"><div class="date">29<small>JUN</small></div><div><div class="t1">Colonias vacacionales 2026</div><div class="t2">29 de junio al 21 de agosto · niños de 5 a 12 años</div></div></div>
<div class="item"><div class="date">💻<small>virtual</small></div><div><div class="t1">Conéctate con Amaru</div><div class="t2">Programa educativo virtual · público general</div></div></div></div></div></div>`;
S.ruta=()=>`<div class="bar"><a class="back" href="#agenda">‹</a><h2>Ruta Principal</h2></div><div class="wrap">
<div class="row" style="gap:8px;flex-wrap:wrap"><span class="pill">⏱ 240 min</span><span class="pill">📏 4 km</span><span class="pill">⛰ Media</span><span class="pill">↻ Un solo sentido</span></div>
<div class="card" style="margin-top:14px"><div class="tl">
${[['Entrada y boletería','Baños e información',''],['Santuario del Oso Andino','Charla 11:00','20 min'],['Aviario de Rapaces y Cóndor','Alimentación 12:00','20 min'],['Bosque Encantado','Monos y guacamayos libres','25 min'],['Plaza central','Cafetería, baños, tienda y descanso','30 min'],['Selva amazónica','Jaguar, oncilla, tapir, perezosos','30 min'],['Pantano de cocodrilos','Humedal','15 min'],['Bosque seco','Cactus y tortugas de Galápagos','20 min'],['Felinos','León africano y puma · 13:00','15 min'],['Salida','Baños','']].map((t,i)=>`<div class="st" data-n="${['E','1','2','3','☕','4','5','6','7','S'][i]}"><div class="row" style="justify-content:space-between"><div class="t1" style="font-size:14.5px">${t[0]}</div><span class="t2">${t[2]}</span></div><div class="t2">${t[1]}</div></div>`).join('')}
</div></div><div style="margin-top:14px"><a class="btn" href="#mapa-ruta">Ver ruta en el mapa</a></div></div>`;
S.mapa=(opt={})=>`<div class="mapwrap">${mapSVG(opt)}
<div class="mtools"><div class="search" style="box-shadow:0 2px 8px rgba(0,0,0,.08)">🔍 Buscar en el mapa</div>
<div class="chips"><span class="chip ${!opt.filter&&!opt.route?'on':''}">Todo</span><span class="chip ${opt.filter&&opt.filter.includes('rec')&&opt.filter.length===1?'on':''}">🐾 Animales</span><span class="chip ${opt.filter&&opt.filter.includes('bano')?'on':''}">🚻 Baños</span><span class="chip">🍴 Comida</span><span class="chip">➕ Auxilios</span><span class="chip ${opt.route?'on':''}">🥾 Ruta</span></div></div>
<div class="mzoom"><span>+</span><span>−</span><span>◎</span></div>
${opt.sheet||`<a class="chip" href="#mapa-leyenda" style="position:absolute;left:12px;bottom:12px;text-decoration:none;box-shadow:0 2px 8px rgba(0,0,0,.12)">ⓘ Leyenda</a>`}</div>`;
const LEG=`<div class="legend"><span><i style="background:#1E5B3A;color:#fff">1</i>Recintos</span><span><i style="background:#3b6ea5;color:#fff">i</i>Información</span><span><i style="background:#E3A72F;color:#fff">🍴</i>Comida y descanso</span><span><i style="background:#C0392B;color:#fff">+</i>Primeros auxilios</span><span><i style="background:#7A4E2D;color:#fff">👁</i>Miradores</span><span><i style="background:#c9a57c"></i>Sendero</span></div>`;
S['mapa-leyenda']=()=>S.mapa({sheet:`<div class="sheet"><div class="grab"></div><div class="row" style="justify-content:space-between"><div class="t1">Leyenda del mapa</div><a class="back" style="background:var(--hoja);color:var(--verde)" href="#mapa">×</a></div>${LEG.replace('class="legend"','class="legend" style="position:static;border:0;padding:8px 0 0;font-size:13.5px"')}<div class="note">Los números 1 a 7 siguen el orden del recorrido. Las flechas blancas marcan el sentido único del sendero.</div></div>`});
S['mapa-ruta']=()=>S.mapa({route:true,sheet:`<div class="sheet"><div class="grab"></div><div class="row"><span class="av" style="background:var(--ocre2)">🥾</span><div><div class="t1">Ruta Principal · 7 paradas</div><div class="t2">Sigue la línea amarilla en el sentido de las flechas</div></div></div><div class="row" style="margin-top:10px;gap:8px"><a class="btn" href="#ruta">Ver paradas</a><a class="btn sec2" href="#mapa">Salir de la ruta</a></div></div>`});
S['mapa-banos']=()=>S.mapa({filter:['bano','info','salida'],sheet:`<div class="sheet"><div class="grab"></div><div class="t1">3 baños en el recorrido</div><div class="t2">Entrada · mitad del recorrido (plaza central) · salida</div></div>`});
S.punto=()=>S.mapa({poi:3,sheet:`<div class="sheet"><div class="grab"></div><div class="row"><span class="av">🐻</span><div><div class="t1">Santuario del Oso Andino</div><div class="t2">Bosque andino · parada 1 de la Ruta Principal</div></div></div>
<div class="row" style="gap:8px;margin-top:10px;flex-wrap:wrap"><span class="pill vu">Vulnerable</span><span class="pill">Charla 11:00</span><span class="pill">≈ 15 min desde la entrada</span></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px"><a class="btn" href="#ficha">Ver ficha</a><a class="btn sec2" href="#ruta">Ver en la ruta</a></div></div>`});
S['mapa-completo']=()=>`<div style="background:#e7eee0;height:100%">${mapSVG({})}</div>`;
S.servicios=()=>`<div class="bar"><a class="back" href="#mas">‹</a><h2>Servicios</h2></div><div class="wrap">
<div class="svc">${[['🚻','Baños',1],['🍴','Comida'],['🪑','Descanso'],['➕','Auxilios'],['🅿️','Parqueo'],['ℹ️','Información'],['🛍️','Tienda'],['👁️','Miradores']].map(c=>`<a class="${c[2]?'on':''}" href="#mapa-banos"><span class="em2">${c[0]}</span>${c[1]}</a>`).join('')}</div>
<div class="sec">Baños</div>
<div class="card"><div class="list">
<a class="item" href="#mapa-banos"><span class="av">🚻</span><div><div class="t1">Baños de la entrada</div><div class="t2">Junto a la boletería</div></div><span class="pill ok" style="margin-left:auto">Ver mapa</span></a>
<a class="item" href="#mapa-banos"><span class="av">🚻</span><div><div class="t1">Baños de la plaza central</div><div class="t2">Mitad del recorrido</div></div><span class="pill ok" style="margin-left:auto">Ver mapa</span></a>
<a class="item" href="#mapa-banos"><span class="av">🚻</span><div><div class="t1">Baños de la salida</div><div class="t2">Final del recorrido</div></div><span class="pill ok" style="margin-left:auto">Ver mapa</span></a></div></div>
<div class="sec">Primeros auxilios</div>
<div class="card row"><span class="av" style="background:#fde3df">➕</span><div><div class="t1">Pide ayuda al personal</div><div class="t2">Ubicación aún no publicada. Llama al 096 995 6055.</div></div></div>
<div class="note">Si un servicio no tiene ubicación publicada, la app lo indica en lugar de mostrar un marcador inventado.</div></div>`;
S.contacto=()=>`<div class="bar"><a class="back" href="#mas">‹</a><h2>Contacto</h2></div><div class="wrap">
<div class="card" style="padding:0;overflow:hidden"><div style="height:130px;background:#e7eee0;position:relative"><svg viewBox="0 0 390 130" width="100%" height="130"><path d="M0 95 C 120 80 250 110 390 70" stroke="#c7cfc0" stroke-width="18" fill="none"/><text x="250" y="122" font-size="11" font-weight="700" fill="#6b7468">Autopista Cuenca–Azogues</text><path d="M200 88 C 205 60 215 50 230 35" stroke="#d8c6a8" stroke-width="7" fill="none"/><circle cx="232" cy="32" r="13" fill="#1E5B3A" stroke="#fff" stroke-width="3"/><text x="232" y="37" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">A</text><text x="120" y="70" font-size="11" font-weight="700" fill="#6b7468">Hospital del Río</text></svg></div>
<div style="padding:14px"><div class="t1">Autopista Cuenca–Azogues km 10,5</div><div class="t2">Entrada frente al Hospital del Río · sube 600 m por la vía lastrada hasta el parqueadero</div></div></div>
<div class="card" style="margin-top:12px"><div class="list">
<div class="item"><span class="av">📞</span><div><div class="t1">096 995 6055</div><div class="t2">También 099 568 1677 · 099 378 1679</div></div><span class="pill ok" style="margin-left:auto">Llamar</span></div>
<div class="item"><span class="av">✉️</span><div><div class="t1">marketing@zoobioparqueamaru.com</div><div class="t2">Correo</div></div></div>
<div class="item"><span class="av">🌐</span><div><div class="t1">zoobioparqueamaru.com</div><div class="t2">Sitio web</div></div></div></div></div>
<div class="sec">Redes sociales</div>
<div class="grid6"><span class="qa"><span class="em">📷</span>@bioparqueamaru</span><span class="qa"><span class="em">👍</span>zoologicocuenca</span><span class="qa"><span class="em">🎵</span>@amarubioparque</span></div>
<div style="margin-top:14px"><a class="btn" href="#info">Ver horarios y precios</a></div></div>`;
S.mas=()=>`<div class="bar"><h2 style="padding-left:6px">Más</h2></div><div class="wrap"><div class="card"><div class="list">
${[['🚻','Servicios','Baños, comida, descanso y auxilios','#servicios'],['📞','Contacto y cómo llegar','Teléfonos, correo y redes','#contacto'],['🎟️','Horarios y precios','Entradas y recomendaciones','#info'],['🌱','Conservación','Proyectos y cómo apoyar','#agenda'],['⚙️','Idioma y accesibilidad','Español, inglés y texto grande','#ajustes']].map(i=>`<a class="item" href="${i[3]}"><span class="av">${i[0]}</span><div><div class="t1">${i[1]}</div><div class="t2">${i[2]}</div></div><span class="chev">›</span></a>`).join('')}
</div></div></div>`;
S.ajustes=()=>`<div class="bar"><a class="back" href="#mas">‹</a><h2>Idioma y accesibilidad</h2></div><div class="wrap">
<div class="sec">Idioma</div><div class="seg"><span class="on">Español</span><span>English</span></div>
<div class="note">Si un texto no está traducido, se muestra en español con un aviso.</div>
<div class="sec">Accesibilidad</div><div class="card"><div class="list">
<div class="item"><div><div class="t1">Texto grande</div><div class="t2">Aumenta el tamaño de letra</div></div><span class="toggle" style="margin-left:auto"></span></div>
<div class="item"><div><div class="t1">Narración automática</div><div class="t2">Reproduce el audio al abrir una ficha</div></div><span class="toggle off" style="margin-left:auto"></span></div>
<div class="item"><div><div class="t1">Alto contraste en el mapa</div><div class="t2">Marcadores con borde más grueso</div></div><span class="toggle off" style="margin-left:auto"></span></div></div></div></div>`;
S.vacio=()=>`<div class="bar"><a class="back" href="#animales">‹</a><h2>Animales</h2></div><div class="wrap" style="text-align:center;padding-top:80px"><div style="font-size:60px">📡</div><div class="t1" style="margin-top:10px;font-size:18px">No pudimos cargar los animales</div><div class="t2" style="margin:8px 20px 20px">Revisa tu conexión a internet e inténtalo otra vez.</div><a class="btn" href="#animales">Reintentar</a></div>`;
function render(){
  const r=(location.hash||'#splash').slice(1);
  const f=S[r]||S.inicio;
  $('#screen').innerHTML=f();
  $('#screen').scrollTop=0;
  const dark=!['splash'].includes(r)&&!r.startsWith('mapa')&&r!=='punto'&&r!=='ficha';
  $('#status').className='status'+(dark?' dark':'');
  if(r==='splash'){$('#tabbar').style.display='none';$('#status').className='status dark';return}
  $('#tabbar').style.display='grid';
  const t=TAB_OF[r.split('-')[0]]||'inicio';
  $('#tabbar').innerHTML=TABS.map(x=>`<a href="#${x[0]}" class="${x[0]===t?'on':''}"><span class="ic">${IC[x[2]]}</span>${x[1]}</a>`).join('');
}
window.addEventListener('hashchange',render);
if(new URLSearchParams(location.search).has('cap'))document.body.classList.add('cap');
if(new URLSearchParams(location.search).has('wf'))document.body.classList.add('wf');
render();
}
