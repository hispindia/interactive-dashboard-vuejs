<template>
  <!-- Age Dropdown start-->
      <div class="row justify-content-center p-1 rightbar-menu-main rightbarage hidediv">
        <div class="class col rightbar-menu">
            Age : &ensp; &ensp;
            <select
              class="age-button"
              id="dropdown-age"
              v-model="selected"
            >Select age group
              <option
                class="dropdown-item"
                v-for="age in agegroups"
                :value="age"
                :key="age"
              >{{age.text}}</option>
            </select>  
        </div>
      </div>
    

  <!-- Age Dropdown end-->
</template>

<script>
import { EventBus } from "../../event-bus";
import data from "../../config.js";

export default {
  name: "RightbarAge",
  data() {
    return {
      agegroups: [
        // { text: "Select Age" , id : "select"},
        { text: "All" , id : data.age_main_var},
        { text: "0-4" , id : data.age_0_4_id},
        { text: "5-14" , id : data.age_5_14_id},
        { text: "15-29" , id : data.age_15_29_id},
        { text: "30-49" , id : data.age_30_49_id},
        { text: "50-59" , id : data.age_50_59_id},
        { text: "60-69" , id : data.age_60_69_id},
        { text: "70-79" , id : data.age_70_79_id},
        { text: "80 and above" , id : data.age_above80_id}
      ],
      selected: { text: "All" , id : data.age_main_var}
    };
  },
  methods :{
    sendFilter : function(){
      EventBus.$emit("filters", {value : this.selected.id, filter:"age"});
    },
    reset : function(){
      this.selected = { text: "All" , id : data.age_main_var}
    }
  },
  watch : {
    selected : function(val){
      this.sendFilter();
    }
  },
  mounted() {
    EventBus.$on("reset", this.reset);
  }
};
</script>
