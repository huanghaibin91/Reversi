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
// 页面加载完毕后绘制棋盘
window.onload = function () {
    drawChessboard();
    document.querySelector('.loading-box').style.display = 'none';
}
// 游戏按钮
var chessboard = document.getElementById('chessboard');
var color = document.getElementsByClassName('color')[0];
var black = document.getElementsByClassName('black');
var white = document.getElementsByClassName('white');
var btnBox = document.getElementsByClassName('btn-box')[0];
var currentColor = document.getElementById('current-color');
var resultBox = document.getElementsByClassName('result-box')[0];
var resultColor = document.getElementsByClassName('result-color')[0]
var restart = document.getElementsByClassName('restart');
var cancel = document.getElementsByClassName('cancel')[0];
var blackPass = document.querySelector('.black-pass');
var whitePass = document.querySelector('.white-pass');
// 选择游戏模式
btnBox.addEventListener('click', function (e) {
    var startBox = document.getElementsByClassName('start-game')[0];
    var target = e.target;
    if (target.className == 'man') {
        addClass(startBox, 'hide');
    } else if (target.className == 'ai') {
        ai_flag = true;
        addClass(startBox, 'hide');
    }
}, false);
// 重新开始
for (var i = 0; i < restart.length; i++) {
    restart[i].onclick = function () {
        window.location.reload();
    }
}
cancel.onclick = function () {
    resultBox.style.display = 'none';
};
// 玩家点击落子
chessboard.addEventListener('click', function (e) {
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
                removeClass(ele.firstChild, 'change');
            });
            addClass(currentColor, 'change');
        } else {
            change_arr.forEach(function (arr) {
                var ele = document.getElementById(arr[2]);
                addClass(ele.firstChild, 'change');
            });
            removeClass(currentColor, 'change');
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
        var empty = chessArr().empty;
        if (empty == 0) {
            // resultBox.style.display = 'block';
            setTimeout(function () {
                resultBox.style.display = 'block';
            }, 2000);
        } else {
            // 落子之后检查下一轮是否有落子处，如没有下一回合跳过
            var chess_arr = scoreCount(simulate_chess, upper_hand).chess_arr;
            if (chess_arr.length == 0) {
                if (upper_hand) {
                    upper_hand = !upper_hand;
                    // alert('黑子回合跳过');
                    blackPass.style.display = 'block';
                    setTimeout(function () {
                        blackPass.style.display = 'none';
                    }, 1000);
                } else {
                    upper_hand = !upper_hand;
                    // alert('白子回合跳过');
                    whitePass.style.display = 'block';
                    setTimeout(function () {
                        whitePass.style.display = 'none';
                    }, 1000);
                } 
            } else {
                if (ai_flag) {
                    setTimeout(ai, 1000);
                }
            }
        }
    }
}, false);
// 绘制棋盘
var drawChessboard = function () {
    var chessboard = document.getElementById('chessboard');
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var chessboard_part = document.createElement('div');
            chessboard_part.id = '' + i + j;
            chessboard_part.className = 'chessboard-part';
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
var drawChess = function (target) {
    var chess = document.createElement('div');
    chess.className = 'chess';
    var chess_black = document.createElement('div');
    chess_black.className = 'chess_black';
    chess.appendChild(chess_black);
    var chess_white = document.createElement('div');
    chess_white.className = 'chess_white';
    chess.appendChild(chess_white);
    target.appendChild(chess);
    if (upper_hand) {
        upper_hand = false;
    } else {
        var chess = target.firstChild;
        addClass(chess, 'change');
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