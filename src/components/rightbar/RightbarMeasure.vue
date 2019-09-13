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
      <input v-model="selected" type="radio" name="measure" autocomplete="off" :value="deaths">Deaths
      <input v-model="selected" type="radio" class="population_class" name="measure" autocomplete="off" :value="population">Population
    </div>
  </div>
  <!-- Measure toggle bar end-->
</template>

<script>
    import { EventBus } from "../../event-bus";
    import variables from "../../config.js";
import { log } from 'util';

    export default {
        name: "RightbarMeasure",
        data() {
            return {
                selected: variables.yll,
                yll: variables.yll,
                yld: variables.yld,
                daly: variables.daly,
                deaths: variables.deaths,
                population: "gNaskBzw5Nq",
                selectedOuName:"",
                chartType: "stackChart"
            };
        },
        methods: {
            sendFilter: function() {
                EventBus.$emit("filters", { value: this.selected, filter: "measure" });
                EventBus.$emit("diseasechange",  this.selected);
                EventBus.$emit("typechange", this.selected);
            },
            reset: function(param) {
                this.selected = variables.yll;
                this.chartType = param;
                this.handleRightBar(this.chartType);
            },
            handleRightBar: function(param) {
                switch (param) {
                    case "stackChart":
                        $(".population_class").removeAttr("disabled");
                        break;
                    case "mapChart":
                        $(".population_class").attr("disabled", "disabled");
                        break;
                    case "pointChart":
                        $(".population_class").attr("disabled", "disabled");
                        break;
                    case "pieChart":
                        $(".population_class").attr("disabled", "disabled");
                        break;
                    case "treeChart":
                        $(".population_class").attr("disabled", "disabled");
                        break;
                    case "heatChart":
                        $(".population_class").attr("disabled", "disabled");
                        $(".rightbarunit").addClass("hidediv");
                        break;
                    default:
                        break;
                }
            }
        },
        watch: {
            selected: function() {
                this.handleRightBar(this.chartType);
                $(".rightbarunit").addClass("hidediv");
                this.sendFilter();
            }
            
        },
        mounted() {
            EventBus.$on("reset", this.reset);
            this.reset(this.chartType);
            this.handleRightBar(this.chartType);
        },
        getOuName: function(ou) {
            axios
                .get("../../organisationUnits/" + ou + ".json?fields=displayName,id")
                .then(response => {
                    this.selectedOuName = response.data.displayName;
                })
                .catch(error => {
                    console.log(error);
                });
        },
    };
</script>

