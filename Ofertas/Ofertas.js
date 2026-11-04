/* =====================================================================
   ofertas.js  ·  Aquí están TUS OFERTAS y el código que las dibuja.
   Para cambiar ofertas solo tocas el bloque CONFIG de abajo.
   ===================================================================== */
(function () {
  'use strict';

  /* ------------------------- CONFIG (edita esto) ------------------------- */
  var CONFIG = {
    // Teléfono de WhatsApp con prefijo de país, sin + ni espacios
    whatsapp: '34941640545',

    // Texto de fechas (se cambia cada semana)
    vigencia: 'Válidas del 3 al 9 de noviembre',

    // Una oferta por bloque { ... }. Para quitar una, borra su bloque.
    // Para añadir una, copia un bloque entero y sepáralo con coma.
    // Campos opcionales: etiqueta, precioAnterior, imagen, alt, emoji.
    ofertas: [
      {
        etiqueta: 'Oferta',
        nombre: 'Hojas de plátano Nativo 500 g',
        descripcion: 'Congeladas, enteras, lavadas y listas para usar. Ideales para hallacas, tamales y platos al vapor.',
        precio: '2 × 5 €',
        precioAnterior: '',
        imagen: '/hojas-platano-nativo.png',
        alt: 'Paquete de hojas de plátano Nativo de 500 g, congeladas',
        emoji: '',
        mensaje: 'Hola, quiero reservar la oferta de hojas de plátano 2 x 5 €'
      }

      // PLANTILLA para otra oferta: copia estas líneas debajo de la oferta anterior,
      // quita los // del principio y pon una coma después de la llave } anterior.
      // ,{
      //   etiqueta: '-20%',
      //   nombre: 'Nombre del producto',
      //   descripcion: 'Descripción corta.',
      //   precio: '0,00 €',
      //   precioAnterior: '0,00 €',
      //   imagen: '',
      //   alt: '',
      //   emoji: '🥜',
      //   mensaje: 'Hola, quiero la oferta de ...'
      // }
    ]
  };
  /* ---------------------------------------------------------------------- */

  function el(tag, clase, texto) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto) e.textContent = texto;
    return e;
  }

  function tarjeta(o) {
    var li = el('li', 'of-card');

    if (o.etiqueta) li.appendChild(el('span', 'of-tag', o.etiqueta));

    if (o.imagen) {
      var img = el('img');
      img.src = o.imagen;
      img.alt = o.alt || o.nombre;
      img.loading = 'lazy';
      li.appendChild(img);
    } else if (o.emoji) {
      var em = el('span', 'of-emoji', o.emoji);
      em.setAttribute('aria-hidden', 'true');
      li.appendChild(em);
    }

    li.appendChild(el('h3', '', o.nombre));
    if (o.descripcion) li.appendChild(el('p', '', o.descripcion));

    var precio = el('p', 'of-precio', o.precio);
    if (o.precioAnterior) precio.appendChild(el('s', '', o.precioAnterior));
    li.appendChild(precio);

    var a = el('a', 'of-wa', 'Reservar por WhatsApp');
    a.href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' +
      encodeURIComponent(o.mensaje || ('Hola, quiero la oferta de ' + o.nombre));
    li.appendChild(a);

    return li;
  }

  function pintar() {
    var ofertas = CONFIG.ofertas;
    var hay = ofertas.length > 0;

    // Fechas de validez
    var vigencias = document.querySelectorAll('[data-of-vigencia]');
    for (var i = 0; i < vigencias.length; i++) vigencias[i].textContent = CONFIG.vigencia;

    // Listas de ofertas (data-max="3" limita cuántas se muestran)
    var listas = document.querySelectorAll('[data-of-lista]');
    for (var j = 0; j < listas.length; j++) {
      var max = parseInt(listas[j].getAttribute('data-max'), 10) || ofertas.length;
      listas[j].textContent = '';
      for (var k = 0; k < Math.min(max, ofertas.length); k++) {
        listas[j].appendChild(tarjeta(ofertas[k]));
      }
      listas[j].hidden = !hay;
    }

    // Banner superior: usa la primera oferta
    var banners = document.querySelectorAll('[data-of-banner]');
    for (var b = 0; b < banners.length; b++) {
      if (hay) {
        var t = banners[b].querySelector('[data-of-banner-texto]');
        if (t) t.textContent = ofertas[0].nombre + ' ' + ofertas[0].precio + ' · Ver ofertas de la semana';
      }
      banners[b].hidden = !hay;
    }

    // Sin ofertas: oculta la sección del index y muestra el aviso en la página
    var secciones = document.querySelectorAll('[data-of-seccion]');
    for (var s = 0; s < secciones.length; s++) {
      if (!secciones[s].hasAttribute('data-of-siempre')) secciones[s].hidden = !hay;
    }
    var vacios = document.querySelectorAll('[data-of-vacio]');
    for (var v = 0; v < vacios.length; v++) vacios[v].hidden = hay;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pintar);
  } else {
    pintar();
  }
})();
