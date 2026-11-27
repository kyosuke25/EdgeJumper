enchant(); // おまじない



var INITIAL_X = 104;
var INITIAL_Y = 160;
var JUMP_HEIGHT = 96;
var CHARA_PATTERN = 3;
var FPS = 24;
var BASE_COUNT = 10;
var INITIAL_COUNT = 5;
var MAX_COUNT = 100;
var BASE_POINT = 10000;
var SCROLL_SPEED = FPS / 4; // 1フレームで刻むピクセル数
var MIN_WIDTH = (SCROLL_SPEED * FPS) * 0.5; // 0.5秒（ピクセル数）
var WIDTHS =
    [MIN_WIDTH,                        // 0.5s, 72px
     MIN_WIDTH + (SCROLL_SPEED * 6),   // 0.75x, 108px
     MIN_WIDTH + (SCROLL_SPEED * 12),  // 1.0s, 144px
     MIN_WIDTH + (SCROLL_SPEED * 14),  // 156px
     MIN_WIDTH + (SCROLL_SPEED * 15),  // 162px
     MIN_WIDTH + (SCROLL_SPEED * 16),  // 168px
     MIN_WIDTH + (SCROLL_SPEED * 17),  // 174px
     MIN_WIDTH + (SCROLL_SPEED * 18),  // 1.25s, 180px
     MIN_WIDTH + (SCROLL_SPEED * 19),  // 186px
     MIN_WIDTH + (SCROLL_SPEED * 20),  // 192px
     MIN_WIDTH + (SCROLL_SPEED * 21),  // 198px
     MIN_WIDTH + (SCROLL_SPEED * 22),  // 204px
     MIN_WIDTH + (SCROLL_SPEED * 23),  // 210px
     MIN_WIDTH + (SCROLL_SPEED * 24)]; // 1.5px, 216px
var WIDTH_TYPE = WIDTHS.length; // 土台のバリエーション数
var JUMP_STEP = JUMP_HEIGHT / SCROLL_SPEED;


var COUNT_COLOR = '#333333';
var COUNT_FONT_SIZE = 96
var COUNT_FONT_FORMAT = 'px system-ui'//sans-serif';
var COUNT_FONT = COUNT_FONT_SIZE + COUNT_FONT_FORMAT;
var COUNT_HEIGHT = 50;

var GRADE_COLOR = '#ffffff';
var GRADE_FONT = '24px system-ui';//sans-serif';

var SCORE_COLOR = '#ff0000';
var SCORE_FONT = '24px system-ui';//sans-serif';

var EXTRA_COLOR = '#ffffff';
var EXTRA_FONT = '24px system-ui';//sans-serif';

var TOTAL_FORMAT = 'SCORE : ';
var TOTAL_COLOR = '#ffffff';
var TOTAL_FONT = '18px system-ui';

var LEFT_FORMAT = 'LEFT : ';
var LEFT_COLOR = '#ffffff';
var LEFT_FONT = '18px system-ui';

var BONUS_FORMAT = 'CLEAR BONUS : +';
var BONUS_SCORE = 10000;
var BONUS_COLOR = '#ffffff';
var BONUS_FONT = '22px system-ui';//sans-serif';

var CLEAR_TOTAL_FORMAT = 'SCORE : ';
var CLEAR_TOTAL_COLOR = '#ffffff';
var CLEAR_TOTAL_FONT = '36px system-ui';//sans-serif';

var MESSAGE_COLOR = '#3333ff';
var MESSAGE_FONT = '22px system-ui';//sans-serif';

var CONTINUE_COLOR = '#ff3333';
var CONTINUE_FONT = '32px system-ui';//sans-serif';

var BUTTON_FONT = '32px system-ui';//sans-serif';

var GUIDE_COLOR = '#333333';
var GUIDE_FONT = '22px system-ui';//sans-serif';

var CHECKBOX_COLOR = '#333333';
var CHECKBOX_DISABLED_COLOR = '#cccccc';
var CHECKBOX_FONT = '20px system-ui';//sans-serif';

var SCREEN_WIDTH = 320;
var SCREEN_HEIGHT = 480;

var RANKING_TITLE_COLOR = '#333333';
var RANKING_TITLE_FONT = '32px system-ui';//sans-serif';

