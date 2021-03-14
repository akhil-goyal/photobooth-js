document.addEventListener('DOMContentLoaded', () => {

    const dashboardProfilePicture = document.querySelector('.dash-profile-image');
    const dashboardUserName = document.querySelector('.dash-user-name');
    const dashboardLogoutButton = document.querySelector('.dash-logout-btn');

    const dashboardImagePicker = document.querySelector('.reg-image-picker');
    const dashboardImageName = document.querySelector('.dashboard-image-name');
    const dashboardCategory = document.querySelector('.categories');
    const dashboardSubmitPhoto = document.querySelector('.submit-photo-button');

    let file = "";
    let fileName = "";
    let fileExt = "";

    const db = firebase.firestore();

    dashboardImagePicker.addEventListener("change", (e) => {
        file = e.target.files[0];
        fileName = file.name.split(".").shift();
        fileExt = file.name.split(".").pop();
        dashboardImageName.value = fileName;
        console.log({ file, fileName, fileExt });
    });

    dashboardSubmitPhoto.addEventListener('click', () => {

        let loggedInUser = firebase.auth().currentUser;

        if (!file) return;

        new Promise(resolve => {

            let rawImage = new Image();

            rawImage.addEventListener("load", () => {
                resolve(rawImage);
            });

            rawImage.src = URL.createObjectURL(file);

        }).then(rawImage => {

            return new Promise(resolve => {

                let canvas = document.createElement('canvas');

                const MAX_WIDTH = 400;

                const scaleSize = MAX_WIDTH / rawImage.width;

                canvas.width = MAX_WIDTH;
                canvas.height = rawImage.height * scaleSize;

                let ctx = canvas.getContext("2d");

                ctx.drawImage(rawImage, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(blob => {
                    resolve(URL.createObjectURL(blob));
                }, "image/webp");
            });

        }).then(imageURL => {

            return new Promise(resolve => {

                let scaledImg = new Image();

                scaledImg.addEventListener("load", () => {
                    resolve({ imageURL, scaledImg });
                });

                scaledImg.setAttribute("src", imageURL);
            });
        }).then(data => {

            const storageRef = firebase.storage().ref(`images/${loggedInUser.uid}.${fileExt}`);
            const uploadTask = storageRef.put(data.imageURL);

            uploadTask.on(
                "state_changed",
                function () { },
                function (error) {
                    console.log(error);
                },
                function () {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {

                        db.collection("photobooth")
                            .add({
                                user_id: loggedInUser.uid,
                                photo: downloadURL,
                                category: dashboardCategory.value,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            })
                            .then(() => {

                                console.log('Photo added to firestore.');

                                dashboardCategory.value = '';
                                file = '';

                            })
                            .catch((error) => {
                                console.log('An error occured while storing photo to firestore : ', error);
                            });
                    });
                }
            );

        });
    });

    dashboardLogoutButton.addEventListener('click', () => {
        firebase.auth().signOut();
        window.location = "sign-in.html";
    });

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            getUser(user.uid);
        } else {
            console.log('User is not authenticated.');
        }
    });

    const getUser = uid => {
        db.collection("Users")
            .doc(uid)
            .get()
            .then(function (doc) {
                if (doc.exists) {
                    dashboardUserName.innerHTML = `Welcome, ${doc.data().full_name.split(" ").shift()}`;
                    dashboardProfilePicture.src = doc.data().profile_image;
                } else {
                    console.log("No such document");
                }
            });
    }

});