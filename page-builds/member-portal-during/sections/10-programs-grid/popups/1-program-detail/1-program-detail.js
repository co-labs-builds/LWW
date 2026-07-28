/* Program detail modal. Opens from any program card (.pcard). The "Continue" CTA on
   the current program returns to the Current Program tab via the tabs' first button. */
(function(){
  var PDATA={
    forum:{eye:'Current Program',title:'The Landmark Forum',status:'Fri, Aug 14 &ndash; Sun, Aug 16, 2026 &middot; Online &middot; 9:00 AM Pacific<br>Graduation &middot; Tuesday evening, Aug 18',
      desc:'<p>Three full days, designed as one complete experience. Across the weekend you take apart the hidden constraints that have been running your life &mdash; and leave with a new freedom in the areas that matter most.</p><p>Everything for your weekend lives on the Today page: your link to join, assignments, and graduation details.</p>',
      next:"<b>You're in it now.</b> Head back to the Today page for your link to join and today's assignment.",cta:'Continue',go:'during'},
    seminar:{eye:'Upcoming &middot; Seminar Series',title:'Integrity: The Bottom Line',status:'Begins Thu, Aug 20, 2026 &middot; Thursdays &middot; 7:00 PM Pacific &middot; Online',
      desc:'<p>Ten evening sessions on integrity &mdash; restoring workability and power in the places life feels stuck. Seminars are where Forum breakthroughs become a practice, applied week by week to your relationships, work, and goals.</p><p><b>Sessions:</b> Aug 20 &middot; Aug 27 &middot; Sep 3 &middot; Sep 10 &middot; Sep 24 &middot; Oct 1 &middot; Oct 8 &middot; Oct 22 &middot; Nov 5 &middot; Nov 12</p>',
      next:'<b>Recommended:</b> choose your seminar series in the week after graduation, while the weekend is still fresh.',cta:'View Details',go:'alert'},
    ac:{eye:'Recommended Next',title:'Advanced Course',status:'3-day weekend + Tuesday evening &middot; Offered year-round',
      desc:'<p>The Forum cleared the canvas. The Advanced Course is where you pick up the brush &mdash; moving from awareness to authorship, and designing a future you invent rather than inherit.</p><p>Open to Landmark Forum graduates.</p>',
      next:'<b>Most graduates take the Advanced Course within a few months of The Forum</b> &mdash; while the momentum is strongest.',cta:'View Advanced Course Dates',go:'alert'},
    cap:{eye:'Curriculum',title:'Communication: Access to Power',status:'Part of the Communication Curriculum',
      desc:'<p>A new relationship to communication &mdash; discovering how much of life happens in language, and gaining ease and power in the conversations that matter most.</p>',
      next:'<b>Pathway:</b> typically taken after the Advanced Course.',cta:'Learn More',go:'alert'},
    cpc:{eye:'Curriculum',title:'Communication: Power to Create',status:'Part of the Communication Curriculum',
      desc:'<p>Builds directly on Access to Power &mdash; using language not just to relate, but to create: bringing ideas, projects, and possibilities into reality.</p>',
      next:'<b>Pathway:</b> follows Communication: Access to Power.',cta:'Learn More',go:'alert'},
    tmlp:{eye:'Curriculum',title:'Team Management &amp; Leadership Program',status:'Year-long program',
      desc:'<p>A year-long program in leading and being led &mdash; building the kind of teams that accomplish what none of the members could alone, and becoming someone others choose to follow.</p>',
      next:'<b>Pathway:</b> typically follows the Communication Curriculum.',cta:'Learn More',go:'alert'},
    wisdom:{eye:'Curriculum',title:'Wisdom Course',status:'Part of the Wisdom Curriculum',
      desc:'<p>For people committed to living fully &mdash; a course about everyday life that brings wisdom, play, and possibility to the year you are actually living.</p>',
      next:'<b>Pathway:</b> open to Advanced Course graduates.',cta:'Learn More',go:'alert'},
    partner:{eye:'Curriculum',title:'Partnership Exploration',status:'Part of the Wisdom Curriculum',
      desc:'<p>An exploration of what true partnership makes possible &mdash; at home, at work, and in your community &mdash; and what becomes available when you create it deliberately.</p>',
      next:'<b>Pathway:</b> part of the Wisdom area of the curriculum.',cta:'Learn More',go:'alert'}
  };
  var m=document.getElementById('pgModal'),s=document.getElementById('pgScrim'),go='';
  function openP(k){var d=PDATA[k];if(!d)return;
    document.getElementById('pgEyebrow').innerHTML=d.eye;document.getElementById('pgTitle').innerHTML=d.title;
    document.getElementById('pgStatus').innerHTML=d.status;document.getElementById('pgDesc').innerHTML=d.desc;
    document.getElementById('pgNext').innerHTML=d.next;document.getElementById('pgCta').innerHTML=d.cta;go=d.go;
    m.classList.add('open');s.classList.add('open');}
  function shutP(){m.classList.remove('open');s.classList.remove('open');}
  document.querySelectorAll('.pcard').forEach(function(c){c.addEventListener('click',function(){openP(c.dataset.p);});});
  document.querySelectorAll('.pcard .pbtn2:not([onclick])').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();openP(b.closest('.pcard').dataset.p);});});
  document.getElementById('pgCta').addEventListener('click',function(){
    if(go==='during'){shutP();var t=document.querySelectorAll('.progtabs button')[0];if(t)t.click();}
    else{alert('This will open the program page.');}});
  document.getElementById('pgClose').addEventListener('click',shutP);
  s.addEventListener('click',shutP);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')shutP();});
})();
