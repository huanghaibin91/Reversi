// 全局变量
// 确定是否是先手黑子
var upper_hand = true;
// 游戏模式，人与人或人与AI
var ai_flag = false;
// 玩家是否选择先手
var choose = true;
// 这局是否结束
var over = true;
// 初始棋盘模拟数组
var simulate_chess = chessArr().chess_arr;

window.onload = function () {
    // 隐藏加载页
    $('.loading-icon').css('display', 'none');
    $('.door-left, .door-right').addClass('open');
    $('.door-left').on('transitionend', function () {
        $('.loading-box').css('display', 'none');
    });
    // 检查本地储存是否有玩家
    if (localStorage.getItem('player')) {
        $('.game-menu').modal({
            show: true,
            backdrop: 'static'
        });
        getPlayerMessage();
    } else {
        $('.add-player').modal({
            show: true,
            backdrop: 'static'
        });
    }
}

$(document).ready(function () {
    // 绘制棋盘
    drawChessboard();
    // 根据屏幕变化改变棋盘尺寸
    $(window).resize(function () {
        var width = $('.chessboard-part').width();
        $('.chessboard-part').css('height', width + 'px');
    });
    // 添加新玩家
    $('.save-player').on('click touchend', function () {
        localStorage.removeItem('player');
        var player = {};
        if ($('.player-input').val()) {
            player.name = $('.player-input').val();
            player.number = 0;
            player.win = 0;
            player.max = 0;
            localStorage.setItem('player', JSON.stringify(player));
            $('.add-player').modal('hide');
            $('.game-menu').modal({
                show: true,
                backdrop: 'static'
            });
            getPlayerMessage();
        } else {
            $('.form-group').addClass('has-error');
            $('.help-block').css('display', 'block');
        }
    });
    // 关闭添加新玩家
    $('.close-add-player, .close-player-message').on('click touchend', function () {
        $('.game-menu').modal({
            show: true,
            backdrop: 'static'
        });
    });
    // 游戏目录
    $('.game-menu .modal-body').on('click touchend', function (event) {
        var $target = $(event.target);
        $('.game-menu').modal('hide');
        if ($target.hasClass('ai')) {
            ai_flag = true;
            $('.player-name').text(JSON.parse(localStorage.getItem('player')).name);
        } else if ($target.hasClass('man')) {
            $('.player-name').text(JSON.parse(localStorage.getItem('player')).name);
        } else if ($target.hasClass('player')) {
            $('.player-message').modal({
                show: true
            });
        } else if ($target.hasClass('revise')) {
            $('.add-player').modal({
                show: true,
                backdrop: 'static'
            });
        }
    });
    // 玩家信息
    $('.player-message').on('hidden.bs.modal', function () {
        $('.game-menu').modal({
            show: true,
            backdrop: 'static'
        });
    })
    // 重开一局
    $('.restart').on('click touchend', function () {
        window.location.reload();
    });
    // 取消
    $('.cancel').on('click touchend', function () {
        $('.game-result').modal('hide');
    });
    // 玩家点击落子
    $('#chess-board').on('click touchend', function (e) {
        var target = e.target;
        var target_row = parseInt(target.id.charAt(0)); // 落子处行
        var target_column = parseInt(target.id.charAt(1)); // 落子处列
        var _target = simulate_chess[target_row][target_column];
        // 翻转的棋子数组
        var change_arr = checkChess(_target, upper_hand, simulate_chess);
        if (change_arr.length !== 0) {
            drawChess(target);
            if (!upper_hand) {
                change_arr.forEach(function (arr) {
                    var ele = document.getElementById(arr[2]);
                    $(ele.firstElementChild).removeClass('change');
                });
                $('#current-color').addClass('change');
            } else {
                change_arr.forEach(function (arr) {
                    var ele = document.getElementById(arr[2]);
                    $(ele.firstElementChild).addClass('change');
                });
                $('#current-color').removeClass('change');
            }
            // 返回新的棋盘模拟数组和黑白子的分数
            simulate_chess = chessArr().chess_arr;
            $('.black').text(chessArr().black_score);
            $('.white').text(chessArr().white_score);
            if (chessArr().black_score > chessArr().white_score) {
                $('.result-color').text('黑子胜！');
            } else if (chessArr().black_score < chessArr().white_score) {
                $('.result-color').text('白子胜！');
            } else if (chessArr().black_score === chessArr().white_score) {
                $('.result-color').text('平局！');
            }
            var empty = chessArr().empty;
            if (empty == 0) {
                setTimeout(function () {
                    $('.game-result').modal('show');
                    if (ai_flag) {
                        updatePlayerMessage(chessArr().black_score, chessArr().white_score);
                        getPlayerMessage();
                    }
                }, 2000);
            } else {
                // 落子之后检查下一轮是否有落子处，如没有下一回合跳过
                var chess_arr = scoreCount(simulate_chess, upper_hand).chess_arr;
                if (chess_arr.length == 0) {
                    if (upper_hand) {
                        upper_hand = !upper_hand;
                        // alert('黑子回合跳过');
                        $('.black-pass').css('display', 'block');
                        setTimeout(function () {
                            $('.black-pass').css('display', 'none');
                        }, 1000);
                    } else {
                        upper_hand = !upper_hand;
                        // alert('白子回合跳过');
                        $('.white-pass').css('display', 'block');
                        setTimeout(function () {
                            $('.white-pass').css('display', 'none');
                        }, 1000);
                    }
                } else {
                    if (ai_flag) {
                        setTimeout(ai, 1000);
                    }
                }
            }
        }
    });
});
// 获取玩家信息
function getPlayerMessage() {
    $('.player-name').text(JSON.parse(localStorage.getItem('player')).name);
    $('.player-number').text(JSON.parse(localStorage.getItem('player')).number);
    $('.player-win').text(JSON.parse(localStorage.getItem('player')).win);
    $('.player-max').text(JSON.parse(localStorage.getItem('player')).max);
}
// 更新玩家信息
function updatePlayerMessage(black, white) {
    var player = {};
    player.name = JSON.parse(localStorage.getItem('player')).name;
    player.number = JSON.parse(localStorage.getItem('player')).number + 1;
    if (black > white) {
        player.win = JSON.parse(localStorage.getItem('player')).win + 1;
    } else {
        player.win = JSON.parse(localStorage.getItem('player')).win;
    }
    if (black > JSON.parse(localStorage.getItem('player')).max) {
        player.max = black;
    } else {
        player.max = JSON.parse(localStorage.getItem('player')).max;
    }
    localStorage.setItem('player', JSON.stringify(player));
}
// 绘制棋盘
function drawChessboard() {
    var chessboard = document.getElementById('chess-board');
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var chessboard_part = document.createElement('div');
            chessboard_part.id = '' + i + j;
            chessboard_part.className = 'chessboard-part';
            $(chessboard_part).css('height', $(chessboard).width() / 8 + 'px');
            if (i % 2 == 0) {
                if (j % 2 !== 0) {
                    chessboard_part.className = 'chessboard-part active';
                }
            } else {
                if (j % 2 == 0) {
                    chessboard_part.className = 'chessboard-part active';
                }
            }
            chessboard.appendChild(chessboard_part);
        }
    }
    // 棋盘最开始的四颗子
    drawChess(document.getElementById('34'));
    drawChess(document.getElementById('33'));
    drawChess(document.getElementById('43'));
    drawChess(document.getElementById('44'));
}

