const questions = [
  { key:'name', kicker:'まずはアイデアから', title:'どんなアプリを作りたいですか？', help:'最も近いものを1つ選んでください。', options:[
    ['業務管理アプリ','顧客・案件・在庫・勤怠など','業務管理アプリ',2],['予約・受付アプリ','予約枠、申込み、日程管理など','予約管理アプリ',3],['販売・注文アプリ','商品、カート、決済、注文管理など','販売・注文アプリ',4],['会員・マッチングアプリ','利用者同士の検索、交流、契約など','会員・マッチングアプリ',6],['その他のアイデア','上記以外でも診断できます','オリジナルアプリ',3]] },
  { key:'users', kicker:'利用する人', title:'誰が使うアプリですか？', help:'利用者の種類が増えるほど、権限設計が必要になります。', options:[
    ['自分だけ','まずは自分の仕事で使う','自分のみ',0],['社内・チーム','複数の従業員が使う','社内・チーム',2],['顧客・取引先','社外の利用者がログインする','顧客・取引先',4],['不特定多数','一般公開して誰でも利用する','一般ユーザー',6]] },
  { key:'login', kicker:'アカウント', title:'ログイン機能は必要ですか？', help:'分からない場合は「必要」を選ぶと安全です。', options:[
    ['不要','同じ端末・限定された環境で使う','不要',0],['メールアドレスで必要','利用者ごとにデータを分ける','メールログイン',3],['Google・LINE等でも必要','外部アカウントでログインする','SNSログイン',5],['まだ分からない','設計時に一緒に決めたい','要検討',2]] },
  { key:'data', kicker:'扱う情報', title:'登録するデータの量・種類は？', help:'画面数やデータ同士の関連性を判断します。', options:[
    ['少ない','1～3種類の情報を登録する','シンプル',1],['普通','顧客、案件、履歴など4～7種類','標準',3],['多い','多数の帳票・集計・複雑な関連がある','複雑',6],['分からない','必要な情報から整理してほしい','要整理',3]] },
  { key:'special', kicker:'高度な機能', title:'次のような機能は必要ですか？', help:'最も開発負荷が高そうなものを選んでください。', options:[
    ['特にない','登録・検索・集計が中心','基本機能のみ',0],['写真・PDFの保存','ファイルのアップロードが必要','ファイル保存',2],['AI・OCR・自動判定','文章生成や画像・書類の読み取り','AI・OCR',5],['位置情報・経路・リアルタイム','地図、通知、チャットなど','リアルタイム機能',7]] },
  { key:'external', kicker:'外部サービス', title:'他のシステムと連携しますか？', help:'APIや決済サービスとの接続には追加の確認が必要です。', options:[
    ['連携しない','アプリ単体で完結する','なし',0],['メール・カレンダー','通知や予定を連携する','メール・カレンダー',2],['決済サービス','クレジットカード決済を入れる','オンライン決済',5],['既存の業務システム','会計、POS、基幹システムなど','外部業務システム',7]] },
  { key:'clarity', kicker:'アイデアの具体性', title:'作りたい内容はどこまで決まっていますか？', help:'決まっていなくても、質問しながら整理できます。', options:[
    ['かなり具体的','画面や機能を説明できる','具体的',0],['やりたいことは決まっている','必要機能はまだ曖昧','目的のみ明確',2],['アイデアだけある','相談しながら形にしたい','アイデア段階',4],['困りごとだけある','解決方法から考えてほしい','課題整理から',5]] },
  { key:'design', kicker:'見た目と端末', title:'どのレベルの仕上がりを希望しますか？', help:'スマートフォンから使えるWebアプリを前提に診断します。', options:[
    ['まず自分で使えればよい','機能を優先した試作版','試作版',0],['社内で安心して使いたい','見やすさと操作性も整える','社内運用版',2],['顧客に販売・提供したい','デザイン・規約・安全性も重視','外販版',5],['大規模サービスを目指す','多数利用を想定した本格設計','拡張前提版',8]] }
];

let current = 0;
let answers = {};
const $ = (id) => document.getElementById(id);

function showQuestion(){
  const q=questions[current];
  $('stepLabel').textContent=`質問 ${current+1} / ${questions.length}`;
  const percent=Math.round((current+1)/questions.length*100);
  $('progressPercent').textContent=`${percent}%`;
  $('progressBar').style.width=`${percent}%`;
  $('questionKicker').textContent=q.kicker;
  $('questionTitle').textContent=q.title;
  $('questionHelp').textContent=q.help;
  $('options').innerHTML='';
  q.options.forEach((option,index)=>{
    const button=document.createElement('button');
    button.className='option'+(answers[q.key]?.index===index?' selected':'');
    button.innerHTML=`${option[0]}<small>${option[1]}</small>`;
    button.addEventListener('click',()=>{
      answers[q.key]={index,label:option[0],value:option[2],score:option[3]};
      document.querySelectorAll('.option').forEach(el=>el.classList.remove('selected'));
      button.classList.add('selected');
      $('nextButton').disabled=false;
    });
    $('options').appendChild(button);
  });
  $('backButton').style.visibility=current===0?'hidden':'visible';
  $('nextButton').textContent=current===questions.length-1?'診断結果を見る →':'次へ →';
  $('nextButton').disabled=!answers[q.key];
  window.scrollTo({top:0,behavior:'smooth'});
}

