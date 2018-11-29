
    //START ASHKEY TEST PROJECT
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


    // END ASHELY TEST PROJECT
    //------ START COCKTAILDB API ------
    //Cocktaildb Drink ID and AJAX call Start
    // var drinkID = "14782";
    // var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkID
    // // Performing AJAX GET request
    // $.ajax({
    //     url: queryURL,
    //     method: "GET"
    // })
    // // After data comes back from the request
    // .then(function(response) {
    //     // storing the data from the AJAX request in the results variable
    //     var results = response.drinks;
    //     console.log(results);
    // });
    //------ CocktailDB API End ------
        
    //------ FACE++ API START ------
    // var emoResults = "";
    // var image = "https://firebasestorage.googleapis.com/v0/b/picyourpoison-67571.appspot.com/o/images%2FAERALYN%202006.jpg?alt=media&token=78c626a2-b80a-4514-91e6-007ca73faba1";
    // var encodedimage = encodeURIComponent(image);
    // var queryURL = "https://api-us.faceplusplus.com/facepp/v3/detect?api_key=ZQFa2mbqu5lJQm4MXM45qkevtVK_CfBS&api_secret=TVvl2HCex_7KfpbGbHGlAQzRPff0AULF&image_url="+encodedimage+"&return_attributes=emotion";
    // // Performing AJAX POST request
    // $.ajax({
    //     url: queryURL,
    //     method: "POST"
    // })
    // // After data comes back from the request
    // .then(function(response) {
    //     // storing the data from the AJAX request in the results variable
    //     var results = response.faces[0].attributes.emotion;
    //     console.log(results);
    //     // Creating an array of the Objects key values using map function and then detriming the highest value
    //     var arr = Object.keys( results ).map(function ( key) { return results[key]; });
    //     var max = Math.max.apply( null, arr );
    //     console.log("highest key value: " + max);
    //     // Creating a forEach loop to determin which emotion object is associated to the highest key value
    //     Object.keys( results ).forEach(function(key){
    //         if (results[key] === max ) {
    //             emoResults = key;
    //             console.log("Your emotional state is: " + emoResults)
    //             displaySwap()
    //         }
    //     })
    //     function displaySwap(){
    //         var sadnessText = "You're Sad. You could use a hug...and a drink";
    //         var sadButton= "sad-button";
    //         var happinessText= "You're happy! Great, let's celebrate!";
    //         var happyButton = "happy-button";
    //         var angerText= "You're angry. It's OK, let's calm you down";
    //         var angerButton= "angry-button";
    //         var fearText= "You're afraid! How about some liquid courage?";
    //         var fearButton = "fear-button"
    //         var disgustText= "You're disgusted. You cannot even with this day.";
    //         var disgustButton="disgust-button";
    //         var surprisedText= "You're surprised! Didn't see that one comin', huh?";
    //         var surprisedButton= "surprised-button";
    //         var neutralText = "Damn! Do you play poker? We can't tell what you're feeling. How about a rando drink?";
    //         var neutralButton = "neutral-button";


    //         if(emoResults==='happiness'){
    //           $("#new-text").text(happinessText);
    //           $("#drink-button").attr("id", happyButton);
    //         }
    //         else if(emoResults=='sadness'){
    //             $("#new-text").text(sadnessText);
    //             $("#drink-button").attr("id", sadButton);
                
    //         }
            
    //         else if(emoResults==='angry'){
    //             $("#new-text").text(angerText);
    //             $("#drink-button").attr("id", angerButton);
    //         }
            
    //         else if(emoResults==="fear"){
    //             $("#new-text").text(fearText);
    //             $("#drink-button").attr("id", fearButton);
    //             console.log(emoResults);
    //         }

    //        else if(emoResults=== "digsust"){
    //         $("#new-text").text(disgustText);
    //         $("#drink-button").attr("id", disgustButton);
    //        }
    //        else if(emoResults=="surprised"){
    //         $("#new-text").text(surprisedText);
    //         $("#drink-button").attr("id", surprisedButton);
    //        }
    //        else if (emoResults==="neutral"){
    //         $("#new-text").text(neutralText);
    //         $("#drink-button").attr("id", neutralButton);
    //        }



    //     }
    // });
    //------ FACE++ API END ------   
                

    //------ ASHLEY ------
    // var happiness= {
    //     drinkIDS: ['14360',
    //     '14578',
    //     '14730',
    //     '15615',
    //     '15395',
    //     '12738',
    //     '17266',
    //     '17827',
    //     '17190',
    //     '14107',
    //     '17224',
    //     '16958',
    //     '13807',
    //     '15182',
    //     '12560',
    //     '13940',
    //     '15200',
    //     '11024',
    //     '15951']
      
    // };
    // var sadness ={
    //     drinkIDS: ['17105',
    //     '15288',
    //     '16134',
    //     '16271',
    //     '17020',
    //     '13194',
    //     '16998',
    //     '17245',
    //     '11000',
    //     '17229',
    //     '11008',
    //     '14071',
    //     '11118',
    //     '11119',
    //     '17288',
    //     '11117',
    //     '11120',
    //     '12798',
    //     '12800',
    //     '11157',
    //     '16047']
      
    // };
    // var fear = {
    //     drinkIDS=['14642',
    //     '14688',
    //     '15178',
    //     '15761',
    //     '14610',
    //     '16419',
    //     '17250',
    //     '17211',
    //     '16178',
    //     '16273',
    //     '11028',
    //     '14584',
    //     '17074',
    //     '11055',
    //     '13086',
    //     '17060',
    //     '11407',
    //     '11403',
    //     '17230'
    //   ]
    // };
    // var anger = {
    //     drinkIDS: ['14065',
    //     '12870',
    //     '15597',
    //     '16041',
    //     '13222',
    //     '13070',
    //     '13861',
    //     '14087',
    //     '17122',
    //     '12107',
    //     '14306',
    //     '16100',
    //     '13202',
    //     '11368',
    //     '11239',
    //     '17135']
    // };
    // var disgust = {
    //     drinkIDS= ['15082',
    //     '15515',
    //     '15743',
    //     '16295',
    //     '17118',
    //     '16403',
    //     '17120',
    //     '17220',
    //     '17380',
    //     '13128',
    //     '14466',
    //     '17829',
    //     '12101',
    //     '11023',
    //     '14598',
    //     '13581',
    //     '17222',
    //     '13070']
    // };
    // var suprised = {
    //     drinkIDS= ['14602',
    //     '16108',
    //     '16333',
    //     '16942',
    //     '13940',
    //     '17184',
    //     '14782',
    //     '11798',
    //     '11872',
    //     '13535',
    //     '16992',
    //     '13072',
    //     '13198',
    //     '13652',
    //     '16405',
    //     '14360',
    //     '11010',
    //     '13899',
    //     '11053',
    //     '15567',
    //     '11034']
    // };
    //------ ASHLEY ------

    // var drinkid = [
    //     {
    //         emotion: "Happiness",
    //         options: [13940, 15200, 11024, 15951]
    //     },
    //     {
    //         emotion: "Fear",
    //         options: [17060, 11407, 11403, 17230]
    //     },
    //     {
    //         emotion: "Anger",
    //         options: [13202, 11368, 11239, 17135]
    //     },
    //     {
    //         emotion: "Sadness",
    //         options: [12798, 12800, 11157, 16047]
    //     },
    //     {
    //         emotion: "Disgust",
    //         options: [14598, 13581, 17222, 13070]
    //     },
    //     {
    //         emotion: "Surprised",
    //         options: [13899, 15567, 11034, 11053]
    //     }

    // ]

    // function drinkselection() {

    //     make = Math.floor(Math.random() * drinkid.length);
    //     drinknew = drinkid[make];
    //     // console.log(make);
    //     // console.log(drinknew);


    //     if (drinknew === drinkid[0]) {
    //         var i = Math.floor(Math.random() * drinknew.options.length);
    //         var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinknew.options[i];
    //         console.log("gi")
    //     }

    //     else if (drinknew === drinkid[1]) {
    //         var j = Math.floor(Math.random() * drinknew.options.length);
    //         var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinknew.options[j];
    //         console.log("ooo")
    //     }

    //     else if (drinknew === drinkid[2]) {
    //         var k = Math.floor(Math.random() * drinknew.options.length);
    //         var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinknew.options[k];


    //         console.log("yy")
    //     }

    //     else if (drinknew === drinkid[3]) {
    //         var l = Math.floor(Math.random() * drinknew.options.length);
    //         var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinknew.options[l];

    //         console.log("pp")
    //     }

    //     else if (drinknew === drinkid[4]) {
    //         var m = Math.floor(Math.random() * drinknew.options.length);
    //         var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinknew.options[m];

    //         console.log("mm")
    //     }

    //     else if (drinknew === drinkid[5]) {
    //         var n = Math.floor(Math.random() * drinknew.options.length);
    //         var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinknew.options[n];

    //         console.log("nn")
    //     }

    //     $.ajax({
    //         url: queryURL,
    //         method: "GET"
    //     }).then(function (response) {


    //         console.log(response)
    //         console.log(response.drinks[0].strDrink);
    //         console.log(response.drinks[0].strDrinkThumb);
    //         console.log(response.drinks[0].strIngredient1);
    //         console.log(response.drinks[0].strIngredient2);
    //         console.log(response.drinks[0].strIngredient3);
    //         console.log(response.drinks[0].strIngredient4);
    //         console.log(response.drinks[0].strIngredient5);

    //         // drink name
    //         $(".drink").text("Drink Name: " + response.drinks[0].strDrink);
    //         // ingredients
    //         var ingredient = $("<div>");
    //         var p1 = $("<p>").text("Ingredient1: " + response.drinks[0].strIngredient1);
    //         var p2 = $("<p>").text("Ingredient2: " + response.drinks[0].strIngredient2);
    //         var p3 = $("<p>").text("Ingredient3: " + response.drinks[0].strIngredient3);
    //         var p4 = $("<p>").text("Ingredient4: " + response.drinks[0].strIngredient4);
    //         var p5 = $("<p>").text("Ingredient5: " + response.drinks[0].strIngredient5);
    //         var p6 = $("<p>").text("Ingredient6: " + response.drinks[0].strIngredient6);
    //         $(".ingredients").append(p1, p2, p3, p4, p5, p6);
    //         // images
    //         var pic = $("<img>");
    //         pic.attr("src", response.drinks[0].strDrinkThumb);
    //         pic.attr("height", "200");
    //         $(".image").append(pic);

    //     })
    // }
    // drinkselection();
