// 1) Estado "Abierto ahora" según la hora de Madrid, y día actual resaltado
(function(){
  var f = new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false});
  var p = {}; f.formatToParts(new Date()).forEach(function(x){p[x.type]=x.value});
  var dias = {Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
  var d = dias[p.weekday], m = (+p.hour % 24)*60 + (+p.minute);
  
  // Horario: L-J 9-22 (540-1320), V 9-14 (540-840) y 15-22 (900-1320), S-D 9-22 (540-1320)
  var abierto = false;
  var proximaApertura = "09:00";

  if (d === 5) { // Viernes
    if ((m >= 540 && m < 840) || (m >= 900 && m < 1320)) {
      abierto = true;
    } else if (m >= 840 && m < 900) {
      proximaApertura = "15:00"; // Viernes por la tarde
    }
  } else { // Resto de días
    if (m >= 540 && m < 1320) {
      abierto = true;
    }
  }
  
  var s = document.getElementById('status'), t = document.getElementById('status-text');
  if(s && t) {
    s.className = 'pill ' + (abierto ? 'open' : 'closed');
    t.textContent = abierto ? 'Abierto ahora' : 'Cerrado ahora · abrimos a las ' + proximaApertura;
  }
  
  var row = document.querySelector('#hours tr[data-d="'+d+'"]');
  if(row) row.className = 'today';
})();

// 2) Menú móvil
(function(){
  var header = document.getElementById('top');
  var btn = document.getElementById('menu-btn');
  var menu = document.getElementById('menu');
  
  if(!btn || !menu) return;

  function set(open){
    menu.classList.toggle('active', open);
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  
  btn.addEventListener('click', function(){ 
    set(!menu.classList.contains('active')); 
  });
  
  document.querySelectorAll('#menu a').forEach(function(a){ 
    a.addEventListener('click', function(){ set(false); }); 
  });
  
  document.addEventListener('keydown', function(e){ 
    if(e.key === 'Escape') set(false); 
  });
})();