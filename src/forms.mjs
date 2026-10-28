import { project } from './project.mjs';

export function leadForm({ compact = false } = {}) {
  const id = compact ? 'hero-enquiry' : 'enquiry-form';
  const heading = compact ? 'Get Navera pricing <br>& floor plans.' : 'Request Navera information';
  return `<form id="${id}" class="enquiry-form${compact ? ' hero-form' : ''}" data-lead-form data-form-name="${compact ? 'hero' : 'contact'}" action="/api/register" method="post" aria-labelledby="${id}-heading">
    ${compact ? '<p class="eyebrow">YOUR NEXT HOME STARTS HERE</p>' : ''}
    <h2 id="${id}-heading" class="form-heading">${heading}</h2>
    <p class="form-intro" data-delivery-note>Prepare an email enquiry for Team Arora to review and send from your email app.</p>
    ${compact ? '<label>Full name <span aria-hidden="true">*</span><input name="fullName" autocomplete="name" required maxlength="160" placeholder="Your name"></label>' : '<div class="form-grid"><label>First name <span aria-hidden="true">*</span><input name="firstName" autocomplete="given-name" required maxlength="80"></label><label>Last name <span aria-hidden="true">*</span><input name="lastName" autocomplete="family-name" required maxlength="80"></label></div>'}
    <label>Email address <span aria-hidden="true">*</span><input name="email" type="email" autocomplete="email" required maxlength="254"${compact ? ' placeholder="you@example.com"' : ''}></label>
    <label>Phone number <span aria-hidden="true">*</span><input name="phone" type="tel" autocomplete="tel" required minlength="10" maxlength="40"${compact ? ' placeholder="Your phone number"' : ''}></label>
    <fieldset class="realtor-choice"><legend>Are you a REALTOR®? <span aria-hidden="true">*</span></legend><div class="radio-options"><label><input type="radio" name="isRealtor" value="yes" required>Yes</label><label><input type="radio" name="isRealtor" value="no" required>No</label></div></fieldset>
    ${compact ? '<input type="hidden" name="interest" value="Help me decide"><input type="hidden" name="workingWithRealtor" value="Not provided">' : '<div class="form-grid"><label>Interested in <span aria-hidden="true">*</span><select name="interest" required><option value="">Select a collection</option><option>38 Series</option><option>41 Series</option><option>Both collections</option><option>Help me decide</option></select></label><label>Working with a REALTOR®? <span aria-hidden="true">*</span><select name="workingWithRealtor" required><option value="">Please select</option><option>No</option><option>Yes</option></select></label></div><label>What would you like to know?<textarea name="message" rows="3" maxlength="1500" placeholder="Pricing, floor plans, timing, or your home wish list…"></textarea></label>'}
    <div class="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
    <label class="check-label"><input name="consent" type="checkbox" required><span>I agree to be contacted by Team Arora about my Navera enquiry and have read the <a href="/privacy/">privacy information</a>. <span aria-hidden="true">*</span></span></label>
    <button class="button" type="submit" data-submit-enquiry>Prepare email enquiry <span aria-hidden="true">↗</span></button>
    <p class="form-status" data-form-status role="status" aria-live="polite"></p>
    <a class="email-fallback" data-email-fallback hidden>Open your prepared email <span aria-hidden="true">↗</span></a>
    <p class="form-operator">Enquiries handled by <strong>Team Arora</strong>.<br>Independent real estate information. No property reservation.</p>
    <noscript><p><a href="mailto:${project.email}?subject=Navera%20at%20Mayfield%20Village%20enquiry">Email Team Arora</a> or call <a href="tel:+14169108923">${project.phone}</a>. This form needs JavaScript.</p></noscript>
  </form>`;
}
