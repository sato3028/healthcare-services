<template>
  <div>
    <div class="ui main container">
      <div class="ui segment">
        
        <form>
        </form>
        
      </div>
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
        name: null,
        dislike: [],
        season: "1"
      },
      done_submit: false,
      foods:[],
      lack_nutrients: [], // 不足している栄養素
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
    async createFoods(){
      const headers = { Authorization: "mtiToken" };
      try {
        /* global fetch */
        const res = await fetch(baseUrl + `/foods`, {
          method: "GET",
          headers,
        });
        
        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {}
        
        if (!res.ok){
          const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
          throw new Error(errorMessage);
        }
        this.foods = jsonData.foods
      }catch (e) {
        console.log(e)
      }
    },
    
    async createUser(){
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
        
        this.user.name = jsonData.user.name;
        this.user.password = jsonData.user.password;
        this.user.dislike = jsonData.user.dislike;
        this.user.season = jsonData.user.season;
      }catch (e) {
        console.log(e)
      }
    },
    
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

      const { userId, password, name, dislike, season } = this.user;
      const reqBody = {
        userId,
        password,
        name,
        dislike,
        season
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
    this.createFoods();
    this.createUser();
  },
};
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