var RANKING_FONT = '12px sans-serif';
var RANKING_FONT2 = '10px sans-serif';


var frameNo = 0;
var jumping = false;
var baseWidth;
var blankWidth;
var baseX;
var baseEdgeX;
var jumpCount;
var extraCount;
var currentExtraCount;
var isGameOver;
var streak;
var basesArray;
var currentObjectId;
var currentCreatedAt;
var currentPlayer;
var currentScore;
var isRegistered = false;

var thisLocale;

var game;

//認証情報
var gameStart = function(locale) {

    // ロケールの設定
    thisLocale = locale;

    game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);

    game.fps = FPS;
    enchant.Sound.enabledInMobileSafari = false;
    game.preload('./img/chara1.png', './img/map2.png', './img/start.png', './img/end.png', './img/clear.png');

    game.onload = function() {

        // タイトルシーン
        var createTitleScene = function() {

            // 諸々初期化
            initialize();

            // トラッキング
            trackPage('/top');

            var scene = new Scene();
            scene.backgroundColor = '#fcc800';

            // タイトルラベル設定
            var title = new Label(localize(thisLocale, 'ギリジャン！', 'EdgeJumper'));
            title.textAlign = 'center';
            title.color = '#ffffff';
            title.width = SCREEN_WIDTH;
            title.x = (SCREEN_WIDTH - title.width) / 2;
            title.y = SCREEN_HEIGHT / 6;
            title.font = '52px edgefont-title'; //sans-serif';
            // タイトルラベル設定
            var title2 = new Label(localize(thisLocale, 'ギリジャン！', 'EdgeJumper'));
            title2.textAlign = 'center';
            title2.color = '#cccccc';
            title2.width = SCREEN_WIDTH;
            title2.x = (SCREEN_WIDTH - title.width) / 2 + 5;
            title2.y = SCREEN_HEIGHT / 6 + 5;
            title2.font = '52px edgefont-title'; //sans-serif';
            scene.addChild(title2);
            scene.addChild(title);

            // サブタイトルラベル設定
            var subTitle = new Label(localize(thisLocale, '- ギリギリで飛べば飛ぶほど高得点  -', '- Jump nearer the edge, get higher score -'));
            subTitle.textAlign = 'center';
            subTitle.width = SCREEN_WIDTH;
            subTitle.x = 0;
            subTitle.y = title.y + 80;
            subTitle.font = '14px sans-serif';
            scene.addChild(subTitle);

            // スタート画像設定
            var startImage = new Sprite(236, 48);
            startImage.scale(0.75, 0.75);
            startImage.image = game.assets['./img/start.png'];
            startImage.x = SCREEN_WIDTH / 2 - startImage.width / 2;
            startImage.y = subTitle.y + 80;
            scene.addChild(startImage);

            // スタート画像にタッチイベントを設定
            startImage.addEventListener(
                Event.TOUCH_START,
                function(e) {
                    game.replaceScene(createCountDownScene());
                }
            );

            scene.primaryAction = function () { game.replaceScene(createCountDownScene()); };
            addText(scene, localize(thisLocale, 'クリック・タップ・Spaceでジャンプ', 'Click, tap, or press Space to jump'), 345, '15px sans-serif', '#302100');
            addText(scene, 'BEST : ' + bestScore(), 387, '24px system-ui', '#302100');

            // タイトルシーンを返します。
            return scene;
        };

        // カウントダウンシーン
        var createCountDownScene = function() {
            var scene = new Scene();
            scene.backgroundColor = 'rgba(0, 0, 0, 0.1)';

            var count3 = new Label('3');
            count3.width = SCREEN_WIDTH;
            count3.height = COUNT_HEIGHT;
            count3.textAlign = 'center';
            count3.x = 0
            count3.font = COUNT_FONT;
            count3.color = COUNT_COLOR;
            count3.visible = false;

            var count2 = new Label('2');
            count2.width = SCREEN_WIDTH;
            count2.height = COUNT_HEIGHT;
            count2.textAlign = 'center';
            count2.x = 0
            count2.font = COUNT_FONT;
            count2.color = COUNT_COLOR;
            count2.visible = false;

            var count1 = new Label('1');
            count1.width = SCREEN_WIDTH;
            count1.height = COUNT_HEIGHT;
            count1.textAlign = 'center';
            count1.x = 0
            count1.font = COUNT_FONT;
            count1.color = COUNT_COLOR;
            count1.visible = false;

            var go = new Label('GO!');
            go.width = SCREEN_WIDTH;
            go.height = COUNT_HEIGHT;
            go.textAlign = 'center';
            go.x = 0
            go.font = COUNT_FONT;
            go.color = COUNT_COLOR;
            go.visible = false;

            scene.addChild(count3);
            scene.addChild(count2);
            scene.addChild(count1);
            scene.addChild(go);

            // ループ数
            var loopCount = 0;
            // カウントダウンのカウント
            var countDown = 3;
            // フォントサイズ
            var fontSize = COUNT_FONT_SIZE;
            // 高さ
            var countHeight = COUNT_HEIGHT;
            // フォントサイズの減少幅
            var stepSizeDecrement = Math.floor(COUNT_FONT_SIZE / FPS) ;
            // 高さの減少幅
            var stepHeightDecrement = Math.floor(COUNT_HEIGHT / FPS);

            // フレームイベント
            scene.addEventListener(
                Event.ENTER_FRAME,
                function() {
                    if(countDown == 3) {
                        fontSize -= stepSizeDecrement;
                        countHeight -= stepHeightDecrement;
                        count3.font = fontSize + COUNT_FONT_FORMAT;
                        count3.height = countHeight;
                        count3.y = (SCREEN_HEIGHT - 50) / 2 - count3.height / 2;
                        count3.visible = true;
                        loopCount++;
                        if(loopCount == FPS) {
                            count3.visible = false;
                            loopCount = 0;
                            countDown--;
                            fontSize = COUNT_FONT_SIZE;
                            countHeight = COUNT_HEIGHT;
                        }
                    } else if(countDown == 2) {
                        fontSize -= stepSizeDecrement;
                        countHeight -= stepHeightDecrement;
                        count2.font = fontSize + COUNT_FONT_FORMAT;
                        count2.height = countHeight;
                        count2.y = (SCREEN_HEIGHT - 50) / 2 - count2.height / 2;
                        count2.visible = true;
                        loopCount++;
                        if(loopCount == FPS) {
                            count2.visible = false;
                            loopCount = 0;
                            countDown--;
                            fontSize = COUNT_FONT_SIZE;
                            countHeight = COUNT_HEIGHT;
                        }
                    } else if(countDown == 1) {
                        fontSize -= stepSizeDecrement;
                        countHeight -= stepHeightDecrement;
                        count1.font = fontSize + COUNT_FONT_FORMAT;
                        count1.height = countHeight;
                        count1.y = (SCREEN_HEIGHT - 50) / 2 - count1.height / 2;
                        count1.visible = true;
                        loopCount++;
                        if(loopCount == FPS) {
                            count1.visible = false;
                            loopCount = 0;
                            countDown--;
                            fontSize = COUNT_FONT_SIZE;
                            countHeight = COUNT_HEIGHT;
                            // GO!の可視化
                            go.y = (SCREEN_HEIGHT - 50) / 2 - go.height / 2;
                            go.visible = true;
                        }
                    } else if(countDown == 0) {
                        go.visible = false;
                        game.replaceScene(createGameScene());
                    } else {
                        // impossible.
                    }
                }
            );

            return scene;
        };

        // ゲームシーン
        var createGameScene = function() {

            // トラッキング
            trackPage('/start');

            var scene = new Scene();
            scene.backgroundColor = '#7ecef4';

            var chara = new Sprite(32, 32);
            chara.image = game.assets['./img/chara1.png'];
            chara.x = INITIAL_X; // くまの横位置を設定します。
            chara.y = INITIAL_Y; // くまの縦位置を設定します。
            chara.vy = 0;
            chara.score = 0;

            var stage = new Group();

            for(var i=0; i<MAX_COUNT; i++) {
                var width;
                var base;
                // 1つ目は長めな土台を作る。
                if(i==0) {
                    width = WIDTHS[WIDTH_TYPE - 1];
                    base = new Sprite(width, 160);
                    base.image = game.assets['./img/map2.png'];
                    base.x = INITIAL_X;
                    base.y = INITIAL_Y + chara.height;
                    baseEdgeX[i] = base.x + base.width;
                    baseX[i] = baseEdgeX[i] + (SCROLL_SPEED * FPS); // ジャンプは1秒固定
                    baseWidth[i] = base.width;
                } else {
                    width = WIDTHS[Math.floor(Math.random() * WIDTH_TYPE)];
                    base = new Sprite(width, 160);
                    base.image = game.assets['./img/map2.png'];
                    base.x = baseX[i - 1];
                    base.y = INITIAL_Y + chara.height;
                    baseEdgeX[i] = base.x + base.width;
                    baseX[i] = baseEdgeX[i] + (SCROLL_SPEED * FPS); // ジャンプは1秒固定
                    baseWidth[i] = base.width;
                }
                basesArray[i] = base;
                if(i < INITIAL_COUNT) {
                    stage.addChild(basesArray[i]);
                }
            }

            // グレードラベル
            var gradeLabel = new Label();
            gradeLabel.color = GRADE_COLOR;
            gradeLabel.font = GRADE_FONT;
            gradeLabel.textAlign = 'center';
            gradeLabel.visible = false;

            // スコアラベル
            var scoreLabel = new Label();
            scoreLabel.color = SCORE_COLOR;
            scoreLabel.font = SCORE_FONT;
            scoreLabel.textAlign = 'center';
            scoreLabel.visible = false;

            // トータルスコアラベル
            var totalScoreLabel = new Label(TOTAL_FORMAT + 0);
            totalScoreLabel.width = SCREEN_WIDTH - 40;
            totalScoreLabel.x = SCREEN_WIDTH / 2 - totalScoreLabel.width / 2;
            totalScoreLabel.y = 20;
            totalScoreLabel.color = TOTAL_COLOR;
            totalScoreLabel.font = TOTAL_FONT;
            totalScoreLabel.textAlign = 'left';

            // ボーナスラベル
            var extraLabel = new Label();
            extraLabel.color = EXTRA_COLOR;
            extraLabel.font = EXTRA_FONT;
            extraLabel.textAlign = 'center';
            extraLabel.visible = false;

            // 残
            var leftLabel = new Label(LEFT_FORMAT + BASE_COUNT);
            leftLabel.width = SCREEN_WIDTH - 40;
            leftLabel.x = SCREEN_WIDTH / 2 - leftLabel.width / 2;
            leftLabel.y = 20;
            leftLabel.color = LEFT_COLOR;
            leftLabel.font = LEFT_FONT;
            leftLabel.textAlign = 'right';

            stage.addChild(chara);
            stage.addChild(gradeLabel);
            stage.addChild(scoreLabel);
            stage.addChild(totalScoreLabel);
            stage.addChild(extraLabel);
            stage.addChild(leftLabel);
            scene.addChild(stage);

            // フレームイベント
            scene.addEventListener(
                Event.ENTER_FRAME,
                function() {
                    // マップ自体を移動
                    stage.x -= SCROLL_SPEED;
                    // キャラの挙動
                    charaMoving(chara, base);
                    // グレードラベルの挙動
                    if(gradeLabel.visible) {
                        gradeLabel.y--;
                        if(++gradeLabel.ticks > 50) {
                            gradeLabel.visible = false;
                        }
                    }
                    // スコアラベルの挙動
                    if(scoreLabel.visible) {
                        scoreLabel.y--;
                        if(++scoreLabel.ticks > 50) {
                            scoreLabel.visible = false;
                        }
                    }
                    // ボーナスラベルの挙動
                    if(extraLabel.visible) {
                        extraLabel.y--;
                        if(++extraLabel.ticks > 50) {
                            extraLabel.visible = false;
                        }
                    }
                    // トータルスコアラベルの挙動
                    totalScoreLabel.x += SCROLL_SPEED;
                    // 残ラベルの挙動
                    leftLabel.x += SCROLL_SPEED;
                    // 穴に落ちたら死亡
                    if(chara.y >= 200) {
                        game.pushScene(createGameOverScene(chara.score));
                    }
                    // 10回＋ボーナス、もしくはMAX_COUNT回飛んだらクリア。
                    // でもジャンプ中は終わらせない。
                    if(jumpCount == BASE_COUNT + extraCount || jumpCount == MAX_COUNT) {
                        if(!jumping) {
                            game.pushScene(createGameClearScene(chara.score));
                        }
                    }
                }
            );

            // タッチイベント
            scene.addEventListener(
                Event.TOUCH_START,
                function(e) {
                    if(!jumping && !isGameOver) {
                        // ジャンプ
                        chara.vy = -10;
                        chara.ay = (10 * 2) / ((baseX[jumpCount] - chara.x) / SCROLL_SPEED);
                        chara.y += chara.vy;
                        // 点数とグレードを取得
                        var result = calcScore(chara, baseEdgeX[jumpCount], baseWidth[jumpCount]);
                        // グレードによって適切なラベルを表示
                        gradeLabel.text = result.grade;
                        gradeLabel.x = chara.x - gradeLabel.width / 2;
                        gradeLabel.y = chara.y;
                        gradeLabel.ticks = 0;
                        gradeLabel.visible = true;
                        // スコアを表示
                        scoreLabel.text = result.score;
                        scoreLabel.x = chara.x - scoreLabel.width / 2;
                        scoreLabel.y = gradeLabel.y - 30;
                        scoreLabel.ticks = 0;
                        scoreLabel.visible = true;
                        // ボーナスを表示
                        extraLabel.text = result.extra;
                        extraLabel.x = chara.x - extraLabel.width / 2;
                        extraLabel.y = gradeLabel.y - 60;
                        extraLabel.ticks = 0;
                        extraLabel.visible = true;
                        // トータルスコアラベルを更新
                        totalScoreLabel.text = TOTAL_FORMAT + chara.score;
                        // 残ラベルを更新
                        leftLabel.text = LEFT_FORMAT + (BASE_COUNT + extraCount - jumpCount - 1);
                        // ジャンプ中フラグON
                        jumping = true;
                        // 土台を追加 && 飛んだ土台を削除
                        if(jumpCount > 1) {
                            if (basesArray[jumpCount + 3]) stage.addChild(basesArray[jumpCount + 3]);
                            stage.removeChild(basesArray[jumpCount - 2]);
                        }
                    }
                }
            );

            scene.primaryAction = function () { scene.dispatchEvent(new Event(Event.TOUCH_START)); };
            return scene;
        };

        // ゴールシーン
        var createGameClearScene = function(score) {
            return createResultScene(score + BONUS_SCORE, true);
        };
        var createGameOverScene = function(score) {
            return createResultScene(score, false);
        };
        var createResultScene = function(score, cleared) {
            var scene = new Scene();
            scene.backgroundColor = 'rgba(0, 0, 0, 0.76)';
            var banner = new Sprite(cleared ? 267 : 189, cleared ? 48 : 97);
            banner.image = game.assets[cleared ? './img/clear.png' : './img/end.png'];
            banner.x = (SCREEN_WIDTH - banner.width) / 2;
            banner.y = cleared ? 128 : 104;
            scene.addChild(banner);
            if (cleared) addText(scene, BONUS_FORMAT + BONUS_SCORE, 190, BONUS_FONT, '#fff');
            addText(scene, CLEAR_TOTAL_FORMAT + score, 233, CLEAR_TOTAL_FONT, '#fff');
            addText(scene, 'BEST : ' + bestScore(score), 280, '22px system-ui', '#ffdc73');
            var retry = addText(scene, 'RETRY', 340, '32px system-ui', '#fff');
            var home = addText(scene, 'TITLE', 392, '22px system-ui', '#ffdc73');
            scene.primaryAction = function () {
                game.popScene();
                initialize();
                game.replaceScene(createCountDownScene());
            };
            retry.addEventListener(Event.TOUCH_START, scene.primaryAction);
            home.addEventListener(Event.TOUCH_START, function () {
                game.popScene();
                game.replaceScene(createTitleScene());
            });
            return scene;
        };

        // スタートシーンの表示
        game.replaceScene(createTitleScene());
    }

    game.start();
};

