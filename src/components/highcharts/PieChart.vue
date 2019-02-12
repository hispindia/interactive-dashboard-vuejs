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
            ? ((this.chartOptions.series = []),
              alert("No data at this organisation Unit!"),
              $("#loader").hide())
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
      let temp = JSON.parse(JSON.stringify(this.diseases));
      var male = 0,
        maledata = [];
      var female = 0,
        femaledata = [];
      for (let i = 0, len = dataloop.length; i < len; i++) {
        var disease_id = dataloop[i][0];
        var value =
          this.ou == variables.indiaOuId
            ? parseInt(dataloop[i][6])
            : parseInt(dataloop[i][5]);
        var gender_id = dataloop[i][2];
        if (gender_id == variables.gender_male_id) {
          male += value;
          maledata.push({
            name: temp[0][disease_id].name,
            y: value,
            color: "lightgreen"
          });
        } else {
          female += value;
          femaledata.push({
            name: temp[0][disease_id].name,
            y: value,
            color: "lightblue"
          });
        }
        if (i == len - 1) {
          var vm = this;
          var tempArr = [];
          var tempOuter = [];
          tempArr.push({ y: male, name: "Male", color: "green" });
          tempArr.push({ y: female, name: "Female", color: "blue" });
          tempOuter = [...maledata, ...femaledata];
          setTimeout(function() {
            vm.chartOptions.series[0].data = [...tempArr];
            vm.chartOptions.series[1].data = [...tempOuter];
            console.log(tempArr);
            console.log(tempOuter);
            $("#loader").hide();
          }, 2000);
        }
      }
    },
    sortDataByAge: function(dataloop) {
      $("#btnAge").addClass("selected-option");
      let temp = JSON.parse(JSON.stringify(this.diseases));
      var age_04 = 0,
        age_04_data = [];
      var age_514 = 0,
        age_514_data = [];
      var age_1529 = 0,
        age_1529_data = [];
      var age_3049 = 0,
        age_3049_data = [];
      var age_5059 = 0,
        age_5059_data = [];
      var age_6069 = 0,
        age_6069_data = [];
      var age_7079 = 0,
        age_7079_data = [];
      var age_80above = 0,
        age_80above_data = [];
      for (let i = 0, len = dataloop.length; i < len; i++) {
        var disease_id = dataloop[i][0];
        var value =
          this.ou == variables.indiaOuId
            ? parseInt(dataloop[i][6])
            : parseInt(dataloop[i][5]);
        var age_id = dataloop[i][3];
        if (age_id == variables.age_0_4_id) {
          age_04 += value;
          age_04_data.push({
            name: temp[0][disease_id].name,
            y: value,
            color: "lightgreen"
          });
        } else if (age_id == variables.age_5_14_id) {
          age_514 += value;
          age_514_data.push({
            name: temp[0][disease_id].name,
            y: value,
            color: "lightblue"
          });
        } else if (age_id == variables.age_15_29_id) {
          age_1529 += value;
          age_1529_data.push({
            name: temp[0][disease_id].name,
            y: value,
            color: "lightyellow"
          });
        } else if (age_id == variables.age_30_49_id) {
          age_3049 += value;
          age_3049_data.push({
            name: temp[0][disease_id].name,
            y: value,
            color: "lightpink"
          });
        } else if (age_id == variables.age_50_59_id) {
          age_5059 += value;
          age_5059_data.push({
            name: temp[0][disease_id].name,
            y: value,
            color: "lightgray"
          });
        } else if (age_id == variables.age_60_69_id) {
          age_6069 += value;
          age_6069_data.push({
            name: temp[0][disease_id].name,
            y: value,
            color: "lightcoral"
          });
        } else if (age_id == variables.age_70_79_id) {
          age_7079 += value;
          age_7079_data.push({
            name: temp[0][disease_id].name,
            y: value,
            color: "lightskyblue"
          });
        } else {
          age_80above += value;
          age_80above_data.push({
            name: temp[0][disease_id].name,
            y: value,
            color: "lightcyan"
          });
        }
        if (i == len - 1) {
          var vm = this;
          var tempArr = [];
          var tempOuter = [];
          tempArr.push({ name: "0-4 years", y: age_04, color: "green" });
          tempArr.push({ name: "5-14 years", y: age_514, color: "blue" });
          tempArr.push({ name: "15-29 years", y: age_1529, color: "yellow" });
          tempArr.push({ name: "30-49 years", y: age_3049, color: "pink" });
          tempArr.push({ name: "50-59 years", y: age_5059, color: "gray" });
          tempArr.push({ name: "60-69 years", y: age_6069, color: "coral" });
          tempArr.push({ name: "70-70 years", y: age_7079, color: "skyblue" });
          tempArr.push({
            name: "80 years and above",
            y: age_80above,
            color: "cyan"
          });
          tempOuter = [
            ...age_04_data,
            ...age_514_data,
            ...age_1529_data,
            ...age_3049_data,
            ...age_5059_data,
            ...age_6069_data,
            ...age_7079_data,
            ...age_80above_data
          ];
          setTimeout(function() {
            vm.chartOptions.series[0].data = [...tempArr];
            vm.chartOptions.series[1].data = [...tempOuter];
            $("#loader").hide();
          }, 2000);
        }
      }
    },
    sortDataBySite: function(dataloop) {
      $("#btnSite").addClass("selected-option");
      let temp = JSON.parse(JSON.stringify(this.diseases));
      var urban = 0,
        urbandata = [];
      var rural = 0,
        ruraldata = [];
      for (let i = 0, len = dataloop.length; i < len; i++) {
        var disease_id = dataloop[i][0];
        var value =
          this.ou == variables.indiaOuId
            ? parseInt(dataloop[i][6])
            : parseInt(dataloop[i][5]);
        var site_id = dataloop[i][4];
        if (site_id == variables.site_urban_id) {
          urban += value;
          urbandata.push({
            name: temp[0][disease_id].name,
            y: value,
            color: "lightgreen"
          });
        } else {
          rural += value;
          ruraldata.push({
            name: temp[0][disease_id].name,
            y: value,
            color: "lightblue"
          });
        }
        if (i == len - 1) {
          var vm = this;
          var tempArr = [];
          var tempOuter = [];
          tempArr.push({ name: "Urban", y: urban, color: "green" });
          tempArr.push({ name: "Rural", y: rural, color: "blue" });
          tempOuter = [...urbandata,...ruraldata];
          setTimeout(function() {
            vm.chartOptions.series[0].data = [...tempArr];
            vm.chartOptions.series[1].data = [...tempOuter];
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
            vm.chartOptions.series[1].data = [];
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
          type: "pie"
        },
        title: {
          text: "Pie chart"
        },
        yAxis: {
          title: {
            text: "YLL counts"
          }
        },
        tooltip: {
          valueSuffix: ""
        },
        plotOptions: {
          pie: {
            shadow: false,
            center: ["50%", "50%"]
          }
        },
        series: [
          {
            name: "Total Patients",
            data: [],
            size: "90%",
            turboThreshold: 0,
            dataLabels: {
              distance: -150,
              color: "white",
              style: {
                fontSize: "16px"
              }
            }
          },
          {
            name: "Diseases",
            data: [],
            size: "90%",
            innerSize: "60%",
            turboThreshold: 0,
            dataLabels: {
              formatter: function() {
                // display only if larger than 2000000
                return this.y > 2000000
                  ? "<b>" + this.point.name + ":</b> " + this.y
                  : null;
              }
            }
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
.chart {
  width: 90%;
  height: 90%;
  margin: 0 auto;
}
</style>
