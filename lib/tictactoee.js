class TicTacToe {
    constructor(playerX, playerO) {
        this.playerX = playerX;
        this.playerO = playerO;
        this._x = 0;
        this._o = 0;
        this._currentTurn = this.playerX;
        this.turns = 0;
    }

    get board() {
        return this._x | this._o;
    }

    get currentTurn() {
        return this._currentTurn;
    }

    get winner() {
        const winningMasks = [
            7, 56, 448, 73, 146, 292, 273, 84
        ];
        
        for (const mask of winningMasks) {
            if ((this._x & mask) === mask) return this.playerX;
            if ((this._o & mask) === mask) return this.playerO;
        }
        return false;
    }

    turn(pos) {
        const mask = 1 << pos;
        if (pos < 0 || pos > 8) return -1;
        if ((this.board & mask) === mask) return 0;

        if (this._currentTurn === this.playerX) {
            this._x |= mask;
        } else {
            this._o |= mask;
        }

        this.turns++;
        this._currentTurn = (this._currentTurn === this.playerX) ? this.playerO : this.playerX;

        if (this.winner || this.turns >= 9) return -3;
        return 1;
    }

    render() {
        const board = [];
        for (let i = 0; i < 9; i++) {
            const mask = 1 << i;
            if ((this._x & mask) === mask) {
                board.push('❌');
            } else if ((this._o & mask) === mask) {
                board.push('⭕');
            } else {
                board.push(String(i + 1));
            }
        }
        return board;
    }
}

export default TicTacToe;