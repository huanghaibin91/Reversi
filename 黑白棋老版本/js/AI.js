// 电脑AI
function ai() {
    var step = score();
    var target_row = parseInt(step[1][2].charAt(0)); // 落子处行
    var target_column = parseInt(step[1][2].charAt(1)); // 落子处列
    var _target = simulate_chess[target_row][target_column];
    // 翻转的棋子数组
    var change_arr = checkChess(_target, upper_hand, simulate_chess);
    if (change_arr.length !== 0) {
        var ele = document.getElementById(step[1][2]);
        drawChess(ele);
        if (!upper_hand) {
            change_arr.forEach(function (arr) {
                var ele = document.getElementById(arr[2]);
                removeClass(ele.firstChild, 'change');
            });
        } else {
            change_arr.forEach(function (arr) {
                var ele = document.getElementById(arr[2]);
                addClass(ele.firstChild, 'change');
            });
        }
    }
    // 返回新的棋盘模拟数组和黑白子的分数
    simulate_chess = chessArr().chess_arr;
    for (var i = 0; i < black.length; i++) {
        black[i].innerHTML = chessArr().black_score;
        white[i].innerHTML = chessArr().white_score;
        if (chessArr().black_score > chessArr().white_score) {
            resultColor.innerHTML = '黑子';
        } else {
            resultColor.innerHTML = '白子';
        }
    }
    removeClass(currentColor, 'change');
    // 落子之后检查下一轮是否有落子处，如没有下一回合跳过
    var empty = chessArr().empty;
    if (empty == 0) {
        // resultBox.style.display = 'block';
        setTimeout(function () {
            resultBox.style.display = 'block';
        }, 2000);
    } else {
        var chess_arr = scoreCount(simulate_chess, upper_hand).chess_arr;
        if (chess_arr.length == 0) {
            upper_hand = !upper_hand;
            // alert('黑子回合跳过');
            blackPass.style.display = 'block';
            setTimeout(function () {
                blackPass.style.display = 'none';
            }, 1000);
            setTimeout(ai, 1000);
        }
    }
}
// 根据棋盘算出各个情况下的得分
function scoreCount(chessBoard, flag) {
    // 复制当前棋盘
    var copy_chessBoard = deepCopy(chessBoard);
    // 可以落子的位置
    var chess_arr = [];
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            // 检查棋盘每个格子可以翻转的棋子数组
            var flip_arr = checkChess(copy_chessBoard[i][j], flag, copy_chessBoard);
            if (flip_arr.length !== 0) {
                chess_arr.push(copy_chessBoard[i][j]);
            }
        }
    }
    // 模拟点击了可以点击的数组
    var score_arr = [];
    var chessBoard_arr = [];
    chess_arr.forEach(function (a) {
        var _chessBoard = deepCopy(copy_chessBoard);
        var i = parseInt(a[2].charAt(0));
        var j = parseInt(a[2].charAt(1));
        if (flag) {
            _chessBoard[i][j][0] = 1;
        } else {
            _chessBoard[i][j][0] = 2;
        }
        // 模拟点击
        var flip_arr = checkChess(a, flag, _chessBoard); // 翻转的数组
        var self_score = a[1]; // 这步得到的分数
        flip_arr.forEach(function (arr) {
            var _i = parseInt(arr[2].charAt(0));
            var _j = parseInt(arr[2].charAt(1));
            // 复制的棋盘翻转的数组变化了，但是落子处也应该变化
            self_score += arr[1];
            if (flag) {
                _chessBoard[_i][_j][0] = 1;
            } else {
                _chessBoard[_i][_j][0] = 2;
            }
        });
        chessBoard_arr.push(_chessBoard);
        score_arr.push(self_score);
    });
    return {
        chess_arr: chess_arr,
        score_arr: score_arr,
        chessBoard_arr: chessBoard_arr
    };
}
// 向后搜索三步，返回最优步
function score() {
    var final_step = [];
    var step = [];
    var score_chess = [];
    var chess_arr = scoreCount(simulate_chess, upper_hand).chess_arr;
    if (chess_arr.length == 1) {
        step.push(chess_arr[0]);
        final_step.push(chess_arr[0][1]);
        final_step.push(chess_arr[0]);
    } else {
        chess_arr.forEach(function (arr, index) {
            score_chess[index] = [];
            score_chess[index].push(arr);
        });
        // 第一层
        var score1 = scoreCount(simulate_chess, upper_hand).score_arr;
        score1.forEach(function (value, index) {
            score_chess[index].push(value);
        })
        var chessBoard_arr1 = scoreCount(simulate_chess, upper_hand).chessBoard_arr;
        // 第二层
        var chessBoard_arr2 = [];
        chessBoard_arr1.forEach(function (arr, index) {
            var score2 = scoreCount(arr, !upper_hand).score_arr;
            score_chess[index].push(score2);
            var chessBoard_arr = scoreCount(arr, !upper_hand).chessBoard_arr;
            chessBoard_arr2.push(chessBoard_arr);
        });
        // 第三层
        var chessBoard_arr3 = [];
        chessBoard_arr2.forEach(function (arr, index) {
            var score3 = [];
            var _chessBoard_arr3 = [];
            arr.forEach(function (arr) {
                var _score3 = scoreCount(arr, upper_hand).score_arr;
                var _chessBoard_arr = scoreCount(arr, upper_hand).chessBoard_arr;
                score3.push(_score3);
                _chessBoard_arr3.push(_chessBoard_arr);
            });
            score_chess[index].push(score3);
            chessBoard_arr3.push(_chessBoard_arr3);
        });
        // 估值
        score_chess.forEach(function (arr, index) {
            step[index] = [];
            var count = [];
            var num = arr[2];
            arr[3].forEach(function (arr, index) {
                var max = Math.max.apply(null, arr);
                var _count = max - num[index];
                count.push(_count);
            });
            var min = Math.min.apply(null, count);
            step[index].push(arr[1] + min);
            step[index].push(arr[0]);
        });
        step.sort(function (a, b) {
            return b[0] - a[0];
        });
        final_step = step[1];
    }
    return final_step;
}