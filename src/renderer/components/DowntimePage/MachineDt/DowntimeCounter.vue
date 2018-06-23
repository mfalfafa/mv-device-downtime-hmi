<template>
    <div>
        <div>
            <h2>{{ timerShow }}</h2>
        </div>
        <div>
            <p v-if="startDtAt != null">Start Downtime at <b>{{ startDtAt }}</b></p>
            <p>Kategori Downtime <b><span v-if="reason.mreason != null">{{ reasonSelected.name }}</span></b></p>
        </div>
        <div style="width:70%;">
            <button type="button" class="btn btn-sm btn-primary btn-block" style="margin-bottom:10px;" @click="startDt()" :disabled="statusRunDt">Start Downtime</button>
            <button type="button" class="btn btn-sm btn-warning btn-block" @click="stopDt()" :disabled="!statusRunDt && idDt === null">End Downtime</button>

        </div>
        <!-- modal untuk menentukan plan dan unplan -->
        <transition name="modal">
            <div v-if="showModal" class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container">
                      <label>Pilih Main Reason</label>
                      <select v-model="reason.mreason">
                        <option v-for="(mr,ind) in mReasonSel" :key="ind" :value="mr.id">{{ mr.name }}</option>
                      </select>
                      <button @click="setCatDt()">Submit</button>
                    </div>
                </div>
            </div>
        </transition>
        <!-- modal untuk input reason downtime -->
        <transition name="reason">
          <div v-if="showSelReason" class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-container">
                <p>Mesin : {{ machinename }}</p>
                <p>Main Reason : {{ reason.mreason }}</p>
                <label>Select Kategori</label>
                <select v-model="reason.subreason">
                  <option v-for="(reas,ind) in reasonSelection" :key="ind" :value="reas.id">{{ reas.name }}</option>
                </select>
                <button type="button" @click="submitReason()">Submit</button>
              </div>
            </div>
          </div>
        </transition>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
      name: 'donwtime-counter',
      props: [ 'machineid', 'machinename' ],
      data: () => ({
        timer: null,
        dtTime: 0,
        statusRunDt: false,
        startDtAt: null,
        reason: {
          mreason: null,
          subreason: null
        },
        idDt: null,
        showModal: false,
        showSelReason: false,
        mReasonSel: [],
        subReasonSel: []
      }),
      computed:{
        timerShow: function () {
          return this.convertToHr(this.dtTime)
        },
        reasonSelection: function(){
          let defM = this.reason.mreason != null ? this.reason.mreason : 1
          return this.subReasonSel[defM]
        },
        reasonSelected: function () {
          let selected = this.reason.mreason != null ? this.reason.mreason : 1
          let res = this.mReasonSel.filter(function(obj){
            return obj.id == selected
          })
          return res[0]
        }
      },
      mounted(){
        this.mReasonSel = this.$store.state.Reason.mainreason
        this.subReasonSel = this.$store.state.Reason.subreason
      },
      methods: {
        startDt: function () {
          this.statusRunDt = true
          this.timer = setInterval(() => this.runTimer(), 1000)
          this.startDtAt = moment().format('DD-MM-YYYY HH:mm:ss')
          this.showModal = true
        },
        stopDt: function () {
          clearInterval(this.timer)
          this.endDowntime()
          this.timer = null
          this.statusRunDt = false
          this.dtTime = 0
          this.startDtAt = null
          this.showSelReason = true
        },
        setCatDt: function () {
          this.showModal = false
          this.sentDowntime()
        },
        runTimer: function () {
          this.dtTime++
        },
        sentDowntime: function () {
          let dtSend = {
            line_id: 1,
            machine_id: this.machineid,
            reason_zero: this.reason.mreason,
            start_time: moment()
          }
          this.$http.post('/device/setdt', dtSend).then(ress => {
            if (ress.data.sta === 1) {
              this.idDt = ress.data.downtime_id
            } else {
              console.log(ress.data.msg)
            }
            this.$emit('update-dt')
          })
        },
        endDowntime: function () {
          let endDt = {
            iddt: this.idDt != null ? this.idDt : 0
          }
          this.$http.post('/device/enddt', endDt).then(ress => {
            this.$emit('update-dt')
          }).catch(error => {
            console.log('error end dt', error)
          })
        },
        submitReason: function () {
          // update reason to database
          let upReas = {
            iddt: this.idDt,
            alasan_zero: this.reason.mreason,
            alasan_one: this.reason.subreason
          }
          this.$http.post('/device/updreason', upReas).then(ress => {
            this.$emit('update-dt')
          }).catch(error => {
            console.log('error update reason', error.config)
          })

          this.idDt = null
          this.reason = {
            mreason: null,
            subreason: null
          }
          this.showSelReason = false
        },
        convertToHr: function (counter) {
          counter = Math.round(counter)
          let seconds = counter > 0 ? counter : 0
          let hours = Math.floor(seconds / 3600)
          let minutes = Math.floor((seconds / 60) % 60)
          seconds = seconds % 60

          hours = hours < 1 ? 0 : hours
          minutes = minutes < 1 ? 0 : minutes

          hours = hours.toString().padStart(2, '0')
          minutes = minutes.toString().padStart(2, '0')
          seconds = seconds.toString().padStart(2, '0')

          let ret = hours + ':' + minutes + ':' + seconds

          return ret
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
  width: 550px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.reason-enter {
  opacity: 0;
}
.reason-leave-active {
  opacity: 0;
}
.reason-enter .reason-container,
.reason-leave-active .reason-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