//------ START KAIROS API 1 ------
//put your keys in the header
// var headers = {
//     "Content-type"    : "application/json",
//     "app_id"          : "f6a8807f",
//     "app_key"         : "323acfb9e5d29a6cbd417004c2a094bc"
// };
//var payload  = { "image" : "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" };
// var url = "https://api.kairos.com/v2/media?source=https://i.imgur.com/Jcrt0XJ.jpg";
//make request 
// $.ajax(url, {
//     headers  : headers,
//     type: "POST",
//     //data: JSON.stringify(payload),
//     //dataType: "text"
// }).done(function(response){
//     console.log(response);
// });
//------ END KAIROS API 1 ------

//------ START KAIROS API 2 ------
// var request = new XMLHttpRequest();

// request.open('POST', 'https://api.kairos.com/v2/media?source=https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940');

// request.setRequestHeader('app_id', 'f6a8807f');
// request.setRequestHeader('app_key', '323acfb9e5d29a6cbd417004c2a094bc');

// request.onreadystatechange = function () {
// if (this.readyState === 4) {
//     console.log('Status:', this.status);
//     console.log('Headers:', this.getAllResponseHeaders());
//     console.log('Body:', this.responseText);
// }
// };

// request.send();
//------ END KAIROS API 2 ------

//------ START IMGUR API ------
// var headers = {
//     Authorization: 'Client-ID 303995ac8d00703',
//     Accept: 'application/json'
// };
// var url = "https://api.imgur.com/3/image"
// $.ajax(url, {
//     headers  : headers,
//     type: "POST",
//     data    : {
//         image : 'https://firebasestorage.googleapis.com/v0/b/picyourpoison-67571.appspot.com/o/images%2F5.24.18.jpg?alt=media&token=c4bba9d8-0913-4e6f-ac59-837920df0c60'
//     } 
// }).done(function(response){
//     console.log(response);
// });
//------ END IMGUR API ------