<template>
  <div>
    <div class="ui main container container-padding">
      <h1 class="h1-color ui dividing header">プロフィール編集</h1>
      <div class="ui segment card-padding">
        
        
        <form class="ui form" @submit.prevent="submit">
          <div class="field">
            <label>ユーザー名</label>
              <div class="field">
                <input v-model="user.userId" type="text" name="shipping[first-name]" placeholder="利用する方の名前を入力してください" required disabled>
            </div>
          </div>
          <div class="two fields">
            <div class="field">
              <label>赤ちゃんの名前</label>
              <input v-model="user.name" type="text" name="shipping[address]" placeholder="お子様の名前を入力してください">
            </div>
            <div class="field">
              <label>お子さんが生まれてから</label>
              <select id="ageSelect" class="ui fluid dropdown" v-model="user.season">
                <option value="1">5~6カ月(離乳食初期)</option>
                <option value="2">7~8カ月(離乳食中期)</option>
                <option value="3">9~11カ月(離乳食後期)</option>
                <option value="4">12~18カ月(離乳食完了期)</option>
              </select>
            </div>
          </div>
          
          <h4 class="ui dividing header">お子様の苦手な食品/食べられない食品を選んでください</h4>
          
          <ul class="ui four column grid">
            <template v-for="(food, index) in foods" :key="index">
              <li class="column">
                <div class="check-center ui toggle checkbox">
                  <div class="content">
                    <input
                      type="checkbox"
                      name="public"
                      v-model="food.checked"
                      @change="handleCheckboxChange(food)">
                    <label>{{ food.name }}</label>
                  </div>
                </div>
              </li>
            </template>
          </ul>
            <!--  
              <div class="column">
                <div class="check-center ui toggle checkbox">
                  <input type="checkbox" name="public">
                  <label>鶏肉</label>
                </div>
              </div>
              
              <div class="column">
                <div class="check-center ui toggle checkbox">
                  <input type="checkbox" name="public">
                  <label>しらす</label>
                </div>
              </div>
              
              <div class="column">
                <div class="check-center ui toggle checkbox">
                  <input type="checkbox" name="public">
                  <label>卵黄</label>
                </div>
              </div>
              
              <div class="column">
                <div class="check-center ui toggle checkbox">
                  <input type="checkbox" name="public">
                  <label>ほうれんそう</label>
                </div>
              </div>
            -->
              
          
          
          <div class="submit-box ui grid">
            <div class="row">
              <button type="submit" @click="submit()" class="submit-button two wide right floated column">
                  更新する
              </button>
            </div>
          </div>
          
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
      selected_foods:[]
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    isButtonDisabled() {
      return !this.user.userId || !this.user.password || !this.user.name || !this.user.season;
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
        // 初期値のdislikeに応じて、チェックボックスの状態を設定
        this.foods = jsonData.foods
        if(this.user.dislike !== []){
          this.foods = this.foods.map(food => {
            if (this.user.dislike.includes(food.foodId)) {
              food.checked = true;
            } else {
              food.checked = false;
            }
            return food;
          });
        }
        
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
    
    /*
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
    */
    handleCheckboxChange(food) {
      // チェックボックスが変更されたときに呼び出されるメソッド
      if (food.checked) {
        // チェックボックスが選択された場合、selected_foodsに追加
        this.selected_foods.push(food);
      } else {
        // チェックボックスが選択解除された場合、selected_foodsから削除
        const index = this.selected_foods.indexOf(food);
        if (index !== -1) {
          this.selected_foods.splice(index, 1);
        }
      }
      //console.log(this.selected_foods)
    },
    
    async submit() {
      const headers = {'Authorization': 'mtiToken'};
      
      const selectElement = document.getElementById("ageSelect");
      selectElement.addEventListener("change", function() {
        this.user.season = selectElement.value; // 選択された値を取得
      });
      
      const { userId, password, name, season } = this.user;
      
      var dislike = [];
      for(const i of this.foods){
        if(i.checked == true){
          dislike.push(i.foodId);
        }
      }
      console.log(dislike)
    
      
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
        this.$router.push({ name: 'Mypage'});

      } catch (e) {
        console.log(e)
      }
    }
  },
  
  created: async function() {
    this.createUser();
    this.createFoods();
  },
};
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
.container-padding{
  padding-bottom: 3em;
}
.card-padding{
    border-radius: 30px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}
.check-center{
  /*display: flex;*/
  justify-content: center; /* 水平方向の中央揃え */
  align-items: center;
}

.submit-box{
  padding: 0.8em;
}

.submit-button{
  background-color: #13aa52;
  border: 1px solid #13aa52;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, .1) 0 2px 4px 0;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  font-family: "Akzidenz Grotesk BQ Medium", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  font-weight: 400;
  outline: none;
  outline: 0;
  padding: 10px 25px;
  text-align: center;
  transform: translateY(0);
  transition: transform 150ms, box-shadow 150ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}
</style>
