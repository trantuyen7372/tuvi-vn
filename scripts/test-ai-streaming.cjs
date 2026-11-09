require('./register-server-only.cjs');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),http=require('node:http');
const assert=require('node:assert/strict'),ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{
  compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true},
}).outputText,filename);
process.env.TUVI_DB_PATH=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tuvi-ai-stream-')),'test.sqlite');
process.env.ANTHROPIC_API_KEY='local-simulation-key';
process.env.ANTHROPIC_BASE_URL='https://invalid-inherited-endpoint.example';
process.env.READING_ENGINE='anthropic';process.env.TUVI_MODEL='claude-sonnet-5-5';
process.env.RESEND_API_KEY='';process.env.MAIL_FROM='';
process.env.AI_INPUT_VND_PER_MILLION='100';process.env.AI_OUTPUT_VND_PER_MILLION='500';
const {get,run}=require('../lib/commerce/db.ts');
const {createOrder,reserveReading}=require('../lib/commerce/store.ts');
const {generate}=require('../lib/commerce/generate.ts');
const {claimReading,saveReadingProgress,failReading}=require('../lib/commerce/jobs.ts');
const {boundedReadingReference,readingModelOptions}=require('../lib/commerce/ai-config.ts');
const {buildChart}=require('../lib/tuvi.ts');
const {lookupReference,DIM_LABEL}=require('../lib/dataset.ts');
const {userPrompt,referenceBlock}=require('../lib/prompt.ts');
const input={name:'Tên riêng không gửi cho AI',gender:'nam',calendar:'duong',date:'1992-04-09',hour:4,leap:false,year:2026,
  reading:{focus:'career',situation:'changing',note:'Đang cân nhắc đổi hướng công việc.'}};
