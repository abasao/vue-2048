//Rotate to use MoveLeft, no move-right/up/down functions required
var rotateLeft = function (matrix) {
    var rows = matrix.length;
    var columns = matrix[0].length;
    var result = [];
    for (var row = 0; row < rows; row++) {
        result.push([]);
        for (var column = 0; column < columns; column++) {
            result[row][column] = matrix[column][columns - row - 1];
        }
    }
    return result;
};

var Tile = function (value, row, column) {
    this.value = value || 0;
    this.row = row || -1;
    this.column = column || -1;
    this.oldRow = -1;
    this.oldColumn = -1;
    this.markForDeletion = false;
    this.mergedInto = null;
    this.id = Tile.id++;
};

Tile.id = 0;

Tile.prototype.moveTo = function (row, column) {
    this.oldRow = this.row;
    this.oldColumn = this.column;
    this.row = row;
    this.column = column;
    console.log(Tile.id)
};

Tile.prototype.isNew = function () {
    return this.oldRow === -1 && !this.mergedInto;
};

Tile.prototype.hasMoved = function () {
    return (this.fromRow() !== -1 && (this.fromRow() !== this.toRow() || this.fromColumn() !== this.toColumn())) ||
        this.mergedInto;
};

Tile.prototype.fromRow = function () {
    return this.mergedInto ? this.row : this.oldRow;
};

Tile.prototype.fromColumn = function () {
    return this.mergedInto ? this.column : this.oldColumn;
};

Tile.prototype.toRow = function () {
    return this.mergedInto ? this.mergedInto.row : this.row;
};

Tile.prototype.toColumn = function () {
    return this.mergedInto ? this.mergedInto.column : this.column;
};

var Board = function (size = 4) {
    //Board.size = Board.size | 4;
    this.size = size;
    this.tiles = [];
    this.cells = [];
    for (var i = 0; i < this.size; i++) {
        this.cells[i] = Array(this.size).fill(this.addTile());
    }
    this.addRandomTile();
    this.setPositions();
    this.won = false;
};

Board.prototype.addTile = function () {
    var newTile = new Tile;
    Tile.apply(newTile, arguments);
    this.tiles.push(newTile);
    return newTile;
};

Board.prototype.moveLeft = function () {
    var hasChanged = false;
    for (var row = 0; row < this.size; ++row) {
        var currentRow = this.cells[row].filter(tile => tile.value !== 0);
        var resultRow = Array(this.size).fill(this.addTile());
        for (var target = 0; target < this.size; target++) {
            var targetTile = currentRow.length ? currentRow.shift() : false;
            if (currentRow.length > 0 && targetTile && currentRow[0].value === targetTile.value) {
                targetTile.value *= 2;
                currentRow.shift();
            }
            resultRow[target] = targetTile ? targetTile : resultRow[target];
            this.won |= (targetTile.value === 2048);
            hasChanged |= (targetTile.value !== this.cells[row][target].value);
        }
        this.cells[row] = resultRow;
    }
    return hasChanged;
};

Board.prototype.setPositions = function () {
    this.cells.forEach((row, rowIndex) => {
        row.forEach((tile, columnIndex) => {
            tile.oldRow = tile.row;
            tile.oldColumn = tile.column;
            tile.row = rowIndex;
            tile.column = columnIndex;
            tile.markForDeletion = false;
        });
    });
};

Board.fourProbability = 0.1;

Board.prototype.addRandomTile = function () {
    var emptyCells = [];
    for (var r = 0; r < this.size; r++) {
        for (var c = 0; c < this.size; c++) {
            if (this.cells[r][c].value === 0) {
                emptyCells.push({ r: r, c: c });
            }
        }
    }
    var index = ~~(Math.random() * emptyCells.length);
    var cell = emptyCells[index];
    var newValue = Math.random() < Board.fourProbability ? 4 : 2;
    this.cells[cell.r][cell.c] = this.addTile(newValue);
};

Board.prototype.move = function (direction) {
    // 0 -> left, 1 -> up, 2 -> right, 3 -> down
    this.clearOldTiles();
    for (var i = 0; i < direction; i++) {
        this.cells = rotateLeft(this.cells);
    }
    var hasChanged = this.moveLeft();
    for (var i = direction; i < 4; i++) {
        this.cells = rotateLeft(this.cells);
    }
    if (hasChanged) {
        this.addRandomTile();
    }
    this.setPositions();
    return this;
};

Board.prototype.clearOldTiles = function () {
    this.tiles = this.tiles.filter(tile => tile.markForDeletion === false);
    this.tiles.forEach(tile => { tile.markForDeletion = true; });
};

Board.prototype.hasWon = function () {
    return this.won;
};

Board.deltaX = [-1, 0, 1, 0];
Board.deltaY = [0, -1, 0, 1];
Board.prototype.checkNeighbor = function () {
    var identicalNeightbor = false;
    for (var row = 0; row < this.size; row++) {
        for (var column = 0; column < this.size; column++) {
            for (var dir = 0; dir < this.size; dir++) {
                var newRow = row + Board.deltaX[dir];
                var newColumn = column + Board.deltaY[dir];
                if (newRow < 0 || newRow >= this.size || newColumn < 0 || newColumn >= this.size) {
                    continue;
                }
                identicalNeightbor |= (this.cells[row][column].value === this.cells[newRow][newColumn].value);
                if (identicalNeightbor === true){
                    return true
                }
            }
        }
    }
}
Board.prototype.hasLost = function () {
    //Cells have some-row with some-column that has value 0
    var emptyTiles = this.cells.some(
        row => row.some(
            column => column.value === 0) === true);
    var canMove = emptyTiles === true ? true : false;
    if(!canMove){
        canMove = this.checkNeighbor();
    }
    return !canMove;
};

export { Board }