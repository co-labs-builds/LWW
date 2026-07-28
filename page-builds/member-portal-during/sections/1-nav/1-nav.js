/* Nav drawer (burger menu). Modal triggers live in each modal's own JS. */
(function(){
  var burger=document.getElementById('burger'),drawer=document.getElementById('drawer'),
      scrim=document.getElementById('scrim'),closeD=document.getElementById('closeDrawer');
  function openD(){drawer.classList.add('open');scrim.classList.add('open');}
  function shutD(){drawer.classList.remove('open');scrim.classList.remove('open');}
  if(burger)burger.addEventListener('click',openD);
  if(closeD)closeD.addEventListener('click',shutD);
  if(scrim)scrim.addEventListener('click',shutD);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')shutD();});
})();
