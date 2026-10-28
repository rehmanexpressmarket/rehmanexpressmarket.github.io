// Estado "Abierto ahora" (hora de Madrid) y día actual resaltado en el horario
(function(){
  var s=document.getElementById('status'); if(!s) return;
  var f=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false});
  var p={}; f.formatToParts(new Date()).forEach(function(x){p[x.type]=x.value});
  var d={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[p.weekday], m=(+p.hour%24)*60+(+p.minute);
  var open=d===5?(m>=540&&m<840)||(m>=900&&m<1320):(m>=540&&m<1320);
  s.className='pill '+(open?'open':'closed');
  document.getElementById('status-text').textContent=open?'Abierto ahora':'Cerrado ahora · abrimos a las 09:00';
  var r=document.querySelector('#hours tr[data-d="'+d+'"]'); if(r) r.className='today';
})();
