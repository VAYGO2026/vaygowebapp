// ── VAYGO REVIEW SYSTEM ──
const REVIEW_CATEGORIES = {
  eat:       [['🍽️','Food'],['👨‍🍳','Service']],
  breakfast: [['🍽️','Food'],['👨‍🍳','Service']],
  drink:     [['🍹','Drinks'],['👨‍🍳','Service']],
  dive:      [['🤿','Equipment'],['👨‍🏫','Instructors'],['🛟','Safety'],['🌊','Experience']],
  tours:     [['🚤','Experience'],['👨‍✈️','Staff'],['🛟','Safety']],
  rent:      [['🛵','Equipment'],['👨‍💼','Staff'],['⭐','Experience']],
  shop:      [['🛍️','Products'],['👨‍💼','Service']]
};
const VENUE_CATEGORIES = {
  lobster:'eat', monina:'eat', azulmadera:'eat', guidos:'eat', '10experiences':'eat',
  aquiyahora:'drink', buccanos:'drink', isla:'breakfast',
  snorkel:'dive', deep:'dive',
  carruaje:'tours'
};

let _reviewPending=[], _currentReview=null, _reviewRatings={};

function getDeviceIdReview(){
  try{
    let id=localStorage.getItem('vaygo_device_id');
    if(!id){id='dev_'+Date.now()+'_'+Math.random().toString(36).slice(2,12);localStorage.setItem('vaygo_device_id',id);}
    return id;
  }catch(e){return 'dev_unknown';}
}

function injectReviewModal(){
  if(document.getElementById('vaygoReviewModal')) return;
  const style = document.createElement('style');
  style.textContent = `
    #vaygoReviewModal{display:none;position:fixed;inset:0;z-index:99999;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);backdrop-filter:blur(4px);}
    #vaygoReviewModal.open{display:flex!important;}
    .vr-box{background:#0D1E35;border:1px solid #1A2E4A;border-radius:24px;padding:24px 20px 28px;width:90%;max-width:360px;max-height:85vh;overflow-y:auto;}
    .vr-header{text-align:center;margin-bottom:16px;}
    .vr-venue{font-family:'Anton',sans-serif;font-size:18px;color:#fff;letter-spacing:2px;margin-bottom:4px;}
    .vr-sub{font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:1px;text-transform:uppercase;}
    .vr-cat{margin-bottom:14px;}
    .vr-cat-label{font-size:13px;font-weight:700;color:rgba(255,255,255,0.7);margin-bottom:6px;}
    .vr-stars{display:flex;gap:8px;}
    .vr-star{font-size:26px;cursor:pointer;filter:grayscale(1) opacity(0.4);transition:filter 0.15s;}
    .vr-star.active{filter:grayscale(0) opacity(1);}
    .vr-divider{height:1px;background:rgba(255,255,255,0.08);margin:12px 0;}
    .vr-score{text-align:center;font-family:'Anton',sans-serif;font-size:13px;color:rgba(255,255,255,0.3);letter-spacing:1px;margin-bottom:12px;}
    .vr-score span{color:#d4f56a;font-size:20px;}
    .vr-submit{width:100%;background:linear-gradient(90deg,#d4f56a,#a8c840);border:none;border-radius:14px;padding:14px;color:#0D1E35;font-family:'Anton',sans-serif;font-size:16px;letter-spacing:2px;cursor:pointer;}
    .vr-submit:disabled{opacity:0.4;cursor:not-allowed;}
  `;
  document.head.appendChild(style);
  const modal = document.createElement('div');
  modal.id = 'vaygoReviewModal';
  modal.innerHTML = `<div class="vr-box"><div class="vr-header"><div style="font-size:28px;margin-bottom:6px;">⭐</div><div class="vr-venue" id="vrVenueName">—</div><div class="vr-sub">HOW WAS YOUR EXPERIENCE?</div></div><div id="vrCategories"></div><div class="vr-divider"></div><div class="vr-score" id="vrScorePreview">Rate all categories to submit</div><button class="vr-submit" id="vrSubmitBtn" onclick="submitVaygoReview()" disabled>SUBMIT RATING</button></div>`;
  document.body.appendChild(modal);
}

