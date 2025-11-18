const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const questionString = document.getElementById('question') as HTMLDivElement;
const correctCountSpan = document.getElementById('score') as HTMLSpanElement;
const optionButtons = Array.from(document.getElementsByClassName('option-btn')) as HTMLButtonElement[];

let correctCount = 0;
let number1 = 0;// 最初の数
let number2 = 0; // 2番目の数
let currentAnswer = 0; // 現在の答え
let calclationType = 'addition'; // デフォルトは足し算

let timer: number;
let timeRemaining = 20; // ゲーム時間（秒）
let defaultTime = 40; // デフォルトのゲーム時間（秒）
let penaltyTime = 1; // 不正解時のペナルティ時間（秒）
let gameInProgress = false;

startBtn.addEventListener('click', startGame); // ゲーム開始ボタンのクリックイベント

// 選択肢ボタンのクリックイベント設定
optionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedAnswer = parseInt(button.innerText);
        const feedbackDiv = document.getElementById('feedback') as HTMLDivElement;
        if(!gameInProgress) return; // ゲーム進行中でなければ無視
        if (selectedAnswer === currentAnswer) {
            correctCount++;
            correctCountSpan.innerText =  `スコア: ${correctCount}`;
            feedbackDiv.innerText = '正解！';
        } else {
            feedbackDiv.innerText = `不正解！正しい答えは ${currentAnswer} です。 - ${penaltyTime}秒のペナルティ！`;
            timeRemaining -= penaltyTime; // ペナルティ時間を減算
            if (timeRemaining < 0) {
                timeRemaining = 0; // 残り時間がマイナスにならないようにする
            }
            const timeRemainingSpan = document.getElementById('time-remaining') as HTMLSpanElement;
        }
        CreateQuestionAndAnswer(calclationType);
    });
}); 

// ゲーム開始処理
function startGame() {
    const calclationTypeSelect = document.getElementById('calclation-type') as HTMLSelectElement;
   calclationType = calclationTypeSelect.value;
    correctCount = 0;
   // correctCountSpan.innerText = correctCount.toString();
    CreateQuestionAndAnswer(calclationType);
    console.log(`ゲーム開始: ${calclationType} モード`);
    timeRemaining = defaultTime; // ゲーム時間をリセット
    gameInProgress = true;

    clearInterval(timer); //タイマーが動いているときはクリア
    // タイマー開始
    timer = window.setInterval(() => {
        timeRemaining--;
        const timeRemainingSpan = document.getElementById('time-remaining') as HTMLSpanElement;
        timeRemainingSpan.innerText = `残り時間: ${timeRemaining}秒`;
        if (timeRemaining <= 0) {
           endGame();
        }
    }, 1000);
}

// 新しい問題と答えを生成
function CreateQuestionAndAnswer(type: string)
{
    number1 = Math.floor(Math.random() * 11);// 最初の数をランダムに生成(0から10)
    number2 = Math.floor(Math.random() * 11); // 2番目の数をランダムに生成(0から10)

    switch (type) {
        case 'addition':
            currentAnswer = number1 + number2;
            questionString.innerText = `${number1} + ${number2} = ?`;
            break;
        case 'subtraction':
            currentAnswer = number1 - number2;
            questionString.innerText = `${number1} - ${number2} = ?`;
            break;
        case 'multiplication':
            currentAnswer = number1 * number2;
            questionString.innerText = `${number1} × ${number2} = ?`;
            break;
    }   

    // 選択肢の生成
    const options = new Set<number>();
    options.add(currentAnswer);
    while (options.size < 4) {
        const wrongAnswer = Math.floor(Math.random() * 21);
        options.add(wrongAnswer);
    }
    // 選択肢をボタンに割り当て
    const optionArray = Array.from(options);
    optionArray.sort(() => Math.random() - 0.5); // 選択肢をランダムにシャッフル
    optionButtons.forEach((button, index) => {
        const formattedAnswer = (optionArray[index]! < 10  && optionArray[index]! > 0? "0" : "") + optionArray[index]!.toString(); // 1桁の数値に0を付加
        button.innerText = formattedAnswer;
    }); 
}

function endGame() {
    gameInProgress = false;
    clearInterval(timer);
    const feedbackDiv = document.getElementById('feedback') as HTMLDivElement;
    feedbackDiv.innerText = `時間切れ！あなたのスコアは ${correctCount} です。`;

    optionButtons.forEach(button => {
        button.innerText = '??';
    }
    );
}