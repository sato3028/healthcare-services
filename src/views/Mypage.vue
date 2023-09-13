<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui grid">
          <div class="row">
              <div class="card-padding card-shadow ui card eight wide left floated column">
              <div class="content">
                <h2 class="header">{{user.name}}さんの状態は</h2>
                <div class="meta-padding meta">
                    <h3>
                        現在
                        <span class="massive-text">{{_mypage_term}}期</span>
                    </h3>
                </div>
                <p>生後{{_mypage_months_of_age}}か月目である{{_mypage_term}}期ではペースト状のものが好まれます。</p>
              </div>
            </div>
            
              <div class="card-padding card-shadow ui card seven wide right floated column">
              <div class="content">
                <h2 class="header">一日の食事量は</h2>
                <div class="nutrition-padding meta">
                    <h3>
                        現在
                        <span class="massive-text">{{_mypage_daily_time_of_meals}}</span>
                    </h3>
                </div>
                <p>{{_mypage_daily_tips}}</p>
              </div>
            </div>
            
          </div>
            
            <div class="row">
              <div class="card-padding card-shadow ui card five wide left floated column">
              <div class="content">
                <h2 class="header">足りていない栄養素は</h2>
                  <ul>
                    <li v-for="(item, index) in _Mypage_nutritions_name" :key="index">
                      <div class="large-text">{{item.name}}</div>
                    </li>
                  </ul>
                <p>なんか書く</p>
              </div>
            </div>
            
              <div class="card-padding card-shadow ui card ten wide right floated column">
              <div class="content">
                <h2 class="header">おすすめの食品は</h2>
                <div class="nutrition-padding">
                    <ul>
                      <li v-for="(item, index) in _Mypage_suggestion" :key="index">
                        <div class="large-text">{{item.string}}</div>
                      </li>
                    </ul>
                </div>
                <p>です！</p>
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
        userId: "testuser",   // DEBUG
        // userId: window.localStorage.getItem('userId'),
        password: null,
        name: null,
        dislike: [],
        season: "1"
      },
      done_submit: false,
      foods:[],
      /*lack_nutrients: [
        {"nutrition": "iron"},
        {"nutrition": "protain"},
      ],*/   // DEBUG
      lack_nutrients: [], // 不足している栄養素
      _Mypage_nutritions_name: [],  // 表示用文字列(栄養素)
      _Mypage_suggestion: [],       // 表示用文字列(食品)
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    
    // 1日の食事回数
    _mypage_daily_time_of_meals: function() {
      if(this.user.season === "1") {
        return "1~2回"; 
      } else if(this.user.season === "2") {
        return "2回";
      } else if(this.user.season === "3") {
        return "3回";
      } else if(this.user.season === "4") {
        return "3回+間食";
      } else {
        return "";
      }
    },
    
    // ○○期
    _mypage_term: function() {
      if(this.user.season === "1") {
        return "ゴックン"; 
      } else if(this.user.season === "2") {
        return "モグモグ";
      } else if(this.user.season === "3") {
        return "カミカミ";
      } else if(this.user.season === "4") {
        return "パクパク";
      } else {
        return "";
      }
    },
    
    // 生後〇～〇か月
    _mypage_months_of_age: function() {
      if(this.user.season === "1") {
        return "5~6"; 
      } else if(this.user.season === "2") {
        return "7~8";
      } else if(this.user.season === "3") {
        return "9~11";
      } else if(this.user.season === "4") {
        return "12~18";
      } else {
        return "";
      }
    },
    
    // Tips的な文章(一日の食事量の下。)
    _mypage_daily_tips: function() {
      if(this.user.season === "1") {
        return "ゴックン期の食事量は1日1回が一般的とされています。ゴックン期の後期からは1日2回の食事も視野に入れましょう。"; 
      } else if(this.user.season === "2") {
        return "モグモグ期の食事量は1日2回が一般的とされています。食材は前半は豆腐程度の硬さにつぶし、後半はつぶさず2~4mm程度を意識しましょう。";
      } else if(this.user.season === "3") {
        return "カミカミ期の食事量は1日3回が一般的とされています。前半は歯茎でつぶせる程度の硬さで5mm程度に、後半は少しずつサイズを大きくしましょう。";
      } else if(this.user.season === "4") {
        return "パクパク期では、1日3回の食事と、赤ちゃんの様子次第で間食を加えてみましょう。後半は自分の手で持って食べさせてみましょう。";
      } else {
        return "";
      }
    },
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
        //console.log(this.user.name);
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
        //console.log(jsonData);
        
      } catch (e) {
        console.log(e)
      }
    },
    
    // データベースから苦手な奴を引っ張り出す
    async getLackNutrition() {
      const headers = { Authorization: "mtiToken" };
      try {
        /* global fetch */
        const res = await fetch(baseUrl + `/suggest?userId=${this.user.userId}`, {
          method: "GET",
          headers,
        });
        
        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {}
        
        if (!res.ok){
          const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
          throw new Error(errorMessage);
        }
        
        this.lack_nutrients = jsonData.suggestion;
        
        // this.user.name = jsonData.user.name;
        // this.user.password = jsonData.user.password;
        // this.user.dislike = jsonData.user.dislike;
        // this.user.season = jsonData.user.season;
        console.log(this.lack_nutrients[0]);
        
        // 不足栄養素の出力文字列の作成
        let str = [];
      let i = 0;
      //console.log("here");
      this.lack_nutrients.forEach(function(value) {
        //console.log("hello");
        switch(value.nutrition) {
          case "energy":
            str[i] = {"name": "エネルギー"};
            break;
          case "protain":
            str[i] = {"name": "タンパク質"};
            break;
          case "lipid":
            str[i] = {"name": "脂質"};
            break;
          case "carbohydrates":
            str[i] = {"name": "炭水化物"};
            break;
          case "calcium":
            str[i] = {"name": "カルシウム"};
            break;
          case "iron":
            str[i] = {"name": "鉄分"};
            break;
          case "vitamin_d":
            str[i] = {"name": "ビタミンD"};
            break;
          default:
            str[i] = {"name": ""};
            break;
        }
        i++;
      });
      //console.log(str);   // DEBUG
      this._Mypage_nutritions_name = str;
      
      // おすすめ食品の出力文字列作成
      let arr = [];
      i = 0;
      console.log(this.user.dislike);
      this.lack_nutrients.forEach(function(value){
        arr[i] = {"string": `${value.food1.name} (${str[i].name})`};
        i++;
      });
      
      //console.log(arr);
      this._Mypage_suggestion = arr;
      
      }catch (e) {
        console.log(e)
      }
    },
  },
  
  created: async function() {
    this.createFoods();
    this.createUser();
    this.getLackNutrition();
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
