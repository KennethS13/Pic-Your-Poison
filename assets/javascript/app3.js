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
  var sadnessText = "You're Sad. You could use a hug...and a drink";
  var sadButton = "sad-button";
  var happinessText = "You're happy! Great, let's celebrate!";
  var happyButton = "happy-button";
  var angerText = "You're angry. It's OK, let's calm you down";
  var angerButton = "angry-button";
  var fearText = "You're afraid! How about some liquid courage?";
  var fearButton = "fear-button"
  var disgustText = "You're disgusted. You cannot even with this day.";
  var disgustButton = "disgust-button";
  var surprisedText = "You're surprised! Didn't see that one comin', huh?";
  var surprisedButton = "surprised-button";
  var neutralText = "Damn! Do you play poker? We can't tell what you're feeling. How about a rando drink?";
  var neutralButton = "neutral-button";


  if (emoResultsRef === 'happiness') {
    $(".card-text").text(happinessText);
    $("#drink-button").attr("id", happyButton);

  } else if (emoResultsRef === 'sadness') {
    $(".card-text").text(sadnessText);
    $("#drink-button").attr("id", sadButton);

  } else if (emoResultsRef === 'angry') {
    $(".card-text").text(angerText);
    $("#drink-button").attr("id", angerButton);
  } else if (emoResultsRef === "fear") {
    $(".card-text").text(fearText);
    $("#drink-button").attr("id", fearButton);
  } else if (emoResultsRef === "digsust") {
    $(".card-text").text(disgustText);
    $("#drink-button").attr("id", disgustButton);
  } else if (emoResultsRef === "surprised") {
    $(".card-text").text(surprisedText);
    $("#drink-button").attr("id", surprisedButton);
  } else if (emoResultsRef === "neutral") {
    $(".card-text").text(neutralText);
    $("#drink-button").attr("id", neutralButton);
  }
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

  storageRef = firebase.storage().ref();

  // FACE++ API START
  function faceCall(){
  
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
            emoResultsRef= emoResults;
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

