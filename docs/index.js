var startBtn = document.getElementById('start-btn');
var questionString = document.getElementById('question');
var correctCountSpan = document.getElementById('score');
var optionButtons = Array.from(document.getElementsByClassName('option-btn'));
var correctCount = 0;
var number1 = 0; // 最初の数
var number2 = 0; // 2番目の数
var currentAnswer = 0; // 現在の答え
var calclationType = 'addition'; // デフォルトは足し算
var timer;
var timeRemaining = 20; // ゲーム時間（秒）
var defaultTime = 20; // デフォルトのゲーム時間（秒）
var penaltyTime = 1; // 不正解時のペナルティ時間（秒）
var gameInProgress = false;
startBtn.addEventListener('click', startGame); // ゲーム開始ボタンのクリックイベント
// 選択肢ボタンのクリックイベント設定
optionButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        var selectedAnswer = parseInt(button.innerText);
        var feedbackDiv = document.getElementById('feedback');
        if (!gameInProgress)
            return; // ゲーム進行中でなければ無視
        if (selectedAnswer === currentAnswer) {
            correctCount++;
            correctCountSpan.innerText = "\u30B9\u30B3\u30A2: ".concat(correctCount);
            feedbackDiv.innerText = '正解！';
        }
        else {
            feedbackDiv.innerText = "\u4E0D\u6B63\u89E3\uFF01\u6B63\u3057\u3044\u7B54\u3048\u306F ".concat(currentAnswer, " \u3067\u3059\u3002 - ").concat(penaltyTime, "\u79D2\u306E\u30DA\u30CA\u30EB\u30C6\u30A3\uFF01");
            timeRemaining -= penaltyTime; // ペナルティ時間を減算
            if (timeRemaining < 0) {
                timeRemaining = 0; // 残り時間がマイナスにならないようにする
            }
            var timeRemainingSpan = document.getElementById('time-remaining');
        }
        CreateQuestionAndAnswer(calclationType);
    });
});
// ゲーム開始処理
function startGame() {
    var calclationTypeSelect = document.getElementById('calclation-type');
    calclationType = calclationTypeSelect.value;
    correctCount = 0;
    // correctCountSpan.innerText = correctCount.toString();
    CreateQuestionAndAnswer(calclationType);
    console.log("\u30B2\u30FC\u30E0\u958B\u59CB: ".concat(calclationType, " \u30E2\u30FC\u30C9"));
    timeRemaining = defaultTime; // ゲーム時間をリセット
    gameInProgress = true;
    timer = window.setInterval(function () {
        timeRemaining--;
        var timeRemainingSpan = document.getElementById('time-remaining');
        timeRemainingSpan.innerText = "\u6B8B\u308A\u6642\u9593: ".concat(timeRemaining, "\u79D2");
        if (timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}
// 新しい問題と答えを生成
function CreateQuestionAndAnswer(type) {
    number1 = Math.floor(Math.random() * 11); // 最初の数をランダムに生成(0から10)
    number2 = Math.floor(Math.random() * 11); // 2番目の数をランダムに生成(0から10)
    switch (type) {
        case 'addition':
            currentAnswer = number1 + number2;
            questionString.innerText = "".concat(number1, " + ").concat(number2, " = ?");
            break;
        case 'subtraction':
            currentAnswer = number1 - number2;
            questionString.innerText = "".concat(number1, " - ").concat(number2, " = ?");
            break;
        case 'multiplication':
            currentAnswer = number1 * number2;
            questionString.innerText = "".concat(number1, " \u00D7 ").concat(number2, " = ?");
            break;
    }
    // 選択肢の生成
    var options = new Set();
    options.add(currentAnswer);
    while (options.size < 4) {
        var wrongAnswer = Math.floor(Math.random() * 21);
        options.add(wrongAnswer);
    }
    // 選択肢をボタンに割り当て
    var optionArray = Array.from(options);
    optionArray.sort(function () { return Math.random() - 0.5; }); // 選択肢をランダムにシャッフル
    optionButtons.forEach(function (button, index) {
        var formattedAnswer = (optionArray[index] < 10 ? "0" : "") + optionArray[index].toString();
        button.innerText = formattedAnswer;
    });
}
function endGame() {
    gameInProgress = false;
    clearInterval(timer);
    var feedbackDiv = document.getElementById('feedback');
    feedbackDiv.innerText = "\u6642\u9593\u5207\u308C\uFF01\u3042\u306A\u305F\u306E\u30B9\u30B3\u30A2\u306F ".concat(correctCount, " \u3067\u3059\u3002");
    optionButtons.forEach(function (button) {
        button.innerText = '??';
    });
}
