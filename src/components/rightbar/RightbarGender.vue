<template>
  <!-- Gender toggle bar start-->
  
      <div class="row justify-content-center p-1 rightbar-menu-main rightbargender">
        <div class="class rightbar-menu">
            Gender : &ensp;
            <input
              class="btn btn-secondary active"
              v-model="selected"
              type="radio"
              :value="male"
              autocomplete="off"
            >Male
  
            <input
            class="btn btn-secondary"
              v-model="selected"
              type="radio"
              :value="female"
              autocomplete="off"
            >Female
            
            <input
                v-model="selected"
                class="btn btn-secondary"
                type="radio"
                :value="both"
                autocomplete="off"
              >Both
           
        </div>
      </div>
</template>

<script>
import { EventBus } from "../../event-bus";
import variables from "../../config.js";

export default {
  name: "RightbarGender",
  data() {
    return {
      selected: variables.gender_main_var,
      male : variables.gender_male_id,
      female : variables.gender_female_id,
      both : variables.gender_main_var,
    };
  },
  methods :{
    sendFilter : function(){
      EventBus.$emit("filters", {value : this.selected, filter:"gender"});
    },
    reset : function(){
      this.selected = this.both
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