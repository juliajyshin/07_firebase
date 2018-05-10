// on click event
$("#add-train").on("click", function (event) {

    // prevent page from refreshing when form tries to submit itself
    event.preventDefault();

    // Capture user inputs and store them into variables
    var trainName = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
    };

    // Uploads train data to the database
    trainData.ref().push(newTrain);

    // Console log each of the user inputs to confirm we are receiving them
    console.log(trainName);
    console.log(destination);
    console.log(firstTrain);
    console.log(frequency);

    // Alert
    alert("Train successfully added");

    // Clears all the text boxes
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");

});

trainData.ref().on("child_added", function (childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store Current Data from Firebase into our site
    var tName = childSnapshot.val().name;
    var tFrequency = childSnapshot.val().frequency;
    var tDestination = childSnapshot.val().destination;
    var tFirstTrain = childSnapshot.val().firstTrain;
    // Moment.js Time Data
    var timeArr = tFirstTrain.split(":");
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;

    //If the first train is later than the current time, sent arrival to the first train time
    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {

        // Calculate the minutes until arrival using hardcore math
        // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
        // and find the modulus between the difference and the frequency.
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
        // To calculate the arrival time, add the tMinutes to the currrent time
        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);

    // Add train data into the table
    $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
        tFrequency + "</td><td>" + tFirstTrain + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
});

// // Replaces the content in the "Current Train Schedule" div with the new train info
// $("#tname-display").text(name);
// $("#tdestination-display").text(destination);
// $("#tfirst-train-input-display").text(firstTrain);
// $("#tfrequency-display").text(frequency);

// // Clear localStorage
// localStorage.clear();

// // Store all content into localStorage
// localStorage.setItem("name", name);
// localStorage.setItem("destination", destination);
// localStorage.setItem("firstTrain", firstTrain);
// localStorage.setItem("frequency", frequency);




// // By default display the content from localStorage
// $("#name-display").text(localStorage.getItem("name") || '');
// $("#destination-display").text(localStorage.getItem("destination") || '');
// $("#first-train-input-display").text(localStorage.getItem("firstTrain") || '');
// $("#frequency-display").text(localStorage.getItem("frequency") || '');

