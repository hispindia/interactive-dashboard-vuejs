<template>
  <highcharts id='allcharts' :options="mapOptions" class="map"></highcharts>
</template>

<script>
import variables from "../../config.js";
import axios from "axios";
import { EventBus } from "../../event-bus";
import Highcharts from "highcharts";
export default {
  data() {
    return {
      diseaseFlag: false,
      diseases: variables.diseases_yll,
      genderFilter: variables.gender_main_var,
      ageFilter: variables.age_main_var,
      siteFilter: variables.site_main_var,
      measureFilter: variables.yll,
      measureFilterTemp: variables.yll,
      ou: variables.indiaOuId,
      statesApi: "",
      indiaApi: "",
      mapOptions: {
        chart: {
          type: "treemap"
        },
        title : {
          text : "Diseases Tree Map"
        },
        series: [
          {
            type: "treemap",
            layoutAlgorithm: "squarified",
            allowDrillToNode: false,
            animation: {
              duration: 1500
            },
            dataLabels: {
              enabled: false
            },
            borderWidth: 5,
            tooltip: {
              pointFormat: "<b>{point.name} : <br> value : </b> {point.value}"
            },
            levelIsConstant: false,
            levels: [
              {
                level: 2,
                dataLabels: {
                  enabled: true,
                  align: "left",
                  verticalAlign: "left",
                  style : {
                      fontSize : 12
                  }
                },
                borderWidth: 2
              }
            ],
            data: ""
          }
        ]
      },

      subtitle: {
        text:
          'Click points to drill down. Source: <a href="http://apps.who.int/gho/data/node.main.12?lang=en">WHO</a>.'
      },
      title: {
        text: "Global Mortality Rate 2012, per 100 000 population"
      }
    };
  },
  mounted() {
    this.loadApi();
    EventBus.$on("filters", this.setFilters);
    EventBus.$on("ou-created", this.setSelectedOu);
    EventBus.$on("ou-changed", this.setSelectedOu);
  },
  watch: {
    ou: function() {
      this.loadApi();
    },
    genderFilter: function() {
      this.loadApi();
    },
    ageFilter: function() {
      this.loadApi();
    },
    siteFilter: function() {
      this.loadApi();
    },
    measureFilter: function(value) {
      if (value == variables.yll && !this.diseaseFlag) this.diseases = variables.diseases_yll;
      else if (value == variables.yld && !this.diseaseFlag) this.diseases = variables.diseases_yld;
      else if (value == variables.daly && !this.diseaseFlag) this.diseases = variables.diseases_daly;
      else if(value == variables.deaths && !this.diseaseFlag) this.diseases = variables.diseases_deaths;
      else{

      }
      this.loadApi();
    }
  },
  methods: {
    setSelectedOu: function(params) {
      if (params.ou === undefined) return;
      params.ou != "" ? (this.ou = params.ou) : this.ou;
      this.setSelections(params);
    },
    setSelections: function(params) {
      this.genderFilter = variables.gender_main_var;
      this.ageFilter = variables.age_main_var;
      this.siteFilter = variables.site_main_var;
      this.measureFilter = variables.yll;
    },
    setColors: function() {
      var count1 = 1,
        count2 = 1,
        count3 = 1,
        count4 = 1;
      for (let g = 0; g < Object.keys(this.diseases[0]).length; g++) {
        var key = Object.keys(this.diseases[0])[g];
        var index = this.diseases[0][key].group;
        if (index == 0) {
          this.diseases[0][key].color = this.getColorShades(128, 0, 0, count1);
          count1++;
        } else if (index == 1) {
          this.diseases[0][key].color = this.getColorShades(0, 128, 0, count2);
          count2++;
        } else if (index == 2) {
          this.diseases[0][key].color = this.getColorShades(
            255,
            165,
            0,
            count3
          );
          count3++;
        } else {
          this.diseases[0][key].color = this.getColorShades(0, 0, 255, count4);
          count4++;
        }
      }
    },
    getColorShades: function(r, g, b, x) {
      var o =
        x > 3 && x < 6
          ? 0.9
          : x >= 6 && x < 10
          ? 0.75
          : x >= 10 && x < 16
          ? 0.6
          : x >= 16 && x < 20
          ? 0.45
          : x >= 20
          ? 0.3
          : 1;
      x = x + 4;
      r = (x * r) / 10;
      g = (x * g) / 10;
      b = (x * b) / 10;
      return "rgb(" + r + "," + g + "," + b + "," + o + ")";
    },
    setFilters: function(params) {
      if (params.filter == "gender") {
        this.genderFilter = params.value;
      } else if (params.filter == "age") {
        this.ageFilter = params.value;
        $(".rightbarage").addClass("hidediv");
      } else if (params.filter == "site") {
        this.siteFilter = params.value;
      } else if (params.filter == "measure") {
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
    setApis: function() {
      this.statesApi =
        "../../analytics.json?dimension=pe:2015&dimension=" +
        variables.gender_id +
        ":" +
        this.genderFilter +
        "&dimension=" +
        variables.age_id +
        ":" +
        this.ageFilter +
        "&dimension=ou:" +
        this.ou +
        "&dimension=dx:" +
        this.measureFilter +
        "&displayProperty=NAME&outputIdScheme=UID";
      this.indiaApi =
        "../../analytics.json?dimension=pe:2015&dimension=" +
        variables.gender_id +
        ":" +
        this.genderFilter +
        "&dimension=" +
        variables.age_id +
        ":" +
        this.ageFilter +
        "&dimension=" +
        variables.site_id +
        ":" +
        this.siteFilter +
        "&dimension=ou:" +
        this.ou +
        "&dimension=dx:" +
        this.measureFilter +
        "&displayProperty=NAME&outputIdScheme=UID";
    },
    loadApi: function() {
      $("#loader").show();
      this.setApis();
      axios
        .get(this.ou == variables.indiaOuId ? this.indiaApi : this.statesApi)
        .then(response => {
          this.setColors();
          this.mapOptions.series[0].data = [];
          var dataloop = "";
          response.data.rows.length == 0
            ? (this.chartOptions.series = [],alert("No data at this organisation Unit!"), $("#loader").hide())          
            : (dataloop = response.data.rows);

          this.loadMapData(dataloop);
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadMapData: function(dataloop) {
      let temp = JSON.parse(JSON.stringify(this.diseases));

      for (let j = 0, len = dataloop.length; j < len; j++) {
        var disease_id = dataloop[j][0];
        var value =
          this.ou == variables.indiaOuId
            ? parseFloat(dataloop[j][6])
            : parseFloat(dataloop[j][5]);
        temp[0][disease_id].val += value;

        if (j == len - 1) {
          console.log(temp[0]);
          var temp_arr = [];
          temp_arr["Disease Type 1"] = [];
          temp_arr["Disease Type 2"] = [];
          temp_arr["Disease Type 3"] = [];
          temp_arr["Disease Type 4"] = [];

          for (var i = 0; i < Object.keys(temp[0]).length; i++) {
            var key = Object.keys(temp[0])[i];
            var value = temp[0][Object.keys(temp[0])[i]];
            var name = temp[0][Object.keys(temp[0])[i]].name;
            var val = temp[0][Object.keys(temp[0])[i]].val;
            var color = temp[0][Object.keys(temp[0])[i]].color;

            if (value.group == 0) {
              temp_arr["Disease Type 1"][name] = { val: val, color: color };
            }
            if (value.group == 1) {
              temp_arr["Disease Type 2"][name] = { val: val, color: color };
            }
            if (value.group == 2) {
              temp_arr["Disease Type 3"][name] = { val: val, color: color };
            }
            if (value.group == 3) {
              temp_arr["Disease Type 4"][name] = { val: val, color: color };
            }
          }
          console.log(temp_arr);
          this.makeTreeChart(temp_arr);
        }
      }
    },
    makeTreeChart: function(data) {
      var points = [],
        diseaseType_p,
        diseaseType_val,
        diseaseType_i,
        disease_p,
        disease_i;
      diseaseType_i = 0;

      for (var diseaseType in data) {
        diseaseType_val = 0;
        diseaseType_p = {
          id: "id_" + diseaseType_i,
          name: diseaseType
        };
        disease_i = 0;

        for (var disease in data[diseaseType]) {
          disease_p = {
            id: diseaseType_p.id + "_" + disease_i,
            name: disease,
            parent: diseaseType_p.id,
            color: data[diseaseType][disease].color,
            value: Math.round(data[diseaseType][disease].val)
          };
          diseaseType_val += disease_p.value;
          points.push(disease_p);
          disease_i++;
        }
        diseaseType_p.value = Math.round(diseaseType_val);
        points.push(diseaseType_p);
        diseaseType_i++;
      }

      console.log(points);
      var vm = this;
      setTimeout(function() {
        vm.mapOptions.series[0].data = [...points];
        $("#loader").hide();
      }, 2000);
    }
  }
};
</script>
 <style scoped>
.map {
  min-height: 500px;
}
</style>