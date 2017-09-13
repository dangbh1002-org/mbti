import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter);

let VueFire = require('vuefire');
Vue.use(VueFire);

import Vuetify from 'vuetify'
Vue.use(Vuetify);

const firebase = require('firebase');
var config = {
  apiKey: "AIzaSyAOXjAK3EmOLIrR9kgxuCeG6ba08cNv8fY",
  authDomain: "mbti-58335.firebaseapp.com",
  databaseURL: "https://mbti-58335.firebaseio.com",
  projectId: "mbti-58335",
  storageBucket: "mbti-58335.appspot.com",
  messagingSenderId: "644304821159"
};
firebase.initializeApp(config);

const Home = () => import(/* webpackChunkName: "home" */'./components/Home.vue');
const Admin = () => import(/* webpackChunkName: "Admin" */'./components/Admin.vue');

const routes = [
  {path: '/', component: Home},
  {path: '/admin', component: Admin}
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

const app = new Vue({
  router: router,
  data: {
    drawer: true,
    items: [
      {title: 'Home', icon: 'home', path: '/'},
      // {title: 'Admin', icon: 'dashboard', path: '/admin'}
    ],
    mini: false,
    right: null,
    user: null
  },

  created(vm = this){
    this.provider = new firebase.auth.FacebookAuthProvider();
    this.provider.setCustomParameters({
      'display': 'popup'
    });

    this.provider.addScope('user_friends');

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

  methods: {
    changePath(path) {
      router.push(path);
    },
    signIn(vm = this) {

      firebase.auth().signInWithPopup(this.provider).then(function(result) {

        const user = result.user;
        const accessToken = result.credential.accessToken;

        firebase.database().ref('users').child(user.uid).update({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          accessToken: accessToken,
          uid: user.providerData[0].uid,
          gender: result.additionalUserInfo.profile.gender
        });

        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    },
    signOut() {

      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
    }
  }
}).$mount('#app');
