import { test } from 'node:test';
import assert from 'node:assert/strict';
import { register } from '../lib/registration.js';
import { leadForm } from '../src/forms.mjs';

const base = {fullName:'Avery Singh',email:'avery@example.com',phone:'4165550123',isRealtor:'yes',interest:'Help me decide',workingWithRealtor:'Not provided',heardAbout:'Navera hero form',formName:'hero',consent:true};
const env={LEAD_API_URL:'https://example.com/lead',LEAD_API_TOKEN:'hero-unit-test',LEAD_IP_SALT:'hero-unit-test'};
const request = data => new Request('https://naveraatmayfieldvillage.com/api/register',{method:'POST',headers:{origin:'https://naveraatmayfieldvillage.com','content-type':'application/json','cf-connecting-ip':'192.0.2.88'},body:JSON.stringify(data)});

test('compact lead saves the explicit REALTOR answer and hero attribution for both answers',async()=>{
  for(const answer of ['yes','no']) {
    let row;
    const response=await register(request({...base,isRealtor:answer}),env,async(url,options)=>{row=JSON.parse(options.body);return new Response(null,{status:201});});
    assert.equal((await response.json()).leadAccepted,true);
    assert.equal(row.name,'Avery Singh');
    assert.equal(row.details.firstName,'Avery');
    assert.equal(row.details.lastName,'Singh');
    assert.equal(row.details.formName,'hero');
    assert.equal(row.details.isRealtor,answer);
    assert.equal(row.details.workingWithRealtor,'Not provided');
  }
});
test('blank or invalid REALTOR answer cannot create a lead',async()=>{
  for(const answer of ['',undefined,'yess','unknown']) {
    const response=await register(request({...base,isRealtor:answer}),env,()=>{throw Error('must not save');});
    assert.equal(response.status,400);
  }
});
test('a visitor with a single name can use the compact form without an invented surname',async()=>{
  let row;
  const response=await register(request({...base,fullName:'Avery'}),env,async(url,options)=>{row=JSON.parse(options.body);return new Response(null,{status:201});});
  assert.equal(response.status,200);
  assert.equal(row.name,'Avery');
  assert.equal(row.details.lastName,'');
});
test('both forms require a separate REALTOR choice and consent without a preset answer',()=>{
  for(const compact of [true,false]) {
    const html=leadForm({compact});
    assert.match(html,/name="isRealtor" value="yes" required/);
    assert.match(html,/name="isRealtor" value="no" required/);
    assert.ok(!html.includes(' checked'));
    assert.match(html,/name="consent" type="checkbox" required/);
  }
});
