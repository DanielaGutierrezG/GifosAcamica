"use strict";

import apiGiphy from "../../api/index.js";

const containerCrearGifo = document.getElementById("containerSubirGifo");
const containers = document.querySelectorAll(".hiddenCrearGifo");

const buttonAddGifos = document.getElementById("crearGifos");
const buttonComenzar = document.querySelector(".buttonComenzar");
const buttonGrabar = document.querySelector(".buttonGrabar");
const buttonFinalizar = document.querySelector(".buttonFinalizar");
const buttonUpload = document.querySelector(".buttonSubirGifo");
const textCrear1 = document.querySelectorAll(".tcrear1");
const textCrear2 = document.querySelectorAll(".tcrear2");
const paso1 = document.querySelector(".paso1");
const paso2 = document.querySelector(".paso2");
const paso3 = document.querySelector(".paso3");
const video = document.getElementById("container-video-gif");
const previewImg = document.querySelector(".previewImgGif");
const efectosImg = document.querySelector(".testing");
const loaderSubirGifo = document.querySelector(".loader-subir-gifo");
const loaderExitoGifo = document.querySelector(".loader-exito-gifo");
const imgSubir = document.querySelector(".img-loader-subir");
const imgExito = document.querySelector(".img-loader-exito");
const spanActions = document.querySelector(".container-icon-crear");
const iconDownload = document.querySelector(".a-download");
const iconLink = document.querySelector(".a-link");

let counter = document.querySelector(".counter");
let countdown;
let stream, recorder, imageUrl;

function buttonsActionsModeDark(paso1, paso2, paso3) {
  if (localStorage.getItem("mode-dark") === "black") {
    paso1.src = "assets/img/paso-a-paso-mod-noc.svg";
    paso2.src = "assets/img/paso-a-paso-mod-noc2.svg";
    paso3.src = "assets/img/paso-a-paso-mod-noc3.svg";
  } else {
    paso1.src = "assets/img/paso-a-paso.svg";
    paso2.src = "assets/img/paso-a-paso2.svg";
    paso3.src = "assets/img/paso-a-paso3.svg";
  }
}

buttonAddGifos.addEventListener("click", () => {
  containerCrearGifo.style.display = "flex";
  containers.forEach((item) => (item.style.display = "none"));
  const paso1 = document.querySelector(".paso1");
  const paso2 = document.querySelector(".paso2");
  const paso3 = document.querySelector(".paso3");
  if (localStorage.getItem("mode-dark") === "black") {
    buttonAddGifos.src = "assets/img/CTA-crear-gifo-active.svg";
  } else {
    buttonAddGifos.src = "assets/img/CTA-crear-gifo-hover.svg";
  }
  buttonsActionsModeDark(paso1, paso2, paso3);
  repeatCapture();
});

async function getStreamAndRecord() {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {},
  });
  if (stream.active === true) {
    textCrear2.forEach((item) => (item.style.display = "none"));
    video.style.display = "block";
    video.srcObject = stream;
    buttonGrabar.style.display = "block";
    if (localStorage.getItem("mode-dark") === "black") {
      paso1.src = "assets/img/paso-a-paso-mod-noc.svg";
      paso2.src = "assets/img/paso-a-paso-hover-mod-noc2.svg";
    } else {
      paso1.src = "assets/img/paso-a-paso.svg";
      paso2.src = "assets/img/paso-a-paso-hover2.svg";
    }
    counter.style.display = "block";
    counter.innerHTML = "00:00:00";
  }
}

buttonComenzar.addEventListener("click", async () => {
  buttonComenzar.style.display = "none";
  textCrear1.forEach((item) => (item.style.display = "none"));
  textCrear2.forEach((item) => (item.style.display = "block"));
  if (localStorage.getItem("mode-dark") === "black") {
    paso1.src = "assets/img/paso-a-paso-hover-mod-noc.svg";
  } else {
    paso1.src = "assets/img/paso-a-paso-hover.svg";
  }
  counter.style.display = "none";
  getStreamAndRecord();
});

