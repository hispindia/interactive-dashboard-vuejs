<template>
  <highcharts id="allcharts" :constructor-type="'mapChart'" :options="mapOptions" class="map"></highcharts>
</template>

<script>
import mapdata from "../../indiamap.json";
import variables from "../../config.js";
import axios from "axios";
import { EventBus } from "../../event-bus";
export default {
  data() {
    return {
      populationdata: "",
      chartType: "count",
      diseaseFlag: false,
      selections: "age",
      diseases: variables.diseases_yll,
      genderFilter: variables.gender_main_var,
      ageFilter: variables.age_main_var,
      siteFilter: variables.site_main_var,
      measureFilter: variables.yll,
      measureFilterTemp: variables.yll,
      mapOptions: {
        chart: {
          map: mapdata
        },

        title: {
          text: "Map Chart"
        },

        subtitle: {
          text:
            'Source map: <a href="http://code.highcharts.com/mapdata/countries/in/in-all.js">India</a>'
        },

        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: "bottom"
          }
        },

        colorAxis: {
          min: 0
        },

        series: [
          {
            data: [],
            name: "Random data",
            states: {
              hover: {
                color: "#BADA55"
              }
            },
            dataLabels: {
              enabled: false,
              format: "{point.name}"
            }
          }
        ]
      }
    };
  },
  watch: {
    measureFilter: function(value) {
      if (value == variables.yll && !this.diseaseFlag)
        this.diseases = variables.diseases_yll;
      else if (value == variables.yld && !this.diseaseFlag)
        this.diseases = variables.diseases_yld;
      else if (value == variables.daly && !this.diseaseFlag)
        this.diseases = variables.diseases_daly;
      else if (value == variables.deaths && !this.diseaseFlag)
        this.diseases = variables.diseases_deaths;
      else {
      }
      this.loadMapData();
    }
  },
  mounted() {
    this.loadMapData();
    EventBus.$on("filters", this.setFilters);
    EventBus.$on("chartChange", this.changeChart);
  },
  methods: {
    changeChart: function(v) {
      if (v == "rate") {
        this.chartType = "rate";
      } else if (v == "count") {
        this.chartType = "count";
      } else {
      }
      this.getApiData();
    },
    setFilters: function(params) {
      if (params.filter == "measure") {
        this.diseaseFlag = false;
        this.measureFilter = params.value;
        this.measureFilterTemp = params.value;
      } else {
        if (params.value.id != "") {
          this.diseaseFlag = true;
          this.measureFilter = params.value.id;
        } else {
          this.diseaseFlag = false;
          this.measureFilter = this.measureFilterTemp;
        }
      }
    },
    loadMapData: function() {
      var defaultIndiaApi =
        "../../analytics.json?dimension=pe:2015&dimension=ou:" +
        variables.allouIDs +
        // "&dimension=dx:" +
        //  variables.gender_id +
        // ":" +
        // this.genderFilter +
        // "&dimension=" +
        // variables.age_id +
        // ":" +
        // this.ageFilter +
        // "&dimension=" +
        // variables.site_id +
        // ":" +
        // this.siteFilter +
        "&dimension=dx:" +
        this.measureFilter +
        "&displayProperty=NAME&outputIdScheme=UID";
      axios.get(defaultIndiaApi).then(response => {
        console.log(response.data);
        var loopdata = response.data.rows;
        let temp = JSON.parse(JSON.stringify(variables.statesMapData));

        if (this.chartType == "rate") {
          // this.getPopulationData("gender");
          setTimeout(function() {
            for (let i = 0, len = loopdata.length; i < len; i++) {
              var ouid = loopdata[i][2];
              var value = parseFloat(loopdata[i][3]);
              if (temp[0][ouid] !== undefined) {
                temp[0][ouid].data += value;
              }

              if (i == len - 1) {
                var vm = this;
                $("#loader").show();
                var temp_arr = [];
                for (let j = 0; j < Object.keys(temp[0]).length; j++) {
                  temp_arr.push([
                    variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                    temp[0][Object.keys(temp[0])[j]].data === undefined ? temp[0][Cbw7y8SiYyW].data : temp[0][Object.keys(temp[0])[j]].data
                  ]);
                }
                setTimeout(function() {
                  vm.mapOptions.series[0].data = [...temp_arr];
                  // console.log(vm.mapOptions.series[0].data);
                  $("#loader").hide();
                }, 2000);
              }
            }
          }, 2000);
        } else if (this.chartType == "count") {
          for (let i = 0, len = loopdata.length; i < len; i++) {
            var ouid = loopdata[i][2];
            var value = parseFloat(loopdata[i][3]);
            if (temp[0][ouid] !== undefined) {
              temp[0][ouid].data += value;
            }

            if (i == len - 1) {
              var vm = this;
              $("#loader").show();
              var temp_arr = [];
              for (let j = 0; j < Object.keys(temp[0]).length; j++) {
                temp_arr.push([
                  variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                  temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data
                ]);
              }
              console.log(temp_arr);
              setTimeout(function() {
                vm.mapOptions.series[0].data = [...temp_arr];
                $("#loader").hide();
              }, 2000);
            }
          }
        }
      });
    }
  }
};
</script>
 <style scoped>
.map {
  min-height: 500px;
}
</style>