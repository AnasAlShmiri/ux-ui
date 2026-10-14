/* Yuraani V21: independently designed, interactive UX prototype. No API, authorization, storage or actual bookings. */
(()=>{"use strict";
const services=[
{id:"vitals",name:"قياس العلامات الحيوية",desc:"متابعة الضغط والنبض والحرارة",icon:"♡",price:6000},
{id:"elder",name:"رعاية كبار السن",desc:"مساندة تمريضية ومتابعة منزلية",icon:"♧",price:7500},
{id:"postop",name:"متابعة ما بعد العمليات",desc:"رعاية وفق تكليف وتعليمات طبية",icon:"✚",price:9000},
{id:"nursing",name:"متابعة تمريضية",desc:"زيارات متابعة وخطة رعاية منزلية",icon:"⌂",price:7000}
];
const providers=[
{id:"d1",role:"doctor",name:"د. عبدالله الحربي",short:"ع",specialty:"أمراض القلب",rating:"4.9",experience:"14 سنة",fee:8000,services:["consult"]},
{id:"d2",role:"doctor",name:"د. مها السليمان",short:"م",specialty:"الباطنية والسكري",rating:"4.8",experience:"11 سنة",fee:7000,services:["consult"]},
{id:"d3",role:"doctor",name:"د. خالد الغامدي",short:"خ",specialty:"طب الأسرة",rating:"4.7",experience:"9 سنوات",fee:6000,services:["consult"]},
{id:"n1",role:"nurse",name:"الممرضة مريم",short:"م",specialty:"قياس العلامات الحيوية",rating:"4.8",experience:"7 سنوات",fee:6000,services:["vitals","nursing"]},
{id:"n2",role:"nurse",name:"الممرض سامي",short:"س",specialty:"رعاية كبار السن",rating:"4.7",experience:"6 سنوات",fee:7500,services:["elder","nursing"]},
{id:"n3",role:"nurse",name:"الممرضة هدى",short:"هـ",specialty:"الرعاية بعد العمليات",rating:"4.9",experience:"8 سنوات",fee:9000,services:["postop","vitals"]}
];
const roleNames={patient:"المريض",doctor:"الطبيب",nurse:"الممرض",admin:"الإدارة"};
const rolePages={
patient:[["home","⌂","الرئيسية"],["doctors","⚕","الأطباء"],["services","♡","التمريض"],["appointments","▦","مواعيدي"],["record","▤","ملفي"]],
doctor:[["workspace","⌂","الرئيسية"],["case","▤","ملف المريض"],["appointments","▦","المواعيد"],["account","♙","حسابي"]],
nurse:[["workspace","⌂","الرئيسية"],["case","▤","ملف المريض"],["appointments","▦","الزيارات"],["account","♙","حسابي"]],
admin:[["workspace","⌂","الرئيسية"],["approvals","✓","الاعتماد"],["catalog","▦","الخدمات"],["issues","☷","الشكاوى"],["account","♙","حسابي"]]
};
const today=()=>{const d=new Date(),o=d.getTimezoneOffset();return new Date(d.getTime()-o*60000).toISOString().slice(0,10)};
const state={role:"patient",view:"home",filter:"all",search:"",selectedService:null,notifications:["تذكير تجريبي: راجع موعدك القادم من صفحة مواعيدي."],modal:null,ratings:{},complaints:[{id:"C-01",kind:"شكوى",text:"نموذج: تأخر في الرد على طلب زيارة",status:"جديد"}],professionalApplications:[{id:"A-01",name:"طبيب تجريبي",kind:"طبيب",status:"قيد المراجعة"},{id:"A-02",name:"ممرض تجريبي",kind:"ممرض",status:"قيد المراجعة"}],record:{
profile:{name:"مريض تجريبي",age:"بيانات توضيحية",blood:"O+ (مثال)",allergies:"غير موثقة في النموذج",history:"متابعة قلبية افتراضية"},
diagnosis:"متابعة دورية (مثال تعليمي — ليس تشخيصًا حقيقيًا)",
instructions:"متابعة العلامات الحيوية ورفع تقرير الزيارة للطبيب، وفق خطة الرعاية المعتمدة (مثال).",
prescription:"وصفة نموذجية غير قابلة للاستخدام العلاجي",
labs:["تحليل دم — ملف توضيحي"],nurseTasks:["تقرير تمريض توضيحي: قياس الضغط والنبض ورفع الملاحظات."],vitals:["ضغط 124/82، نبض 74 — مثال افتراضي"],timeline:["متابعة الطبيب وإضافة التعليمات","زيارة الممرض وتوثيق المؤشرات","رفع نتيجة فحص تجريبية"]
},
bookings:[
{id:"YR-101",type:"doctor",pid:"d1",service:"consult",date:"2026-10-10",time:"10:00",area:"العيادة — بيانات توضيحية",status:"completed"},
{id:"YR-102",type:"nurse",pid:"n1",service:"vitals",date:"2026-10-11",time:"11:00",area:"عنوان توضيحي",status:"completed"}
]};
const $=id=>document.getElementById(id);
const escapeHTML=value=>String(value==null?"":value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const en=escapeHTML;
const money=n=>new Intl.NumberFormat("ar-YE").format(n)+" ر.ي";
const service=id=>services.find(x=>x.id===id);
const provider=id=>providers.find(x=>x.id===id);
const card=(title,content,cls="")=>'<section class="white-panel '+cls+'"><h3 class="card-title">'+title+'</h3>'+content+'</section>';
const btn=(action,label,cls="btn",extra="")=>'<button type="button" class="'+cls+'" data-action="'+action+'" '+extra+'>'+label+'</button>';
const row=(label,value)=>'<div class="info-row"><span>'+label+'</span><strong>'+value+'</strong></div>';
const head=(label,title,desc,right="")=>'<div class="page-head"><div><span class="eyebrow">'+label+'</span><h1>'+title+'</h1><p>'+desc+'</p></div>'+right+'</div>';
const statusLabel={pending:"بانتظار القبول",confirmed:"مؤكد تجريبيًا",completed:"مكتمل",cancelled:"ملغى"};
function status(s){return '<span class="status-chip '+en(s)+'">'+(statusLabel[s]||en(s))+'</span>'}
function notice(message){return '<div class="notice-box">'+message+'</div>'}
function quick(href,icon,title,sub){return '<button class="quick-card" type="button" data-action="goto" data-view="'+href+'"><span class="quick-icon">'+icon+'</span><strong>'+title+'</strong><span>'+sub+'</span></button>'}
function notify(msg){state.notifications.unshift(msg);renderRoles();renderNav();toast(msg)}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),3500)}
function goto(view){state.view=view;state.search="";state.filter="all";render();window.scrollTo({top:0,behavior:"smooth"})}
function setRole(role){if(!roleNames[role])return;state.role=role;state.view=role==="patient"?"home":"workspace";state.search="";state.filter="all";render();window.scrollTo(0,0)}
function renderRoles(){ $("roles").innerHTML=Object.keys(roleNames).map(key=>'<button class="role-pill '+(key===state.role?"is-active":"")+'" data-action="role" data-role="'+key+'" aria-pressed="'+(key===state.role)+'">'+roleNames[key]+'</button>').join("");const dot=$("notifyDot");dot.style.display=state.notifications.length?"block":"none"}
function renderNav(){const nav=$("bottomNav");nav.innerHTML=rolePages[state.role].map(([view,icon,label])=>'<button class="nav-item '+(state.view===view?"active":"")+'" data-action="goto" data-view="'+view+'" '+(state.view===view?'aria-current="page"':"")+'><span aria-hidden="true">'+icon+'</span><span>'+label+'</span></button>').join("")}
function patientHome(){let b=state.bookings.filter(x=>x.status==="pending"||x.status==="confirmed").slice(0,1)[0];
return '<section class="hero"><div><span class="eyebrow" style="color:#bdebd4">أهلاً بك في يرعاني</span><h1>رعايتك الصحية،<br>في خطوات أقل.</h1><p>اختر الطبيب أو الممرض، احجز في شاشة واحدة، وتابع ملفك الطبي بسهولة.</p><button type="button" class="white-btn" data-action="goto" data-view="services">اطلب تمريضًا منزليًا ←</button></div><div class="hero-art" aria-hidden="true">♡</div></section>'+
'<div class="section-title"><h2>كيف نساعدك اليوم؟</h2><small>خدماتك الأساسية أمامك</small></div>'+
'<div class="quick-grid">'+quick("doctors","⚕","حجز طبيب","اختيار الطبيب والموعد")+quick("services","♡","تمريض منزلي","الخدمة والممرض والموعد")+quick("record","▤","ملفي الطبي","البيانات والتعليمات والتقارير")+quick("appointments","▦","مواعيدي","المتابعة والتقييم")+'</div>'+
'<div class="section-title"><h2>متابعة سريعة</h2></div><div class="two-cols">'+
card("مساعد توجيه الأعراض",'<p class="subtle">ساعدنا في اختيار التخصص الطبي المناسب، دون تشخيص للحالة.</p><div class="form-actions">'+btn("goto","استخدم المساعد الإرشادي","btn","data-view=\"ai\"")+'</div>')+
card("حجوزاتي",b?'<p>'+en((provider(b.pid)||{}).name)+" · "+en(b.date)+'</p>'+status(b.status)+'<div class="form-actions">'+btn("goto","عرض الحجوزات","btn-quiet","data-view=\"appointments\"")+'</div>':'<p class="subtle">لا توجد حجوزات جديدة في هذه المعاينة.</p>'+btn("goto","ابدأ الحجز","btn-quiet","data-view=\"doctors\""))+
'</div>'+notice("تجربة التصميم فقط: لا يُنشئ هذا النموذج حجزًا لدى مقدم رعاية حقيقي، ولا ينقل معلومات طبية خارج الجهاز.") }
function doctors(){return head("أطباء يرعاني","اختر طبيبك","التقييم الظاهر يخص الطبيب نفسه، وليس نوع الخدمة.")+
'<div class="searchbar"><span>⌕</span><input type="search" id="search" aria-label="ابحث عن طبيب" placeholder="ابحث باسم الطبيب أو التخصص..." value="'+en(state.search)+'"></div>'+
'<div class="filters">'+["all","أمراض القلب","الباطنية والسكري","طب الأسرة"].map(f=>'<button type="button" class="chip '+(state.filter===f?"selected":"")+'" data-action="filter" data-filter="'+f+'">'+(f==="all"?"الكل":f)+'</button>').join("")+'</div>'+providerGrid("doctor") }
function servicesView(){return head("الرعاية المنزلية","ما الخدمة التي تحتاجها؟","الخدمة لا تُقيّم. بعد الاختيار سترى أسماء الممرضين وتقييم كل ممرض.")+
'<div class="service-grid">'+services.map(s=>'<button class="service-card" type="button" data-action="select-service" data-id="'+s.id+'"><span class="quick-icon">'+s.icon+'</span><span><strong>'+s.name+'</strong><small>'+s.desc+'</small></span><span class="chevron">‹</span></button>').join("")+'</div>'+
'<div class="form-actions">'+btn("goto","استعرض جميع الممرضين","btn-quiet","data-view=\"nurses\"")+'</div>'+notice("قد تتطلب بعض الإجراءات أمرًا طبيًا صالحًا ومقدم رعاية مؤهلًا. الأسعار المعروضة لاحقًا توضيحية.") }
function nursesView(){return head("مقدمو التمريض","اختر الممرض المناسب","شاهد تقييم الممرض وسعر الخدمة التوضيحي، ثم اطلب الزيارة مباشرة.",btn("goto","تغيير الخدمة","btn-quiet btn-small","data-view=\"services\""))+
(state.selectedService?'<div class="pill-row"><span class="pill-info">الخدمة المختارة: '+en((service(state.selectedService)||{}).name||"جميع الخدمات")+'</span>'+btn("clear-service","إزالة التصفية ×","btn-quiet btn-small")+'</div>':"")+
'<div class="searchbar"><span>⌕</span><input type="search" id="search" aria-label="ابحث عن ممرض" placeholder="اسم الممرض أو التخصص..." value="'+en(state.search)+'"></div>'+providerGrid("nurse") }
function providerGrid(role){
const list=providers.filter(p=>p.role===role&&(!state.selectedService||role==="doctor"||p.services.includes(state.selectedService))&&(!state.search||(p.name+" "+p.specialty).includes(state.search))&&(state.filter==="all"||p.specialty===state.filter));
return list.length?'<div class="provider-grid">'+list.map(p=>'<article class="provider-card"><div class="provider-top"><span class="avatar">'+en(p.short)+'</span><div><h3>'+en(p.name)+'</h3><p>'+en(p.specialty)+'</p></div><div class="rating">★ '+en(p.rating)+'<small>تقييم تجريبي</small></div></div>'+
'<div class="meta-row"><span>◷ خبرة '+en(p.experience)+'</span><span>◈ من '+money(p.fee)+' <small>(توضيحي)</small></span></div>'+
'<div class="provider-actions">'+btn("book",role==="doctor"?"اختيار موعد":"طلب زيارة","btn","data-id=\""+p.id+"\"")+btn("profile","ملف مقدم الخدمة","btn-quiet","data-id=\""+p.id+"\"")+btn("whatsapp","واتساب","btn-quiet","data-id=\""+p.id+"\"")+'</div></article>').join("")+'</div>':'<div class="empty">لا توجد نتائج مطابقة في البيانات التجريبية. '+btn("clear-service","عرض جميع الممرضين","btn-quiet btn-small")+'</div>' }
function appointmentsView(){
const list=state.bookings.slice().reverse();
const isPatient=state.role==="patient";
return head("المواعيد والطلبات",isPatient?"مواعيدي":"الزيارات المرتبطة بدوري",isPatient?"تابع الطلب أو عدّله أو ألغِه، وقيّم مقدم الرعاية بعد اكتمال الزيارة.":"يمكنك مراجعة الطلبات المسندة أو تحديث حالتها داخل المعاينة.")+
(list.length?'<div class="booking-list">'+list.map(b=>{
const p=provider(b.pid),belongs=!p||state.role==="patient"||state.role==="admin"||p.role===state.role;
if(!belongs)return "";
return '<article class="booking"><div class="booking-head"><h3>'+en(p?p.name:"مقدم رعاية")+'</h3>'+status(b.status)+'</div><p>'+en(b.type==="doctor"?"استشارة طبية":((service(b.service)||{}).name||"تمريض منزلي"))+'</p><p>◷ '+en(b.date)+' · '+en(b.time)+' &nbsp; ◇ '+en(b.area)+'</p>'+
'<div class="booking-actions">'+(isPatient&&b.status!=="cancelled"&&b.status!=="completed"?btn("edit-booking","تعديل","btn-quiet btn-small","data-id=\""+b.id+"\"")+btn("cancel-booking","إلغاء الطلب","btn-danger btn-small","data-id=\""+b.id+"\""):"")+
(isPatient&&b.status==="completed"? (state.ratings[b.id]?'<span class="pill-info">★ تم تقييم '+en(p?.name)+' في المعاينة</span>':btn("rate","★ تقييم "+(b.type==="doctor"?"الطبيب":"الممرض"),"btn btn-small","data-id=\""+b.id+"\"")):"")+
(!isPatient&&state.role!=="admin"&&b.status==="pending"?btn("accept","قبول الطلب","btn btn-small","data-id=\""+b.id+"\"")+btn("reject","الاعتذار","btn-danger btn-small","data-id=\""+b.id+"\""):"")+
(!isPatient&&b.status==="confirmed"?btn("finish","إتمام الزيارة","btn btn-small","data-id=\""+b.id+"\""):"")+'</div></article>';
}).join("")+'</div>':'<div class="empty">لا توجد حجوزات تجريبية.</div>')+
(isPatient?'<div class="form-actions">'+btn("goto","موعد طبيب جديد","btn","data-view=\"doctors\"")+btn("goto","تمريض منزلي","btn-quiet","data-view=\"services\"")+'</div>':"")+
notice("حالات الطلبات والتعديل والتقييم تتغير داخل الصفحة فقط؛ عند إعادة تحميلها تعود بيانات المعاينة.") }
function recordView(){
const r=state.record;
return head("سجلك الصحي","ملف طبي واحد","بيانات المريض، تعليمات الطبيب، ما نفذه الممرض، التحاليل والوصفات في شاشة واحدة.")+
'<section class="soft-panel"><span class="eyebrow">ملف المريض</span><h2 style="margin:3px 0;font-size:21px">'+en(r.profile.name)+'</h2><p class="subtle">YR-DEMO-204 · هذا مثال بصري غير مرتبط بشخص حقيقي.</p><div class="pill-row"><span class="pill-info">فصيلة الدم: '+en(r.profile.blood)+'</span><span class="pill-info">الحساسية: '+en(r.profile.allergies)+'</span></div></section>'+
'<div class="section-title"><h2>تفاصيل السجل</h2></div><div class="record-grid">'+
'<section class="record-card"><h3>◈ بيانات المريض</h3>'+row("التاريخ المرضي",en(r.profile.history))+row("فصيلة الدم",en(r.profile.blood))+row("الحساسية",en(r.profile.allergies))+'</section>'+
'<section class="record-card"><h3>⚕ التشخيص والتعليمات — الطبيب</h3><p class="subtle">'+en(r.diagnosis)+'</p><div class="divider"></div><p>'+en(r.instructions)+'</p></section>'+
'<section class="record-card"><h3>♡ ما نفذه الممرض</h3>'+r.nurseTasks.map(x=>'<p class="subtle">✓ '+en(x)+'</p>').join("")+'<div class="divider"></div><strong style="font-size:12px">القياسات</strong>'+r.vitals.map(x=>'<p class="subtle">'+en(x)+'</p>').join("")+'</section>'+
'<section class="record-card"><h3>▤ الوصفات والفحوصات</h3><p class="subtle">وصفة: '+en(r.prescription)+'</p><div class="divider"></div>'+r.labs.map(x=>'<p class="subtle">↟ '+en(x)+'</p>').join("")+
(state.role==="patient"?'<div class="form-actions">'+btn("upload","إضافة مرفق للمعاينة","btn-quiet btn-small")+'</div>':"")+'</section>'+
'<section class="record-card full"><h3>◷ تسلسل المتابعة</h3><ul class="timeline">'+r.timeline.map((x,i)=>'<li><small>حدث توضيحي '+(i+1)+'</small><strong>'+en(x)+'</strong></li>').join("")+'</ul></section></div>'+
notice("السجل هنا توضيحي وغير محفوظ. الطبيب وحده يعتمد التشخيص والوصفة والتوجيه الطبي، والممرض يوثّق التنفيذ دون تعديل تشخيص الطبيب.") }
function symptomsView(){return head("المساعد الإرشادي","إلى أي تخصص أذهب؟","عرض توضيحي لتوجيه الأعراض نحو تخصص، وليس تحليل ذكاء اصطناعي فعليًا أو تشخيصًا.")+
card("صف الأعراض التي تريد الاستفسار عنها",'<form data-form="symptoms"><div class="form-field"><label for="symptom">ما الذي تشعر به؟</label><textarea required minlength="5" id="symptom" name="symptoms" placeholder="مثال توضيحي: ألم في المفاصل منذ عدة أيام..."></textarea></div><button class="btn" type="submit">عرض نموذج التوجيه</button></form><div id="symptomResult"></div>')+
notice("الألم الشديد المفاجئ أو ضيق التنفس أو علامات الخطر تتطلب مساعدة طبية عاجلة. لا تعتمد على هذه الواجهة لاتخاذ قرار طبي.") }
function account(){return head("الحساب","حسابي","إعداداتك الأساسية ووسائل المتابعة في مكان واحد.")+
'<div class="two-cols">'+card("الحساب التجريبي",row("الدور",roleNames[state.role])+row("الاسم","مستخدم تجريبي")+row("حالة الحساب","عرض فقط")+'<div class="form-actions">'+btn("register","تجربة التسجيل","btn-quiet")+btn("notifications","الإشعارات","btn-quiet")+'</div>')+
card("مساعدة وملاحظات",'<p class="subtle">يمكنك إرسال شكوى أو استفسار تجريبي عن الخدمة، أو الاطلاع على حدود العرض.</p><div class="form-actions">'+btn("complaint","إضافة شكوى / اعتراض","btn-quiet")+btn("about","عن هذه النسخة","btn-quiet")+'</div>')+'</div>' }
function workspace(){
if(state.role==="doctor")return head("مساحة الطبيب","مرحبًا بك في لوحة الطبيب","ملف المريض والتعليمات والزيارات في مكان واحد.")+'<div class="quick-grid">'+quick("case","▤","الملف الطبي","التقييم والتشخيص والتعليمات")+quick("appointments","▦","طلباتي","قبول الطلبات ومتابعتها")+quick("case","⚕","خطط العلاج","وصفات وفحوصات ومتابعة")+quick("account","♙","حسابي","البيانات والصلاحيات")+'</div>'+
'<div class="section-title"><h2>إجراءات الطبيب</h2></div>'+card("مريض تجريبي — YR-DEMO-204",'<p class="subtle">افتح الملف واطلع على تقارير التمريض، ثم دوّن التقييم والتعليمات الطبية في نفس الشاشة.</p><div class="form-actions">'+btn("goto","فتح الملف الموحد","btn","data-view=\"case\"")+btn("whatsapp","التواصل مع الممرض بواتساب","btn-quiet","data-id=\"n1\"")+'</div>')+
notice("البيانات افتراضية. دور الطبيب في المعاينة لا يمنح صلاحيات حقيقية، ولا يحفظ تشخيصًا لمريض.");
if(state.role==="nurse")return head("مساحة الممرض","زياراتي اليوم","أولاً راجع تعليمات الطبيب، ثم وثّق الإجراءات التي نفذتها.")+'<div class="quick-grid">'+quick("case","▤","ملف المريض","تعليمات الطبيب والقياسات")+quick("appointments","▦","زياراتي","حالة الطلبات والزيارات")+quick("case","✓","تقرير الزيارة","توثيق التنفيذ والملاحظات")+quick("account","♙","حسابي","البيانات والتواصل")+'</div>'+
'<div class="section-title"><h2>قبل بدء الرعاية</h2></div>'+card("تعليمات الطبيب الحالية",'<p>'+en(state.record.instructions)+'</p><div class="form-actions">'+btn("goto","الاطلاع والتوثيق","btn","data-view=\"case\"")+btn("whatsapp","استفسار واتساب للطبيب","btn-quiet","data-id=\"d1\"")+'</div>')+
notice("الأدوية والحقن والإجراءات المقيدة تتطلب أمرًا طبيًا صالحًا. لا يحق للممرض إصدار وصفات أو تعديل تشخيص الطبيب.");
return head("لوحة الإدارة","إدارة المنصة","مراقبة الحجوزات والكوادر والخدمات والشكاوى في شاشة واضحة.")+
'<div class="mini-stat-grid"><div class="mini-stat"><strong>'+providers.length+'</strong><small>مقدمو خدمة تجريبيون</small></div><div class="mini-stat"><strong>'+state.bookings.length+'</strong><small>الحجوزات</small></div><div class="mini-stat"><strong>'+state.professionalApplications.filter(x=>x.status==="قيد المراجعة").length+'</strong><small>طلبات اعتماد معلّقة</small></div></div>'+
'<div class="section-title"><h2>الإدارة السريعة</h2></div><div class="quick-grid">'+quick("approvals","✓","اعتماد الكوادر","مراجعة وثائق الأطباء والممرضين")+quick("catalog","▦","الخدمات","الأسعار والأنواع")+quick("issues","☷","الشكاوى","الملاحظات والاعتراضات")+quick("appointments","◷","الحجوزات","الطلبات وحالاتها")+'</div>' }
function caseView(){
let role=state.role,extra="";
if(role==="doctor")extra=card("⚕ توثيق الطبيب — معاينة",'<form data-form="doctor-note"><div class="form-field"><label for="docDiag">التقييم / التشخيص من الطبيب</label><textarea id="docDiag" name="diagnosis" required minlength="5">'+en(state.record.diagnosis)+'</textarea></div><div class="form-field"><label for="docInst">تعليمات العلاج والرعاية الموجّهة للممرض</label><textarea id="docInst" name="instructions" required minlength="5">'+en(state.record.instructions)+'</textarea></div><div class="form-field"><label for="docRx">الوصفة الطبية</label><textarea id="docRx" name="prescription" required minlength="5">'+en(state.record.prescription)+'</textarea></div><div class="form-field"><label for="docLab">طلب فحص جديد (اختياري)</label><input id="docLab" name="lab" placeholder="نوع الفحص فقط — مثال تعليمي"></div><button type="submit" class="btn">معاينة تحديث الملف</button></form>');
if(role==="nurse")extra=card("✓ توثيق الممرض — معاينة",'<p class="subtle">خطة الطبيب لا يمكن تعديلها من هذه الواجهة.</p>'+notice(en(state.record.instructions))+'<form data-form="nurse-report"><div class="form-row"><div class="form-field"><label for="vitalBP">ضغط الدم (اختياري)</label><input id="vitalBP" name="bp" placeholder="120/80"></div><div class="form-field"><label for="vitalPulse">النبض (اختياري)</label><input id="vitalPulse" name="pulse" placeholder="75"></div></div><div class="form-field"><label for="nurseTask">ما الذي نفذته خلال الزيارة؟</label><textarea id="nurseTask" name="task" required minlength="8" placeholder="وثّق الإجراءات التمريضية المنفذة والملاحظات دون تشخيص..."></textarea></div><button type="submit" class="btn">إضافة تقرير للمعاينة</button></form>');
return recordView()+'<div class="section-title"><h2>إجراءات '+roleNames[role]+'</h2></div>'+extra }
function approvalsView(){return head("إدارة الكادر","طلبات اعتماد الكوادر","الطبيب والممرض يتقدمان بالوثائق، والإدارة تراجع الطلب قبل الموافقة.")+'<div class="booking-list">'+state.professionalApplications.map(x=>'<article class="booking"><div class="booking-head"><h3>'+en(x.name)+'</h3><span class="status-chip '+(x.status==="قيد المراجعة"?"pending":"confirmed")+'">'+en(x.status)+'</span></div><p>'+en(x.kind)+' · ملف اعتماد توضيحي، لا توجد وثائق حقيقية</p><div class="booking-actions">'+(x.status==="قيد المراجعة"?btn("approve","اعتماد تجريبي","btn btn-small","data-id=\""+x.id+"\"")+btn("decline","رفض تجريبي","btn-danger btn-small","data-id=\""+x.id+"\""):"")+'</div></article>').join("")+'</div>'+notice("لا يمنح الاعتماد التجريبي تصريحًا مهنيًا حقيقيًا. التشغيل الفعلي يتطلب التحقق من الترخيص والهوية.") }
function catalogView(){return head("الكتالوج","إدارة الخدمات والأسعار","أسعار تجريبية وقابلة للتعديل في جلسة العرض فقط.")+'<div class="service-grid">'+services.map(x=>'<article class="white-panel"><div class="pill-row"><span class="quick-icon">'+x.icon+'</span><span><strong>'+en(x.name)+'</strong><small class="subtle" style="display:block">'+money(x.price)+' · توضيحي</small></span></div>'+btn("price","تعديل السعر","btn-quiet btn-small","data-id=\""+x.id+"\"")+'</article>').join("")+'</div>' }
function issuesView(){return head("متابعة المستفيدين","الشكاوى والاعتراضات","استعراض الطلبات وملاحظات المرضى والتعامل معها.")+'<div class="booking-list">'+state.complaints.map(x=>'<article class="booking"><div class="booking-head"><h3>'+en(x.kind)+' · '+en(x.id)+'</h3><span class="status-chip">'+en(x.status)+'</span></div><p>'+en(x.text)+'</p>'+(x.status!=="تمت المعالجة"?'<div class="booking-actions">'+btn("resolve","وضع علامة تمت المعالجة","btn btn-small","data-id=\""+x.id+"\"")+'</div>':"")+'</article>').join("")+'</div>' }
function render(){
renderRoles();renderNav();let result="";
if(state.role==="patient"){
if(state.view==="home")result=patientHome();
else if(state.view==="doctors"){state.selectedService=null;result=doctors()}
else if(state.view==="services")result=servicesView();
else if(state.view==="nurses")result=nursesView();
else if(state.view==="appointments")result=appointmentsView();
else if(state.view==="record")result=recordView();
else if(state.view==="ai")result=symptomsView();
else result=account();
}else if(state.role==="admin"){
if(state.view==="approvals")result=approvalsView();else if(state.view==="catalog")result=catalogView();else if(state.view==="issues")result=issuesView();else if(state.view==="appointments")result=appointmentsView();else if(state.view==="account")result=account();else result=workspace();
}else{
if(state.view==="case")result=caseView();else if(state.view==="appointments")result=appointmentsView();else if(state.view==="account")result=account();else result=workspace();
}
$("app").innerHTML=result;renderModal();
}
function showModal(title,body){state.modal={title,body};renderModal()}
function closeModal(){state.modal=null;renderModal()}
function renderModal(){const root=$("modalRoot");if(!state.modal){root.innerHTML="";return}root.innerHTML='<div class="overlay" data-overlay="true"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-head"><h2 id="modalTitle">'+state.modal.title+'</h2><button class="close" data-action="close" type="button" aria-label="إغلاق">×</button></div><div class="modal-content">'+state.modal.body+'</div></div></div>';const first=root.querySelector("input,select,textarea,button");if(first)first.focus()}
function bookModal(id,b){
const p=provider(id);if(!p)return toast("مقدم الرعاية غير موجود في المعاينة");
const sc=p.role==="doctor"?"consult":(state.selectedService&&p.services.includes(state.selectedService)?state.selectedService:p.services[0]);
const options=p.role==="nurse"?'<div class="form-field"><label for="bookService">نوع الخدمة</label><select id="bookService" name="service" required>'+p.services.map(x=>'<option value="'+x+'" '+(sc===x?"selected":"")+'>'+en(service(x)?.name)+'</option>').join("")+'</select></div>':'<input type="hidden" name="service" value="consult">';
showModal(b?"تعديل طلب تجريبي":"اطلب الخدمة في شاشة واحدة",
'<div class="soft-panel"><strong>'+en(p.name)+'</strong><p class="subtle">'+en(p.specialty)+' · ★ '+en(p.rating)+' تقييم تجريبي</p></div>'+
'<form data-form="booking"><input type="hidden" name="pid" value="'+en(id)+'"><input type="hidden" name="editId" value="'+(b?en(b.id):"")+'">'+options+
'<div class="form-row"><div class="form-field"><label for="bookDate">التاريخ المفضل</label><input id="bookDate" type="date" name="date" min="'+today()+'" value="'+(b?en(b.date):"")+'" required></div><div class="form-field"><label for="bookTime">الوقت المفضل</label><select id="bookTime" name="time" required><option value="">اختر الوقت</option>'+["09:00","11:00","15:00","17:00","19:00"].map(t=>'<option value="'+t+'" '+(b&&b.time===t?"selected":"")+'>'+t+'</option>').join("")+'</select></div></div>'+
'<div class="form-field"><label for="bookArea">'+(p.role==="doctor"?"مكان الاستشارة أو المنطقة":"منطقة الزيارة")+'</label><input id="bookArea" name="area" required minlength="2" maxlength="80" value="'+(b?en(b.area):"")+'" placeholder="اسم المنطقة فقط — لا تُدخل عنوانك الحقيقي"></div>'+
'<p class="subtle">سعر إرشادي في بيانات العرض: '+money(p.fee)+'. الموعد والسعر غير مؤكدين.</p>'+
'<div class="form-actions"><button type="submit" class="btn">'+(b?"معاينة التعديل":"معاينة إرسال الطلب")+'</button>'+btn("close","إلغاء","btn-quiet")+'</div></form>'+
notice("لا ينشئ هذا النموذج حجزًا حقيقيًا، ولا يرسل معلومات إلى الطبيب أو الممرض."))}
function profileModal(id){const p=provider(id);if(!p)return;
showModal("الملف التعريفي لمقدم الرعاية",'<div class="provider-top"><span class="avatar">'+en(p.short)+'</span><div><h3>'+en(p.name)+'</h3><p>'+en(p.specialty)+'</p></div><div class="rating">★ '+en(p.rating)+'<small>تقييم تجريبي</small></div></div><div class="divider"></div>'+row("الخبرة",en(p.experience))+row("التكلفة التوضيحية",money(p.fee))+row("نوع الملف",p.role==="doctor"?"طبيب":"ممرض")+
'<p class="subtle">تظهر تقييمات مقدمي الرعاية فقط، ولا تُمنح نجوم لقياس الضغط أو نوع خدمة تمريضية.</p><div class="form-actions">'+btn("book","طلب موعد","btn","data-id=\""+p.id+"\"")+btn("whatsapp","واتساب","btn-quiet","data-id=\""+p.id+"\"")+'</div>')}
function ratingModal(id){const b=state.bookings.find(x=>x.id===id),p=b&&provider(b.pid);if(!p||b.status!=="completed")return toast("التقييم متاح فقط بعد اكتمال الزيارة");
showModal("تقييم "+(p.role==="doctor"?"الطبيب":"الممرض"),'<div class="soft-panel"><strong>'+en(p.name)+'</strong><p class="subtle">أنت تقيّم مقدم الرعاية نفسه، وليس نوع الخدمة.</p></div>'+
'<form data-form="rating"><input type="hidden" name="booking" value="'+en(b.id)+'"><div class="form-field"><label>كيف كانت تجربتك مع مقدم الرعاية؟</label><div class="star-list">'+[5,4,3,2,1].map(n=>'<label class="star-label"><input type="radio" value="'+n+'" name="stars" required><span>★</span><small>'+n+'</small></label>').join("")+'</div></div><div class="form-field"><label for="rateNote">ملاحظات اختيارية</label><textarea name="comment" id="rateNote" maxlength="250" placeholder="ملاحظات عن تعامل مقدم الرعاية..."></textarea></div><button class="btn" type="submit">حفظ التقييم في المعاينة</button></form>'+
notice("التقييم لا يغيّر متوسط النجوم ولا يُنشر؛ يحتاج النظام الحقيقي إلى مراجعات موثقة مرتبطة بزيارة مكتملة."))}
function genericModal(type,id){
if(type==="price"){const s=service(id);if(!s)return;showModal("تعديل سعر تجريبي",'<form data-form="price"><input type="hidden" name="id" value="'+s.id+'"><p>'+s.name+'</p><div class="form-field"><label for="priceAmount">السعر التوضيحي (ريال يمني)</label><input id="priceAmount" type="number" min="0" max="1000000" name="price" value="'+s.price+'" required></div><button type="submit" class="btn">تطبيق السعر في المعاينة</button></form>')}
if(type==="complaint")showModal("شكوى أو اعتراض",'<form data-form="complaint"><div class="form-field"><label for="complaintKind">نوع الطلب</label><select id="complaintKind" name="kind"><option>شكوى</option><option>اعتراض مالي</option><option>ملاحظة</option></select></div><div class="form-field"><label for="complaintText">صف المشكلة بإيجاز</label><textarea id="complaintText" name="text" required minlength="8" maxlength="400" placeholder="لا تضع بيانات حقيقية أو معلومات طبية حساسة"></textarea></div><button class="btn" type="submit">إضافة للمعاينة</button></form>');
if(type==="notifications")showModal("الإشعارات",state.notifications.length?state.notifications.map(x=>'<p class="white-panel" style="font-size:12px">'+en(x)+'</p>').join(""):'<div class="empty">لا توجد إشعارات تجريبية.</div>');
if(type==="register")showModal("التسجيل التجريبي",'<p class="subtle">لإظهار رحلة التسجيل فقط، دون إنشاء حساب حقيقي.</p><form data-form="register"><div class="form-field"><label for="regName">الاسم الظاهر في المعاينة</label><input id="regName" name="name" placeholder="اسم افتراضي" required minlength="3"></div><div class="form-field"><label>الصفة</label><select name="kind"><option value="patient">مريض</option><option value="doctor">طبيب — يتطلب اعتماد الإدارة</option><option value="nurse">ممرض — يتطلب اعتماد الإدارة</option></select></div><p class="subtle">للتسجيل الفعلي للكوادر يلزم تقديم تراخيص ووثائق والتحقق منها قبل تفعيل الحساب.</p><button class="btn" type="submit">متابعة المعاينة</button></form>');
if(type==="about")showModal("حدود النسخة V21",'<div class="help-grid"><details open><summary>هل هذه منظومة تشغيل فعلية؟</summary><p>لا. هذه واجهة تفاعلية لتصميم التجربة؛ بدون خادم أو حفظ سجلات أو إرسال رسائل أو تأكيد حجوزات.</p></details><details><summary>ما دور الذكاء الاصطناعي؟</summary><p>يظهر نموذج توجيه إرشادي لا يشخّص المرض ولا ينفذ استدلالًا طبيًا فعليًا.</p></details><details><summary>كيف يتم التواصل؟</summary><p>يُفتح واتساب الخارجي مع رسالة عامة. لا توجد أرقام حقيقية، وتختار جهة الاتصال بنفسك. لا تُرسل بيانات طبية تلقائيًا.</p></details><details><summary>كيف تعمل الصلاحيات؟</summary><p>يُظهر التصميم عناصر كل دور، أما التحكم الحقيقي في الصلاحيات فيستلزم Backend وهوية ومراجعة صلاحيات وتدقيقًا.</p></details></div>')}
if(type==="upload")showModal("إضافة مرفق — معاينة فقط",'<form data-form="upload"><div class="form-field"><label for="demoFile">اختر ملفًا تجريبيًا</label><input type="file" id="demoFile" name="file" accept=".pdf,.png,.jpg,.jpeg" required></div><p class="subtle">لن يُرفع الملف إلى خادم. سيظهر اسم الملف فقط في واجهة العرض حتى إعادة تحميل الصفحة.</p><button type="submit" class="btn">إضافة اسم الملف</button></form>');
}
function whatsapp(id){const p=provider(id);const label=p?(p.role==="doctor"?"الطبيب":"الممرض"):"جهة الاتصال";const text="مرحباً، أود الاستفسار عن موعد أو خدمة في يرعاني.";const url="https://api.whatsapp.com/send?text="+encodeURIComponent(text);window.open(url,"_blank","noopener,noreferrer");toast("اختر جهة الاتصال بنفسك في واتساب؛ لا يوجد رقم موثّق في النموذج.")}
function handleClick(ev){
const button=ev.target.closest("[data-action]");
if(!button){if(ev.target.matches("[data-overlay]"))closeModal();return}
const a=button.dataset.action,id=button.dataset.id;
if(a==="close"){closeModal();return}
if(a==="role"){closeModal();setRole(button.dataset.role);return}
if(a==="goto"){closeModal();if(button.dataset.view==="doctors")state.selectedService=null;goto(button.dataset.view);return}
if(a==="filter"){state.filter=button.dataset.filter;render();return}
if(a==="clear-service"){state.selectedService=null;state.search="";render();return}
if(a==="select-service"){state.selectedService=id;goto("nurses");return}
if(a==="book"){closeModal();bookModal(id);return}
if(a==="profile"){closeModal();profileModal(id);return}
if(a==="whatsapp"){whatsapp(id);return}
if(a==="rate"){ratingModal(id);return}
if(a==="edit-booking"){const b=state.bookings.find(x=>x.id===id);if(b)bookModal(b.pid,b);return}
if(a==="cancel-booking"){const b=state.bookings.find(x=>x.id===id);if(b&&b.status!=="completed"&&window.confirm("إلغاء هذا الطلب في معاينة التصميم فقط؟")){b.status="cancelled";notify("أُلغي الطلب في المعاينة");render()}return}
if(["accept","reject","finish"].includes(a)){const b=state.bookings.find(x=>x.id===id);if(!b)return;b.status=a==="accept"?"confirmed":a==="reject"?"cancelled":"completed";notify("تغيرت حالة الحجز في المعاينة: "+statusLabel[b.status]);render();return}
if(["approve","decline"].includes(a)){const t=state.professionalApplications.find(x=>x.id===id);if(t){t.status=a==="approve"?"معتمد تجريبيًا":"مرفوض تجريبيًا";notify("تم تحديث حالة طلب الكادر في المعاينة");render()}return}
if(a==="resolve"){const c=state.complaints.find(x=>x.id===id);if(c){c.status="تمت المعالجة";render()}return}
if(["price","complaint","register","notifications","about","upload"].includes(a)){genericModal(a,id);return}
}
function handleSubmit(ev){
const form=ev.target.closest("form[data-form]");if(!form)return;
ev.preventDefault();if(!form.reportValidity())return;
const payload=Object.fromEntries(new FormData(form).entries()),kind=form.dataset.form;
if(kind==="booking"){
const p=provider(payload.pid);if(!p)return;
const item=state.bookings.find(x=>x.id===payload.editId);
if(item){item.service=payload.service;item.date=payload.date;item.time=payload.time;item.area=String(payload.area).trim();item.status="pending"}
else state.bookings.push({id:"YR-D"+(state.bookings.length+101),type:p.role,pid:p.id,service:payload.service,date:payload.date,time:payload.time,area:String(payload.area).trim(),status:"pending"});
closeModal();goto("appointments");notify("تمت معاينة طلبك — بانتظار القبول (غير مُرسل)");return;
}
if(kind==="rating"){state.ratings[payload.booking]={stars:Number(payload.stars),note:String(payload.comment||"")};closeModal();render();toast("حُفظ التقييم في ذاكرة المعاينة فقط");return}
if(kind==="doctor-note"){
state.record.diagnosis=String(payload.diagnosis);state.record.instructions=String(payload.instructions);state.record.prescription=String(payload.prescription);
if(String(payload.lab||"").trim())state.record.labs.unshift(String(payload.lab).trim());
state.record.timeline.unshift("الطبيب: تحديث المعاينة السريرية والتعليمات");
render();toast("ظهرت تعليمات الطبيب في الملف التجريبي");return;
}
if(kind==="nurse-report"){
state.record.nurseTasks.unshift(String(payload.task));
if(payload.bp||payload.pulse)state.record.vitals.unshift("ضغط: "+String(payload.bp||"—")+" · نبض: "+String(payload.pulse||"—"));
state.record.timeline.unshift("الممرض: إضافة ملاحظات تنفيذ الرعاية في المعاينة");
render();toast("أضيف تقرير الممرض دون تغيير تشخيص الطبيب");return;
}
if(kind==="price"){const s=service(payload.id);if(s)s.price=Number(payload.price);closeModal();render();toast("تم تعديل السعر في المعاينة");return}
if(kind==="complaint"){state.complaints.unshift({id:"C-"+String(state.complaints.length+1).padStart(2,"0"),kind:String(payload.kind),text:String(payload.text),status:"جديد"});closeModal();render();toast("أضيف الطلب في المعاينة");return}
if(kind==="register"){
const name=String(payload.name),role=String(payload.kind);
if(role==="patient"){state.record.profile.name=name;closeModal();setRole("patient");toast("مرحبا بك في المعاينة، دون إنشاء حساب حقيقي")}
else{state.professionalApplications.unshift({id:"A-"+(state.professionalApplications.length+1),name,kind:role==="doctor"?"طبيب":"ممرض",status:"قيد المراجعة"});closeModal();toast("ظهر طلب اعتماد تجريبي في لوحة الإدارة")}return}
if(kind==="upload"){const file=payload.file;if(file&&file.name){state.record.labs.unshift("ملف معاينة: "+file.name);closeModal();render();toast("أضيف اسم الملف فقط؛ لم يُرفع الملف")}return}
if(kind==="symptoms"){
const input=String(payload.symptoms||"");
const urgent=/ضيق تنفس|ألم صدر|اغماء|إغماء|نزيف شديد/.test(input);
const found=/عظم|مفاصل/.test(input)?"العظام":/قلب|صدر|خفقان/.test(input)?"أمراض القلب":/سكر|معدة|بطن/.test(input)?"الباطنية":"طب الأسرة";
const box=$("symptomResult");
if(box)box.innerHTML=urgent?'<div class="notice-box"><strong>تنبيه:</strong> بعض الأعراض المذكورة قد تكون طارئة. اطلب المساعدة الطبية العاجلة بدل الانتظار.</div>':
'<div class="soft-panel" style="margin-top:16px"><strong>مثال توجيهي: '+found+'</strong><p class="subtle">هذا عرض تجريبي بالكلمات المفتاحية، لا تحليل طبي ولا توصية موثوقة.</p><button type="button" class="btn" data-action="goto" data-view="doctors">استعراض الأطباء ←</button></div>';
return;
}
}
function init(){
document.addEventListener("click",handleClick);
document.addEventListener("submit",handleSubmit);
document.addEventListener("input",ev=>{if(ev.target.id==="search"){const val=ev.target.value;state.search=val;const where=state.view;const caret=ev.target.selectionStart;render();const fresh=$("search");if(fresh&&state.view===where){fresh.focus();try{fresh.setSelectionRange(caret,caret)}catch(e){}}}});
document.addEventListener("keydown",ev=>{if(ev.key==="Escape"&&state.modal)closeModal()});
const role=new URLSearchParams(location.search).get("role");
if(roleNames[role]){state.role=role;state.view=role==="patient"?"home":"workspace"}
render();
}
init();
})();