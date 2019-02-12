<template>
  <!-- Disease Dropdown start-->
  <div class="row justify-content-center p-1 rightbar-menu-main rightbardisease">
    <div class="class col rightbar-menu">
      Diseases : &ensp; &ensp;
      <select
        class="disease-button"
        id="dropdown-disease"
        v-model="selected"
      >Select diseases
        <option class="dropdown-item" v-for="d in diseases" :value="d" :key="d">{{d.text}}</option>
      </select>
    </div>
  </div>

  <!-- Disease Dropdown end-->
</template>

<script>
import { EventBus } from "../../event-bus";
import variables from "../../config.js";

export default {
  name: "RightbarDisease",
  data() {
    return {
      diseases: [],
      diseasesTemp: [{id:'',text:'Select/unselect disease',value:''}],
      selected : {id:'',text:'Select/unselect disease',value:''}
    };
  },
  methods: {
    reset : function(){
      this.selected = {id:'',text:'Select/unselect disease',value:''}
    },
    sendFilter: function() {
      EventBus.$emit("filters", { value: this.selected, filter: "disease" });
    },
    changeDropDown: function(m) {
      this.diseases = [...this.diseasesTemp];
      if (m == variables.yll) {
        for (
          var i = 0;
          i < Object.keys(variables.diseases_yll[0]).length;
          i++
        ) {
          this.diseases.push({
            text:
              variables.diseases_yll[0][
                Object.keys(variables.diseases_yll[0])[i]
              ].name,
            id: Object.keys(variables.diseases_yll[0])[i],
            value:
              variables.diseases_yll[0][
                Object.keys(variables.diseases_yll[0])[i]
              ]
          });
        }
      } else if (m == variables.yld) {
        for (
          var i = 0;
          i < Object.keys(variables.diseases_yld[0]).length;
          i++
        ) {
          this.diseases.push({
            text:
              variables.diseases_yld[0][
                Object.keys(variables.diseases_yld[0])[i]
              ].name,
            id: Object.keys(variables.diseases_yld[0])[i],
            value:
              variables.diseases_yld[0][
                Object.keys(variables.diseases_yld[0])[i]
              ]
          });
        }
      } else if (m == variables.daly) {
        for (
          var i = 0;
          i < Object.keys(variables.diseases_daly[0]).length;
          i++
        ) {
          this.diseases.push({
            text:
              variables.diseases_daly[0][
                Object.keys(variables.diseases_daly[0])[i]
              ].name,
            id: Object.keys(variables.diseases_daly[0])[i],
            value:
              variables.diseases_daly[0][
                Object.keys(variables.diseases_daly[0])[i]
              ]
          });
        }
      } else {
        for (
          var i = 0;
          i < Object.keys(variables.diseases_deaths[0]).length;
          i++
        ) {
          this.diseases.push({
            text:
              variables.diseases_deaths[0][
                Object.keys(variables.diseases_deaths[0])[i]
              ].name,
            id: Object.keys(variables.diseases_deaths[0])[i],
            value:
              variables.diseases_deaths[0][
                Object.keys(variables.diseases_deaths[0])[i]
              ]
          });
        }
      }
    }
  },
  watch: {
    selected: function(val) {
      this.sendFilter();
    }
  },
  mounted() {
    this.changeDropDown(variables.yll);
    EventBus.$on("diseasechange", this.changeDropDown);
    EventBus.$on("reset", this.reset);
  }
};
</script>
<style scoped>
.disease-button {
  max-width: -webkit-fill-available;
}
</style>