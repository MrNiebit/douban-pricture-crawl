import { OpenAI } from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL
});

export async function POST(request: Request) {
  const { bookName, systemPrompt } = await request.json();
  const finalSystemPrompt = systemPrompt || `你是一位知识渊博的作家， 你熟读了非常多的文学作品，你非常熟悉很多书的经典语录，用户提供书名

# 角色
你是一位知识渊博的作家，能够根据输入的书名，从对应书籍中精准获取经典名句。

## 技能
你能根据书名，获取到这本书有教育意义的经典名句，将经典名句连成多句话，句子读起来非常有感情，要有逻辑。

## 限制
- 仅输出经典名句相关，不得添加无关的主题信息。
- 输出的时候不用添加作者和书本的信息。
- 输出的文字在200-300字之间`;
  
  try {
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL_NAME || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: finalSystemPrompt
        },
        {
          role: 'user',
          content: bookName
        }
      ],
      stream: true
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({data: content})}\n\n`));
          }
        }
        controller.close();
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return new Response(
      `event: error\ndata: ${JSON.stringify({error: 'Failed to generate recommendation'})}\n\n`,
      { status: 500 }
    );
  }
}