<template>
  <highcharts id='allcharts' class="chart" :options="chartOptions" :updateArgs="updateArgs"></highcharts>
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
    EventBus.$on("param-pointChart", this.setSelections);
    EventBus.$on("chartChange", this.changeChart);
    this.getApiData();
  },
  watch: {
    ou: function() {
      this.getApiData();
    },
    selections: function(v) {
      this.chartOptions.title.text =
        "Diseases aggregated line chart : " + v + "-wise";
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
      if (value == variables.yll && !this.diseaseFlag) {
        this.diseases = variables.diseases_yll;
        this.chartOptions.yAxis.title.text = "YLL Counts";
      } else if (value == variables.yld && !this.diseaseFlag) {
        this.diseases = variables.diseases_yld;
        this.chartOptions.yAxis.title.text = "YLD Counts";
      } else if (value == variables.daly && !this.diseaseFlag) {
        this.diseases = variables.diseases_daly;
        this.chartOptions.yAxis.title.text = "DALY Counts";
      } else if (value == variables.deaths && !this.diseaseFlag) {
        this.diseases = variables.diseases_deaths;
        this.chartOptions.yAxis.title.text = "Deaths Counts";
      } else {
      }
      this.getApiData();
    }
  },
  methods: {
    changeChart: function(v) {
      if (v == "percent") {
        this.chartType = "percent";
        this.chartOptions.plotOptions.column.stacking = "percent";
        this.chartOptions.tooltip.pointFormat =
          "{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Percentage: {point.percentage:.0f}%";
      } else if (v == "count") {
        this.chartType = "count";
        this.chartOptions.plotOptions.column.stacking = "normal";
        this.chartOptions.tooltip.pointFormat =
          "{series.name}: {point.y}<br/>Total: {point.stackTotal}";
      } else {
        this.chartType = "rate";
      }
      this.getApiData();
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
    handleShowHide: function() {
      $(".bottom-options").removeClass("selected-option");
      $(".percentunit").attr("disabled", "disabled");
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
        // $(".rightbarage").addClass("hidediv");
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
    setSelectedOu: function(params) {
      if (params.ou === undefined) return;
      params.ou != "" ? (this.ou = params.ou) : this.ou;
      this.setSelections(params);
    },
    setSelections: function(params) {
      this.selections = params.type;
      this.genderFilter = variables.gender_main_var;
      this.ageFilter = variables.age_main_var;
      this.siteFilter = variables.site_main_var;
      this.measureFilter = variables.yll;
    },
    getApiData: function() {
      $("#loader").show();
      this.setApis();
      axios
        .get(
          this.ou == variables.indiaOuId
            ? this.selections == "location"
              ? this.defaultIndiaApi
              : this.measureFilter == variables.yld ||
                this.measureFilter == variables.daly
              ? this.statesApi
              : this.indiaApi
            : this.statesApi
        )
        .then(response => {
          this.setColors();
          this.handleShowHide();
          this.chartOptions.series = [];
          var dataloop = "";
          response.data.rows.length == 0
            ? ((this.chartOptions.series = []),
              alert("No data at this organisation Unit!"),
              $("#loader").hide())
            : (dataloop = response.data.rows);
          var vm = this;
          if (this.chartType == "rate") {
            if (this.selections == "gender") {
              this.getPopulationData("gender");
              setTimeout(function() {
                vm.sortDataByGender(dataloop);
              }, 2000);
            } else if (this.selections == "age") {
              this.getPopulationData("age");
              setTimeout(function() {
                vm.sortDataByAge(dataloop);
              }, 2000);
            } else if (this.selections == "site") {
              this.getPopulationData("site");
              setTimeout(function() {
                vm.sortDataBySite(dataloop);
              }, 2000);
            } else {
              this.sortDataByLoc(dataloop);
            }
          } else {
            this.selections == "gender"
              ? this.sortDataByGender(dataloop)
              : this.selections == "age"
              ? this.sortDataByAge(dataloop)
              : this.selections == "location"
              ? this.sortDataByLoc(dataloop)
              : this.sortDataBySite(dataloop);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPopulationData: function(type) {
      // $("#loader").show();
      var data_flag = false;
      var gender_population = {
        male: 0,
        female: 0,
        both: 0
      };
      var age_population = {
        age0_4: 0,
        age5_14: 0,
        age15_29: 0,
        age30_49: 0,
        age50_59: 0,
        age60_69: 0,
        age70_79: 0,
        age80_above: 0
      };
      var site_population = {
        urban: 0,
        rural: 0,
        both: 0
      };
      var vm = this;
      axios
        .get(
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
            "&dimension=dx:gNaskBzw5Nq&displayProperty=NAME&outputIdScheme=UID"
        )
        .then(response => {
          var data = response.data.rows;
          // console.log(data);
          for (let i = 0; i < data.length; i++) {
            var value = Number(data[i][6]);
            if (type == "gender") {
              if (data[i][2] == variables.gender_male_id) {
                gender_population.male = value;
                gender_population.both += value;
              } else if (data[i][2] == variables.gender_female_id) {
                gender_population.female = value;
                gender_population.both += value;
              }
            } else if (type == "age") {
              if (data[i][3] == variables.age_0_4_id) {
                age_population.age0_4 = value;
              } else if (data[i][3] == variables.age_5_14_id) {
                age_population.age5_14 = value;
              } else if (data[i][3] == variables.age_15_29_id) {
                age_population.age15_29 = value;
              } else if (data[i][3] == variables.age_30_49_id) {
                age_population.age30_49 = value;
              } else if (data[i][3] == variables.age_50_59_id) {
                age_population.age50_59 = value;
              } else if (data[i][3] == variables.age_60_69_id) {
                age_population.age60_69 = value;
              } else if (data[i][3] == variables.age_70_79_id) {
                age_population.age70_79 = value;
              } else {
                age_population.age80_above = value;
              }
            } else {
              if (data[i][4] == variables.site_urban_id) {
                site_population.urban = value;
                site_population.both += value;
              } else if (data[i][4] == variables.site_rural_id) {
                site_population.rural = value;
                site_population.both += value;
              }
            }
            if (i == data.length - 1) {
              if (type == "gender") vm.populationdata = gender_population;
              if (type == "age") vm.populationdata = age_population;
              if (type == "site") vm.populationdata = site_population;
            }
          }
        });
    },
    sortDataByGender: function(dataloop) {
      $("#btnGender").addClass("selected-option");
      let temp = JSON.parse(JSON.stringify(this.diseases));
      // if (this.chartType == "rate") this.getPopulationData("gender");
      for (let i = 0, len = dataloop.length; i < len; i++) {
        var disease_id = dataloop[i][0];
        var value =
          this.ou == variables.indiaOuId
            ? this.measureFilter == variables.yld ||
              this.measureFilter == variables.daly
              ? parseFloat(dataloop[i][5])
              : parseFloat(dataloop[i][6])
            : parseFloat(dataloop[i][5]);
        var gender_id = dataloop[i][2];
        if (this.chartType != "rate") {
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
        } else {
          gender_id == variables.gender_male_id
            ? temp[0][disease_id].data[0] === undefined
              ? (temp[0][disease_id].data[0] = value / this.populationdata.male)
              : (temp[0][disease_id].data[0] +=
                  value / this.populationdata.male)
            : temp[0][disease_id].data[1] === undefined
            ? (temp[0][disease_id].data[1] = value / this.populationdata.female)
            : (temp[0][disease_id].data[1] +=
                value / this.populationdata.female);

          temp[0][disease_id].data[2] === undefined
            ? (temp[0][disease_id].data[2] = value / this.populationdata.both)
            : (temp[0][disease_id].data[2] += value / this.populationdata.both);
        }

        if (i == len - 1) {
          var vm = this;
          setTimeout(function() {
            vm.chartOptions.series = [...Object.values(temp[0])];
            var temparr = vm.chartOptions.series;
            vm.chartOptions.series = [
              ...temparr.map(temparr => {
                if (temparr.data.length == 0) {
                  temparr.data = [null, null, null];
                  return temparr;
                } else if (temparr.data.length != 0) {
                  let tarr = temparr.data;
                  for (let a = 0; a < 3; a++) {
                    if (tarr[a] === undefined) tarr[a] = null;
                  }
                  temparr.data = [...tarr];
                  return temparr;
                }
              })
            ];
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
            ? this.measureFilter == variables.yld ||
              this.measureFilter == variables.daly
              ? parseFloat(dataloop[i][5])
              : parseFloat(dataloop[i][6])
            : parseFloat(dataloop[i][5]);
        var age_id_match = dataloop[i][3];

        if (this.chartType != "rate") {
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
        } else {
          age_id_match == variables.age_0_4_id
            ? temp[0][disease_id].data[0] === undefined
              ? (temp[0][disease_id].data[0] =
                  value / this.populationdata.age0_4)
              : (temp[0][disease_id].data[0] +=
                  value / this.populationdata.age0_4)
            : age_id_match == variables.age_5_14_id
            ? temp[0][disease_id].data[1] === undefined
              ? (temp[0][disease_id].data[1] =
                  value / this.populationdata.age5_14)
              : (temp[0][disease_id].data[1] +=
                  value / this.populationdata.age5_14)
            : age_id_match == variables.age_15_29_id
            ? temp[0][disease_id].data[2] === undefined
              ? (temp[0][disease_id].data[2] =
                  value / this.populationdata.age15_29)
              : (temp[0][disease_id].data[2] +=
                  value / this.populationdata.age15_29)
            : age_id_match == variables.age_30_49_id
            ? temp[0][disease_id].data[3] === undefined
              ? (temp[0][disease_id].data[3] =
                  value / this.populationdata.age30_49)
              : (temp[0][disease_id].data[3] +=
                  value / this.populationdata.age30_49)
            : age_id_match == variables.age_50_59_id
            ? temp[0][disease_id].data[4] === undefined
              ? (temp[0][disease_id].data[4] =
                  value / this.populationdata.age50_59)
              : (temp[0][disease_id].data[4] +=
                  value / this.populationdata.age50_59)
            : age_id_match == variables.age_60_69_id
            ? temp[0][disease_id].data[5] === undefined
              ? (temp[0][disease_id].data[5] =
                  value / this.populationdata.age60_69)
              : (temp[0][disease_id].data[5] +=
                  value / this.populationdata.age60_69)
            : age_id_match == variables.age_70_79_id
            ? temp[0][disease_id].data[6] === undefined
              ? (temp[0][disease_id].data[6] =
                  value / this.populationdata.age70_79)
              : (temp[0][disease_id].data[6] +=
                  value / this.populationdata.age70_79)
            : temp[0][disease_id].data[7] === undefined
            ? (temp[0][disease_id].data[7] =
                value / this.populationdata.age80_above)
            : (temp[0][disease_id].data[7] +=
                value / this.populationdata.age80_above);
        }

        if (i == len - 1) {
          var vm = this;
          setTimeout(function() {
            vm.chartOptions.series = [...Object.values(temp[0])];
            var temparr = vm.chartOptions.series;
            vm.chartOptions.series = [
              ...temparr.map(temparr => {
                if (temparr.data.length == 0) {
                  temparr.data = [
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                  ];
                  return temparr;
                } else if (temparr.data.length != 0) {
                  let tarr = temparr.data;
                  for (let a = 0; a < 8; a++) {
                    if (tarr[a] === undefined) tarr[a] = null;
                  }
                  temparr.data = [...tarr];
                  return temparr;
                }
              })
            ];
            // console.log(vm.chartOptions.series.filter(x => x));
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
            ? this.measureFilter == variables.yld ||
              this.measureFilter == variables.daly
              ? parseFloat(dataloop[i][5])
              : parseFloat(dataloop[i][6])
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
            var temparr = vm.chartOptions.series;
            vm.chartOptions.series = [
              ...temparr.map(temparr => {
                if (temparr.data.length == 0) {
                  temparr.data = [null, null, null];
                  return temparr;
                } else if (temparr.data.length != 0) {
                  let tarr = temparr.data;
                  for (let a = 0; a < 3; a++) {
                    if (tarr[a] === undefined) tarr[a] = null;
                  }
                  temparr.data = [...tarr];
                  return temparr;
                }
              })
            ];
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
      populationdata: "",
      chartType: "",
      diseaseFlag: false,
      width: "",
      selections: "age",
      diseases: variables.diseases_yll,
      genderFilter: variables.gender_main_var,
      ageFilter: variables.age_main_var,
      siteFilter: variables.site_main_var,
      measureFilter: variables.yll,
      measureFilterTemp : variables.yll,
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
          type: "line"
        },
        title: {
          text: "Diseases aggregated line chart : age-wise"
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          min: 0,
          title: {
            text: "YLL Counts"
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
        series: [
          
        ]
      }
    };
  },
  destroyed() {
    EventBus.$off("ou-created", this.getApiData);
    EventBus.$off("ou-changed", this.getApiData);
    EventBus.$off("param-pointChart", this.getApiData);
    EventBus.$off("filters", this.setFilters);
    EventBus.$off("chartChange", this.changeChart);
  }
};
</script>
<style scoped>
.chart {
  width: 100%;
  height:80vm;
  margin: 0 auto;
}
</style>
