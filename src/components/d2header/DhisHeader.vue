<template>
  <div class="row" id="d2-header">
    <div class="header-with-logotext">
      <div class="header-with-logolink">
        <a @click="goToDashboard" class="ui_defaults_reset_fe0yv">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 182" class="logo">
            <defs></defs>
            <path
              fill="#fff"
              d="M191.73,60,109,6.34a19.73,19.73,0,0,0-20.32,0L8.31,58.43a12,12,0,0,0-.25,20.63L88.6,134a19.37,19.37,0,0,0,20.37.25l82.76-53.65a11.88,11.88,0,0,0,0-20.59Zm-91,61.45a4.29,4.29,0,0,1-3.49-.05l-77-52.49L97,19.13a4.76,4.76,0,0,1,3.74,0L179.6,70.28Z"
            ></path>
            <path
              fill="#fff"
              d="M88.66,47.82,45.1,76.06l13.61,9.33L97,60.61a4.76,4.76,0,0,1,3.74,0l39.37,25.52,14-9.06L109,47.82A19.76,19.76,0,0,0,88.66,47.82Z"
            ></path>
            <path
              fill="#fff"
              d="M191.73,101.46l-8.62-5.59-14.05,9.06,10.53,6.83-78.91,51.15a4.37,4.37,0,0,1-3.49,0l-77-52.5,10-6.47L16.55,94.57,8.31,99.91a12,12,0,0,0-.25,20.63L88.6,175.46a19.34,19.34,0,0,0,20.37.24l82.75-53.65a11.88,11.88,0,0,0,0-20.59Z"
            ></path>
          </svg>
        </a>
      </div>
      <div class="header-heading">{{heading}}</div>
    </div>
    <div class="header-with-rightbarlinks">
      <div class="rightbarlinks-inner">
        <div class="rightbarlinks">
          <i class="material-icons" @click="goToInterpretations">message</i>
        </div>
        <div class="rightbarlinks">
          <i class="material-icons" @click="goToMessages">email</i>
        </div>
        <div class="rightbarlinks">
          <i id="icon-app" class="material-icons" @click="menuHidden = !menuHidden">apps</i>
        </div>
        <div class="rightbarlinkss">
          <div id="icon-profile" class="header-profile" @click="hidden = !hidden">{{profileInitials}}</div>
        </div>
      </div>

      <div class="menubox-outer" v-if="!menuHidden">
        <div class="menubox-inner">
          <div class="menubox-search">
            <div class="menubox-search-outer">
              <div class="menubox-search-inner">
                <label class="menubox-search-label" v-bind:class="{ searchlabeltranslate: addSearchClass}">Search apps</label>
                <input class="menubox-search-textbox" v-model="searchme" type="text" @click="addSearchClass = !addSearchClass">
                <div class="menubox-search-cancel">
                  <i class="material-icons cancel-icon" @click="addSearchClass = !addSearchClass;searchme=''">cancel</i>
                </div>
              </div>
            </div>
            <i class="material-icons settings-icon" @click="goToAppManagement">settings</i>
          </div>
          <div class="menubox-appsbox">
            <div
              class="row menubox-appsbox-rows"
              v-for="i in Math.ceil(menuArray.length / 3)"
              :value="i"
              :key="i"
            >
              <a
                :href="'../../' + menu.defaultAction"
                class="menubox-app-link"
                v-for="menu in menuArray.slice((i - 1) * 3, i * 3)"
                :value="menu"
                :key="menu"
              >
                <img :src="getImgUrl(menu.icon)" alt="app logo" class="menubox-app-logo">
                <div
                  class="menubox-app-label"
                >{{menu.displayName != "" ? menu.displayName : menu.name}}</div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-box" v-if="!hidden">
        <div class="profile-box-inner">
          <div class="profilebox-upper">
            <div class="profilebox-upper-left">
              <div class>{{profileInitials}}</div>
            </div>
            <div class="profilebox-upper-right">
              <div class="profilename">{{profileName}}</div>
              <div class="profilemail">{{profieEmail}}</div>
              <a class="editprofile" href="../../../dhis-web-user-profile/#/profile">Edit profile</a>
            </div>
          </div>
          <div class style="margin: 13px 0px 7px;border-top:1px solid lightgrey"></div>
          <ul class="profile-links">
            <li class="profile-links-list">
              <i class="material-icons profile-links-list-content">settings</i>
              <a
                class="profile-links-list-content"
                href="../../../dhis-web-user-profile/#/settings"
              >Settings</a>
            </li>
            <li class="profile-links-list">
              <i class="material-icons profile-links-list-content">account_box</i>
              <a
                class="profile-links-list-content"
                href="../../../dhis-web-user-profile/#/account"
              >Account</a>
            </li>
            <li class="profile-links-list">
              <i class="material-icons profile-links-list-content">help</i>
              <a
                class="profile-links-list-content"
                href="https://docs.dhis2.org/master/en/user/html/dhis2_user_manual_en.html"
              >Help</a>
            </li>
            <li class="profile-links-list">
              <i class="material-icons profile-links-list-content">exit_to_app</i>
              <a
                class="profile-links-list-content"
                href="../../../dhis-web-commons/security/login.action"
              >Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DhisHeader",
  data() {
    return {
      heading: "",
      profileApi: "me",
      dashboard: "dhis-web-dashboard",
      interpretations: "dhis-web-interpretation",
      messages: "dhis-web-messaging",
      systemSettings: "systemSettings",
      installedApps: "dhis-web-commons/menu/getModules.action",
      appManagement : "",
      hidden: true,
      menuHidden: true,
      profileName: "",
      profieEmail: "",
      profileInitials: "",
      menuArray: [],
      tempArray:[],
      searchme:"",
      addSearchClass:false
    };
  },
  methods: {
    findApplicationTitle: function() {
      axios
        .get("../../" + this.systemSettings + ".json?key=applicationTitle")
        .then(response => {
          this.heading = response.data.applicationTitle;
        });
    },
    findProfileDetails: function() {
      axios.get("../../" + this.profileApi + ".json").then(response => {
        this.profileName = response.data.displayName;
        response.data.email !== undefined
          ? (this.profieEmail = response.data.email)
          : (this.profieEmail = "Not provided");
        this.profileInitials =
          this.profileName
            .split(" ")[0]
            .substring(0, 1)
            .toUpperCase() +
          this.profileName
            .split(" ")[1]
            .substring(0, 1)
            .toUpperCase();
      });
    },
    findApps: function() {
      axios.get("../../../" + this.installedApps).then(response => {
        var vm = this;
        for (let i = 0; i < response.data.modules.length; i++) {
          if (response.data.modules[i].name != "dhis-web-menu-management") {
            vm.menuArray.push({
              displayName: response.data.modules[i].displayName,
              name: response.data.modules[i].name,
              icon: response.data.modules[i].icon,
              defaultAction : response.data.modules[i].defaultAction
            });
            vm.tempArray = [...vm.menuArray];
          }
          else{
              this.appManagement = response.data.modules[i].defaultAction;
          }
        }
      });
    },
    getImgUrl: function(path) {
      return "../../" + path;
    },
    goToDashboard: function() {
      window.location.href = "../../../" + this.dashboard;
    },
    goToInterpretations: function() {
      window.location.href = "../../../" + this.interpretations;
    },
    goToMessages: function() {
      window.location.href = "../../../" + this.messages;
    },
    goToAppManagement: function(){
        window.location.href = "../../" + this.appManagement;
    },
    handleClicks: function(vm){
        // console.log(vm);
        if(vm.target.id=="icon-app" || vm.target.className.includes('menubox')){
            this.menuHidden = false;
        }
        else{this.menuHidden = true;}

        if(vm.target.id=="icon-profile" || vm.target.className.includes('profile')){
            this.hidden = false;
        }
        else{this.hidden = true;}
    }
  },
  mounted() {
    this.findApplicationTitle();
    this.findProfileDetails();
    this.findApps();
    document.addEventListener('click', this.handleClicks, document)
  },
  beforeDestroy(){
      document.removeEventListener('click', this.handleClicks)
  },
  watch:{
      searchme: function(v){
        //   this.temp = [...this.menuArray];
       this.menuArray =  this.tempArray.filter(function(menu){
           if(menu.displayName!=""){
               if(menu.displayName.toLowerCase().includes(v))return menu;
           }
           else{
               if(menu.name.toLowerCase().includes(v))return menu;
           }
       });
      }
  }
};
</script>
<style scoped>
#d2-header {
  height: 50px;
  background: rgb(39, 102, 150);
}
.header-with-logolink {
  border-right: 1px solid gray;
  padding: 5px;
  width: 50px;
  height: 45px;
}
.header-with-logotext {
  display: flex;
  width: 50%;
}
.logo {
  width: 35px;
  height: 35px;
}
.header-heading {
  padding: 8px;
  color: white;
  font-size: 18px;
  padding-left: 30px;
}
.header-with-rightbarlinks {
  width: 50%;
}
.header-profile {
  border-radius: 50%;
  width: 35px;
  color: white;
  height: 35px;
  padding: 5 6;
  background-color: rgba(0, 0, 0, 0.3);
}
.rightbarlinks {
  margin: auto 0.8rem;
  color: #fff;
  display: inline-block;
  vertical-align: -webkit-baseline-middle;
  text-align: -webkit-center;
  cursor: pointer;
}
.rightbarlinkss {
  margin-right: 15px;
  display: inline-block;
  margin-left: 15px;
  cursor: pointer;
  vertical-align: -webkit-baseline-middle;
}
.rightbarlinks-inner {
  width: fit-content;
  float: right;
  margin: 0 20px;
  padding: 6px;
}
i {
  font-size: 26px !important;
}
.profile-box {
  z-index: 999;
  position: relative;
  top: 45px;
}
.profile-box-inner {
  width: 50%;
  right: 40;
  position: absolute;
  background: white;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14), 0 2px 2px 0 rgba(0, 0, 0, 0.12),
    0 1px 3px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  transition: all 1s;
}
.profilebox-upper-right {
  display: inline-block;
  margin: 10px 15px;
}
.profilebox-upper-left {
  display: inline-block;
  margin: 15px 20px;
  vertical-align: top;
  width: 50px;
  font-size: 20px;
  padding: 10px 12px;
  height: 50px;
  background: lightgray;
  border-radius: 50%;
}
.editprofile {
  color: #007bff;
  font-size: 12px;
  text-decoration: underline;
  background-color: transparent;
}
.profilemail {
  font-size: 14px;
}
.profilename {
  font-weight: 600;
}

