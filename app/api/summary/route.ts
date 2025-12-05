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
あなたは優秀な裁判官です。以下の手順に従って判決文を要約してください。

1. テキストが長文の場合は、自動的に意味ごとに数段落（または数章）に分割してください。
2. 各部分ごとに箇条書きで重要なポイントを短く要約してください。
3. そのうえで、全体を通したまとめ・要旨を以下の出力形式に沿って簡潔に記載してください。

**出力形式:**
- 事案の概要（日本語250文字以内）:
- 主要な法的論点（日本語250文字以内）:
- 最高裁の判断（日本語250文字以内）:
- 判例の意義（日本語250文字以内）:

--- テキスト ---
${text}
  `
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2048, // 必要に応じ調整
    temperature: 0
  })
  return NextResponse.json({ result: completion.choices[0]?.message?.content })
}