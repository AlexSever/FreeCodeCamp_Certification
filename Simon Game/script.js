(function() {

    var id = null;
    var i = 0;

    var SimonGame = {

        switchBtn: document.querySelector('.switch'),
        startGameBtn: document.querySelector('.start-game .button'),
        currentScore: document.querySelector('.display span'),
        display: document.querySelector('.display'),
        strictModeBtn: document.querySelector('.strict-mode .button'),
        strictModeLed: document.querySelector('.led'),
        playBtns: document.querySelectorAll('.clicking'),

        init: function() {
            this.moves = [];
            this.movesCounter = 0;
            this.movesForWin = 25;

            if (!SimonGame.strictModeLed.classList[1]) {
                this.strictMode = false;
            }
        },
        construct: function(sign) {
            this.init();
            this.resetClasses();
            this.resetTimers();
            this.resetDisplay(sign);

            this.playBtns.forEach(function(btn) {
                btn.addEventListener('click', addClickEvent);
            });
        },
        resetDisplay: function(sign) {
            this.currentScore.innerHTML = sign;
        },
        resetClasses: function() {
            this.display.classList.remove('blinking');
            this.playBtns.forEach(function(btn) {
                btn.classList.remove('active');
            });

            makeUnclickable();
        },
        resetTimers: function() {
            clearTimeout(this.activeButtonTimer);
            clearTimeout(this.loopTimer);
            clearTimeout(this.addNewLevelTimer);
            clearTimeout(this.removeActiveTimer);
            clearTimeout(this.nextIterationTimer);
            clearTimeout(this.restartLevelLoopTimer);
        },
        blinkDisplay: function(cb) {
            this.display.classList.add('blinking');
            this.blinkingTimer = setTimeout(function() {
                this.display.classList.remove('blinking');
                if (cb) cb();
            }.bind(this), 1500);
        },
        getCurrentScore: function() {
            return this.currentScore.innerHTML;
        },
        setCurrentScore: function(s) {
            s = String(s);
            if (s.length < 2) s = '0' + s;
            this.currentScore.innerHTML = s;
        }
    };

    SimonGame.startGameBtn.addEventListener('click', startGame);
    SimonGame.switchBtn.addEventListener('click', function() {
        
        SimonGame.construct('--');
        SimonGame.display.classList.toggle('display-on');
        // `this` points to SimonGame.swithchBtn
        this.classList.toggle('active');
        
        if (this.classList[1] === 'active') {
            SimonGame.strictModeBtn.addEventListener('click', strictModeGame);
        } else {
            SimonGame.strictModeLed.classList.remove('led-on');
            SimonGame.playBtns.forEach(function(btn) {
                btn.classList.remove('clickable');
            });
        }
    });

    function startGame() {
        if (SimonGame.switchBtn.classList[1] === 'active') {
            i = 0;
            id = null;

            SimonGame.construct('--');
            SimonGame.blinkDisplay(addNewLevel);
        }
    }

    function strictModeGame() {
        toggleLed();
        SimonGame.strictMode = !SimonGame.strictMode;
        if (SimonGame.strictMode && SimonGame.movesCounter > 1) {
            startGame();
        }
    }

    function toggleLed() {
        SimonGame.strictModeLed.classList.toggle('led-on');
    }

    function makeClickable() {
        SimonGame.playBtns.forEach(function(btn) {
            btn.classList.add('clickable');
        });
    }

    function makeUnclickable() {
        SimonGame.playBtns.forEach(function(btn) {
            btn.classList.remove('clickable');
        });
    }

    function addNewLevel() {
        var index = Math.floor(Math.random() * 4);

        SimonGame.moves.push(index);
        SimonGame.setCurrentScore(++SimonGame.movesCounter);

        loopPlayButtons(true);
    }

    function addClickEvent(e) {
        if (this.classList[2] === 'clickable') {

            id = e.target.getAttribute('data-id');
            SimonGame.resetTimers();
            playAudio(id);

            if (SimonGame.moves[i] == id) {
                restartLevelWithDelay(true);
                if (++i === SimonGame.movesCounter) {
                    i = 0;
                    makeUnclickable();
                    SimonGame.resetTimers();
                    SimonGame.addNewLevelTimer = setTimeout(addNewLevel, 1000);
                }
            } else {
                i = 0;
                makeUnclickable();
                restartLevel(true);
            }
        }
    }

    function loopPlayButtons(mod) {
        var activeBtnSpeed = 700,
            nextIterationSpeed = 400;

        // Increase speed in 5 moves
        if (SimonGame.movesCounter > 5 && SimonGame.movesCounter <= 10) {
            activeBtnSpeed = activeBtnSpeed - 100;
            nextIterationSpeed = nextIterationSpeed - 100;
        } else if (SimonGame.movesCounter > 10 && SimonGame.movesCounter <= 15) {
            activeBtnSpeed = activeBtnSpeed - 200;
            nextIterationSpeed = nextIterationSpeed - 200;
        } else if (SimonGame.movesCounter > 15) {
            activeBtnSpeed = activeBtnSpeed - 300;
            nextIterationSpeed = nextIterationSpeed - 300;
        }    

        console.log(SimonGame.moves);

        (function loop(j) {
            SimonGame.playBtns[SimonGame.moves[j]].classList.add('active');
            playAudio(SimonGame.moves[j]);
            SimonGame.removeActiveTimer = setTimeout(function() {
                SimonGame.playBtns[SimonGame.moves[j]].classList.remove('active');
                SimonGame.nextIterationTimer = setTimeout(function() {
                    ++j < SimonGame.movesCounter ? loop(j) : makeClickable();

                    if (j === SimonGame.movesCounter && mod) {
                        restartLevelWithDelay(mod);
                    }
                }, nextIterationSpeed);
            }, activeBtnSpeed);
        })(0);
    }

    function restartLevel(mod) {
        var cScore = SimonGame.getCurrentScore();

        SimonGame.resetDisplay('!!');
        SimonGame.blinkDisplay();

        SimonGame.restartLevelTimer = setTimeout(function() {
            if (SimonGame.strictMode) {
                startGame();
            } else {
                SimonGame.setCurrentScore(cScore);
                SimonGame.loopTimer = setTimeout(function() { loopPlayButtons(mod); }, 1500);
            }
        }, 1500);
    }

    function restartLevelWithDelay(mod) {
        SimonGame.restartLevelLoopTimer = setTimeout(function() {
            makeUnclickable();
            restartLevel(mod);
        }, 5000);
    }

    function playAudio(index) {
        var file = '';
        switch(Number(index) + 1) {
            case 1: file = 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'; break;
            case 2: file = 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'; break;
            case 3: file = 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'; break;
            case 4: file = 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'; break;
        }
        return new Audio(file).play();
    }

})();
