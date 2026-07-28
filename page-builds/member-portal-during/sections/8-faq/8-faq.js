/* FAQ accordion: opening one item closes the others. */
(function(){var ds=document.querySelectorAll('.acc details');ds.forEach(function(d){d.removeAttribute('open');d.addEventListener('toggle',function(){if(d.open){ds.forEach(function(o){if(o!==d)o.removeAttribute('open');});}});});})();
