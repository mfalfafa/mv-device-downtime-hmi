<template>
    <div class="col-sm-12">
      <br/>
      <table class="table custom">
        <thead>
          <tr>
            <th width="33%">Mesin</th>
            <th width="33%">Downtime</th>
            <th width="33%">History</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td align="center">
              <span class="badge badge-pill badge-dark"><h3>{{ machinename }}</h3></span>
            </td>
            <td align="center">
              <downtime-counter :machineid="machineid" :machinename="machinename" @update-dt="getAllDt"></downtime-counter>
            </td>
            <td class="left-border">
              <downtime-list :listdt="listDt"></downtime-list>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
    import DowntimeCounter from './MachineDt/DowntimeCounter'
    import DowntimeList from './MachineDt/DowntimeList'
    
    export default {
      name: 'machine-dt',
      components: { DowntimeCounter, DowntimeList },
      props: ['machineid', 'machinename'],
      data: () => ({
        listDt: []
      }),
      mounted () {
        this.getAllDt()
      },
      methods: {
        getAllDt: function (mid) {
          this.$http.get('/device/getdtlist/' + this.machineid).then(ress => {
            this.listDt = ress.data
          }).catch(error => {
            console.log('error data get dt', error.config)
          })
        }
      }
    }
</script>