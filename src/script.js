
'use strict';

document.addEventListener("DOMContentLoaded", () => {

    check_local_storage();
    token_select_functionality();
    start_game_functionality();
    reset_functionality();
});


const check_local_storage = function(){
    if(localStorage.getItem("MINIMAX-SOLVER")){
        const previous = document.getElementById(String(JSON.parse(localStorage.getItem("MINIMAX-SOLVER"))["token"]));
        previous.classList.toggle("chosen");
    }
}


const token_select_functionality = function(){
    const tokens = Array.from(document.getElementById("tokens").children);
    tokens.forEach((token) => {
        token.addEventListener("click", (event) => {
            check_local_storage();
            const id = event.target.id;
            localStorage.setItem("MINIMAX-SOLVER", JSON.stringify({
                "token": id
            }));
            event.target.classList.toggle("chosen");
        })
    });
}


const start_game_functionality = function(){
    const startGame = document.getElementById("start");
    startGame.addEventListener("click", () => {
        if(localStorage.getItem("MINIMAX-SOLVER")){
            document.getElementById("canvas").classList.toggle("in-session");
            return;
        }
        window.alert("Choose a token first duh");
        return;
    });
}

const reset_functionality = function(){
    const reset = document.getElementById('reset');
    reset.addEventListener("click", () => {
        if(localStorage.getItem("MINIMAX-SOLVER")){
            const previous = document.getElementById(String(JSON.parse(localStorage.getItem("MINIMAX-SOLVER"))["token"]));
            previous.classList.toggle("chosen");
            localStorage.removeItem("MINIMAX-SOLVER");
            document.getElementById("canvas").classList.toggle("in-session");
            if(!localStorage.getItem("MINIMAX-SOLVER")){
                window.alert("successfully reset storage");
                return;
            }
            window.alert("error: could not remove storage !");
            return;
        }
        window.alert("nothing to reset");
        return;
    });
}