const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-navigation');
function closeMenu(focus = false) {
  nav?.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
  if (focus) menu?.focus();
}
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') closeMenu(true); });
matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const dialog = document.querySelector('#image-dialog');
let galleryOpener;
document.querySelectorAll('[data-gallery]').forEach(link => link.addEventListener('click', event => {
  if (!dialog?.showModal) return;
  event.preventDefault();
  galleryOpener = link;
  const original = link.querySelector('img');
  const enlarged = document.querySelector('#lightbox-image');
  enlarged.src = link.href;
  enlarged.alt = original.alt;
  enlarged.width = original.width;
  enlarged.height = original.height;
  document.querySelector('#lightbox-caption').textContent = link.dataset.caption;
  dialog.showModal();
}));
document.querySelector('.lightbox-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog?.addEventListener('close', () => galleryOpener?.focus());

const forms = [...document.querySelectorAll('[data-lead-form]')];
const deliveryReady = forms.length ? fetch('/api/status', { signal: AbortSignal.timeout(4000) })
  .then(r => r.ok ? r.json() : null).then(result => result?.onlineDelivery === true).catch(() => false) : Promise.resolve(false);
for (const form of forms) {
  let onlineDelivery = false;
  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('[data-submit-enquiry]');
  const fallback = form.querySelector('[data-email-fallback]');
  const compact = form.dataset.formName === 'hero';
  const buttonLabel = compact ? 'Request pricing & floor plans' : 'Send enquiry';
  const query = new URLSearchParams(location.search).get('interest');
  const interest = form.elements.interest;
  if (interest.tagName === 'SELECT' && [...interest.options].some(option => option.value === query)) interest.value = query;
  deliveryReady.then(ready => {
    onlineDelivery = ready;
    if (!ready) return;
    form.querySelector('[data-delivery-note]').textContent = compact
      ? 'Request the latest available information from Team Arora.'
      : 'Send your enquiry securely to Team Arora. We will confirm here after it has been saved.';
    submit.innerHTML = `${buttonLabel} <span aria-hidden="true">↗</span>`;
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity() || submit.disabled) return;
    const d = new FormData(form);
    if (d.get('website')) return;
    const phoneDigits = String(d.get('phone')).replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      status.textContent = 'Enter a phone number with 10 to 15 digits.';
      status.classList.add('error');
      form.elements.phone.focus();
      return;
    }
    const data = Object.fromEntries(d);
    data.consent = d.has('consent');
    data.formName = form.dataset.formName;
    data.heardAbout = compact ? 'Navera hero form' : 'Navera contact page';
    data.smsConsent = false;
    data.pageUrl = location.href;
    const displayName = data.fullName || `${data.firstName} ${data.lastName}`;
    const body = `Navera at Mayfield Village enquiry\n\nName: ${displayName}\nEmail: ${data.email}\nPhone: ${data.phone}\nAre you a REALTOR: ${data.isRealtor}\nCollection: ${data.interest}\nWorking with a REALTOR: ${data.workingWithRealtor}\n\nMessage:\n${data.message || 'Please send current pricing and floor-plan information.'}\n\nContact permission: I agree to be contacted by Team Arora about this Navera enquiry.\nSource: ${location.origin}${location.pathname}`;
    fallback.href = `mailto:parveen@teamarora.com?subject=${encodeURIComponent('Navera at Mayfield Village enquiry')}&body=${encodeURIComponent(body)}`;
    status.classList.remove('error');
    if (!onlineDelivery) {
      fallback.hidden = false;
      status.textContent = 'Your email draft is ready. Open it below, review the details, and send it from your email app. No enquiry has been sent by this website.';
      fallback.focus();
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Sending enquiry…';
    status.textContent = 'Saving your enquiry…';
    try {
      const response = await fetch('/api/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data), signal:AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok || result.leadAccepted !== true) throw new Error(result.error || 'We could not save your enquiry. Please try again or contact Team Arora by email.');
      status.textContent = result.message;
      form.reset();
      submit.textContent = 'Enquiry received';
      fallback.hidden = true;
    } catch (error) {
      status.classList.add('error');
      status.textContent = error.name === 'TimeoutError' ? 'The request timed out. Please call Team Arora before retrying so we can check whether it was received, or use the prepared email below.' : error.message;
      fallback.hidden = false;
      submit.disabled = false;
      submit.innerHTML = 'Try again <span aria-hidden="true">↗</span>';
    }
  });
}
