/**
 * 会話履歴にユーザと固定のアシスタント発話を埋め込み、後続メッセージに対する応答を取得する例。
 */

import 'dotenv/config'
import OpenAI from 'openai'

const client = new OpenAI();

async function main() {
  const response = await client.responses.create({
    model: 'gpt-4.1',
    temperature: 0,
    input: [
      { role: 'user', content: 'おはよう' },
      { role: 'assistant', content: 'Good morning' },
      { role: 'user', content: 'こんにちは' },
      { role: 'assistant', content: 'Hello' },
      { role: 'user', content: 'こんばんは' },
    ],
  });
  // GPT-4.1の応答を表示
  console.log(response.output_text);
}

main();