// 画棋子
function drawChess(target) {
    var chess = document.createElement('div');
    chess.className = 'chess';
    var chess_black = document.createElement('div');
    chess_black.className = 'chess-black';
    chess.appendChild(chess_black);
    var chess_white = document.createElement('div');
    chess_white.className = 'chess-white';
    chess.appendChild(chess_white);
    target.appendChild(chess);
    if (upper_hand) {
        upper_hand = false;
    } else {
        var chess = target.firstElementChild;
        $(chess).addClass('change');
        upper_hand = true;
    }
}

// 以数组模拟棋盘
function chessArr() {
    var arr = [
        [
            [0, 900, '00'],
            [0, -60, '01'],
            [0, 10, '02'],
            [0, 10, '03'],
            [0, 10, '04'],
            [0, 10, '05'],
            [0, -60, '06'],
            [0, 900, '07']
        ],
        [
            [0, -60, '10'],
            [0, -80, '11'],
            [0, 5, '12'],
            [0, 5, '13'],
            [0, 5, '14'],
            [0, 5, '15'],
            [0, -80, '16'],
            [0, -60, '17']
        ],
        [
            [0, 10, '20'],
            [0, 5, '21'],
            [0, 1, '22'],
            [0, 1, '23'],
            [0, 1, '24'],
            [0, 1, '25'],
            [0, 5, '26'],
            [0, 10, '27']
        ],
        [
            [0, 10, '30'],
            [0, 5, '31'],
            [0, 1, '32'],
            [2, 1, '33'],
            [1, 1, '34'],
            [0, 1, '35'],
            [0, 5, '36'],
            [0, 10, '37']
        ],
        [
            [0, 10, '40'],
            [0, 5, '41'],
            [0, 1, '42'],
            [1, 1, '43'],
            [2, 1, '44'],
            [0, 1, '45'],
            [0, 5, '46'],
            [0, 10, '47']
        ],
        [
            [0, 10, '50'],
            [0, 5, '51'],
            [0, 1, '52'],
            [0, 1, '53'],
            [0, 1, '54'],
            [0, 1, '55'],
            [0, 5, '56'],
            [0, 10, '57']
        ],
        [
            [0, -60, '60'],
            [0, -80, '61'],
            [0, 5, '62'],
            [0, 5, '63'],
            [0, 5, '64'],
            [0, 5, '65'],
            [0, -80, '66'],
            [0, -60, '67']
        ],
        [
            [0, 900, '70'],
            [0, -60, '71'],
            [0, 10, '72'],
            [0, 10, '73'],
            [0, 10, '74'],
            [0, 10, '75'],
            [0, -60, '76'],
            [0, 900, '77']
        ]
    ];
    var black_score = 0;
    var white_score = 0;
    var empty = 0;
    // 每步开始时，将棋盘状态转化到棋盘模拟数组中
    var div = document.getElementsByClassName('chessboard-part');
    for (var i = 0; i < div.length; i++) {
        var row = parseInt(div[i].id.charAt(0));
        var column = parseInt(div[i].id.charAt(1));
        if (div[i].childNodes.length == 0) {
            arr[row][column][0] = 0;
            empty++;
        } else {
            if (div[i].firstChild.className == 'chess') {
                arr[row][column][0] = 1;
                black_score++;
            } else {
                arr[row][column][0] = 2;
                white_score++;
            }
        }
    }
    return {
        chess_arr: arr,
        black_score: black_score,
        white_score: white_score,
        empty: empty
    };
}

