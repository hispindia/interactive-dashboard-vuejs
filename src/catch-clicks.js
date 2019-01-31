import { EventBus } from "./event-bus";

import Vue from 'vue';
var vm = new Vue({
    el: "#hidden",
    methods: {
        callAnotherComponent: function (v) {
            EventBus.$emit("catchclicks", v);
        }
    }
});

var clicks = {
    globalId: "",
    globalClass: "",
    getElementById: function (id) {
        console.log(document.getElementById(id).innerHTML);
    },
    getElementsByClassName: function (className) {
        console.log(document.getElementsByClassName(className));
    },
    getElementsByTagName: function (tagName) {
        console.log(document.getElementsByTagName(tagName));
    },
    setIdToCatchClicks: function (id) {
        this.globalId = "#" + id
        console.log(this.globalId)
    },
    setClassToCatchClicks: function (className) {
        this.globalClass = className
        console.log(this.globalClass)
    },
    toggleClass: function (id) {
        $('.selected-xaxis').removeClass("selected-xaxis");
        let element = document.getElementById(id);
        if (element !== undefined) {
            element.classList.add("selected-xaxis");
        }
    }
};

$('body').click(function (e) {
    var target = $(e.target);
    if (target !== undefined) {
        
        if (target[0].className.includes(clicks.globalClass)) {
            clicks.toggleClass(target[0].id);
            vm.callAnotherComponent(target[0].id);
        }
    }
});
$(document).ready(function () {
    console.log("-! calling bridge functions for catching clicks !- ");
});

export default clicks;