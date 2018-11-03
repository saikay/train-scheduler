  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB3RYfzltzs2ZydHUPr9MzsRy902OU5D7g",
    authDomain: "train-scheduler-93c90.firebaseapp.com",
    databaseURL: "https://train-scheduler-93c90.firebaseio.com",
    projectId: "train-scheduler-93c90",
    storageBucket: "train-scheduler-93c90.appspot.com",
    messagingSenderId: "1062382492254"
  };
  firebase.initializeApp(config);
  database = firebase.database();

  //on submit get inputs, insert values into firebase.
  $("#submit").on("click", function(){
      event.preventDefault();
      var name = $("#name").val();
      var destination = $("#destination").val();
      var firstTrain = $("#firstTrain").val();
      var frequency = $("#frequency").val();
      var param = {
          name: name,
          destination: destination,
          firstTrain: firstTrain,
          frequency: frequency
      }
      insertTrainRecord(param);
  });

  database.ref().on("child_added",function(snapshot){
    var record = snapshot.val();
    var arr = [];
    var result = getTimeLeft(record.firstTrain);
    var timeLeft = record.frequency - (getTimeLeft(record.firstTrain)  % parseInt(record.frequency));
    var multiplier = Math.ceil(result / record.frequency);
    var nextArrival = moment(record.firstTrain,"HH:mm").add(multiplier * record.frequency,"minutes").format("HH:mm");
    arr.push(record.name);
    arr.push(record.destination);
    arr.push(record.frequency);
    arr.push(nextArrival);
    arr.push(timeLeft);
    appendTable(arr);
    
  })

  function insertTrainRecord(param){
    database.ref().push(param);
  }
  
//assuming time always HH:mm, split time
//set it today's hour and minute subtract, current time.  
function getTimeLeft(time){
  var today = new Date();
  currentTime = today.getTime();
  today.setHours(time.split(":")[0]);
  today.setMinutes(time.split(":")[1]);
  var firstTrainTime = today.getTime();
  //return in minutes
  return (currentTime - firstTrainTime) / 1000 / 60;
}

  //create a row
  function appendTable(arr){
    var tr = $("<tr>");
    
    arr.forEach(function(item){
        var td = $("<td>");
        td.text(item);
        tr.append(td);
    })
    $("table").append(tr);
  }