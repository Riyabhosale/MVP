
(function(){
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu){
    navToggle.addEventListener('click', ()=>{
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.style.display = expanded ? 'none' : 'flex';
    });
    document.addEventListener('click', (e)=>{
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)){
        navMenu.style.display = 'none';
        navToggle.setAttribute('aria-expanded','false');
      }
    });
  }

  document.querySelectorAll('.has-sub .sub-toggle').forEach(btn=>{
    const sub = btn.nextElementSibling;
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const ex = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!ex));
      sub.style.display = ex ? 'none' : 'block';
    });
    document.addEventListener('click', (e)=>{
      if (!btn.contains(e.target) && !sub.contains(e.target)){
        btn.setAttribute('aria-expanded','false');
        sub.style.display = 'none';
      }
    });
  });
})();

(function(){
  const el = document.getElementById('word');
  if(!el) return;
  const WORDS = ["build", "create", "grow", "scale", "optimize", "launch", "transform"];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HOLD_MS = 1200, TYPE_MS = 90, ERASE_MS = 55;
  let i = 0;
  function pause(ms){ return new Promise(r=>setTimeout(r, ms)); }
  async function typeTo(node, text, perChar){
    const current = node.textContent;
    let common = 0;
    while (common < current.length && common < text.length && current[common] === text[common]) common++;
    for (let j=current.length; j>common; j--){ node.textContent = current.slice(0, j-1); await pause(ERASE_MS); }
    for (let j=common; j<text.length; j++){ node.textContent = text.slice(0, j+1); await pause(perChar); }
  }
  async function erase(node, perChar){
    const t = node.textContent;
    for (let j=t.length; j>0; j--){ node.textContent = t.slice(0, j-1); await pause(perChar); }
  }
  if (reduceMotion){
    setInterval(()=>{ i=(i+1)%WORDS.length; el.textContent = WORDS[i]; }, HOLD_MS);
  } else {
    (async function loop(){
      while(true){
        i=(i+1)%WORDS.length;
        await typeTo(el, WORDS[i], TYPE_MS);
        await pause(HOLD_MS);
        await erase(el, ERASE_MS);
      }
    })();
  }
})();

function handleLead(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name')||'').toString().trim();
    const email = (fd.get('email')||'').toString().trim();
    if(!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
      alert('Please enter a valid name and email.');
      return;
    }
    try{
      localStorage.setItem('mvp_lead', JSON.stringify({name, email, ts: Date.now()}));
    }catch(err){}
    alert('Thanks! You can download the kit now.');
    window.location.href = 'assets/mvp-brand-starter-kit.pdf';
  });
}
const leadForm = document.getElementById('leadForm');
if (leadForm) handleLead(leadForm);

const magnetForm = document.getElementById('magnetForm');
if (magnetForm){
  handleLead(magnetForm);
  const direct = document.getElementById('directDownload');
  if (direct){
    direct.addEventListener('click', (e)=>{
      e.preventDefault();
      let ok = false;
      try{ ok = !!localStorage.getItem('mvp_lead'); }catch(err){ ok = false; }
      if (ok){ window.location.href = 'assets/mvp-brand-starter-kit.pdf'; }
      else { alert('Pop in your email so we can send updates and the kit.'); }
    });
  }
}

const contactForm = document.getElementById('contactForm');
if (contactForm){
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(contactForm);
    const name = encodeURIComponent(fd.get('name')||'');
    const email = encodeURIComponent(fd.get('email')||'');
    const company = encodeURIComponent(fd.get('company')||'');
    const message = encodeURIComponent(fd.get('message')||'');
    window.location.href = `mailto:hello@myventurepartners.com?subject=New%20enquiry%20from%20${name}&body=Name:%20${name}%0AEmail:%20${email}%0ACompany:%20${company}%0A%0A${message}`;
  });
}
