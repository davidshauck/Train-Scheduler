let firebaseConfig = {
    apiKey: "AIzaSyD-ZGUA_AONSxTUO6tPoz-GNe8XdgkZAGw",
    authDomain: "the-squadject.firebaseapp.com",
    databaseURL: "https://the-squadject.firebaseio.com",
    projectId: "the-squadject",
    storageBucket: "the-squadject.appspot.com",
    messagingSenderId: "562788673867",
    appId: "1:562788673867:web:0ebe54436853f543a420ce"
};

// initialize firebase
firebase.initializeApp(firebaseConfig);

// create a variable for the database
let database = firebase.database();

// jQuery
$(document).ready(function() { 

// create global variables
let trainName = "";
let trainDest = "";
let firstTrain = "";
let trainFreq = "";
let sv = ""; // snapshot value
let timer = 30;

// start timer
let intervalID = setInterval(countdown, 1000);

// when user clicks submit
$("#add-train").on("click", function(event) {
    event.preventDefault();

    // creating unique key so trains can be deleted
    let trainKey = firebase.database().ref().child('/trainTimes').push().key;

    // user inputs
    trainName = $("#train-name").val().trim();
    trainDest = $("#train-destination").val().trim();
    firstTrain = $("#first-train").val().trim();
    trainFreq = $("#train-frequency").val().trim();
    trainFreq = parseInt(trainFreq);

    // push updates to firebase
    database.ref("/trainTimes").push({
        name: trainName,
        destination: trainDest,
        first: firstTrain,
        frequency: trainFreq,
        trainId: trainKey
        });   

    // clear the table before updating to avoid duplicates
    $("tbody").html(" ");
    checkChanges();
    
});

// **************** //
// ** FUNCTIONS ** //
//****************/?

// timer function
function countdown() {

    // timer animation, first down
    $( "#timer" ).animate({
        width: "0%",
      }, 30000, );
      // then back up
      $( "#timer" ).animate({
        width: "100%"
      }, 30000 );  
          
    // decrement timer
    timer--;

    // put some text in the timer div so it stays colored
    $("#timer").text(".");

    // reset timer and table every 30 seconds
    if (timer === 0) {
        timer = 30;
        clearInterval(intervalID);

        // clear table
        $("tbody").html(" ");

        // reset counter
        intervalID = setInterval(countdown, 1000); 

        // ping firebase to update times
        checkChanges();
    
    }
}

// new time calculation. My home-grown calculation worked well but I figured I should get comfortable useing momentjs
function newTimes(sv) {

    startTime = moment(sv.first, "HH:mm").subtract(1, "years");
    currentTime = moment();
    difference = moment().diff(moment(startTime), "minutes");
    remainder = difference % sv.frequency;
    minutesAway = sv.frequency - remainder;
    nextTrain = moment().add(minutesAway, "minutes");
    
    // create the close button
    let closeBtn = $("<button>");
        closeBtn.attr("data-close", sv.trainId);
        closeBtn.addClass("checkbox");
        closeBtn.text("✓");
        closeBtn.addClass("close-button");

    // create table rows
    let newRow = $("<tr>");
        newRow.append('<td>' + sv.name + "</td>");
        newRow.append('<td>' + sv.destination + "</td>");
        newRow.append('<td>' + sv.frequency + "</td>");
        newRow.append('<td>' + moment(nextTrain).format("hh:mm") + "</td>")
        newRow.append('<td>' + minutesAway + "</td>") 
        newRow.prepend(closeBtn);
    // add the new row to the table body
    $("tbody").append(newRow);
    // clear out the newRow variable so it's ready for the next one
    newRow = " ";
}

// function for removing train
$(document.body).on("click", ".close-button", function() {

    // target the chckbox being pressed
    let removeRow = $(this).attr("data-close");

    // i got this remove function from stack overflow, still not entirely sure how it works
    let folder = firebase.database().ref('/trainTimes');
    let query = folder.orderByChild('trainId').equalTo(removeRow);
    query.on('child_added', function(childSnapshot) {    
        childSnapshot.ref.remove();
        // clear table and update changes
        $("tbody").html(" ");
        checkChanges();
            
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    
    });
        
});

// Listen for changes
database.ref("/trainTimes").on("child_added", function(childSnapshot) {

    sv = childSnapshot.val();
    // run newTimes function to update the times if there are
    newTimes(sv);

    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
});  

// trigger changes so times can update if there are no children added
function checkChanges() {
    // take a snapshot of the database when there are changes
    database.ref("/trainTimes").on("child_added", function(childSnapshot) {

    // make a variable from the snapshot
    sv = childSnapshot.val();

    // run the newTimes function to update to the lastest arrival times
    newTimes(sv);

    // error handling
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

}

});