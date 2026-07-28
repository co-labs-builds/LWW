/* Program tabs: Current Program / All Programs.
   Adapted for Ontraport: instead of toggling one parent wrapper, this shows/hides
   every section flagged with data-tabgroup="current" | "all". Each grouped section's
   root element carries that attribute (see structure-map). */
(function(){
  var btns=document.querySelectorAll('.progtabs button');
  function show(group){
    document.querySelectorAll('[data-tabgroup]').forEach(function(el){
      el.style.display=(el.getAttribute('data-tabgroup')===group)?'':'none';
    });
  }
  btns.forEach(function(b){
    b.addEventListener('click',function(){
      btns.forEach(function(x){x.classList.remove('active');});
      b.classList.add('active');
      var t=b.dataset.tab; var group=(t==='all'||t==='prior')?'all':'current';
      show(group); window.scrollTo({top:0});
    });
  });
  show('current'); /* initial state */
})();
