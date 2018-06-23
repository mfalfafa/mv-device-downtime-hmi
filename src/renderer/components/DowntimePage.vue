<template>
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-8">
          <!-- <router-link to="/logout">Logout</router-link> -->
          <router-link :class="['btn-machine', 'btn', 'btn-outline-primary', 'btn-sm']" to="/konfigurasi" v-if="$store.state.Login.role === 1">Konfigurasi</router-link>
        </div>
        <div class="col-sm-4 text-right">
          <button type="button" :class="['btn-machine', 'btn', 'btn-outline-primary', 'btn-sm', {'active-machine': machineShow[ind]}]" v-for="(mesin,ind) in mesinList" :key="ind" @click="showMachine(ind)">{{ mesin.name }}</button>
        </div>
      </div>
      <div class="row">
        <machine-dt v-for="(mesin,ind) in mesinList" :key="ind" :machineid="mesin.id" :machinename="mesin.name" v-show="machineShow[ind]"></machine-dt>
      </div>
    </div>
</template>

<script>
    import MachineDt from './DowntimePage/MachineDt'
    export default {
      name: 'donwtime-page',
      components: { MachineDt },
      data: () => ({
        mesinList: [],
        machineShow: []
      }),
      mounted () {
        this.loadMachine()
        //console.log(this.$store.state.Machines.machines)
      },
      methods: {
        showMachine: function (ind) {
          for (let i = 0; i < this.mesinList.length; i++) {
            this.$set(this.machineShow, i, false)
          }
          this.$set(this.machineShow, ind, true)
        },
        loadMachine: function () {
          this.mesinList = this.$store.state.Machines.machines
          this.showMachine(0)
        }
      }
    }
</script>

<style>
.btn-machine{
    margin-right: 5px;
}
</style>

