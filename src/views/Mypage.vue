<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui grid">
          <div class="row">
              <div class="card-padding card-shadow ui card eight wide left floated column">
              <div class="content">
                <h2 class="header">お子さんの状態は</h2>
                <div class="meta-padding meta">
                    <h3>
                        現在
                        <span class="massive-text">ゴックン期</span>
                    </h3>
                </div>
                <p>生後5~6か月目であるゴックン期ではペースト状のものが好まれます。</p>
              </div>
            </div>
            
              <div class="card-padding card-shadow ui card seven wide right floated column">
              <div class="content">
                <h2 class="header">一日の食事量は</h2>
                <div class="nutrition-padding meta">
                    <h3>
                        現在
                        <span class="massive-text">1~2回</span>
                    </h3>
                </div>
                <p>ゴックン期の食事量は1日1回の食事が一般的とされています。ゴックン期の後期からは1日2回の食事も視野に入れましょう。</p>
              </div>
            </div>
            
          </div>
            
            <div class="row">
              <div class="card-padding card-shadow ui card five wide left floated column">
              <div class="content">
                <h2 class="header">足りていない栄養素は</h2>
                <div class="nutrition-padding">
                    <div class="large-text">タンパク質</div>
                    <div class="large-text">カルシウム</div>
                </div>
                <p>なんか書く</p>
              </div>
            </div>
            
              <div class="card-padding card-shadow ui card ten wide right floated column">
              <div class="content">
                <h2 class="header">Tips</h2>
                <div class="meta-padding meta">
                    <h3>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
                        sed diam nonummy nibh euismod tincidunt ut laoreet dolore
                        magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
                        quis nostrud exerci tation ullamcorper suscipit lobortis nisl
                        ut aliquip ex ea commodo consequat. Duis autem vel eum iriure
                    </h3>
                </div>
              </div>
            </div>
            
          </div>
          
      </div>
      
      <button type="submit" class="ui right floated button edit-button">登録内容を編集</button>
      
    </div>
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from '@/assets/config.js';

export default {
  name: 'Mypagae',

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
      foods: []
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
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
        this.foods = jsonData.fodos
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
        
        this.user.name = jsonData.name;
        this.user.password = jsonData.password;
        this.user.dislike = jsonData.dislike;
        this.user.season = jsonData.season;
      }catch (e) {
        console.log(e)
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
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
.container-shadow{
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

.text-center {
    text-align:center;
}

.massive-text{
    font-size:3em;
    padding-left: 0.2em;
    color: #FBB161;
}
.card-padding{
    padding: 1.3em;
}
.meta-padding{
    padding: 1em;
}
.nutrition-padding{
    padding-bottom: 1em;
}
.card-shadow{
    box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
}
.large-text{
    margin-bottom: 0.4em;
    font-size: 2em;
    padding-left: 0.2em;
    color: #FBB161;
}
.edit-button{
  margin-top: 2em;
  background: #5E5DF0;
  border-radius: 999px;
  box-shadow: #5E5DF0 0 10px 20px -10px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  font-family: Inter,Helvetica,"Apple Color Emoji","Segoe UI Emoji",NotoColorEmoji,"Noto Color Emoji","Segoe UI Symbol","Android Emoji",EmojiSymbols,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans",sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  opacity: 1;
  outline: 0 solid transparent;
  padding: 8px 18px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: fit-content;
  word-break: break-word;
  border: 0;
}
</style>
