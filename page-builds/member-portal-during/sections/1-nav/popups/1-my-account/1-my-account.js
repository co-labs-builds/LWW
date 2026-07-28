/* My Account modal. Triggers: drawer "My Account" (#accLink) and the nav avatar. */
(function(){
  var m=document.getElementById('acctModal'),s=document.getElementById('acctScrim');
  function op(){m.classList.add('open');s.classList.add('open');var d=document.getElementById('drawer'),sc=document.getElementById('scrim');if(d)d.classList.remove('open');if(sc)sc.classList.remove('open');}
  function sh(){m.classList.remove('open');s.classList.remove('open');}
  var l=document.getElementById('accLink');if(l)l.addEventListener('click',function(e){e.preventDefault();op();});
  var av=document.querySelector('.avatar');if(av){av.style.cursor='pointer';av.addEventListener('click',op);}
  document.getElementById('acctClose').addEventListener('click',sh);
  s.addEventListener('click',sh);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')sh();});
  document.getElementById('acctSave').addEventListener('click',function(){var b=this;b.textContent='Saved ✓';b.disabled=true;setTimeout(function(){b.textContent='Save Changes';b.disabled=false;},2200);});
  var pb=document.getElementById('acctPayBtn');if(pb)pb.addEventListener('click',function(){pb.textContent='Our team will reach out to update it securely.';});
})();
