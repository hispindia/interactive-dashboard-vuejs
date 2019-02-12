<template>
  <!-- Units toggle bar start-->
  <!-- <div class="row justify-content-center m-2">
    <div class="class"> -->
      <div class="row justify-content-center p-1 rightbarunit rightbar-menu-main">
        <div class="class col rightbar-menu">
            Unit : &ensp; &ensp;
             <input
                v-model="selected"
                type="radio"
                name="units"
                autocomplete="off"
                value="count"
                class="countunit"
                checked
              > Count
              <input
                v-model="selected"
                type="radio"
                name="units"
                class="rateunit"
                autocomplete="off"
                value="rate"
              > Rate
              <input
                v-model="selected"
                type="radio"
                name="units"
                class="percentunit"
                autocomplete="off"
                value="percent"
              > % age
        </div>
      </div>
   
  <!-- Units toggle bar end-->
</template>
<script>
import { EventBus } from "../../event-bus";
import variables from "../../config.js";

export default {
  name: "RightbarUnits",
  data() {
    return {
      selected: "count"
    };
  },
  methods : {
    sendChart : function(){
     if(this.selected == "percent") EventBus.$emit("chartChange", "percent");
     else if(this.selected == "count") EventBus.$emit("chartChange" , "count");
     else { EventBus.$emit("chartChange" , "rate"); }
    },
    reset : function(){
      this.selected = 'count'
    }
  },
  watch : {
    selected : function(){
      this.sendChart();
    }
  },
  mounted(){
    EventBus.$on("reset", this.reset);
  }
};
</script>