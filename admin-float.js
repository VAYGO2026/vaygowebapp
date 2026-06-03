/* ── VAYGO ADMIN FLOATING BUTTON ── */
(function(){
  const p = new URLSearchParams(window.location.search);
  if(p.get('admin') === 'vaygo2026'){
    localStorage.setItem('vaygo_admin','vaygo2026');
  }
  if(localStorage.getItem('vaygo_admin') !== 'vaygo2026') return;

  /* Inyectar estilos */
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
    .vadm-link{display:flex;align-items:center;gap:16px;padding:16px 18px;border-radius:16px;text-decoration:none;transition:opacity 0.15s;}
    .vadm-link:active{opacity:0.7;}
    .vadm-icon{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
    .vadm-name{font-size:14px;font-weight:800;color:#fff;}
    .vadm-desc{font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px;}
    .vadm-arrow{margin-left:auto;font-size:18px;font-weight:800;}
    .vadm-footer{margin-top:28px;text-align:center;font-size:10px;color:rgba(255,255,255,0.15);letter-spacing:2px;font-family:'Righteous',sans-serif;}
  `;
  document.head.appendChild(style);

  /* Botón flotante */
  const fab = document.createElement('button');
  fab.id = 'vaygo-admin-fab';
  fab.textContent = 'ADM';
  fab.onclick = openPanel;
  document.body.appendChild(fab);

  /* Panel */
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
      <div class="vadm-links">

        <a class="vadm-link" href="https://vaygowebapp-ynao.vercel.app/admin-tombola.html" style="background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.2);">
          <div class="vadm-icon" style="background:rgba(255,215,0,0.12);">🎰</div>
          <div><div class="vadm-name">Tómbola</div><div class="vadm-desc">Admin rifa y sorteos</div></div>
          <div class="vadm-arrow" style="color:rgba(255,215,0,0.5);">›</div>
        </a>

        <a class="vadm-link" href="https://vaygowebapp-ynao.vercel.app/validar.html" style="background:rgba(212,245,106,0.06);border:1px solid rgba(212,245,106,0.2);">
          <div class="vadm-icon" style="background:rgba(212,245,106,0.12);">📱</div>
          <div><div class="vadm-name">Validador Cupones</div><div class="vadm-desc">Escaneo QR meseros</div></div>
          <div class="vadm-arrow" style="color:rgba(212,245,106,0.5);">›</div>
        </a>

        <a class="vadm-link" href="https://vaygowebapp-ynao.vercel.app/venues.html" style="background:rgba(100,180,255,0.06);border:1px solid rgba(100,180,255,0.2);">
          <div class="vadm-icon" style="background:rgba(100,180,255,0.12);">💼</div>
          <div><div class="vadm-name">Cotización Paquetes</div><div class="vadm-desc">Venues y planes</div></div>
          <div class="vadm-arrow" style="color:rgba(100,180,255,0.5);">›</div>
        </a>

        <a class="vadm-link" href="https://vaygowebapp-ynao.vercel.app/vendedores.html" style="background:rgba(255,120,80,0.06);border:1px solid rgba(255,120,80,0.2);">
          <div class="vadm-icon" style="background:rgba(255,120,80,0.12);">🏪</div>
          <div><div class="vadm-name">Admin Negocios</div><div class="vadm-desc">Administración y pagos</div></div>
          <div class="vadm-arrow" style="color:rgba(255,120,80,0.5);">›</div>
        </a>

        <a class="vadm-link" href="https://vaygowebapp-ynao.vercel.app/admin-vendors.html" style="background:rgba(180,100,255,0.06);border:1px solid rgba(180,100,255,0.2);">
          <div class="vadm-icon" style="background:rgba(180,100,255,0.12);">👥</div>
          <div><div class="vadm-name">Admin Vendedores</div><div class="vadm-desc">Comisiones y escaneos</div></div>
          <div class="vadm-arrow" style="color:rgba(180,100,255,0.5);">›</div>
        </a>

        <a class="vadm-link" href="https://vaygowebapp-ynao.vercel.app/vendor-panel.html" style="background:rgba(80,255,180,0.06);border:1px solid rgba(80,255,180,0.2);">
          <div class="vadm-icon" style="background:rgba(80,255,180,0.12);">📊</div>
          <div><div class="vadm-name">Panel Vendedor</div><div class="vadm-desc">Stats y QR vendedor</div></div>
          <div class="vadm-arrow" style="color:rgba(80,255,180,0.5);">›</div>
        </a>

      </div>
      <div class="vadm-footer">VAYGO ADMIN · ACCESO PRIVADO</div>
    </div>
  `;
  document.body.appendChild(panel);

  document.getElementById('vadmClose').onclick = closePanel;

  function openPanel(){ panel.classList.add('open'); }
  function closePanel(){ panel.classList.remove('open'); }

})();
