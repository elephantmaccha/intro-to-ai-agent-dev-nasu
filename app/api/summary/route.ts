import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'stream'
import OpenAI from 'openai'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const file = data.get('file') as File
  const text = await file.text()

  // 指定プロンプトを組み込み
  const prompt = `
あなたは法律専門家であり、実務家や法科大学院生向けに判例要約を作成するAIです。
A、B、Cの点に留意して以下の判決文を分析し、最新判例の要旨を簡潔に整理してください。
A. テキストが長文の場合は、自動的に意味ごとに数段落（または数章）に分割してください。
B. 各部分ごとに箇条書きで重要なポイントを短く要約してください。
C. そのうえで、全体を通したまとめ・要旨を以下の出力形式に沿って簡潔に記載してください。

1. **事案の概要**（誰が・何を・どのように訴えたのか）
   - 事実関係を簡潔に説明
   - 第1審・控訴審の判断については一言程度の説明で十分

2. **主要な法的論点**
   - 判決に関わる主要な条文と論点を整理
   - 最高裁の判断に関係する論点を特に詳しく記述

3. **最高裁の判断の詳細**
   - 最高裁がどのような法的解釈をしたか
   - 下級審の判断のどこに問題があったのか
   - どのような理由で破棄・変更・維持されたのか
   - 特に、最高裁が示した新たな法的基準がある場合は重点的に説明

4. **判例の意義**
   - この判例が今後の実務にどのような影響を与える可能性があるか
   - 先例との関係（変更があれば明示）

**判決文:** 

${text}

**出力形式:**
- **事案の概要（日本語250文字以内）:** （簡潔にまとめる）
- **主要な法的論点（日本語250文字以内）:** （関係する法律・条文を記載）
- **最高裁の判断（日本語250文字以内）:** （詳細な分析）
- **判例の意義（日本語250文字以内）:** （実務上の影響を説明）

※ 本プロンプトは、判例を理解しやすく整理するためのものです。最高裁の判断に重点を置き、下級審の判断は簡潔に触れるにとどめてください。
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