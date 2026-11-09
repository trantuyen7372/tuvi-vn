import Anthropic from '@anthropic-ai/sdk';
import { buildChart, validateInput } from '../tuvi';
import { DEMO_TEXT, SYSTEM_PROMPT, userPrompt, referenceBlock } from '../prompt';
import { lookupReference, DIM_LABEL } from '../dataset';
import { get, run } from './db';
import { claimReading, finishReading, failReading, saveReadingProgress } from './jobs';
import { emailReading } from './email';
import {personalReading} from '../personal-reading';
import {demoMode} from '../customers/auth';
import {boundedReadingReference,readingModelOptions} from './ai-config';

export async function generate(id: string) {
  const job = claimReading(id);
  if (job.state === 'exhausted') throw new Error('Đã hết số lần thử. Vui lòng liên hệ hỗ trợ.');
  if (job.state !== 'claimed') return;
  const reading = job.reading;
  let text = DEMO_TEXT;
  let saved = false;
  let partialText='';
  try {
    const input = validateInput(JSON.parse(reading.input));
    const order = get<{ product: string }>('SELECT product FROM orders WHERE id=?', reading.order_id);
    const defaultEngine = process.env.READING_ENGINE || 'dataset';
    const engine = defaultEngine === 'demo' ? 'demo' : (order?.product === 'deep' && process.env.ANTHROPIC_API_KEY) ? 'anthropic' : defaultEngine;
    if(engine==='demo'){
      if(!demoMode())throw Error('Văn bản mẫu chỉ dùng trong môi trường thử riêng');
    }else if(engine==='dataset'){
      const chart=buildChart({...input,name:''});text=personalReading(chart,lookupReference(chart.solarIso,input.hour,input.gender));
    }else if(engine==='anthropic'){
      if(!process.env.ANTHROPIC_API_KEY)throw Error('Dịch vụ luận giải chưa được cấu hình');
      const chart = buildChart({ ...input, name: '' });
      const source = lookupReference(chart.solarIso, input.hour, input.gender);
      const bounded=boundedReadingReference(source,input.reading);
      const reference = referenceBlock(bounded, DIM_LABEL);
      // Only use an explicit app setting, not an unrelated endpoint inherited by a shell.
      const client = new Anthropic({baseURL:process.env.TUVI_ANTHROPIC_BASE_URL||'https://api.anthropic.com',timeout:10*60000,maxRetries:0});
      const model = process.env.TUVI_MODEL || 'claude-sonnet-5-5';
      const started=Date.now();
      let firstTextMs:number|null=null,lastSaved=0;
      const stream = client.messages.stream({
        model,
        ...readingModelOptions(model),
        max_tokens: 16000,
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: userPrompt(chart, reference, input.reading) }],
      });
      stream.on('text',delta=>{
        partialText+=delta;
        const now=Date.now();
        if(firstTextMs===null)firstTextMs=now-started;
        if(now-lastSaved>=1000){
          if(!saveReadingProgress(reading,partialText))stream.abort();
          lastSaved=now;
        }
      });
      const message = await stream.finalMessage();
      const usage = message.usage;
      const inPrice = Number(process.env.AI_INPUT_VND_PER_MILLION), outPrice = Number(process.env.AI_OUTPUT_VND_PER_MILLION);
      const knownCost = Number.isFinite(inPrice) && inPrice > 0 && Number.isFinite(outPrice) && outPrice > 0;
      const cacheWrite=usage.cache_creation_input_tokens||0,cacheRead=usage.cache_read_input_tokens||0;
      const cacheRate=/^claude-(?:sonnet|opus)-5-5(?:-|$)/.test(message.model)?0.05:/^claude-(?:fable|mythos)-5-1(?:-|$)/.test(message.model)?0.025:0.1;
      const cost = knownCost ? ((usage.input_tokens+cacheWrite*1.25+cacheRead*cacheRate)*inPrice+usage.output_tokens*outPrice)/1e6 : null;
      run('INSERT INTO ai_usage (reading_id,model,input_tokens,output_tokens,cost_vnd,created) VALUES (?,?,?,?,?,?)',
        id, model, usage.input_tokens, usage.output_tokens, cost, Date.now());
      run('INSERT INTO audit_log(action,target,detail,created) VALUES (?,?,?,?)','ai_generation',id,JSON.stringify({model:message.model,firstTextMs,durationMs:Date.now()-started,inputTokens:usage.input_tokens,cacheWrite,cacheRead,outputTokens:usage.output_tokens,stopReason:message.stop_reason}),Date.now());
      if (message.stop_reason !== 'end_turn') throw new Error('Bài luận chưa hoàn thành');
      text = message.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
      if (!text.trim()) throw new Error('Bài luận trống');
    }else throw Error('Chế độ luận giải không hợp lệ');
    saved = finishReading(reading, text);
  } catch {
    if(partialText)saveReadingProgress(reading,partialText);
    failReading(reading);
    throw new Error('Chưa tạo được bài luận. Có thể thử lại tối đa 3 lần; nếu hết lần thử, lượt được trả lại và cần liên hệ hỗ trợ.');
  }
  // Lỗi gửi email không được biến bài đã hoàn thành thành bài lỗi để gọi tạo lại.
  if (saved) await emailReading({ ...reading, text }).catch(() => {});
}
