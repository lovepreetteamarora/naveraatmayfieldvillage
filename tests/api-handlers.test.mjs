import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import handler from '../api/register.js';
import statusHandler from '../api/status.js';

function responseRecorder() {
  return {statusCode:200,headers:{},setHeader(key,value){this.headers[key]=value;},end(value){this.body=JSON.parse(String(value));}};
}
test('Vercel adapter forwards parsed JSON and only confirms a saved enquiry', async () => {
  const saved = Object.fromEntries(['LEAD_API_URL','LEAD_API_TOKEN','LEAD_IP_SALT'].map(k=>[k,process.env[k]]));
  const originalFetch = globalThis.fetch;
  Object.assign(process.env,{LEAD_API_URL:'https://example.com/lead',LEAD_API_TOKEN:'test-only',LEAD_IP_SALT:'adapter-test'});
  let payload;
  globalThis.fetch = async (url,options) => {payload=JSON.parse(options.body);return new Response(null,{status:201});};
  try {
    const req = Readable.from([]);
    req.method='POST';
    req.headers={'content-type':'application/json',origin:'https://naveraatmayfieldvillage.com','x-vercel-forwarded-for':'192.0.2.44'};
    req.body={firstName:'Preview',lastName:'Test',email:'preview@example.com',phone:'4165550123',interest:'38 Series',workingWithRealtor:'No',isRealtor:'no',heardAbout:'Navera website',consent:true,message:'Please send current plans.',pageUrl:'https://naveraatmayfieldvillage.com/contact/?utm_source=preview&private=discard'};
    const res=responseRecorder();await handler(req,res);
    assert.equal(res.statusCode,200);
    assert.equal(res.body.leadAccepted,true);
    assert.equal(payload.message,'Please send current plans.');
    assert.equal(payload.domain,'naveraatmayfieldvillage.com');
    assert.equal(payload.details.interest,'38 Series');
    assert.equal(payload.referer,'https://naveraatmayfieldvillage.com/contact/');
    assert.ok(!JSON.stringify(payload).includes('192.0.2.44'));
    const status=responseRecorder();statusHandler({method:'GET'},status);
    assert.equal(status.body.onlineDelivery,true);
    assert.ok(!JSON.stringify(status.body).includes('test-only'));
  } finally {
    globalThis.fetch=originalFetch;
    for (const [key,value] of Object.entries(saved)) {if(value===undefined)delete process.env[key];else process.env[key]=value;}
  }
});
test('Vercel endpoint rejects a native form POST and GET without pretending to send',async()=>{
  for(const method of ['GET','POST']) {
    const req=Readable.from([]);req.method=method;req.headers={origin:'https://naveraatmayfieldvillage.com','content-type':'application/x-www-form-urlencoded'};req.body='firstName=Preview';
    const res=responseRecorder();await handler(req,res);
    assert.equal(res.statusCode,method==='GET'?405:415);
    assert.notEqual(res.body.leadAccepted,true);
  }
});
