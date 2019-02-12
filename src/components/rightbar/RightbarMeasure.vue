<template>
  <!-- Measure toggle bar start-->
  <!-- <div class="row justify-content-center m-2">
  <div class="class">-->
  <div class="row justify-content-center p-1 rightbar-menu-main rightbarmeasure">
    <div class="class col rightbar-menu">
      Measure : &ensp;
      <input
        v-model="selected"
        type="radio"
        name="measure"
        autocomplete="off"
        :value="yll"
        checked
      > YLL
      <input v-model="selected" type="radio" name="measure" autocomplete="off" :value="yld"> YLD
      <input v-model="selected" type="radio" name="measure" autocomplete="off" :value="daly"> DALY
      <input v-model="selected" type="radio" name="measure" autocomplete="off" :value="deaths">

       Deaths
    </div>
  </div>
  <!-- Measure toggle bar end-->
</template>

<script>
import { EventBus } from "../../event-bus";
import variables from "../../config.js";

export default {
  name: "RightbarMeasure",
  data() {
    return {
      selected: variables.yll,
      yll: variables.yll,
      yld: variables.yld,
      daly: variables.daly,
      deaths: variables.deaths
    };
  },
  methods: {
    sendFilter: function() {
      EventBus.$emit("filters", { value: this.selected, filter: "measure" });
      EventBus.$emit("diseasechange", this.selected);
    },
    reset: function() {
      this.selected = variables.yll;
    }
  },
  watch: {
    selected: function() {
      this.sendFilter();
    }
  },
  mounted() {
    EventBus.$on("reset", this.reset);
  }
};
</script>

