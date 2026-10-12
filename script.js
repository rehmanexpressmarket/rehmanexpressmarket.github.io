// 1) Cubo 3D: gira solo y se inclina con el ratón o el dedo
(function(){
  var cube = document.getElementById('cube');
  var hero = document.getElementById('inicio');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var angle = 30, mx = 0, my = 0, tx = 0, ty = 0, running = true;

  function frame(){
    if(running && !reduce) angle += 0.35;
    mx += (tx - mx) * 0.08;
    my += (ty - my) * 0.08;
    cube.style.transform = 'rotateX(' + (-22 + my * 18) + 'deg) rotateY(' + (angle + mx * 30) + 'deg)';
    requestAnimationFrame(frame);
  }
  hero.addEventListener('pointermove', function(e){
    var r = hero.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width - 0.5;
    ty = (e.clientY - r.top) / r.height - 0.5;
    document.querySelectorAll('.orb').forEach(function(o){
      var d = +o.dataset.depth;
      o.style.transform = 'translate(' + (tx * d) + 'px,' + (ty * d) + 'px)';
    });
  });
  hero.addEventListener('pointerleave', function(){ tx = 0; ty = 0; });
  document.addEventListener('visibilitychange', function(){ running = !document.hidden; });
  frame();
})();

// 2) Tarjetas de servicios: se inclinan en 3D y brillan donde pasa el puntero
(function(){
  if(!window.matchMedia('(hover: hover)').matches) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.tilt').forEach(function(c){
    c.addEventListener('pointermove', function(e){
      var r = c.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.transform = 'rotateX(' + ((0.5 - y) * 14) + 'deg) rotateY(' + ((x - 0.5) * 14) + 'deg) translateZ(8px)';
      c.style.setProperty('--mx', (x * 100) + '%');
      c.style.setProperty('--my', (y * 100) + '%');
    });
    c.addEventListener('pointerleave', function(){ c.style.transform = ''; });
  });
})();

// 3) Estado "Abierto ahora" según la hora de Madrid, y día actual resaltado en el horario
(function(){
  var f = new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false});
  var p = {}; f.formatToParts(new Date()).forEach(function(x){p[x.type]=x.value});
  var dias = {Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
  var d = dias[p.weekday], m = (+p.hour % 24)*60 + (+p.minute);
  var abierto = d===5 ? (m>=540&&m<840)||(m>=900&&m<1320) : (m>=540&&m<1320);
  var s = document.getElementById('status'), t = document.getElementById('status-text');
  s.className = 'pill ' + (abierto ? 'open' : 'closed');
  t.textContent = abierto ? 'Abierto ahora' : 'Cerrado ahora · abrimos a las 09:00';
  var row = document.querySelector('#hours tr[data-d="'+d+'"]');
  if(row) row.className = 'today';
})();
