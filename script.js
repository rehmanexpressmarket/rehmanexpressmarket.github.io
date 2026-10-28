// Estado "Abierto ahora" (hora de Madrid) y día actual resaltado en el horario
(function () {
  var s = document.getElementById('status');
  var t = document.getElementById('status-text');
  if (!s || !t) return;

  var f = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
  });
  var p = {};
  f.formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });

  var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  var d = days[p.weekday];
  if (d === undefined) return;

  var m = (+p.hour % 24) * 60 + (+p.minute);
  if (isNaN(m)) return;

  // Horario: L-J, S y D de 09:00 a 22:00 · V de 09:00 a 14:00 y de 15:00 a 22:00
  var tramos = (d === 5) ? [[540, 840], [900, 1320]] : [[540, 1320]];

  var open = false, i, next = null;
  for (i = 0; i < tramos.length; i++) {
    if (m >= tramos[i][0] && m < tramos[i][1]) { open = true; break; }
  }

  s.classList.remove('open', 'closed');
  s.classList.add(open ? 'open' : 'closed');

  if (open) {
    t.textContent = 'Abierto ahora';
  } else {
    for (i = 0; i < tramos.length; i++) {
      if (m < tramos[i][0]) { next = tramos[i][0]; break; }
    }
    t.textContent = (next === null)
      ? 'Cerrado ahora · abrimos mañana a las 09:00'
      : 'Cerrado ahora · abrimos a las ' + hhmm(next);
  }

  var r = document.querySelector('#hours tr[data-d="' + d + '"]');
  if (r) r.classList.add('today');

  function hhmm(x) {
    var h = Math.floor(x / 60), mi = x % 60;
    return (h < 10 ? '0' : '') + h + ':' + (mi < 10 ? '0' : '') + mi;
  }
})();