ul.profile-links {
  list-style: none;
  padding: 0;
}

ul.profile-links li {
  display: flex;
  padding: 12px;
}

ul.profile-links li:hover {
  background: #f7f7f7;
  cursor: pointer;
}
.profile-links-list-content {
  margin: 0 10px;
}
.menubox-outer {
  width: 100%;
  position: relative;
  top: 45;
}
.menubox-inner {
  background: #fff;
  position: absolute;
  z-index: 99;
  float: right;
  width: 65%;
  max-height: 380px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14), 0 2px 2px 0 rgba(0, 0, 0, 0.12),
    0 1px 3px 0 rgba(0, 0, 0, 0.2);
  right: 100;
  overflow: scroll;
  border-radius: 2px;
}
.row.menubox-appsbox-rows {
  margin: 0;
  padding: 10px;
  text-align: center;
}
a.menubox-app-link {
  display: inline-block;
  width: 33%;
  padding: 7px;
  color: black;
  font-size: 14px;
  font-family: roboto;
}
a.menubox-app-link:hover {
  background-color: f7f7f7;
  text-decoration: none;
}
.menubox-app-logo {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-style: none;
}
.menubox-app-label {
  margin-top: 8px;
}
.menubox-search {
  display: inline-flex;
  width: 100%;
  padding-top: 10px;
}
.settings-icon{
    color: lightgray;
    margin: 7px 4px;
    cursor: pointer;
}
.menubox-search-textbox{
        border: none;
    background: transparent;
    width: 80%;
    margin: 0;
    padding: 5px;
    position: absolute;
}
.menubox-search-outer{
        width: 90%;
}
.menubox-search-inner{
        display: flex;
    width: 95%;
    padding: 5px;
    border-radius: 7px;
    margin: 0 10px;
    background: #f7f7f7;
    border-bottom: 2px solid lightgray;
}
.searchlabeltranslate{
    transform: translate(-5px, -10px) scale(0.75);
}
.menubox-search-label{
    color:lightgray;
}
.menubox-search-cancel{
        position: relative;
    left: 70%;
    cursor: pointer;
}
input.menubox-search-textbox:focus{
    outline:none;
}
</style>