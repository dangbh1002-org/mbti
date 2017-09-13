<template>
  <v-container fluid>

    <v-card v-for="(question, index) in questionsArray" :key="question['.key']" v-if="!counted"
      :style="{'margin-bottom': '20px', 'border-left':question.error?'5px solid red':'5px solid #3b5998'}"
      >
      <v-card-text>
        <v-container fluid>
          <v-layout row>
            <v-flex x12>
              <h4>{{index + 1}}. {{question.title}}</h4>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <p>{{question.description}}</p>
            </v-flex>
          </v-layout>

          <v-layout>
            <v-flex xs12>

              <v-radio-group v-model="question.actualScore" column>
                <v-radio v-for="(option, index2) in question.options" :key="option['.key']"
                  :label="option.label"
                  color="info"
                  :value="option.score">
                </v-radio>
              </v-radio-group>

            </v-flex>

          </v-layout>

        </v-container>
      </v-card-text>

    </v-card>

    <v-layout row>
      <v-flex xs3></v-flex>
      <v-flex xs6>
        <v-card v-if="counted" >
          <v-card-text class="text-xs-center">
            <a :href="'https://www.facebook.com/'+user.providerData[0].uid" target="_blank">
              <img :style="{
                'width': '100px',
                'height': '100px',
                'margin-top': '15px',
                'margin-left': 'auto',
                'margin-right': 'auto',
                'margin-bottom': '15px',
                'background-image': 'url('+ user.photoURL +')',
                'background-repeat': 'no-repeat',
                'background-size': 'cover',
                // 'border': '5px solid purple',
              }" />
            </a>

            <p>Bạn đã thực hiện xong bài test này. Bạn thuộc nhóm tính cách: <b v-if="!counting">{{result.personalType}}</b></p>

            <p v-for="(item, index) in questionTypes" v-if="!counting">

              <b>{{item.name}} ({{item.code}} -
                <span>{{item.percent}}%</span>)
              </b>

              <span v-if="item.percent > 50"> hơn </span>
              <span v-else-if="item.percent < 50"> thua </span>
              <span v-else-if="item.percent"> bằng </span>

              <b>{{item.negativeName}} ({{item.negative}} -
                <span>{{100 - item.percent}}%</span>)
              </b>
            </p>

            <p v-if="!counting">Xem chi tiết:
              <a :href="'http://www.tracnghiemmbti.com/mbti-tinh-cach-' + result.personalType.toLowerCase() + '-tongquan.html'" target="_blank">
                http://www.tracnghiemmbti.com/mbti-tinh-cach-{{result.personalType.toLowerCase()}}-tongquan.html
              </a>
            </p>

            <v-layout v-if="counting" row>
              <v-flex xs12>
                <p><v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" class="purple--text"></v-progress-circular></p>
                <p>Đang tính toán...</p>
              </v-flex>
            </v-layout>
          </v-card-text>

        </v-card>

      </v-flex>
    </v-layout>

    <div class="text-xs-center" style="margin-top: 15px">
      <p v-if="error">Bạn chưa trả lời hết các câu hỏi!</p>
      <v-btn class="success" type="submit" @click="submit()" v-if="!counted && !loading">Submit</v-btn>
      <v-btn class="success" type="submit" @click="initCount()" v-if="counted && !counting">Làm test lại</v-btn>
    </div>

    <v-layout row v-for="friend in friendsList" :key="friend.id" style="margin-top: 15px" v-if="friend.suit">
      <v-flex xs3></v-flex>
      <v-flex xs6>
        <v-card v-if="counted">
          <v-card-text class="text-xs-center">

            <a :href="'https://www.facebook.com/'+friend.id" target="_blank">
              <img :style="{
                'width': '100px',
                'height': '100px',
                'margin-top': '15px',
                'margin-left': 'auto',
                'margin-right': 'auto',
                'margin-bottom': '15px',
                'background-image': 'url('+ friend.photoURL +')',
                'background-repeat': 'no-repeat',
                'background-size': 'cover',
                // 'border': '5px solid purple',
              }" />
            </a>

            <p>
              <a :href="'https://www.facebook.com/'+friend.id" target="_blank" class="personalName">{{friend.name}}</a>
              hợp với bạn

              <span style="font-size: 24px; font-weight: bold; color: white; background: purple; padding: 3px; border-radius: 3px">
                {{!counting?friend.suit:'...'}}%
              </span>.

              {{friend.gender === 'male'?'Anh': 'Cô'}} ấy thuộc nhóm tính cách:
              <b v-if="!counting">{{friend.result.personalType}}</b>
            </p>

            <p v-for="(item, index) in friend.questionTypes" v-if="!counting" class="text-xs-center">

              <b>{{item.name}} ({{item.code}} -
                <span>{{item.percent}}%</span>)
              </b>

              <span v-if="item.percent > 50"> hơn </span>
              <span v-else-if="item.percent < 50"> thua </span>
              <span v-else-if="item.percent"> bằng </span>

              <b>{{item.negativeName}} ({{item.negative}} -
                <span>{{100 - item.percent}}%</span>)
              </b>
            </p>

            <p v-if="!counting">Xem chi tiết:
              <a :href="'http://www.tracnghiemmbti.com/mbti-tinh-cach-' + friend.result.personalType.toLowerCase() + '-tongquan.html'" target="_blank">
                http://www.tracnghiemmbti.com/mbti-tinh-cach-{{friend.result.personalType.toLowerCase()}}-tongquan.html
              </a>
            </p>

            <v-layout v-if="counting" row>
              <v-flex xs12>
                <p><v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" class="purple--text"></v-progress-circular></p>
                <p>Đang tính toán...</p>
              </v-flex>
            </v-layout>
          </v-card-text>

        </v-card>

      </v-flex>
    </v-layout>

  </v-container>

