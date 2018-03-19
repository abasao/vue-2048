<template>
    <div class="board" tabIndex="1">
        <div v-for="(cell_row, row) in board.cells" :key="row">
            <cell v-for="(cell, cell_index) in cell_row" :key="cell_index"></cell>
        </div>
        <tile v-for="tile in tiles" :tile="tile" :key="tile.id">
        </tile>
        <game-over :board="board" :onrestart="onRestart"></game-over>
    </div>
</template>

<script>
    import Cell from './Cell.vue'
    import Tile from './Tile.vue'
    import GameOver from './GameOver.vue'
    import {Board} from '../board'
    export default {
        data(){
          return {
              board: new Board(8)
          }
        },
        mounted(){
            window.addEventListener('keydown', this.handleKeyDown);
        },
        beforeDestroy(){
            window.removeEventListener('keydown', this.handleKeyDown);
        },
        computed:{
          tiles(){
              return this.board.tiles
                      .filter(tile => tile.value != 0)
          }
        },
        methods:{
            handleKeyDown(event){
                if (this.board.hasWon()) {
                    return;
                }
                if (event.keyCode >= 37 && event.keyCode <= 40) {
                    event.preventDefault();
                    var direction = event.keyCode - 37;
                    this.board.move(direction)
                }
            },

            onRestart(){
                this.board =new Board(8);
            }
        },
        components: {
            Cell,
            Tile,
            GameOver,
        }
    }
</script>