// キャラのジャンプ動作
function charaMoving(chara, base) {
    if(jumping) {
        chara.vy += chara.ay;
        chara.y += chara.vy;
        if(chara.y >= INITIAL_Y) {
            chara.y = INITIAL_Y;
            // 着地時にジャンプ回数をインクリメント
            jumpCount++;
            jumping = false;
        }
    } else {
        // 穴があれば落ちる。
        if(isTouch(chara, basesArray[jumpCount])) {
            // do something.
        } else {
            isGameOver = true;
            chara.y += JUMP_STEP;
        }
    }
    chara.x += SCROLL_SPEED;

    chara.frame = frameNo++;
    if(frameNo >= CHARA_PATTERN){
        frameNo = 0;
    }
}

// 点数計算
function calcScore(chara, x, width) {
    // 踏み切り位置の取得
    var distance = x - (chara.x + chara.width / 2 - 4); // 4は調整値。ど真ん中より4px後ろ側に当たり判定
    // 何パーセントで踏み切ってるか（ログ用）
    var position = (width - distance) / width;
    var result = Array();
    var multiple = 1;

//console.log('edge=' + x + ", jump=" + chara.x + ", charaW=" + chara.width + ", distance=" + distance + ", position=" + position + ',multiple=' + multiple);

    result.grade = '';
    result.extra = '';
    if(distance >= SCROLL_SPEED * 8) { // 8フレーム分離れてたらアウト
        result.grade = 'MISS';
        result.extra = '-2';
        if(jumpCount + 2 < BASE_COUNT + extraCount && jumpCount + 2 < MAX_COUNT) {
            extraCount = extraCount - 2;
        } else if(jumpCount + 1 < BASE_COUNT + extraCount && jumpCount + 1 < MAX_COUNT){
            extraCount = extraCount - 1;
        } else {
            // do nothing.
        }
        multiple = 0;
        streak = 1;
    } else if(distance >= SCROLL_SPEED * 6) {
        result.grade = 'POOR';
        result.extra = '-1';
        if(jumpCount + 1 < BASE_COUNT + extraCount && jumpCount + 1 < MAX_COUNT) {
            extraCount = extraCount - 1;
        }
        multiple = 0.5;
        streak = 1;
    } else if(distance >= SCROLL_SPEED * 2) {
        result.grade = 'GOOD';
        multiple = 1;
        streak = 1;
    } else if(distance >= SCROLL_SPEED * 1) {
        result.grade = 'EXCELLENT';
        result.extra = '+1';
        extraCount = extraCount + 1;
        multiple = 1.2;
    } else if(distance == 0) {
        result.grade = 'PERFECT';
        result.extra = '+2';
        extraCount = extraCount + 2;
        multiple = 1.5;
    } else {
        // impossible.
    }

    result.score = Math.floor(position * BASE_POINT * streak * multiple);
    chara.score += result.score;

    if(result.grade == 'EXCELLENT') {
        streak++;
    } else if(result.grade == 'PERFECT') {
        streak++;
    } else {
        streak = 1;
    }

    return result;
}

