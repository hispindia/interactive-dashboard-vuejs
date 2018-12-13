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
    EventBus.$on("param", this.setSelections);
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
      params.ou != "" ? (this.ou = params.ou) : this.ou;
      this.setSelections(params);
    },
    setSelections: function(params) {
      this.selections = params.type;
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
          this.handleShowHide();
          this.chartOptions.series = [];
          var dataloop = "";
          response.data.rows.length == 0
            ? (this.chartOptions.series = [])
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
      let temp = JSON.parse(JSON.stringify(this.diseases));
      for (let i = 0, len = dataloop.length; i < len; i++) {
        var disease_id = dataloop[i][0];
        var value =
          this.ou == variables.indiaOuId
            ? parseFloat(dataloop[i][6])
            : parseFloat(dataloop[i][5]);
        var gender_id = dataloop[i][2];
        gender_id == variables.gender_male_id
          ? temp[0][disease_id].data[0] === undefined
            ? (temp[0][disease_id].data[0] = value)
            : (temp[0][disease_id].data[0] += value)
          : temp[0][disease_id].data[1] === undefined
          ? (temp[0][disease_id].data[1] = value)
          : (temp[0][disease_id].data[1] += value);

        temp[0][disease_id].data[2] === undefined
          ? (temp[0][disease_id].data[2] = value)
          : (temp[0][disease_id].data[2] += value);

        if (i == len - 1) {
          var vm = this;
          setTimeout(function() {
            vm.chartOptions.series = [...Object.values(temp[0])];
            vm.chartOptions.xAxis.categories = [...variables.gender_categories];
            $("#loader").hide();
          }, 2000);
        }
      }
    },
    sortDataByAge: function(dataloop) {
      $("#btnAge").addClass("selected-option");
      let temp = JSON.parse(JSON.stringify(this.diseases));
      for (let i = 0, len = dataloop.length; i < len; i++) {
        var disease_id = dataloop[i][0];
        var value =
          this.ou == variables.indiaOuId
            ? parseFloat(dataloop[i][6])
            : parseFloat(dataloop[i][5]);
        var age_id_match = dataloop[i][3];
        age_id_match == variables.age_0_4_id
          ? temp[0][disease_id].data[0] === undefined
            ? (temp[0][disease_id].data[0] = value)
            : (temp[0][disease_id].data[0] += value)
          : age_id_match == variables.age_5_14_id
          ? temp[0][disease_id].data[1] === undefined
            ? (temp[0][disease_id].data[1] = value)
            : (temp[0][disease_id].data[1] += value)
          : age_id_match == variables.age_15_29_id
          ? temp[0][disease_id].data[2] === undefined
            ? (temp[0][disease_id].data[2] = value)
            : (temp[0][disease_id].data[2] += value)
          : age_id_match == variables.age_30_49_id
          ? temp[0][disease_id].data[3] === undefined
            ? (temp[0][disease_id].data[3] = value)
            : (temp[0][disease_id].data[3] += value)
          : age_id_match == variables.age_50_59_id
          ? temp[0][disease_id].data[4] === undefined
            ? (temp[0][disease_id].data[4] = value)
            : (temp[0][disease_id].data[4] += value)
          : age_id_match == variables.age_60_69_id
          ? temp[0][disease_id].data[5] === undefined
            ? (temp[0][disease_id].data[5] = value)
            : (temp[0][disease_id].data[5] += value)
          : age_id_match == variables.age_70_79_id
          ? temp[0][disease_id].data[6] === undefined
            ? (temp[0][disease_id].data[6] = value)
            : (temp[0][disease_id].data[6] += value)
          : temp[0][disease_id].data[7] === undefined
          ? (temp[0][disease_id].data[7] = value)
          : (temp[0][disease_id].data[7] += value);

        if (i == len - 1) {
          var vm = this;
          setTimeout(function() {
            vm.chartOptions.series = [...Object.values(temp[0])];
            vm.chartOptions.xAxis.categories = [...variables.age_categories];
            $("#loader").hide();
          }, 2000);
        }
      }
    },
    sortDataBySite: function(dataloop) {
      $("#btnSite").addClass("selected-option");
      let temp = JSON.parse(JSON.stringify(this.diseases));
      for (let i = 0, len = dataloop.length; i < len; i++) {
        var disease_id = dataloop[i][0];
        var value =
          this.ou == variables.indiaOuId
            ? parseFloat(dataloop[i][6])
            : parseFloat(dataloop[i][5]);
        var site_id_match = dataloop[i][4];
        site_id_match == variables.site_urban_id
          ? temp[0][disease_id].data[0] === undefined
            ? (temp[0][disease_id].data[0] = value)
            : (temp[0][disease_id].data[0] += value)
          : temp[0][disease_id].data[1] === undefined
          ? (temp[0][disease_id].data[1] = value)
          : (temp[0][disease_id].data[1] += value);

        temp[0][disease_id].data[2] === undefined
          ? (temp[0][disease_id].data[2] = value)
          : (temp[0][disease_id].data[2] += value);

        if (i == len - 1) {
          var vm = this;
          setTimeout(function() {
            vm.chartOptions.series = [...Object.values(temp[0])];
            vm.chartOptions.xAxis.categories = [...variables.site_categories];
            $("#loader").hide();
          }, 2000);
        }
      }
    },
    sortDataByLoc: function(dataloop) {
      $("#btnLocation").addClass("selected-option");
      let temp = JSON.parse(JSON.stringify(this.diseases));
      for (let i = 0, len = dataloop.length; i < len; i++) {
        var disease_id = dataloop[i][0];
        var value = parseFloat(dataloop[i][5]);
        var stateData = dataloop[i][2];
        for (let j = 0; j < Object.keys(variables.stateNames[0]).length; j++) {
          stateData == Object.keys(variables.stateNames[0])[j]
            ? temp[0][disease_id].data[j] === undefined
              ? (temp[0][disease_id].data[j] = parseFloat(value))
              : (temp[0][disease_id].data[j] += parseFloat(value))
            : temp[0][disease_id].data[j] === undefined
            ? (temp[0][disease_id].data[j] = 0)
            : (temp[0][disease_id].data[j] += 0);
        }

        if (i == len - 1) {
          var vm = this;
          setTimeout(function() {
            vm.chartOptions.series = [...Object.values(temp[0])];
            vm.chartOptions.xAxis.categories = [
              ...Object.values(variables.stateNames[0])
            ];
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
        "&dimension="+
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
      ou: "",
      statesApi: "",
      defaultIndiaApi:
        "../../analytics.json?dimension=pe:2015&dimension=ou:" +
        variables.allouIDs +
        "&dimension=dx:" +
        this.measureFilter +
        "&displayProperty=NAME&outputIdScheme=UID",
      indiaApi: "",
      updateArgs: [true, true, { duration: 1000 }],
      chartOptions: {
        chart: {
          type: "column"
        },
        title: {
          text: "Stacked column chart"
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
          pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}"
        },
        plotOptions: {
          column: {
            stacking: "normal",
            borderWidth: 0,
            dataLabels: {
              enabled: false,
              color: "white"
            }
          }
        },
        series: []
      }
    };
  },
  destroyed() {
    EventBus.$off("ou-created", this.getApiData);
    EventBus.$off("ou-changed", this.getApiData);
    EventBus.$off("param", this.getApiData);
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