</template>

<script>
  let firebase = require('firebase');

  export default {
    data() {
      return {
        loading: true,
        questionsArray: [],
        score: {},
        actualScore: {},
        questionTypes: [
          {code: 'E', name: "Hướng ngoại", negative: 'I', "negativeName": "Hướng nội"},
          {code: 'N', name: "Trực giác", negative: 'S', "negativeName": "Cảm giác"},
          {code: 'T', name: "Lý trí", negative: 'F', "negativeName": "Tình cảm"},
          {code: 'J', name: "Nguyên tắc", negative: 'P', "negativeName": "Linh hoạt"}
        ],
        result: { score: [], personalType: ""},

        counted: false,
        counting: false,

        user: null,
        friendsList: [],
        error: false
      }
    },
    created(vm = this){


      this.unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
          if(user){
            vm.user = user;
            vm.initCount();
            vm.fetchData();

          } else {
            vm.user = null;
          }
      });

    },

    beforeDestroy() {
      this.unsubscribe();
    },
    firebase: {
      questionsArray: {
        source: firebase.database().ref('questions'),
        readyCallback(){
          this.loading = false;
        }
      }
    },
    methods: {
      compareSuit(a, b) {

        if (a.suit < b.suit)
          return 1;
        if (a.suit > b.suit)
          return -1;

        if (a.gender < b.gender){
          if(this.user.gender === 'male'){
            return -1;
          } else {
            return 1;
          }
        }

        if (a.gender > b.gender) {
          if(this.user.gender === 'male'){
            return 1;
          } else {
            return -1;
          }
        }

        return 0;
      },
      sortNow: function() {
        this.friendsList.sort(this.compareSuit);
      },
      fetchData(vm = this) {
        firebase.database().ref('answers').child(this.user.providerData[0].uid).once('value', function(snapshot) {
          vm.loading = false;
          if(snapshot.val()){
            vm.counting = true;

            vm.result = snapshot.val().result;
            vm.questionTypes.forEach((item, index) => {
              item.percent = vm.result.score[index].percent;
            })
            vm.counted = true;

          }
        });

        this.reCount();

      },
      initCount(){
        this.error = false;
        this.counted = false;
        this.counting = false;

        this.questionTypes.forEach(item => {
          this.score[item.code] = 0;
          this.actualScore[item.code] = 0;
        })
        this.questionsArray.forEach(item => {
          delete item.actualScore
        });
      },

      reCount(vm = this){

        firebase.database().ref('users').child(vm.user.uid).once('value', userSnap => {
          vm.user.gender = userSnap.val().gender;
        })
        firebase.database().ref('users').child(vm.user.uid).once('value', snap => {
          const userData = snap.val();
          FB.api(
              "/"+ vm.user.providerData[0].uid + "/friends?fields=name,gender&limit=5000",
              function (response) {
                // console.log(response);
                if (response && !response.error) {

                  // response.paging.next;
                  vm.friendsList = response.data;
                  vm.friendsList.forEach((friend, index) => {

                    friend.questionTypes = [
                      {code: 'E', name: "Hướng ngoại", negative: 'I', "negativeName": "Hướng nội"},
                      {code: 'N', name: "Trực giác", negative: 'S', "negativeName": "Cảm giác"},
                      {code: 'T', name: "Lý trí", negative: 'F', "negativeName": "Tình cảm"},
                      {code: 'J', name: "Nguyên tắc", negative: 'P', "negativeName": "Linh hoạt"}
                    ];
                    friend.result = {score: [], personalType: ""};
                    friend.suit = 0;

                    firebase.database().ref('users').orderByChild("uid").equalTo(friend.id).once('value', snap => {

                      if(!snap.val()){
                        if(index === vm.friendsList.length - 1){
                          vm.counting = false;
                          vm.sortNow();
                          vm.$forceUpdate();
                        }
                        return;
                      }

                      snap.forEach(friendSnap => {

                        friend.photoURL = friendSnap.val().photoURL;

                        firebase.database().ref('answers').child(friend.id).once('value', function(snapshot) {
                          vm.loading = false;

                          if(!snapshot.val()){
                            if(index === vm.friendsList.length - 1){
                              vm.counting = false;
                              vm.sortNow();
                              vm.$forceUpdate();
                            }
                            return;
                          }

                          friend.result = snapshot.val().result;
                          friend.questionTypes.forEach((item, index) => {
                            item.percent = friend.result.score[index].percent;
                          })

                          for (var i = 0; i < vm.result.personalType.length; i++) {
                            const item = vm.result.personalType[i];
                          }

                          let myType = vm.result.personalType;
                          let friendType = friend.result.personalType;

                          if(myType[0] !== friendType[0]){
                            friend.suit += 25;
                          }
                          if(myType[1] === friendType[1]){
                            friend.suit += 25;
                          }
                          if(myType[2] === friendType[2]){
                            friend.suit += 25;
                          }
                          if(myType[3] !== friendType[3]){
                            friend.suit += 25;
                          }

                          if(index === vm.friendsList.length - 1){
                            vm.counting = false;
                            vm.sortNow();
                            vm.$forceUpdate();
                          }

                        });

                      })
                    });

                    if(index === vm.friendsList.length - 1){
                      vm.counting = false;
                      vm.sortNow();
                      vm.$forceUpdate();
                    }

                  })

                }
              },
              {access_token: userData.accessToken}
          );
        })
      },

      submit(vm = this){

        vm.error = false;
        vm.counted = false;
        vm.counting = true;
        vm.friendsList = [];

        this.questionsArray.forEach(item => {
          if(item.score && item.type && item.actualScore){
            item.error = false;
          } else {
            this.done = false;
            item.error = true;
            this.error = true
          }
        });

        if(this.error){
          return;
        }

        this.questionsArray.forEach(item => {
          this.score[item.type] += Number(item.score);
          this.actualScore[item.type] += Number(item.actualScore);
        });

        this.counted = true;
        this.result = { score: [], personalType: ""};

        this.questionTypes.forEach((item, index) => {
          item.percent = Number((this.actualScore[item.code]*100/this.score[item.code]).toFixed(2));
          if(!item.percent){
            item.percent = 0;
          }

          if(item.percent > 50){
            this.result.personalType = this.result.personalType.slice(0, index) + item.code + this.result.personalType.slice(index);
          } else {
            this.result.personalType = this.result.personalType.slice(0, index) + item.negative + this.result.personalType.slice(index);
          }

          this.result.score.push({code: item.code, percent: item.percent});
        })

        vm.reCount();

        firebase.database().ref('answers').child(this.user.providerData[0].uid).update({
          displayName: this.user.displayName,
          email: this.user.email,
          result: this.result
        });

      }

    }
  }

</script>

<style lang="stylus">
  .addOption input, .addOption label{
    font-size 14px
  }
  .updateName input, .updateName label{
    font-size 20px
    font-weight bold
  }
  .updateDescription{
    margin-top: -20px
    margin-bottom: 10px
  }
  .updateDescription input, .updateDescription label{
    font-size 12px
    color #555555!important
  }

  .personalName{
    text-decoration none
    font-weight bold
    color #365899
    &:hover{
      text-decoration underline
    }
  }

  .input-group label{
    font-size inherit
    white-space pre-wrap
    overflow: inherit;
    line-height: inherit;
    height: inherit;
    margin-bottom: 10px
  }

  .input-group.input-group--selection-controls label{
    position relative
  }
  .input-group.input-group--append-icon label, .input-group.input-group--prepend-icon label, .input-group.input-group--selection-controls label{
    max-width: 95%
  }
  .input-group.input-group--selection-controls .input-group__input{
    position: absolute;
    top: -5px
  }
</style>
