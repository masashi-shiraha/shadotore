/* 収録教材（Online Meeting 4パート）: 元の shadoten_trainer.html から移植 */
const MATERIAL_PARTS = [
  {
    id: 'part1',
    tabLabel: 'Part 1 (導入)',
    title: 'Part 1: 導入・アジェンダ共有',
    lines: [
      {
        speaker: 'Maya',
        text: 'Hi Steve, good to see you. Can you hear me clearly?',
        highlights: [
          { phrase: 'to', type: 'link', tip: 'to [tə]：弱形化し「トゥ」ではなく軽く「タ/トゥ」と発音' },
          { phrase: 'Can you', type: 'link', tip: 'Can you [kən jə]：nとyが繋がり「キャニュ」のように発音' },
        ],
      },
      {
        speaker: 'Steve',
        text: 'All good on my side, Maya. Pretty busy these days, I bet we both are.',
        highlights: [
          { phrase: 'good on', type: 'link', tip: 'good on [ɡʊd ɑːn]：子音dと母音oが連結し「グドン」と繋がる' },
          { phrase: 'Pretty', type: 'link', tip: 'Pretty [ˈprɪt̬i]：母音に挟まれたtがラ行化し「プリディ」に近い音に' },
          { phrase: 'bet', type: 'link', tip: 'bet [bet]：語末のtは破裂させず息を止める（内破音）' },
        ],
      },
      {
        speaker: 'M',
        text: "Yes, it's a busy time for both of us. Now, let's get started. This meeting should take about 30 minutes. First, I'm going to share the agenda. Then, we'll look at our proposal, have a short discussion, and agree on next steps. We'll wrap things up after that. To kick things off, let me share my screen.",
        highlights: [
          { phrase: "Yes, it's a", type: 'link', tip: "Yes, it's a [jes ɪts ə]：3語が滑らかに連結し「イェスィッツァ」" },
          { phrase: 'both of us.', type: 'link', tip: 'both of us [boʊθ əv əs]：ofが弱まり「ボウサヴァス」と連結' },
          { phrase: 'get started.', type: 'reduce', tip: 'get started [ɡet ˈstɑːrtɪd]：getの語末tが脱落し「ゲッスターティッド」' },
          { phrase: 'meeting', type: 'link', tip: 'meeting [ˈmiːt̬ɪŋ]：tがフラッピングして「ミーディング」' },
          { phrase: 'going to', type: 'link', tip: 'going to [ˈɡoʊɪŋ tə]：高速発話では「ゴナ」に近づく連結・短縮' },
          { phrase: 'look at our', type: 'link', tip: 'look at our [lʊk ət̬ aʊr]：k+a、t+oが連続連結し「ルッカダワー」' },
          { phrase: 'and agree', type: 'link', tip: 'and agree [ənd əˈɡriː]：andのdが弱まり「アナグリー」' },
          { phrase: 'things up after', type: 'link', tip: 'things up after [θɪŋz ʌp ˈæftər]：3語が連結し「シングザッパフター」' },
        ],
      },
      {
        speaker: 'S',
        text: "Sure, go ahead. I'm looking forward to hearing the proposal.",
        highlights: [
          { phrase: 'hearing', type: 'link', tip: 'hearing [ˈhɪrɪŋ]：語末のgは破裂させず鼻に抜ける音になる' },
          { phrase: 'the', type: 'reduce', tip: 'the [ðə]：弱形化し次のproposalに軽く添える' },
        ],
      },
    ],
  },
  {
    id: 'part2',
    tabLabel: 'Part 2 (優先事項)',
    title: 'Part 2: ニーズ・優先事項の確認',
    lines: [
      {
        speaker: 'M',
        text: "Before I dive into our proposal, I'd love to understand your needs first. Could you kind of walk me through your top priorities— what's really top of mind for you?",
        highlights: [
          { phrase: 'dive into', type: 'reduce', tip: 'dive into [daɪv ˈɪntuː]：vとiが連結し「ダイヴィントゥ」' },
          { phrase: 'Could you', type: 'link', tip: 'Could you [kʊdʒuː]：dとyが同化して「クジュー」に変化' },
        ],
      },
      {
        speaker: 'S',
        text: "All right. The number-one thing is the launch date— we really need the system up and running by the end of September. Price matters too; we have to keep it in our budget. Support helps a lot, but it's not our main concern.",
        highlights: [
          { phrase: 'up and', type: 'link', tip: 'up and [ʌp ən]：pとaが連結しandのdが脱落「アッパン」' },
          { phrase: 'keep it', type: 'link', tip: 'keep it [kiːp ɪt]：pとiが連結し「キーピッ」' },
          { phrase: 'in', type: 'reduce', tip: 'in [ɪn]：前のkeep itと連結して「キーピッティン」' },
          { phrase: 'our', type: 'reduce', tip: 'our [aʊr]：in ourが繋がり「イナワー」のように発音' },
        ],
      },
      {
        speaker: 'M',
        text: "Got it, that's really clear. So timeline is key, price is next, and support is helpful but secondary. Thanks for laying that out. Alright, let's move on to these issues one by one.",
        highlights: [
          { phrase: 'timeline is', type: 'reduce', tip: 'timeline is [ˈtaɪmlaɪn ɪz]：nとiが連結し「タイムライニズ」' },
        ],
      },
    ],
  },
  {
    id: 'part3',
    tabLabel: 'Part 3 (提案・価格)',
    title: 'Part 3: スケジュール・価格・サポート提案',
    lines: [
      {
        speaker: 'M',
        text: "Okay, let's go over our proposal. First, on the launch schedule: we're going to have the system up and running by mid-September. That'll give you about two weeks to test before the end of the month. Next, on price: the standard package's fifty thousand dollars. It comes with licenses, setup, and online training. If you want to add on-site training, the cost'll go higher, but the base plan should fit your budget.",
        highlights: [
          { phrase: 'go over', type: 'link', tip: 'go over [ɡoʊ ˈoʊvər]：母音同士が滑らかに繋がり「ゴウオウヴァー」' },
          { phrase: 'up and running', type: 'link', tip: 'up and running [ʌp ən ˈrʌnɪŋ]：upとandが連結し「アッパンランニング」' },
          { phrase: 'about two', type: 'reduce', tip: 'about two [əˈbaʊt tuː]：連続するtが1つに融合し「アバウトゥー」' },
          { phrase: 'end of', type: 'link', tip: 'end of [end əv]：dとoが連結し「エンダヴ」' },
          { phrase: 'want to add', type: 'link', tip: 'want to add [wɑːnt tə æd]：want toが弱まり「ワナアッド」に近い連結' },
          { phrase: 'fit your', type: 'link', tip: 'fit your [fɪtʃər]：tとyが同化して「フィッチュア」' },
        ],
      },
      {
        speaker: 'S',
        text: "Alright, that timing sounds pretty good, and the base plan's fine. What about support after setup?",
        highlights: [
          { phrase: 'sounds pretty', type: 'reduce', tip: 'sounds pretty [saʊndz ˈprɪt̬i]：dが弱まり「サウンズプリディ」' },
          { phrase: 'What about', type: 'link', tip: 'What about [wʌt̬ əˈbaʊt]：tがフラッピングして「ワダバウト」' },
        ],
      },
      {
        speaker: 'M',
        text: "You'll get a full year of email support and monthly Q&A sessions, all free.",
        highlights: [
          { phrase: 'get a', type: 'link', tip: 'get a [ɡet̬ ə]：tがフラッピングして「ゲダ」のように連結' },
          { phrase: 'year of', type: 'link', tip: 'year of [jɪr əv]：rとoが連結し「イヤラヴ」' },
        ],
      },
    ],
  },
  {
    id: 'part4',
    tabLabel: 'Part 4 (価格交渉)',
    title: 'Part 4: 価格交渉と代替案の提示',
    lines: [
      {
        speaker: 'S',
        text: "Thanks, Maya. The launch schedule works for us, no problem there. But the price still feels kind of high— we're going to be able to spend around forty-five thousand. If we can't keep it close to that, my manager won't sign off, so what can we do?",
        highlights: [
          { phrase: 'works for us,', type: 'link', tip: 'works for us [wɜːrks fər əs]：forが弱形化し「ワークスファラス」' },
          { phrase: 'kind of', type: 'reduce', tip: 'kind of [kaɪnd əv]：dとoが連結し「カインダ（ヴ）」' },
          { phrase: 'keep it close to', type: 'link', tip: 'keep it close to [kiːp ɪt kloʊs tə]：keep itが連結し「キーピックロウストゥ」' },
          { phrase: 'sign off,', type: 'link', tip: 'sign off [saɪn ɔːf]：nとoが連結し「サイノフ」' },
        ],
      },
      {
        speaker: 'M',
        text: "I get it. Let me suggest this: if we cut the on-site training and keep only online sessions, the price'll drop to about forty-six thousand. That's pretty close to your target. And if you want to add more support, we can throw in a few extra Q&A calls at no extra charge. It's probably the best balance between cost and value, and you'll have to decide if that works for your team.",
        highlights: [
          { phrase: 'get it.', type: 'link', tip: 'get it [ɡet̬ ɪt]：tがフラッピングして「ゲディッ」' },
          { phrase: 'keep only', type: 'link', tip: 'keep only [kiːp ˈoʊnli]：pとoが連結し「キーポウンリー」' },
          { phrase: 'drop to', type: 'reduce', tip: 'drop to [drɑːp tə]：pを破裂させず次のtoへ移行「ドロップトゥ」' },
          { phrase: 'throw in a', type: 'link', tip: 'throw in a [θroʊ ɪn ə]：inとaが連結し「スロウイナ」' },
          { phrase: 'at no extra', type: 'reduce', tip: 'at no extra [æt noʊ ˈekstrə]：atのtが飲み込まれ「アッノウエクストラ」' },
        ],
      },
    ],
  },
];
