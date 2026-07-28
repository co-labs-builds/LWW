/* Support modal with a contact form (mailto submit).
   NOTE (prototype): the source binds the open trigger to ".plancard .pbtn", which does
   not appear in this page's markup, so the modal has no active trigger here. Preserved
   as-is; wire a trigger (e.g. a Support button) when needed. */
(function(){
  var m=document.getElementById('supportModal'),s=document.getElementById('supportScrim');
  function op(){m.classList.add('open');s.classList.add('open');}
  function sh(){m.classList.remove('open');s.classList.remove('open');}
  document.querySelectorAll('.plancard .pbtn').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();op();});});
  document.getElementById('supportClose').addEventListener('click',sh);
  s.addEventListener('click',sh);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')sh();});
  document.getElementById('supportSend').addEventListener('click',function(){
    var name=(document.getElementById('supName').value||'').trim(),email=(document.getElementById('supEmail').value||'').trim(),phone=(document.getElementById('supPhone').value||'').trim(),msg=(document.getElementById('supMsg').value||'').trim();
    var pref=[];if(document.getElementById('supEmailChk').checked)pref.push('Email');if(document.getElementById('supCallChk').checked)pref.push('Phone call');
    var body="Support request from the Member Portal.\n\nName: "+name+"\nEmail: "+email+"\nPhone: "+phone+"\nPreferred contact: "+(pref.join(', ')||'—')+"\n\nMessage: "+msg;
    location.href='mailto:info@landmarkworldwide.com?subject='+encodeURIComponent('Support Request — '+(name||'Landmark Forum'))+'&body='+encodeURIComponent(body);
    this.textContent='Thank you — we’ll be in touch.';this.disabled=true;
  });
})();