function showNextVaygoReview(){
  if(_reviewPending.length===0) return;
  _currentReview=_reviewPending[0];
  _reviewRatings={};
  const cat=VENUE_CATEGORIES[_currentReview.venueId]||'eat';
  const categories=REVIEW_CATEGORIES[cat]||REVIEW_CATEGORIES.eat;
  document.getElementById('vrVenueName').textContent=_currentReview.venueName;
  let html='';
  categories.forEach(([icon,label],idx)=>{
    const key='vcat_'+idx;
    html+=`<div class="vr-cat"><div class="vr-cat-label">${icon} ${label}</div><div class="vr-stars" id="vstars_${key}">${[1,2,3,4,5].map(n=>`<span class="vr-star" onclick="setVStar('${key}',${n},${categories.length})" >${'⭐'}</span>`).join('')}</div></div>`;
  });
  document.getElementById('vrCategories').innerHTML=html;
  document.getElementById('vrScorePreview').innerHTML='Rate all categories to submit';
  document.getElementById('vrSubmitBtn').disabled=true;
  document.getElementById('vaygoReviewModal').classList.add('open');
}

function setVStar(key,n,totalCats){
  _reviewRatings[key]=n;
  const stars=document.querySelectorAll(`#vstars_${key} .vr-star`);
  stars.forEach((s,i)=>s.classList.toggle('active',i<n));
  if(Object.keys(_reviewRatings).length===totalCats){
    const avg=Object.values(_reviewRatings).reduce((a,b)=>a+b,0)/totalCats;
    const score=(avg/5*10).toFixed(1);
    document.getElementById('vrScorePreview').innerHTML=`VAYGO SCORE <span>${score} / 10</span>`;
    document.getElementById('vrSubmitBtn').disabled=false;
  }
}

function submitVaygoReview(){
  if(!_currentReview) return;
  document.getElementById('vrSubmitBtn').disabled=true;
  const cat=VENUE_CATEGORIES[_currentReview.venueId]||'eat';
  const categories=REVIEW_CATEGORIES[cat]||REVIEW_CATEGORIES.eat;
  const vals=Object.values(_reviewRatings);
  const score=parseFloat((vals.reduce((a,b)=>a+b,0)/vals.length/5*10).toFixed(1));
  const ratings={};
  categories.forEach(([icon,label],idx)=>{ ratings[label.toLowerCase()]=_reviewRatings['vcat_'+idx]||0; });
  const codeToMark=_currentReview.code;
  // Close immediately
  _reviewPending.shift();
  document.getElementById('vaygoReviewModal').classList.remove('open');
  document.getElementById('vaygoReviewModal').style.display='none';
  // Save in background
  try {
    const db2 = firebase.firestore();
    db2.collection('reviews').add({
      venueId: _currentReview.venueId,
      venueName: _currentReview.venueName,
      deviceId: getDeviceIdReview(),
      ratings: ratings,
      score: score,
      category: cat,
      couponCode: codeToMark,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(()=>{
      console.log('review saved OK');
    }).catch(e=>{ console.log('review save error:', e.message); });
    db2.collection('codes').doc(codeToMark).update({reviewed:true}).catch(()=>{});
  } catch(e) { console.log('review system error:', e.message); }
  if(_reviewPending.length>0) setTimeout(showNextVaygoReview,400);
}

function checkVaygoReviews(){
  if(typeof firebase==='undefined'){ setTimeout(checkVaygoReviews,500); return; }
  injectReviewModal();
  const deviceId=getDeviceIdReview();
  firebase.firestore().collection('codes')
    .where('deviceId','==',deviceId)
    .where('used','==',true)
    .get()
    .then(snap=>{
      const pending=[];
      snap.forEach(doc=>{
        const d=doc.data();
        if(!d.reviewed && d.restId && d.restName) pending.push({code:doc.id,venueId:d.restId,venueName:d.restName});
      });
      if(pending.length>0){ _reviewPending=pending; showNextVaygoReview(); }
    }).catch(e=>console.log('review check error',e));
}

window.addEventListener('load',()=>setTimeout(checkVaygoReviews,500));
