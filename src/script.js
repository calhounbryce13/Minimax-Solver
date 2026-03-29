
'use strict';

let gameGrid = [[0,0,0], [0,0,0], [0,0,0]];
class ai{
    #movesMade;
    constructor(){
        this.#movesMade = 0;
    }
    get_moves(){
        return this.#movesMade;
    }
    inc_moves(){
        this.#movesMade++;
    }
    optimal_move(grid){
        console.log("finding optimal move");
    }
};

let agent = new ai();

const shuffle_optimals = function(moves){
    for(let i = 0; i < moves.length; i++){
        const rand = Math.floor(Math.random() * ((moves.length) - 1));
        const temp = moves[i];
        moves[i] = moves[rand];
        moves[rand] = temp;
    }
    console.log(moves[0]);
    return moves;

}
const moves = [[0,0], [0,2], [1,1], [2,0], [2,2]];
const optimal_spots = shuffle_optimals(moves);

document.addEventListener("DOMContentLoaded", () => {
    start_fresh_game();
    check_local_storage();
    token_select_functionality();
    start_game_functionality();
    reset_functionality();
    cell_click_functionality();
});

const start_fresh_game = function(){
    localStorage.removeItem("MINIMAX-SOLVER--TURN");
}

const toggle_player_turn = function(turnObj){
    const newTurn = (Number(JSON.parse(turnObj)) == 1) ? 0 : 1;
    localStorage.setItem("MINIMAX-SOLVER--TURN", JSON.stringify(newTurn));
}

const check_for_terminal = function(){
    if(agent.get_moves() > 2){
        console.log("checking terminal");
        return;
    }
    return;
}

const update_internal_grid = function(cellIndex){
    const row = Math.floor(cellIndex / 3);
    const col = (cellIndex - (3 * row));
    gameGrid[row][col] = String(JSON.parse(localStorage.getItem("MINIMAX-SOLVER"))["token"]);
}

const automatic_move = function(){
    for(let i = 0; i < optimal_spots.length; i++){
        const playerToken = String(JSON.parse(localStorage.getItem("MINIMAX-SOLVER"))["token"]);
        if(gameGrid[(optimal_spots[i])[0]][(optimal_spots[i])[1]] != playerToken){
            return [(optimal_spots[i])[0], (optimal_spots[i])[1]];
        }
    }
}

const inject_move_to_internal_grid = function(move){
    const agentToken = (String(JSON.parse(localStorage.getItem("MINIMAX-SOLVER"))["token"]) == "x") ? "o": "x";
    gameGrid[move[0]][move[1]] = agentToken;

    return agentToken;
}

const update_ui = function(move, agentToken){
    const agentTokenString = agentToken + "-tile-icon";
    ((Array.from(document.getElementsByClassName("row"))[move[0]]).children[move[1]]).classList.add(agentTokenString);
}

const ai_turn = function(cellIndex){
    setTimeout(() => {
        if(cellIndex){
        update_internal_grid(cellIndex);
        }
        if(!(check_for_terminal())){
            let move = (agent.get_moves() > 0) ? agent.optimal_move() : automatic_move();
            agent.inc_moves();
            const agentToken = inject_move_to_internal_grid(move);
            update_ui(move, agentToken);
            if(!(check_for_terminal())){
                toggle_player_turn(localStorage.getItem("MINIMAX-SOLVER--TURN"));
                return;
            }
            return;
        }
        return;
    }, 500);
}

const cell_click_functionality = function(){
    /*
    priority: time
     */
    const cells = Array.from(document.getElementsByClassName("cell"));
    cells.forEach((cell, index) => {
        cell.addEventListener("click", (event) => {
            const turnObj = localStorage.getItem("MINIMAX-SOLVER--TURN");
            if(turnObj){
                if(Number(JSON.parse(turnObj)) == 1){
                    const element = event.target;
                    if(!(element.classList.contains("x-tile-icon")) && !(element.classList.contains("o-tile-icon"))){
                        const token = String(JSON.parse(localStorage.getItem("MINIMAX-SOLVER"))["token"]);
                        const tokenClass = (token == "x") ? "x-tile-icon" : "o-tile-icon";
                        element.classList.toggle(tokenClass);
                        toggle_player_turn(turnObj);
                        ai_turn(index);
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
}

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
            localStorage.setItem("MINIMAX-SOLVER--TURN", JSON.stringify(whosturn));
            if(!whosturn){
                ai_turn(false);
            }
            return;
        }
        window.alert("Choose a token first duh");
        return;
    });
}

const clear_board_UI = function(){
    const cells = Array.from(document.getElementsByClassName("cell"));
    cells.forEach((cell) => {
        cell.classList.remove("x-tile-icon");
        cell.classList.remove("o-tile-icon");
    });
}

const clear_internal_grid = function(){
    gameGrid = [[0,0,0], [0,0,0], [0,0,0]];
}

const reset_agent = function(){
    agent = new ai();
}

const reset_functionality = function(){
    const reset = document.getElementById('reset');
    reset.addEventListener("click", () => {
        if(localStorage.getItem("MINIMAX-SOLVER")){
            const previous = document.getElementById(String(JSON.parse(localStorage.getItem("MINIMAX-SOLVER"))["token"]));
            previous.classList.toggle("chosen");
            clear_board_UI();
            clear_internal_grid();
            reset_agent();
            localStorage.removeItem("MINIMAX-SOLVER");
            localStorage.removeItem("MINIMAX-SOLVER--TURN");
            document.getElementById("canvas").classList.remove("in-session");
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