// 检查目标位置落子可翻转的棋子
// 以chessBoard为准
function checkChess(target, flag, chessBoard) {
    var final_arr = []; // 可翻转棋子的数组
    var target_id = target[2];
    var target_row = parseInt(target_id.charAt(0)); // 落子处行
    var target_column = parseInt(target_id.charAt(1)); // 落子处列
    var direction = ['left-top', 'top', 'right-top', 'left', 'right', 'left-bottom', 'bottom',
        'right-bottom'
    ]; // 搜索方向
    if (target[0] !== 0) {
        return final_arr;
    } else {
        // 搜索一个方向上可以翻转的棋子
        var searchChess = function (direction) {
            // 这个方向可以翻转的棋子数组
            var dir_arr = [];
            // 落子位置的行列
            var row = target_row;
            var column = target_column;
            // 各个方向的情况
            switch (direction) {
                // 左上方
                case 'left-top':
                    var j = column - 1;
                    for (var i = row - 1; i >= 0; i--) {
                        if (j >= 0) {
                            if (chessBoard[i][j][0] == 0) {
                                dir_arr = [];
                                break;
                            } else {
                                if (flag) {
                                    if (chessBoard[i][j][0] == 2) {
                                        dir_arr.push(chessBoard[i][j]);
                                    } else {
                                        final_arr = final_arr.concat(dir_arr);
                                        break;
                                    }
                                } else {
                                    if (chessBoard[i][j][0] == 1) {
                                        dir_arr.push(chessBoard[i][j]);
                                    } else {
                                        final_arr = final_arr.concat(dir_arr);
                                        break;
                                    }
                                }
                            }
                        }
                        j--;
                    };
                    break;
                    // 上方
                case 'top':
                    var j = column;
                    for (var i = row - 1; i >= 0; i--) {
                        if (chessBoard[i][j][0] == 0) {
                            dir_arr = [];
                            break;
                        } else {
                            if (flag) {
                                if (chessBoard[i][j][0] == 2) {
                                    dir_arr.push(chessBoard[i][j]);
                                } else {
                                    final_arr = final_arr.concat(dir_arr);
                                    break;
                                }
                            } else {
                                if (chessBoard[i][j][0] == 1) {
                                    dir_arr.push(chessBoard[i][j]);
                                } else {
                                    final_arr = final_arr.concat(dir_arr);
                                    break;
                                }
                            }
                        }
                    };
                    break;
                    // 右上方
                case 'right-top':
                    var j = column + 1;
                    for (var i = row - 1; i >= 0; i--) {
                        if (j <= 7) {
                            if (chessBoard[i][j][0] == 0) {
                                dir_arr = [];
                                break;
                            } else {
                                if (flag) {
                                    if (chessBoard[i][j][0] == 2) {
                                        dir_arr.push(chessBoard[i][j]);
                                    } else {
                                        final_arr = final_arr.concat(dir_arr);
                                        break;
                                    }
                                } else {
                                    if (chessBoard[i][j][0] == 1) {
                                        dir_arr.push(chessBoard[i][j]);
                                    } else {
                                        final_arr = final_arr.concat(dir_arr);
                                        break;
                                    }
                                }
                            }
                        }
                        j++;
                    };
                    break;
                    // 左边
                case 'left':
                    var i = row;
                    for (var j = column - 1; j >= 0; j--) {
                        if (chessBoard[i][j][0] == 0) {
                            dir_arr = [];
                            break;
                        } else {
                            if (flag) {
                                if (chessBoard[i][j][0] == 2) {
                                    dir_arr.push(chessBoard[i][j]);
                                } else {
                                    final_arr = final_arr.concat(dir_arr);
                                    break;
                                }
                            } else {
                                if (chessBoard[i][j][0] == 1) {
                                    dir_arr.push(chessBoard[i][j]);
                                } else {
                                    final_arr = final_arr.concat(dir_arr);
                                    break;
                                }
                            }
                        }
                    };
                    break;
                    // 右边
                case 'right':
                    var i = row;
                    for (var j = column + 1; j <= 7; j++) {
                        if (chessBoard[i][j][0] == 0) {
                            dir_arr = [];
                            break;
                        } else {
                            if (flag) {
                                if (chessBoard[i][j][0] == 2) {
                                    dir_arr.push(chessBoard[i][j]);
                                } else {
                                    final_arr = final_arr.concat(dir_arr);
                                    break;
                                }
                            } else {
                                if (chessBoard[i][j][0] == 1) {
                                    dir_arr.push(chessBoard[i][j]);
                                } else {
                                    final_arr = final_arr.concat(dir_arr);
                                    break;
                                }
                            }
                        }
                    };
                    break;
                    // 左下
                case 'left-bottom':
                    var j = column - 1;
                    for (var i = row + 1; i <= 7; i++) {
                        if (j >= 0) {
                            if (chessBoard[i][j][0] == 0) {
                                dir_arr = [];
                                break;
                            } else {
                                if (flag) {
                                    if (chessBoard[i][j][0] == 2) {
                                        dir_arr.push(chessBoard[i][j]);
                                    } else {
                                        final_arr = final_arr.concat(dir_arr);
                                        break;
                                    }
                                } else {
                                    if (chessBoard[i][j][0] == 1) {
                                        dir_arr.push(chessBoard[i][j]);
                                    } else {
                                        final_arr = final_arr.concat(dir_arr);
                                        break;
                                    }
                                }
                            }
                        }
                        j--;
                    };
                    break;
                    // 下方
                case 'bottom':
                    var j = column;
                    for (var i = row + 1; i <= 7; i++) {
                        if (chessBoard[i][j][0] == 0) {
                            dir_arr = [];
                            break;
                        } else {
                            if (flag) {
                                if (chessBoard[i][j][0] == 2) {
                                    dir_arr.push(chessBoard[i][j]);
                                } else {
                                    final_arr = final_arr.concat(dir_arr);
                                    break;
                                }
                            } else {
                                if (chessBoard[i][j][0] == 1) {
                                    dir_arr.push(chessBoard[i][j]);
                                } else {
                                    final_arr = final_arr.concat(dir_arr);
                                    break;
                                }
                            }
                        }
                    };
                    break;
                    // 右下
                case 'right-bottom':
                    var j = column + 1;
                    for (var i = row + 1; i <= 7; i++) {
                        if (j <= 7) {
                            if (chessBoard[i][j][0] == 0) {
                                dir_arr = [];
                                break;
                            } else {
                                if (flag) {
                                    if (chessBoard[i][j][0] == 2) {
                                        dir_arr.push(chessBoard[i][j]);
                                    } else {
                                        final_arr = final_arr.concat(dir_arr);
                                        break;
                                    }
                                } else {
                                    if (chessBoard[i][j][0] == 1) {
                                        dir_arr.push(chessBoard[i][j]);
                                    } else {
                                        final_arr = final_arr.concat(dir_arr);
                                        break;
                                    }
                                }
                            }
                        }
                        j++;
                    };
                    break;
                default:
                    break;
            }
        };
        // 在各个方向搜索可以翻转的棋子
        direction.forEach(function (dir) {
            searchChess(dir);
        });
        return final_arr;
    }
};

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
                $(ele.firstElementChild).removeClass('change');
            });
            $('#current-color').addClass('change');
        } else {
            change_arr.forEach(function (arr) {
                var ele = document.getElementById(arr[2]);
                $(ele.firstElementChild).addClass('change');
            });
            $('#current-color').removeClass('change');
        }
    }
    // 返回新的棋盘模拟数组和黑白子的分数
    simulate_chess = chessArr().chess_arr;
    $('.black').text(chessArr().black_score);
    $('.white').text(chessArr().white_score);
    if (chessArr().black_score > chessArr().white_score) {
        $('.result-color').text('黑子胜！');
    } else if (chessArr().black_score < chessArr().white_score) {
        $('.result-color').text('白子胜！');
    } else if (chessArr().black_score === chessArr().white_score) {
        $('.result-color').text('平局！');
    }
    // 落子之后检查下一轮是否有落子处，如没有下一回合跳过
    var empty = chessArr().empty;
    if (empty == 0) {
        setTimeout(function () {
            $('.game-result').modal('show');
            updatePlayerMessage(chessArr().black_score, chessArr().white_score);
            getPlayerMessage();
        }, 2000);
    } else {
        var chess_arr = scoreCount(simulate_chess, upper_hand).chess_arr;
        if (chess_arr.length == 0) {
            upper_hand = !upper_hand;
            // alert('黑子回合跳过');
            $('.black-pass').css('display', 'block');
            setTimeout(function () {
                $('.black-pass').css('display', 'none');
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
// 深度复制多维数组
function deepCopy(obj) {
    var out = [];
    var len = obj.length;
    for (var i = 0; i < len; i++) {
        if (obj[i] instanceof Array) {
            out[i] = deepCopy(obj[i]);
        } else {
            out[i] = obj[i];
        }
    }
    return out;
}