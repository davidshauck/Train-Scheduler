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

// const database = firebase.database();

// load jquery


function escapeEmailAddress(email) {
            if (!email) return false
          
            // Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
            email = email.toLowerCase();
            email = email.replace(/\./g, ',');
            return email;
          }
          
          var usersRef = new Firebase('https://the-squadject.firebaseio.com/test');
          var myUser = usersRef.child(escapeEmailAddress('hello@hello.com')) 

              myUser.set({
                name: trainName,
                email: 'hello@hello.com', 
                destination: trainDest,
                first: firstTrain,
                frequency: trainFreq,
              }); 
