const firebaseConfig = {
    apiKey: "AIzaSyBdZGDDPJC-PYljU0HDnnZi64Z6do0w7K0",
    authDomain: "recipebook2-a9e9a.firebaseapp.com",
    databaseURL: "https://recipebook2-a9e9a-default-rtdb.firebaseio.com",
    projectId: "recipebook2-a9e9a",
    storageBucket: "recipebook2-a9e9a.appspot.com",
    messagingSenderId: "384328070783",
    appId: "1:384328070783:web:dbdb4004f591e84682314a"
  };

firebase.initializeApp(firebaseConfig);

var loginFormDB = firebase.database().ref("loginForm");

document.getElementById("loginForm").addEventListener("submit", submitForm);

function submitForm(e){
    e.preventDefault();

    var username = getElementVal("username");
    var password = getElementVal("password");

    console.log(username, password);
    saveMessages(username, password);
}


const getElementVal = (id) => {
    return document.getElementById(id).value;
};

const saveMessages = (username, password) => {
    var newLoginForm = loginFormDB.push();

    newLoginForm.set({
        username:username,
        password:password
    });
};

