let firebaseConfig = {
    apiKey: "AIzaSyD-ZGUA_AONSxTUO6tPoz-GNe8XdgkZAGw",
    authDomain: "the-squadject.firebaseapp.com",
    databaseURL: "https://the-squadject.firebaseio.com",
    projectId: "the-squadject",
    storageBucket: "the-squadject.appspot.com",
    messagingSenderId: "562788673867",
    appId: "1:562788673867:web:0ebe54436853f543a420ce"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

// load jquery
$(document).ready(function() { 

// snapshot of database

let trainName = "";
let trainDest = "";
let firstTrain = "";
let trainFreq = "";
let timer = 30;

database.ref("/trainTimes").on("child_added", function(snapshot) {

let sv = snapshot.val();
newRow = {};
// $("tbody").html(" ");


newTimes(sv);




// let closeBtn = $("<button>");
//     closeBtn.attr("data-close", i);
//     closeBtn.addClass("checkbox");
//     closeBtn.text("✓");

    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
});


// start timer
let intervalID = setInterval(countdown, 1000);

// when user clicks submit
$("#add-train").on("click", function(event) {
    event.preventDefault();

    // clear alert div
    $("#alert").html("");


    // let currentHour = new Date().getHours();
    // let currentMinutes = new Date().getMinutes();


    
    // user inputs
    trainName = $("#train-name").val().trim();
    trainDest = $("#train-destination").val().trim();
    firstTrain = $("#first-train").val().trim();
    trainFreq = $("#train-frequency").val().trim();
    trainFreq = parseInt(trainFreq);

    database.ref("/trainTimes").push({
        name: trainName,
        destination: trainDest,
        first: firstTrain,
        frequency: trainFreq,
      });   


    

});

// FUNCTIONS



// timer function
function countdown() {

    
    timer--;
    $("#timer").html("The schedule will update in " + timer + " seconds");
    if (timer === 0) {
        timer = 30;
        newRow = {};
        $("tbody").html(" ");
        clearInterval(intervalID);
        intervalID = setInterval(countdown, 1000);
        database.ref("/trainTimes").on("child_added", function(snapshot) {
            // $("tbody").html(" ");


        sv = snapshot.val();
        newTimes(sv);

    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
});
        
    }
}



    function newTimes(sv) {


        
        // sv = snapshot.val();


        firstTimeConverted = moment(sv.first, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);
    
        currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    
        diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
    
        tRemainder = diffTime % sv.frequency;
        console.log(tRemainder);
    
        tMinutesTillTrain = sv.frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    
        nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        // $("tbody").html(" ");
        let newRow = $("<tr>");
        // newRow.attr("id", "row-number-" + i);
            newRow.append('<td>' + sv.name + "</td>")
            newRow.append('<td>' + sv.destination + "</td>")
            newRow.append('<td>' + sv.frequency + "</td>")
            newRow.append('<td>' + moment(nextTrain).format("hh:mm") + "</td>") // local calculation
            newRow.append('<td>' + tMinutesTillTrain + "</td>") // local calculation
            // newRow.prepend(closeBtn);
        $("tbody").append(newRow);
        console.log("new row " + newRow);


    }

});