function calculate(){
  const score=Object.values(answers).reduce((sum,a)=>sum+a.score,0);
  const supportHours=Math.max(1,Math.round(1.5+score*0.72));
  const soloHours=Math.round(65+score*12.5);
  const supportDays=supportHours<=2?'1日以内':supportHours<=8?'1～2日':supportHours<=18?'2～5日':supportHours<=30?'1～2週間':'2～4週間';
  const soloDays=soloHours<160?'1～2か月':soloHours<300?'3～5か月':soloHours<450?'6～9か月':'9～15か月';
  const difficulty=score<12?'シンプル':score<24?'標準':score<36?'やや本格的':'本格的';
  return {score,supportHours,soloHours,supportDays,soloDays,difficulty,saved:soloHours-supportHours};
}

function featureList(){
  const items=['スマートフォン対応の画面','データの登録・編集・検索'];
  if(answers.login.value!=='不要') items.push(`${answers.login.value}機能`);
  if(answers.users.value!=='自分のみ') items.push('利用者・権限の管理');
  if(answers.special.value!=='基本機能のみ') items.push(answers.special.value);
  if(answers.external.value!=='なし') items.push(`${answers.external.value}連携`);
  if(['社内運用版','外販版','拡張前提版'].includes(answers.design.value)) items.push('バックアップ・エラー対策');
  if(['外販版','拡張前提版'].includes(answers.design.value)) items.push('利用規約・セキュリティ設計');
  items.push('GitHubへの保存・公開');
  return [...new Set(items)];
}

function buildPrompt(features){
  return `あなたは、プログラミング未経験者を支援するアプリ開発アシスタントです。\n以下の条件で、スマートフォンでも使いやすいWebアプリを作ってください。\n\n【作りたいアプリ】\n${answers.name.value}\n\n【利用者】\n${answers.users.value}\n\n【ログイン】\n${answers.login.value}\n\n【データの複雑さ】\n${answers.data.value}\n\n【必要な高度機能】\n${answers.special.value}\n\n【外部連携】\n${answers.external.value}\n\n【現在のアイデア】\n${answers.clarity.value}\n\n【希望する仕上がり】\n${answers.design.value}\n\n【想定機能】\n${features.map(v=>`・${v}`).join('\n')}\n\n【進め方】\n1. まだ曖昧な点を、専門用語を使わず1問ずつ質問してください。\n2. 回答をもとに、最小限必要な機能と後から追加できる機能を分けてください。\n3. 画面一覧、データ構造、利用の流れを提案してください。\n4. まず動く最小版を作り、スマートフォン表示を確認してください。\n5. GitHubに保存し、安全に公開できる構成にしてください。\n6. 作業ごとに、何をしたか初心者にも分かる言葉で説明してください。\n7. 不具合が出た場合はログを確認し、原因を特定してから修正してください。`;
}

function showResult(){
  const result=calculate();
  const features=featureList();
  $('resultName').textContent=answers.name.value;
  $('difficulty').textContent=`開発難易度：${result.difficulty}`;
  $('supportDays').textContent=result.supportDays;
  $('supportHours').textContent=`実作業 約${result.supportHours}時間`;
  $('soloDays').textContent=result.soloDays;
  $('soloHours').textContent=`学習＋開発 約${result.soloHours}時間`;
  $('savedHours').textContent=`約${result.saved}時間`;
  $('resultSummary').textContent=`初期セットアップと開発手順が整った環境を使うことで、1から言語・サーバー・公開方法を学ぶ時間を大幅に短縮できる見込みです。`;
  $('featureList').innerHTML=features.map(v=>`<li>${v}</li>`).join('');
  $('promptText').textContent=buildPrompt(features);
  $('diagnosis').classList.add('hidden');
  $('result').classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}

$('startButton').addEventListener('click',()=>{$('intro').classList.add('hidden');$('diagnosis').classList.remove('hidden');showQuestion()});
$('nextButton').addEventListener('click',()=>{if(current<questions.length-1){current++;showQuestion()}else showResult()});
$('backButton').addEventListener('click',()=>{if(current>0){current--;showQuestion()}});
$('retryButton').addEventListener('click',()=>{current=0;answers={};$('result').classList.add('hidden');$('intro').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})});
$('copyButton').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText($('promptText').textContent);$('copyButton').textContent='コピーしました';setTimeout(()=>$('copyButton').textContent='コピー',1800)}
  catch{const range=document.createRange();range.selectNode($('promptText'));window.getSelection().removeAllRanges();window.getSelection().addRange(range)}
});
