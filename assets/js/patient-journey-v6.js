/* Yerani premium patient journey v6.
 * Accessible, progressive enhancements for static HTML/CSS prototype.
 * No backend requests, persistence, booking or real clinical recommendations.
 */
(() => {
  "use strict";
  const ready = fn => document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn) : fn();
  const normalize = s => String(s || "").toLocaleLowerCase("ar").normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآٱ]/g, "ا").replace(/ى/g,"ي").replace(/ة/g,"ه")
    .replace(/\s+/g, " ").trim();
  ready(() => {
    if (!document.body.classList.contains("yp-flow")) return;
    const directory = document.querySelector("[data-doctor-directory]");
    if (directory) {
      const input = directory.querySelector("[data-doctor-search]");
      const chips = [...directory.querySelectorAll("[data-filter-specialty]")];
      const cards = [...directory.querySelectorAll("[data-doctor-card]")];
      const counter = directory.querySelector("[data-results-count]");
      const empty = directory.querySelector("[data-no-results]");
      let selected = "all";
      const render = () => {
        const q = normalize(input?.value || "");
        let count = 0;
        cards.forEach(card => {
          const specialty = card.dataset.specialty;
          const content = normalize(card.textContent + " " + (card.dataset.search || ""));
          const shown = (selected === "all" || specialty === selected) && (!q || content.includes(q));
          card.hidden = !shown;
          if (shown) count++;
        });
        if(counter) counter.textContent = count === 0 ? "لا توجد نتائج" : count === 1 ? "طبيب واحد" : count + " أطباء";
        if(empty) empty.setAttribute("aria-hidden", String(count > 0));
      };
      chips.forEach(btn => btn.addEventListener("click", () => {
        selected = btn.dataset.filterSpecialty;
        chips.forEach(chip => chip.setAttribute("aria-pressed", String(chip === btn)));
        render();
      }));
      if(input) input.addEventListener("input", render);
      render();
    }

    const profile = document.querySelector("[data-doctor-profile]");
    if(profile) {
      const doctors = {
        "1": {name:"د. عبدالله الحربي",short:"د.ع",specialty:"استشاري أمراض القلب والأوعية",label:"القلب",experience:"14 سنة"},
        "2": {name:"د. مها السليمان",short:"د.م",specialty:"استشارية أمراض الباطنية والسكري",label:"الباطنية",experience:"11 سنة"},
        "3": {name:"د. خالد الغامدي",short:"د.خ",specialty:"اختصاصي طب الأسرة",label:"طب الأسرة",experience:"9 سنوات"},
        "4": {name:"د. نورة القحطاني",short:"د.ن",specialty:"اختصاصية العظام والمفاصل",label:"العظام",experience:"8 سنوات"}
      };
      const id = new URLSearchParams(location.search).get("doctor") || "1";
      const doc = doctors[id] || doctors["1"];
      Object.entries({doctorName:doc.name,doctorShort:doc.short,doctorSpecialty:doc.specialty,doctorExperience:doc.experience,doctorCategory:doc.label}).forEach(([slot,value])=>{
        profile.querySelectorAll("[data-"+slot.replace(/[A-Z]/g,m=>"-"+m.toLowerCase())+"]").forEach(el=>el.textContent=value);
      });
      const dayButtons=[...profile.querySelectorAll("[data-day]")];
      const slots=[...profile.querySelectorAll("[data-time]")];
      const summary=profile.querySelector("[data-selection-summary]");
      const msg=profile.querySelector("[data-prototype-message]");
      let day=null,time=null;
      const update=()=>{if(summary)summary.textContent=day && time ? day+"، "+time : "اختر اليوم والوقت أولاً";};
      dayButtons.forEach(button =>button.addEventListener("click",()=>{
        day=button.dataset.day;
        dayButtons.forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
        if(msg)msg.hidden=true;
        update();
      }));
      slots.forEach(button=>button.addEventListener("click",()=>{
        time=button.dataset.time;
        slots.forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
        if(msg)msg.hidden=true;
        update();
      }));
      const form=profile.querySelector("[data-booking-form]");
      if(form)form.addEventListener("submit",event=>{
        event.preventDefault();
        if(!day || !time){if(msg){msg.hidden=false;msg.textContent="اختر اليوم والوقت أولاً لمعاينة خطوات الحجز."; }return;}
        if(msg){msg.hidden=false;msg.textContent="تم اختيار "+doc.name+" — "+day+"، "+time+". هذه معاينة فقط، ولم يتم إرسال أو تسجيل حجز."; }
      });
      update();
    }

    const appointments=document.querySelector("[data-appointment-tabs]");
    if(appointments){
      const buttons=[...appointments.querySelectorAll("[data-appointment-tab]")];
      const sections=[...document.querySelectorAll("[data-appointment-section]")];
      function select(tab){
        buttons.forEach(b=>b.setAttribute("aria-selected",String(b.dataset.appointmentTab===tab)));
        sections.forEach(s=>s.hidden=s.dataset.appointmentSection!==tab);
      }
      buttons.forEach(b=>b.addEventListener("click",()=>select(b.dataset.appointmentTab)));
      select("upcoming");
    }

    const care=document.querySelector("[data-care-request]");
    if(care){
      const options=[...care.querySelectorAll('input[name="care-service"]')];
      const selected=care.querySelector("[data-care-choice]");
      const note=care.querySelector("[data-care-message]");
      const form=care.querySelector("form");
      const render=()=>{
        const v=options.find(x=>x.checked);
        if(selected)selected.textContent=v ? v.dataset.label : "اختر الخدمة المطلوبة";
        if(note)note.hidden=true;
      };
      options.forEach(o=>o.addEventListener("change",render));
      form?.addEventListener("submit",event=>{
        event.preventDefault();
        const option=options.find(x=>x.checked);
        if(!note)return;
        note.hidden=false;
        note.textContent=option ? "تم اختيار «"+option.dataset.label+"» ضمن نموذج الواجهة. لا يوجد حجز فعلي أو إرسال بيانات." : "يرجى اختيار خدمة قبل المتابعة.";
      });
      render();
    }
  });
})();