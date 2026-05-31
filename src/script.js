'use strict';

let gameGrid = [[0,0,0], [0,0,0], [0,0,0]];

class Node {
    constructor() {
        // private members from C++
        this.utility = 0;
        this.x = 0;
        this.y = 0;
        // public members
        this.thisBoard = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.array = null;
    }

    // mutators
    set_utility(value) {
        this.utility = value;
    }
    set_x(value) {
        this.x = value;
    }
    set_y(value) {
        this.y = value;
    }
    // accessors
    get_utility() {
        return this.utility;
    }
    get_x() {
        return this.x;
    }
    get_y() {
        return this.y;
    }
};


class ai{
    #movesMade;
    #agentToken;
    #decisionTree;
    constructor(){
        this.#movesMade = 0;
        this.#agentToken = "";
        this.#decisionTree = [];
    }
    set_token(tokenObj){
        this.#agentToken = (String(JSON.parse(tokenObj)["token"]) == "x") ? "o" : "x";
    }
    get_moves(){
        return this.#movesMade;
    }
    inc_moves(){
        this.#movesMade++;
    }






















    
    minimax(x_count, o_count, move, board){
        // LEVEL 1

        console.log("mini-maxxing !");
        const emptySpaces = 9 - (x_count + o_count);

        let treeLevel = new Array(emptySpaces);

        for (let x = 0; x < emptySpaces; x++) {
            let subBoard = new BoardNode();

            subBoard.set_utility(0);

            treeLevel[x] = subBoard;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    treeLevel[x].thisBoard[i][j] = board[i][j];
                }
            }
        }

        // getting empty coordinates for decision tree
        let emptyArray = this.get_empties(board);

        // iterate over the tree level and insert ai token into each empty index
        let j = 0;

        for (let i = 0; i < emptySpaces; i++) {
            if (x_count === o_count) {

                // agent is x
                treeLevel[i].thisBoard[emptyArray[j]][emptyArray[j + 1]] = 'x';
                treeLevel[i].set_x(emptyArray[j]);
                treeLevel[i].set_y(emptyArray[j + 1]);
            }
            else {

                // agent is o
                treeLevel[i].thisBoard[emptyArray[j]][emptyArray[j + 1]] = 'o';
                treeLevel[i].set_x(emptyArray[j]);
                treeLevel[i].set_y(emptyArray[j + 1]);
            }

            j += 2;
        }

        // searching through each board in level
        for (let x = 0; x < emptySpaces; x++) {
            if (x_count > o_count) {

                // agent is o
                let maxFound = this.search(treeLevel[x], false);

                if (maxFound === 1) {
                    move[0] = treeLevel[x].get_x();
                    move[1] = treeLevel[x].get_y();
                    return;
                }
            }
            else {

                // agent is x
                let maxFound = this.search(treeLevel[x], true);

                if (maxFound === 1) {
                    move[0] = treeLevel[x].get_x();
                    move[1] = treeLevel[x].get_y();
                    return;
                }
            }
        }

        // LEVEL 2
        this.new_level(emptySpaces, treeLevel);

        let level = 2;

        for (let x = 0; x < emptySpaces; x++) {
            let emptyList = this.get_empties(treeLevel[x].thisBoard);

            this.token_insert(
                treeLevel[x].array,
                emptyList,
                (emptySpaces - 1),
                x_count,
                o_count,
                level
            );
        }

        for (let x = 0; x < emptySpaces; x++) {
            for (let i = 0; i < (emptySpaces - 1); i++) {

                if (x_count > o_count) {

                    // agent is o
                    let minFound = this.search(treeLevel[x].array[i], false);

                    if (minFound === -1) {
                        move[0] = treeLevel[x].array[i].get_x();
                        move[1] = treeLevel[x].array[i].get_y();
                        return;
                    }
                }
                else {

                    // agent is x
                    let minFound = this.search(treeLevel[x].array[i], true);

                    if (minFound === -1) {
                        move[0] = treeLevel[x].array[i].get_x();
                        move[1] = treeLevel[x].array[i].get_y();
                        return;
                    }
                }
            }
        }

        // LEVEL 3
        for (let x = 0; x < emptySpaces; x++) {
            this.new_level((emptySpaces - 1), treeLevel[x].array);
        }

        level = 3;

        for (let x = 0; x < emptySpaces; x++) {
            for (let i = 0; i < (emptySpaces - 1); i++) {

                let emptyList =
                    this.get_empties(treeLevel[x].array[i].thisBoard);

                this.token_insert(
                    treeLevel[x].array[i].array,
                    emptyList,
                    (emptySpaces - 2),
                    x_count,
                    o_count,
                    level
                );
            }
        }

        // if maxFound is false after level 3 then return the adverse move
        // from level 2 as optimal
        let maxFound = false;

        for (let x = 0; x < emptySpaces; x++) {
            for (let i = 0; i < (emptySpaces - 1); i++) {
                for (let k = 0; k < (emptySpaces - 2); k++) {

                    if (x_count > o_count) {

                        // agent is o
                        maxFound = this.search(
                            treeLevel[x].array[i].array[k],
                            false
                        );

                        if (maxFound) {
                            move[0] = treeLevel[x].get_x();
                            move[1] = treeLevel[x].get_y();
                            return;
                        }
                    }
                    else {

                        // agent is x
                        maxFound = this.search(
                            treeLevel[x].array[i].array[k],
                            true
                        );

                        if (maxFound) {
                            move[0] = treeLevel[x].get_x();
                            move[1] = treeLevel[x].get_y();
                            return;
                        }
                    }
                }
            }
        }

        if (!maxFound) {
            // need to access the 2nd level at whichever index has -1 utility
            // need to keep track of boards that have -1 utility in lvl 2
        }

        console.log("\nSorry, still thinking :/\n");

        process.exit(0);
    };















    
};

let agent = new ai();

const shuffle_optimals = function(moves){
    for(let i = 0; i < moves.length; i++){
        const rand = Math.floor(Math.random() * ((moves.length) - 1));
        const temp = moves[i];
        moves[i] = moves[rand];
        moves[rand] = temp;
    }
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


const show_toast = function(message){
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("toast-show");
    setTimeout(() => {
        toast.classList.remove("toast-show");
        setTimeout(() => {
            toast.textContent = "";
        }, 1000);
    }, 3000);
}


/*&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/
/*&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/


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
            let move = (agent.get_moves() > 0) ? agent.minimax() : automatic_move();
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
                    show_toast("invalid tile, chose an empty square");
                    return;
                }
                show_toast("not your turn");
                return;
            }
            show_toast("start the game to play a tile");
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
            agent.set_token(tokenObj);
            const whosturn = (String(JSON.parse(tokenObj)["token"]) == "o") ? 0 : 1;
            localStorage.setItem("MINIMAX-SOLVER--TURN", JSON.stringify(whosturn));
            if(!whosturn){
                ai_turn(false);
            }
            return;
        }
        show_toast("Choose a token first duh");
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
                show_toast("successfully reset storage");
                return;
            }
            show_toast("error: could not remove storage !");
            return;
        }
        show_toast("nothing to reset");
        return;
    });
}