<template>
  <!-- Site toggle bar start-->
  <!-- <div class="row justify-content-center m-2">
    <div class="class"> -->
      <div class="row justify-content-center p-1 rightbar-menu-main rightbarsite">
        <div class="class rightbar-menu">
            Site : &ensp; &ensp; &ensp;
             <input
                v-model="selected"
                type="radio"
                name="site"
                autocomplete="off"
                :value="urban"
              > Urban
              <input
                v-model="selected"
                type="radio"
                name="site"
                autocomplete="off"
                :value="rural"
              > Rural
              <input
                v-model="selected"
                type="radio"
                name="site"
                autocomplete="off"
                :value="both"
              > Both
        </div>
      </div>

  <!-- Site toggle bar end-->
</template>
<script>
import { EventBus } from "../../event-bus";
import variables from "../../config.js";

export default {
  name: "RightbarSite",
  data() {
    return {
      selected: variables.site_main_var,
      urban : variables.site_urban_id,
      rural : variables.site_rural_id,
      both : variables.site_main_var
    };
  },
  methods :{
    sendFilter : function(){
      EventBus.$emit("filters", {value : this.selected, filter:"site"});
    },
    reset : function(){
      this.selected = "Both-GkHE9YVFkpE;Vl6ZLaCt2mW"
    }
  },
  watch : {
    selected : function(){
      this.sendFilter();
    }
  },
  mounted() {
    EventBus.$on("reset", this.reset);
  }
};
</script>
