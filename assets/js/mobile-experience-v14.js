/* Yerani V14 — review-ready mobile demo controls.
   All data is illustrative and remains in this DOM session only.
   No network, browser storage, bookings, medical changes or message dispatch. */
(()=>{
  "use strict";
  const init=()=>{
    if(!document.body.classList.contains("m14"))return;
    // Tabs for appointments/visits: accessible buttons, focus management, matching panels.
    document.querySelectorAll("[data-m14-tabs]").forEach(group=>{
      const tabs=[...group.querySelectorAll('[role="tab"]')];
      if(!tabs.length)return;
      const panels=tabs.map(tab=>document.getElementById(tab.getAttribute("aria-controls"))).filter(Boolean);
      const select=(tab,focus=false)=>{
        tabs.forEach(item=>{const on=item===tab;item.setAttribute("aria-selected",String(on));item.tabIndex=on?0:-1});
        panels.forEach(panel=>{panel.hidden=panel.id!==tab.getAttribute("aria-controls")});
        if(focus)tab.focus();
      };
      tabs.forEach((tab,i)=>{
        tab.addEventListener("click",()=>select(tab));
        tab.addEventListener("keydown",event=>{
          if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
          event.preventDefault();
          const next=event.key==="Home"?0:event.key==="End"?tabs.length-1:event.key==="ArrowLeft"?(i+1)%tabs.length:(i-1+tabs.length)%tabs.length;
          select(tabs[next],true);
        });
      });
      select(tabs.find(tab=>tab.getAttribute("aria-selected")==="true")||tabs[0]);
    });
    // Patient notification examples: local read/unread state and local-only counters.
    const cards=[...document.querySelectorAll("[data-m14-notification]")];
    if(cards.length){
      const count=document.querySelector("[data-m14-unread-count]");
      const allRead=document.querySelector("[data-m14-read-all]");
      const unreadOnly=document.querySelector("[data-m14-unread-only]");
      const empty=document.querySelector("[data-m14-empty-unread]");
      let filter="all";
      const render=()=>{
        const unread=cards.filter(card=>card.dataset.read!=="true").length;
        if(count){count.textContent=String(unread);count.setAttribute("aria-label",unread+" إشعارات غير مقروءة في نموذج العرض");}
        cards.forEach(card=>{
          const read=card.dataset.read==="true";
          card.classList.toggle("is-unread",!read);
          card.hidden=filter==="unread"&&read;
          const button=card.querySelector("[data-m14-read]");
          if(button){button.disabled=read;button.textContent=read?"مقروء":"تحديد كمقروء";}
        });
        if(empty)empty.hidden=!(filter==="unread"&&unread===0);
        if(allRead)allRead.disabled=unread===0;
        if(unreadOnly)unreadOnly.setAttribute("aria-pressed",String(filter==="unread"));
      };
      cards.forEach(card=>{
        card.querySelector("[data-m14-read]")?.addEventListener("click",()=>{
          card.dataset.read="true";render();
        });
      });
      allRead?.addEventListener("click",()=>{cards.forEach(card=>card.dataset.read="true");render();});
      unreadOnly?.addEventListener("click",()=>{filter=filter==="all"?"unread":"all";unreadOnly.textContent=filter==="unread"?"عرض جميع الإشعارات":"غير المقروءة فقط";render();});
      render();
    }
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();