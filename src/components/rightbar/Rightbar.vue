<template>
  <div id="rightbar" class="col-2 fixed-right collapse-div">
    <div class="row justify-content-start">
      <div class="class">
        <i class="material-icons" id="rightbar-icon" v-on:click="slideRight">menu</i>
      </div>
    </div>
    <RightbarMeasure/>
    <!-- <br> -->
    <RightbarDisease/>
    <!-- <br> -->
    <RightbarGender/>
    <!-- <br> -->
    <RightbarSite/>
    <!-- <br> -->
    <RightbarUnits/>
    <!-- <br> -->
    <RightbarAge/>
  </div>
</template>

<script>
import RightbarAge from "./RightbarAge";
import RightbarGender from "./RightbarGender";
import RightbarMeasure from "./RightbarMeasure";
import RightbarSite from "./RightbarSite";
import RightbarUnits from "./RightbarUnits";
import RightbarDisease from "./RightbarDisease";

export default {
  name: "Rightbar",
  methods: {
    slideRight: function() {
      $("#rightbar").toggleClass("collapse-div");
    }
  },
  components: {
    RightbarAge,
    RightbarGender,
    RightbarMeasure,
    RightbarSite,
    RightbarUnits,
    RightbarDisease
  }
};
</script>