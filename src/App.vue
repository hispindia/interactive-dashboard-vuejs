<template>
  <div class="container-fluid no-gutters main" style="overflow-x:hidden;background-color: #FFF3E0;">
    <DhisHeader/>
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
import DhisHeader from "./components/d2header/DhisHeader";
import HeaderApp from "./components/HeaderApp";
import Leftbar from "./components/Leftbar";
import Rightbar from "./components/rightbar/Rightbar";
import CenterContainer from "./components/centercontainer/CenterContainer";
import Loader from "./components/Loader";

export default {
  name: "App",
  components: {
    DhisHeader,
    HeaderApp,
    Leftbar,
    Rightbar,
    CenterContainer,
    Loader
  }
};
</script>
<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
  // @import './a';
</style>