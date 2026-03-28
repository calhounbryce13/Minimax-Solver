
'use strict';

document.addEventListener("DOMContentLoaded", () => {

    localStorage.removeItem("MINIMAX-SOLVER--TURN");

    check_local_storage();
    token_select_functionality();
    start_game_functionality();
    reset_functionality();





    const cells = Array.from(document.getElementsByClassName("cell"));
    cells.forEach((cell) => {
        cell.addEventListener("click", (event) => {
            if(localStorage.getItem("MINIMAX-SOLVER--TURN")){
                if(Number(JSON.parse(localStorage.getItem("MINIMAX-SOLVER--TURN"))) == 1){
                    const element = event.target;
                    if(!(element.classList.contains("x-tile-icon")) && !(element.classList.contains("o-tile-icon"))){
                        const token = String(JSON.parse(localStorage.getItem("MINIMAX-SOLVER"))["token"]);
                        const tokenClass = (token == "x") ? "x-tile-icon" : "o-tile-icon";
                        element.classList.toggle(tokenClass);
                        return;
                    }
                    window.alert("invalid tile, chose an empty square");
                    return;
                }
                window.alert("not your turn");
                return;
            }
            window.alert("start the game to play a tile");
            return;
        });
    });
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
        const tokenObj = localStorage.getItem("MINIMAX-SOLVER");
        if(tokenObj){
            document.getElementById("canvas").classList.toggle("in-session");
            const whosturn = (String(JSON.parse(tokenObj)["token"]) == "o") ? 0 : 1;
            localStorage.setItem("MINIMAX-SOLVER--TURN", JSON.stringify(whosturn))
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
            localStorage.removeItem("MINIMAX-SOLVER--TURN");
            if(document.getElementById("canvas").classList.contains("in-session")){
                document.getElementById("canvas").classList.remove("in-session");
            }
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