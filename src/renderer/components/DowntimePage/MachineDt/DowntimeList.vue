<template>
    <div class="fix-height">
        <ul class="list list-unstyled custom">
            <li v-for="(dt,ind) in listdt" :key="ind">
                <b>{{ dt.downtime+' | '+dt.reason }}</b>
                <br/>
                {{ 'start : '+dt.start_at}}
                <br/>
                {{ 'end : '+dt.finish_at }}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
      name: 'downtime-list',
      props: ['listdt']
    }
</script>