const prefix='## Tổng quan bản mệnh\n\nNội dung mở đầu đã sẵn sàng để đọc.';
const suffix='\n\n## Công danh, sự nghiệp\n\nNội dung tiếp theo.\n\nTử Vi mang tính tham khảo, cuộc sống do chính mình quyết định.';
const requests=[],checks=[];
let scenario='success',release;
const server=http.createServer(async(req,res)=>{
  if(req.method!=='POST'||req.url!=='/v1/messages'){res.writeHead(501);res.end();return;}
  let raw='';for await(const chunk of req)raw+=chunk;
  const body=JSON.parse(raw);requests.push({body,scenario});
  if(scenario==='rate-limit'){res.writeHead(429,{'Content-Type':'application/json'});res.end(JSON.stringify({type:'error',error:{type:'rate_limit_error',message:'Simulated 429'}}));return;}
  res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache'});
  const send=event=>res.write('event: '+event.type+'\ndata: '+JSON.stringify(event)+'\n\n');
  send({type:'message_start',message:{id:'msg_local',type:'message',role:'assistant',model:body.model,content:[],stop_reason:null,stop_sequence:null,
    usage:{input_tokens:100,output_tokens:0,cache_creation_input_tokens:20,cache_read_input_tokens:40}}});
  send({type:'content_block_start',index:0,content_block:{type:'text',text:''}});
  send({type:'content_block_delta',index:0,delta:{type:'text_delta',text:prefix}});
  const current=scenario;
  release=()=>{
    if(current==='disconnect'){res.destroy();return;}
    send({type:'content_block_delta',index:0,delta:{type:'text_delta',text:suffix}});
    send({type:'content_block_stop',index:0});
    send({type:'message_delta',delta:{stop_reason:current==='truncated'?'max_tokens':'end_turn',stop_sequence:null},usage:{output_tokens:120}});
    send({type:'message_stop'});res.end();
  };
});
function fixture(){
  const o=createOrder('stream-'+Date.now()+'-'+Math.random()+'@example.invalid','deep',input,'','local-test');
  run("UPDATE orders SET status='paid' WHERE id=?",o.order.id);
  run('INSERT INTO credits VALUES (?,?,1)',o.order.id,o.order.email);
  return reserveReading({...o.order,status:'paid'},input);
}
async function waitFor(predicate){
  const until=Date.now()+5000;
  while(Date.now()<until){if(predicate())return;await new Promise(resolve=>setTimeout(resolve,20));}
  throw Error('Timed out waiting for partial content');
}
const row=id=>get('SELECT * FROM readings WHERE id=?',id);
async function main(){
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  process.env.TUVI_ANTHROPIC_BASE_URL='http://127.0.0.1:'+server.address().port;
  const chart=buildChart({...input,name:''}),source=lookupReference(chart.solarIso,input.hour,input.gender);
  assert.ok(source);
  const bounded=boundedReadingReference(source,input.reading);
  assert.deepEqual(Object.keys(bounded).sort(),Object.keys(source).filter(k=>source[k].trim()).sort());
  const referenceCharacters=Object.values(bounded).join('').length;
  assert.ok(referenceCharacters<=8000);
  assert.equal(Object.keys(bounded)[0],'career');
  const longSource=Object.fromEntries(Object.keys(source).map(key=>[key,'Nội dung tham khảo. '.repeat(300)]));
  const focused=boundedReadingReference(longSource,input.reading);
  assert.ok(focused.career.length>focused.health.length);
  const reference=referenceBlock(bounded,DIM_LABEL);
  const fullPrompt=userPrompt(chart,reference,input.reading);
  assert.ok(fullPrompt.includes('2026')&&fullPrompt.includes('2030'));
  assert.ok(fullPrompt.includes('Thất Sát')&&fullPrompt.includes('Phá Quân'));
  assert.equal(boundedReadingReference(null),null);
  assert.deepEqual(readingModelOptions('claude-opus-5-5'),{});
  assert.equal(readingModelOptions('claude-sonnet-4-6').thinking.type,'disabled');
  checks.push('Reference budget preserves subjects, chart facts and requested years');

  const reading=fixture(),work=generate(reading.id);
  await waitFor(()=>row(reading.id).text.includes(prefix));
  assert.equal(row(reading.id).status,'running');
  assert.equal(row(reading.id).completed,null);
  assert.equal(get('SELECT reading_id FROM ai_usage WHERE reading_id=?',reading.id),undefined);
  await generate(reading.id);assert.equal(requests.length,1);
  const sent=requests[0].body;
  assert.equal(sent.model,'claude-sonnet-5-5');assert.equal(sent.thinking.type,'between_tools');
  assert.equal(sent.output_config.effort,'medium');
  assert.ok(!JSON.stringify(sent).includes(input.name));
  assert.ok(JSON.stringify(sent).includes(input.reading.note));
  checks.push('Real SDK publishes partial text before HTTP stream completes; concurrent request does not call AI again');
  release();await work;
  assert.equal(row(reading.id).status,'done');assert.equal(row(reading.id).text,prefix+suffix);
  assert.equal(row(reading.id).email_status,'not_configured');
  await generate(reading.id);assert.equal(requests.length,1);
  const usage=get('SELECT * FROM ai_usage WHERE reading_id=?',reading.id);
  assert.equal(usage.cost_vnd,(100*100+20*1.25*100+40*0.05*100+120*500)/1e6);
  const detail=JSON.parse(get("SELECT detail FROM audit_log WHERE action='ai_generation' AND target=?",reading.id).detail);
  assert.ok(detail.firstTextMs>=0&&detail.durationMs>=detail.firstTextMs);
  checks.push('Completed reading and timings are saved, cache costs included, rereading performs no API request');

  for(const mode of ['truncated','disconnect']){
    scenario=mode;const test=fixture(),pending=generate(test.id);
    // Observe the rejection immediately, while still asserting the draft before releasing the stream.
    const outcome=pending.then(()=>null,error=>error);
    await waitFor(()=>row(test.id).text.includes(prefix));
    release();assert.ok(await outcome instanceof Error);
    assert.equal(row(test.id).status,'error');assert.ok(row(test.id).text.includes(prefix));
    assert.equal(row(test.id).completed,null);assert.equal(row(test.id).email_status,'pending');
    const next=claimReading(test.id);assert.equal(next.state,'claimed');
    assert.equal(row(test.id).text,'');failReading(next.reading);
    checks.push(mode+': draft retained but never marked complete or emailed; retry clears previous draft');
  }
  scenario='rate-limit';const limited=fixture(),before=requests.length;
  await assert.rejects(generate(limited.id));assert.equal(requests.length,before+1);
  assert.equal(row(limited.id).status,'error');assert.equal(row(limited.id).text,'');
  checks.push('429 is not automatically retried or misreported as complete');

  const stale=fixture(),old=claimReading(stale.id);
  old.reading.lease=1;run('UPDATE readings SET lease=1 WHERE id=?',stale.id);
  const fresh=claimReading(stale.id);
  assert.equal(saveReadingProgress(old.reading,'stale draft'),false);
  assert.equal(saveReadingProgress(fresh.reading,'fresh draft'),true);
  assert.equal(row(stale.id).text,'fresh draft');failReading(fresh.reading);
  checks.push('Expired worker cannot overwrite progress of a new attempt');
  const report={passed:true,checks,requests:requests.length,referenceCharacters,userPromptCharacters:fullPrompt.length,
    evidence:'Application generator + actual Anthropic SDK against a local HTTP SSE stand-in; no real API calls.',
    limitations:'Does not establish provider latency or content quality. Installed Postman CLI 1.13.1 lacks Simulation; provider-owner mock search was unavailable.',
    sources:['https://platform.claude.com/docs/en/build-with-claude/streaming','https://platform.claude.com/docs/en/build-with-claude/thinking']};
  fs.writeFileSync('reports/ai-streaming-tests.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>{server.closeAllConnections();server.close();});
