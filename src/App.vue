<template>
  <div class="container-fluid no-gutters main" style="overflow-x:hidden;background-color: #f7f7f7;">
    <d2headerBar></d2headerBar>
    <HeaderApp/>
    <div class="row" style="display: flex">
      <Leftbar/>
      <Loader/>
      <CenterContainer/>
      <Rightbar/>
    </div>
  </div>
</template>

<script>
// import DhisHeader from "./components/d2header/DhisHeader";
import HeaderApp from "./components/HeaderApp";
import Leftbar from "./components/Leftbar";
import Rightbar from "./components/rightbar/Rightbar";
import CenterContainer from "./components/centercontainer/CenterContainer";
import Loader from "./components/Loader";
import d2headerBar from 'dhis2-header-vue';
import clicks from './catch-clicks'

export default {
  name: "App",
  components: {
    d2headerBar,
    HeaderApp,
    Leftbar,
    Rightbar,
    CenterContainer,
    Loader
  },
  mounted(){
    clicks.setClassToCatchClicks("xaxis-labels");
  }
};
</script>
<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
  // @import './a';
</style>