import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "../node_modules/firebase/firebase-auth.js";

import {
  child,
  get,
  getDatabase,
  ref,
  set,
} from "../node_modules/firebase/firebase-database.js";

import { Init, UploadPic, UploadVid } from "./video.js";

var urlpar = new URLSearchParams(window.location.search);

const videoNumber = 12;
var canComment = false;

const defaultPage = "home";

const sidebarBtns = document.querySelectorAll(".sidebar li a");

const uploadBack = document.getElementById("uploadVideoBack");
uploadBack.style.display = "none";

const menuPages = document.querySelectorAll("main");

const thumCanvas = document.getElementById("thumbailCanvas");
thumCanvas.width = 160;
thumCanvas.height = 90;
const thumCont = thumCanvas.getContext("2d");

// document.getElementById("headLogo").addEventListener("click", () => {
//   ChangePage(defaultPage);
// });

document
  .getElementById("headUploadVideoButton")
  .addEventListener("click", () => {
    if (!isLogin) {
      // ChangePage("person");
      location.href = "index.html?page=person";
    } else {
      ShowUpload();
    }
  });

function ChangePage(pageName) {
  sidebarBtns.forEach((j) => {
    if (j.name == pageName) {
      j.className = "active";
    }
  });
  menuPages.forEach((j) => {
    if (j.id == pageName) {
      j.style.display = "inline";
    }
  });
}
if (urlpar.get("page") != null) {
  ChangePage(urlpar.get("page"));
} else {
  ChangePage(defaultPage);
}

document.addEventListener("click", () => {
  switch (urlpar.get("page")) {
    case "video":
      break;
    case "home":
      GetHomeVideo();
      break;
    case "favorite":
      if (isLogin) {
        GetFavoriteVideo(false);
      }
      break;
    case "history":
      if (isLogin) {
        GetHistoryVideo(false);
      }
      break;
    default:
      GetHomeVideo();
      break;
  }
});

document.getElementById("logout").addEventListener("click", () => {
  signOut(auth).then(() => {
    isLogin = false;
    document.getElementById("logged").style.display = "none";
    document.getElementById("noLogged").style.display = "inline";
    userData = null;
  });
  document.cookie = "0";
});

document.getElementById("logged").style.display = "none";
document.getElementById("regButtom").addEventListener("click", () => {
  Reg();
});
document.getElementById("logButtom").addEventListener("click", () => {
  let email = document.getElementById("logEmail").value;
  let pass = document.getElementById("logPass").value;
  LogIn(email, pass);
});

document
  .getElementById("videoUploadBtnCancel")
  .addEventListener("click", () => {
    DisableUpload();
  });
document
  .getElementById("videoUploadBtnUpload")
  .addEventListener("click", () => {
    Upload();
  });

var isLogin = false;
var userData;

// const firebaseConfig = {
//   apiKey: "AIzaSyC1_tcF5SFEC_a3C6T82Asai-50Ymj_eBc",
//   authDomain: "mymovie-7fe15.firebaseapp.com",
//   databaseURL: "https://mymovie-7fe15-default-rtdb.firebaseio.com",
//   projectId: "mymovie-7fe15",
//   storageBucket: "mymovie-7fe15.appspot.com",
//   messagingSenderId: "993354069909",
//   appId: "1:993354069909:web:6650212bb33b7df8e3689c",
// };

