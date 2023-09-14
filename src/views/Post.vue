<template>
  <div>
    <div class="ui main container">
      <h1 class="h1-color ui dividing header">食事登録</h1>
     <div class="ui segment card-padding">
       
       <h2 class="text-center">食べた食材</h2>
        <div class="submit-box ui grid">
          <div class="row">
            <!--
            <div class="ui fluid multiple search selection dropdown eight wide left floated column">
              <input type="hidden" name="country">
              <i class="dropdown icon"></i>
              <div class="default text">Select Country</div>
              <div class="menu">
              <div class="item" data-value="af"><i class="af flag"></i>Afghanistan</div>
              <div class="item" data-value="ax"><i class="ax flag"></i>Aland Islands</div>
              <div class="item" data-value="al"><i class="al flag"></i>Albania</div>
            </div>
            </div>
            -->
            
            <div class="ui fluid search selection dropdown eight wide left floated column">
              <input type="hidden" name="foodselection">
              <i class="dropdown icon"></i>
              <div class="default text">食材を選んでください</div>
              <div class="menu">
              <template v-for="(food, index) in foods" :key="index">
                <div class="item" :data-value="food.foodId" >{{ food.name }}</div>
              </template>
              </div>
            </div>
            
            <div class="ui labeled input four wide right floated column">
              <input type="text" v-model="weight" placeholder="食べた量を入力">
              <div class="ui basic label">
                g
              </div>
            </div>
            
            <button type="add" v-on:click="addFoodToHistories()" class="add-button two wide right floated column">
              追加
            </button>
         
          </div>
        </div>
        
        <ul class="ui three column grid">
        <template v-for="(history, index) in histories" :key="index">
          <li class="column">
            <div class="ui card fluid">
              <div class="content">
                <h2 class="header">
                  {{ filteredFoods(history.foodId) }}
                </h2>
                <span class="meta-gram">{{history.weight}}g</span>
              </div>
            </div>
          </li>
        </template>
      </ul>
      
      <div class="submit-box ui grid">
        <div class="row">
          <button v-on:click="submit()" type="submit" class="submit-button two wide right floated column">
              送信
          </button>
        </div>
      </div>
        
     </div>
    </div>
 </div>
</template>

<script>
import { baseUrl } from '@/assets/config.js';

export default {
  name: "Post",

  data() {
    return {
      userId: window.localStorage.getItem('userId'),
      weight:0,
      foods:[],
      histories:[],
    };
  },

  computed: {
    
  },

  methods: {
    addFoodToHistories(){
      var selectedValue = document.querySelector('.ui.fluid.search.selection.dropdown input[name="foodselection"]').value;
      const unit = {"foodId": selectedValue, "weight": this.weight}
      //console.log(unit)
      
      this.histories.push(unit)
      //console.log(this.histories)
      
      var dropdownElement = document.querySelector('.ui.fluid.search.selection.dropdown');
      $(dropdownElement).dropdown('clear');
      this.weight = 0
    },
    
    filteredFoods(key) {
      const target = this.foods.filter(food => food.foodId === key);
      console.log(target[0])
      return target[0].name
    },
    
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

    async submit() {
      const headers = {'Authorization': 'mtiToken'};
      const userId = this.userId;
      const histories = this.histories;

      const reqBody = {
        userId,
        histories,
      };

      try {
        const res = await fetch(baseUrl + '/food', {
          method: 'POST',
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
        
        this.histories = [];
        this.$router.push({ name: 'Mypage'});

      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted: function() {
     $('.ui.dropdown')
      .dropdown();
  },
  created: async function() {
    this.createFoods();
  },
};
</script>

<style scoped>
.card-padding{
    border-radius: 30px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}

.text-center {
    text-align:center;
}

.meta-gram{
  font-size: 2em;
  color: orange;
}
.submit-box{
  padding: 0.8em;
}

.add-button {
  align-items: center;
  appearance: button;
  background-color: #0276FF;
  border-radius: 8px;
  border-style: none;
  box-shadow: rgba(255, 255, 255, 0.26) 0 1px 2px inset;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  font-family: "RM Neue",sans-serif;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  padding: 10px 21px;
  text-align: center;
  text-transform: none;
  transition: color .13s ease-in-out,background .13s ease-in-out,opacity .13s ease-in-out,box-shadow .13s ease-in-out;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
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

.button-37:hover {
  box-shadow: rgba(0, 0, 0, .15) 0 3px 9px 0;
  transform: translateY(-2px);
}

@media (min-width: 768px) {
  .button-37 {
    padding: 10px 30px;
  }
}

.button-22:active {
  background-color: #006AE8;
}

.button-22:hover {
  background-color: #1C84FF;
}
</style>
