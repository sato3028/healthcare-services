<template>
    <div class="ui secondary pointing green inverted massive menu">
        <router-link active-class="active" class="item" exact to="/">Home</router-link>
        <router-link class="item" exact to="/user">User</router-link>
        <router-link class="item" exact to="/profile">Profile</router-link>
        <router-link class="item" exact to="/mypage">Mypage</router-link>
        <router-link class="item" exact to="/post">Post</router-link>
        <div class="right menu">
            <a @click="logout" class="item">Logout</a>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'Menu',
        computed: {
            
        },
        methods: {
            logout() {
                window.localStorage.clear();
                this.$router.push({name: "Login"});
            }
        },
    };
</script>
<style scoped>
    
</style>