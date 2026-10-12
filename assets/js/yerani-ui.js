/* Yerani prototype enhancements. No backend, medical inference or persistent state. */
(() => {
'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const notice=document.createElement('div');notice.className='yerani-demo-notice';notice.setAttribute('role','note');notice.textContent='واجهة توضيحية — البيانات تجريبية ولا تمثل سجلات طبية حقيقية';
 if(document.querySelector('.admin-content'))document.querySelector('.admin-content').prepend(notice);
 const css=document.createElement('style');css.textContent='.yerani-demo-notice{padding:9px 14px;background:#E4F4F0;border:1px solid #B4DFDD;border-radius:12px;margin-bottom:16px;color:#0F5946;font-size:.79rem}.yerani-demo-notice:empty{display:none}';
 document.head.appendChild(css);
 document.querySelectorAll('.admin-nav-item[href],.bottom-nav-item[href]').forEach(link=>{const here=location.pathname.split('/').pop();if(link.getAttribute('href')===here){link.setAttribute('aria-current','page');}});
 document.querySelectorAll('a[href="#"]').forEach(link=>{link.setAttribute('aria-disabled','true');link.addEventListener('click',ev=>ev.preventDefault())});
});
})();