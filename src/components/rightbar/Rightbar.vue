<template>
  <div id="rightbar" class="col-2 fixed-right collapse-div">
    <div class="row justify-content-end">
      <div class="class">
        <i class="material-icons" id="rightbar-icon" v-on:click="slideRight">menu</i>
      </div>
    </div>
    <RightbarMeasure/>
    <!-- <br> -->
    <RightbarDisease v-if= " chartType != 'heatChart' " />
    <!-- <br> -->
    <RightbarAge v-if= " chartType != 'mapChart' && chartType != 'heatChart'"/>
    <!-- <br> -->
    <RightbarGender v-if= " chartType != 'mapChart' && chartType != 'heatChart'"/>
    <!-- <br> -->
    <RightbarSite v-if= " chartType != 'mapChart' && chartType != 'heatChart'"/>
    <!-- <br> -->
    <RightbarUnits v-if= " chartType != 'heatChart' && chartType != 'pieChart'"/>
    <!-- <br> -->
  </div>
</template>

<script>
    import RightbarAge from "./RightbarAge";
    import RightbarGender from "./RightbarGender";
    import RightbarMeasure from "./RightbarMeasure";
    import RightbarSite from "./RightbarSite";
    import RightbarUnits from "./RightbarUnits";
    import RightbarDisease from "./RightbarDisease";
    import { EventBus } from "../../event-bus";

    export default {
        name: "Rightbar",
        data() {
            return {
                chartType: "stackChart"
            };
        },
        mounted(){
            EventBus.$on("reset", this.reset);
        },
        methods: {
            slideRight: function() {
                $("#rightbar").toggleClass("collapse-div");
            },
            reset : function(param){
                this.chartType = param;
            },
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