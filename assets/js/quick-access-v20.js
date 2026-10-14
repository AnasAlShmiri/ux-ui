/* Yerani v20: UI preview only; no real phone numbers, messages or ratings. */
(()=>{"use strict";
const doctorRatings={"1":"4.9","2":"4.8","3":"4.7","4":"4.9"},nurseRatings={"n01":"4.8","n02":"4.7","n03":"4.9"};
/* No contact numbers were provided. Use verified, consented numbers ONLY.
   Production must resolve authorized contacts via its secured backend. */
const verifiedContacts={doctor:{},nurse:{},patient:{}};
const query=new URLSearchParams(location.search);
const doctor=Object.prototype.hasOwnProperty.call(doctorRatings,query.get("doctor"))?query.get("doctor"):"1";
const nurse=Object.prototype.hasOwnProperty.call(nurseRatings,query.get("nurse"))?query.get("nurse"):"n01";
const messages={doctor:"مرحباً، أود الاستفسار عن موعد طبي في يرعاني.",nurse:"مرحباً، أود الاستفسار عن خدمة تمريض منزلي في يرعاني.",patient:"مرحباً، أود التنسيق بخصوص موعد خدمة يرعاني."};
document.querySelectorAll("[data-wa-role]").forEach(link=>{
 const role=link.dataset.waRole;if(!Object.prototype.hasOwnProperty.call(messages,role))return;
 const id=link.dataset.waId||(role==="doctor"?doctor:role==="nurse"?nurse:"");
 const value=String(verifiedContacts[role][id]||"");
 const phone=/^\d{8,15}$/.test(value)?value:null;
 const txt=encodeURIComponent(messages[role]);
 link.href=phone?"https://wa.me/"+phone+"?text="+txt:"https://api.whatsapp.com/send?text="+txt;
 link.target="_blank";link.rel="noopener noreferrer";
 if(!phone)link.title="واتساب: اختر جهة الاتصال بنفسك؛ لا يوجد رقم موثّق";
});
document.querySelectorAll("[data-doctor-rating]").forEach(el=>el.textContent=doctorRatings[doctor]);
document.querySelectorAll("[data-nurse-rating]").forEach(el=>el.textContent=nurseRatings[nurse]);
const booking=document.getElementById("nh-booking");
if(booking){
 const defaults={"n01":"vitals","n02":"followup","n03":"care"};
 const q=query.get("service"),service=["vitals","followup","care"].includes(q)?q:defaults[nurse];
 const select=booking.elements.namedItem("service");
 if(select&&Array.from(select.options).some(o=>o.value===service))select.value=service;
}
document.querySelectorAll("[data-rate-form]").forEach(form=>form.addEventListener("submit",event=>{
 event.preventDefault();const selected=form.querySelector('input[type="radio"]:checked');
 const note=form.querySelector(".q20-rate-output");if(!note)return;
 note.hidden=false;note.textContent=selected?"معاينة التقييم: "+selected.value+" من 5 نجوم. لم يُحفظ ولم يُرسل.":"اختر عدد النجوم أولاً.";
}));
})();