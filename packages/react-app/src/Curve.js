import React, { useRef, useEffect } from 'react';

const Curve = (props) => {
  let ref = useRef();

  useEffect(() => {
    let canvas = ref.current;

    const textSize = 16

    const width = canvas.width ;
    const height = canvas.height ;

    if (canvas.getContext && props.ethReserve && props.tokenReserve ) {

      const k = props.ethReserve * props.tokenReserve

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,width,height);

      let maxX = k/(props.ethReserve/4)
      let minX = 0

      if(props.addingEth||props.addingToken){
        maxX = k/(props.ethReserve*0.4)
        //maxX = k/(props.ethReserve*0.8)
        minX = k/Math.max(0,(500-props.ethReserve))
      }

      const maxY = maxX * height / width;
      const minY = minX * height / width;

      const plotX = (x)=>{
        return (x - minX) / (maxX - minX) * width ;
      }

      const plotY = (y)=>{
        return height - (y - minY) / (maxY - minY) * height ;
      }
      ctx.strokeStyle = "#FFFFFF";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = textSize+"px Arial";
      // +Y axis
      ctx.beginPath() ;
      ctx.moveTo(plotX(minX),plotY(0)) ;
      ctx.lineTo(plotX(minX),plotY(maxY)) ;
      ctx.stroke() ;
      // +X axis
      ctx.beginPath() ;
      ctx.moveTo(plotX(0),plotY(minY)) ;
      ctx.lineTo(plotX(maxX),plotY(minY)) ;
      ctx.stroke() ;

      ctx.lineWidth = 2 ;
      ctx.beginPath() ;
      let first = true
      for (var x = minX; x <= maxX; x += maxX/width) {
        /////
        var y = k / x
        /////
        if (first) {
          ctx.moveTo(plotX(x),plotY(y))
          first = false
        } else {
          ctx.lineTo(plotX(x),plotY(y))
        }
      }
      ctx.stroke() ;

      ctx.lineWidth = 3 ;

      if(props.addingEth){

        let newEthReserve = props.ethReserve + parseFloat(props.addingEth)

        ctx.fillStyle = "#eeeeee";
        ctx.beginPath();
        ctx.arc(plotX(newEthReserve),plotY(k/(newEthReserve)), 5, 0, 2 * Math.PI);
        ctx.fill();


        ctx.strokeStyle = "#999999";
        drawArrow(ctx,plotX(newEthReserve),plotY(props.tokenReserve),plotX(newEthReserve),plotY(k/(newEthReserve)))


        ctx.fillStyle = "#222222";
        ctx.fillText("$"+props.addingEth+" xDai input", plotX(props.ethReserve)+textSize, plotY(props.tokenReserve)-textSize);

        ctx.strokeStyle = "#333333";
        drawArrow(ctx,plotX(props.ethReserve),plotY(props.tokenReserve),plotX(newEthReserve),plotY(props.tokenReserve))



        let amountGained =  Math.round(10000 * ( props.addingEth * props.tokenReserve ) / ( newEthReserve ) ) /10000
        ctx.fillStyle = "#000000";
        ctx.fillText(""+(amountGained*props.tokenDivider)+" 🌒  output", plotX(newEthReserve)+textSize,plotY(k/(newEthReserve)));

      }else if(props.addingToken){

        let newTokenReserve = props.tokenReserve + parseFloat(props.addingToken)

        ctx.fillStyle = "#bbbbbb";
        ctx.beginPath();
        ctx.arc(plotX(k/(newTokenReserve)),plotY(newTokenReserve), 5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = "#999999";
        drawArrow(ctx,plotX(props.ethReserve),plotY(newTokenReserve),plotX(k/(newTokenReserve)),plotY(newTokenReserve))


        //console.log("newTokenReserve",newTokenReserve)
        ctx.strokeStyle = "#333333";
        drawArrow(ctx,plotX(props.ethReserve),plotY(props.tokenReserve),plotX(props.ethReserve),plotY(newTokenReserve))

        ctx.fillStyle = "#000000";
        ctx.fillText(""+(props.addingToken*props.tokenDivider)+" 🌒  input", plotX(props.ethReserve)+textSize,plotY(props.tokenReserve));


        let amountGained =  Math.round(10000 * ( props.addingToken * props.ethReserve ) / ( newTokenReserve ) ) /10000
        //console.log("amountGained",amountGained)
        ctx.fillStyle = "#000000";
        ctx.fillText("$"+amountGained+" xDai output", plotX(k/(newTokenReserve))+textSize,plotY(newTokenReserve)-textSize);

      }else{

        let newEthReserve = props.ethReserve + parseFloat(1)
        let amountTokenGained =  Math.round(10000 * ( 1 * props.tokenReserve ) / ( newEthReserve ) ) /10000
        ctx.fillStyle = "#aaaaaa";

        ctx.fillText("$1.00 xDAI is trading for "+(amountTokenGained)+" 🌒  xMOON", plotX(props.ethReserve)+textSize,plotY(props.tokenReserve)-(textSize*2));

        let newTokenReserve = props.tokenReserve + parseFloat(1)
        let amountGained =  Math.round(10000 * ( 1 * props.ethReserve ) / ( newTokenReserve ) ) /10000
        ctx.fillText("1 🌒  xMOON is trading for $"+(amountGained/props.tokenDivider)+" xDAI", plotX(props.ethReserve)+textSize*2,plotY(props.tokenReserve));




      }

      ctx.fillStyle = "#111111"
      ctx.beginPath();
      ctx.arc(plotX(props.ethReserve),plotY(props.tokenReserve), 5, 0, 2 * Math.PI);
      ctx.fill();

    }
  },[props]);


  return (
    <div style={{margin:32,position:'relative',width:props.width,height:props.height}}>
      <canvas
        style={{position:'absolute',left:0,top:0}}
        ref={ref}
        {...props}
      />
      <div style={{position:'absolute',fontSize:20,left:"20%",bottom:10,color:"#ededed"}}>
       {props.ethReserveDisplay} -->
      </div>
      <div style={{position:'absolute',fontSize:20,left:10,bottom:"20%",transform:"rotate(-90deg)",transformOrigin:"0 0",color:"#ededed"}}>
       {props.tokenReserveDisplay} -->
      </div>
    </div>
  );
};

export default Curve;


const drawArrow = (ctx,x1,y1,x2,y2)=>{
  let [dx,dy] = [x1-x2, y1-y2]
  let norm = Math.sqrt(dx * dx + dy * dy)
  let [udx, udy] = [dx/norm, dy/norm]
  const size = norm/7
  ctx.beginPath();
  ctx.moveTo(x1,y1) ;
  ctx.lineTo(x2,y2) ;
  ctx.stroke() ;
  ctx.moveTo(x2,y2) ;
  ctx.lineTo(x2 + udx*size - udy*size,y2 + udx*size + udy*size ) ;
  ctx.moveTo(x2,y2) ;
  ctx.lineTo(x2 + udx*size +udy*size ,y2 - udx*size + udy*size) ;
  ctx.stroke() ;
}