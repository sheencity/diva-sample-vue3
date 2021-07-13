import { createStore } from 'vuex'

import {
  DivaService
} from '../services/diva.service';

export default createStore({
  state(){
    return{
      _diva:new DivaService()
    }
  },
  mutations: {
   
  },
  actions: {
  },
  modules: {
  }
})