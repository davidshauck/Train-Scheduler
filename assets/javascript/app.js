// load jquery
$(document).ready(function() { 

let rowNumber = 0;
let trainArray = [];
// let trainArray = [];

    $("#add-train").on("click", function(event) {
        event.preventDefault();
        let currentHour = new Date().getHours();
        let currentMinutes = new Date().getMinutes();
        console.log(currentHour + ":" + currentMinutes);

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
        console.log("split time: " + splitTime[0]);
        console.log("train frequency: " + trainFreq);

        console.log("current hour: " + currentHour);
        console.log("current minutes: " + currentMinutes);
        let elapsedHours = currentHour - splitTime[0];
        let elapsedMinutes = currentMinutes - splitTime[1];
        console.log("elapsed hours:" + elapsedHours);
        console.log("elapsed minutes: " + elapsedMinutes);
        let totalElapsedMinutes = (elapsedHours*60 + elapsedMinutes);
        console.log("total elapsed minutes: " + totalElapsedMinutes);
        let remainder = (totalElapsedMinutes % trainFreq);
        console.log("remainder: " + remainder);
        let minutesAway = trainFreq - remainder;
        if (remainder === 0) {
            minutesAway = "Now arriving";
        }
        console.log("next train:" + minutesAway);

        // found this at https://www.tutorialspoint.com/online_javascript_editor.php
        let nextArrival = new Date();
        nextArrival.setMinutes( nextArrival.getMinutes() + minutesAway );
        console.log("next arrival: " + nextArrival);
        // got the slice functionality here https://stackoverflow.com/questions/8935414/getminutes-0-9-how-to-display-two-digit-numbers
        mins = ('0' + nextArrival.getMinutes()).slice(-2);
        nextArrival = (nextArrival.getHours() + ":" + mins);
        console.log("next arrival: " + nextArrival);



        let trainData = [trainName, trainDest, trainFreq, nextArrival, minutesAway];
        // console.log("train array:" + trainData);
    
        // trainData.forEach(() => 
        trainArray = [...trainArray, {
            "name": trainName, 
            "destination": trainDest, 
            "frequency": trainFreq, 
            "next": nextArrival, 
            "away": minutesAway
            }]
        
        // )
        console.log(trainArray);

        isNumber(trainName, trainDest, trainFreq, nextArrival, minutesAway);
        

    });

    // Functions

    // WORKS
    function isNumber(trainName, trainDest, trainFreq, nextArrival, minutesAway) {
        if ($.isNumeric(trainFreq)) {
            let newRow = $('<tr>');
                newRow.append('<td>' + trainName + "</td>")
                newRow.append('<td>' + trainDest + "</td>")
                newRow.append('<td>' + trainFreq + "</td>")
                newRow.append('<td>' + nextArrival + "</td>")
                newRow.append('<td>' + minutesAway + "</td>")
            $("tbody").append(newRow);
            rowNumber += 1;
            console.log(rowNumber);
            
        }
        else {
            $("#alert").html("Train time and frequency must be a number")
        }
    }







});