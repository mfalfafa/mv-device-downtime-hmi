<template>
    <div class="container">
      <div class="row">
        <div class="col-sm-6">
          <div class="brand-logo"></div>
        </div>
        <div class="col-sm-6 text-right">
          <br/>
          <span class="border border-primary" style="padding: 10px; background:#fff;">HMI COOLING &amp; CUTTING</span>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-8 offset-sm-2">
          <br/>
          <form class="form-configuration border border-primary">
            <div class="form-group row">
              <label class="col-sm-4 col-form-label">List Mesin digunakan</label>
              <div class="col-sm-8">
                <ul class="list-group">
                  <li class="list-group-item" v-for="(mac,ind) in mesinList" :key="ind">{{ 'Mesin id : '+mac.id+', Mesin : '+mac.name }}</li>
                </ul>  
                <br/>
                <button class="btn btn-sm btn-primary" @click="showModalLine()">Ubah Mesin</button>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 col-form-label">Webservice url</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" v-model="weburl">  
              </div>
            </div>
            <button class="btn btn-success btn-block" @click="simpanKonfig()">Simpan Konfigurasi</button>
          </form>
          
        </div>
      </div>
        
        <!-- modal untuk memilih mesin dalam satu line-->
        <transition name="mesin">
            <div v-if="modalLine" class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container">
                      <div>
                          <label>Line :</label>
                          <select v-model="line">
                              <option v-for="(ln,ind) in lineSelect" :key="ind" :value="ln.id">{{ ln.name }}</option>
                          </select>
                      </div>
                      <div>
                          <label>Machine :</label>
                          <div>
                              <div v-for="(mc,ind) in machineSelect" :key="ind">
                                  <input type="checkbox" :value="mc.id" v-model="machine">
                                  <label>{{ mc.name }}</label>
                              </div>
                          </div>
                      </div>
                      <button @click="setMachine()">Set Mesin</button>
                    </div>
                </div>
            </div>
        </transition>
        <!-- modal after konfigurasi -->
        <transition name="finalisasi">
            <div v-if="finalisShow" class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container">
                        <router-link :class="['btn-machine', 'btn', 'btn-outline-primary', 'btn-sm']" to="/">Kembali Login</router-link>
                        <button :class="['btn-machine', 'btn', 'btn-outline-primary', 'btn-sm']" @click="closeFinal()">Tutup</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>

   export default {
     name: 'donwtime-page',
     data: () => ({
       mesinList: [],
       weburl: null,
       modalLine: false,
       finalisShow: false,
       line: 1,
       machine: [],
       lineSelect: [],
       listMachine: []
     }),
     mounted(){
         this.loadLine()
         this.loadMachine()
         var vm = this
         vm.$db.findOne({_id: 'wtB7GdFkV5SaQI8m'},function(err,doc){
             vm.mesinList = doc.machines
             vm.weburl = doc.webserviceurl
         })
     },
     computed:{
         machineSelect: function () {
             return this.listMachine[this.line]
         }
     },
     methods: {
         closeFinal: function(){
             this.finalisShow = false
         },
         loadLine: function(){
             this.$http.get('/lines/all').then(ress => {
                 this.lineSelect = ress.data
             }).catch(error => {
                 console.log('error get line',error.config)
             })
         },
         loadMachine: function(){
             this.$http.get('/machines/byline').then(ress => {
                 this.listMachine = ress.data
             }).catch(error => {
                 console.log('error get machine',error.config)
             })
         },
         setMachine: function(){
             this.$http.post('/machines/byidmachine',{machines: this.machine}).then(ress => {
                 this.mesinList = ress.data
                 this.modalLine = false
             }).catch(error => {
                 console.log('error set mesin list',error.config)
                 this.modalLine = false
             })
         },
         simpanKonfig: function(){
             let simpJson = {
                 line: this.line,
                 machines: this.mesinList,
                 webserviceurl: this.weburl
             }
             this.$db.update({_id: 'wtB7GdFkV5SaQI8m'},simpJson,{},function(err,numReplaced){
                 console.log('simpan');
             })

             this.finalisShow = true
         },
         showModalLine: function(){
             this.modalLine = true
             console.log(this.$db)
         }
     }
   }
</script>

<style>
.modal-mask{
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}
.modal-wrapper{
  display: table-cell;
  vertical-align: middle;
}
.modal-container{
  width: 540px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.mesin-enter {
  opacity: 0;
}
.mesin-leave-active {
  opacity: 0;
}
.mesin-enter .mesin-container,
.mesin-leave-active .mesin-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.finalisasi-enter {
  opacity: 0;
}
.finalisasi-leave-active {
  opacity: 0;
}
.finalisasi-enter .finalisasi-container,
.finalisasi-leave-active .mesin-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

