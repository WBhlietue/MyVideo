import {} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
import { SetPicPath, SetVidPath } from "./main.js";

var storage;
var storafeRef;

const picMeta = { contentType: "image/jpg" };

const videoMeta = { contentType: "video/mp4" };

export function Init() {
  storage = getStorage();
}

export function UploadPic(url, num) {
  storafeRef = ref(storage, "Pictures/" + num + ".jpg");
  // fetch(url)
  //   .then((response) => response.blob())
  //   .then((blob) => {
  uploadBytes(storafeRef, url, picMeta).then((scap) => {
    console.log(scap);
    getDownloadURL(ref(storage, "Pictures/" + num + ".jpg"), picMeta).then(
      (url) => {
        SetPicPath(url);
      }
    );
  });
  // });
  return "";
}

export function UploadVid(url, num) {
  storafeRef = ref(storage, "Videos/" + num + ".mp4");
  console.log(url);
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      console.log(blob);
      uploadBytes(storafeRef, blob, videoMeta).then((scap) => {
        getDownloadURL(ref(storage, "Videos/" + num + ".mp4"), videoMeta).then(
          (url) => {
            console.log("setPath");
            SetVidPath(url);
          }
        );
      });
    });
  return "";
}
