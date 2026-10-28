export default function handler(req,res) {
  res.setHeader('Content-Type','application/json');
  res.setHeader('Cache-Control','no-store');
  if (req.method !== 'GET') {res.statusCode=405;res.end(JSON.stringify({error:'Method not allowed.'}));return;}
  res.end(JSON.stringify({onlineDelivery:Boolean(process.env.LEAD_API_URL && process.env.LEAD_API_TOKEN && process.env.LEAD_IP_SALT)}));
}
