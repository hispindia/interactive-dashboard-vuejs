<template>
  <!-- import { watch } from 'fs'; -->
  <div id="leftbar" class="col-2 fixed-left collapse-div">
    <div class="row justify-content-end">
      <div class="class">
        <i class="material-icons" id="leftbar-icon" v-on:click="slideLeft">menu</i>
      </div>
    </div>
    <div class="row justify-content-center p-1 leftbar-menu-main">
      <div class="col class selectedou" v-bind:id="selectedOu">{{selectedOuName}}</div>
    </div>
    <div class="row justify-content-center p-1 leftbar-menu-main">
      <div class="col class outree">
        <div id="orgUnitTree" v-on:click="handleClicks">
          <ul></ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import mapData from "./highcharts/MapChart";
import { EventBus } from "../event-bus";
import variables from "../config";
import Highcharts from "highcharts";
import { setTimeout } from "timers";

export default {
  name: "Leftbar",
    data() {
    return {
      selectedOu: "",
      selectedOuName: "",
      previousou: "",
      switch: true,
      baseOu : "",
    };
  },
  methods: {
    slideLeft: function() {
      $("#leftbar").toggleClass("collapse-div");
    },
    getOU: function() {
      selection.load();
      this.selectedOu = selection.getSelected();
      if(this.selectedOu.length == 0)this.getBaseOu();
      else{
        this.getOuName(this.selectedOu);
      }
    },
    handleClicks: function(event) {
      var tagid = event.path[1].id;
      this.selectedOu = tagid.split("orgUnit")[1];
      if (this.selectedOu !== undefined) {
        this.selectedOuName = this.getOuName(this.selectedOu);
        if (this.selectedOu == variables.indiaOuId)
          $(".rightbarsite").removeClass("hidediv");
        else {
          $(".rightbarsite").addClass("hidediv");
        }
        EventBus.$emit("ou-changed", {
          ou: this.selectedOu,
          type: "age"
        });
        $("#" + tagid).toggleClass("selected-org-unit");
        if (this.previousou != "")
          $("#" + this.previousou).toggleClass("selected-org-unit");
        this.previousou = tagid;
      }
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
    getBaseOu: function(ou) {
      axios
        .get("../../me.json?fields=organisationUnits[id,name]")
        .then(response => {
          this.selectedOu = response.data.organisationUnits[0].id;
          this.selectedOuName = response.data.organisationUnits[0].name;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  beforeMount() {
    this.getOU();
  },

  beforeUpdate() {
    EventBus.$emit("ou-created", { ou: this.selectedOu, type: "age" });
  },


};
</script>