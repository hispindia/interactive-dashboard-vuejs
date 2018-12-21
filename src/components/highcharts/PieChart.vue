<template>
  <highcharts class="chart" :options="chartOptions" :updateArgs="updateArgs"></highcharts>
</template>


<script>
import axios from "axios";
import variables from "../../config.js";
import Highcharts from "highcharts";
import { EventBus } from "../../event-bus";

export default {
  name: "Chart",
  mounted() {
    EventBus.$on("filters", this.setFilters);
    EventBus.$on("ou-created", this.setSelectedOu);
    EventBus.$on("ou-changed", this.setSelectedOu);
    EventBus.$on("param-pieChart", this.setSelections);
    this.getApiData();
  },
  watch: {
    ou: function() {
      this.getApiData();
    },
    selections: function() {
      this.getApiData();
    },
    genderFilter: function() {
      this.getApiData();
    },
    ageFilter: function() {
      this.getApiData();
    },
    siteFilter: function() {
      this.getApiData();
    },
    measureFilter: function(value) {
      if (value == variables.yll) this.diseases = variables.diseases_yll;
      else if (value == variables.yld) this.diseases = variables.diseases_yld;
      else if (value == variables.daly) this.diseases = variables.diseases_daly;
      else this.diseases = variables.diseases_deaths;
      this.getApiData();
    }
  },
  methods: {
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
    handleShowHide: function() {
      $(".bottom-options").removeClass("selected-option");
      if (this.ou == variables.indiaOuId) {
        $("#btnSite , #btnLocation").show();
      } else {
        $("#btnSite, #btnLocation").hide();
        $(".rightbarsite").addClass("hidediv");
      }
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
        this.measureFilter = params.value;
      } else {
      }
    },
    setSelectedOu: function(params) {
      if (params.ou === undefined) return;
      params.ou != "" ? (this.ou = params.ou) : this.ou;
      this.setSelections(params);
    },
    setSelections: function(params) {
      this.selections = params.type;
      this.ou = params.ou;
      this.genderFilter = variables.gender_main_var;
      this.ageFilter = variables.age_main_var;
      this.siteFilter = variables.site_main_var;
      this.measureFilter = variables.yll;
      // EventBus.$emit("reset");
    },
    getApiData: function() {
      $("#loader").show();
      this.setApis();
      axios
        .get(
          this.ou == variables.indiaOuId
            ? this.selections == "location"
              ? this.defaultIndiaApi
              : this.indiaApi
            : this.statesApi
        )
        .then(response => {
          this.setColors();
          this.handleShowHide();
          this.chartOptions.series[0].data = [];
          var dataloop = "";
          response.data.rows.length == 0
            ? (this.chartOptions.series[0].data = [])
            : (dataloop = response.data.rows);

          this.selections == "gender"
            ? this.sortDataByGender(dataloop)
            : this.selections == "age"
            ? this.sortDataByAge(dataloop)
            : this.selections == "location"
            ? this.sortDataByLoc(dataloop)
            : this.sortDataBySite(dataloop);
        })
        .catch(error => {
          console.log(error);
        });
    },
    sortDataByGender: function(dataloop) {
      $("#btnGender").addClass("selected-option");
      //   let temp = JSON.parse(JSON.stringify(variables.gender_categories_forpie));
      var male = 0;
      var female = 0;
      for (let i = 0, len = dataloop.length; i < len; i++) {
        var disease_id = dataloop[i][0];
        var value =
          this.ou == variables.indiaOuId
            ? parseInt(dataloop[i][6])
            : parseInt(dataloop[i][5]);
        var gender_id = dataloop[i][2];
        gender_id == variables.gender_male_id
          ? (male += value)
          : (female += value);
        if (i == len - 1) {
          var vm = this;
          var temp = [];
          temp.push({ name: "Male", y: male, sliced: true, selected: true });
          temp.push({ name: "Female", y: female });
          setTimeout(function() {
            vm.chartOptions.series[0].data = [...temp];
            // vm.chartOptions.xAxis.categories = [...variables.gender_categories_];
            $("#loader").hide();
          }, 2000);
        }
      }
    },
    sortDataByAge: function(dataloop) {
      $("#btnAge").addClass("selected-option");
      var age_04 = 0;
      var age_514 = 0;
      var age_1529 = 0;
      var age_3049 = 0;
      var age_5059 = 0;
      var age_6069 = 0;
      var age_7079 = 0;
      var age_80above = 0;
      for (let i = 0, len = dataloop.length; i < len; i++) {
        var disease_id = dataloop[i][0];
        var value =
          this.ou == variables.indiaOuId
            ? parseInt(dataloop[i][6])
            : parseInt(dataloop[i][5]);
        var age_id = dataloop[i][3];
        age_id == variables.age_0_4_id
          ? (age_04 += value)
          : age_id == variables.age_5_14_id ? (age_514 += value) :
          age_id == variables.age_15_29_id ? (age_1529 += value) :
          age_id == variables.age_30_49_id ? (age_3049 += value) :
          age_id == variables.age_50_59_id ? (age_5059 += value) :
          age_id == variables.age_60_69_id ? (age_6069 += value) :
          age_id == variables.age_70_79_id ? (age_7079 += value) :
          age_80above += value;
        if (i == len - 1) {
          var vm = this;
          var temp = [];
          temp.push({ name: "0-4 years", y: age_04, sliced: true, selected: true });
          temp.push({ name: "5-14 years", y: age_514 });
          temp.push({ name: "15-29 years", y: age_1529 });
          temp.push({ name: "30-49 years", y: age_3049 });
          temp.push({ name: "50-59 years", y: age_5059 });
          temp.push({ name: "60-69 years", y: age_6069 });
          temp.push({ name: "70-70 years", y: age_7079 });
          temp.push({ name: "80 years and above", y: age_80above });
          setTimeout(function() {
            vm.chartOptions.series[0].data = [...temp];
            // vm.chartOptions.xAxis.categories = [...variables.gender_categories_];
            $("#loader").hide();
          }, 2000);
        }
      }
    },
    sortDataBySite: function(dataloop) {
      $("#btnSite").addClass("selected-option");
      var urban = 0;
      var rural = 0;
      for (let i = 0, len = dataloop.length; i < len; i++) {
        var disease_id = dataloop[i][0];
        var value =
          this.ou == variables.indiaOuId
            ? parseInt(dataloop[i][6])
            : parseInt(dataloop[i][5]);
        var site_id = dataloop[i][4];
        site_id == variables.site_urban_id
          ? (urban += value)
          : (rural += value);
        if (i == len - 1) {
          var vm = this;
          var temp = [];
          temp.push({ name: "Urban", y: urban, sliced: true, selected: true });
          temp.push({ name: "Rural", y: rural });
          setTimeout(function() {
            vm.chartOptions.series[0].data = [...temp];
            $("#loader").hide();
          }, 2000);
        }
      }
    },
    sortDataByLoc: function(dataloop) {
      $("#btnLocation").addClass("selected-option");
      var loopdata = dataloop;
      let temp = JSON.parse(JSON.stringify(variables.statesMapData));
      for (let i = 0, len = loopdata.length; i < len; i++) {
        var ouid = loopdata[i][2];
        var value = parseInt(loopdata[i][5]);
        if (temp[0][ouid] !== undefined) {
          temp[0][ouid].data += value;
        }

        if (i == len - 1) {
          var vm = this;
          $("#loader").show();
          var temp_arr = [];
          for (let j = 0; j < Object.keys(temp[0]).length; j++) {
            temp_arr.push({
              name: variables.stateNames[0][Object.keys(temp[0])[j]],
              y: temp[0][Object.keys(temp[0])[j]].data
            });
          }
          setTimeout(function() {
            vm.chartOptions.series[0].data = [...temp_arr];
            // console.log(vm.mapOptions.series[0].data);
            $("#loader").hide();
          }, 2000);
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

      this.defaultIndiaApi =
        "../../analytics.json?dimension=pe:2015&dimension=ou:" +
        variables.allouIDs +
        "&dimension=" +
        variables.gender_id +
        ":" +
        this.genderFilter +
        "&dimension=" +
        variables.age_id +
        ":" +
        this.ageFilter +
        "&dimension=dx:" +
        this.measureFilter +
        "&displayProperty=NAME&outputIdScheme=UID";
    }
  },
  data() {
    return {
      width: "",
      selections: "age",
      diseases: variables.diseases_yll,
      genderFilter: variables.gender_main_var,
      ageFilter: variables.age_main_var,
      siteFilter: variables.site_main_var,
      measureFilter: variables.yll,
      ou: variables.indiaOuId,
      statesApi: "",
      defaultIndiaApi:
        "../../analytics.json?dimension=pe:2015&dimension=ou:" +
        variables.allouIDs +
        "&dimension=dx:" +
        this.measureFilter +
        "&displayProperty=NAME&outputIdScheme=UID",
      indiaApi: "",
      updateArgs: [true, true, { duration: 1000 }],
      colors: [],
      chartOptions: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie"
        },
        title: {
          text: "Pie chart"
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          min: 0,
          title: {
            text: "YLL counts"
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: "bold",
              color: "gray"
            }
          }
        },
        legend: {
          align: "left",
          x: 0,
          verticalAlign: "top",
          y: 25,
          floating: true,
          backgroundColor: "white",
          borderColor: "#CCC",
          borderWidth: 1,
          shadow: false
        },
        tooltip: {
          headerFormat: "<b>{point.x}</b><br/>",
          pointFormat: "{series.name}: {point.y}<br><b>{point.name}</b>: {point.percentage:.1f} %"
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b>: {point.y}",
              style: {
                color: "black"
              }
            }
          }
        },
        series: [
          {
            name: "Total Patients",
            colorByPoint: true,
            data: []
          }
        ]
      }
    };
  },
  destroyed() {
    EventBus.$off("ou-created", this.getApiData);
    EventBus.$off("ou-changed", this.getApiData);
    EventBus.$off("param-pieChart", this.getApiData);
    EventBus.$off("filters", this.setFilters);
  }
};
</script>
<style scoped>
.stock {
  width: 70%;
  margin: 0 auto;
}
</style>
