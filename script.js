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
    setUtility(value) {
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

class Ai{
    #movesMade;
    #agentToken;
    #decisionTree;
    constructor(){
        console.log("ai constructing");
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

    getEmpties() {
        const empties = [];
        for (let x = 0; x < 3; x++) {
            for (let i = 0; i < 3; i++) {
                if (gameGrid[x][i] !== 'x' && gameGrid[x][i] !== 'o') {
                    empties.push(x, i);
                }
            }
        }
        return empties;
    }

    search(board, currentMax){
        for(let i = 0; i < 3; i++) {
            // check horizontal and vertical wins for x
            if ((board.thisBoard[i][0] === 'x' && board.thisBoard[i][1] === 'x' && board.thisBoard[i][2] === 'x') ||
                (board.thisBoard[0][i] === 'x' && board.thisBoard[1][i] === 'x' && board.thisBoard[2][i] === 'x'))
                {
                if (currentMax) {
                    // agent is x
                    board.setUtility(1);
                    return 1;
                } else {
                    // agent is o
                    board.setUtility(-1);
                    return -1;
                }
            }
            // check horizontal and vertical wins for o
            else if (
                (board.thisBoard[i][0] === 'o' && board.thisBoard[i][1] === 'o' && board.thisBoard[i][2] === 'o') ||
                (board.thisBoard[0][i] === 'o' && board.thisBoard[1][i] === 'o' && board.thisBoard[2][i] === 'o')) 
                {
                if (currentMax) {
                    // agent is x
                    board.setUtility(-1);
                    return -1;
                } else {
                    // agent is o
                    board.setUtility(1);
                    return 1;
                }
            }
        }
        for (let i = 0; i < 3; i++) {
            // check diagonal wins for x
            if (
                (board.thisBoard[0][0] === 'x' &&
                board.thisBoard[1][1] === 'x' &&
                board.thisBoard[2][2] === 'x') ||
                (board.thisBoard[0][2] === 'x' &&
                board.thisBoard[1][1] === 'x' &&
                board.thisBoard[2][0] === 'x')
            ) {
                if (currentMax) {
                    // agent is x
                    board.setUtility(1);
                    return 1;
                } else {
                    // agent is o
                    board.setUtility(-1);
                    return -1;
                }
            }
            // check diagonal wins for o
            else if (
                (board.thisBoard[0][0] === 'o' &&
                board.thisBoard[1][1] === 'o' &&
                board.thisBoard[2][2] === 'o') ||
                (board.thisBoard[0][2] === 'o' &&
                board.thisBoard[1][1] === 'o' &&
                board.thisBoard[2][0] === 'o')
            ) {
                if (currentMax) {
                    // agent is x
                    board.setUtility(-1);
                    return -1;
                } else {
                    // agent is o
                    board.setUtility(1);
                    return 1;
                }
            }
        }
        return 0;
    }

    newLevel(emptySpaces, treeLevel) {
        const emptySpaces2 = emptySpaces - 1;
        for (let x = 0; x < emptySpaces; x++) {
            treeLevel[x].array = new Array(emptySpaces2);
            for (let i = 0; i < emptySpaces2; i++) {
                //& WORST CASE: O(n^3) &//
                treeLevel[x].array[i] = new Node();
                treeLevel[x].array[i].setUtility(0);
                for (let j = 0; j < 3; j++) {
                    for (let k = 0; k < 3; k++) {
                        treeLevel[x].array[i].thisBoard[j][k] =
                            treeLevel[x].thisBoard[j][k];
                    }
                }
            }
        }
    }

    tokenInsert(array, emptyArray, size, lvl) {
        /*
        DESCRIPTION: Function defined to place either an x or o token
                    in each board in an array of game boards.
        */
        let j = 0;
        for (let x = 0; x < size; x++) {
            // agent is o
            if (lvl % 2 === 0) {
                // an even level of decision tree
                const playerToken = JSON.parse(localStorage.getItem("MINIMAX-SOLVER"))["token"];
                array[x].thisBoard[emptyArray[j]][emptyArray[j + 1]] = playerToken;
                array[x].set_x(emptyArray[j]);
                array[x].set_y(emptyArray[j + 1]);
            } else {
                // an odd level of decision tree
                array[x].thisBoard[emptyArray[j]][emptyArray[j + 1]] = this.#agentToken;
            }
            j += 2;
        }
    }

    minimax(move){
        console.log(gameGrid);
        const userToken = JSON.parse(localStorage.getItem("MINIMAX-SOLVER"))["token"];
        const toRemove = (userToken == "x") ? (this.#movesMade * 2) + 1 : (this.#movesMade * 2);
        const emptySpaces = 9 - toRemove;
        let treeLevel = new Array(emptySpaces);
        for (let x = 0; x < emptySpaces; x++) {
            //& WORST CASE: O(n^3) &//
            let subBoard = new Node();
            subBoard.setUtility(0);
            treeLevel[x] = subBoard;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    treeLevel[x].thisBoard[i][j] = gameGrid[i][j];
                }
            }
        }
        let emptyArray = this.getEmpties();
        let j = 0;
        for (let i = 0; i < emptySpaces; i++) {
            //& WORST CASE: O(n) &//
            treeLevel[i].thisBoard[emptyArray[j]][emptyArray[j + 1]] = this.#agentToken;
            // THIS IS HOW THE AGENT REMEMBERS THE INITAL CELL THAT WILL LEAD TO THE OPTIMAL MOVE ^//
            treeLevel[i].set_x(emptyArray[j]);
            treeLevel[i].set_y(emptyArray[j + 1]);
            j += 2;
        }
        const searchBool = (this.#agentToken == "x") ? true : false;
        // searching through each board in level
        for (let x = 0; x < emptySpaces; x++) {
            let maxFound = this.search(treeLevel[x], searchBool);
            if (maxFound === 1) {
                move[0] = treeLevel[x].get_x();
                move[1] = treeLevel[x].get_y();
                return move;
            }
        }
        this.newLevel(emptySpaces, treeLevel);
        let level = 2;
        for (let x = 0; x < emptySpaces; x++) {
            let emptyList = this.getEmpties(treeLevel[x].thisBoard);
            this.tokenInsert(treeLevel[x].array, emptyList, (emptySpaces - 1), level);
        }
        for (let x = 0; x < emptySpaces; x++) {
            for (let i = 0; i < (emptySpaces - 1); i++) {
                let minFound = this.search(treeLevel[x].array[i], searchBool);
                if (minFound === -1) {
                    move[0] = treeLevel[x].array[i].get_x();
                    move[1] = treeLevel[x].array[i].get_y();
                    return move;
                }
            }
        }
        for (let x = 0; x < emptySpaces; x++) {
            this.newLevel((emptySpaces - 1), treeLevel[x].array);
        }
        level = 3;
        for (let x = 0; x < emptySpaces; x++) {
            for (let i = 0; i < (emptySpaces - 1); i++) {
                let emptyList = this.getEmpties(treeLevel[x].array[i].thisBoard);
                this.tokenInsert(treeLevel[x].array[i].array, emptyList, (emptySpaces - 2), level);
            }
        }
        // if maxFound is false after level 3 then return the adverse move
        // from level 2 as optimal
        let maxFound = false;
        for (let x = 0; x < emptySpaces; x++) {
            for (let i = 0; i < (emptySpaces - 1); i++) {
                for (let k = 0; k < (emptySpaces - 2); k++) {
                    maxFound = this.search(treeLevel[x].array[i].array[k], searchBool);
                    if (maxFound) {
                        move[0] = treeLevel[x].get_x();
                        move[1] = treeLevel[x].get_y();
                        return move;
                    }
                }
            }
        }
        process.exit(0);
    };
};

let agent = new Ai();

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

const start_fresh_game = function(){
    localStorage.removeItem("MINIMAX-SOLVER--TURN");
}

const toggle_player_turn = function(turnObj){
    const newTurn = (Number(JSON.parse(turnObj)) == 1) ? 0 : 1;
    localStorage.setItem("MINIMAX-SOLVER--TURN", JSON.stringify(newTurn));
}

const checkTerminal = function(token){
    for (let i = 0; i < 3; i++) {
        // check rows and columns for X
        if (
            (gameGrid[i][0] === 'x' &&
            gameGrid[i][1] === 'x' &&
            gameGrid[i][2] === 'x') ||

            (gameGrid[0][i] === 'x' &&
            gameGrid[1][i] === 'x' &&
            gameGrid[2][i] === 'x')
        ) {
            return token === 'x' ? -1 : 1;
        }

        // check rows and columns for O
        else if (
            (gameGrid[i][0] === 'o' &&
            gameGrid[i][1] === 'o' &&
            gameGrid[i][2] === 'o') ||

            (gameGrid[0][i] === 'o' &&
            gameGrid[1][i] === 'o' &&
            gameGrid[2][i] === 'o')
        ) {
            return token === 'x' ? 1 : -1;
        }
    }

    // check diagonals for X
    if ((gameGrid[0][0] === 'x' && gameGrid[1][1] === 'x' && gameGrid[2][2] === 'x') ||
        (gameGrid[0][2] === 'x' && gameGrid[1][1] === 'x' && gameGrid[2][0] === 'x')) 
    {
        return token === 'x' ? -1 : 1;
    }

    // check diagonals for O
    if ((gameGrid[0][0] === 'o' && gameGrid[1][1] === 'o' && gameGrid[2][2] === 'o') ||
        (gameGrid[0][2] === 'o' && gameGrid[1][1] === 'o' && gameGrid[2][0] === 'o')) 
    {
        return token === 'x' ? 1 : -1;
    }

    return 0;
}

const update_internal_grid = function(cellIndex){
    const row = Math.floor(cellIndex / 3);
    const col = (cellIndex - (3 * row));
    gameGrid[row][col] = String(JSON.parse(localStorage.getItem("MINIMAX-SOLVER"))["token"]);
}

const automatic_move = function(){
    for(let i = 0; i < optimal_spots.length; i++){
        const playerToken = String(JSON.parse(localStorage.getItem("MINIMAX-SOLVER"))["token"]);
        if(gameGrid[(optimal_spots[i])[0]][(optimal_spots[i])[1]] == "0"){
            console.log((optimal_spots[i])[0], (optimal_spots[i])[1], 'IS EMPTY');
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
        if(!(checkTerminal())){
            let move = [];
            move = (agent.get_moves() > 0) ? agent.minimax(move) : automatic_move();
            if(move != undefined){
                console.log("optimal move:", move);
                agent.inc_moves();
                const agentToken = inject_move_to_internal_grid(move);
                update_ui(move, agentToken);
                if(!(checkTerminal())){
                    toggle_player_turn(localStorage.getItem("MINIMAX-SOLVER--TURN"));
                    return;
                }
                return;
            }
            console.log("ERROR: OPTIMAL MOVE UNDEFINED");
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
    agent = new Ai();
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
};