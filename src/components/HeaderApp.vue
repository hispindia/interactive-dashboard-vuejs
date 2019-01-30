<template>
  <div class="row">
    <div id="headerapp" class="col text-left p-2 m-0"></div>
    <div id="headerapp" class="col text-center p-2 m-0">{{heading}}</div>
    <div id="headerapp" class="col text-right p-2 m-0"></div>
  </div>
</template>

<script>

export default {
  name: "HeaderApp",
  data() {
    return {
      heading: "Analytics tool",
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
  padding:2px;
  font-size: 25px;
  cursor: pointer;
}
</style>