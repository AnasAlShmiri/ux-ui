/* Yerani graduation defense showroom V17
 * Local iframe tour only. No account impersonation, clinical decisions or server calls.
 * Keyboard shortcuts activate only when focus is in the scene selector or step rail.
 */
(()=>{
"use strict";
const scenes=[
 {role:"المريض",title:"البداية — الرعاية من هاتف المريض",url:"patient/home.html",lead:"واجهة رئيسية تجمع أهم الخدمات وتبدأ بتوجيه الأعراض نحو التخصص المناسب.",focus:"وضح كيف يجد المريض الإجراء المطلوب دون قوائم معقدة."},
 {role:"المريض",title:"مساعد الأعراض — اقتراح التخصص",url:"patient/ai-recommendation.html",lead:"إدخال الأعراض بهدف اقتراح التخصص الطبي الملائم، وليس تشخيص المرض أو وصف علاج.",focus:"أكد للجنة أن الذكاء الاصطناعي لا يحل محل الطبيب."},
 {role:"المريض",title:"استعراض الأطباء",url:"patient/doctors.html",lead:"يتنقل المريض بين الأطباء والتخصصات للوصول إلى الطبيب المناسب.",focus:"اعرض كيف تدعم البطاقات والأيقونات اتخاذ القرار."},
 {role:"المريض",title:"تفاصيل الطبيب والحجز",url:"patient/doctor-details.html",lead:"من صفحة الطبيب يصل المريض إلى تفاصيل الحجز والمعلومات المهمة قبل اختيار الموعد.",focus:"الحجز الظاهر نموذج واجهة وليس موعداً منشأً فعلياً."},
 {role:"المريض",title:"مواعيد المريض",url:"patient/appointments.html",lead:"يعرض النظام المواعيد النموذجية وحالتها ببطاقات سهلة القراءة.",focus:"لاحظ اتساق حالات الموعد والأوقات والأزرار."},
 {role:"الطبيب",title:"جدول عمل الطبيب",url:"doctor/appointments.html",lead:"يراجع الطبيب المواعيد وفق الحالة ويتجه إلى ملف المريض والتقييم.",focus:"جرّب تبويبات اليوم والقادمة والمكتملة؛ لا تتطلب اتصالاً بالخادم."},
 {role:"الطبيب",title:"مراجعة الملف الطبي",url:"doctor/patient-details.html",lead:"ملخص بصري لمعلومات الحالة والفحوصات وتقارير التمريض قبل التقييم السريري.",focus:"التشخيص وقرار العلاج من اختصاص الطبيب."},
 {role:"المريض",title:"السجل الطبي الإلكتروني",url:"patient/medical-record.html",lead:"واجهة موحدة للفحوصات والوصفات وتقارير الزيارات والأحداث الصحية.",focus:"اعرض تسلسل الأحداث وطريقة انتقال المريض بين أقسام السجل."},
 {role:"المريض",title:"التحاليل والفحوصات",url:"patient/lab-results.html",lead:"نتائج فحوصات نموذجية واختيار ملف نتيجة للمعاينة المحلية.",focus:"اختيار الملف لا يعني رفعه أو إرساله إلى الطبيب."},
 {role:"المريض",title:"الوصفات والخطة العلاجية",url:"patient/treatment-plan.html",lead:"يتابع المريض التعليمات والتقييمات التي يحددها الطبيب.",focus:"محتوى الخطة توضيحي ولا يتضمن وصفات علاجية حقيقية."},
 {role:"المريض",title:"خدمات التمريض المنزلي",url:"patient/nursing.html",lead:"تظهر أنواع الرعاية المنزلية وخطوات طلب الخدمة بشكل مترابط.",focus:"أبرز الخدمات التي تتطلب أمراً طبياً صالحاً."},
 {role:"الممرض",title:"جدول الزيارات المنزلية",url:"nurse/visits.html",lead:"يتابع الممرض مهام الزيارات وحالتها ثم ينتقل إلى القياسات والتقرير.",focus:"الممرض يوثق الرعاية ولا يصدر تشخيصاً."},
 {role:"الممرض",title:"تسجيل العلامات الحيوية",url:"nurse/record-vitals.html",lead:"مدخلات واضحة للضغط والنبض والحرارة والأكسجين، مع معاينة محلية.",focus:"جرّب التحقق من الحقول دون استخدام معلومات مرضى حقيقية."},
 {role:"الممرض",title:"تقرير الزيارة",url:"nurse/submit-report.html",lead:"يوثق الممرض نوع الخدمة والإجراءات والملاحظات لمراجعة الطبيب لاحقاً.",focus:"لا يحدث إرسال أو اعتماد حقيقي للتقرير في النسخة الحالية."},
 {role:"المريض",title:"متابعة الحساب والإشعارات",url:"patient/profile.html",lead:"ترتيب الإشعارات والسجل والوصول السريع إلى الخدمات الأساسية.",focus:"اضغط تحديد الإشعارات كمقروءة؛ التغيير داخل الصفحة فقط."},
 {role:"حسابات المنصة",title:"الدخول وإنشاء الحساب",url:"auth/login.html",lead:"مسار مصادقة بصري نظيف، دون أزرار دخول مباشر تتجاوز التحقق.",focus:"هذا النموذج لا يتحقق من كلمة المرور عبر Backend."},
 {role:"حسابات المنصة",title:"انضمام الطبيب والممرض",url:"auth/medical-join.html",lead:"اختيار نوع الكادر ثم إرفاق المستندات المهنية لطلب المراجعة.",focus:"التسجيل المهني مستقل عن تسجيل المريض ويستلزم اعتماداً."},
 {role:"حسابات المنصة",title:"بيانات وترخيص الطبيب",url:"auth/doctor-register.html",lead:"البيانات المهنية والتخصص وتاريخ الترخيص واختيار الوثائق المطلوبة.",focus:"رفع المستندات غير مفعل؛ لا تختبر باستخدام هويات حقيقية."},
 {role:"حسابات المنصة",title:"بيانات وترخيص الممرض",url:"auth/nurse-register.html",lead:"مؤهل التمريض ورقم المزاولة والمستندات في مسار مستقل.",focus:"المراجعة والاعتماد الفعلي يحتاجان مسؤولاً مخولاً وخادماً آمناً."},
 {role:"حسابات المنصة",title:"متابعة طلب الاعتماد",url:"auth/credential-status.html",lead:"يفهم مقدم الخدمة حالات الطلب: قيد المراجعة أو معتمد أو مرفوض أو يحتاج استكمال.",focus:"هذه حالات توضيحية؛ عرضها لا يعني صدور قرار حقيقي."}
];
const get=(id)=>document.getElementById(id);
const frame=get("live-screen"),prev=get("scene-prev"),next=get("scene-next"),rail=get("scene-rail");
if(!frame||!rail)return;
const sceneTitle=get("scene-title"),sceneLead=get("scene-lead"),sceneFocus=get("scene-focus"),sceneRole=get("scene-role"),sceneCount=get("scene-count"),sceneProgress=get("scene-progress"),link=get("scene-open"),phoneLabel=get("phone-label"),status=get("display-status");
let current=0;let lastPath="";
const buttons=scenes.map((scene,i)=>{
 const b=document.createElement("button");b.type="button";b.className="step-pill";b.setAttribute("aria-label","الخطوة "+(i+1)+": "+scene.title);b.innerHTML="<b>"+(i+1)+"</b><span></span>";
 b.querySelector("span").textContent=scene.title;
 b.addEventListener("click",()=>go(i));
 rail.appendChild(b);
 return b;
});
const go=(index)=>{
 if(!Number.isInteger(index)||index<0||index>=scenes.length)return;
 current=index;const scene=scenes[index];
 sceneTitle.textContent=scene.title;sceneLead.textContent=scene.lead;sceneFocus.textContent=scene.focus;
 sceneRole.textContent=scene.role;sceneCount.textContent="الخطوة "+(index+1)+" من "+scenes.length;
 if(lastPath!==scene.url){frame.src=scene.url;frame.title="معاينة شاشة "+scene.title;lastPath=scene.url;}
 link.href=scene.url;link.setAttribute("aria-label","فتح شاشة "+scene.title+" في صفحة مستقلة");
 phoneLabel.textContent=scene.role+" — شاشة تفاعلية";
 prev.disabled=index===0;next.disabled=index===scenes.length-1;
 sceneProgress.style.width=((index+1)/scenes.length*100)+"%";
 buttons.forEach((b,i)=>{if(i===index){b.setAttribute("aria-current","step")}else{b.removeAttribute("aria-current")}});
 buttons[index].scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",inline:"center",block:"nearest"});
 status.textContent="الخطوة الحالية: "+scene.title;
};
prev?.addEventListener("click",()=>go(current-1));
next?.addEventListener("click",()=>go(current+1));
get("scene-first")?.addEventListener("click",()=>go(0));
get("defense-fullscreen")?.addEventListener("click",async()=>{
 try{
  if(document.fullscreenElement){await document.exitFullscreen();}
  else if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen();}
  else{status.textContent="المتصفح الحالي لا يدعم عرض ملء الشاشة";}
 }catch(_){status.textContent="تعذر تفعيل ملء الشاشة؛ يمكن عرض الصفحة بشكل طبيعي.";}
});
document.addEventListener("fullscreenchange",()=>{
 const text=get("fullscreen-label");if(text)text.textContent=document.fullscreenElement?"الخروج من ملء الشاشة":"ملء الشاشة";
});
rail.addEventListener("keydown",event=>{
 const b=event.target.closest("button.step-pill");if(!b)return;
 if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
 event.preventDefault();const i=buttons.indexOf(b);
 const to=event.key==="Home"?0:event.key==="End"?scenes.length-1:event.key==="ArrowLeft"?(i+1)%scenes.length:(i-1+scenes.length)%scenes.length;
 go(to);buttons[to].focus();
});
get("skip-credentials")?.addEventListener("click",()=>go(16));
get("skip-nursing")?.addEventListener("click",()=>go(10));
get("skip-doctor")?.addEventListener("click",()=>go(5));
get("skip-patient")?.addEventListener("click",()=>go(0));
go(0);
})();