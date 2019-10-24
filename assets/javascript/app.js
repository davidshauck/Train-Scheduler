// load jquery
$(document).ready(function() { 

let trainArray = [];
let nextArrival;
let timer = 30;
let splitTime = [];
let rowNumber = 0;

// start timer
let intervalID = setInterval(countdown, 1000);

// when user clicks submit
$("#add-train").on("click", function(event) {
    event.preventDefault();

    // incremement row number
    rowNumber += 1;
    rowNumnber = parseInt(rowNumber);
    console.log("high row" + rowNumber);

    let currentHour = new Date().getHours();
    let currentMinutes = new Date().getMinutes();

    // clear alert div
    $("#alert").html("");
    
    // user inputs
    let trainName = $("#train-name").val()
    let trainDest = $("#train-destination").val()
    let firstTrain = $("#first-train").val()
    let trainFreq = $("#train-frequency").val()
    trainFreq = parseInt(trainFreq);

    // split the start time into an array
    let splitTime = firstTrain.split(":");

    // formula to figure out next arrival and remaining minutes
    let elapsedHours = currentHour - splitTime[0];
    let elapsedMinutes = currentMinutes - splitTime[1];
    let totalElapsedMinutes = (elapsedHours*60 + elapsedMinutes);
    let remainder = (totalElapsedMinutes % trainFreq);
    let minutesAway = trainFreq - remainder;
        // I had "now arriving" but would have to set up another function to clear that out after a few seconds
        // if (remainder === 0) {   
        //     minutesAway = "Now arriving";
        // }

    // found this at https://www.tutorialspoint.com/online_javascript_editor.php
    let nextArrival = new Date();
    nextArrival.setMinutes( nextArrival.getMinutes() + minutesAway );

    // got the slice functionality here https://stackoverflow.com/questions/8935414/getminutes-0-9-how-to-display-two-digit-numbers
    mins = ('0' + nextArrival.getMinutes()).slice(-2);
    nextArrival = (nextArrival.getHours() + ":" + mins);

    // this is based on what I found here https://stackoverflow.com/questions/7858385/how-to-add-values-to-an-array-of-objects-dynamically-in-javascript
    trainArray = [...trainArray, {
        "rowNumber": rowNumber,
        "name": trainName, 
        "destination": trainDest, 
        "frequency": trainFreq, 
        "next": nextArrival, 
        "away": minutesAway,
        "startHour": splitTime[0],
        "startMinutes": splitTime[1],
        "first": firstTrain 
        }]

    // checks to see if the user entered a number for train fequency
    if ($.isNumeric(trainFreq)) {
        makeTable(trainArray)
    }
    else {
        $("#alert").html("Train time and frequency must be a number")
    }
    

});

// FUNCTIOONS

// creates the train schedule
function makeTable(trainArray) {
    $("tbody").html(" ");
    for (let i = 0; i < trainArray.length; i++) {
        let closeBtn = $("<button>");
        closeBtn.attr("data-close", i);
        closeBtn.addClass("checkbox");
        closeBtn.text("✓");
        let newRow = $("<tr>");
        newRow.attr("id", "row-number-" + i);
            newRow.append('<td>' + trainArray[i].name + "</td>")
            newRow.append('<td>' + trainArray[i].destination + "</td>")
            newRow.append('<td>' + trainArray[i].frequency + "</td>")
            newRow.append('<td>' + trainArray[i].next + "</td>")
            newRow.append('<td>' + trainArray[i].away + "</td>")
            newRow.prepend(closeBtn);
        $("tbody").append(newRow);
    }      
}

// removes row
$(document.body).on("click", ".checkbox", function() {
    let removeRow = $(this).attr("data-close");
    $("#row-number-" + removeRow).remove();
    trainArray = trainArray.splice(removeRow, 1);
    console.log(trainArray);
});


// timer function
function countdown() {
    timer--;
    $("#timer").html("The schedule will update in " + timer + " seconds");
    if (timer === 0) {
        timer = 30;
        clearInterval(intervalID);
        intervalID = setInterval(countdown, 1000);
        autoUpdate(trainArray);
    }
}


// updates table and variables every timer interval
function autoUpdate(trainArray) {

    // clear the table body
    $("tbody").html(" ");

    // loop through the array to create updates
    for (let i = 0; i < trainArray.length; i++) {

        currentHour = new Date().getHours();
        currentMinutes = new Date().getMinutes();
        elapsedHours = currentHour - trainArray[i].startHour;
        elapsedMinutes = currentMinutes - trainArray[i].startMinutes;
        totalElapsedMinutes = (elapsedHours*60 + elapsedMinutes);
        remainder = (totalElapsedMinutes % trainArray[i].frequency);
        minutesAway = trainArray[i].frequency - remainder; 
        trainArray[i].away = minutesAway;

        // update current time
        trainArray[i].next = new Date();
        trainArray[i].next.setMinutes(trainArray[i].next.getMinutes() + minutesAway);
        // got the slice functionality here https://stackoverflow.com/questions/8935414/getminutes-0-9-how-to-display-two-digit-numbers
        mins = ('0' + trainArray[i].next.getMinutes()).slice(-2);
        trainArray[i].next = (trainArray[i].next.getHours() + ":" + mins);
        console.log("next arrival: " + trainArray[i].next);

        // update variables
        trainName = trainArray[i].name;
        trainDest = trainArray[i].destination;
        trainFreq = trainArray[i].frequency;
        firstTrain = trainArray[i].first;
        nextArrival = trainArray[i].next;
        splitTime = firstTrain.split(":")
        startHour = trainArray[i].startHour;
        startMinutes = trainArray[i].startMinutes;
        trainFreq = parseInt(trainFreq);

        // update table
        closeBtn = $("<button>");
        closeBtn.attr("data-close", i);
        closeBtn.addClass("checkbox");
        closeBtn.text("✓");
        newRow = $('<tr>');
        newRow.attr("id", "row-number-" + i);
            newRow.append('<td>' + trainArray[i].name + "</td>")
            newRow.append('<td>' + trainArray[i].destination + "</td>")
            newRow.append('<td>' + trainArray[i].frequency + "</td>")
            newRow.append('<td>' + trainArray[i].next + "</td>")
            newRow.append('<td>' + trainArray[i].away + "</td>")
            newRow.prepend(closeBtn);
        $("tbody").append(newRow);

    }
        // update train array
        trainArray = [...trainArray, {
            "rowNumber": rowNumber,
            "name": trainName, 
            "destination": trainDest, 
            "frequency": trainFreq, 
            "next": nextArrival, 
            "away": minutesAway,
            "startHour": splitTime[0],
            "startMinutes": splitTime[1],
            "first": firstTrain 
            }]

    }

});