document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.querySelector('.sign-in-form');
    const loginEmail = document.querySelector('.login-email');
    const loginPassword = document.querySelector('.login-password');

    loginForm.addEventListener('submit', (event) => {

        event.preventDefault();

        console.log('LOGIN DATA : ', loginEmail.value, loginPassword.value);

        firebase
            .auth()
            .signInWithEmailAndPassword(loginEmail.value, loginPassword.value)
            .then(() => {
                const user = firebase.auth().currentUser;
            })
            .catch((err) => console.log("Error while signing in : ", err));

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                window.location = "dashboard.html";
            }
        });

    });

})