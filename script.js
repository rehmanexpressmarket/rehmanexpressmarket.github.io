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
      c.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * 14) + 'deg) rotateY(' + ((x - 0.5) * 14) + 'deg) translateZ(8px)';
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

// 4) Menú móvil
(function(){
  var header = document.getElementById('top'), btn = document.getElementById('menu-btn');
  function set(open){
    header.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  btn.addEventListener('click', function(){ set(!header.classList.contains('open')); });
  document.querySelectorAll('#menu a').forEach(function(a){ a.addEventListener('click', function(){ set(false); }); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') set(false); });
})();


// 6) Pantalla de servicios: cambia sola cada X segundos (data-seconds en el HTML)
(function(){
  var screen = document.getElementById('screen');
  var slides = screen.querySelectorAll('.slide');
  var dotsBox = document.getElementById('dots');
  var bar = document.getElementById('bar');
  var pauseBtn = document.getElementById('pause');
  var secs = parseFloat(screen.dataset.seconds) || 5;
  var cur = 0, userPaused = false, startX = null;
  screen.style.setProperty('--t', secs + 's');

  slides.forEach(function(s, i){
    s.querySelector('.s-wa').href = 'https://wa.me/34941640545?text=' + encodeURIComponent(s.dataset.msg);
    var d = document.createElement('button');
    d.type = 'button';
    d.setAttribute('aria-label', 'Ir al servicio ' + (i + 1));
    d.addEventListener('click', function(){ go(i); });
    dotsBox.appendChild(d);
  });

  function restartBar(){
    bar.style.animation = 'none';
    void bar.offsetWidth;
    bar.style.animation = '';
  }
  function go(n){
    var prev = cur;
    cur = (n + slides.length) % slides.length;
    if(prev !== cur){
      slides[prev].classList.remove('on');
      slides[prev].classList.add('out');
      setTimeout(function(){ slides[prev].classList.remove('out'); }, 560);
    }
    slides.forEach(function(s, i){ s.setAttribute('aria-hidden', i === cur ? 'false' : 'true'); });
    slides[cur].classList.add('on');
    Array.prototype.forEach.call(dotsBox.children, function(d, i){ d.setAttribute('aria-current', i === cur ? 'true' : 'false'); });
    restartBar();
  }
  function setPaused(p){
    screen.classList.toggle('paused', p);
    pauseBtn.textContent = userPaused ? '▶' : '❚❚';
    pauseBtn.setAttribute('aria-label', userPaused ? 'Reanudar' : 'Pausar');
  }

  bar.addEventListener('animationend', function(){ go(cur + 1); });
  document.getElementById('next').addEventListener('click', function(){ go(cur + 1); });
  document.getElementById('prev').addEventListener('click', function(){ go(cur - 1); });
  pauseBtn.addEventListener('click', function(){ userPaused = !userPaused; setPaused(userPaused); });
  screen.addEventListener('mouseenter', function(){ setPaused(true); });
  screen.addEventListener('mouseleave', function(){ setPaused(userPaused); });
  screen.addEventListener('focusin', function(){ setPaused(true); });
  screen.addEventListener('focusout', function(){ setPaused(userPaused); });
  screen.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; }, {passive:true});
  screen.addEventListener('touchend', function(e){
    if(startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
    startX = null;
  });
  go(0);
})();
