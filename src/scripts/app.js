let Portfolio = function(options) {
  //letiables

  let speedFact = 20;
  let backgroundFactor;
  let zoomLimit = [1, backgroundFactor];
  let mousePosition = ["a", "a"];
  let mousePositionPrev = ["a", "a"];
  let mousePositionTemp = ["a", "a"];
  let center;
  let movementActive;
  let start = "true";
  let imageSize = ["a", "a"];
  let backgroundImage = new Image();
  let backgroundImageRatio;
  let screenRatio;
  let mobile;
  let steps = ["a", "a"];
  let backgroundActualPosition = ["a", "a"];
  let mode;

  let colorDecimal = [0, 0, 0];
  let colorHexadecimal;
  let tempColor = [0, 0];
  let stepColor = ["a", "a"];

  //fonctions publiques

  function init(srcImg, backgroundValue) {
    printCarousel();
    carousel();
    backgroundFactor = backgroundValue;

    mode = "ARRET";
    //document.getElementById("mode").innerHTML = mode;
    document.querySelector("main").style.background = "#000000";
    if (screen.height > screen.width) {
      mobile = true;
    } else {
      mobile = false;
    }
    rightPannel();

    document.getElementById("background").style.backgroundImage =
      "url(" + srcImg + ")";
    center = [window.innerWidth / 2, window.innerHeight / 2];
    backgroundImage.src = srcImg;
    backgroundImage.onload = function() {
      screenRatio = window.innerHeight / window.innerWidth;
      backgroundImageRatio = this.height / this.width;

      if (screenRatio > backgroundImageRatio) {
        imageSize[1] = window.innerHeight * backgroundFactor;
        imageSize[0] = imageSize[1] / backgroundImageRatio;
        document.getElementById("background").style.backgroundSize =
          (
            (backgroundFactor * 100 * screenRatio) /
            backgroundImageRatio
          ).toString() + "%";
      } else {
        imageSize[0] = window.innerWidth * backgroundFactor;
        imageSize[1] = imageSize[0] * backgroundImageRatio;
        document.getElementById("background").style.backgroundSize =
          (backgroundFactor * 100).toString() + "%";
      }

      document.getElementById("background").style.backgroundPositionX =
        ((window.innerWidth - imageSize[0]) / 2).toString() + "px";
      document.getElementById("background").style.backgroundPositionY =
        ((window.innerHeight - imageSize[1]) / 2).toString() + "px";
      console.log(imageSize);
      document
        .getElementById("background")
        .addEventListener("click", function(event) {
          toogleMovement();
        });
      document
        .getElementById("background")
        .addEventListener("touchstart", function(event) {
          toogleMovement();
        });
      backToMap();

      ratioImages("profilePicture");
      // zoom('wheel');
      stepColor = [
        -(window.innerWidth - imageSize[0]) / 2 / 255,
        -(window.innerHeight - imageSize[1]) / 2 / 255
      ];
      //    console.log(stepColor);
    };
  }

  //fonctions privées

  function toogleMovement() {
    if (mobile) {
      handleTouch();
    } else {
      if (start) {
        movementActive = setInterval(function() {
          vectorDirectionPC("mousemove");
        }, 17); //17 ms = 60fps
        mode = "DÉPLACEMENT";
        start = false;
      } else {
        clearInterval(movementActive);
        start = true;
        mode = "ARRET";
      }
    }

    //          }
    // document.getElementById("mode").innerHTML = mode;
  }

  let touchstartX = 0;
  let touchstartY = 0;
  let touchendX = 0;
  let touchendY = 0;
  let xDiff;
  let yDiff;

  function handleTouch() {
    document.getElementById("background").addEventListener(
      "touchstart",
      function(event) {
        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
      },
      false
    );

    document.getElementById("background").addEventListener(
      "touchmove",
      function(event) {
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        xDiff = touchendX - touchstartX;
        yDiff = touchendY - touchstartY;
        backgroundActualPosition[0] =
          parseInt(
            document
              .getElementById("background")
              .style.backgroundPositionX.replace("px", "")
          ) + xDiff;
        backgroundActualPosition[1] =
          parseInt(
            document
              .getElementById("background")
              .style.backgroundPositionY.replace("px", "")
          ) + yDiff;

        document.getElementById("mode").innerHTML = xDiff;
        swipe();
        touchstartX = touchendX;
        touchstartY = touchendY;
      },
      false
    );
  }

  function swipe() {
    document.getElementById("background").style.backgroundPositionX =
      backgroundActualPosition[0].toString() + "px";
    document.getElementById("background").style.backgroundPositionY =
      backgroundActualPosition[1].toString() + "px";
    document.getElementById("mode").innerHTML = document.getElementById(
      "background"
    ).style.backgroundPositionX;
    limits();
  }

  function vectorDirectionPC(action) {
    document.addEventListener(action, function(event) {
      mousePosition = [event.pageX - center[0], event.pageY - center[1]];
    });
    if (
      mousePositionTemp[0] != mousePosition[0] ||
      mousePositionTemp[1] != mousePosition[1]
    ) {
      mousePositionTemp = mousePosition;
    }
    moveBackground();
  }

  function moveBackground() {
    steps[0] =
      (
        parseInt(
          document
            .getElementById("background")
            .style.backgroundPositionX.replace("px", "")
        ) -
        mousePosition[0] / speedFact
      ).toString() + "px";
    steps[1] =
      (
        parseInt(
          document
            .getElementById("background")
            .style.backgroundPositionY.replace("px", "")
        ) -
        mousePosition[1] / speedFact
      ).toString() + "px";

    backgroundActualPosition[0] = parseInt(
      document
        .getElementById("background")
        .style.backgroundPositionX.replace("px", "")
    );
    backgroundActualPosition[1] = parseInt(
      document
        .getElementById("background")
        .style.backgroundPositionY.replace("px", "")
    );

    limits();
    color();

    if (
      (backgroundActualPosition[0] < 0 || mousePosition[0] >= 0) &&
      (backgroundActualPosition[0] > -(imageSize[0] - window.innerWidth) ||
        mousePosition[0] <= 0)
    ) {
      document.getElementById("background").style.backgroundPositionX =
        steps[0];
    }
    if (
      (backgroundActualPosition[1] < 0 || mousePosition[1] >= 0) &&
      (backgroundActualPosition[1] > -(imageSize[1] - window.innerHeight) ||
        mousePosition[1] <= 0)
    ) {
      document.getElementById("background").style.backgroundPositionY =
        steps[1];
    }

    //console.log(backgroundActualPosition[0]);
    //  console.log(imageSize[0]-window.innerWidth);
  }

  function limits() {
    if (backgroundActualPosition[0] > 0) {
      document.getElementById("mode").innerHTML = "AAAAAAAAA";

      document.getElementById("leftPannel").classList.add("startAppearX");
      document.getElementById("background").style.backgroundPositionX = "0px";
      if (!mobile) {
        toogleMovement();
      }
    }
    if (backgroundActualPosition[0] < -(imageSize[0] - window.innerWidth)) {
      // console.log('a');
      document.getElementById("rightPannel").classList.add("startAppearX");
      document.getElementById("background").style.backgroundPositionX =
        -(imageSize[0] - window.innerWidth) + "px";
      if (!mobile) {
        toogleMovement();
      }
    }

    if (backgroundActualPosition[1] > 0) {
      document.getElementById("background").style.backgroundPositionY = "0px";
    }
    if (backgroundActualPosition[1] < -(imageSize[1] - window.innerHeight)) {
      document.getElementById("bottomPannel").classList.add("startAppearY");
      document.getElementById("background").style.backgroundPositionY =
        -(imageSize[1] - window.innerHeight) + "px";
      if (!mobile) {
        toogleMovement();
      }
    }
  }

  //.log(document.querySelector('main').style.backgroundPosition);

  function color() {
    tempColor[0] =
      (parseInt(
        document
          .getElementById("background")
          .style.backgroundPositionX.replace("px", "")
      ) -
        (window.innerWidth - imageSize[0]) / 2) /
      stepColor[0];
    tempColor[1] =
      (parseInt(
        document
          .getElementById("background")
          .style.backgroundPositionY.replace("px", "")
      ) -
        (window.innerHeight - imageSize[1]) / 2) /
      stepColor[1];
    if (tempColor[0] < 0) {
      colorDecimal[0] = -Math.round(tempColor[0]);
    } else {
      colorDecimal[1] = Math.round(tempColor[0]);
    }
    if (tempColor[1] < 0) {
      colorDecimal[2] = -Math.round(tempColor[1]);
    } else {
      colorDecimal[2] = 0;
    }

    colorHexadecimal = "#";

    if (colorDecimal[0] == 0) {
      colorHexadecimal += "00";
    } else if (colorDecimal[0] <= 16) {
      colorHexadecimal += "0" + colorDecimal[0].toString(16);
    } else {
      colorHexadecimal += colorDecimal[0].toString(16);
    }

    if (colorDecimal[1] == 0) {
      colorHexadecimal += "00";
    } else if (colorDecimal[1] <= 16) {
      colorHexadecimal += "0" + colorDecimal[1].toString(16);
    } else {
      colorHexadecimal += colorDecimal[1].toString(16);
    }

    if (colorDecimal[2] == 0) {
      colorHexadecimal += "00";
    } else if (colorDecimal[2] <= 16) {
      colorHexadecimal += "0" + colorDecimal[2].toString(16);
    } else {
      colorHexadecimal += colorDecimal[2].toString(16);
    }
    // console.log(colorHexadecimal);
    document.querySelector("main").style.background = colorHexadecimal;
  }

  function backToMap() {
    document
      .getElementById("exitPresentation")
      .addEventListener("click", function() {
        document.getElementById("background").style.backgroundPositionX =
          ((window.innerWidth - imageSize[0]) / 2).toString() + "px";
        document.getElementById("background").style.backgroundPositionY =
          ((window.innerHeight - imageSize[1]) / 2).toString() + "px";
        document.getElementById("leftPannel").classList.remove("startAppearX");
        document.getElementById("leftPannel").classList.add("startLeaveLeft");
        setTimeout(function() {
          document
            .getElementById("leftPannel")
            .classList.remove("startLeaveLeft");
        }, 1000);
      });

    document.getElementById("exitSkills").addEventListener("click", function() {
      document.getElementById("background").style.backgroundPositionX =
        ((window.innerWidth - imageSize[0]) / 2).toString() + "px";
      document.getElementById("background").style.backgroundPositionY =
        ((window.innerHeight - imageSize[1]) / 2).toString() + "px";
      document.getElementById("bottomPannel").classList.remove("startAppearY");
      document.getElementById("bottomPannel").classList.add("startLeaveBottom");
      setTimeout(function() {
        document
          .getElementById("bottomPannel")
          .classList.remove("startLeaveBottom");
      }, 1000);
    });

    document
      .getElementById("exitCreations")
      .addEventListener("click", function() {
        document.getElementById("background").style.backgroundPositionX =
          ((window.innerWidth - imageSize[0]) / 2).toString() + "px";
        document.getElementById("background").style.backgroundPositionY =
          ((window.innerHeight - imageSize[1]) / 2).toString() + "px";
        document.getElementById("rightPannel").classList.remove("startAppearX");
        document.getElementById("rightPannel").classList.add("startLeaveRight");
        setTimeout(function() {
          document
            .getElementById("rightPannel")
            .classList.remove("startLeaveRight");
        }, 1000);
      });
  }

  function ratioImages(image) {
    document.getElementById(image).style.height =
      document.getElementById(image).clientWidth.toString() + "px";
  }

  let tabCarouselSkills = [
    {
      name: "a",
      category: "dev",
      src: "./assets/img/fr.jpg"
    },
    {
      name: "b",
      category: "dev",
      src: "./assets/img/fr.jpg"
    },
    {
      name: "c",
      category: "dev",
      src: "./assets/img/fr.jpg"
    },
    {
      name: "d",
      category: "graph",
      src: "./assets/img/eng.jpg"
    },
    {
      name: "e",
      category: "graph",
      src: "./assets/img/eng.jpg"
    },
    {
      name: "f",
      category: "audio",
      src: "./assets/img/esp.jpg"
    },
    {
      name: "g",
      category: "audio",
      src: "./assets/img/esp.jpg"
    },
    {
      name: "h",
      category: "audio",
      src: "./assets/img/esp.jpg"
    },
    {
      name: "i",
      category: "other",
      src: "./assets/img/eng.jpg"
    },
    {
      name: "j",
      category: "other",
      src: "./assets/img/eng.jpg"
    }
  ];
  let centralCarouselSkills = 0;
  let lengthCarouselSkills = tabCarouselSkills.length;
  function carousel() {
    carouselButton("skills__dev");
    carouselButton("skills__graph");
    carouselButton("skills__audio");
    carouselButton("skills__other");
    document
      .getElementById("skills__left")
      .addEventListener("click", function() {
        if (centralCarouselSkills == 0) {
          centralCarouselSkills = lengthCarouselSkills - 1;
        } else {
          centralCarouselSkills--;
        }
        printCarousel();
      });
    document
      .getElementById("skills__right")
      .addEventListener("click", function() {
        if (centralCarouselSkills == lengthCarouselSkills - 1) {
          centralCarouselSkills = 0;
        } else {
          centralCarouselSkills++;
        }
        printCarousel();
      });
  }
  function carouselButton(button) {
    document.getElementById(button).addEventListener("click", function() {
      changeCentral = true;
      for (let i = 0; i < lengthCarouselSkills; i++) {
        if (
          button.replace("skills__", "") == tabCarouselSkills[i]["category"] &&
          changeCentral
        ) {
          centralCarouselSkills = i + 1;
          changeCentral = false;
        }
      }
      printCarousel();
    });
  }
  function printCarousel() {
    document.getElementById("skills__secondImage").src =
      tabCarouselSkills[centralCarouselSkills]["src"];
    document.getElementById("skills__secondText").innerHTML =
      tabCarouselSkills[centralCarouselSkills]["category"];
    if (centralCarouselSkills == 0) {
      document.getElementById("skills__firstImage").src =
        tabCarouselSkills[lengthCarouselSkills - 1]["src"];
      document.getElementById("skills__firstText").innerHTML =
        tabCarouselSkills[lengthCarouselSkills - 1]["category"];
      document.getElementById("skills__thirdImage").src =
        tabCarouselSkills[centralCarouselSkills + 1]["src"];
      document.getElementById("skills__thirdText").innerHTML =
        tabCarouselSkills[centralCarouselSkills + 1]["category"];
    } else if (centralCarouselSkills == lengthCarouselSkills - 1) {
      document.getElementById("skills__firstImage").src =
        tabCarouselSkills[centralCarouselSkills - 1]["src"];
      document.getElementById("skills__firstText").innerHTML =
        tabCarouselSkills[centralCarouselSkills - 1]["category"];
      document.getElementById("skills__thirdImage").src =
        tabCarouselSkills[0]["src"];
      document.getElementById("skills__thirdText").innerHTML =
        tabCarouselSkills[0]["category"];
    } else {
      document.getElementById("skills__firstImage").src =
        tabCarouselSkills[centralCarouselSkills - 1]["src"];
      document.getElementById("skills__firstText").innerHTML =
        tabCarouselSkills[centralCarouselSkills - 1]["category"];
      document.getElementById("skills__thirdImage").src =
        tabCarouselSkills[centralCarouselSkills + 1]["src"];
      document.getElementById("skills__thirdText").innerHTML =
        tabCarouselSkills[centralCarouselSkills + 1]["category"];
    }
  }

  let tabCreations = [
    {
      name: "a",
      category: "dev",
      src: "./assets/img/fr.jpg",
      text: "blublulbulbulbublublublbulbulbuzadz",
      alt: "goirejiogjerio"
    },
    {
      name: "b",
      category: "dev",
      src: "./assets/img/fr.jpg",
      text: "blublulbulbulbublublublbulbulbuzadz",
      alt: "goirejiogjerio"
    },
    {
      name: "c",
      category: "dev",
      src: "./assets/img/fr.jpg",
      text: "blublulbulbulbublublublbulbulbuzadz",
      alt: "goirejiogjerio"
    },
    {
      name: "d",
      category: "graph",
      src: "./assets/img/eng.jpg",
      text: "blublulbulbulbublublublbulbulbuzadz",
      alt: "goirejiogjerio"
    },
    {
      name: "e",
      category: "graph",
      src: "./assets/img/eng.jpg",
      text: "blublulbulbulbublublublbulbulbuzadz",
      alt: "goirejiogjerio"
    },
    {
      name: "f",
      category: "audio",
      src: "./assets/img/esp.jpg",
      text: "blublulbulbulbublublublbulbulbuzadz",
      alt: "goirejiogjerio"
    },
    {
      name: "g",
      category: "audio",
      src: "./assets/img/esp.jpg",
      text: "blublulbulbulbublublublbulbulbuzadz",
      alt: "goirejiogjerio"
    },
    {
      name: "h",
      category: "audio",
      src: "./assets/img/esp.jpg",
      text: "blublulbulbulbublublublbulbulbuzadz",
      alt: "goirejiogjerio"
    },
    {
      name: "i",
      category: "audio",
      src: "./assets/img/eng.jpg",
      text: "blublulbulbulbublublublbulbulbuzadz",
      alt: "goirejiogjerio"
    },
    {
      name: "j",
      category: "audio",
      src: "./assets/img/eng.jpg",
      text: "blublulbulbulbublublublbulbulbuzadz",
      alt: "goirejiogjerio"
    }
  ];
  let lengthCreations = tabCreations.length;
  let actualCreation = 0;
  actualImage = document.getElementById("creation__actualImage");
  actualFigcaption = document.getElementById("creation__actualText");

  let listBloc=document.getElementById("creationsList");
  let devBloc=document.getElementById('selection__dev');
  let graphBloc=document.getElementById('selection__graph');
  let audioBloc=document.getElementById('selection__audio');

  function rightPannel() {
    buildSelection();
    selectMenu();
    displayCreation();
    prevNextCreations();
  }

  function displayCreation() {
    actualImage.src = tabCreations[actualCreation]["src"];
    actualImage.alt = tabCreations[actualCreation]["alt"];
    actualFigcaption.innerHTML = tabCreations[actualCreation]["text"];
  }

  function buildSelection() {
    let actualBloc;
    tabCategory=[0,0,0];
    lengthCategory=tabCategory.length;
    for (let i = 0; i < lengthCreations; i++) {
      if(tabCreations[i]["category"]=="dev"){
        tabCategory[0]+=1;
        actualBloc=devBloc;
      }
      else if (tabCreations[i]["category"]=="graph") {
        tabCategory[1]+=1;
        actualBloc=graphBloc;
      }
      else if (tabCreations[i]["category"]=="audio") {
        tabCategory[2]+=1; 
        actualBloc=audioBloc;
      }
      let figure = actualBloc.appendChild(document.createElement("figure"));
      figure.classList.add("selection__element");
      figure.id = "creation__" + i.toString();
      figure.dataset.category = tabCreations[i]["category"];
      figure.addEventListener("click", pickCreationById);
      let img = figure.appendChild(document.createElement("img"));
      img.classList.add("selection__image");
      img.src = tabCreations[i]["src"];
      img.alt = tabCreations[i]["alt"];
      let figcaption = figure.appendChild(document.createElement("figcaption"));
      figcaption.classList.add("selection__title");
      figcaption.innerHTML = tabCreations[i]["text"];
    }
    if(mobile){
       numberColumn=2;
    }
    else{

       numberColumn=4;
    }
    let rowNumber=[];
    for (let i = 0; i < 3; i++) {
      if(tabCategory[i]%numberColumn==0){
        rowNumber[i]=tabCategory[i]/numberColumn;
      }
      else{
        rowNumber[i]=Math.floor(tabCategory[i]/numberColumn)+1;
      }
    }  
    devBloc.style.gridTemplateRows="repeat("+(rowNumber[0]).toString()+", 1fr)";
    graphBloc.style.gridTemplateRows="repeat("+(rowNumber[1]).toString()+", 1fr)";
    audioBloc.style.gridTemplateRows="repeat("+(rowNumber[2]).toString()+", 1fr)";


  
  }

  function selectMenu() {
    document
      .getElementById("creationsListSelect")
      .addEventListener("click", appearList);
    document
      .getElementById("creationsShowSelect")
      .addEventListener("click", appearShow);
  }

  function appearList() {
    listBloc.style.display = "flex";
    document.getElementById("creationsShow").style.display = "none";
    document.getElementById("creation__buttons").style.display = "none";
  }
  function appearShow() {
    listBloc.style.display = "none";
    document.getElementById("creationsShow").style.display = "flex";
    document.getElementById("creation__buttons").style.display = "flex";
  }
  function prevNextCreations() {
    document
      .getElementById("creations__previous")
      .addEventListener("click", function() {
        if (actualCreation == 0) {
          actualCreation = lengthCreations - 1;
        } else {
          actualCreation -= 1;
        }
        displayCreation();
        console.log(actualCreation);
      });
    document
      .getElementById("creations__next")
      .addEventListener("click", function() {
        if (actualCreation == lengthCreations - 1) {
          actualCreation = 0;
        } else {
          actualCreation += 1;
        }
        displayCreation();
        console.log(actualCreation);
      });
  }

  function pickCreationById() {
    actualCreation = parseInt(this.id.replace("creation__", ""));
    displayCreation();
    appearShow();
  }
  

  return {
    init: init
  };
};

//START
document.addEventListener("DOMContentLoaded", function(event) {
  let portfolio = new Portfolio();
  portfolio.init("assets/img/imageFond.png", 3);
});
