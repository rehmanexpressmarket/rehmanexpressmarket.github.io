// Selector "¿Qué necesitas hoy?": cambia el texto y prepara un mensaje de WhatsApp
(function(){
  var data = {
    dinero:  ['Envío de dinero', 'Envía y recibe dinero en España y al extranjero. Pregúntanos por el país y el importe.', 'Hola, quiero enviar dinero. ¿Cómo puedo hacerlo?'],
    movil:   ['Recargas, SIM y accesorios', 'Recargas y tarjetas SIM de todas las compañías, más cargadores, fundas y auriculares.', 'Hola, quiero una recarga o tarjeta SIM. ¿Qué compañías tenéis?'],
    comida:  ['Productos latinos, frutos secos y bebidas', 'Alimentos de Latinoamérica, frutos secos, especias y refrescos de varios países.', 'Hola, busco un producto en concreto. ¿Lo tenéis en tienda?'],
    imprenta:['Impresión y fotocopias', 'Imprime o fotocopia tus documentos al momento, sin cita.', 'Hola, necesito imprimir unos documentos. ¿Cómo lo hago?']
  };
  var chips = document.querySelectorAll('.chip');
  function show(k){
    chips.forEach(function(c){ c.setAttribute('aria-selected', c.dataset.k===k ? 'true':'false'); });
    document.getElementById('p-title').textContent = data[k][0];
    document.getElementById('p-text').textContent = data[k][1];
    document.getElementById('p-link').href = 'https://wa.me/34941640545?text=' + encodeURIComponent(data[k][2]);
  }
  chips.forEach(function(c){ c.addEventListener('click', function(){ show(c.dataset.k); }); });
  show('dinero');
})();

// Estado "Abierto ahora" según la hora de Madrid, y día actual resaltado en el horario
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