// 初期化
function initialize() {
    streak = 1;
    jumping = false;
    isGameOver = false;
    jumpCount = 0;
    extraCount = 0;
    currentExtraCount = 0;
    baseWidth = new Array(INITIAL_COUNT);
    baseX = new Array(INITIAL_COUNT + 1);
    baseEdgeX = new Array(INITIAL_COUNT);
    basesArray = new Array(INITIAL_COUNT);
    currentObjectId = '';
    currentCreatedAt = '';
    currentPlayer = '';
    currentScore = 0;
    isRegistered = false;
}
// Offline browser edition: no analytics or network features.
function trackPage() {}
function trackEvent() {}
function isTouch(chara, base) {
    return chara.y + chara.height >= base.y && chara.x + chara.width / 2 >= base.x && base.x + base.width >= chara.x + chara.width / 2;
}
function addText(scene, text, y, font, color) {
    var label = new Label(text);
    label.width = SCREEN_WIDTH;
    label.height = 42;
    label.y = y;
    label.font = font;
    label.color = color;
    label.textAlign = 'center';
    scene.addChild(label);
    return label;
}
var sessionBest = 0;
function bestScore(score) {
    var key = 'edgejumper.best.v1';
    try { sessionBest = Math.max(sessionBest, Number(localStorage.getItem(key)) || 0); } catch (_) {}
    if (score > sessionBest) {
        sessionBest = score;
        try { localStorage.setItem(key, String(sessionBest)); } catch (_) {}
    }
    return sessionBest;
}