const firebaseConfig = {
  apiKey: "AIzaSyDz-o7BMfaIWhAT5zO3ZthrdfPWBex9QaI",
  authDomain: "mymovietest-90b63.firebaseapp.com",
  databaseURL: "https://mymovietest-90b63-default-rtdb.firebaseio.com",
  projectId: "mymovietest-90b63",
  storageBucket: "mymovietest-90b63.appspot.com",
  messagingSenderId: "618070371615",
  appId: "1:618070371615:web:498fc6c1bfc093aed1142a",
  measurementId: "G-R0Q5T1N1M5",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const databse = getDatabase(app);

AutoLogIn();

function ShowUpload() {
  uploadBack.style.display = "inline";
  uploadBack.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  document.getElementById("uploadVideo").style.opacity = "1";
}
function DisableUpload() {
  uploadBack.style.backgroundColor = "rgba(0, 0, 0, 0)";
  document.getElementById("uploadVideo").style.opacity = "0";
  setTimeout(() => {
    uploadBack.style.display = "none";
  }, 500);
}
function Reg() {
  if (
    document.getElementById("regPass").value ==
    document.getElementById("regRePass").value
  ) {
    var email = document.getElementById("regEmail").value;
    var pass = document.getElementById("regPass").value;
    createUserWithEmailAndPassword(auth, email, pass)
      .then((userC) => {
        const user = userC.user;
        InitDataBase(document.getElementById("regUserName").value);
        OnLogIn();
      })
      .catch((error) => {
        console.log(error.message);
      });
  } else {
    alert("password not same" + ", ");
  }
}

function LogIn(email, pass) {
  console.log("looooogggg");
  signInWithEmailAndPassword(auth, email, pass)
    .then((userC) => {
      const user = userC.user;
      OnLogIn();
      document.cookie = email + "/" + pass;
    })
    .catch((error) => {
      console.log(error.message);
      console.log(error);
      switch (error.message) {
        case "Firebase: Error (auth/wrong-password).":
          document.getElementById("loginState").innerHTML = "wrong-password";
          break;
        case "Firebase: Error (auth/user-not-found).":
          document.getElementById("loginState").innerHTML = "user-not-found";
          break;
        case "Firebase: Error (auth/invalid-email).":
          document.getElementById("loginState").innerHTML = "invalid-email";
          break;
        default:
          document.getElementById("loginState").innerHTML = "unknown-error";
          break;
      }
    });

  Init();
}

function OnLogIn() {
  isLogin = true;
  console.log("logged complete");
  get(child(ref(databse), "user/" + auth.currentUser.uid)).then((snap) => {
    document.getElementById("logged").style.display = "inline";
    document.getElementById("noLogged").style.display = "none";
    userData = snap.val();
    canComment = true;
    document.getElementById("adComment").innerHTML = "comment";
    var favBtn = document.getElementById("f");
    favBtn.addEventListener("click", () => {
      console.log(userData.fovarites.indexOf(num));
      if (userData.fovarites.indexOf(num) != -1) {
        document.getElementById("f").innerHTML = "heart_plus";
        document.getElementById("f").className = "material-symbols-rounded";
        RemoveFromFavorite(num);
      } else {
        document.getElementById("f").innerHTML = "favorite";
        document.getElementById("f").classList.add("ac");
        AddToFavorite(num);
      }
    });
    console.log(userData);
    switch (urlpar.get("page")) {
      case "favorite":
        document.getElementById("favoriteContent").innerHTML = "";
        favoriteList = GetFavorite();
        GetFavoriteVideo();
        break;
      case "history":
        document.getElementById("historyContent").innerHTML = "";
        historyList = GetHistory();
        GetHistoryVideo();
        break;
      case "video":
        var num = urlpar.get("video");
        if (userData.fovarites.indexOf(num) != -1) {
          document.getElementById("f").innerHTML = "favorite";
          document.getElementById("f").classList.add("ac");
        }
        break;
    }
    document.getElementById("userWelcome").innerHTML =
      "Welcome!! " + userData.userName;
  });
}

function InitDataBase(userN) {
  set(ref(databse, "user/" + auth.currentUser.uid), {
    fovarites: [-1],
    historys: [-1],
    videos: [-1],
    userName: userN,
  });
}

function UpdateDatabase() {
  set(ref(databse, "user/" + auth.currentUser.uid), userData);
}

function AddToFavorite(num) {
  userData.fovarites.push(num);
  UpdateDatabase();
}
function RemoveFromFavorite(num) {
  userData.fovarites.splice(userData.fovarites.indexOf(num), 1);
  UpdateDatabase();
}

function UpdateHistory(num) {
  var list = userData.historys;
  list = [num].concat(list);
  userData.historys = [...new Set(list)];
  UpdateDatabase();
}

function GetFavorite() {
  return userData.fovarites;
}
function GetHistory() {
  return userData.historys;
}

function AutoLogIn() {
  console.log(document.cookie);
  if (document.cookie == "" || document.cookie == "0") {
    console.log("cannot login");
  } else {
    var str = document.cookie;
    var str1 = str.split("/");
    document.getElementById("noLogged").style.display = "none";
    LogIn(str1[0], str1[1]);
  }
}

var picPath = "";
var vidPath = "";

function AddVideo() {
  console.log("add");
  get(child(ref(databse), "vid")).then((snap) => {
    var num = snap.val();
    var vid = {
      uploader: userData.userName,
      title: document.getElementById("uploadVideoTitle").value,
      description: document.getElementById("uploadVideoDescription").value,
      pictureURL: picPath,
      videoURL: vidPath,
      view: 0,
      gategory: document.getElementById("uploadVideoGategory").value,
    };
    set(ref(databse, "video/" + num), vid);
    set(ref(databse, "comment/" + num), "");
    num++;
    set(ref(databse, "vid"), num);
    picPath = "";
    vidPath = "";
    DisableUpload();
  });
}
export function SetPicPath(url) {
  console.log(url);
  picPath = url;
  get(child(ref(databse), "vid")).then((snap) => {
    console.log("!@3");
    var num = snap.val();
    console.log(num);
    var reader1 = new FileReader();
    reader1.onload = function (e) {
      console.log("!23123123upload");
      UploadVid(e.target.result, num);
    };
    reader1.readAsDataURL(document.getElementById("uploadVideoVideo").files[0]);
  });
}
export function SetVidPath(url) {
  vidPath = url;
  AddVideo();
}

function Upload() {
  get(child(ref(databse), "vid")).then((snap) => {
    var num = snap.val();
    console.log(num);

    var comt = document.getElementById("thumbailCanvas").getContext("2d");
    var reader1 = new FileReader();
    reader1.onload = function (e) {
      console.log(comt);
      console.log(e.target.result);
      var img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        comt.drawImage(img, 0, 0, 160, 90);
        document.getElementById("thumbailCanvas").toBlob((blob) => {
          UploadPic(blob, num);
        });
      };
    };
    reader1.readAsDataURL(
      document.getElementById("uploadVideoThumbnail").files[0]
    );

    // var reader = new FileReader();
    // reader.onload = function (e) {
    //   UploadPic(e.target.result, num);
    // };
    // reader.readAsDataURL(
    //   document.getElementById("uploadVideoThumbnail").files[0]
    // );
  });
}
var homeList = [];
var favoriteList = [];
var historyList = [];
var allVideoList = [];
document.getElementById("favoriteContent").innerHTML = "Need Login";
document.getElementById("historyContent").innerHTML = "Need Login";
get(child(ref(databse), "vid")).then((snap) => {
  for (let i = 1; i < snap.val(); i++) {
    allVideoList.push(i);
  }
  switch (urlpar.get("page")) {
    case "video":
      var num = urlpar.get("video");

      SetVideo(num);
      console.log(num);
      break;
    case "home":
      GetHomeVideo();
      break;
    case "favorite":
      break;
    case "history":
      break;
    default:
      GetHomeVideo();
      break;
  }
});
homeList = allVideoList;
function GetHomeVideo() {
  for (let i = 0; i < videoNumber; i++) {
    if (homeList.length > 0) {
      var a = Math.floor(Math.random() * homeList.length);
      GetVideo(homeList[a], "homeContent");
      homeList.splice(a, 1);
    }
  }
}
function GetFavoriteVideo(isInit = true) {
  if (favoriteList.length <= 1) {
    if (isInit) {
      document.getElementById("favoriteContent").innerHTML = "empty";
    }
    return;
  }
  for (let i = 0; i < videoNumber; i++) {
    if (favoriteList.length > 1) {
      var a = Math.floor(Math.random() * (favoriteList.length - 1) + 1);
      GetVideo(favoriteList[a], "favoriteContent");
      favoriteList.splice(a, 1);
    }
  }
}
function GetHistoryVideo(isiInit = true) {
  if (historyList.length <= 1) {
    if (isInit) {
      document.getElementById("historyContent").innerHTML = "empty";
    }
    return;
  }
  for (let i = 0; i < videoNumber; i++) {
    if (historyList.length > 1) {
      var a = Math.floor(Math.random() * (historyList.length - 1));
      GetVideo(historyList[a], "historyContent");
      historyList.splice(a, 1);
    }
  }
}

