$(document).ready(function() {

	// Board cells numbers
	var newBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9];

	var board = [1, 2, 3,
	             4, 5, 6,
	             7, 8, 9];

	// Keeps track of moves
	var computerMoves = [],
		humanMoves = [];

	// The various ways to win TicTacToe  
	var winPatterns = [[1, 2, 3], [4, 5, 6], [7, 8, 9], //Horizontal Wins
	                   [1, 4, 7], [2, 5, 8], [3, 6, 9], //Veritcal Wins
	                   [1, 5, 9], [3, 5, 7]];           //Diagonal Wins
	var winPatternNumber;

	var symbol = null,
		symbolChose = false;

	var clickCount = 0;

	var weHaveWinner = false;

	// Score:
	var player = 0,
		computer = 0,
		draw = 0;

	var calculations = {
		randomComputerMove: function (board) {
			var index = Math.floor(board.length * Math.random());
	    	var randomMove = board[index];
	    	return randomMove;
	    },
	    smartComputerMove: function () {
	    	// ==========================================
			// -    Part 1. Looking for moves to win    -
			// ==========================================
		  	var move = 0;
		  	// Find matching win patterns according to computer moves and Filter out patterns occupied by human.
		  	var filteredPatterns = winPatterns.filter(function(pattern) { 
				var i = 0;
				var j = 0;
		  		computerMoves.forEach(function(value) {
			      	if (pattern.indexOf(value) > -1) {
		    		  	i++;
		  		  	}
			    });
			    humanMoves.forEach(function(value) {
			    	if (pattern.indexOf(value) > -1) {
		    			j++;
		  		  	}
			    });  
		  		if (i >= 1 && j === 0) {
		  		  	return true;  
		  		} 
			});
			// Don't play next corner
			if (symbol === "X" && humanMoves.length === 2) {
			    if ((humanMoves[0] === 1 && humanMoves[1] === 9) || (humanMoves[0] === 3 && humanMoves[1] === 7)) {
			    	filteredPatterns.splice(-1,1);
			    }
		  	}
			// Create an array of possible win moves
			var possibleWinMoves = filteredPatterns.reduce(function(newArray, pattern) {
				pattern.forEach(function(value) {
				  	if (computerMoves.indexOf(value) === -1) {
						newArray.push(value);
					}
				});
				return newArray;
			}, []);
			/*
			var possibleWinMoves = [];
			filteredPatterns.forEach(function(pattern) {
			    pattern.forEach(function(value) {
				    if (computerMoves.indexOf(value) === -1) {
			    		possibleWinMoves.push(value);
			  		}
			    });
			});
			*/
			// Add opposite corner to play
		 	if (symbol === "O" && humanMoves.length === 1 && humanMoves[0] === 5) {
			    switch (computerMoves[0]) {
				    case 1: possibleWinMoves.push(9); break;
				    case 9: possibleWinMoves.push(1); break;
				    case 3: possibleWinMoves.push(7); break;
				    case 7: possibleWinMoves.push(3); break;
				}
		  	}
			// console.log("possibleWinMoves");
	    	// console.log(possibleWinMoves);

	    	// ==========================================================
		  	// -    Part 2.Check for a potential fork and prevent it    -
		  	// ==========================================================

			var potentialHumanMoves = possibleWinMoves.reduce(function(newArray, move) {
		      	var pseudoHumanMoves = humanMoves.slice();
		      	pseudoHumanMoves.push(move);
		      	newArray.push(pseudoHumanMoves);
		      	return newArray;
			}, []);
			  
			var potentialForkMoves = potentialHumanMoves.reduce(function(newArray, humanMove) {
			    var filteredPatterns = winPatterns.filter(function(pattern) { 
					var i = 0;
					var j = 0;
			  		humanMove.forEach(function(value) {
				      	if (pattern.indexOf(value) > -1) {
			    		  	i++;
			  		  	}
			    	});
			    	computerMoves.forEach(function(value) {
				    	if (pattern.indexOf(value) > -1) {
			    			j++;
			  		  	}
				    });  
			  		if (i >= 2 && j === 0) {
			  		  	return true;  
			  		} 
				});
			    // Create an array of possible human win moves
			    var bestPossibleHumanMoves = filteredPatterns.reduce(function(newArray, pattern) {
					pattern.forEach(function(value) {
					  	if (humanMoves.indexOf(value) === -1) {
							newArray.push(value);
						}
					});
					return newArray;
				}, []);
				/*
			    var bestPossibleHumanMoves = [];
				filteredPatterns.forEach(function(pattern) {
				    pattern.forEach(function(value) {
					    if (humanMoves.indexOf(value) === -1) {
				    		bestPossibleHumanMoves.push(value);
				  		}
				    });
				});
				*/
				var forkMove = bestPossibleHumanMoves.filter(function(elem, index, self) {
				    return index !== self.indexOf(elem);
				});
					
				if (forkMove.length > 0) {
				  	newArray.push(forkMove[0]);
				}

				return newArray;	
			}, []);
			// console.log("potentialForkMoves");
			// console.log(potentialForkMoves);

			// ===============================================
		    // -    Part 3.Looking for best possible move    -
		    // ===============================================
		    
		  	var bestMove = possibleWinMoves.filter(function(elem, index, self) {
		      	return index !== self.indexOf(elem);
		  	});
		  	
		  	if (potentialForkMoves.length !== 0) {
			    move = potentialForkMoves[0];
			} else if (bestMove.length !== 0) {
			    move = bestMove[0];   
			} else if (possibleWinMoves.length === 0) {
				move = this.randomComputerMove(board);
			} else {
				move = this.randomComputerMove(possibleWinMoves);
			}

		  	return move;
	    },
	    checkForBlock: function () {
	    	if (humanMoves.length >= 2) {
				var numberToBlock = 0;
				var move = 0;
				winPatterns.forEach(function(pattern) {
				  	var i = 0;
				    pattern.forEach(function(value) {
				      	if (humanMoves.indexOf(value) > -1) {
				        	i++;
				      	} else {
				        	numberToBlock = value;
				      	}
				  	});
			  		if (i === 2) {
			  	  		if (computerMoves.indexOf(numberToBlock) === -1) {
			        		move = numberToBlock;
			      		}
			  		}
				});
			  	return move;
			} else {
				return 0;
			}
	    },
	    checkForWin: function () {
			if (computerMoves.length >= 2) {
				var moveToWin = 0;
				var move = 0;
				winPatterns.forEach(function(pattern) {
				  	var i = 0;
				    pattern.forEach(function(value) {
				      	if (computerMoves.indexOf(value) > -1) {
				        	i++;
				      	} else {
				        	moveToWin = value;
				      	}
				  	});
			  		if (i === 2) {
			  	  		if (humanMoves.indexOf(moveToWin) === -1) {
			        		move = moveToWin;
			      		}
			  		}
				});
			  	return move;
			} else {
				return 0;
			}
		}
	};

	var moves = {
		computerMove: function () {
			var move = 0;
			if ($('input[name=difficulty]:checked').val() === "random") {
				move = calculations.randomComputerMove(board);
			} else {

				// ---- Smart Opening ----
				if (symbol === "O" && computerMoves.length === 0) {
					move = [1,3,7,9][Math.floor([1,3,7,9].length * Math.random())];
				}

				// ---- Smart Beginning ----
				if (symbol === "X" && humanMoves.length === 1) {
					if (humanMoves[0] === 5) {
						move = [1,3,7,9][Math.floor(4 * Math.random())];
					} else if (humanMoves[0] === 1 || humanMoves[0] === 3 || humanMoves[0] === 7 || humanMoves[0] === 9) {
						move = 5;
					} else if (humanMoves[0] === 2 || humanMoves[0] === 4) {
						move = 1;
					} else if (humanMoves[0] === 6 || humanMoves[0] === 8) {
						move = 9;
					}
				}

				var winningMove = calculations.checkForWin();
				var blockingMove = calculations.checkForBlock();

				if (winningMove !== 0) {
					move = winningMove;
				} else if (blockingMove !== 0) {
					move = blockingMove;
				} else if (move === 0) {
					move = calculations.smartComputerMove();
				}
			}

			var moveId = "#f-" + move;
			var index = board.indexOf(move);

			computerMoves.push(move);
			computerMoves.sort(function(a, b) {return a - b;});
			board.splice(index, 1);

			console.log("computer move");
			console.log(computerMoves);

			var whoseTurn = "computer";
			
			animation.computerMoveAnimate(moveId);

			console.log(board);
			// ---- Checking if there is a winner or draw ----
			gameStatus.checkStatus(computerMoves, whoseTurn);
		},
		humanMove: function (field) {
			var move = parseInt(field.id.slice(-1));
			var moveId = "#f-" + move;
			var index = board.indexOf(move);

			if (index !== -1) {
				humanMoves.push(move);
				humanMoves.sort(function(a, b) {return a - b;});
				board.splice(index, 1);

				console.log("human move");
				console.log(humanMoves);

				var whoseTurn = "human";

				animation.humanMoveAnimate(moveId);

				console.log(board);
				// ---- Checking if there is a winner or draw ----
				gameStatus.checkStatus(humanMoves, whoseTurn);
				// If Human Move was successfull, computer's turn.
			}
		}
	};

	var gameStatus = {
		checkStatus: function (move, turn) {
			if (move.length >= 3) {
				weHaveWinner = this.checkIfWin(winPatterns, move);
			}
			if (weHaveWinner) {
				animation.congratulations(turn);
			} else if (board.length === 0) {
				animation.gameDraw();
			} else if (turn === "human") {
				moves.computerMove();
			}
		},
		checkIfWin: function (winPatterns, moves) {
	  		var found = false;
	  		var n = 0;
	  		while (found === false && n < winPatterns.length) {
	    		var i = 0;
		  		while (moves.indexOf(winPatterns[n][i]) > -1) {
		    		i++;
		  		}
		  		if (i === 3) {
		    		found = true;
		    		winPatternNumber = n;
		  		}
		  		n++;
	  		}
	  		return found;
		}
	};

	var animation = {
		computerMoveAnimate: function (moveId) {
			$(moveId).fadeOut(500, function() {
		        if (symbol === "O") {
		        	$(moveId).html('X').fadeIn(700);
		        } else {
		        	$(moveId).html('O').fadeIn(700);
		        }
		    });
		},
		humanMoveAnimate: function (moveId) {
			$(moveId).fadeOut(0, function() {
		        if (symbol === "O") {
		        	$(moveId).html('O').fadeIn(500);
		        } else {
		        	$(moveId).html('X').fadeIn(500);
		        }
		    });
		},
		animateWin: function () {
			var winningFields = "";
			winPatterns[winPatternNumber].forEach(function(value) {
				winningFields += "#field-" + value + ", "
			});
			winningFields = winningFields.slice(0, -2);
			console.log(winningFields);
			$(winningFields).css('color', 'red');
		},
		congratulations: function (whoseTurn) {
			this.animateWin();
			if (whoseTurn === "human") {
				player++;
				$('#player').text(player);
				$('#f-5').fadeOut(1500, function() {
					$('#f-5').html("");
					$('#f-5').addClass('game-over');
					$('#f-5').html("Human<br>Win!").fadeIn(500);
				});
			} else {
				computer++;
				$('#computer').text(computer);
				$('#f-5').fadeOut(1500, function() {
					$('#f-5').html("");
					$('#f-5').addClass('game-over');
					$('#f-5').html("Computer<br>Win!").fadeIn(500);
				});
			}
		},
		gameDraw: function () {
			draw++;
			$('#draw').text(draw);
			$('#f-5').fadeOut(1000, function() {
				$('#f-5').html("");
				$('#f-5').addClass('game-over');
				$('#f-5').html("Draw!").fadeIn(500);
			});	
			console.log("No numbers left");
		}
	};

	// ---- Player choose the symbol ----
	$('#field-4, #field-6').one('click', function() {

		if (symbol === null) {
			symbol = event.target.innerHTML;
			symbolChose = true;
			clickCount = 1;
			
			// ---- Remove Intro styles ----
			$('#f-5').html("");
			$('#f-5').removeClass('intro');
			$('#field-4, #field-6').removeClass('hover');
			$('#f-4, #f-6').html("");

			// ---- Computer moves first if symbol is "O" ----
			if (symbol === "O") {
				moves.computerMove();
	    	}
    	}
	});

	// ---- Human Makes a Move ----
	$('.field').on('click', function() {
		
		if (symbolChose === true && clickCount > 1 && weHaveWinner !== true) {
			moves.humanMove(this);
		}
		clickCount++;
	});

	// ---- Play new Game ----
	$('#replay').on('click', function() {

		if (symbolChose === true) {
			weHaveWinner = false;
			board = newBoard.slice();
			computerMoves = [],
			humanMoves = [];
			
			$('.field span').html("");
			$('#f-5').removeClass('game-over');
			$('.field').css('color', 'black');

			if (symbol === "O") {
				moves.computerMove();
		    }
		}    
	});

});