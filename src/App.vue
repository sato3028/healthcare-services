<template>
    <div id="app">
      <div class="Menu" v-if="!$route.meta.hideMenu">
        <Menu />
      </div>
        <router-view/>
    </div>
</template>

<script>
    import { RouterView } from 'vue-router';
    import Menu from '@/components/Menu.vue';
    
    export default {
        name: 'App',
        components: {
            
            Menu
        },
        
        data() {
          token: window.localStorage.getItem('token');
        }
    }
</script>