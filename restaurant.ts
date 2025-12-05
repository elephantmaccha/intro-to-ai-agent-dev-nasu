/**
 * GPT-4.1を用いて翻訳用Developer指示付きの対話を繰り返し、履歴を追跡する例。
 */

import 'dotenv/config'
import OpenAI from 'openai';

const client = new OpenAI();

type Genre = '洋食' | '和食' | '中華料理';
type Budget = '0円～2500円' | '2500円～5000円' | '5000円～7500円';

async function main() {
  // 初期プロンプト
  const input: OpenAI.Responses.ResponseCreateParams['input'] = [
    {
      role: 'system',
      content:
        'あなたは高性能な飲食店検索エンジンです。必ず以下の情報をもとに検索結果のみを日本語で3件返してください：郵便番号（必須）、ジャンル（洋食・和食・中華料理）、予算帯（0円～2500円、2500円～5000円、5000円～7500円）。ほかの回答はしないでください。',
    }
  ];

  // ユーザ入力
  const postal = prompt('郵便番号を入力してください:');
  if (!postal) return;

  const genre = prompt('ジャンルを選んでください: 洋食・和食・中華料理');
  if (!genre || !['洋食', '和食', '中華料理'].includes(genre)) return;

  const budget = prompt('予算帯を選んでください: 0円～2500円、2500円～5000円、5000円～7500円');
  if (!budget || !['0円～2500円', '2500円～5000円', '5000円～7500円'].includes(budget)) return;

  // プロンプト構築
  const q = `郵便番号: ${postal}\nジャンル: ${genre}\n予算帯: ${budget}`;
  input.push({
    role: 'user',
    content: q
  });

  // API呼び出し
  const response = await client.responses.create({
    model: 'o4-mini',
    temperature: 0,
    input,
  });

  // 結果表示
  console.log('検索条件:', q);
  console.log('飲食店検索結果:', response.output_text);
}

main();

