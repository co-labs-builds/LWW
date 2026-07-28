/* Feedback modal. Trigger: "How's it going so far?" (#fbLink) in Contact. */
(function(){
  var m=document.getElementById('fbModal'),s=document.getElementById('fbScrim');
  function op(){m.classList.add('open');s.classList.add('open');}
  function sh(){m.classList.remove('open');s.classList.remove('open');}
  var l=document.getElementById('fbLink');if(l)l.addEventListener('click',op);
  document.getElementById('fbClose').addEventListener('click',sh);s.addEventListener('click',sh);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')sh();});
})();
