<template>
  <v-container fluid v-if="user">
    <v-card v-for="(question, index) in anArray" :key="question['.key']" style="margin-bottom: 20px; border-left: 5px solid #3b5998">
      <v-card-text>
        <v-container fluid>
          <v-layout row>
            <v-flex x6>
              <v-text-field
                class="updateName"
                :label="'Question ' + (index + 1)"
                single-line
                hide-details
                v-model="question.title"
                @change="updateQuestion(question)"
              ></v-text-field>
            </v-flex>

            <v-flex xs1></v-flex>

            <v-flex xs2>
              <v-text-field
                label="Question Score"
                single-line
                hide-details
                type="number"
                v-model="question.score"
                @change="updateQuestion(question)"
              ></v-text-field>
            </v-flex>

            <v-flex xs1></v-flex>

            <v-flex xs2>
              <v-select
                :items="questionTypes"
                v-model="question.type"
                label="Question Type"
                item-text="code"
                item-value="code"
                single-line
                bottom
                @change="updateQuestion(question)"
              ></v-select>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-text-field
                class="updateDescription"
                :label="'Description ' + (index + 1)"
                single-line
                hide-details
                v-model="question.description"
                @change="updateQuestion(question)"
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row v-for="(option, index2) in question.options" :key="option['.key']">
            <v-flex xs8>
              <v-text-field
                class="addOption"
                :ref="'question' + index + 'option' + index2"
                :label="'Option ' + (index2 + 1)"
                single-line
                hide-details
                v-model="option.label"
                @change="updateOption(question)"
                :append-icon="'close'"
                :append-icon-cb="() => deleteOption(question, index2)"
              ></v-text-field>
            </v-flex>
            <v-flex xs1>
            </v-flex>

            <v-flex xs3>
              <v-text-field
                class="addOption"
                :ref="'question' + index + 'option' + index2"
                :label="'Option ' + (index2 + 1)"
                single-line
                hide-details
                type="number"
                v-model="option.score"
                @change="updateOption(question)"
              ></v-text-field>
            </v-flex>

          </v-layout>

          <v-layout row>
            <v-flex xs2>
              <v-text-field class="addOption"
                label="Add option"
                single-line
                hide-details
                @focus="addOption(question, index)"
              ></v-text-field>
            </v-flex>
          </v-layout>

        </v-container>
      </v-card-text>
      <v-card-actions style="border-top: 1px solid #e0e0e0; margin-left: 32px; padding: 10px">

        <v-layout row>
          <v-flex align-end>
            <v-btn icon style="float: right" @click="deleteQuestion(question)">
              <v-icon>delete</v-icon>
            </v-btn>
            <v-btn icon style="float: right" @click="duplicateQuestion(question)">
              <v-icon>content_copy</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>

      </v-card-actions>
    </v-card>

    <v-btn class="success" type="submit" @click="addQuestion()">Add question</v-btn>


  </v-container>


</template>

<script>

  let firebase = require('firebase');

  export default {

    created(vm = this){
      this.loading = true;
      this.unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
          if(user){
            vm.user = user;
          } else {
            vm.user = null;
          }
      });
    },
    beforeDestroy() {
      this.unsubscribe();
    },

    data() {
      return {
        loading: false,
        anArray: [],
        questionTypes: [
          {code: 'E', name: "Hướng ngoại", negative: 'I', "negativeName": "Hướng nội"},
          {code: 'N', name: "Trực giác", negative: 'S', "negativeName": "Cảm giác"},
          {code: 'T', name: "Lý trí", negative: 'F', "negativeName": "Tình cảm"},
          {code: 'J', name: "Nguyên tắc", negative: 'P', "negativeName": "Linh hoạt"}
        ],
        user: null
        // search: ''
      }
    },

    firebase: {
      anArray: {
        source: firebase.database().ref('questions'),
        readyCallback(){
          this.loading = false;
        }
      }
    },


    methods: {

      addQuestion(){
        firebase.database().ref('questions').push({
          title: "Question " + (this.anArray.length + 1),
          type: "E",
          score: "0",
          description: "Description " + (this.anArray.length + 1),
          options: [
            { label: "Option 1", score: "0"}
          ]
        })
      },

      updateQuestion(question){

        setTimeout(() => {
          firebase.database().ref('questions').child(question[".key"]).update({
            title: question.title,
            type: question.type,
            score: question.score,
            description: question.description
          })
        })

      },

      deleteQuestion(question){
        firebase.database().ref('questions').child(question[".key"]).remove();
      },
      duplicateQuestion(question, index){
        var newQuestion = Object.assign({}, question);
        delete newQuestion[".key"];
        firebase.database().ref('questions').push(newQuestion);
      },

      addOption(question, index, vm=this){
        if(question.options){
          question.options.push({
            label: "Option " + (question.options.length + 1),
            score: "0"
          })

        } else {
          question.options = [{
            label: "Option 1",
            score: "0"
          }];
        }

        firebase.database().ref('questions').child(question[".key"]).update({
          options: question.options
        }).then(_ => {
          vm.$refs['question'+index+'option'+(question.options.length - 1)][0].$refs.input.select();
        })

      },
      deleteOption(question, index){
        question.options.splice(index, 1)
        this.updateOption(question);
      },
      updateOption(question){
        firebase.database().ref('questions').child(question[".key"]).update({
          options: question.options
        })
      },


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
  margin-top: -40px
  margin-bottom: 10px
}
.updateDescription input, .updateDescription label{
  font-size 12px
  color #555555!important
}

</style>