function SetVideo(num) {
  get(child(ref(databse), "video/" + num)).then((snap) => {
    var video = snap.val();
    if (video.view == undefined) {
      video.view = 0;
    }
    console.log(video.view);
    video.view++;
    console.log(video.view);
    document.getElementById("videoTitle").innerHTML = video.title;
    document.getElementById("videoDes").innerHTML = video.description;
    // document.getElementById("videoVideo").setAttribute("src", video.videoURL);
    document.getElementById("videoVal").innerHTML =
      "Uploader: " +
      video.uploader +
      "<br>Views: " +
      video.view +
      "<br>Gategpry: " +
      video.gategory;
    set(ref(databse, "video/" + num), video);
    setTimeout(() => {
      UpdateHistory(num);
    }, 1000);
  });
}

function GetVideo(num, targetId) {
  get(child(ref(databse), "video/" + num)).then((snap) => {
    var video = snap.val();
    console.log(num + " " + video);
    var video =
      ' <div class="videos">' +
      '   <div class="video1">' +
      '     <div class="thumbnail">' +
      '       <a href="index.html?page=video&video=' +
      num +
      '">' +
      '         <img src=" ' +
      video.pictureURL +
      '" alt="" />' +
      "       </a>" +
      "     </div>" +
      '     <div class="details">' +
      '       <div class="author">' +
      '         <img src="./images/3135715.png" alt="" />' +
      "       </div>" +
      '       <div class="title">' +
      "         <h3>" +
      video.title +
      "</h3>" +
      '         <a href=""> ' +
      video.uploader +
      " </a>" +
      "         <span> " +
      video.view +
      " Views</span>" +
      "       </div>" +
      "     </div>" +
      "   </div>" +
      " </div>";
    document.getElementById(targetId).innerHTML += video;
  });
}
var comments = null;
function GetComment(num) {
  get(child(ref(databse), "comment/" + num)).then((snap) => {
    document.getElementById("cmt").innerHTML = snap.val();
    console.log(snap.val());
    console.log(num);
  });
}
GetComment(urlpar.get("video"));

document.getElementById("adComment").addEventListener("click", () => {
  if (canComment) {
    var txt =
      userData.userName + ":" + document.getElementById("yourComment").value;
    document.getElementById("yourComment").value = "";
    var d = document.getElementById("cmt").innerHTML + "<br>" + txt;
    set(ref(databse, "comment/" + urlpar.get("video")), d);
    document.getElementById("cmt").innerHTML = d;
  }
});
