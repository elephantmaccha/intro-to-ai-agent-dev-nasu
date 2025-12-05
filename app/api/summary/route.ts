import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'stream'
import OpenAI from 'openai'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const file = data.get('file') as File
  const text = await file.text()
  // 要約プロンプト
  const prompt = `
あなたは法律専門家であり、実務家や法科大学院生向けに判例要約を作成するAIです。
以下の判決文を分析し、最新判例の要旨を簡潔に整理してください。

1. 事案の概要（誰が・何を・どのように訴えたのか）
2. 主要な法的論点
3. 最高裁の判断の詳細
4. 判例の意義

**出力形式:**
- 事案の概要:
- 主要な法的論点:
- 最高裁の判断:
- 判例の意義:

判決文:
${text}
  `
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview', // gpt-4.1リリース時点のAPI名
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2048, // 必要に応じ調整
    temperature: 0
  })
  return NextResponse.json({ result: completion.choices[0]?.message?.content })
}