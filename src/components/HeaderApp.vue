<template>
  <div class="row">
    <div id="headerapp" class="col-2 text-left p-2 m-0"></div>
    <div id="headerapp" class="col-8 text-center p-2 m-0">{{heading}}</div>
    <div id="headerapp" class="col-2 text-right p-2 m-0"></div>
  </div>
</template>

<script>

export default {
  name: "HeaderApp",
  data() {
    return {
      heading: "ICMR NBE Analytical and Visualization tool",
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