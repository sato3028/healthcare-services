<template>
  <div>
    <div class="ui main container">
      <div class="ui segment">
        <!-- 基本的なコンテンツはここに記載する -->
        <div class="submitted" v-if="done_submit">
          <h2>プロフィール情報を更新しました</h2>
        </div>
        <form class="ui large form" @submit.prevent="submit">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input v-model="user.userId" type="text" placeholder="ID" required disabled>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input v-model="user.password" type="password" placeholder="Password">
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="tag icon"></i>
              <input v-model="user.nickname" type="text" placeholder="NickName">
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="calendar icon"></i>
              <input v-model.number="user.age" type="text" placeholder="age">
            </div>
          </div>
          <button :disabled="isButtonDisabled" @click="submit()" class="ui fluid green huge button" type="submit">
            更新
          </button>
        </form>
      </div>
      <button @click="deleteUser" class="ui huge grey fluid button" type="submit">
        退会
      </button>
    </div>
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from '@/assets/config.js';

export default {
  name: 'Profile',

  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      user: {
        userId: window.localStorage.getItem('userId'),
        password: null,
        nickname: null,
        age: null,
      },
      done_submit: false,
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    isButtonDisabled() {
      return !this.user.userId || !this.user.password || !this.user.nickname || !this.user.age;
    }
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    async deleteUser() {
      const headers = {'Authorization': 'mtiToken'};
      
      try {
        const res = await fetch(`${baseUrl}/user?userId=${this.user.userId}`,{
          method: 'DELETE',
          headers
        });
        
        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {}
        
        
        if (!res.ok) {
          const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
          throw new Error(errorMessage);
        }
        
        this.$router.push({name: 'Login'});
      } catch (e) {
        console.log(e);
      }
    },
    
    async submit() {
      const headers = {'Authorization': 'mtiToken'};
      
      const { userId, password, nickname, age } = this.user;
      const reqBody = {
        userId,
        password,
        nickname,
        age
      };
      
      try {
        const res = await fetch(baseUrl + '/user', {
          method: 'PUT',
          body: JSON.stringify(reqBody),
          headers,
        });
        
        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {}
        
        if (!res.ok) {
          const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
          throw new Error(errorMessage);
        }
        
        if (res.status == 200){
          this.done_submit = true;
        }
        console.log(jsonData);
        
      } catch (e) {
        console.log(e)
      }
    }
  },
  
  created: async function() {
    const headers = { Authorization: "mtiToken" };
    try {
      /* global fetch */
      const res = await fetch(baseUrl + `/user?userId=${this.user.userId}`, {
        method: "GET",
        headers,
      });
      
      const text = await res.text();
      const jsonData = text ? JSON.parse(text) : {}
      
      if (!res.ok){
        const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
        throw new Error(errorMessage);
      }
      
      this.user.nickname = jsonData.nickname;
      this.user.age = jsonData.age;
    }catch (e) {
      console.log(e)
    }
  },
};
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
