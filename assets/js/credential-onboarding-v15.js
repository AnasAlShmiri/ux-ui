/* Yerani medical-staff onboarding V15.
 * UX PROTOTYPE ONLY. Never sends/saves private information or uploads documents.
 * There is no real credential verification, admin authentication, or decision persistence.
 */
(()=>{
"use strict";
const whenReady=fn=>document.readyState==="loading"?document.addEventListener("DOMContentLoaded",fn):fn();
const maxBytes=5*1024*1024;
const fileOkay=file=>{
 if(!file)return false;
 const validType=["application/pdf","image/jpeg","image/png"].includes(file.type)||/\.(pdf|jpg|jpeg|png)$/i.test(file.name);
 return validType&&file.size<=maxBytes;
};
whenReady(()=>{
 document.querySelectorAll("[data-cv-file]").forEach(wrapper=>{
   const input=wrapper.querySelector("input[type=file]"),display=wrapper.querySelector("[data-cv-file-name]");
   if(!input||!display)return;
   const draw=()=>{
      const file=input.files?.[0];
      if(!file){display.textContent="PDF أو صورة — حتى 5MB";display.classList.remove("cv-ok");return;}
      if(!fileOkay(file)){display.textContent="ملف غير مدعوم أو يتجاوز 5MB. اختر PDF أو JPG أو PNG.";display.classList.remove("cv-ok");input.setCustomValidity("اختر ملفاً مدعوماً بحجم لا يتجاوز 5 ميجابايت");}
      else{input.setCustomValidity("");display.textContent="تم اختيار: "+file.name;display.classList.add("cv-ok");}
   };
   input.addEventListener("change",()=>{input.setCustomValidity("");draw()});
   draw();
 });
 document.querySelectorAll("[data-cv-registration]").forEach(form=>{
   const out=form.querySelector("[data-cv-output]");
   form.addEventListener("submit",ev=>{
     ev.preventDefault();if(out)out.hidden=true;
     const pass=form.querySelector("[name=password]"),confirm=form.querySelector("[name=confirmPassword]");
     if(pass&&confirm){confirm.setCustomValidity(pass.value===confirm.value?"":"كلمتا المرور غير متطابقتين");}
     const files=[...form.querySelectorAll("input[type=file]")];
     for(const f of files){if(f.files?.length&&!fileOkay(f.files[0]))f.setCustomValidity("الملف يجب أن يكون PDF أو JPG أو PNG بحجم لا يزيد عن 5 ميجابايت");}
     if(!form.reportValidity())return;
     const kind=form.dataset.cvRegistration==="doctor"?"الطبيب":"الممرض";
     const name=form.elements.namedItem("fullName")?.value?.trim()||"";
     const specialty=form.elements.namedItem("specialty")?.value||form.elements.namedItem("qualification")?.value||"";
     if(out){out.hidden=false;out.textContent="اكتملت معاينة نموذج "+kind+" محلياً.\nالاسم المكتوب: "+name+"\nالمجال: "+specialty+"\nالمستندات المختارة: "+files.filter(f=>f.files?.length).length+" ملفات.\n\nلم يُنشأ حساب، ولم تُرفع الوثائق، ولم يُرسل طلب للمراجعة. عند ربط المنصة بخادم آمن ستُنشأ الطلبات بعد موافقة المستخدم.";}
   });
   const pass=form.querySelector("[name=password]"),confirm=form.querySelector("[name=confirmPassword]");
   [pass,confirm].forEach(el=>el?.addEventListener("input",()=>confirm?.setCustomValidity("")));
   form.querySelectorAll("input,select,textarea").forEach(el=>el.addEventListener("input",()=>{if(out)out.hidden=true}));
 });
 const admin=document.querySelector("[data-cv-admin]");
 if(admin){
   const requests=[
    {id:"STAFF-DEMO-01",role:"doctor",roleAr:"طبيب",name:"طلب طبيب تجريبي 01",specialty:"الطب الباطني",license:"LIC-DEMO-017",validity:"تاريخ انتهاء نموذجي",state:"pending",docs:["هوية (بيانات توضيحية)","شهادة تخصص (مثال)","ترخيص مزاولة (مثال)"]},
    {id:"STAFF-DEMO-02",role:"nurse",roleAr:"ممرض",name:"طلب تمريض تجريبي 02",specialty:"تمريض عام",license:"LIC-DEMO-028",validity:"تاريخ انتهاء نموذجي",state:"pending",docs:["هوية (بيانات توضيحية)","مؤهل علمي (مثال)","ترخيص مزاولة (مثال)"]},
    {id:"STAFF-DEMO-03",role:"doctor",roleAr:"طبيب",name:"طلب طبيب تجريبي 03",specialty:"طب الأسرة",license:"LIC-DEMO-039",validity:"تاريخ انتهاء نموذجي",state:"more",docs:["هوية (مثال)","شهادة (مثال)","ترخيص (مثال)"]}
   ];
   const statusName={pending:"بانتظار المراجعة",approved:"معتمد (محاكاة)",rejected:"مرفوض (محاكاة)",more:"يحتاج استكمال (محاكاة)"};
   const queue=admin.querySelector("[data-cv-queue]"),detail=admin.querySelector("[data-cv-detail]"),stats=admin.querySelectorAll("[data-cv-count]");
   const output=admin.querySelector("[data-cv-admin-output]");
   let selected=requests[0];
   function showDetail(item){
     selected=item;
     if(output)output.hidden=true;
     admin.querySelectorAll("[data-cv-select]").forEach(btn=>btn.setAttribute("aria-pressed",String(btn.dataset.cvSelect===item.id)));
     const text=(sel,val)=>{const el=detail.querySelector(sel);if(el)el.textContent=val};
     text("[data-cv-d-name]",item.name);text("[data-cv-d-role]",item.roleAr);
     text("[data-cv-d-specialty]",item.specialty);text("[data-cv-d-license]",item.license);
     text("[data-cv-d-state]",statusName[item.state]);text("[data-cv-d-expiry]",item.validity);
     const box=detail.querySelector("[data-cv-doc-list]");if(box){
       box.replaceChildren();
       for(const name of item.docs){const line=document.createElement("div");line.className="cv-doc";line.textContent="▤  "+name+" — نموذج غير قابل للفتح";box.appendChild(line)}
     }
   }
   const redraw=()=>{
     queue.replaceChildren();
     for(const item of requests){
       const b=document.createElement("button");b.type="button";b.className="cv-queue";
       b.dataset.cvSelect=item.id;b.setAttribute("aria-pressed",String(item.id===selected.id));
       const symbol=document.createElement("span");symbol.className="cv-queue-icon";symbol.textContent=item.role==="doctor"?"✚":"♡";
       const info=document.createElement("span");info.className="cv-queue-info";const strong=document.createElement("strong");strong.textContent=item.name;const small=document.createElement("span");small.textContent=item.roleAr+" · "+statusName[item.state];info.append(strong,small);b.append(symbol,info);
       b.addEventListener("click",()=>showDetail(item));queue.append(b);
     }
     stats.forEach(el=>{const key=el.dataset.cvCount;el.textContent=String(key==="total"?requests.length:requests.filter(x=>x.state===key).length)});
     showDetail(selected);
   };
   admin.querySelectorAll("[data-decision]").forEach(button=>button.addEventListener("click",()=>{
     const decision=button.dataset.decision;
     const note=admin.querySelector("[data-cv-review-note]")?.value.trim()||"";
     if((decision==="rejected"||decision==="more")&&note.length<8){
       const n=admin.querySelector("[data-cv-review-note]");n?.focus();if(output){output.hidden=false;output.textContent="اكتب سبباً واضحاً لا يقل عن 8 أحرف لقرار الرفض أو طلب الاستكمال."; }return;
     }
     selected.state=decision;redraw();
     if(output){output.hidden=false;output.textContent="معاينة قرار: "+statusName[decision]+" للطلب "+selected.id+". "+(note?"الملاحظة: "+note+". ":"")+"هذا التغيير محلي داخل صفحة الإدارة فقط؛ لم يتم اعتماد كادر طبي، ولم يُخزَّن أو يُرسل قرار.";}
   }));
   redraw();
 }
});
})();