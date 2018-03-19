// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Board from './components/Board'
import './assets/scss/style.scss'
import './assets/scss/main.scss'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  //vue hook for placement of template below
  el: '#game', 
  data(){
    return {boardSize: 8}
  },
  components: { Board },
  //insert template into target element: el
  template: '<Board/>' 
})
