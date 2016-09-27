var time = 1500,
    workTime = 1500,
    breakTime = 300,
    per = 0;

var running = false,
    work = true,
    paused = false,
    tickingSound = true;

var timerId;  

//load audio files 
var ticking = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/231853/174721__drminky__watch-tick.wav'),
    breakDing = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/231853/Elevator_Ding-SoundBible.com-685385892.mp3'),
    workDing = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/231853/Air_Plane_Ding-SoundBible.com-496729130.mp3');

function plusWorkTime() {
    if (running === false && paused === false)  {
        workTime += 60;
        var mins = Math.floor(workTime / 60);
        document.getElementById("output").innerHTML = mins + ":" + "00";
        document.getElementById("work_time").innerHTML = mins + ":" + "00";
        time = workTime;
    } else if (work === false) {
        workTime += 60;
        var mins = Math.floor(workTime / 60);
        document.getElementById("work_time").innerHTML = mins + ":" + "00";
    } 
}

function minusWorkTime() {
    if (workTime > 60) {
        if (running === false && paused === false)  {
            workTime -= 60;
            var mins = Math.floor(workTime / 60);
            document.getElementById("output").innerHTML = mins + ":" + "00";
            document.getElementById("work_time").innerHTML = mins + ":" + "00";
            time = workTime;
        } else if (work === false) {
            workTime -= 60;
            var mins = Math.floor(workTime / 60);
            document.getElementById("work_time").innerHTML = mins + ":" + "00";
        }
    }    
}

function plusBreakTime() {
    if (work === false) {
    } else {
        breakTime += 60;
        var mins = Math.floor(breakTime / 60);
        document.getElementById("break_time").innerHTML = mins + ":" + "00";
    }
}

function minusBreakTime() {
    if (breakTime > 60) {
        if (work === false) {
        } else {
            breakTime -= 60;
            var mins = Math.floor(breakTime / 60);
            document.getElementById("break_time").innerHTML = mins + ":" + "00";
        }
    }
}
                       
function reset() {
    running = false;
    work = true;
    paused = false;
    per = 0;
    time = workTime;

    document.getElementById("startPause").innerHTML = '<i class="fa fa-play">';
    document.getElementById("output").innerHTML = document.getElementById("work_time").innerHTML;
    clearInterval(timerId);

    document.getElementById("inner").style.background = "transparent";
}

function fillTheCircle() {
    per++;
    if (work === true) {
        var stop = workTime;
        document.getElementById("inner").style.background = "linear-gradient(to top, #99CC00 " + ((per / stop) * 100) + "%, transparent " + ((per / stop) * 100) + "%, transparent 100%)"
    } else {
        var stop = breakTime;
        document.getElementById("inner").style.background = "linear-gradient(to bottom, #FF4444 " + ((per / stop) * 100) + "%, transparent " + ((per / stop) * 100) + "%, transparent 100%)" 
    }
}

function switchWorkAndBreak() {
    if (time === 0 && work === true) {
        breakDing.play(); //Play sound
        work = false;
        time = breakTime;
        per = 0;
        /*document.getElementById("inner").style.background = "#99CC00";*/
    } else if (time === 0 && work === false) {
        workDing.play();
        work = true;
        time = workTime;
        per = 0;
        /*document.getElementById("inner").style.background = "#FF4444";*/
    }                                   
}

function switchSound() {
    /*tickingSound = !tickingSound;*/
    if (tickingSound === true) {
        tickingSound = false;
        document.getElementById("sound").src = "img/Sound-off.png";
    } else {
        tickingSound = true;
        document.getElementById("sound").src = "img/Sound-on.png";
    }
}

function startPause() {
    if (running === false) {
        running = true;
        paused = false;
        document.getElementById("startPause").innerHTML = '<i class="fa fa-pause">';
        decrement();
    } else {
        running = false;
        paused = true;                                 
        document.getElementById("startPause").innerHTML = '<i class="fa fa-play">';
        clearInterval(timerId);
    }
}

function decrement() {
    if (running === true) {
        timerId = setInterval(function() {
            time = time - 1;

            var mins = Math.floor(time / 60),
                secs = Math.floor(time % 60);

            if (mins < 10) {
                mins = "0" + mins;
            }
            if (secs < 10) {
                secs = "0" + secs;
            }
            
            if (tickingSound === true) {
                ticking.play();
            }

            document.getElementById("output").innerHTML = mins + ":" + secs;

            // ---- Fill the circle ----
            fillTheCircle();
            
            // ---- Switch to Work & Break ----
            switchWorkAndBreak();

        },1000);
    }
}