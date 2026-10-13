/* Yerani V11 patient page interaction — local UI only; no upload and no persistence. */
(() => {
  const run = () => {
    if (!document.body.classList.contains("y11-page")) return;
    const file = document.querySelector("#y11-lab-file");
    if(file) {
      const label = document.querySelector("#y11-file-note");
      const btn = document.querySelector("[data-y11-preview-file]");
      const status = document.querySelector("#y11-file-status");
      const allowed = ["application/pdf", "image/png", "image/jpeg"];
      const max = 8 * 1024 * 1024;
      let ready = false;
      file.addEventListener("change",() => {
        ready = false;
        status.hidden = true;
        const chosen = file.files?.[0];
        if(!chosen) {label.textContent="لم يتم اختيار ملف بعد";btn.disabled=true;return;}
        const okType = allowed.includes(chosen.type) || /\.(pdf|png|jpe?g)$/i.test(chosen.name);
        if(!okType){label.textContent="صيغة الملف غير مدعومة. اختر PDF أو صورة.";btn.disabled=true;return;}
        if(chosen.size>max){label.textContent="حجم الملف يتجاوز 8 ميجابايت.";btn.disabled=true;return;}
        label.textContent="تم اختيار: "+chosen.name+" ("+(chosen.size/1024/1024).toFixed(2)+" ميجابايت)";
        ready=true;btn.disabled=false;
      });
      btn.addEventListener("click",()=>{
        if(!ready)return;
        status.hidden=false;
        status.textContent="تمت معاينة اختيار الملف على جهازك فقط. لم يُرفع الملف ولم يُرسل للطبيب.";
      });
    }
    const buttons = [...document.querySelectorAll("[data-y11-tab]")];
    const panels = [...document.querySelectorAll("[data-y11-panel]")];
    if(buttons.length&&panels.length){
      const pick = value => {
        buttons.forEach(btn=>{const on=btn.dataset.y11Tab===value;btn.setAttribute("aria-selected",String(on));btn.tabIndex=on?0:-1;});
        panels.forEach(p=>p.hidden=p.dataset.y11Panel!==value);
      };
      buttons.forEach((btn,i)=>{
        btn.addEventListener("click",()=>pick(btn.dataset.y11Tab));
        btn.addEventListener("keydown",e=>{
          if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;
          e.preventDefault();let index=i;
          if(e.key==="ArrowLeft")index=(i+1)%buttons.length;
          if(e.key==="ArrowRight")index=(i-1+buttons.length)%buttons.length;
          if(e.key==="Home")index=0;
          if(e.key==="End")index=buttons.length-1;
          pick(buttons[index].dataset.y11Tab);buttons[index].focus();
        });
      });
      pick("all");
    }
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);else run();
})();