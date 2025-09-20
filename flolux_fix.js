
// flolux runtime rewriter: force CDN absolute URLs
(function(){
  const CDN = ['static.tildacdn.net','static3.tildacdn.com','static3.tildacdn.net','neo.tildacdn.com','thb.tildacdn.net'];
  function absolutize(u){
    if(!u) return u;
    u = (''+u).trim();
    // remove accidental localhost prefix
    u = u.replace(/^http:\/\/localhost:\d+/,'').replace(/^http:\/\/\[::\]:\d+/,'')
    // //static.* -> https://static.*
    if(u.startsWith('//')) return 'https:' + u;
    // /static.* -> https://static.*
    for(const host of CDN){
      if(u.startsWith('/'+host+'/')) return 'https://' + u.slice(1);
      if(u.startsWith(host+'/')) return 'https://' + u;
    }
    return u;
  }
  function fixImg(img){
    ['src','data-original','data-lazy','data-src'].forEach(attr=>{
      const v = img.getAttribute(attr);
      if(v){
        const a = absolutize(v);
        if(attr==='src' && a!==img.src) img.src = a;
        else if(a!==v) img.setAttribute(attr,a);
      }
    });
    // srcset
    const ss = img.getAttribute('srcset');
    if(ss){
      const parts = ss.split(',').map(p=>{
        const m = p.trim().split(/\s+/);
        m[0] = absolutize(m[0]);
        return m.join(' ');
      });
      img.setAttribute('srcset', parts.join(', '));
    }
    img.style.filter='none';img.style.webkitFilter='none';
  }
  function fixBg(el){
    const bg = el.getAttribute('data-bg') || el.getAttribute('data-original');
    if(bg){
      const a = absolutize(bg);
      el.style.backgroundImage = "url('"+a+"')";
    }
  }
  function sweep(root){
    root.querySelectorAll('img').forEach(fixImg);
    root.querySelectorAll('[data-bg],[data-original]').forEach(fixBg);
    // CSS inline backgrounds for t-bgimg
    root.querySelectorAll('[style*="background"]').forEach(el=>{
      const s = el.getAttribute('style');
      const rep = s.replace(/url\((['"]?)(\/?\/?)(static(?:3)?\.tildacdn\.(?:net|com)\/[^)]+)\1\)/gi,
                            (m,q,slashes,rest)=>`url('https://${rest.replace(/^\/+/,'')}')`);
      if(rep!==s) el.setAttribute('style',rep);
    });
  }
  function onReady(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded',fn); }
  onReady(()=>{
    sweep(document);
    const mo = new MutationObserver(m=>m.forEach(r=>r.addedNodes.forEach(n=>{ if(n.nodeType===1) sweep(n); })));
    mo.observe(document.documentElement,{subtree:true, childList:true});
  });
})();
