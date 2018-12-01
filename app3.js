function flip() {
    $('.card').toggleClass('flipped');
}



var storageRef;
var uploadTask;
var downloadURLRef;
var emoResultsRef;





function uploadProgress(snapshot) {
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  console.log('Upload is ' + progress + '% done');
  switch (snapshot.state) {
    case firebase.storage.TaskState.PAUSED: // or 'paused'
      console.log('Upload is paused');
      break;
    case firebase.storage.TaskState.RUNNING: // or 'running'
      console.log('Upload is running');
      break;
  }
}

function uploadError(error) {
  console.log(error);
  // A full list of error codes is available at
  // https://firebase.google.com/docs/storage/web/handle-errors
  switch (error.code) {
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;

    case 'storage/canceled':
      // User canceled the upload
      break;
    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
  }
}

function uploadSuccess() {
  uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
    console.log('File available at', downloadURL);
    imgSwap(downloadURL);
    downloadURLRef = downloadURL; //Make it global for later, except you should be able to do faceCall(downloadURL) to pass it in

    $('#uploadModal').modal('hide')
    $("#emo-button").show();

  });


}

function imgSwap(image) {
  $("#card-image").attr('src', image);
}

function upload() {
  event.preventDefault();

  var newImg = $('#imageInput')[0].files;
  console.log(newImg[0].name)

  var file = newImg[0];

  // Create the file metadata
  var metadata = {
    contentType: 'image/jpeg'
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    uploadProgress,
    uploadError,
    uploadSuccess);
  $(".card-text").text("Awww, cute. Now let's guess your feels...")
}

function displaySwap() {
  var sadnessText = "You're Sad. 😕 You could use a hug...and a drink";
  var sadButton = "sad-button";
  var happinessText = "You're happy! 😁 Great, let's celebrate!";
  var happyButton = "happy-button";
  var angerText = "You're angry. 😡 It's OK, let's calm you down";
  var angerButton = "angry-button";
  var fearText = "You're afraid! 😱 How about some liquid courage?";
  var fearButton = "fear-button"
  var disgustText = "You're disgusted. 😒 You cannot even with this day.";
  var disgustButton = "disgust-button";
  var surprisedText = "You're surprised! 😧 Didn't see that one comin', huh?";
  var surprisedButton = "surprised-button";
  var neutralText = "Damn! Do you play poker? 😐 We can't tell what you're feeling. How about a rando drink?";
  var neutralButton = "neutral-button";


  if (emoResultsRef === 'happiness') {
    $(".card-text").text(happinessText);
    $("#drink-button").attr("id", happyButton);

  } else if (emoResultsRef === 'sadness') {
    $(".card-text").text(sadnessText);
    $("#drink-button").attr("id", sadButton);

  } else if (emoResultsRef === 'anger') {
    $(".card-text").text(angerText);
    $("#drink-button").attr("id", angerButton);
  } 
    else if (emoResultsRef === "fear") {
    $(".card-text").text(fearText);
    $("#drink-button").attr("id", fearButton);
  } 
    else if (emoResultsRef === "digsust") {
    $(".card-text").text(disgustText);
    $("#drink-button").attr("id", disgustButton);
  } 
    else if (emoResultsRef === "surprise") {
    $(".card-text").text(surprisedText);
    $("#drink-button").attr("id", surprisedButton);
  } 
    else if (emoResultsRef === "neutral") {
    $(".card-text").text(neutralText);
    $("#drink-button").attr("id", neutralButton);
  }
}

  //cocktail DB and drink receipe  call:
    //  var cocktailQuery="https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";
    var drinkURL="https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="; 
    var options;
    var pass;
    
   var happy= ['14360', '14578', '14730', '15615', '15395', '12738', '17266', '17827', '17190', '14107', '17224', '16958', '13807', '15182', '12560', '13940', '15200', '11024', '15951'];
   var fear= [14642,
       14688,
       15178,
       15761,
       14610,
       16419,
       17250,
       17211,
       16178,
       16273,
       11028,
       14584,
       17074,
       11055,
       13086,
       17060,
       11407,
       11403,
       17230
     ]
  
   var anger=  [
       14065,
       12870,
       15597,
       16041,
       13222,
       13070,
       13861,
       14087,
       17122,
       12107,
       14306,
       16100,
       13202,
       11368,
       11239,
       17135
     ]
   
   
     var sadness = [17105,
       15288,
       16134,
       16271,
       17020,
       13194,
       16998,
       17245,
       11000,
       17229,
       11008,
       14071,
       11118,
       11119,
       17288,
       11117,
       11120,
       12798,
       12800,
       11157,
       16047
     ]
  
  
     var disgust= [15082,
       15515,
       15743,
       16295,
       17118,
       16403,
       17120,
       17220,
       17380,
       13128,
       14466,
       17829,
       12101,
       11023,
       14598,
       13581,
       17222,
       13070
     ]
   
   
  
     var surprise= [14602,
       16108,
       16333,
       16942,
       13940,
       17184,
       14782,
       11798,
       11872,
       13535,
       16992,
       13072,
       13198,
       13652,
       16405,
       14360,
       11010,
       13899,
       11053,
       15567,
       11034
     ]
    
     var neutral= [14598,
      13282,
      13395,
      11145,
      17196,
      11291,
      11006,
      13731,
      13162,
      11012,
      11013,
      11014,
      11020,
      12562,
      11021,
      12792,
      11026,
      16202]

 //Happy
 $(document).on("click", "#happy-button", function () {
  console.log("Your happy button is working!")
  options = Math.floor(Math.random() * happy.length);
  pass= happy[options];
  drinkCall(pass);
 });


 // //Fear
      $(document).on("click", "#fear-button", function () {
  console.log("Your fear button is working!")
  options = Math.floor(Math.random() * fear.length);
  pass= fear[options];
  drinkCall(pass);
 });



     //Anger
   $(document).on("click", "#anger-button", function () {
  console.log("Your fear button is working!")
  options = Math.floor(Math.random() * anger.length);
  pass=anger[options];
  drinkCall(pass);
 });


  //Sadness
  $(document).on("click", "#sad-button", function () {
  console.log("Your sad button is working!")
  options = Math.floor(Math.random() * sadness.length);
  pass= sadness[options];
  
  drinkCall(pass);
 });

 // //Disgust
  $(document).on("click", "#disigust-button", function () {
  console.log("Your disgust button is working!")
  options = Math.floor(Math.random() * disgust.length);
  pass= disgust[options];
  
  drinkCall(pass);
 });
 // //surprise
 $(document).on("click", "#surprised-button", function () {
  console.log("Your surprise button is working!")
  options = Math.floor(Math.random() * surprise.length);
  pass= surprise[options]
  drinkCall(pass);
 });

 //neutral
 $(document).on("click", "#neutral-button", function(){
  console.log("Your neutral button is working!")
  options = Math.floor(Math.random() * neutral.length);
  pass=neutral[options];
  console.log()
  drinkCall(pass);
 });
 

 //cocktailDB call 
 function drinkCall(){
 $.ajax({
   url: drinkURL + pass,
   method: "GET"
 }).then(function (response) {

   console.log(response)
             console.log(response.drinks[0].strDrink);
             console.log(response.drinks[0].strDrinkThumb);
             console.log(response.drinks[0].strIngredient1);
             console.log(response.drinks[0].strIngredient2);
             console.log(response.drinks[0].strIngredient3);
             console.log(response.drinks[0].strIngredient4);
             console.log(response.drinks[0].strIngredient5);
             console.log(response.drinks[0].strIngredient6);
             

   var response= response.drinks[0];
              
              $("#drink-modal").show();
             // drink name
             $("#drink-title").text("Drink Name: " + response.strDrink);
             // ingredients
             var ingredient = $("<div>");
             var p1 = $("<p>").text("Ingredient 1: " + response.strIngredient1);
             var p2 = $("<p>").text("Ingredient 2: " + response.strIngredient2);
             var p3 = $("<p>").text("Ingredient 3: " + response.strIngredient3);
             var p4 = $("<p>").text("Ingredient 4: " + response.strIngredient4);
             var p5 = $("<p>").text("Ingredient 5: " + response.strIngredient5);
             var p6 = $("<p>").text("Ingredient 6: " + response.strIngredient6);
             var p7 = $("<p>").text("Instructions: " + response.strInstructions);
                  
             $("#drink-body").append(p1, p2, p3, p4, p5, p6, p7);
             // images
            
             $("#drink-image").attr("src", response.strDrinkThumb);
            //  pic.attr("height", "200");
            //  $("#drink-image").append(pic);
 });
            $("#drink-close").on("click", function(){
              $("#drink-modal").hide();
            });
}

