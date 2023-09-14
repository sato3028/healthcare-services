<template>
    <div class="nav-color ui secondary pointing inverted massive menu">
        <router-link active-class="active" class="item" exact to="/post">食事登録</router-link>
        <router-link active-class="active" class="item" exact to="/mypage">マイページ</router-link>
        <router-link active-class="active" class="item" exact to="/profile">登録内容編集</router-link>
        <div class="right menu">
            <a @click="logout" class="item">ログアウト</a>
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
.nav-color{
    background-color: #E6A1A4 !important;
}
</style>