<template>
    <highcharts id="allcharts" :constructor-type="'mapChart'" :options="mapOptions" class="map"></highcharts>
</template>

<script>
    import mapdata from "../../indiamap.json";
    import variables from "../../config.js";
    import axios from "axios";
    import { EventBus } from "../../event-bus";
    let populationdata= [];
    export default {
        data() {
            return {

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
                        map: mapdata,
                        mapZoom:5
                    },

                    title: {
                        text: ""
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
                            name: "Counts",
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
            },
            ageFilter: function (value) {
                if (value!=null)
                {
                    this.loadMapData();
                }
            },

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
                    this.mapOptions.series[0].name = "Rate";
                    this.loadMapData();
                } else if (v == "count") {
                    this.chartType = "count";
                    this.mapOptions.series[0].name = "Counts";
                    this.loadMapData();
                } else {
                }
                // this.getApiData();
            },

            handleShowHide: function() {
                $(".percentunit").attr("disabled", "disabled");
                $(".population_class").attr("disabled", "disabled");
                $(".rightbarsite").addClass("hidediv");
                $(".rightbargender").addClass("hidediv");
                $(".rightbardisease").removeClass("hidediv");

            },

            setFilters: function(params) {
                if (params.filter == "measure") {
                    this.diseaseFlag = false;
                    this.measureFilter = params.value;
                    this.ageFilter = params.value;
                    this.measureFilterTemp = params.value;
                }
                else if (params.filter == "age") {

                    this.ageFilter = params.value;
                }
                else {
                    if (params.value.id != "") {
                        this.diseaseFlag = true;
                        this.measureFilter = params.value.id;

                    } else {
                        this.diseaseFlag = false;
                        this.measureFilter = this.measureFilterTemp;
                    }
                }
            },
            setSelections: function(params) {
                this.selections = params.type;
                this.genderFilter = variables.gender_main_var;
                this.ageFilter = variables.age_main_var;
                this.siteFilter = variables.site_main_var;
                this.measureFilter = variables.yll;
            },
            loadMapData: function() {
                this.handleShowHide();
                var vm = this;
                var age_var="";
                if (this.chartType == "rate") {

                    vm.chartType = "rate";
                    this.getPopulationData("age");
                    var defaultIndiaApi =
                        "../../analytics.json?dimension=pe:2015&dimension=ou:" +
                        variables.allouIDs +
                        "&dimension=dx:" +
                        this.measureFilter +
                        "&dimension=" +
                        variables.age_id +
                        ":" +
                        this.ageFilter +
                        "&displayProperty=NAME&outputIdScheme=UID";

                    age_var=this.ageFilter;
                    axios.get(defaultIndiaApi).then(response => {
                        var loopdata = response.data.rows;
                        let temp = JSON.parse(JSON.stringify(variables.statesMapData));
                        setTimeout(function () {
                            for (let i = 0, len = loopdata.length; i < len; i++) {
                                var ouid = loopdata[i][2];
                                //@Sou todo calculate world standard rate
                                var value = parseFloat(loopdata[i][4]).toFixed(2);
                                if (temp[0][ouid] !== undefined) {
                                    temp[0][ouid].data += parseFloat(value);
                                }
                                if (i == len - 1) {
                                    $("#loader").show();
                                    var temp_arr = [];

                                    for (let j = 0; j < Object.keys(temp[0]).length; j++) {

                                        if(age_var=="LJglh3dKkBF")
                                        {
                                            temp_arr.push([
                                                variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                                temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data*88600 ]);
                                        }
                                        else if(age_var=="ppIxci61gTu")
                                        {
                                            temp_arr.push([
                                                variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                                temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data*246200 ]);

                                        }
                                        else if(age_var=="rHmIMu8bVmy")
                                        {
                                            temp_arr.push([
                                                variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                                temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data*15450]);

                                        }
                                        else if(age_var=="FPQcIz7kBvD")
                                        {
                                            temp_arr.push([
                                                variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                                temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data*66800 ]);

                                        }
                                        else if(age_var=="fuZTseIa9nS")
                                        {
                                            temp_arr.push([
                                                variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                                temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data*37300 ]);

                                        }
                                        else if(age_var=="fuZTseIa9nS")
                                        {
                                            temp_arr.push([
                                                variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                                temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data*99200 ]);

                                        }
                                        else if(age_var=="yvdQkzHuq2E")
                                        {
                                            temp_arr.push([
                                                variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                                temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data*274900 ]);

                                        }
                                        else if(age_var=="Y80cGPh9cA9")
                                        {
                                            temp_arr.push([
                                                variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                                temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data*172900]);

                                        }
                                        else {


                                            temp_arr.push([
                                                variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                                temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data ]);
                                        }
                                        for(let h=0;h<populationdata.length;h++)
                                        {
                                            for (let k=0;k<temp_arr.length;k++)
                                            {
                                                if (populationdata[h][0]==temp_arr[k][0])
                                                {
                                                    console.log("before",temp_arr[k][1]);
                                                    temp_arr[k][1]= (temp_arr[k][1]/populationdata[h][1]*100000).toString();
                                                    
                                                    if(temp_arr[k][1].indexOf("e") !== -1) {
                                                    let val = temp_arr[k][1].split("e");
                                                    let val1 = Number(val[0]).toFixed(2);
                                                    let val2 = val[1];
                                                    temp_arr[k][1] =  Number(val1+"e"+val2);
                                                    }
                                                    else {
                                                        if(temp_arr[k][1].indexOf(".") !== -1) {
                                                            let val = temp_arr[k][1].split(".");
                                                            let val1 = val[0];
                                                            let val2 = val[1];
                                                            if(val1 >= 1) {
                                                                temp_arr[k][1] = Number(temp_arr[k][1]).toFixed(2);
                                                            } else {
                                                                for(let i = 0; i < val2.length; i++) {
                                                                    if(val2[i] == 0) {
                                                                        continue;
                                                                    }else {
                                                                        let val3 = val2.slice(0,i+1)
                                                                         temp_arr[k][1] =  Number(val1 + "." + val3);
                                                                         break;
                                                                    }

                                                                }
                                                            }

                                                        } else {
                                                            temp_arr[k][1] = Number(temp_arr[k][1])
                                                        }
                                                    }
                                                    console.log("after",temp_arr[k][1]);
                                                }
                                            }
                                        }


                                    }
                                    setTimeout(function () {

                                        vm.mapOptions.series[0].data = [...temp_arr];
                                        // console.log(vm.mapOptions.series[0].data);
                                        $("#loader").hide();
                                    }, 2000);
                                }
                            }
                        }, 2000);

                    });
                }
                else if (this.chartType == "count") {
                    var defaultIndiaApi =
                        "../../analytics.json?dimension=pe:2015&dimension=ou:" +
                        variables.allouIDs +
                        "&dimension=dx:" +
                        this.measureFilter +
                        "&dimension=" +
                        variables.age_id +
                        ":" +
                        this.ageFilter +
                        "&displayProperty=NAME&outputIdScheme=UID";

                    axios.get(defaultIndiaApi).then(response => {
                        var loopdata = response.data.rows;
                        let temp = JSON.parse(JSON.stringify(variables.statesMapData));
                        for (let i = 0, len = loopdata.length; i < len; i++) {
                            var ouid = loopdata[i][2];
                            var value = parseFloat(loopdata[i][4]);
                            if (temp[0][ouid] !== undefined) {
                                temp[0][ouid].data += value;
                            }

                            if (i == len - 1) {
                                vm = this;
                                $("#loader").show();
                                var temp_arr = [];
                                for (let j = 0; j < Object.keys(temp[0]).length; j++) {
                                    temp_arr.push([
                                        variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                        temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data
                                    ]);
                                }
                                setTimeout(function () {
                                    vm.mapOptions.series[0].data = [...temp_arr];
                                    $("#loader").hide();
                                }, 2000);
                            }
                        }
                    });
                }
            },
            getPopulationData: function(type) {
                debugger;
                var age_var="";
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

                var vm = this;
                var defaultIndiaApi =
                    "../../analytics.json?dimension=pe:2015&dimension=ou:" +
                    variables.allouIDs +
                    "&dimension=" +
                    variables.age_id +
                    ":" +
                    this.ageFilter +
                    "&dimension=dx:gNaskBzw5Nq&displayProperty=NAME&outputIdScheme=UID";
                age_var=this.ageFilter;
                axios.get(defaultIndiaApi).then(response => {
                    var loopdata = response.data.rows;
                    let temp = JSON.parse(JSON.stringify(variables.statesMapData));
                    setTimeout(function () {
                        for (let i = 0, len = loopdata.length; i < len; i++) {
                            var ouid = loopdata[i][2];
                            //@Sou todo calculate world standard rate
                            var value = parseFloat(loopdata[i][4]).toFixed(2);
                            if (temp[0][ouid] !== undefined) {
                                temp[0][ouid].data += parseFloat(value);
                            }
                            if (i == len - 1) {
                                var temp_arr_rate = [];
                                $("#loader").show();

                                for (let j = 0; j < Object.keys(temp[0]).length; j++) {
                                    if(age_var=="LJglh3dKkBF")
                                    {
                                        temp_arr_rate.push([
                                            variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                            temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data ]);

                                    }
                                    else if(age_var=="ppIxci61gTu")
                                    {
                                        temp_arr_rate.push([
                                            variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                            temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data ]);

                                    }
                                    else if(age_var=="rHmIMu8bVmy")
                                    {
                                        temp_arr_rate.push([
                                            variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                            temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data]);

                                    }
                                    else if(age_var=="FPQcIz7kBvD")
                                    {
                                        temp_arr_rate.push([
                                            variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                            temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data ]);

                                    }
                                    else if(age_var=="fuZTseIa9nS")
                                    {
                                        temp_arr_rate.push([
                                            variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                            temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data ]);

                                    }
                                    else if(age_var=="fuZTseIa9nS")
                                    {
                                        temp_arr_rate.push([
                                            variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                            temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data ]);

                                    }
                                    else if(age_var=="yvdQkzHuq2E")
                                    {
                                        temp_arr_rate.push([
                                            variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                            temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data ]);

                                    }
                                    else if(age_var=="Y80cGPh9cA9")
                                    {
                                        temp_arr_rate.push([
                                            variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                            temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data]);

                                    }
                                    else {
                                        temp_arr_rate.push([
                                            variables.statesMapName[0][Object.keys(temp[0])[j]] === undefined ? "" : variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                                            temp[0][Object.keys(temp[0])[j]].data == 0 ? temp[0]['Cbw7y8SiYyW'].data : temp[0][Object.keys(temp[0])[j]].data ]);
                                    }
                                    if (i == loopdata.length - 1) {
                                        if (type == "age") populationdata = temp_arr_rate;
                                    }


                                }
                            }
                        }
                    }, 2000);

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