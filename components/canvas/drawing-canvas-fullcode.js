import { useEffect, useRef, useState } from "react";
import { Edit2, Square } from "react-feather";

const DrawingCanvasFullCode = (props) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  // let rect = {
  //   startX: 20,
  //   startY: 20,
  //   w: 100,
  //   h: 100,
  // };
  // let drag,
  //   dragTL,
  //   dragBL,
  //   dragTR,
  //   dragBR = false;
  // let closeEnough = 5;
  // let mouseX, mouseY;

  // let offsetX;
  // let offsetY;
  let startX = 0;
  let startY = 0;
  //let storedLines = [];
  let isDown = false;

  const [isDrawing, setIsDrawing] = useState(false);

  const [isPencilStatus, setPencilStatus] = useState(true);
  const [isEraserStatus, setEraserStatus] = useState(false);
  const [isSquareStatus, setSquareStatus] = useState(false);
  const [isLineStatus, setLineStatus] = useState(false);

  const [canvasOffsetX, setOffsetX] = useState();
  const [canvasOffsetY, setOffsetY] = useState();

  const [pencilInitialOffsetX, setPencilInitialOffsetX] = useState();
  const [pencilInitialOffsetY, setPencilInitialOffsetY] = useState();

  const [pencilOffsetX, setPencilOffsetX] = useState();
  const [pencilOffsetY, setPencilOffsetY] = useState();

  const [storedLines, setStoreLines] = useState([]);

  const [cursorStyle, setCursorStyle] = useState("canvas-container-pencil");
  const [actionType, setActionType] = useState("pencil");

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 700;
    canvas.height = 500;

    setOffsetX(canvas.getBoundingClientRect().left);
    setOffsetY(canvas.getBoundingClientRect().top);

    const context = canvas.getContext("2d");

    context.lineCap = "round";
    context.strokeStyle = "black";
    context.strokeWidth = 2;
    context.lineWidth = 2;
    contextRef.current = context;
  }, []);

  const startDrawingPencil = ({ nativeEvent }) => {
    const { offsetX, offsetY, clientX, clientY } = nativeEvent;

    if (actionType == "pencil") {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
      // setPencilInitialOffsetX(offsetX);
      // setPencilInitialOffsetY(offsetY);
      startX = offsetX;
      startY = offsetY;
      setIsDrawing(true);
    } else {
      let mouseX = parseInt(clientX - canvasOffsetX);
      let mouseY = parseInt(clientY - canvasOffsetY);

      isDown = true;
      startX = mouseX;
      startY = mouseY;
    }

    nativeEvent.preventDefault();
  };

  const drawPencil = ({ nativeEvent }) => {

    const { offsetX, offsetY, clientX, clientY } = nativeEvent;


    if (actionType == "pencil") {
      if (!isDrawing) {
        return;
      }

      
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
      setPencilOffsetX(offsetX);
      setPencilOffsetY(offsetY);
    }else{

      if (!isDown) return;

      redrawStoredLines();

      let mouseX = parseInt(clientX - canvasOffsetX);
      let mouseY = parseInt(clientY - canvasOffsetY);

      if (actionType == "square") {
        contextRef.current.beginPath();
        contextRef.current.rect(startX, startY, mouseX - startX, mouseY - startY);
        contextRef.current.stroke();
      }
      if (actionType == "line") {
        contextRef.current.beginPath();
        contextRef.current.moveTo(startX, startY);
        contextRef.current.lineTo(mouseX, mouseY);
        contextRef.current.stroke();
      }


    }



    nativeEvent.preventDefault();
  };

  const stopDrawingPencil = ({nativeEvent}) => {
    if (actionType == "pencil") {
      contextRef.current.closePath();
      setIsDrawing(false);


    //   let pencilmouseX = parseInt(pencilOffsetX - canvasOffsetX);
    // let pencilmouseY = parseInt(pencilOffsetY - canvasOffsetY);

    // storedLines.push({
    //   actionType: actionType,
    //   x1: startX,
    //   y1: startY,
    //   x2: pencilOffsetX,
    //   y2: pencilOffsetY,
    // });

    // redrawStoredLines();



    }else{

      const {clientX, clientY } = nativeEvent;

      isDown = false;

    let mouseX = parseInt(clientX - canvasOffsetX);
    let mouseY = parseInt(clientY - canvasOffsetY);

    storedLines.push({
      actionType: actionType,
      x1: startX,
      y1: startY,
      x2: mouseX,
      y2: mouseY,
    });

    redrawStoredLines();

    }
  };

  //onMouseDown
  const startDrawing = (e) => {
    let mouseX = parseInt(e.clientX - canvasOffsetX);
    let mouseY = parseInt(e.clientY - canvasOffsetY);

    isDown = true;
    startX = mouseX;
    startY = mouseY;

    if (actionType == "pencil") {
      contextRef.current.beginPath();
      contextRef.current.moveTo(e.offsetX, e.offsetY);
      contextRef.current.lineTo(e.offsetX, e.offsetY);
      contextRef.current.stroke();
      setIsDrawing(true);
    }

    e.preventDefault();
    e.stopPropagation();

    // const { offsetX, offsetY, pageX, pageY, clientX, clientY } = nativeEvent;
    // //console.log(nativeEvent);

    // mouseX = parseInt(offsetX - canvasOffsetX);
    // mouseY = parseInt(offsetY - canvasOffsetY);

    // startX = mouseX;
    // startY = mouseY;

    // if (isSquareStatus) {
    //   console.log("draw a square");
    //   // mouseX = parseInt(pageX - clientX);
    //   // mouseY = parseInt(pageY - clientY );
    //   // console.log("rect: ", rect);
    //   // console.log("mouseX: ", mouseX);
    //   // console.log("mouseY: ", mouseY);
    //   // if (rect.w === undefined) {
    //   //   console.log('no rect');
    //   //   rect.startX = offsetX;
    //   //   rect.startY = offsetY;
    //   //   dragBR = true;
    //   // } else if (
    //   //   checkCloseEnough(mouseX, rect.startX) &&
    //   //   checkCloseEnough(mouseY, rect.startY)
    //   // ) {
    //   //   dragTL = true;
    //   // }
    //   // // 2. top right
    //   // else if (
    //   //   checkCloseEnough(mouseX, rect.startX + rect.w) &&
    //   //   checkCloseEnough(mouseY, rect.startY)
    //   // ) {
    //   //   dragTR = true;
    //   // }
    //   // // 3. bottom left
    //   // else if (
    //   //   checkCloseEnough(mouseX, rect.startX) &&
    //   //   checkCloseEnough(mouseY, rect.startY + rect.h)
    //   // ) {
    //   //   dragBL = true;
    //   // }
    //   // // 4. bottom right
    //   // else if (
    //   //   checkCloseEnough(mouseX, rect.startX + rect.w) &&
    //   //   checkCloseEnough(mouseY, rect.startY + rect.h)
    //   // ) {
    //   //   dragBR = true;
    //   // }
    //   // // (5.) none of them
    //   // else {
    //   //   // handle not resizing
    //   //   console.log("im here....")
    //   // }

    //   // //contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    //   // squareDraw();
    // } else {
    //   contextRef.current.beginPath();

    //   contextRef.current.moveTo(offsetX, offsetY);
    //   contextRef.current.lineTo(offsetX, offsetY);
    //   contextRef.current.stroke();

    // }

    //setIsDrawing(true);
  };

  // function checkCloseEnough(p1, p2) {
  //   console.log(p1);
  //   console.log(p2);
  //   console.log("checkcloseenough returned: ", Math.abs(p1 - p2) < closeEnough);
  //   return Math.abs(p1 - p2) < closeEnough;
  // }

  //onMouseMove
  const draw = (e) => {
    //console.log("onMouseMove: ", isDown);

    if (!isDown) return;

    redrawStoredLines();

    let mouseX = parseInt(e.clientX - canvasOffsetX);
    let mouseY = parseInt(e.clientY - canvasOffsetY);

    if (actionType == "square") {
      contextRef.current.beginPath();
      contextRef.current.rect(startX, startY, mouseX - startX, mouseY - startY);
      contextRef.current.stroke();
    }
    if (actionType == "line") {
      contextRef.current.beginPath();
      contextRef.current.moveTo(startX, startY);
      contextRef.current.lineTo(mouseX, mouseY);
      contextRef.current.stroke();
    }

    if (actionType == "pencil") {
      if (!isDrawing) {
        return;
      }

      contextRef.current.lineTo(e.offsetX, e.offsetY);
      contextRef.current.stroke();
    }

    e.preventDefault();
    e.stopPropagation();

    // console.log(canvasRef.current.clientTop);
    // if (!isDrawing) {
    //   return;
    // }

    // const { offsetX, offsetY, pageX, pageY, clientX, clientY } = nativeEvent;

    // // console.log(nativeEvent);
    // // return;

    // if (isSquareStatus) {
    //   mouseX = parseInt(offsetX - canvasOffsetX);
    //   mouseY = parseInt(offsetY - canvasOffsetY);

    //   contextRef.current.beginPath();
    //   contextRef.current.rect(startX, startY, mouseX - startX, mouseY - startY);
    //   contextRef.current.stroke();

    //   // mouseX = pageX - clientX;
    //   // mouseY = pageY - clientY;

    //   // // console.log("Move mouseX: ", mouseX);
    //   // // console.log("Move mouseY: ", mouseY);

    //   // if (dragTL) {
    //   //   rect.w += rect.startX - mouseX;
    //   //   rect.h += rect.startY - mouseY;
    //   //   rect.startX = mouseX;
    //   //   rect.startY = mouseY;
    //   // } else if (dragTR) {
    //   //   rect.w = Math.abs(rect.startX - mouseX);
    //   //   rect.h += rect.startY - mouseY;
    //   //   rect.startY = mouseY;
    //   // } else if (dragBL) {
    //   //   rect.w += rect.startX - mouseX;
    //   //   rect.h = Math.abs(rect.startY - mouseY);
    //   //   rect.startX = mouseX;
    //   // } else if (dragBR) {
    //   //   rect.w = Math.abs(rect.startX - mouseX);
    //   //   rect.h = Math.abs(rect.startY - mouseY);
    //   // }
    //   // contextRef.current.clearRect(
    //   //   0,
    //   //   0,
    //   //   canvasRef.current.width,
    //   //   canvasRef.current.height
    //   // );
    //   // squareDraw();
    // } else {
    //   contextRef.current.lineTo(offsetX, offsetY);
    //   contextRef.current.stroke();
    // }

    // nativeEvent.preventDefault();
  };

  // function squareDraw() {
  //   contextRef.current.fillStyle = "#222222";
  //   contextRef.current.fillRect(rect.startX, rect.startY, rect.w, rect.h);
  //   drawHandles();
  // }

  // function drawCircle(x, y, radius) {
  //   contextRef.current.fillStyle = "#FF0000";
  //   contextRef.current.beginPath();
  //   contextRef.current.arc(x, y, radius, 0, 2 * Math.PI);
  //   contextRef.current.fill();
  // }

  // function drawHandles() {
  //   drawCircle(rect.startX, rect.startY, closeEnough);
  //   drawCircle(rect.startX + rect.w, rect.startY, closeEnough);
  //   drawCircle(rect.startX + rect.w, rect.startY + rect.h, closeEnough);
  //   drawCircle(rect.startX, rect.startY + rect.h, closeEnough);
  // }

  //onMouseUp & onMouseLeave
  const stopDrawing = (e) => {
    // dragTL = false;
    // dragTR = false;
    // dragBL = false;
    // dragBR = false;

    // if (!isSquareStatus) {
    //   contextRef.current.closePath();
    // }

    // setIsDrawing(false);

    if (actionType == "pencil") {
      contextRef.current.closePath();
      setIsDrawing(false);
    }

    e.preventDefault();
    e.stopPropagation();

    isDown = false;

    let mouseX = parseInt(e.clientX - canvasOffsetX);
    let mouseY = parseInt(e.clientY - canvasOffsetY);

    storedLines.push({
      actionType: actionType,
      x1: startX,
      y1: startY,
      x2: mouseX,
      y2: mouseY,
    });

    redrawStoredLines();
  };

  const usePencilBtn = () => {
    //set type
    setActionType("pencil");

    //use state to change classname
    setPencilStatus(true);
    setEraserStatus(false);
    setSquareStatus(false);
    setLineStatus(false);

    //use state to change cursor for canvas
    setCursorStyle("canvas-container-pencil");

    contextRef.current.globalCompositeOperation = "source-over";
  };

  const useEraserBtn = () => {
    setActionType("eraser");

    //use state to change classname
    setPencilStatus(false);
    setEraserStatus(true);
    setSquareStatus(false);
    setLineStatus(false);

    //use state to change cursor for canvas
    setCursorStyle("canvas-container-eraser");
    //contextRef.current.globalCompositeOperation = "destination-out";
  };

  const useLineBtn = () => {
    setActionType("line");

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(false);
    setLineStatus(true);

    setCursorStyle("canvas-container-square");
  };

  const useSquareBtn = () => {
    setActionType("square");

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(true);
    setLineStatus(false);

    setCursorStyle("canvas-container-square");
  };

  const clearCanvasBtn = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    storedLines.length = 0;
    redrawStoredLines();
  };

  const saveImageToLocal = (event) => {
    let link = event.currentTarget;
    link.setAttribute("download", "canvas.png");
    let image = canvasRef.current.toDataURL("image/png");
    link.setAttribute("href", image);
  };

  const saveImage = (event) => {
    const canvas = canvasRef.current.toDataURL();
    props.saveBtnHandler(canvas);
    //console.log(canvas);

    // const resultCanvas = canvasResultRef.current;
    // const img = new Image;
    // const ctx = resultCanvas.getContext('2d');
    // img.onload = function(){
    //     ctx.drawImage(img, 0, 0);
    // }
    // img.src = canvas;
    // let link = event.currentTarget;
    // link.setAttribute("download", "canvas.png");
    // let image = canvasRef.current.toDataURL("image/png");
    // link.setAttribute("href", image);
  };

  function handleMouseOut({ nativeEvent }) {
    
    if(actionType != 'pencil'){

      const { clientX, clientY } = nativeEvent;

      nativeEvent.preventDefault();
      nativeEvent.stopPropagation();

    //console.log("handleMouseOut: ", isDown);

    if (!isDown) return;

    isDown = false;

    let mouseX = parseInt(clientX - canvasOffsetX);
    let mouseY = parseInt(clientY  - canvasOffsetY);

    storedLines.push({
      actionType: actionType,
      x1: startX,
      y1: startY,
      x2: mouseX,
      y2: mouseY,
    });

    redrawStoredLines();


    }
  }

  function redrawStoredLines() {
    console.log(storedLines);

    const canvas = canvasRef.current;

    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);

    if (storedLines.length == 0) return;

    // redraw each stored line
    for (let i = 0; i < storedLines.length; i++) {
      if (
        storedLines[i].actionType == "line" 
      ) {
        contextRef.current.beginPath();
        contextRef.current.moveTo(storedLines[i].x1, storedLines[i].y1);
        contextRef.current.lineTo(storedLines[i].x2, storedLines[i].y2);
        contextRef.current.stroke();
      }
      if (storedLines[i].actionType == "square") {
        contextRef.current.beginPath();
        contextRef.current.rect(
          storedLines[i].x1,
          storedLines[i].y1,
          storedLines[i].x2 - storedLines[i].x1,
          storedLines[i].y2 - storedLines[i].y1
        );
        contextRef.current.stroke();
      }

      // if(storedLines[i].actionType == "pencil" ){
      //   contextRef.current.beginPath();
      // contextRef.current.moveTo(storedLines[i].x1, storedLines[i].y1);
      // contextRef.current.lineTo(storedLines[i].x2, storedLines[i].y2);
      //   contextRef.current.stroke();
      //   contextRef.current.closePath();
      // }
    }
  }

  return (
    <div>
      <div className="row mb-2">
        <div className="col">
          {isPencilStatus ? (
            <button
              onClick={usePencilBtn}
              className="btn btn-secondary btn-sm me-2"
              title="Draw Pencil"
            >
              <Edit2 size={24} />
            </button>
          ) : (
            <button
              onClick={usePencilBtn}
              className="btn btn-outline-secondary btn-sm me-2"
              title="Draw Pencil"
            >
              <Edit2 size={24} />
            </button>
          )}

          {isEraserStatus ? (
            <button
              onClick={useEraserBtn}
              className="btn btn-secondary btn-sm me-2"
              title="Erase"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4L20 11L11 20" />
                <path d="M6 11L13 18" />
              </svg>
            </button>
          ) : (
            <button
              onClick={useEraserBtn}
              className="btn btn-outline-secondary btn-sm me-2"
              title="Erase"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4L20 11L11 20" />
                <path d="M6 11L13 18" />
              </svg>
            </button>
          )}

          {isSquareStatus ? (
            <button
              title="Draw a square"
              className="btn btn-secondary btn-sm me-2"
              onClick={useSquareBtn}
            >
              <Square size={24} />
            </button>
          ) : (
            <button
              title="Draw a square"
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={useSquareBtn}
            >
              <Square size={24} />
            </button>
          )}

          {isLineStatus ? (
            <button
              title="Draw a Line"
              className="btn btn-secondary btn-sm me-2  ps-3 pe-3"
              onClick={useLineBtn}
            >
              <span className="fs-6">
                <strong>/</strong>
              </span>
            </button>
          ) : (
            <button
              title="Draw a Line"
              className="btn btn-outline-secondary btn-sm me-2 ps-3 pe-3"
              onClick={useLineBtn}
            >
              <span className="fs-6">
                <strong>/</strong>
              </span>
            </button>
          )}
        </div>
        <div className="col">
          <button
            onClick={clearCanvasBtn}
            className="btn btn-outline-secondary btn-sm me-2 "
          >
            Clear All
          </button>

          <button
            onClick={saveImage}
            className="btn btn-outline-secondary btn-sm me-2 "
          >
            Save
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <canvas
            className={cursorStyle}
            ref={canvasRef}
            //onMouseDown={(e) => startDrawing(e)}
            onMouseDown={startDrawingPencil}
            // onMouseMove={(e) => draw(e)}
            // onMouseUp={(e) => stopDrawing(e)}
            //  onMouseLeave={stopDrawing}
            // onMouseLeave = {(e) => handleMouseOut(e)}
            onMouseMove={drawPencil}
            onMouseUp={stopDrawingPencil}
            onMouseLeave={handleMouseOut}
            //onMouseOut={handleMouseOut}
          ></canvas>
        </div>
      </div>
      {/* 

follow this link: http://jsfiddle.net/5dkx72gh/6/
example 



      <div>
        

        

        <a
          id="download_image_link"
          href="download_link"
          onClick={saveImageToLocal}
        >
          Download Image
        </a> 
      </div>*/}
    </div>
  );
};

export default DrawingCanvasFullCode;