buttonGrabar.addEventListener("click", () => {
  recorder = RecordRTC(stream, {
    type: "gif",
    frameRate: 1,
    quality: 10,
    width: 360,
    hidden: 240,
  });
  buttonGrabar.style.display = "none";
  buttonFinalizar.style.display = "block";
  onGifRecordingStarted(recorder);
});

buttonFinalizar.addEventListener("click", () => {
  recorder.stopRecording();
  clearInterval(countdown);
  counter.innerHTML = "REPETIR CAPTURA";
  const blob = recorder.getBlob();
  let urlCreator = window.URL || window.webkitURL;
  imageUrl = urlCreator.createObjectURL(blob);
  previewImg.src = imageUrl;
  video.style.display = "none";
  previewImg.style.display = "block";
  buttonFinalizar.style.display = "none";
  buttonUpload.style.display = "block";
  counter.addEventListener("click", repeatCapture);
});

buttonUpload.addEventListener("click", async () => {
  efectosImg.style.display = "block";
  efectosImg.removeAttribute("src");
  efectosImg.removeAttribute("alt");
  loaderSubirGifo.style.display = "block";
  imgSubir.style.display = "block";
  if (localStorage.getItem("mode-dark") === "black") {
    paso3.src = "assets/img/paso-a-paso-hover-mod-noc3.svg";
    paso2.src = "assets/img/paso-a-paso-mod-noc2.svg";
  } else {
    paso3.src = "assets/img/paso-a-paso-hover3.svg";
    paso2.src = "assets/img/paso-a-paso2.svg";
  }
  counter.style.display = "none";
  buttonUpload.style.display = "none";
  let form = new FormData();
  form.append("file", recorder.getBlob(), "myGif.gif");
  form.append("tags", "");
  const uploadGif = await fetch(
    `${apiGiphy.API_URL_UPLOAD}api_key=${apiGiphy.API_KEY}`,
    {
      method: "POST",
      body: form,
    }
  );
  const resUpload = await uploadGif.json();
  if (resUpload.meta.status === 200) {
    loaderSubirGifo.style.display = "none";
    imgSubir.style.display = "none";
    loaderExitoGifo.style.display = "block";
    imgExito.style.display = "block";
    spanActions.style.display = "block";
    iconDownload.download = "mygif";
    iconDownload.href = imageUrl;
    iconDownload.dataset.downloadurl = [
      "application/octet-stream",
      iconDownload.download,
      iconDownload.href,
    ].join(":");
    const results = await apiGiphy.getGifoId(resUpload.data.id);
    const res = await results.json();
    console.log(res);
    iconLink.href = res.data.url;
    apiGiphy.localStorageMisGifos.push({
      id: res.data.id,
      title: res.data.title,
      username: res.data.username,
      images: { original: { url: res.data.images.original.url } },
    });

    localStorage.setItem(
      "listMisGifos",
      JSON.stringify(apiGiphy.localStorageMisGifos)
    );
  }
});

function onGifRecordingStarted(recorder) {
  recorder.startRecording();
  timer();
}

function repeatCapture() {
  previewImg.style.display = "none";
  efectosImg.style.display = "none";
  video.style.display = "none";
  textCrear1.forEach((item) => (item.style.display = "block"));
  loaderExitoGifo.style.display = "none";
  loaderSubirGifo.style.display = "none";
  imgExito.style.display = "none";
  imgSubir.style.display = "none";

  buttonsActionsModeDark(paso1, paso2, paso3);
  counter.style.display = "none";
  buttonUpload.style.display = "none";
  buttonFinalizar.style.display = "none";
  buttonGrabar.style.display = "none";
  spanActions.style.display = "none";
  buttonComenzar.style.display = "block";
}

//funcion para timer de create
function timer() {
  let sec = 0;
  let min = 0;
  let hour = 0;
  countdown = setInterval(function () {
    counter.innerHTML = `${hour}:${min}:${sec}`;
    sec++;
    if (sec == 60) {
      sec = 0;
      min++;
      if (min == 60) {
        min = 0;
        hour++;
      }
    }
  }, 1000);
}

export { buttonsActionsModeDark };
