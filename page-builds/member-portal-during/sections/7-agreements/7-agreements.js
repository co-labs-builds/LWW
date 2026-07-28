/* Staggered reveal of the agreements list when scrolled into view. */
(function(){
  function reveal(el,cls,th){if(!el)return;if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){el.classList.add(cls);io.unobserve(el);}});},{threshold:th});io.observe(el);}else{el.classList.add(cls);}}
  reveal(document.getElementById('rules'),'in',.35);
})();
