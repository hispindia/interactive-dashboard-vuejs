<template>
  <div id="center-container" class="col" ref="centerc">
    <div class="row justify-content-center">
      <div id="cc" class="col" style="max-width:fit-content">
        <div class="button-grp">
          <button @click="select('stackChart')" :class="{btnActive: selected === 'stackChart'}">
            <img
              src="../../assets/images/stackedChart.jpg"
              alt="Stack Chart"
              width="60px"
              height="60px"
            >
          </button>
          <button @click="select('mapChart')" :class="{btnActive: selected === 'mapChart'}">
            <img src="../../assets/images/map.png" alt="Map Chart" width="60px" height="60px">
          </button>
          <button @click="select('pointChart')" :class="{btnActive: selected === 'pointChart'}">
            <img src="../../assets/images/linechart.png" alt="Point Chart" width="60px" height="60px">
          </button>
          <button @click="select('pieChart')" :class="{btnActive: selected === 'pieChart'}">
            <img src="../../assets/images/piechart.png" alt="Pie Chart" width="60px" height="60px">
          </button>
          <button @click="select('treeChart')" :class="{btnActive: selected === 'treeChart'}">
            <img src="../../assets/images/treemap.png" alt="Tree Chart" width="60px" height="60px">
          </button>
          <button @click="select('heatChart')" :class="{btnActive: selected === 'heatChart'}">
            <img src="" alt="Heat Chart" width="60px" height="60px">
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div id="cc" class="col div-content" ref="cc">
        <button
          class="btn btn-default"
          @click="showhidelegend"
          id="btnToggle"
          data-toggle="tooltip"
          data-placement="right"
          title="Show legends"
        >
          <i class="material-icons">filter_list</i>
        </button>
        <keep-alive>
          <component :is="currentView"></component>
        </keep-alive>
      </div>
    </div>
    <div class="row justify-content-center" v-if="currentView!='mapChart' && currentView!='treeChart' && currentView!='heatChart'" >
      <div id="cc" class="col pt-2" style="max-width:fit-content">
        <button
          class="btn btn-default bottom-options selected-option"
          v-on:click="sendParams('age')"
          id="btnAge"
        >Age</button>
        <button
          class="btn btn-default bottom-options"
          v-on:click="sendParams('gender')"
          id="btnGender"
        >Gender</button>
        <button
          class="btn btn-default bottom-options"
          v-on:click="sendParams('site')"
          id="btnSite"
        >Site</button>
        <button
          class="btn btn-default bottom-options"
          v-on:click="sendParams('location')"
          id="btnLocation"
        >Location</button>
      </div>
    </div>
  </div>
</template>

<script>
import StackChart from "../highcharts/StackChart";
import MapChart from "../highcharts/MapChart";
import PointChart from "../highcharts/PointChart";
import PieChart from "../highcharts/PieChart";
import TreeChart from "../highcharts/TreeChart";
import HeatChart from "../highcharts/HeatChart";
import { EventBus } from "../../event-bus";
import params from "../Leftbar";

export default {
  name: "CenterContainer",
  components: {
    stackChart: StackChart,
    mapChart: MapChart,
    PointChart: PointChart,
    PieChart: PieChart,
    TreeChart: TreeChart,
    HeatChart: HeatChart
  },
  methods: {
    select(elem) {
      this.currentView = elem;
      this.activate(elem);
    },
    activate(elem) {
      this.selected = elem;
    },
    showhidelegend: function() {
      $(".highcharts-legend").toggle();
    },
    sendParams: function(t) {
      $(".bottom-options").removeClass("selected-option");
      $(".rightbar-menu-main").removeClass("hidediv");
      if (t == "age") {
        $(".rightbarage").addClass("hidediv");
        EventBus.$emit("param-"+this.selected, {
          ou: $(".selectedou").attr('id'),
          type: "age"
        });
      } else if (t == "gender") {
        $(".rightbargender").addClass("hidediv");
        EventBus.$emit("param-"+this.selected, {
          ou: $(".selectedou").attr('id'),
          type: "gender"
        });
      } else if (t == "location") {
        // $(".rightbarlocation").addClass("hidediv");
        EventBus.$emit("param-"+this.selected, {
          ou: $(".selectedou").attr('id'),
          type: "location"
        });
      } else {
        $(".rightbarsite").addClass("hidediv");
        EventBus.$emit("param-"+this.selected, {
          ou: $(".selectedou").attr('id'),
          type: "site"
        });
      }
    }
  },
  watch : {
    selected : function(v){
       this.sendParams("age");
    }
  },
  mounted() {
    $('[data-toggle="tooltip"]').tooltip();
  },
  data() {
    return {
      selected: "stackChart",
      currentView: "stackChart"
    };
  }
};
</script>
<style scoped>
#btnToggle {
  float: left;
  border-radius: 10px 10px 0 0;
  padding: 5px;
}

.selected-option {
  background-color: darkgray;
}
button {
  padding: 10px 20px;
  outline: none;
  background: gray;
  color: #fff;
  font-size: 16px;
  margin: 0;
  border: 0px;
  cursor: pointer;
}
.button-grp > button {
  opacity: 0.2;
  padding: 2px;
}

.button-grp > button:hover {
  opacity: 1;
  transform: scale(1.2);
  transition: all 500ms;
  background: white;
}
button:active {
  /* color: rgb(117, 117, 117); */
  color: #6fcd98;
  opacity: 1 !important;
  background: white;
}
.btnActive {
  color: #6fcd98;
  opacity: 1 !important;
  background: white;
}
</style>
