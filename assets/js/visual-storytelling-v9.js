/* Yerani Visual Storytelling v9
   Progressive enhancement; no API, no persistence, no medical AI execution. */
(() => {
"use strict";
const ns = "http://www.w3.org/2000/svg";
const shapes = {
heart:'<path d="M21 8.5c0 5-9 11.5-9 11.5S3 13.5 3 8.5a5 5 0 0 1 9-3.1 5 5 0 0 1 9 3.1Z"/><path d="M4 12h4l2-3 3 6 2.5-3H20"/>',
doctor:'<path d="M6 3v5a6 6 0 0 0 12 0V3M3 3h6M15 3h6M12 14v1a5 5 0 0 0 10 0v-3"/><circle cx="22" cy="10" r="2"/>',
nurse:'<path d="m3 10 9-7 9 7v10H3V10ZM12 18s-4-2.2-4-5a2 2 0 0 1 4-1 2 2 0 0 1 4 1c0 2.8-4 5-4 5Z"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 15h3M8 18h7"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 21a7 7 0 0 1 14 0M18 11a3 3 0 0 0-2-6M18 15a6 6 0 0 1 4 6"/>',
lab:'<path d="M9 3h6M10 3v7l-5 8a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-8V3M7 16h10"/>',
file:'<path d="M6 3h9l5 5v13H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v6h6M8 13h8M8 17h8"/>',
clipboard:'<rect x="4" y="4" width="16" height="18" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="m8 12 2 2 4-4M8 18h8"/>',
pill:'<path d="M10.2 3.8a6 6 0 0 1 8.4 8.4l-6.4 6.4a6 6 0 0 1-8.4-8.4l6.4-6.4ZM8 7l9 9"/>',
home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10ZM9 21v-7h6v7"/>',
pulse:'<path d="M2 12h4l3-7 5 14 3-7h5"/>',
bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M10 21h4"/>',
spark:'<path d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z"/>',
settings:'<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.5-2.4 1A7 7 0 0 0 14 5l-.4-2H10l-.4 2a7 7 0 0 0-2.5 1.7l-2.4-1-2 3.5 2 1.6A7 7 0 0 0 4.6 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.5 2.4-1A7 7 0 0 0 9.6 19l.4 2h3.6l.4-2a7 7 0 0 0 2.5-1.7l2.4 1 2-3.5-2-1.6c.1-.4.1-.8.1-1.2Z"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
arrow:'<path d="m14 5-7 7 7 7M7 12h14"/>',
message:'<path d="M20 11.5a8.5 8.5 0 0 1-8.5 8.5H4l1.8-4A8.5 8.5 0 1 1 20 11.5Z"/><path d="M8 10h8M8 14h6"/>',
check:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
star:'<path d="m12 2 3 6.5 7 1-5 4.8 1.1 7-6.1-3.3-6.1 3.3 1.1-7-5-4.8 7-1L12 2Z"/>',
chart:'<path d="M4 21V3M4 21h17M8 16l4-5 4 2 4-8"/>',
shield:'<path d="M12 2 20 5v6c0 5-3 8.5-8 11-5-2.5-8-6-8-11V5l8-3Z"/><path d="m9 12 2 2 4-4"/>',
location:'<path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
layers:'<path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>'
};
function icon(name, cls="v9-icon") {
 const svg = document.createElementNS(ns,"svg");
 svg.setAttribute("viewBox","0 0 24 24");svg.setAttribute("fill","none");
 svg.setAttribute("stroke","currentColor");svg.setAttribute("stroke-width","1.8");
 svg.setAttribute("stroke-linecap","round");svg.setAttribute("stroke-linejoin","round");
 svg.setAttribute("class",cls);svg.setAttribute("aria-hidden","true");
 const use = document.createElementNS(ns,"use");use.setAttribute("href","#v9-"+(shapes[name]?name:"heart"));svg.appendChild(use);
 return svg;
}
function iconName(text){
 text=String(text||"");
 if(/طبيب|الأطباء|كشف|سرير/.test(text))return "doctor";
 if(/تمريض|زيارة منزلية|ممرض|الرعاية المنزلية/.test(text))return "nurse";
 if(/تحاليل|مختبر|فحص|نتائج/.test(text))return "lab";
 if(/وصف|دواء|الأدوية/.test(text))return "pill";
 if(/توجيه|أعراض|الذكاء|AI/.test(text))return "spark";
 if(/سجل|ملف|تقرير|توثيق/.test(text))return "file";
 if(/موعد|مواعيد|حجز|جدول/.test(text))return "calendar";
 if(/ضغط|نبض|علامات|حيوية|قياس/.test(text))return "pulse";
 if(/خطة|متابعة|تعليمات|مهام/.test(text))return "clipboard";
 if(/مستخدم|حساب|الملف الشخصي/.test(text))return "user";
 if(/مرضى|المرضى/.test(text))return "users";
 if(/إشعار|تنبيه/.test(text))return "bell";
 if(/شكوى|شكاوى|رسائل/.test(text))return "message";
 if(/إعدادات|صلاحيات/.test(text))return "settings";
 if(/تقييم|مراجعات/.test(text))return "star";
 if(/تخصص|خدمات/.test(text))return "layers";
 if(/إحصاء|إحصائيات|تقارير إدارية/.test(text))return "chart";
 if(/رعاية|العلاج|الصحة|التشخيص/.test(text))return "heart";
 return "file";
}
const route = {
 "patient/medical-record.html":["سجلك الصحي في مكان واحد","عرض التحاليل والوصفات وتقارير الزيارات","file",["السجل","التحاليل","العلاج"]],
 "patient/lab-results.html":["تحاليلك ونتائجك","ارفع الفحوصات وراجع النتائج المتاحة","lab",["طلب الفحص","رفع النتيجة","مراجعة الطبيب"]],
 "patient/prescriptions.html":["وصفات الطبيب","اطّلع على الأدوية والتعليمات المعتمدة","pill",["وصفة الطبيب","تعليمات الدواء","المتابعة"]],
 "patient/treatment-plan.html":["رحلة العلاج","تابع الخطة التي وضعها الطبيب","clipboard",["الخطة","التنفيذ","المتابعة"]],
 "patient/profile.html":["حسابك وملفك","بيانات الحساب والتنبيهات والإعدادات","user",null],
 "patient/ai-recommendation.html":["التخصص المناسب لك","أدخل الأعراض للحصول على اقتراح تخصص فقط","spark",["إدخال الأعراض","اقتراح تخصص","اختيار الطبيب"]],
 "doctor/patients.html":["ملفات المرضى","ابحث عن المريض وراجع متابعة حالته","users",["البحث","مراجعة الملف","المتابعة"]],
 "doctor/appointments.html":["مواعيد العيادة","استعرض الطلبات واختَر ملف الزيارة","calendar",["المواعيد","الملف الطبي","تقييم الطبيب"]],
 "doctor/patient-details.html":["التقييم السريري","راجع الملف وسجّل تقييمك وتعليماتك","doctor",["ملف المريض","تقييم الطبيب","الخطة العلاجية"]],
 "doctor/lab-requests.html":["طلبات التحاليل","اطلب الفحوصات اللازمة وراجع النتائج","lab",["طلب الفحص","نتيجة التحليل","قرار الطبيب"]],
 "doctor/prescriptions.html":["الوصفات الطبية","أنشئ الوصفة حسب التقييم الطبي","pill",["تقييم الحالة","الوصفة","التعليمات"]],
 "doctor/follow-up.html":["متابعة الحالات","راجع تقدم العلاج وتقارير الزيارات","pulse",["الخطة","المتابعة","إغلاق الحالة"]],
 "doctor/nursing-reports.html":["تقارير التمريض","راجع قراءات وتقارير الزيارات المنزلية","file",["تقرير الممرض","مراجعة الطبيب","المتابعة"]],
 "nurse/visits.html":["زياراتك المنزلية","اعرف تفاصيل الزيارة والخدمة المطلوبة","nurse",["تفاصيل الزيارة","تنفيذ الخدمة","رفع التقرير"]],
 "nurse/record-vitals.html":["تسجيل العلامات الحيوية","سجّل القراءات المطلوبة خلال الزيارة","pulse",["الزيارة","القياسات","التقرير"]],
 "nurse/care-execution.html":["تنفيذ الرعاية","طبّق التعليمات الطبية المعتمدة فقط","shield",["مراجعة التعليمات","تنفيذ الرعاية","التوثيق"]],
 "nurse/submit-report.html":["تقرير الزيارة","وثّق الرعاية وشارك التقرير مع الطبيب","clipboard",["إجراءات الزيارة","كتابة التقرير","مراجعة الطبيب"]],
 "nurse/history.html":["سجل الزيارات","اطّلع على الزيارات المنجزة وتقاريرها","clock",["الزيارات","التقارير","المتابعة"]]
};
const adminDescriptions={
 "patients.html":["إدارة المرضى","استعراض الحسابات والسجلات المسموح بها","users"],
 "doctors.html":["إدارة الأطباء","حسابات الأطباء وتخصصاتهم واعتمادهم","doctor"],
 "nurses.html":["إدارة الممرضين","حسابات الكادر التمريضي وتكليفاته","nurse"],
 "appointments.html":["إدارة المواعيد","متابعة حالة الطلبات والحجوزات","calendar"],
 "home-care.html":["الرعاية المنزلية","متابعة تشغيل الزيارات المنزلية","nurse"],
 "specialties.html":["التخصصات الطبية","تنظيم التخصصات المتاحة في المنصة","layers"],
 "reviews.html":["التقييمات والمراجعات","عرض ملاحظات المستفيدين وشكاواهم","star"],
 "notifications.html":["إدارة الإشعارات","متابعة التنبيهات التشغيلية","bell"],
 "reports.html":["التقارير التشغيلية","ملخصات تساعد في إدارة المنصة","chart"],
 "ai-audit.html":["التوجيه الذكي","متابعة طلبات التوجيه للتخصص، دون تشخيص","spark"],
 "settings.html":["إعدادات المنصة","الحسابات والصلاحيات والإعدادات العامة","settings"]
};
const path=location.pathname.replace(/\\/g,"/");
function getMobileRoute(){const m=path.match(/mobile\/(patient|doctor|nurse)\/([^/]+\.html)$/);return m?m[1]+"/"+m[2]:null;}
function createContext(title,description,symbol,steps){
 const section=document.createElement("section");section.className="v9-context";section.setAttribute("aria-label","تعريف الصفحة");
 const row=document.createElement("div");row.className="v9-context-row";
 const art=document.createElement("span");art.className="v9-context-art";art.appendChild(icon(symbol));
 const copy=document.createElement("div");const kicker=document.createElement("span");kicker.className="v9-context-kicker";kicker.textContent="يرعاني • واجهة الخدمة";
 const h=document.createElement("h1");h.textContent=title;
 const p=document.createElement("p");p.textContent=description;
 copy.append(kicker,h,p);row.append(art,copy);section.append(row);
 if(steps && steps.length){
   const label=document.createElement("span");label.className="v9-journey-label";label.textContent="مسار الخدمة";
   const list=document.createElement("div");list.className="v9-journey";list.setAttribute("aria-label","مراحل الخدمة التوضيحية");
   steps.forEach(step=>{const item=document.createElement("span");item.className="v9-journey-step";item.append(icon(iconName(step)),document.createTextNode(step));list.append(item);});
   section.append(label,list);
 }
 return section;
}
function embellishTitle(el, text){
 if(el.querySelector(".v9-section-icon"))return;
 const badge=document.createElement("span");badge.className="v9-section-icon";badge.appendChild(icon(iconName(text)));
 const soloEmoji=el.querySelector(":scope > span");
 if(soloEmoji && soloEmoji.textContent.trim().length<5 && !soloEmoji.querySelector("svg"))soloEmoji.remove();
 el.prepend(badge);
}
function enhanceMobile(){
 const key=getMobileRoute();if(!key)return;
 const main=document.querySelector(".mobile-content");if(!main)return;
 const config=route[key];
 if(config && !main.querySelector(".v9-context"))main.prepend(createContext(...config));
 main.querySelectorAll(".m-section-title").forEach(n=>embellishTitle(n,n.textContent));
 main.querySelectorAll(".m-card h3, .m-card h4").forEach(h=>{
   if(h.querySelector(".v9-icon"))return;
   // Preserve hierarchy without burdening every card with a tall decoration.
   if(!h.parentElement || h.closest(".m-card-primary"))return;
   h.classList.add("v9-semantic-heading");
 });
 main.querySelectorAll(".m-btn-primary, .m-btn-outline").forEach(btn=>{
   if(btn.querySelector("svg") || btn.classList.contains("v9-iconized"))return;
   const title=btn.textContent.trim();
   if(!title)return;
   btn.prepend(icon(iconName(title),"v9-icon v9-icon-sm"));btn.classList.add("v9-iconized");
 });
 // Emoji-only shortcut tiles use the same line icons as the rest of the product.
 main.querySelectorAll("a.m-card > span:first-child, .m-section-title > span").forEach(span=>{
   const value=span.textContent.trim();
   if(!span.querySelector("svg") && /^\p{Extended_Pictographic}[\uFE0F\u200D\p{Extended_Pictographic}]*$/u.test(value)){
     span.textContent="";span.appendChild(icon(iconName(span.parentElement.textContent),"v9-icon v9-icon-lg"));
   }
 });
 // Remove contradictory highlighted tab when page URL differs.
 document.querySelectorAll(".mobile-bottom-nav a").forEach(a=>{
    const target=a.getAttribute("href")?.split("?")[0],current=path.split("/").pop();
    if(target===current){a.classList.add("active");a.setAttribute("aria-current","page")}
    else {a.classList.remove("active");a.removeAttribute("aria-current")}
 });
 if(key==="doctor/patients.html")enhanceDoctorSearch(main);
 if(key==="nurse/visits.html")enhanceVisitFilter(main);
 // Prototype reminder replaces false success from inert demo-only actions.
 main.querySelectorAll('button[type="button"]').forEach(btn=>{
   if(btn.hasAttribute("data-v9-filter")||btn.hasAttribute("onclick")||btn.closest("[data-doctor-directory]"))return;
   btn.addEventListener("click",()=>demoToast(main));
 });
}
function normalize(v){return String(v||"").toLocaleLowerCase("ar").replace(/[أإآٱ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").trim();}
function demoToast(main){
 let note=main.querySelector(".v9-toast");
 if(!note){note=document.createElement("p");note.className="v9-status-note v9-toast";note.setAttribute("role","status");main.prepend(note);}
 note.textContent="هذا زر في نموذج تصميم تجريبي؛ تنفيذ العملية يحتاج ربطه بالنظام الفعلي.";
}
function enhanceDoctorSearch(main){
 const input=main.querySelector('input[placeholder*="ابحث باسم المريض"]');
 const chips=main.querySelector(".m-chip-bar");if(!input||!chips)return;
 const cards=[...main.querySelectorAll(":scope > .m-card")].filter(card=>!!card.querySelector("h4"));
 const statuses=cards.map(card=>{const t=card.textContent;return /مكتمل 100%/.test(t)?"completed":/متابعة قسطرة/.test(t)?"follow":"active";});
 chips.textContent="";
 const labels=[["all","الكل"],["active","نشطة"],["completed","مكتملة"],["follow","تحتاج متابعة"]];
 let active="all";
 const controls=labels.map(([key,label])=>{
   const btn=document.createElement("button");btn.type="button";btn.className="m-chip";
   btn.dataset.v9Filter=key;btn.textContent=label;btn.setAttribute("aria-pressed",String(key==="all"));chips.append(btn);
   btn.addEventListener("click",()=>{active=key;controls.forEach(b=>b.setAttribute("aria-pressed",String(b===btn)));filter();});return btn;
 });
 const empty=document.createElement("div");empty.className="v9-no-results";empty.setAttribute("role","status");empty.hidden=true;empty.append(icon("search"),document.createElement("p"));empty.lastElementChild.textContent="لا توجد ملفات مطابقة. جرّب بحثاً آخر.";
 cards[cards.length-1]?.after(empty);
 const filter=()=>{
  let count=0;
  cards.forEach((card,i)=>{const shown=(active==="all"||statuses[i]===active)&&normalize(card.textContent).includes(normalize(input.value));card.classList.toggle("v9-hidden",!shown);if(shown)count++;});
  empty.hidden=count>0;
 };
 input.addEventListener("input",filter);filter();
}
function enhanceVisitFilter(main){
 const bar=main.querySelector(".m-slot-btn.active")?.parentElement;
 if(!bar || !bar.parentElement?.classList.contains("m-card") && !bar.closest(".m-card"))return;
 const cards=[...main.querySelectorAll(":scope > .m-card")].filter(c=>c.querySelector("h4"));
 if(!cards.length)return;
 const current=bar.querySelectorAll(".m-slot-btn");
 if(current.length!==3)return;
 const status=cards.map(c=>/تمت الزيارة|تم إرسال التقرير/.test(c.textContent)?"completed":"upcoming");
 const values=[["all","الكل"],["upcoming","القادمة"],["completed","المكتملة"]];
 let selected="all";
 [...current].forEach((span,i)=>{
  const btn=document.createElement("button");btn.type="button";btn.dataset.v9Filter=values[i][0];
  btn.className="m-slot-btn"+(i===0?" active":"");btn.textContent=values[i][1];
  btn.setAttribute("aria-pressed",String(i===0));span.replaceWith(btn);
  btn.addEventListener("click",()=>{selected=values[i][0];bar.querySelectorAll("button").forEach(b=>{b.classList.toggle("active",b===btn);b.setAttribute("aria-pressed",String(b===btn))});render();});
 });
 const render=()=>cards.forEach((card,i)=>card.classList.toggle("v9-hidden",selected!=="all"&&status[i]!==selected));render();
}
function enhanceAdmin(){
 const main=document.querySelector(".admin-content");if(!main)return;
 const base=path.split("/").pop();const data=adminDescriptions[base];
 if(data && !main.querySelector(".v9-admin-identity")){
  const el=document.createElement("section");el.className="v9-admin-identity";
  const symbol=document.createElement("span");symbol.className="v9-context-art";symbol.appendChild(icon(data[2],"v9-icon v9-icon-xl"));
  const copy=document.createElement("div");const h=document.createElement("h1");h.textContent=data[0];
  const p=document.createElement("p");p.textContent=data[1];copy.append(h,p);el.append(symbol,copy);main.prepend(el);
 }
 main.querySelectorAll(".admin-card-title").forEach(h=>embellishTitle(h,h.textContent));
 // Accessible cues for demonstrated metrics.
 main.querySelectorAll(".admin-stat-card").forEach(card=>{card.setAttribute("aria-label","بطاقة مؤشرات نموذجية — "+card.textContent.trim().replace(/\s+/g," ").slice(0,80));});
}
function init(){
 if(!document.body?.classList.contains("yr-v9"))return;
 const sprite=document.createElementNS(ns,"svg");sprite.setAttribute("aria-hidden","true");sprite.setAttribute("focusable","false");sprite.setAttribute("width","0");sprite.setAttribute("height","0");sprite.style.cssText="position:absolute;overflow:hidden";
 sprite.innerHTML=Object.entries(shapes).map(([name,body])=>'<symbol id="v9-'+name+'" viewBox="0 0 24 24">'+body+'</symbol>').join("");
 document.body.prepend(sprite);
 enhanceMobile();if(document.body.classList.contains("admin-body"))enhanceAdmin();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
