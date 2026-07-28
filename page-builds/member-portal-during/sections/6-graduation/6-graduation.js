/* Copy-to-clipboard for each graduation invitee Zoom link. */
(function(){
  document.querySelectorAll('.inv-copy').forEach(function(b){
    b.addEventListener('click',function(){
      var t=b.getAttribute('data-link');
      function done(){var ct=b.querySelector('.ct'),tip=b.querySelector('.tip');b.classList.add('copied');ct.textContent='Link copied';tip.textContent='Link copied';setTimeout(function(){b.classList.remove('copied');ct.textContent='Copy';tip.textContent='Copy link';},1800);}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,done);}
      else{var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();done();}
    });
  });
})();
