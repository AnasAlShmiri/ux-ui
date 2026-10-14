/* Yerani V16 — UI-only authentication forms. No credential storage or HTTP calls. */
(()=>{
"use strict";
const ready=()=> {
  if(!document.body.classList.contains("auth-v16"))return;
  document.querySelectorAll("[data-auth-password-toggle]").forEach(button=>{
    const field=document.getElementById(button.dataset.authPasswordToggle);
    if(!field)return;
    button.addEventListener("click",()=>{
      const isShown=field.type==="text";
      field.type=isShown?"password":"text";
      button.setAttribute("aria-label",isShown?"إظهار كلمة المرور":"إخفاء كلمة المرور");
      button.setAttribute("aria-pressed",String(!isShown));
    });
  });
  document.querySelectorAll("[data-auth-form]").forEach(form=>{
    const message=form.querySelector("[data-auth-response]");
    const password=form.querySelector('[name="password"]'),confirmation=form.querySelector('[name="confirmPassword"]');
    confirmation?.addEventListener("input",()=>confirmation.setCustomValidity(""));
    password?.addEventListener("input",()=>confirmation?.setCustomValidity(""));
    form.addEventListener("submit",event=>{
      event.preventDefault();
      if(confirmation&&password){confirmation.setCustomValidity(password.value===confirmation.value?"":"تأكيد كلمة المرور لا يطابق كلمة المرور.");}
      if(!form.reportValidity()){if(confirmation?.validationMessage)confirmation.focus();return;}
      const role=form.dataset.authForm;
      if(!message)return;
      message.hidden=false;
      if(role==="login"){
        message.textContent="هذه معاينة لتصميم شاشة تسجيل الدخول. لم تُرسل بيانات الدخول، ولم يتم التحقق من حساب أو فتح جلسة. المصادقة الفعلية تتطلب ربط النظام بخادم آمن.";
      }else if(role==="register"){
        message.textContent="اكتملت معاينة نموذج تسجيل المريض. لم يُنشأ حساب ولم تُحفظ أو تُرسل أي بيانات أو كلمة مرور.";
      }else{
        message.textContent="اكتملت معاينة طلب استعادة كلمة المرور. لم تُرسل رسالة أو رمز تحقق؛ هذه الوظيفة تتطلب ربط النظام بخدمة مصادقة.";
      }
      message.scrollIntoView({behavior:"auto",block:"nearest"});
    });
    for(const input of form.querySelectorAll("input,select"))input.addEventListener("input",()=>{if(message)message.hidden=true});
  });
};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready);else ready();
})();