/* ── VAYGO ADMIN FLOATING BUTTON ── */
(function(){
  const p = new URLSearchParams(window.location.search);
  if(p.get('admin') === 'vaygo2026'){
    localStorage.setItem('vaygo_admin','vaygo2026');
  }
  if(localStorage.getItem('vaygo_admin') !== 'vaygo2026') return;

  const style = document.createElement('style');
  style.textContent = `
    #vaygo-admin-fab{
      position:fixed;top:14px;right:14px;z-index:9999;
      width:48px;height:48px;border-radius:50%;
      background:linear-gradient(180deg,#d4f56a 0%,#8fc20a 50%,#5a8000 100%); 
      box-shadow:0 4px 0 #2d4000,0 0 18px rgba(212,245,106,0.5);
      border:none;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      font-family:'Anton',sans-serif;font-size:10px;color:#0a1a00;letter-spacing:1px;
      animation:adminPulse 2s ease-in-out infinite;
    }
    @keyframes adminPulse{
      0%,100%{box-shadow:0 4px 0 #2d4000,0 0 12px rgba(212,245,106,0.4);}
      50%{box-shadow:0 4px 0 #2d4000,0 0 24px rgba(212,245,106,0.8);}
    }
    #vaygo-admin-fab:active{transform:scale(0.92);}
    #vaygo-admin-panel{
      position:fixed;inset:0;z-index:99999;
      background:rgba(0,0,0,0.97);
      display:none;flex-direction:column;
      overflow-y:auto;
      font-family:'DM Sans',sans-serif;
    }
    #vaygo-admin-panel.open{display:flex;}
    .vadm-inner{padding:48px 20px 40px;max-width:390px;margin:0 auto;width:100%;}
    .vadm-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;}
    .vadm-title{font-family:'Anton',sans-serif;font-size:28px;color:#d4f56a;letter-spacing:4px;}
    .vadm-sub{font-family:'Righteous',sans-serif;font-size:10px;letter-spacing:4px;color:rgba(255,255,255,0.35);text-transform:uppercase;margin-top:2px;}
    .vadm-close{padding:10px 18px;border-radius:50px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;}
    .vadm-links{display:flex;flex-direction:column;gap:10px;}
    .vadm-item{border-radius:16px;overflow:hidden;}
    .vadm-link{display:flex;align-items:center;gap:16px;padding:16px 18px;text-decoration:none;transition:opacity 0.15s;}
    .vadm-link:active{opacity:0.7;}
    .vadm-icon{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
    .vadm-name{font-size:14px;font-weight:800;color:#fff;}
    .vadm-desc{font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px;}
    .vadm-arrow{margin-left:auto;font-size:18px;font-weight:800;}
    .vadm-share-row{display:flex;gap:6px;padding:0 12px 12px;}
    .vadm-share-btn{flex:1;padding:8px 6px;border-radius:10px;border:none;cursor:pointer;font-size:10px;font-weight:800;letter-spacing:0.5px;text-align:center;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:4px;}
    .vadm-footer{margin-top:28px;text-align:center;font-size:10px;color:rgba(255,255,255,0.15);letter-spacing:2px;font-family:'Righteous',sans-serif;}
  `;
  document.head.appendChild(style);

  const fab = document.createElement('button');
  fab.id = 'vaygo-admin-fab';
  fab.textContent = 'ADM';
  fab.onclick = openPanel;
  document.body.appendChild(fab);

  const items = [
    {
      icon:'🎰', name:'Tómbola', desc:'Admin rifa y sorteos',
      href:'./admin-tombola.html',
      color:'255,215,0',
      shares:[
        {label:'📤 Compartir', url:'https://www.vaygo.travel/admin-tombola.html', msg:'🎰 VAYGO Tómbola — Admin rifa y sorteos'}
      ]
    },
    {
      icon:'📱', name:'Validador Cupones', desc:'Escaneo QR meseros',
      href:'./validar.html',
      color:'212,245,106',
      shares:[
        {label:'📤 Compartir', url:'https://www.vaygo.travel/validar.html', msg:'📱 VAYGO Validador de Cupones'}
      ]
    },
    {
      icon:'💼', name:'Cotización Paquetes', desc:'Venues y planes',
      href:'./venues.html',
      color:'100,180,255',
      shares:[
        {label:'📤 Español', url:'https://www.vaygo.travel/venues.html', msg:'💼 VAYGO — Lleva más turistas a tu negocio en Cozumel: https://www.vaygo.travel/venues.html'},
        {label:'📤 English', url:'https://www.vaygo.travel/venuesingles.html', msg:'💼 VAYGO — Bring more tourists to your business in Cozumel: https://www.vaygo.travel/venuesingles.html'}
      ]
    },
    {
      icon:'🏪', name:'Admin Negocios', desc:'Administración y pagos',
      href:'./vendedores.html',
      color:'255,120,80',
      shares:[
        {label:'📤 Compartir', url:'https://www.vaygo.travel/vendedores.html', msg:'🏪 VAYGO Admin Negocios'}
      ]
    },
    {
      icon:'👥', name:'Admin Vendedores', desc:'Comisiones y escaneos',
      href:'./admin-vendors.html',
      color:'180,100,255',
      shares:[
        {label:'📤 Compartir', url:'https://www.vaygo.travel/admin-vendors.html', msg:'👥 VAYGO Admin Vendedores'}
      ]
    },
    {
      icon:'📊', name:'Panel Vendedor', desc:'Stats y QR vendedor',
      href:'./vendor-panel.html',
      color:'80,255,180',
      shares:[
        {label:'📤 Compartir', url:'https://www.vaygo.travel/vendor-panel.html', msg:'📊 VAYGO Panel Vendedor'}
      ]
    },
  ];

  function shareWA(msg, url){
    const text = encodeURIComponent(msg + '\n' + url);
    window.open('https://wa.me/?text=' + text, '_blank');
  }

  let linksHTML = '';
  items.forEach((item, i) => {
    const shareButtons = item.shares.map(s =>
      `<button class="vadm-share-btn" onclick="vaygoShare(${i},${item.shares.indexOf(s)})"
        style="background:rgba(${item.color},0.12);color:rgba(${item.color},0.9);border:1px solid rgba(${item.color},0.25);">
        ${s.label}
      </button>`
    ).join('');

    linksHTML += `
      <div class="vadm-item" style="background:rgba(${item.color},0.06);border:1px solid rgba(${item.color},0.2);">
        <a class="vadm-link" href="${item.href}">
          <div class="vadm-icon" style="background:rgba(${item.color},0.12);">${item.icon}</div>
          <div><div class="vadm-name">${item.name}</div><div class="vadm-desc">${item.desc}</div></div>
          <div class="vadm-arrow" style="color:rgba(${item.color},0.5);">›</div>
        </a>
        <div class="vadm-share-row">${shareButtons}</div>
      </div>`;
  });

  const panel = document.createElement('div');
  panel.id = 'vaygo-admin-panel';
  panel.innerHTML = `
    <div class="vadm-inner">
      <div class="vadm-header">
        <div>
          <div class="vadm-title">VAYGO</div>
          <div class="vadm-sub">Admin Panel</div>
        </div>
        <button class="vadm-close" id="vadmClose">✕ CERRAR</button>
      </div>
      <div class="vadm-links">${linksHTML}</div>
      <div class="vadm-footer">VAYGO ADMIN · ACCESO PRIVADO</div>
    </div>
  `;
  document.body.appendChild(panel);

  // Expose share data globally
  window._vadmItems = items;
  window.vaygoShare = function(itemIdx, shareIdx){
    const s = window._vadmItems[itemIdx].shares[shareIdx];
    shareWA(s.msg, s.url);
  };

  document.getElementById('vadmClose').onclick = closePanel;

  function openPanel(){ panel.classList.add('open'); }
  function closePanel(){ panel.classList.remove('open'); }

})();
