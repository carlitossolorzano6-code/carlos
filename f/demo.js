{
const DOD=['Código revisado y aprobado por otro Developer','Pruebas unitarias escritas y aprobadas','Pruebas funcionales sin errores en el servidor de pruebas','Criterios de aceptación verificados','Pantallas adaptadas al celular con colores y logo del complejo','Desplegado en el entorno de pruebas y documentación actualizada'];
const stories=[
 {id:'HU02',pts:3,t:'Como jugador, quiero consultar qué canchas y horarios están libres, para elegir un turno sin tener que escribir a nadie.',
  ac:['Se muestran las tres canchas con franjas de una hora para la fecha elegida, hasta 14 días después.','Las franjas reservadas aparecen como ocupadas y no se pueden seleccionar.','La consulta funciona sin iniciar sesión y cada franja libre muestra su precio.'],
  tasks:['T2.1 Modelo de datos de canchas y franjas','T2.2 Servicio de franjas libres por cancha y fecha','T2.3 Vista de disponibilidad adaptable al celular','T2.4 Conectar vista y servicio, filtro por fecha','T2.5 Pruebas unitarias y funcionales']},
 {id:'HU01',pts:3,t:'Como jugador, quiero crear mi cuenta con mi correo o mi teléfono, para reservar canchas a mi nombre.',
  ac:['Registro con correo electrónico o con celular de 10 dígitos.','Se rechaza un correo o teléfono ya registrado y se informa el motivo.','La cuenta se activa con el código de verificación enviado.'],
  tasks:['T1.1 Formulario de registro','T1.2 Servicio de cuentas y validación de duplicados','T1.3 Envío del código de verificación','T1.4 Pruebas unitarias y funcionales']},
 {id:'HU03',pts:5,t:'Como jugador, quiero reservar una cancha desde mi celular, para asegurar mi turno a cualquier hora del día.',
  ac:['Dado un jugador con sesión y una franja libre, cuando confirma, entonces la franja queda a su nombre y ocupada para los demás.','Dado que dos jugadores confirman la misma franja casi a la vez, cuando el sistema procesa ambas, entonces solo se registra la primera y el segundo recibe un aviso.','Dado un jugador sin sesión, cuando intenta reservar, entonces se le pide iniciar sesión o crear una cuenta.','Dado que la reserva se registró, cuando abre «Mis reservas», entonces ve cancha, fecha, hora y precio.'],
  tasks:['T3.1 Modelo de reserva con restricción única','T3.2 Servicio de reservas con control de choques','T3.3 Formulario de reserva','T3.4 Confirmación y «Mis reservas»','T3.5 Pruebas unitarias, de concurrencia y funcionales']}
];
const days=[
 {n:0,label:'Planning',rest:11,s:{HU02:['P','PPPPP','000000'],HU01:['P','PPPP','000000'],HU03:['P','PPPPP','000000']},
  note:'<h3>Sprint Planning</h3><p><b>Por qué:</b> eliminar las reservas duplicadas permitiendo reservar en línea.</p><p><b>Qué:</b> HU02, HU01 y HU03, 11 puntos frente a una capacidad de 12.</p><p><b>Cómo:</b> tareas de un día o menos; las pruebas cierran cada historia.</p>'},
 {n:1,label:'Día 1',rest:11,s:{HU02:['C','HHHHP','000010'],HU01:['C','CPPP','000000'],HU03:['P','PPPPP','000000']},
  note:'<h3>Daily Scrum · Día 1</h3><p><b>Avance:</b> HU02 con T2.1 a T2.4 terminadas; se inició HU01 (T1.1).</p><p><b>Sigue:</b> pruebas de HU02 (T2.5) y servicio de cuentas.</p><p><b>Impedimentos:</b> ninguno.</p>'},
 {n:2,label:'Día 2',rest:11,s:{HU02:['C','HHHHB','100010'],HU01:['C','HHCP','000000'],HU03:['P','PPPPP','000000']},block:{HU02:'Bloqueada: servidor de pruebas caído'},
  note:'<h3>Daily Scrum · Día 2</h3><p><b>Avance:</b> T1.1 y T1.2 terminadas, T1.3 en curso; revisión de código de HU02 hecha.</p><p><b>Sigue:</b> probar HU02 apenas vuelva el servidor.</p><p><b>Impedimentos:</b> servidor de pruebas fuera de servicio todo el día; lo gestiona el Scrum Master.</p>'},
 {n:3,label:'Día 3',rest:8,s:{HU02:['H','HHHHH','111111'],HU01:['C','HHHC','100010'],HU03:['P','PPPPP','000000']},
  note:'<h3>Daily Scrum · Día 3</h3><p><b>Avance:</b> servidor restablecido; HU02 cumple la Definition of Done. T1.3 terminada, T1.4 en curso.</p><p><b>Sigue:</b> cerrar HU01.</p><p><b>Impedimentos:</b> ninguno. El pedido del dueño (pago con tarjeta) se trata con el Product Owner fuera del Daily Scrum.</p>',
  pb:'Product Backlog: el Product Owner agregó HU11 «Pago con tarjeta» para un próximo Sprint; el Sprint Backlog y el Sprint Goal no cambian.'},
 {n:4,label:'Día 4',rest:5,s:{HU02:['H','HHHHH','111111'],HU01:['H','HHHH','111111'],HU03:['C','HCPPP','000000']},
  note:'<h3>Daily Scrum · Día 4</h3><p><b>Avance:</b> HU01 cumple la Definition of Done; HU03 iniciada (T3.1 terminada, T3.2 en curso).</p><p><b>Sigue:</b> servicio de reservas, formulario y pruebas de concurrencia.</p><p><b>Impedimentos:</b> riesgo de tiempo para la historia más grande.</p>'},
 {n:5,label:'Día 5',rest:5,s:{HU02:['H','HHHHH','111111'],HU01:['H','HHHH','111111'],HU03:['C','HHHHH','011111']},block:{HU03:'Falta revisión de código por pares (Definition of Done)'},
  note:'<h3>Daily Scrum · Día 5</h3><p><b>Avance:</b> todas las tareas de HU03 hechas.</p><p><b>Sigue:</b> HU03 vuelve al Product Backlog; no forma parte del Increment.</p><p><b>Impedimentos:</b> no hubo tiempo para la revisión por pares.</p>'}
];
const backlog=[
 ['HU02','Consultar disponibilidad','E1','Must',3],['HU01','Crear cuenta','E1','Must',3],['HU03','Reservar desde el celular','E1','Must',5],
 ['HU07','Registrar reservas presenciales','E2','Must',3],['HU06','Ver reservas del día','E2','Must',2],['HU08','Marcar asistencia y pago','E2','Should',2],
 ['HU04','Cancelar reserva','E1','Should',3],['HU10','Precios por horario','E2','Should',3],['HU09','Reporte mensual de ingresos','E2','Could',8],['HU05','Recordatorio antes del partido','E1','Could',5]];
const backlogFinal=[['HU03','Reservar desde el celular (vuelve del Sprint 1)','E1','Must',5],['HU07','Registrar reservas presenciales','E2','Must',3],['HU06','Ver reservas del día','E2','Must',2],['HU11','Pago con tarjeta (nueva, pedido del día 3)','E1','Should','Por estimar'],
 ['HU08','Marcar asistencia y pago','E2','Should',2],['HU04','Cancelar reserva','E1','Should',3],['HU10','Precios por horario','E2','Should',3],['HU09','Reporte mensual de ingresos','E2','Could',8],['HU05','Recordatorio antes del partido','E1','Could',5]];
const cols=[['P','Por hacer'],['C','En curso'],['H','Hecho']];
const lbl={C:'en curso',B:'bloqueada'};
const main=document.getElementById('main'),dlg=document.getElementById('dlg'),dlgBody=document.getElementById('dlgBody');
const S=id=>stories.find(s=>s.id===id);
function card(st,d){
  const [c,ts]=d.s[st.id];const tag=d.block&&d.block[st.id];const done=[...ts].filter(x=>x==='H').length;
  return `<button type="button" class="card" data-id="${st.id}" data-d="${d.n}"><div class="top"><span class="id">${st.id}</span><span class="pts">${st.pts} pts</span></div>
  <p class="title">${st.t}</p>${tag?`<span class="tag">${tag}</span>`:''}
  <div class="prog" aria-hidden="true"><i style="width:${done/ts.length*100}%"></i></div>
  <ul class="tasks">${st.tasks.map((t,i)=>{const s=ts[i];return `<li class="${s}"><span class="box"></span><span>${t}</span>${lbl[s]?`<em>${lbl[s]}</em>`:''}</li>`}).join('')}</ul></button>`;
}
function tablero(n){
  const d=days.find(x=>x.n===n)||days[0];
  main.innerHTML=`<h2 class="view">Tablero del Sprint</h2><p class="lead">Estado al cierre de cada jornada. Las tarjetas pasan a Hecho solo cuando cumplen la Definition of Done; toque una tarjeta para ver sus criterios de aceptación y su Definition of Done.</p>
  <div class="days">${days.map(x=>`<button type="button" data-n="${x.n}" aria-pressed="${x.n===d.n}">${x.label}</button>`).join('')}</div>
  <div class="status"><div class="big">${d.rest} puntos pendientes</div><span>${11-d.rest} de 11 puntos terminados según la Definition of Done · ${d.label}</span></div>
  <div class="board">${cols.map(([k,name])=>{const list=stories.filter(s=>d.s[s.id][0]===k);
    return `<section class="col"><h3>${name}<small>${list.reduce((a,s)=>a+s.pts,0)} pts</small></h3>${list.map(s=>card(s,d)).join('')||'<p class="empty">Sin tarjetas</p>'}</section>`}).join('')}</div>
  <section class="daily">${d.note}</section><p class="pbnote">${d.pb||''}</p>`;
}
function pill(m){return `<span class="pill ${m.toLowerCase()}">${m}</span>`}
function backlogView(fin){
  const rows=fin?backlogFinal:backlog;const tot=rows.reduce((a,r)=>a+(typeof r[4]==='number'?r[4]:0),0);
  main.innerHTML=`<h2 class="view">Product Backlog ${fin?'después de la Sprint Review':'al iniciar el Sprint'}</h2>
  <p class="lead"><b>Product Goal:</b> que los jugadores de La Cantera reserven y gestionen sus turnos en línea sin reservas duplicadas, y que el complejo controle la ocupación y los ingresos de sus tres canchas.</p>
  <div class="days"><button type="button" data-b="inicio" aria-pressed="${!fin}">Al iniciar el Sprint</button><button type="button" data-b="cierre" aria-pressed="${fin}">Después de la Sprint Review</button></div>
  <table><thead><tr><th>N.º</th><th>ID</th><th>Historia</th><th>Épica</th><th>MoSCoW</th><th class="n">Puntos</th></tr></thead><tbody>
  ${rows.map((r,i)=>`<tr class="${!fin&&i<3?'sprint':''} ${r[0]==='HU11'?'new':''}"><td>${i+1}</td><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${pill(r[3])}</td><td class="n">${r[4]}</td></tr>`).join('')}
  <tr><td></td><td></td><td><b>Total estimado</b></td><td></td><td></td><td class="n"><b>${tot}</b></td></tr></tbody></table>
  <p class="pbnote">${fin?'HU02 y HU01 salieron del Product Backlog al formar parte del Increment. HU03 regresa sin crédito parcial y HU11 se agregó a pedido del Product Owner.':'Franja amarilla: historias seleccionadas para el Sprint 1. E1 = Reserva en línea del jugador; E2 = Gestión y control del complejo. Historia de referencia: HU02 (3 puntos).'}</p>`;
}
function burndown(){
  main.innerHTML=`<h2 class="view">Burndown: quedaron 5 de 11 puntos sin terminar</h2><p class="lead">Puntos pendientes al cierre de cada día. La línea real se mantiene plana mientras el servidor de pruebas está caído y cierra por encima de la ideal porque HU03 no cumple la Definition of Done.</p>
  <div class="fig"><svg id="bd" role="img" aria-label="Burndown del Sprint"></svg></div>
  <div class="grid2"><div class="panel"><h3>Puntos pendientes por día</h3><table><thead><tr><th>Día</th><th class="n">Ideal</th><th class="n">Real</th></tr></thead><tbody>${days.map(d=>`<tr><td>${d.label}</td><td class="n">${(11-11*d.n/5).toFixed(1).replace('.',',')}</td><td class="n">${d.rest}</td></tr>`).join('')}</tbody></table></div>
  <div class="panel"><h3>Lectura</h3><ul><li>Días 1 y 2: sin historias terminadas; HU02 espera sus pruebas.</li><li>Día 3: HU02 cumple la Definition of Done (−3).</li><li>Día 4: HU01 cumple la Definition of Done (−3).</li><li>Día 5: HU03 sin revisión por pares; sus 5 puntos quedan pendientes.</li><li>Velocidad real: 6 puntos.</li></ul></div></div>`;
  const s=document.getElementById('bd');
  const draw=()=>{const W=s.clientWidth,H=s.clientHeight,L=56,R=40,T=24,B=44;const x=n=>L+n/5*(W-L-R),y=v=>T+(1-v/12)*(H-T-B);
    const real=days.map(d=>[x(d.n),y(d.rest)]),ideal=days.map(d=>[x(d.n),y(11-11*d.n/5)]);
    s.innerHTML=`<rect x="${x(1)}" y="${T}" width="${x(2)-x(1)}" height="${H-T-B}" fill="var(--col)"/><text x="${(x(1)+x(2))/2}" y="${H-B-10}" text-anchor="middle" font-size="13" fill="var(--muted)">Servidor caído</text>
    ${[0,3,6,9,12].map(v=>`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${L-10}" y="${y(v)+4}" text-anchor="end" font-size="13" fill="var(--muted)">${v}</text>`).join('')}
    ${days.map(d=>`<text x="${x(d.n)}" y="${H-16}" text-anchor="middle" font-size="13" fill="var(--muted)">${d.n?'Día '+d.n:'Inicio'}</text>`).join('')}
    <polyline points="${ideal.map(p=>p.join(',')).join(' ')}" fill="none" stroke="var(--ideal)" stroke-width="2" stroke-dasharray="7 5"/>
    <polyline points="${real.map(p=>p.join(',')).join(' ')}" fill="none" stroke="var(--pitch)" stroke-width="3.5"/>
    ${real.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="5.5" fill="var(--pitch)"/><text x="${p[0]}" y="${p[1]-12}" text-anchor="middle" font-size="14" font-weight="600" fill="var(--ink)">${days[i].rest}</text>`).join('')}
    <g font-size="13"><line x1="${W-R-190}" x2="${W-R-165}" y1="${T+8}" y2="${T+8}" stroke="var(--ideal)" stroke-width="2" stroke-dasharray="7 5"/><text x="${W-R-159}" y="${T+12}" fill="var(--muted)">Ideal</text><line x1="${W-R-100}" x2="${W-R-75}" y1="${T+8}" y2="${T+8}" stroke="var(--pitch)" stroke-width="3.5"/><text x="${W-R-69}" y="${T+12}" fill="var(--ink)">Real</text></g>`};
  const ro=new ResizeObserver(draw);ro.observe(s);
}
function cierre(){
  main.innerHTML=`<h2 class="view">Sprint Review y Sprint Retrospective</h2><p class="lead">El Increment permite crear una cuenta y consultar horarios libres, pero todavía no reservar: el Sprint Goal no se alcanzó.</p>
  <div class="kpis"><div class="kpi"><b>11</b><span>puntos comprometidos</span></div><div class="kpi"><b>6</b><span>velocidad real</span></div><div class="kpi"><b>2 de 3</b><span>historias en el Increment</span></div><div class="kpi"><b>No</b><span>Sprint Goal alcanzado</span></div></div>
  <table><thead><tr><th>Historia</th><th class="n">Puntos</th><th>Estado al cierre</th><th>¿Increment?</th></tr></thead><tbody>
  <tr><td><b>HU02</b> Consultar disponibilidad</td><td class="n">3</td><td>Cumple la Definition of Done</td><td>Sí</td></tr>
  <tr><td><b>HU01</b> Crear cuenta</td><td class="n">3</td><td>Cumple la Definition of Done</td><td>Sí</td></tr>
  <tr><td><b>HU03</b> Reservar desde el celular</td><td class="n">5</td><td>Tareas hechas; falta revisión por pares</td><td>No, vuelve al Product Backlog</td></tr></tbody></table>
  <h2 class="view" style="margin-top:22px">Retrospective: Empezar, Dejar de, Continuar</h2><p class="lead">Dos acciones acordadas: entorno de pruebas en contenedores locales y revisión de código el mismo día con un máximo de dos historias en curso.</p>
  <div class="retro"><div class="panel"><h3>Empezar</h3><ul><li>Entorno de pruebas local en contenedores, sin depender de un único servidor.</li><li>Revisar el código de cada tarea el mismo día en que se termina.</li></ul></div>
  <div class="panel stop"><h3>Dejar de</h3><ul><li>Dejar pruebas y revisión para el final de cada historia.</li><li>Abrir una historia nueva antes de cerrar la anterior.</li></ul></div>
  <div class="panel keep"><h3>Continuar</h3><ul><li>Usar el Daily Scrum para reorganizar el trabajo ante impedimentos.</li><li>Proteger el Sprint Goal frente a pedidos nuevos durante el Sprint.</li></ul></div></div>`;
}
function detail(id,n){
  const st=S(id),d=days.find(x=>x.n===n)||days[5];if(!st)return;const [c,ts,dod]=d.s[id];
  const colName=cols.find(x=>x[0]===c)[1];
  dlgBody.innerHTML=`<button type="button" class="close" id="cls">Cerrar</button><h3 tabindex="-1" autofocus>${st.id} · ${st.pts} puntos</h3><p>${st.t}</p><p><b>Columna:</b> ${colName} · <b>${d.label}</b></p>
  ${d.block&&d.block[id]?`<span class="tag">${d.block[id]}</span>`:''}
  <h4>Criterios de aceptación</h4><ol>${st.ac.map(a=>`<li>${a}</li>`).join('')}</ol>
  <h4>Tareas</h4><ul class="tasks">${st.tasks.map((t,i)=>`<li class="${ts[i]}"><span class="box"></span><span>${t}</span>${lbl[ts[i]]?`<em>${lbl[ts[i]]}</em>`:''}</li>`).join('')}</ul>
  <h4>Definition of Done</h4><ul class="dod">${DOD.map((x,i)=>{const ok=dod[i]==='1';const miss=!ok&&[...ts].every(t=>t==='H');return `<li class="${ok?'H':miss?'N':''}"><span class="box"></span><span>${x}</span>${miss?'<em>pendiente</em>':''}</li>`}).join('')}</ul>`;
  try{dlg.showModal()}catch(_){dlg.setAttribute('open','')}
  document.getElementById('cls').addEventListener('click',()=>dlg.close());
}
function route(){
  const h=location.hash.slice(1);let v='tablero',m;
  if((m=/^dia-(\d)$/.exec(h)))tablero(+m[1]);
  else if(h==='backlog-inicio'||h==='backlog-cierre'){v='backlog';backlogView(h==='backlog-cierre')}
  else if(h==='burndown'){v='burndown';burndown()}
  else if(h==='cierre'){v='cierre';cierre()}
  else if((m=/^detalle-(hu\d\d)-(\d)$/.exec(h))){tablero(+m[2]);detail(m[1].toUpperCase(),+m[2])}
  else tablero(5);
  for(const a of document.querySelectorAll('.tabs a'))a.toggleAttribute('aria-current',a.dataset.v===v),a.dataset.v===v&&a.setAttribute('aria-current','page');
}
main.addEventListener('click',e=>{
  const b=e.target.closest('[data-n]');if(b){location.hash='dia-'+b.dataset.n;return}
  const k=e.target.closest('[data-b]');if(k){location.hash='backlog-'+k.dataset.b;return}
  const c=e.target.closest('.card');if(c)detail(c.dataset.id,+c.dataset.d);
});
window.addEventListener('hashchange',route);
route();
}
