/* Health Resources modal. Triggers: "Explore Health Resources" (#hrLink) in Contact
   and "Health Resources" (#hrLink2) in the nav drawer. */
(function(){
  var m=document.getElementById('hrModal'),s=document.getElementById('hrScrim');
  function op(){m.classList.add('open');s.classList.add('open');var d=document.getElementById('drawer'),sc=document.getElementById('scrim');if(d)d.classList.remove('open');if(sc)sc.classList.remove('open');}
  function sh(){m.classList.remove('open');s.classList.remove('open');}
  var l1=document.getElementById('hrLink'),l2=document.getElementById('hrLink2');
  if(l1)l1.addEventListener('click',op);if(l2)l2.addEventListener('click',op);
  document.getElementById('hrClose').addEventListener('click',sh);s.addEventListener('click',sh);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')sh();});
})();
