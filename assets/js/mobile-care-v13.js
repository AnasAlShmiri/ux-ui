/* Yerani V13 — self-explanatory mobile care UI.
   Zero network calls and zero persistent storage: actions only preview selections. */
(() => {
 "use strict";
 const init=()=>{
  if(!document.body.classList.contains("m13"))return;
  // Accessible segmented tabs; only one tabpanel visible at a time.
  document.querySelectorAll("[data-m13-tabs]").forEach(group=>{
   const tabs=[...group.querySelectorAll('[role="tab"]')];
   if(!tabs.length)return;
   const panels=tabs.map(x=>document.getElementById(x.getAttribute("aria-controls"))).filter(Boolean);
   const select=(tab,focus=false)=>{
    tabs.forEach(t=>{const on=t===tab;t.setAttribute("aria-selected",String(on));t.tabIndex=on?0:-1;});
    panels.forEach(p=>{p.hidden=p.id!==tab.getAttribute("aria-controls")});
    if(focus)tab.focus();
   };
   tabs.forEach((tab,i)=>{
    tab.addEventListener("click",()=>select(tab));
    tab.addEventListener("keydown",e=>{
     if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;
     e.preventDefault();
     const index=e.key==="Home"?0:e.key==="End"?tabs.length-1:e.key==="ArrowLeft"?(i+1)%tabs.length:(i-1+tabs.length)%tabs.length;
     select(tabs[index],true);
    });
   });
   select(tabs.find(x=>x.getAttribute("aria-selected")==="true")||tabs[0]);
  });
  // Patient home nursing: selection only, explicit no medical authorization or booking.
  const careForm=document.querySelector("[data-m13-care-form]");
  if(careForm){
   const summary=careForm.querySelector("[data-m13-care-selection]"),feedback=careForm.querySelector("[data-m13-feedback]");
   const radios=[...careForm.querySelectorAll('input[name="care-service"]')];
   const label=()=>radios.find(x=>x.checked)?.dataset.label||"اختر الخدمة أولاً";
   const update=()=>{summary.textContent=label();feedback.hidden=true;};
   radios.forEach(x=>x.addEventListener("change",update));
   careForm.addEventListener("submit",e=>{
    e.preventDefault();
    const active=radios.find(x=>x.checked);
    feedback.hidden=false;
    if(!active){feedback.textContent="اختر نوع الخدمة لعرض ملخص الطلب.";return;}
    const guided=active.value==="guided";
    feedback.textContent="معاينة اختيارك: "+active.dataset.label+".\n"+(guided?"هذه الخدمة قد تتطلب أمراً طبياً صالحاً، ولا يمكن التحقق من توفره في النموذج.":"سيتم تحديد تفاصيل الموعد ومقدم الخدمة بعد ربط نظام الحجوزات.")+"\nلم يتم إنشاء حجز أو إرسال أي بيانات.";
   });
   update();
  }
  // Preview forms for nurse and doctor. Never submit clinical notes.
  document.querySelectorAll("[data-m13-demo-form]").forEach(form=>{
   const box=form.querySelector("[data-m13-feedback]");
   form.addEventListener("submit",e=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form),kind=form.dataset.m13DemoForm;
    let value="";
    if(kind==="nurse-care"){
     const service=String(data.get("careType")||"").trim();
     const note=String(data.get("careNotes")||"").trim();
     const order=Boolean(data.get("medicalOrder"));
     value="معاينة توثيق الخدمة:\nالنوع: "+service+"\nملاحظات التنفيذ: "+note+"\n"+(order?"تم تحديد وجود توجيه طبي للمراجعة، دون تحقق من صلاحيته.":"لم يتم تأكيد وجود توجيه طبي في هذا النموذج.")+"\n\nلا يوجد تنفيذ أو اعتماد أو حفظ فعلي.";
    }else if(kind==="doctor-lab"){
     const test=String(data.get("labType")||"").trim();
     const reason=String(data.get("labReason")||"").trim();
     value="معاينة طلب الفحص:\nالفحص: "+test+"\nملاحظات الطبيب: "+reason+"\n\nلم يتم إنشاء طلب مخبري أو إرساله أو حفظه.";
    }
    if(box){box.textContent=value;box.hidden=false;box.scrollIntoView({block:"nearest",behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"});}
   });
   form.querySelectorAll("input,select,textarea").forEach(x=>x.addEventListener("input",()=>{if(box)box.hidden=true;}));
  });
 };
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();