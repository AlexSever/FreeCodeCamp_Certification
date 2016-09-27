window.onload = function () {
    
    var buttons = document.querySelector('#buttons'),
        result = document.querySelector('#result'),
        history = document.querySelector('#history p');
    
    var lastInput = "",
        answer = "",
        symbol = false,
        calculated = false;
   
    function clear() {
        answer = "";
        lastInput = "";
        result.innerHTML = '0';
        history.innerHTML = '0';
    }

    function addValue(i) {
        if (lastInput.length < 11) {
            if (i === "*" || i === "+" || i === "-" || i === "/") {
                if (symbol === true) {
                    answer = answer.slice(0, -1);
                }
                calculate();
                answer += i;
                history.innerHTML = answer;
                symbol = true;
                calculated = false;
            } else {
                if (symbol === true) {
                    lastInput = "";
                }
                if (calculated === true) {
                    answer = "";
                    calculated = false;
                }
                lastInput += i;
                answer += i;
                result.innerHTML = lastInput;
                history.innerHTML = answer;
                symbol = false;
            }
        } else {
            answer;
        }
    }

    function removeValue() {
        if (answer.length <= 1) {
            clear();
        } else {
            if (lastInput.length === 1) {
                lastInput = "0";
                result.innerHTML = lastInput;
                lastInput = "";
                answer = answer.slice(0, -1);
                history.innerHTML = answer;
            } else if (lastInput.length === 0) {
                lastInput = "0";
                result.innerHTML = lastInput;
                lastInput = "";
            } else {
                answer = answer.slice(0, -1);
                lastInput = lastInput.slice(0, -1);
                result.innerHTML = lastInput;
                history.innerHTML = answer;
            }
        }
    }

    function squareRoot() {
        calculate();
        answer = Math.sqrt(parseFloat(answer)).toString().substring(0, 11);
        result.innerHTML = answer;
        history.innerHTML = answer;
    }

    function calculate() {
        var final_res = answer;

        var bugFix = final_res.replace(/[\d.]+/g, function(n) { 
            return parseFloat(n);
        });
        
        answer = eval(bugFix).toString().substring(0, 11);
        result.innerHTML = answer;
        lastInput = "";
        calculated = true;
        /*history.innerHTML = "";*/
    }

    buttons.addEventListener('click', function(event) {
        var buttonClicked = event.target.value;

        if (buttonClicked === '=') {
            calculate();
        } else if (buttonClicked === 'ce' || buttonClicked === undefined) {
            removeValue();
        } else if (buttonClicked === 'ac') {
            clear();
        } else if (buttonClicked === 'square_root') {
            squareRoot();
        } else {
            addValue(buttonClicked);
        }
    });
}