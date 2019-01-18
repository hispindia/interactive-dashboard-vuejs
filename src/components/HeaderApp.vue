<template>
  <div class="row">
    <div id="headerapp" class="col text-left p-2 m-0"><i class="material-icons header-icons" @click="goToDashboard">home</i></div>
    <div id="headerapp" class="col text-center p-2 m-0">{{heading}}</div>
    <div id="headerapp" class="col text-right p-2 m-0"><i class="material-icons header-icons">sync</i><i class="material-icons header-icons">settings</i></div>
  </div>
</template>

<script>

export default {
  name: "HeaderApp",
  data() {
    return {
      heading: "Interactive Dashboard",
      dashboard : "dhis-web-dashboard"
    };
  },
  methods:{
    goToDashboard : function(){
      window.location.href = "../../../" + this.dashboard;
    }
  }
};
</script>
<style scoped>
.header-icons {
  padding:5px;
  font-size: 36px;
  cursor: pointer;
}
</style>