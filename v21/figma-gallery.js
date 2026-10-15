/* Yerani V21 – create an editable HTML gallery from the REAL V21 DOM states.
   Capture this ONE page with the html.to.design Chrome extension: ONE viewport, ONE theme.
   The extension imports the whole gallery in one capture; does not import app behavior. */
(() => {
"use strict";
const screens=[
  ["01 · المريض — الرئيسية","patient","home"],
  ["02 · المريض — قائمة الأطباء","patient","doctors"],
  ["03 · المريض — تفاصيل الطبيب","patient","doctors","profile","d1"],
  ["04 · المريض — طلب موعد طبيب","patient","doctors","book","d1"],
  ["05 · المريض — خدمات التمريض","patient","services"],
  ["06 · المريض — قائمة الممرضين","patient","nurses"],
  ["07 · المريض — تفاصيل الممرض","patient","nurses","profile","n1"],
  ["08 · المريض — طلب زيارة تمريض","patient","nurses","book","n1"],
  ["09 · المريض — مواعيدي","patient","appointments"],
  ["10 · المريض — تقييم الطبيب","patient","appointments","rate","YR-101"],
  ["11 · المريض — الملف الطبي","patient","record"],
  ["12 · المريض — سجل مستفيد آخر","patient","record","patient","p2"],
  ["13 · المريض — توجيه الأعراض","patient","ai"],
  ["14 · المريض — حسابي","patient","account"],
  ["15 · المريض — تسجيل الدخول","patient","account","login"],
  ["16 · المريض — إنشاء حساب","patient","account","register"],
  ["17 · المريض — الشكاوى والاعتراضات","patient","account","complaint"],
  ["18 · المريض — الإشعارات","patient","home","notifications"],
  ["19 · الطبيب — الرئيسية","doctor","workspace"],
  ["20 · الطبيب — الطلبات","doctor","appointments"],
  ["21 · الطبيب — الملف والتشخيص والوصفة","doctor","case"],
  ["22 · الطبيب — حسابي","doctor","account"],
  ["23 · الممرض — الرئيسية","nurse","workspace"],
  ["24 · الممرض — الزيارات","nurse","appointments"],
  ["25 · الممرض — تعليمات الطبيب والتوثيق","nurse","case"],
  ["26 · الممرض — حسابي","nurse","account"],
  ["27 · الإدارة — الرئيسية","admin","workspace"],
  ["28 · الإدارة — اعتماد الكوادر","admin","approvals"],
  ["29 · الإدارة — إدارة المستخدمين","admin","users"],
  ["30 · الإدارة — الخدمات والأسعار","admin","catalog"],
  ["31 · الإدارة — الشكاوى","admin","issues"]
];
const source=document.getElementById("shell");
const modal=document.getElementById("modalRoot");
const gallery=document.getElementById("figmaGallery");
const status=document.getElementById("galleryStatus");
if(!source||!modal||!gallery){return}
function act(action,details={}){
 const button=document.createElement("button");
 button.type="button";
 button.dataset.action=action;
 for(const [k,v] of Object.entries(details))button.dataset[k]=String(v);
 source.appendChild(button);button.click();button.remove();
}
function snapshot(spec){
 const [name,role,view,action,id]=spec;
 act("role",{role});
 if(view!=="workspace"&&view!=="home")act("goto",{view});
 if(view==="home"&&role==="patient")act("goto",{view:"home"});
 if(action==="patient"){
  const picker=document.querySelector("#shell #patientPicker");
  if(picker){
   picker.value=id;
   picker.dispatchEvent(new Event("change",{bubbles:true}));
  }
 }else if(action){
  const args=id?{id}:{};
  act(action,args);
 }
 const wrap=document.createElement("section");
 wrap.className="gallery-item";
 wrap.setAttribute("data-screen",name);
 const label=document.createElement("div");
 label.className="gallery-name";label.textContent=name;wrap.appendChild(label);
 const frame=document.createElement("div");
 frame.className="gallery-screen";
 const clone=source.cloneNode(true);
 clone.removeAttribute("id");
 clone.classList.add("snapshot-shell");
 clone.querySelectorAll("[id]").forEach(n=>n.removeAttribute("id"));
 frame.appendChild(clone);
 if(modal.firstElementChild){
  const overlay=modal.firstElementChild.cloneNode(true);
  overlay.removeAttribute("data-overlay");
  overlay.querySelectorAll("[id]").forEach(n=>n.removeAttribute("id"));
  frame.appendChild(overlay);
  act("close");
 }
 wrap.appendChild(frame);
 gallery.appendChild(wrap);
 return name;
}
async function generate(){
 try{
  if(document.fonts&&document.fonts.ready)await document.fonts.ready;
  // Render all states synchronously from the same app's buttons.
  let count=0;
  for(const spec of screens){snapshot(spec);count++;}
  status.textContent=count+" واجهة جاهزة — التقط الصفحة مرة واحدة";
  status.style.background="#D7F5E6";
  document.title="Yerani V21 — "+count+" Screens — Figma Export";
  document.documentElement.setAttribute("data-gallery-ready","true");
 }catch(err){
  status.textContent="تعذر تجهيز الشاشة "+(gallery.children.length+1)+": "+err.message;
  status.style.background="#FADBDD";
  console.error("Yerani Figma gallery",err);
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",generate,{once:true});else generate();
})();