$(document).ready(function () {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAkeOji6fNofjU6hg6Y8ir1hot5SMeTPG4",
    authDomain: "picyourpoison-67571.firebaseapp.com",
    databaseURL: "https://picyourpoison-67571.firebaseio.com",
    projectId: "picyourpoison-67571",
    storageBucket: "picyourpoison-67571.appspot.com",
    messagingSenderId: "41383692048"
  };
  firebase.initializeApp(config);

  // var dataRef = firebase.database();

  $("#uploadModal").hide();
  $("#drink-button").hide();
  $("#emo-button").hide();
  $("#drink-modal").hide();

  storageRef = firebase.storage().ref();

  // FACE++ API START
  function faceCall() {

    var encodedimage = encodeURIComponent(downloadURLRef);
    var queryURL = "https://api-us.faceplusplus.com/facepp/v3/detect?api_key=ZQFa2mbqu5lJQm4MXM45qkevtVK_CfBS&api_secret=TVvl2HCex_7KfpbGbHGlAQzRPff0AULF&image_url=" + encodedimage + "&return_attributes=emotion"
    //   // Performing AJAX GET request

    $.ajax({
        url: queryURL,
        method: "POST"
      })
      //     // After data comes back from the request
      .then(function (response) {
        // storing the data from the AJAX request in the results variable
        var results = response.faces[0].attributes.emotion;
        console.log(results);
        // Creating an array of the Objects key values and detriming the highest value
        var arr = Object.keys(results).map(function (key) {
          return results[key];
        });
        var max = Math.max.apply(null, arr);
        console.log("highest key value: " + max);
        // Creating a forEach loop to determin which emotion object is associated to the highest key value
        Object.keys(results).forEach(function (key) {
          if (results[key] === max) {
            var emoResults = key;

            console.log("Your emotional state is: " + emoResults);
            //FACE++ API END
            emoResultsRef = emoResults;
            $("#drink-button").show();
            $("#emo-button").hide();
            displaySwap(emoResultsRef);

          }
        })
      })
  };


  //text and image swap based on emotional result



  
$("#uploadBtn").on("click", upload);
$("#emo-button").on("click", faceCall);

});

