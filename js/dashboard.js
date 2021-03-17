document.addEventListener('DOMContentLoaded', () => {

    const dashboardProfilePicture = document.querySelector('.dash-profile-image');
    const dashboardUserName = document.querySelector('.dash-user-name');
    const dashboardLogoutButton = document.querySelector('.dash-logout-btn');

    const dashboardImagePicker = document.querySelector('.dashboard-image-picker');
    const dashboardImageName = document.querySelector('.dashboard-image-name');
    const dashboardCategory = document.querySelector('.categories');
    const dashboardSubmitPhoto = document.querySelector('.submit-photo-button');

    let file = "";
    let fileName = "";
    let fileExt = "";

    const db = firebase.firestore();

    document.querySelector('.dashboard-avatar').addEventListener(`click`, () => {
        document.querySelector('.dashboard-image-picker').click()
    })

    dashboardImagePicker.addEventListener("change", (e) => {

        file = e.target.files[0];

        let reader = new FileReader();

        reader.addEventListener("load", () => {
            document.querySelector('.dashboard-avatar').src = reader.result;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }

        fileName = file.name.split(".").shift();
        fileExt = file.name.split(".").pop();

        dashboardImageName.value = fileName;
        console.log({ file, fileName, fileExt });

    });

    dashboardSubmitPhoto.addEventListener('click', () => {

        let loggedInUser = firebase.auth().currentUser;

        if (!file) return;

        const storageRef = firebase.storage().ref(`images/${loggedInUser.uid}.${fileExt}`);
        const uploadTask = storageRef.put(file);

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

                            document.querySelector('.dashboard-avatar').src = './../images/user_avatar.png';

                            dashboardCategory.value = '';

                            file = '';

                        })
                        .catch((error) => {
                            console.log('An error occured while storing photo to firestore : ', error);
                        });
                });
            }
        )
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
                    dashboardUserName.innerHTML = `Welcome, ${doc.data().username.split(" ").shift()}`;
                    dashboardProfilePicture.src = doc.data().profilepicture;
                } else {
                    console.log("No such document");
                }
            });
    }

    const displayImages = (photos) => {

        const artGallery = document.querySelector('.art-image-gallery');

        photos.map((data) => {
            const imgEle = document.createElement('img');

            imgEle.src = data.photo;
            artGallery.appendChild(imgEle);
        });


    }

    const fetchData = () => {

        let photoData = [];

        db
            .collection("photobooth")
            .onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    photoData.push(doc.data());
                    displayImages(photoData);
                })
            })

    }

    fetchData();

});