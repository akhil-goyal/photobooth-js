document.addEventListener('DOMContentLoaded', () => {

    const registerationForm = document.querySelector('.sign-up-form');
    const registerationUserName = document.querySelector('.reg-full-name');
    const registerationUserEmail = document.querySelector('.reg-email');
    const registerationUserPassword = document.querySelector('.reg-password');
    const registeredImagePicker = document.querySelector('.reg-image-picker')
    const registeredImageName = document.querySelector('.reg-image-name');

    let file = "";
    let fileName = "";
    let fileExt = "";

    const db = firebase.firestore();

    document.querySelector('.reg-avatar').addEventListener(`click`, () => {
        document.querySelector('.reg-image-picker').click()
    })

    registeredImagePicker.addEventListener("change", (e) => {

        file = e.target.files[0];

        let reader = new FileReader();

        reader.addEventListener("load", () => {
            document.querySelector('.reg-avatar').src = reader.result;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }

        fileName = file.name.split(".").shift();
        fileExt = file.name.split(".").pop();

        registeredImageName.value = fileName;
        console.log({ file, fileName, fileExt });

    });

    registerationForm.addEventListener('submit', (event) => {

        event.preventDefault();

        if (registerationUserEmail.value
            && registerationUserName.value
            && registerationUserPassword.value
            && registeredImageName.value) {

            firebase
                .auth()
                .createUserWithEmailAndPassword(registerationUserEmail.value, registerationUserPassword.value)
                .then(() => {

                    const user = firebase.auth().currentUser;

                    const storageRef = firebase.storage().ref(`images/${user.uid}.${fileExt}`);
                    const uploadTask = storageRef.put(file);

                    uploadTask.on(
                        "state_changed",
                        function () { },
                        function (error) {
                            console.log(error);
                        },
                        function () {
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                addUser(user.uid, registerationUserEmail.value, registerationUserName.value, downloadURL);
                            });
                        }
                    );

                })
                .catch((err) => console.log("err", err));

        }

    });

    function addUser(uid, email, name, url) {
        db.collection("Users")
            .doc(uid)
            .set({
                username: name,
                emailaddress: email,
                userid: uid,
                profilepicture: url,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
                window.location = "dashboard.html";
            })
            .catch((err) => console.log("err", err));
    }

});