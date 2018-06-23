import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import db from './datastore'
import '@/assets/css/bootstrap.min.css'
import '@/assets/css/style.css'

//const datastore = require('nedb')

function loadDbFirst(callback){
  var _doc=null;
    db.findOne({
      machid: '2001'
    }, function (err, doc) {
      _doc=doc;
      if(_doc == null){
        insertNewData()
      }else{
        callback(_doc)
      }
    })
}

//Create Data first if there is no data found in the electron folder directory
function insertNewData(){
  let datSave = {
    "line":1,
    "machines":[{"id":1,"name":"oven 01"},{"id":2,"name":"creamer 01"}],
    "webserviceurl":"http://mv-webservice.test",
    "machid": '2001'
  }

  db.insert(datSave, function(err, newDocs){

  });
}

loadDbFirst(function(doc){
  if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
  //set up the axios
  
  axios.defaults.baseURL = 'http://webservice.mv/'
  //axios.defaults.baseURL = 'http://localhost/mv-webservice/public/'
  
  //doc.webserviceurl
  axios.defaults.headers = {
    'Access-Control-Allow-Origin': '*'
  }

  Vue.http = Vue.prototype.$http = axios
  Vue.config.productionTip = false

  // eslint-disable no-new 
  new Vue({
    components: {
      App
    },
    router,
    store,
    template: '<App/>'
  }).$mount('#app')

  Vue.prototype.$db = db
})