/* Yerani V18 nursing marketplace. ALL profiles, sample prices, time slots and conversations are mock UI data.
   No API, persistence, real approval, payment, booking, secure messaging or patient records. */
(()=>{"use strict";
 const providers={
  "n01":{name:"الممرضة مريم (نموذج)",care:"العلامات الحيوية",location:"خدمة منزلية ضمن المدينة",price:6000,description:"قياس وتوثيق العلامات الحيوية والمتابعة التمريضية ضمن صلاحيات المهنة."},
  "n02":{name:"الممرض سامي (نموذج)",care:"متابعة كبار السن",location:"خدمة منزلية ضمن المدينة",price:7500,description:"متابعة الرعاية اليومية وملاحظة المؤشرات وإعداد تقرير تمريضي."},
  "n03":{name:"الممرضة هدى (نموذج)",care:"الرعاية المنزلية",location:"خدمة منزلية ضمن المدينة",price:9000,description:"رعاية تمريضية منزلية وفق خطة الخدمة والتعليمات الطبية المعتمدة عند الحاجة."}
 };
 const get=id=>document.getElementById(id), query=new URLSearchParams(location.search), key=Object.prototype.hasOwnProperty.call(providers,query.get("nurse"))?query.get("nurse"):"n01",p=providers[key];
 const money=num=>new Intl.NumberFormat("ar-YE").format(num)+" ر.ي";
 document.querySelectorAll("[data-provider-name]").forEach(x=>x.textContent=p.name);
 document.querySelectorAll("[data-provider-care]").forEach(x=>x.textContent=p.care);
 document.querySelectorAll("[data-provider-location]").forEach(x=>x.textContent=p.location);
 document.querySelectorAll("[data-provider-description]").forEach(x=>x.textContent=p.description);
 document.querySelectorAll("[data-provider-price]").forEach(x=>x.textContent=money(p.price));
 for(const a of document.querySelectorAll("[data-nurse-url]")){
   const name=a.dataset.nurseUrl;a.href=name+".html?nurse="+encodeURIComponent(key);
 }
 const listing=get("nh-provider-list"),search=get("nh-search-input"),summary=get("nh-match-count");
 if(listing){
  let filter="all";const cards=[...listing.querySelectorAll("[data-nurse-card]")];
  const rerender=()=>{
    const term=(search?.value||"").trim().toLocaleLowerCase("ar");let visible=0;
    cards.forEach(card=>{const id=card.dataset.nurseCard,data=providers[id];const match=(!term||((data.name+" "+data.care+" "+data.location).toLocaleLowerCase("ar").includes(term)))&&(filter==="all"||card.dataset.category===filter);card.hidden=!match;if(match)visible++;});
    if(summary)summary.textContent=visible+" ملفات نموذجية";
    const empty=get("nh-no-matches");if(empty)empty.hidden=visible!==0;
  };
  document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.setAttribute("aria-pressed",String(b===x)));rerender()}));
  search?.addEventListener("input",rerender);rerender();
 }
 const booking=get("nh-booking");
 if(booking){
  const date=booking.elements.namedItem("visitDate"),time=booking.elements.namedItem("visitTime"),service=booking.elements.namedItem("service");
  const today=new Date();const localDate=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
  if(date){date.min=localDate;date.max=new Date(today.getTime()-today.getTimezoneOffset()*60000+1000*60*60*24*60).toISOString().slice(0,10);}
  const result=get("nh-booking-result"),price=get("nh-booking-total");
  if(price)price.textContent=money(p.price);
  booking.addEventListener("submit",ev=>{
   ev.preventDefault();if(result)result.hidden=true;
   if(!booking.reportValidity())return;
   if(!date?.value||date.value<localDate){date?.focus();return;}
   const serviceLabel=service?.selectedOptions[0]?.textContent||"",timeLabel=time?.selectedOptions[0]?.textContent||"";
   if(result){result.hidden=false;result.textContent="معاينة طلب زيارة تمريضية (غير مرسل)\nمقدم الرعاية: "+p.name+"\nالخدمة: "+serviceLabel+"\nالتاريخ: "+date.value+"\nالوقت: "+timeLabel+"\nسعر توضيحي للزيارة: "+money(p.price)+"\n\nلم يُنشأ حجز، ولم يُحجز موعد أو يُؤكد السعر أو تُحصّل رسوم. يجب اعتماد الأسعار والتوافر والتحقق من هوية مقدم الخدمة عبر الخادم قبل التشغيل الفعلي.";}
  });
  booking.querySelectorAll("input,select,textarea").forEach(x=>x.addEventListener("change",()=>{if(result)result.hidden=true}));
 }
 const composer=get("nh-chat-form"),thread=get("nh-thread"),sent=get("nh-chat-note");
 if(composer&&thread){
  composer.addEventListener("submit",ev=>{
   ev.preventDefault();const input=composer.elements.namedItem("message");
   const message=input?.value.trim()||"";if(message.length<2){input?.focus();return;}
   const bubble=document.createElement("div");bubble.className="nh-msg";const content=document.createElement("span");content.textContent=message;const label=document.createElement("small");label.textContent="معاينة محلية فقط — لم تُرسل";bubble.append(content,label);thread.appendChild(bubble);input.value="";
   if(sent){sent.hidden=false;sent.textContent="ظهرت رسالتك في نموذج المحادثة داخل هذه الشاشة فقط، ولم تصل إلى الممرض أو المريض الآخر. لا توجد محادثة حقيقية أو حفظ للرسائل.";}
   bubble.scrollIntoView({block:"nearest"});
  });
 }
})();