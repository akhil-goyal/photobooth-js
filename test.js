 // dashboardSubmitPhoto.addEventListener('click', () => {

    //     let loggedInUser = firebase.auth().currentUser;

    //     if (!file) return;

    //     new Promise(resolve => {

    //         let rawImage = new Image();

    //         rawImage.addEventListener("load", () => {
    //             resolve(rawImage);
    //         });

    //         rawImage.src = URL.createObjectURL(file);

    //     }).then(rawImage => {

    //         return new Promise(resolve => {

    //             let canvas = document.createElement('canvas');

    //             const MAX_WIDTH = 400;

    //             const scaleSize = MAX_WIDTH / rawImage.width;

    //             canvas.width = MAX_WIDTH;
    //             canvas.height = rawImage.height * scaleSize;

    //             let ctx = canvas.getContext("2d");

    //             ctx.drawImage(rawImage, 0, 0, canvas.width, canvas.height);

    //             canvas.toBlob(blob => {
    //                 resolve(URL.createObjectURL(blob));
    //             }, "image/webp");
    //         });

    //     }).then(imageURL => {

    //         return new Promise(resolve => {

    //             let scaledImg = new Image();

    //             scaledImg.addEventListener("load", () => {
    //                 resolve({ imageURL, scaledImg });
    //             });

    //             scaledImg.setAttribute("src", imageURL);
    //         });
    //     }).then(data => {

    //         const storageRef = firebase.storage().ref(`images/${loggedInUser.uid}.${fileExt}`);
    //         const uploadTask = storageRef.put(data.imageURL);

    //         uploadTask.on(
    //             "state_changed",
    //             function () { },
    //             function (error) {
    //                 console.log(error);
    //             },
    //             function () {
    //                 uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {

    //                     db.collection("photobooth")
    //                         .add({
    //                             user_id: loggedInUser.uid,
    //                             photo: downloadURL,
    //                             category: dashboardCategory.value,
    //                             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //                         })
    //                         .then(() => {

    //                             console.log('Photo added to firestore.');

    //                             dashboardCategory.value = '';
    //                             file = '';

    //                         })
    //                         .catch((error) => {
    //                             console.log('An error occured while storing photo to firestore : ', error);
    //                         });
    //                 });
    //             }
    //         );

    //     });
    // });