/* Yerani V12: UI-only clinical previews. No network, state persistence,
   prescription issuance, medical decision or report submission. */
(()=>{
 "use strict";
 const ready=fn=>document.readyState==="loading"?document.addEventListener("DOMContentLoaded",fn):fn();
 const format=(v,unit="")=>v!==""&&v!=null?String(v)+(unit?" "+unit:""):"غير مدخل";
 ready(()=>{
  if(!document.body.classList.contains("y12-clinical"))return;
  for(const bar of document.querySelectorAll("[data-y12-tabs]")){
   const btns=[...bar.querySelectorAll("[data-y12-tab]")], panels=[...document.querySelectorAll("[data-y12-panel]")];
   const select=(val,focus=false)=>{
    btns.forEach(b=>{const yes=b.dataset.y12Tab===val;b.setAttribute("aria-selected",String(yes));b.tabIndex=yes?0:-1;if(yes&&focus)b.focus()});
    panels.forEach(p=>{p.hidden=p.dataset.y12Panel!==val});
   };
   btns.forEach((b,i)=>{
    b.addEventListener("click",()=>select(b.dataset.y12Tab));
    b.addEventListener("keydown",e=>{
     if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;
     e.preventDefault();
     const next=e.key==="Home"?0:e.key==="End"?btns.length-1:e.key==="ArrowLeft"?(i+1)%btns.length:(i-1+btns.length)%btns.length;
     select(btns[next].dataset.y12Tab,true);
    })
   });
   if(btns[0])select(btns.find(b=>b.getAttribute("aria-selected")==="true")?.dataset.y12Tab||btns[0].dataset.y12Tab);
  }
  // Handle each form independently; never store clinical data or submit over HTTP.
  for(const form of document.querySelectorAll("[data-y12-preview-form]")){
   const output=form.querySelector("[data-y12-response]");
   form.addEventListener("submit",ev=>{
    ev.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form),kind=form.dataset.y12PreviewForm;
    let message="";
    if(kind==="vitals"){
     const names=[["systolic","الضغط الانقباضي","mmHg"],["diastolic","الضغط الانبساطي","mmHg"],["pulse","النبض","bpm"],["temperature","الحرارة","°C"],["spo2","الأكسجين","%"],["glucose","السكر","mg/dL"]];
     message="معاينة القياسات المدخلة:\n"+names.map(([key,label,u])=>label+": "+format(data.get(key),u)).join("\n")+"\n\nهذه القيم لم تُحفَظ ولم تُرسَل للطبيب. التفسير السريري مسؤولية الطبيب.";
    }else if(kind==="nursing-report"){
     const service=String(data.get("service")||"");
     const notes=String(data.get("notes")||"").trim();
     message="معاينة تقرير الزيارة:\nالخدمة: "+service+"\nالملاحظات: "+notes+"\n"+(data.get("medicalOrder")?"تم تحديد أن الأمر الطبي متاح للمراجعة.":"لم يتم تأكيد توفر أمر طبي في هذه المعاينة.")+"\n\nلم يتم رفع التقرير أو إرساله أو اعتماده؛ هذا عرض محلي فقط.";
    }else if(kind==="doctor-review"){
     const notes=String(data.get("doctorNotes")||"").trim();
     message="معاينة ملاحظات الطبيب:\n"+notes+"\n\nلم تُحفظ ملاحظات سريرية أو تعتمد تشخيصاً أو وصفة في النظام.";
    }else if(kind==="report-review"){
     const notes=String(data.get("reviewNotes")||"").trim();
     message="معاينة ملاحظات مراجعة الطبيب:\n"+notes+"\n\nلم يُعتمد التقرير أو تتغير حالته؛ لا يوجد Backend متصل.";
    }
    if(output){output.hidden=false;output.textContent=message;output.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"nearest"});}
   });
   for(const el of form.querySelectorAll("input,textarea,select"))el.addEventListener("input",()=>{if(output)output.hidden=true});
  }
 });
})();