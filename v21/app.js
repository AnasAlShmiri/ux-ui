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
{id:"d4",role:"doctor",name:"د. نورة القحطاني",short:"ن",specialty:"العظام",rating:"4.9",experience:"10 سنوات",fee:7000,services:["consult"]},
{id:"n1",role:"nurse",name:"الممرضة مريم",short:"م",specialty:"قياس العلامات الحيوية",rating:"4.8",experience:"7 سنوات",fee:6000,services:["vitals","nursing"]},
{id:"n2",role:"nurse",name:"الممرض سامي",short:"س",specialty:"رعاية كبار السن",rating:"4.7",experience:"6 سنوات",fee:7500,services:["elder","nursing"]},
{id:"n3",role:"nurse",name:"الممرضة هدى",short:"هـ",specialty:"الرعاية بعد العمليات",rating:"4.9",experience:"8 سنوات",fee:9000,services:["postop","vitals"]}
];
const roleNames={patient:"المريض",doctor:"الطبيب",nurse:"الممرض",admin:"الإدارة"};
const rolePages={
patient:[["home","⌂","الرئيسية"],["services","♡","الخدمات"],["appointments","▦","مواعيدي"],["record","▤","ملفي"]],
doctor:[["workspace","⌂","الرئيسية"],["case","▤","ملف المريض"],["appointments","▦","المواعيد"],["account","♙","حسابي"]],
nurse:[["workspace","⌂","الرئيسية"],["case","▤","ملف المريض"],["appointments","▦","الزيارات"],["account","♙","حسابي"]],
admin:[["workspace","⌂","الرئيسية"],["approvals","✓","الاعتماد"],["catalog","▦","الخدمات"],["issues","☷","الشكاوى"],["account","♙","حسابي"]]
};
const today=()=>{const d=new Date(),o=d.getTimezoneOffset();return new Date(d.getTime()-o*60000).toISOString().slice(0,10)};
const state={role:"patient",view:"home",filter:"all",search:"",selectedService:null,viewPatientId:"p1",actorIds:{patient:"p1",doctor:"d1",nurse:"n1",admin:"a1"},userAccounts:[{id:"p1",name:"المريض التجريبي",role:"patient",status:"فعال تجريبيًا"},{id:"d1",name:"د. عبدالله الحربي",role:"doctor",status:"فعال تجريبيًا"},{id:"n1",name:"الممرضة مريم",role:"nurse",status:"فعال تجريبيًا"}],beneficiaries:[{id:"p1",name:"المريض التجريبي"},{id:"p2",name:"أحد أفراد الأسرة — مثال"}],notifications:["تذكير تجريبي: راجع موعدك القادم من صفحة مواعيدي."],modal:null,ratings:{},payments:{},complaints:[{id:"C-01",kind:"شكوى",text:"نموذج: تأخر في الرد على طلب زيارة",status:"جديد"}],professionalApplications:[{id:"A-01",name:"طبيب تجريبي",kind:"طبيب",status:"قيد المراجعة"},{id:"A-02",name:"ممرض تجريبي",kind:"ممرض",status:"قيد المراجعة"}],records:{
p1:{profile:{name:"المريض التجريبي",age:"بيانات توضيحية",blood:"O+ (مثال)",allergies:"غير موثقة في النموذج",history:"متابعة قلبية افتراضية"},diagnosis:"متابعة دورية (مثال تعليمي — ليس تشخيصًا حقيقيًا)",instructions:"متابعة العلامات الحيوية ورفع تقرير الزيارة للطبيب وفق خطة الرعاية المعتمدة (مثال).",prescription:"وصفة نموذجية غير قابلة للاستخدام العلاجي",medications:[{id:"m1",name:"دواء توضيحي فقط",dose:"حسب وصفة الطبيب",schedule:"صباحًا",duration:"موعد المتابعة",remind:false}],followupDate:"2026-10-20",labs:["تحليل دم — ملف توضيحي"],nurseTasks:["تقرير تمريض توضيحي: قياس الضغط والنبض ورفع الملاحظات."],vitals:["ضغط 124/82، نبض 74 — مثال افتراضي"],timeline:["متابعة الطبيب وإضافة التعليمات","زيارة الممرض وتوثيق المؤشرات","رفع نتيجة فحص تجريبية"]},
p2:{profile:{name:"أحد أفراد الأسرة — مثال",age:"بيانات توضيحية",blood:"غير محددة",allergies:"غير مسجلة",history:"لا توجد معلومات في النموذج"},diagnosis:"لا يوجد تقييم مسجل لهذا المستفيد",instructions:"لا توجد تعليمات طبيب مسجلة",prescription:"لا توجد وصفات طبية",medications:[],followupDate:"",labs:[],nurseTasks:[],vitals:[],timeline:["إنشاء الملف التجريبي للمستفيد"]}
},
bookings:[
{id:"YR-101",type:"doctor",pid:"d1",patientId:"p1",createdBy:"p1",service:"consult",date:"2026-10-10",time:"10:00",area:"العيادة — بيانات توضيحية",status:"completed"},
{id:"YR-102",type:"nurse",pid:"n1",patientId:"p1",createdBy:"p1",service:"vitals",date:"2026-10-11",time:"11:00",area:"عنوان توضيحي",status:"completed"}
]};
const $=id=>document.getElementById(id);
const escapeHTML=value=>String(value==null?"":value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const en=escapeHTML;
const money=n=>new Intl.NumberFormat("ar-YE").format(n)+" ر.ي";
const service=id=>services.find(x=>x.id===id);
const actor=()=>state.actorIds[state.role];
const beneficiary=id=>state.beneficiaries.find(x=>x.id===id);
const actorCanPatient=id=>state.role==="patient"?Boolean(beneficiary(id)):state.bookings.some(b=>b.patientId===id&&b.pid===actor()&&["confirmed","completed"].includes(b.status));
const permittedPatients=()=>state.role==="patient"?state.beneficiaries:state.beneficiaries.filter(p=>actorCanPatient(p.id));
const currentRecord=()=>actorCanPatient(state.viewPatientId)?state.records[state.viewPatientId]:null;
const choosePatient=id=>{if(!actorCanPatient(id))return false;state.viewPatientId=id;return true};
const providerScore=p=>{const reviews=state.bookings.filter(b=>b.pid===p.id&&b.status==="completed"&&state.ratings[b.id]).map(b=>Number(state.ratings[b.id].stars));return reviews.length?((Number(p.rating)*4+reviews.reduce((a,b)=>a+b,0))/(4+reviews.length)).toFixed(1):p.rating};
const providerFee=(p,serviceId)=>p.role==="doctor"?p.fee:(service(serviceId)?.price??p.fee);
const isSlotFree=(pid,date,time,excludeId="")=>!state.bookings.some(b=>b.pid===pid&&b.date===date&&b.time===time&&b.id!==excludeId&&["pending","confirmed"].includes(b.status));
const formatPatient=id=>beneficiary(id)?.name||"مستفيد غير معروف";

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
function setRole(role){if(!roleNames[role])return;state.role=role;state.view=role==="patient"?"home":"workspace";state.viewPatientId="p1";state.selectedService=null;state.search="";state.filter="all";render();window.scrollTo(0,0)}
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
'<div class="filters">'+["all","أمراض القلب","الباطنية والسكري","طب الأسرة","العظام"].map(f=>'<button type="button" class="chip '+(state.filter===f?"selected":"")+'" data-action="filter" data-filter="'+f+'">'+(f==="all"?"الكل":f)+'</button>').join("")+'</div>'+providerGrid("doctor") }
function servicesView(){return head("الرعاية المنزلية","ما الخدمة التي تحتاجها؟","الخدمة لا تُقيّم. بعد الاختيار سترى أسماء الممرضين وتقييم كل ممرض.")+
'<div class="service-grid">'+services.map(s=>'<button class="service-card" type="button" data-action="select-service" data-id="'+s.id+'"><span class="quick-icon">'+s.icon+'</span><span><strong>'+s.name+'</strong><small>'+s.desc+'</small></span><span class="chevron">‹</span></button>').join("")+'</div>'+
'<div class="form-actions">'+btn("goto","استعرض جميع الممرضين","btn-quiet","data-view=\"nurses\"")+'</div>'+notice("قد تتطلب بعض الإجراءات أمرًا طبيًا صالحًا ومقدم رعاية مؤهلًا. الأسعار المعروضة لاحقًا توضيحية.") }
function nursesView(){return head("مقدمو التمريض","اختر الممرض المناسب","شاهد تقييم الممرض وسعر الخدمة التوضيحي، ثم اطلب الزيارة مباشرة.",btn("goto","تغيير الخدمة","btn-quiet btn-small","data-view=\"services\""))+
(state.selectedService?'<div class="pill-row"><span class="pill-info">الخدمة المختارة: '+en((service(state.selectedService)||{}).name||"جميع الخدمات")+'</span>'+btn("clear-service","إزالة التصفية ×","btn-quiet btn-small")+'</div>':"")+
'<div class="searchbar"><span>⌕</span><input type="search" id="search" aria-label="ابحث عن ممرض" placeholder="اسم الممرض أو التخصص..." value="'+en(state.search)+'"></div>'+providerGrid("nurse") }
function providerGrid(role){
const list=providers.filter(p=>p.role===role&&(!state.selectedService||role==="doctor"||p.services.includes(state.selectedService))&&(!state.search||(p.name+" "+p.specialty).includes(state.search))&&(state.filter==="all"||p.specialty===state.filter));
return list.length?'<div class="provider-grid">'+list.map(p=>'<article class="provider-card"><div class="provider-top"><span class="avatar">'+en(p.short)+'</span><div><h3>'+en(p.name)+'</h3><p>'+en(p.specialty)+'</p></div><div class="rating">★ '+providerScore(p)+'<small>تقييم تجريبي</small></div></div>'+
'<div class="meta-row"><span>◷ خبرة '+en(p.experience)+'</span><span>◈ من '+money(p.role==="doctor"?p.fee:Math.min(...p.services.map(sid=>providerFee(p,sid))))+' <small>(توضيحي)</small></span></div>'+
'<div class="provider-actions">'+btn("book",role==="doctor"?"اختيار موعد":"طلب زيارة","btn","data-id=\""+p.id+"\"")+btn("profile","ملف مقدم الخدمة","btn-quiet","data-id=\""+p.id+"\"")+btn("whatsapp","واتساب","btn-quiet","data-id=\""+p.id+"\"")+'</div></article>').join("")+'</div>':'<div class="empty">لا توجد نتائج مطابقة في البيانات التجريبية. '+btn("clear-service","عرض جميع الممرضين","btn-quiet btn-small")+'</div>' }
function appointmentsView(){
const list=state.bookings.filter(b=>state.role==="patient"?b.createdBy===actor():(state.role==="admin"?true:b.pid===actor())).slice().reverse();
const isPatient=state.role==="patient";
return head("المواعيد والطلبات",isPatient?"مواعيدي":"الزيارات المرتبطة بدوري",isPatient?"تابع الطلب أو عدّله أو ألغِه، وقيّم مقدم الرعاية بعد اكتمال الزيارة.":"يمكنك مراجعة الطلبات المسندة أو تحديث حالتها داخل المعاينة.")+
(list.length?'<div class="booking-list">'+list.map(b=>{
const p=provider(b.pid),belongs=state.role==="patient"?b.createdBy===actor():(state.role==="admin"?true:b.pid===actor());
if(!belongs)return "";
return '<article class="booking"><div class="booking-head"><h3>'+en(p?p.name:"مقدم رعاية") +'</h3>'+status(b.status)+'</div><p><strong>المستفيد:</strong> '+en(formatPatient(b.patientId))+'</p><p>'+en(b.type==="doctor"?"استشارة طبية":((service(b.service)||{}).name||"تمريض منزلي"))+'</p><p>◷ '+en(b.date)+' · '+en(b.time)+' &nbsp; ◇ '+en(b.area)+'</p>'+
'<div class="booking-actions">'+(isPatient&&b.status!=="cancelled"&&b.status!=="completed"?btn("edit-booking","تعديل","btn-quiet btn-small","data-id=\""+b.id+"\"")+btn("cancel-booking","إلغاء الطلب","btn-danger btn-small","data-id=\""+b.id+"\""):"")+
(isPatient&&b.status==="completed"? (state.ratings[b.id]?'<span class="pill-info">★ تم تقييم '+en(p?.name)+' في المعاينة</span>':btn("rate","★ تقييم "+(b.type==="doctor"?"الطبيب":"الممرض"),"btn btn-small","data-id=\""+b.id+"\"")):"")+
(isPatient&&b.status==="completed"?(state.payments[b.id]?'<span class="pill-info">تمت معاينة تأكيد الدفع النقدي</span>':btn("payment","تأكيد الدفع النقدي (معاينة)","btn-quiet btn-small","data-id=\""+b.id+"\"")):"")+
(!isPatient&&state.role!=="admin"&&b.status==="pending"?btn("accept","قبول الطلب","btn btn-small","data-id=\""+b.id+"\"")+btn("reject","الاعتذار","btn-danger btn-small","data-id=\""+b.id+"\""):"")+
(!isPatient&&b.status==="confirmed"?btn("finish","إتمام الزيارة","btn btn-small","data-id=\""+b.id+"\""):"")+'</div></article>';
}).join("")+'</div>':'<div class="empty">لا توجد حجوزات تجريبية.</div>')+
(isPatient?'<div class="form-actions">'+btn("goto","موعد طبيب جديد","btn","data-view=\"doctors\"")+btn("goto","تمريض منزلي","btn-quiet","data-view=\"services\"")+'</div>':"")+
notice("حالات الطلبات والتعديل والتقييم تتغير داخل الصفحة فقط؛ عند إعادة تحميلها تعود بيانات المعاينة.") }
function recordView(){
const r=currentRecord();
if(!r)return head("الملف الطبي","لا توجد سجلات مخوّل بعرضها","لا توجد زيارات مؤكدة أو مكتملة تسمح بالاطلاع على هذا الملف.");
const allowed=permittedPatients();
if(!allowed.some(p=>p.id===state.viewPatientId)&&allowed.length){state.viewPatientId=allowed[0].id;}
const chooser=allowed.length>1?'<div class="form-field"><label for="patientPicker">المستفيد صاحب هذا الملف</label><select id="patientPicker" data-patient-picker>'+allowed.map(x=>'<option value="'+x.id+'" '+(x.id===state.viewPatientId?"selected":"")+'>'+en(x.name)+'</option>').join("")+'</select></div>':"";
return head("السجل الصحي","ملف طبي مستقل لكل مستفيد","بيانات المريض، تعليمات الطبيب، أعمال الممرض والفحوصات في شاشة واحدة.")+chooser+
'<section class="soft-panel"><span class="eyebrow">ملف المريض</span><h2 style="margin:3px 0;font-size:21px">'+en(r.profile.name)+'</h2><p class="subtle">YR-DEMO-204 · هذا مثال بصري غير مرتبط بشخص حقيقي.</p><div class="pill-row"><span class="pill-info">فصيلة الدم: '+en(r.profile.blood)+'</span><span class="pill-info">الحساسية: '+en(r.profile.allergies)+'</span></div></section>'+
'<div class="section-title"><h2>تفاصيل السجل</h2></div><div class="record-grid">'+
'<section class="record-card"><h3>◈ بيانات المريض</h3>'+row("التاريخ المرضي",en(r.profile.history))+row("فصيلة الدم",en(r.profile.blood))+row("الحساسية",en(r.profile.allergies))+'</section>'+
'<section class="record-card"><h3>⚕ التشخيص والتعليمات — الطبيب</h3><p class="subtle">'+en(r.diagnosis)+'</p><div class="divider"></div><p>'+en(r.instructions)+'</p></section>'+
'<section class="record-card"><h3>♡ ما نفذه الممرض</h3>'+r.nurseTasks.map(x=>'<p class="subtle">✓ '+en(x)+'</p>').join("")+'<div class="divider"></div><strong style="font-size:12px">القياسات</strong>'+r.vitals.map(x=>'<p class="subtle">'+en(x)+'</p>').join("")+'</section>'+
'<section class="record-card"><h3>▤ الوصفات والفحوصات</h3><p class="subtle">وصفة: '+en(r.prescription)+'</p><div class="divider"></div>'+r.labs.map(x=>'<p class="subtle">↟ '+en(x)+'</p>').join("")+
(state.role==="patient"?'<div class="form-actions">'+btn("upload","إضافة مرفق للمعاينة","btn-quiet btn-small")+'</div>':"")+'</section>'+
'<section class="record-card"><h3>◷ الأدوية ومواعيد المتابعة</h3>'+row("موعد المتابعة",en(r.followupDate||"لم يُحدد"))+(r.medications||[]).map(m=>'<div class="info-row"><span>'+en(m.name)+'<small class="subtle" style="display:block">'+en(m.dose)+' · '+en(m.schedule)+' · '+en(m.duration)+'</small></span>'+(state.role==="patient"?btn("reminder",m.remind?"تذكير مفعّل (تجريبي)":"تفعيل تذكير (تجريبي)","btn-quiet btn-small",'data-id="'+m.id+'"'):"")+'</div>').join("")+'</section>'+
'<section class="record-card full"><h3>◷ تسلسل المتابعة</h3><ul class="timeline">'+r.timeline.map((x,i)=>'<li><small>حدث توضيحي '+(i+1)+'</small><strong>'+en(x)+'</strong></li>').join("")+'</ul></section></div>'+
notice("السجل هنا توضيحي وغير محفوظ. الطبيب وحده يعتمد التشخيص والوصفة والتوجيه الطبي، والممرض يوثّق التنفيذ دون تعديل تشخيص الطبيب.") }
function symptomsView(){return head("المساعد الإرشادي","إلى أي تخصص أذهب؟","عرض توضيحي لتوجيه الأعراض نحو تخصص، وليس تحليل ذكاء اصطناعي فعليًا أو تشخيصًا.")+
card("صف الأعراض التي تريد الاستفسار عنها",'<form data-form="symptoms"><div class="form-field"><label for="symptom">ما الذي تشعر به؟</label><textarea required minlength="5" id="symptom" name="symptoms" placeholder="مثال توضيحي: ألم في المفاصل منذ عدة أيام..."></textarea></div><button class="btn" type="submit">عرض نموذج التوجيه</button></form><div id="symptomResult"></div>')+
notice("الألم الشديد المفاجئ أو ضيق التنفس أو علامات الخطر تتطلب مساعدة طبية عاجلة. لا تعتمد على هذه الواجهة لاتخاذ قرار طبي.") }
function account(){return head("الحساب","حسابي","إعداداتك الأساسية ووسائل المتابعة في مكان واحد.")+
'<div class="two-cols">'+card("الحساب التجريبي",row("الدور",roleNames[state.role])+row("الاسم","مستخدم تجريبي")+row("حالة الحساب","عرض فقط")+'<div class="form-actions">'+btn("login","تجربة تسجيل الدخول","btn-quiet")+btn("register","تجربة التسجيل","btn-quiet")+btn("notifications","الإشعارات","btn-quiet")+'</div>')+
card("مساعدة وملاحظات",'<p class="subtle">يمكنك إرسال شكوى أو استفسار تجريبي عن الخدمة، أو الاطلاع على حدود العرض.</p><div class="form-actions">'+btn("complaint","إضافة شكوى / اعتراض","btn-quiet")+btn("about","عن هذه النسخة","btn-quiet")+'</div>')+'</div>' }
function workspace(){
if(state.role==="doctor")return head("مساحة الطبيب","مرحبًا بك في لوحة الطبيب","ملف المريض والتعليمات والزيارات في مكان واحد.")+'<div class="quick-grid">'+quick("case","▤","الملف الطبي","التقييم والتشخيص والتعليمات")+quick("appointments","▦","طلباتي","قبول الطلبات ومتابعتها")+quick("case","⚕","خطط العلاج","وصفات وفحوصات ومتابعة")+quick("account","♙","حسابي","البيانات والصلاحيات")+'</div>'+
'<div class="section-title"><h2>إجراءات الطبيب</h2></div>'+card("مريض تجريبي — YR-DEMO-204",'<p class="subtle">افتح الملف واطلع على تقارير التمريض، ثم دوّن التقييم والتعليمات الطبية في نفس الشاشة.</p><div class="form-actions">'+btn("goto","فتح الملف الموحد","btn","data-view=\"case\"")+btn("whatsapp","التواصل مع الممرض بواتساب","btn-quiet","data-id=\"n1\"")+'</div>')+
notice("البيانات افتراضية. دور الطبيب في المعاينة لا يمنح صلاحيات حقيقية، ولا يحفظ تشخيصًا لمريض.");
if(state.role==="nurse")return head("مساحة الممرض","زياراتي اليوم","أولاً راجع تعليمات الطبيب، ثم وثّق الإجراءات التي نفذتها.")+'<div class="quick-grid">'+quick("case","▤","ملف المريض","تعليمات الطبيب والقياسات")+quick("appointments","▦","زياراتي","حالة الطلبات والزيارات")+quick("case","✓","تقرير الزيارة","توثيق التنفيذ والملاحظات")+quick("account","♙","حسابي","البيانات والتواصل")+'</div>'+
'<div class="section-title"><h2>قبل بدء الرعاية</h2></div>'+card("تعليمات الطبيب الحالية",'<p>'+en(currentRecord().instructions)+'</p><div class="form-actions">'+btn("goto","الاطلاع والتوثيق","btn","data-view=\"case\"")+btn("whatsapp","استفسار واتساب للطبيب","btn-quiet","data-id=\"d1\"")+'</div>')+
notice("الأدوية والحقن والإجراءات المقيدة تتطلب أمرًا طبيًا صالحًا. لا يحق للممرض إصدار وصفات أو تعديل تشخيص الطبيب.");
return head("لوحة الإدارة","إدارة المنصة","مراقبة الحجوزات والكوادر والخدمات والشكاوى في شاشة واضحة.")+
'<div class="mini-stat-grid"><div class="mini-stat"><strong>'+providers.length+'</strong><small>مقدمو خدمة تجريبيون</small></div><div class="mini-stat"><strong>'+state.bookings.length+'</strong><small>الحجوزات</small></div><div class="mini-stat"><strong>'+state.professionalApplications.filter(x=>x.status==="قيد المراجعة").length+'</strong><small>طلبات اعتماد معلّقة</small></div></div>'+
'<div class="section-title"><h2>الإدارة السريعة</h2></div><div class="quick-grid">'+quick("approvals","✓","اعتماد الكوادر","مراجعة وثائق الأطباء والممرضين")+quick("users","♙","المستخدمون","حساباتهم وحالاتها")+quick("issues","☷","الشكاوى","الملاحظات والاعتراضات")+quick("appointments","◷","الحجوزات","الطلبات وحالاتها")+'</div>' }
function caseView(){
if(!["doctor","nurse"].includes(state.role))return '<div class="empty">هذه الواجهة للكادر الصحي فقط.</div>';
const allowed=permittedPatients();if(allowed.length&&!actorCanPatient(state.viewPatientId))state.viewPatientId=allowed[0].id;
let role=state.role,extra="";
if(role==="doctor"&&actorCanPatient(state.viewPatientId))extra=card("⚕ توثيق الطبيب — معاينة",'<form data-form="doctor-note"><div class="form-field"><label for="docDiag">التقييم / التشخيص من الطبيب</label><textarea id="docDiag" name="diagnosis" required minlength="5">'+en(currentRecord().diagnosis)+'</textarea></div><div class="form-field"><label for="docInst">تعليمات العلاج والرعاية الموجّهة للممرض</label><textarea id="docInst" name="instructions" required minlength="5">'+en(currentRecord().instructions)+'</textarea></div><div class="form-field"><label for="docRx">الوصفة الطبية</label><textarea id="docRx" name="prescription" required minlength="5">'+en(currentRecord().prescription)+'</textarea></div><div class="form-field"><label for="docLab">طلب فحص جديد (اختياري)</label><input id="docLab" name="lab" placeholder="نوع الفحص فقط — مثال تعليمي"></div><div class="form-row"><div class="form-field"><label for="medName">اسم الدواء (اختياري)</label><input id="medName" name="medName" placeholder="اسم توضيحي"></div><div class="form-field"><label for="medDose">الجرعة</label><input id="medDose" name="medDose" placeholder="وفق توجيه الطبيب"></div></div><div class="form-row"><div class="form-field"><label for="medSchedule">مواعيد التناول</label><input id="medSchedule" name="medSchedule" placeholder="حسب الوصفة"></div><div class="form-field"><label for="medDuration">المدة</label><input id="medDuration" name="medDuration" placeholder="المدة المطلوبة"></div></div><div class="form-field"><label for="followupDate">موعد المتابعة القادم</label><input type="date" id="followupDate" name="followupDate" value="'+en(currentRecord().followupDate||"")+'"></div><button type="submit" class="btn">معاينة تحديث الملف</button></form>');
if(role==="nurse"&&actorCanPatient(state.viewPatientId))extra=card("✓ توثيق الممرض — معاينة",'<p class="subtle">خطة الطبيب لا يمكن تعديلها من هذه الواجهة.</p>'+notice(en(currentRecord().instructions))+'<form data-form="nurse-report"><div class="form-row"><div class="form-field"><label for="vitalBP">ضغط الدم (اختياري)</label><input id="vitalBP" name="bp" placeholder="120/80"></div><div class="form-field"><label for="vitalPulse">النبض (اختياري)</label><input id="vitalPulse" name="pulse" placeholder="75"></div></div><div class="form-field"><label for="nurseTask">ما الذي نفذته خلال الزيارة؟</label><textarea id="nurseTask" name="task" required minlength="8" placeholder="وثّق الإجراءات التمريضية المنفذة والملاحظات دون تشخيص..."></textarea></div><div class="form-field"><label for="careMedication">الدواء المنفذ وفق وصفة صالحة (اختياري)</label><select name="careMedication" id="careMedication"><option value="">لا يوجد تنفيذ دوائي</option>'+currentRecord().medications.map(m=>'<option value="'+en(m.id)+'">'+en(m.name)+'</option>').join("")+'</select></div><div class="form-field"><label for="careNotes">حالة المريض أو ملاحظات إضافية</label><textarea id="careNotes" name="notes" placeholder="ملاحظات واقعية عن استجابة المريض، دون تشخيص..."></textarea></div><button type="submit" class="btn">إضافة تقرير للمعاينة</button></form>');
return recordView()+'<div class="section-title"><h2>إجراءات '+roleNames[role]+'</h2></div>'+extra }
function approvalsView(){return head("الكوادر","مراجعة اعتماد الأطباء والممرضين","راجع بيانات الطلب واسم وثيقة الترخيص، ثم اعتمد أو ارفض مع توضيح السبب.")+
'<div class="booking-list">'+state.professionalApplications.map(x=>
'<article class="booking"><div class="booking-head"><h3>'+en(x.name)+'</h3><span class="status-chip '+(x.status==="قيد المراجعة"?"pending":x.status.includes("مرفوض")?"cancelled":"confirmed")+'">'+en(x.status)+'</span></div>'+
'<p>'+en(x.kind)+' · ملف اعتماد تجريبي فقط</p><p><strong>المستند:</strong> '+en(x.credential||"مستند مثال لم يُرفع")+'</p>'+
(x.reason?'<p><strong>سبب القرار:</strong> '+en(x.reason)+'</p>':"")+
(x.status==="قيد المراجعة"?'<div class="booking-actions">'+btn("approve","اعتماد معاينة","btn btn-small",'data-id="'+x.id+'"')+btn("decline","رفض مع سبب","btn-danger btn-small",'data-id="'+x.id+'"')+'</div>':"")+'</article>').join("")+'</div>'+
notice("أسماء المستندات للعرض فقط. اعتماد الكادر الحقيقي يتطلب التحقق من الترخيص والهوية والجهات المختصة.");}
function usersView(){
if(state.role!=="admin")return '<div class="empty">إدارة المستخدمين متاحة للإدارة فقط.</div>';
return head("الإدارة","حسابات المستخدمين التجريبية","عرض حالات حسابات عيّنة، دون تطبيق صلاحيات حقيقية.")+
'<div class="booking-list">'+state.userAccounts.map(u=>
'<article class="booking"><div class="booking-head"><h3>'+en(u.name)+'</h3><span class="status-chip '+(u.status.includes("معلق")?"pending":"confirmed")+'">'+en(u.status)+'</span></div>'+
'<p>'+en(roleNames[u.role]||u.role)+' · '+en(u.id)+'</p><div class="booking-actions">'+btn("toggle-user",u.status.includes("معلق")?"إعادة التفعيل (معاينة)":"تعليق الحساب (معاينة)","btn-quiet btn-small",'data-id="'+u.id+'"')+'</div></article>').join("")+'</div>'+
notice("تغيير الحالة لا يمنع تبديل الأدوار في معرض التصميم. التحكم الحقيقي يتطلب مصادقة وهوية وتطبيق قيود الخادم.");
}
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
if(state.view==="approvals")result=approvalsView();else if(state.view==="users")result=usersView();else if(state.view==="catalog")result=catalogView();else if(state.view==="issues")result=issuesView();else if(state.view==="appointments")result=appointmentsView();else if(state.view==="account")result=account();else result=workspace();
}else{
if(state.view==="case")result=caseView();else if(state.view==="appointments")result=appointmentsView();else if(state.view==="account")result=account();else result=workspace();
}
$("app").innerHTML=result;renderModal();
}
function showModal(title,body){state.modal={title,body};renderModal()}
function closeModal(){state.modal=null;renderModal()}
function renderModal(){const root=$("modalRoot");if(!state.modal){root.innerHTML="";return}root.innerHTML='<div class="overlay" data-overlay="true"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-head"><h2 id="modalTitle">'+state.modal.title+'</h2><button class="close" data-action="close" type="button" aria-label="إغلاق">×</button></div><div class="modal-content">'+state.modal.body+'</div></div></div>';const first=root.querySelector("input,select,textarea,button");if(first)first.focus()}
function bookModal(id,b){
if(state.role!=="patient"||(b&&(b.createdBy!==actor()||!["pending","confirmed"].includes(b.status))))return toast("هذا الطلب ليس ضمن صلاحية المريض");
const p=provider(id);if(!p)return toast("مقدم الرعاية غير موجود في المعاينة");
const sc=p.role==="doctor"?"consult":(state.selectedService&&p.services.includes(state.selectedService)?state.selectedService:p.services[0]);
const options=p.role==="nurse"?'<div class="form-field"><label for="bookService">نوع الخدمة</label><select id="bookService" name="service" required>'+p.services.map(x=>'<option value="'+x+'" '+(sc===x?"selected":"")+'>'+en(service(x)?.name)+'</option>').join("")+'</select></div>':'<input type="hidden" name="service" value="consult">';
showModal(b?"تعديل طلب تجريبي":"اطلب الخدمة في شاشة واحدة",
'<div class="soft-panel"><strong>'+en(p.name)+'</strong><p class="subtle">'+en(p.specialty)+' · ★ '+providerScore(p)+' تقييم تجريبي</p></div>'+
'<form data-form="booking"><input type="hidden" name="pid" value="'+en(id)+'"><input type="hidden" name="editId" value="'+(b?en(b.id):"")+'">'+
'<div class="form-field"><label for="bookPatient">المستفيد من الرعاية</label><select id="bookPatient" name="patientId" required>'+state.beneficiaries.map(x=>'<option value="'+x.id+'" '+((b?.patientId||"p1")===x.id?"selected":"")+'>'+en(x.name)+'</option>').join("")+'</select></div>'+options+
'<div class="form-row"><div class="form-field"><label for="bookDate">التاريخ المفضل</label><input id="bookDate" type="date" name="date" min="'+today()+'" value="'+(b?en(b.date):"")+'" required></div><div class="form-field"><label for="bookTime">الوقت المفضل</label><select id="bookTime" name="time" required><option value="">اختر الوقت</option>'+["09:00","11:00","15:00","17:00","19:00"].map(t=>'<option value="'+t+'" '+(b&&b.time===t?"selected":"")+'>'+t+'</option>').join("")+'</select></div></div>'+
'<div class="form-field"><label for="bookArea">'+(p.role==="doctor"?"مكان الاستشارة أو المنطقة":"منطقة الزيارة")+'</label><input id="bookArea" name="area" required minlength="2" maxlength="80" value="'+(b?en(b.area):"")+'" placeholder="اسم المنطقة فقط — لا تُدخل عنوانك الحقيقي"></div>'+
'<p class="subtle">سعر إرشادي في بيانات العرض: <strong id="bookingPrice">'+money(providerFee(p,sc))+'</strong>. الموعد والسعر غير مؤكدين.</p>'+
'<div class="form-actions"><button type="submit" class="btn">'+(b?"معاينة التعديل":"معاينة إرسال الطلب")+'</button>'+btn("close","إلغاء","btn-quiet")+'</div></form>'+
notice("لا ينشئ هذا النموذج حجزًا حقيقيًا، ولا يرسل معلومات إلى الطبيب أو الممرض."));
const when=$("bookDate"),time=$("bookTime"),sv=$("bookService");
const refresh=()=>{
 for(const option of time.options){if(option.value){let occupied=Boolean(when.value)&&!isSlotFree(p.id,when.value,option.value,b?.id||"");option.disabled=occupied;option.textContent=option.value+(occupied?" — مشغول بالمعاينة":"")}}
 const amount=$("bookingPrice");if(amount)amount.textContent=money(providerFee(p,sv?.value||sc));
};
when?.addEventListener("change",refresh);time?.addEventListener("focus",refresh);sv?.addEventListener("change",refresh);refresh();
}
function profileModal(id){const p=provider(id);if(!p)return;
showModal("الملف التعريفي لمقدم الرعاية",'<div class="provider-top"><span class="avatar">'+en(p.short)+'</span><div><h3>'+en(p.name)+'</h3><p>'+en(p.specialty)+'</p></div><div class="rating">★ '+providerScore(p)+'<small>تقييم تجريبي</small></div></div><div class="divider"></div>'+row("الخبرة",en(p.experience))+row("التكلفة التوضيحية",money(p.fee))+row("نوع الملف",p.role==="doctor"?"طبيب":"ممرض")+
'<p class="subtle">تظهر تقييمات مقدمي الرعاية فقط، ولا تُمنح نجوم لقياس الضغط أو نوع خدمة تمريضية.</p><div class="form-actions">'+btn("book","طلب موعد","btn","data-id=\""+p.id+"\"")+btn("whatsapp","واتساب","btn-quiet","data-id=\""+p.id+"\"")+'</div>')}
function ratingModal(id){const b=state.bookings.find(x=>x.id===id),p=b&&provider(b.pid);if(state.role!=="patient"||b?.createdBy!==actor()||!p||b.status!=="completed")return toast("التقييم متاح فقط بعد اكتمال الزيارة");
showModal("تقييم "+(p.role==="doctor"?"الطبيب":"الممرض"),'<div class="soft-panel"><strong>'+en(p.name)+'</strong><p class="subtle">أنت تقيّم مقدم الرعاية نفسه، وليس نوع الخدمة.</p></div>'+
'<form data-form="rating"><input type="hidden" name="booking" value="'+en(b.id)+'"><div class="form-field"><label>كيف كانت تجربتك مع مقدم الرعاية؟</label><div class="star-list">'+[5,4,3,2,1].map(n=>'<label class="star-label"><input type="radio" value="'+n+'" name="stars" required><span>★</span><small>'+n+'</small></label>').join("")+'</div></div><div class="form-field"><label for="rateNote">ملاحظات اختيارية</label><textarea name="comment" id="rateNote" maxlength="250" placeholder="ملاحظات عن تعامل مقدم الرعاية..."></textarea></div><button class="btn" type="submit">حفظ التقييم في المعاينة</button></form>'+
notice("التقييم لا يغيّر متوسط النجوم ولا يُنشر؛ يحتاج النظام الحقيقي إلى مراجعات موثقة مرتبطة بزيارة مكتملة."))}
function genericModal(type,id){
if(type==="price"){const s=service(id);if(!s)return;showModal("تعديل سعر تجريبي",'<form data-form="price"><input type="hidden" name="id" value="'+s.id+'"><p>'+s.name+'</p><div class="form-field"><label for="priceAmount">السعر التوضيحي (ريال يمني)</label><input id="priceAmount" type="number" min="0" max="1000000" name="price" value="'+s.price+'" required></div><button type="submit" class="btn">تطبيق السعر في المعاينة</button></form>')}
if(type==="complaint")showModal("شكوى أو اعتراض",'<form data-form="complaint"><div class="form-field"><label for="complaintKind">نوع الطلب</label><select id="complaintKind" name="kind"><option>شكوى</option><option>اعتراض مالي</option><option>ملاحظة</option></select></div><div class="form-field"><label for="complaintText">صف المشكلة بإيجاز</label><textarea id="complaintText" name="text" required minlength="8" maxlength="400" placeholder="لا تضع بيانات حقيقية أو معلومات طبية حساسة"></textarea></div><button class="btn" type="submit">إضافة للمعاينة</button></form>');
if(type==="notifications"){
const record=state.records[state.actorIds.patient];
const appointments=state.bookings.filter(b=>b.createdBy===state.actorIds.patient&&["pending","confirmed"].includes(b.status)).map(b=>'موعد '+en(b.date)+' الساعة '+en(b.time)+' · '+en(provider(b.pid)?.name||"مقدم رعاية"));
const reminders=record.medications.filter(m=>m.remind).map(m=>'دواء تجريبي: '+en(m.name)+' · '+en(m.schedule));
const followup=record.followupDate?['موعد متابعة الطبيب التوضيحي: '+en(record.followupDate)]:[];
const messages=[...state.notifications,...appointments,...reminders,...followup];
showModal("الإشعارات والتذكيرات — معاينة",messages.map(x=>'<p class="white-panel" style="font-size:12px">'+x+'</p>').join("")+'<p class="subtle">هذه قائمة تُعرض عند فتحها؛ ليست إشعارات آلية أو جدولة خلفية.</p>');
}
if(type==="login")showModal("تسجيل الدخول — معاينة فقط",'<p class="subtle">لا تستخدم بياناتك الحقيقية. يمكنك تجربة الانتقال إلى دور مستخدم دون تحقق من خادم.</p><form data-form="login"><div class="form-field"><label for="loginName">البريد الإلكتروني التجريبي</label><input id="loginName" type="email" name="email" required placeholder="demo@example.com" autocomplete="off"></div><div class="form-field"><label for="loginPassword">كلمة مرور وهمية</label><input id="loginPassword" type="password" name="password" required minlength="4" placeholder="••••••" autocomplete="off"></div><div class="form-field"><label for="loginRole">الدور المراد معاينته</label><select id="loginRole" name="role"><option value="patient">مريض</option><option value="doctor">طبيب</option><option value="nurse">ممرض</option><option value="admin">مدير المنصة</option></select></div><button type="submit" class="btn">دخول تجريبي</button></form>');
if(type==="register")showModal("التسجيل التجريبي",'<p class="subtle">لإظهار رحلة التسجيل فقط، دون إنشاء حساب حقيقي.</p><form data-form="register"><div class="form-field"><label for="regName">الاسم الظاهر في المعاينة</label><input id="regName" name="name" placeholder="اسم افتراضي" required minlength="3"></div><div class="form-field"><label>الصفة</label><select name="kind"><option value="patient">مريض</option><option value="doctor">طبيب — يتطلب اعتماد الإدارة</option><option value="nurse">ممرض — يتطلب اعتماد الإدارة</option></select></div><div class="form-field"><label for="regCredential">ترخيص أو مؤهل طبي (مطلوب لطلب انضمام طبيب أو ممرض)</label><input id="regCredential" name="credential" type="file" accept=".pdf,.png,.jpg,.jpeg"></div><p class="subtle">لا يتم رفع الوثيقة أو تخزينها. تسجيل الكادر الطبي يخضع لاعتماد الإدارة في النظام الحقيقي.</p><button class="btn" type="submit">متابعة المعاينة</button></form>');
if(type==="about")showModal("حدود النسخة V21",'<div class="help-grid"><details open><summary>هل هذه منظومة تشغيل فعلية؟</summary><p>لا. هذه واجهة تفاعلية لتصميم التجربة؛ بدون خادم أو حفظ سجلات أو إرسال رسائل أو تأكيد حجوزات.</p></details><details><summary>ما دور الذكاء الاصطناعي؟</summary><p>يظهر نموذج توجيه إرشادي لا يشخّص المرض ولا ينفذ استدلالًا طبيًا فعليًا.</p></details><details><summary>كيف يتم التواصل؟</summary><p>يُفتح واتساب الخارجي مع رسالة عامة. لا توجد أرقام حقيقية، وتختار جهة الاتصال بنفسك. لا تُرسل بيانات طبية تلقائيًا.</p></details><details><summary>كيف تعمل الصلاحيات؟</summary><p>يُظهر التصميم عناصر كل دور، أما التحكم الحقيقي في الصلاحيات فيستلزم Backend وهوية ومراجعة صلاحيات وتدقيقًا.</p></details></div>');
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
if(a==="reminder"){if(state.role!=="patient")return;const record=currentRecord();const med=record?.medications?.find(m=>m.id===id);if(med){med.remind=!med.remind;render();toast("تذكير توضيحي فقط، لا تُرسل إشعارات تلقائية")}return}
if(a==="payment"){const b=state.bookings.find(x=>x.id===id);if(state.role==="patient"&&b?.createdBy===actor()&&b.status==="completed"&&window.confirm("هل تريد تأكيد دفع نقدي في معاينة التصميم فقط؟ لا يوجد دفع حقيقي.")){state.payments[id]=true;render();toast("تأكيد دفع نقدي تجريبي، دون تحصيل أموال")}return}
if(a==="recommended"){state.view="doctors";state.selectedService=null;state.search="";state.filter=button.dataset.specialty==="الباطنية"?"الباطنية والسكري":button.dataset.specialty;render();window.scrollTo(0,0);return}
if(a==="edit-booking"){const b=state.bookings.find(x=>x.id===id);if(state.role==="patient"&&b?.createdBy===actor()&&["pending","confirmed"].includes(b.status))bookModal(b.pid,b);else toast("هذا الطلب غير قابل للتعديل");return}
if(a==="cancel-booking"){const b=state.bookings.find(x=>x.id===id);if(state.role==="patient"&&b?.createdBy===actor()&&["pending","confirmed"].includes(b.status)&&window.confirm("إلغاء هذا الطلب في معاينة التصميم فقط؟")){b.status="cancelled";notify("أُلغي الطلب في المعاينة");render()}return}
if(["accept","reject","finish"].includes(a)){const b=state.bookings.find(x=>x.id===id);if(!b||!["doctor","nurse"].includes(state.role)||b.pid!==actor()||!(a==="finish"?b.status==="confirmed":b.status==="pending"))return toast("هذه الزيارة غير مسندة لهذا الحساب أو حالتها لا تسمح بالإجراء");b.status=a==="accept"?"confirmed":a==="reject"?"cancelled":"completed";notify("تغيرت حالة الحجز في المعاينة: "+statusLabel[b.status]);render();return}
if(["approve","decline"].includes(a)){
if(state.role!=="admin")return toast("هذا القرار للإدارة فقط");
const t=state.professionalApplications.find(x=>x.id===id);
if(!t||t.status!=="قيد المراجعة")return;
if(a==="decline"){showModal("رفض طلب الكادر مع السبب",'<form data-form="approval"><input type="hidden" name="id" value="'+en(t.id)+'"><div class="form-field"><label for="reason">سبب الرفض (إلزامي)</label><textarea id="reason" name="reason" required minlength="8" maxlength="250" placeholder="مثال: بيانات الترخيص غير مكتملة"></textarea></div><button type="submit" class="btn">تسجيل رفض تجريبي</button></form>');return}
t.status="معتمد تجريبيًا";t.reason="تمت مراجعة نموذج المستند فقط";if(!state.userAccounts.some(u=>u.id===t.id))state.userAccounts.push({id:t.id,name:t.name,role:t.kind==="طبيب"?"doctor":"nurse",status:"فعال تجريبيًا"});notify("تم اعتماد طلب الكادر في المعاينة (دون تحقق رسمي)");render();return
}
if(a==="toggle-user"){if(state.role!=="admin")return;const u=state.userAccounts.find(x=>x.id===id);if(!u)return;u.status=u.status.includes("معلق")?"فعال تجريبيًا":"معلق تجريبيًا";render();toast("تم تغيير حالة حساب تجريبي فقط");return}
if(a==="resolve"){if(state.role!=="admin")return;const c=state.complaints.find(x=>x.id===id);if(c){c.status="تمت المعالجة";render()}return}
if(["price","complaint","register","login","notifications","about","upload"].includes(a)){genericModal(a,id);return}
}
function handleSubmit(ev){
const form=ev.target.closest("form[data-form]");if(!form)return;
ev.preventDefault();if(!form.reportValidity())return;
const payload=Object.fromEntries(new FormData(form).entries()),kind=form.dataset.form;
if(kind==="booking"){
const p=provider(payload.pid);if(!p||state.role!=="patient"||!beneficiary(payload.patientId))return toast("المستفيد أو مقدم الرعاية غير صالح للطلب");
if(payload.date<today())return toast("اختر تاريخًا اليوم أو بعده");
if(!isSlotFree(p.id,payload.date,payload.time,payload.editId||""))return toast("هذا الوقت محجوز في المعاينة، اختر وقتًا آخر");
if(p.role==="nurse"&&!p.services.includes(payload.service))return toast("الممرض لا يقدم هذه الخدمة");
if(p.role==="doctor"&&payload.service!=="consult")return toast("الخدمة غير صالحة للطبيب");
const item=state.bookings.find(x=>x.id===payload.editId);
if(item&&(item.createdBy!==actor()||!["pending","confirmed"].includes(item.status)))return toast("ليس لديك صلاحية تعديل الطلب");
if(item){item.patientId=payload.patientId;item.fee=providerFee(p,payload.service);item.service=payload.service;item.date=payload.date;item.time=payload.time;item.area=String(payload.area).trim();item.status="pending"}
else state.bookings.push({id:"YR-D"+(state.bookings.length+101),type:p.role,pid:p.id,patientId:payload.patientId,createdBy:actor(),fee:providerFee(p,payload.service),service:payload.service,date:payload.date,time:payload.time,area:String(payload.area).trim(),status:"pending"});
closeModal();goto("appointments");notify("تمت معاينة طلبك — بانتظار القبول (غير مُرسل)");return;
}
if(kind==="rating"){const b=state.bookings.find(x=>x.id===payload.booking);if(state.role!=="patient"||b?.createdBy!==actor()||b.status!=="completed"||state.ratings[b.id]||![1,2,3,4,5].includes(Number(payload.stars)))return toast("التقييم متاح مرة واحدة بعد زيارة مكتملة");state.ratings[payload.booking]={stars:Number(payload.stars),note:String(payload.comment||"")};closeModal();render();toast("حُفظ التقييم في ذاكرة المعاينة فقط");return}
if(kind==="doctor-note"){
if(state.role!=="doctor"||!actorCanPatient(state.viewPatientId))return toast("لا يوجد تكليف يسمح بتعديل هذا الملف");
currentRecord().diagnosis=String(payload.diagnosis);currentRecord().instructions=String(payload.instructions);currentRecord().prescription=String(payload.prescription);
if(String(payload.medName||"").trim()&&(!String(payload.medDose||"").trim()||!String(payload.medSchedule||"").trim()||!String(payload.medDuration||"").trim()))return toast("أكمل الجرعة والوقت والمدة قبل حفظ بيانات الطبيب");
if(String(payload.lab||"").trim())currentRecord().labs.unshift(String(payload.lab).trim());
if(String(payload.medName||"").trim()){
  currentRecord().medications.unshift({id:"m"+Date.now(),name:String(payload.medName).trim(),dose:String(payload.medDose).trim(),schedule:String(payload.medSchedule).trim(),duration:String(payload.medDuration).trim(),remind:false});
}
if(payload.followupDate)currentRecord().followupDate=String(payload.followupDate);
currentRecord().timeline.unshift("الطبيب: تحديث المعاينة السريرية والتعليمات");
render();toast("ظهرت تعليمات الطبيب في الملف التجريبي");return;
}
if(kind==="nurse-report"){
if(state.role!=="nurse"||!actorCanPatient(state.viewPatientId))return toast("لا يوجد تكليف يسمح بتوثيق هذه الحالة");
const medication=payload.careMedication?currentRecord().medications.find(m=>m.id===payload.careMedication):null;
if(payload.careMedication&&!medication)return toast("الدواء غير مدرج بوصفة الطبيب لهذا الملف");
currentRecord().nurseTasks.unshift(String(payload.task)+(medication?" · دواء موثّق وفق الوصفة: "+medication.name:"")+(String(payload.notes||"").trim()?" · ملاحظات: "+String(payload.notes).trim():""));
if(payload.bp||payload.pulse)currentRecord().vitals.unshift("ضغط: "+String(payload.bp||"—")+" · نبض: "+String(payload.pulse||"—"));
currentRecord().timeline.unshift("الممرض: إضافة ملاحظات تنفيذ الرعاية في المعاينة");
render();toast("أضيف تقرير الممرض دون تغيير تشخيص الطبيب");return;
}
if(kind==="approval"){
if(state.role!=="admin")return;
const request=state.professionalApplications.find(x=>x.id===payload.id);
if(request&&request.status==="قيد المراجعة"){request.status="مرفوض تجريبيًا";request.reason=String(payload.reason).trim();closeModal();notify("تم تسجيل سبب رفض الكادر في المعاينة");render()}return
}
if(kind==="price"){if(state.role!=="admin")return;const s=service(payload.id);if(s)s.price=Number(payload.price);closeModal();render();toast("تم تعديل السعر في المعاينة");return}
if(kind==="complaint"){state.complaints.unshift({id:"C-"+String(state.complaints.length+1).padStart(2,"0"),kind:String(payload.kind),text:String(payload.text),status:"جديد"});closeModal();render();toast("أضيف الطلب في المعاينة");return}
if(kind==="login"){
const role=String(payload.role);
closeModal();setRole(role);toast("معاينة دخول إلى دور "+(roleNames[role]||"مستخدم")+" دون مصادقة فعلية");return;
}
if(kind==="register"){
const name=String(payload.name),role=String(payload.kind);
if(role!=="patient"&&(!payload.credential||!payload.credential.name)){toast("يرجى اختيار مستند مهني تجريبي لطلب انضمام الكادر");return;}
if(role==="patient"){const rec=state.records[state.actorIds.patient];rec.profile.name=name;state.beneficiaries[0].name=name;closeModal();setRole("patient");toast("مرحبا بك في المعاينة، دون إنشاء حساب حقيقي")}
else{state.professionalApplications.unshift({id:"A-"+(state.professionalApplications.length+1),name,kind:role==="doctor"?"طبيب":"ممرض",credential:String(payload.credential.name),status:"قيد المراجعة",reason:""});closeModal();toast("ظهر طلب اعتماد تجريبي في لوحة الإدارة")}return}
if(kind==="upload"){if(state.role!=="patient"||!actorCanPatient(state.viewPatientId))return;const file=payload.file;if(file&&file.name){currentRecord().labs.unshift("ملف معاينة: "+file.name);closeModal();render();toast("أضيف اسم الملف فقط؛ لم يُرفع الملف")}return}
if(kind==="symptoms"){
const input=String(payload.symptoms||"");
const urgent=/ضيق تنفس|ألم صدر|اغماء|إغماء|نزيف شديد/.test(input);
const found=/عظم|مفاصل/.test(input)?"العظام":/قلب|صدر|خفقان/.test(input)?"أمراض القلب":/سكر|معدة|بطن/.test(input)?"الباطنية":"طب الأسرة";
const box=$("symptomResult");
if(box)box.innerHTML=urgent?'<div class="notice-box"><strong>تنبيه:</strong> بعض الأعراض المذكورة قد تكون طارئة. اطلب المساعدة الطبية العاجلة بدل الانتظار.</div>':
'<div class="soft-panel" style="margin-top:16px"><strong>مثال توجيهي: '+found+'</strong><p class="subtle">هذا عرض تجريبي بالكلمات المفتاحية، لا تحليل طبي ولا توصية موثوقة.</p><button type="button" class="btn" data-action="recommended" data-specialty="'+en(found)+'">استعراض أطباء التخصص المقترح ←</button></div>';
return;
}
}
function init(){
document.addEventListener("click",handleClick);
document.addEventListener("submit",handleSubmit);
document.addEventListener("change",event=>{if(event.target.matches("[data-patient-picker]")){if(choosePatient(event.target.value))render();else toast("لا تملك صلاحية الاطلاع على هذا الملف")}});
document.addEventListener("input",ev=>{if(ev.target.id==="search"){const val=ev.target.value;state.search=val;const where=state.view;const caret=ev.target.selectionStart;render();const fresh=$("search");if(fresh&&state.view===where){fresh.focus();try{fresh.setSelectionRange(caret,caret)}catch(e){}}}});
document.addEventListener("keydown",ev=>{if(ev.key==="Escape"&&state.modal)closeModal()});
const role=new URLSearchParams(location.search).get("role");
if(roleNames[role]){state.role=role;state.view=role==="patient"?"home":"workspace"}
render();
}
init();
})();