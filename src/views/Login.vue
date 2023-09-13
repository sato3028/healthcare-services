<template>
  <div>
    <div class="ui main container">
      <div class="ui segment">
        <!-- 基本的なコンテンツはここに記載する -->
        <div v-if="errorMessage">
          エラー：{{ errorMessage }}
        </div>
        <form class="ui large form" @submit.prevent="submit">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input v-model="user.userId" type="text" placeholder="ログインID">
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input v-model="user.password" type="password" placeholder="パスワード">
            </div>
          </div>
          <div class="field" v-if="!isLogin">
            <div class="ui left icon input">
              <i class="tag icon"></i>
              <input v-model="user.name" type="text" placeholder="赤ちゃんのお名前">
            </div>
          </div>

          <button @click="submit()" class="ui fluid green huge button" type="submit">
            {{ submitText }}
          </button>
        </form>
      </div>
      <button @click="toggleMode()" class="ui huge grey fluid button" type="submit">
        {{ toggleText }}
      </button>
    </div>
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from "@/assets/config.js";

export default {
  name: 'Login',

  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      errorMessage: null,
      isLogin: true,
      user: {
        userId: null,
        password: null,
        name: null,
      },
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    submitText(){
      return this.isLogin ? 'ログイン' : '新規登録';
    },
    toggleText(){
      return this.isLogin ? '新規登録' : 'ログイン';
    },
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    toggleMode() {
      this.isLogin = !this.isLogin
    },
    
    async submit() {
      if(this.isLogin){
        const headers = { Authorization: "mtiToken" };
        const reqBody = {
          userId: this.user.userId,
          password: this.user.password,
        };
        
        try {
          console.log("do");
          const res = await fetch(baseUrl + "/user/login", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers,
          });
          
          const text = await res.text();
          const jsonData = text ? JSON.parse(text) : {}
          
          if (!res.ok) {
            const errorMessage = jsonData.message ?? 'エラーメッセージがありません。';
            throw new Error(errorMessage);
          }
          window.localStorage.setItem('token', jsonData.token);
          window.localStorage.setItem('userId', this.user.userId);
          
          this.$router.push({ name: 'Mypage'});
          
          console.log(jsonData);
        }catch (e) {
          console.log(e);
          this.errorMessage = e.message;
        }
        return
      }
      // リクエストボディを指定する
      const headers = { Authorization: "mtiToken" };
      const reqBody = {
        userId: this.user.userId,
        password: this.user.password,
        name: this.user.name,
      };

      try {
        /* global fetch */
        const res = await fetch(baseUrl + "/user/signup", {
          method: "POST",
          body: JSON.stringify(reqBody),
          headers,
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
        if (!res.ok) {
          const errorMessage =
            jsonData.message ?? "エラーメッセージがありません";
          throw new Error(errorMessage);
        }

        // 成功時の処理
        console.log(jsonData);
        window.localStorage.setItem('token', jsonData.token);
        window.localStorage.setItem('userId', this.user.userId);
        
        this.$router.push({ name: 'Profile'});
      } catch (e) {
        console.error(e);
        // エラー時の処理
        this.errorMessage = e.message;
      }
    },
  },
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
