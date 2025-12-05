/**
 * GPT-4.1を用いて翻訳用Developer指示付きの対話を繰り返し、履歴を追跡する例。
 */

import 'dotenv/config'
import OpenAI from 'openai'
import { readFileSync } from 'fs'

const client = new OpenAI()

// ファイルからテキストを読み取る
const fileText = readFileSync('input.txt', 'utf-8')

const input: OpenAI.Responses.ResponseCreateParams['input'] = [
  {
    role: 'developer',
    content:
      'あなたは法律専門家であり、実務家や法科大学院生向けに判例要約を作成するAIです。userの投げかける判決文を分析し、最新判例の要旨を簡潔に整理してください。',
  },
  {
    role: 'user',
    content: fileText,
  }
]

async function main() {
  const response = await client.responses.create({
    model: 'gpt-4.1',
    temperature: 0,
    input,
  })
  console.log('要約:', response.output_text)
}

main()