let Portfolio=function(options){

    //letiables

    let speedFact=20;
    let backgroundFactor;
    let zoomLimit=[1,backgroundFactor];
    let mousePosition=['a','a'];
    let mousePositionTemp=['a','a'];
    let center;
    let movementActive;
    let start='true';
    let imageSize=['a','a'];
    let backgroundImage=new Image();
    let backgroundImageRatio;
    let screenRatio;
    let mobile;
    let steps=['a','a'];
    let backgroundActualPosition=['a','a'];
    let mode;

    let colorDecimal=[0,0,0];
    let colorHexadecimal;
    let tempColor=[0,0];
    let stepColor=['a','a'];





    //fonctions publiques

    function init(srcImg,backgroundValue){
        backgroundFactor=backgroundValue;
        
        mode="ARRET";
        document.getElementById('mode').innerHTML=mode;
        document.querySelector('main').style.background='#000000';
        if(screen.height>screen.width)
        {
            mobile=true;
        }
        else
        {
            mobile=false;
        }

        document.getElementById('background').style.backgroundImage="url("+srcImg+")";
        center=[window.innerWidth/2,window.innerHeight/2]
        backgroundImage.src=srcImg;
        backgroundImage.onload = function() {
            screenRatio=window.innerHeight/window.innerWidth
            backgroundImageRatio=this.height/this.width;

            if(screenRatio>backgroundImageRatio){
                imageSize[1]=window.innerHeight*backgroundFactor;
                imageSize[0]=imageSize[1]/backgroundImageRatio;
                document.getElementById('background').style.backgroundSize = (backgroundFactor*100*screenRatio/backgroundImageRatio).toString()+'%';   
            }
            else{
                imageSize[0]=window.innerWidth*backgroundFactor;
                imageSize[1]=imageSize[0]*backgroundImageRatio;
                document.getElementById('background').style.backgroundSize = (backgroundFactor*100).toString()+'%';
            }
            
            document.getElementById('background').style.backgroundPositionX =((window.innerWidth-imageSize[0])/2).toString()+'px';
            document.getElementById('background').style.backgroundPositionY = ((window.innerHeight-imageSize[1])/2).toString()+'px';
            console.log(imageSize);
            document.getElementById('background').addEventListener("click", function(event){
                toogleMovement();
            })
            backToMap();
            ratioImages('profilePicture');
            // zoom('wheel');
            stepColor=[(-(window.innerWidth-imageSize[0])/2)/255,(-(window.innerHeight-imageSize[1])/2)/255];
            console.log(stepColor);
        }
    }

    //fonctions privées

    function toogleMovement(){
//            if(mobile)
//            {}
//            else
//            {
                if(start)
                {
                    movementActive= setInterval(function(){
                        vectorDirectionPC('mousemove');
                    },17);    //17 ms = 60fps
                    mode="DÉPLACEMENT";
                    start=false;
                }
                else
                {
                    clearInterval(movementActive);
                    start=true;
                    mode="ARRET";
                }
  //          }
        document.getElementById('mode').innerHTML=mode;

    }

    function vectorDirectionPC(action){
            document.addEventListener(action, function(event){
                mousePosition=[event.pageX-center[0],event.pageY-center[1]];
            });
            if( (mousePositionTemp[0]!=mousePosition[0]) || (mousePositionTemp[1]!=mousePosition[1]) )
            {
                mousePositionTemp=mousePosition;
            }
            moveBackground();


    }

    function moveBackground() {

        steps[0]=(parseInt(document.getElementById('background').style.backgroundPositionX.replace('px',''))-(mousePosition[0])/speedFact).toString()+'px';
        steps[1]=(parseInt(document.getElementById('background').style.backgroundPositionY.replace('px',''))-(mousePosition[1])/speedFact).toString()+'px';

        backgroundActualPosition[0]=parseInt(document.getElementById('background').style.backgroundPositionX.replace('px',''));
        backgroundActualPosition[1]=parseInt(document.getElementById('background').style.backgroundPositionY.replace('px',''));

        if(backgroundActualPosition[0]>0){
            document.getElementById('leftPannel').classList.add('startAppearX');
            document.getElementById('background').style.backgroundPositionX='0px';

            toogleMovement();
        }
        if(backgroundActualPosition[0]< -(imageSize[0]-window.innerWidth)){
           // console.log('a');
            document.getElementById('rightPannel').classList.add('startAppearX');
            document.getElementById('background').style.backgroundPositionX=-(imageSize[0]-window.innerWidth)+'px';
            toogleMovement();
        }

        if(backgroundActualPosition[1]>0){
            document.getElementById('background').style.backgroundPositionY='0px';
        }
        if(backgroundActualPosition[1]<-(imageSize[1]-window.innerHeight)){
            document.getElementById('bottomPannel').classList.add('startAppearY');
            document.getElementById('background').style.backgroundPositionY=-(imageSize[1]-window.innerHeight)+'px';
            toogleMovement();
        }



        if( (backgroundActualPosition[0]<0 || mousePosition[0]>=0) && (backgroundActualPosition[0]>-(imageSize[0]-window.innerWidth) || mousePosition[0]<=0) ){
            document.getElementById('background').style.backgroundPositionX=steps[0];
        }
        if( (backgroundActualPosition[1]<0 || mousePosition[1]>=0) && (backgroundActualPosition[1]>-(imageSize[1]-window.innerHeight) || mousePosition[1]<=0) ){
            document.getElementById('background').style.backgroundPositionY=steps[1];
        }
        color();
 //console.log(backgroundActualPosition[0]);
      //  console.log(imageSize[0]-window.innerWidth);
    }

    function zoom(action){
        document.addEventListener(action, function(event){
            event.preventDefault();
           // console.log(event.pageX);
           // console.log(event.pageY);

            let sign=-event.deltaY/Math.abs(event.deltaY);
            let canScroll=false;
            if((backgroundFactor>=zoomLimit[0]) && (backgroundFactor<=zoomLimit[1])){
                canScroll=true;
            }
            else{
                if (backgroundFactor<zoomLimit[0] && sign>0)
                {
                    canScroll=true;
                }
                else if(backgroundFactor>zoomLimit[1] && sign<0)
                {
                    canScroll=true;
                }
            }
            if (canScroll){
                vectorDirectionPC(action);
                backgroundFactor+=sign*0.1;
                if(screenRatio>backgroundImageRatio)
                {
                    document.getElementById('background').style.backgroundSize = (backgroundFactor*100*screenRatio/backgroundImageRatio).toString()+'%';   
                }
                else
                {
                    document.getElementById('background').style.backgroundSize = (backgroundFactor*100).toString()+'%';
                }
            }

        })
    }

    //.log(document.querySelector('main').style.backgroundPosition);

    function color()
    {
        tempColor[0]=(parseInt(document.getElementById('background').style.backgroundPositionX.replace('px',''))-(window.innerWidth-imageSize[0])/2)/stepColor[0];
        tempColor[1]=(parseInt(document.getElementById('background').style.backgroundPositionY.replace('px',''))-(window.innerHeight-imageSize[1])/2)/stepColor[1];
        if(tempColor[0]<0){
            colorDecimal[0]=-Math.round(tempColor[0]);
        }
        else{
            colorDecimal[1]=Math.round(tempColor[0]);
        }
        if(tempColor[1]<0){
            colorDecimal[2]=-Math.round(tempColor[1]);
        }
        else
        {
            colorDecimal[2]=0;
        }

        colorHexadecimal='#';

        if(colorDecimal[0]==0)
        {
            colorHexadecimal+='00';
        }
        else if(colorDecimal[0]<=16)
        {
            colorHexadecimal+='0'+colorDecimal[0].toString(16);
        }
        else
        {
            colorHexadecimal+=colorDecimal[0].toString(16);
        }

        if(colorDecimal[1]==0)
        {
            colorHexadecimal+='00';
        }
        else if(colorDecimal[1]<=16)
        {
            colorHexadecimal+='0'+colorDecimal[1].toString(16);
        }
        else
        {
            colorHexadecimal+=colorDecimal[1].toString(16);
        }

        
        if(colorDecimal[2]==0)
        {
            colorHexadecimal+='00';
        }
        else if(colorDecimal[2]<=16)
        {
            colorHexadecimal+='0'+colorDecimal[2].toString(16);
        }
        else
        {
            colorHexadecimal+=colorDecimal[2].toString(16);
        }
        console.log(colorHexadecimal);
        document.querySelector('main').style.background=colorHexadecimal;
    }

    function backToMap()
    {
        document.getElementById('exitPresentation').addEventListener('click',function(){
            document.getElementById('background').style.backgroundPositionX =((window.innerWidth-imageSize[0])/2).toString()+'px';
            document.getElementById('background').style.backgroundPositionY = ((window.innerHeight-imageSize[1])/2).toString()+'px';    
            document.getElementById('leftPannel').classList.remove('startAppearX');
            document.getElementById('leftPannel').classList.add('startLeaveLeft');
            setTimeout(function(){
                document.getElementById('leftPannel').classList.remove('startLeaveLeft');
            }, 1000);
        })
    }

    function ratioImages(image)
    {
        console.log(document.getElementById(image).clientWidth.toString()+'px');
        document.getElementById(image).style.height=document.getElementById(image).clientWidth.toString()+'px';
        console.log(document.getElementById(image).clientHeight.toString()+'px'); 
    }

    return {
        init: init,

    }
}
