import { useEffect, useRef, useState } from "react";
import { Edit2, Square, Circle, Type, Move, Image as ImageIcon } from "react-feather";

// Create an array to store the shapes
var shapes = [];

// Set the flag to indicate whether a shape is being resized
var isResizing = false;

// Set the selected shape and resizing handle
var selectedShape = [];
var resizingHandle = null;

 // Define the resizing handles
 var resizingHandles = {
  nw: { x: -1, y: -1 },
  ne: { x: 1, y: -1 },
  se: { x: 1, y: 1 },
  sw: { x: -1, y: 1 },
};

const DrawingCanvas = (props) => {
  const { drawingData } = props;

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const canvasOverlayRef = useRef(null);
  const contextOverlayRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const [isPencilStatus, setPencilStatus] = useState(true);
  const [isEraserStatus, setEraserStatus] = useState(false);
  const [isSquareStatus, setSquareStatus] = useState(false);
  const [isCircleStatus, setCircleStatus] = useState(false);
  const [isTextStatus, setTextStatus] = useState(false);
  const [isOvalStatus, setOvalStatus] = useState(false);
  const [isLineStatus, setLineStatus] = useState(false);
  const [isSvgStatus, setSvgStatus] = useState(false);
  const [isSelectStatus, setSelectStatus] = useState(false);
  const [lineColor, setLineColor] = useState("black");

  const [canvasOffsetX, setOffsetX] = useState();
  const [canvasOffsetY, setOffsetY] = useState();

  const [prevStartX, setPrevStartX] = useState(0);
  const [prevStartY, setPrevStartY] = useState(0);

  const [prevWidth, setPrevWidth] = useState(0);
  const [prevHeight, setPrevHeight] = useState(0);

  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const [canvasWidth, setCanvasWidth] = useState();
  const [canvasHeight, setCanvasHeight] = useState();

  const [cursorStyle, setCursorStyle] = useState("canvas-container-pencil");
  const [actionType, setActionType] = useState("pencil");

  const [hasInput, setHasInput] = useState(false);

  var textInput = {};

  var svgfile = {};
  const textFont = "Arial";
  const textFontSize = 20;

  useEffect(() => {
    const canvasOverlay = canvasOverlayRef.current;
    canvasOverlay.width = 800;
    canvasOverlay.height = 600;

    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;

    setOffsetX(canvas.getBoundingClientRect().left);
    setOffsetY(canvas.getBoundingClientRect().top);

    setCanvasWidth(canvas.width);
    setCanvasHeight(canvas.height);

    const context = canvas.getContext("2d");
    const contextOverlay = canvasOverlay.getContext("2d"); //canvas overlay

    context.lineCap = "round";
    context.strokeStyle = lineColor;
    context.strokeWidth = 2;
    context.lineWidth = 2;
    contextRef.current = context;

    //canvas overlay settings:
    contextOverlay.lineCap = "round";
    contextOverlay.strokeStyle = lineColor;
    contextOverlay.strokeWidth = 2;
    contextOverlay.lineWidth = 2;
    contextOverlayRef.current = contextOverlay;


    // Prevent scrolling when touching the canvas
    canvasRef.current.addEventListener(
      "touchstart",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();

          // mousePos = getTouchPos(canvasRef.current, e);
          // var touch = e.touches[0];
          // var mouseEvent = new MouseEvent("mousedown", {
          //   clientX: touch.clientX,
          //   clientY: touch.clientY
          // });
          // canvasRef.current.dispatchEvent(mouseEvent);
        }
        
      },
      false
    );
    canvasRef.current.addEventListener(
      "touchend",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      false
    );
    canvasRef.current.addEventListener(
      "touchmove",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      false
    );

    //console.log(drawingData);
    if (drawingData) {
      let image = new Image();
      image.onload = function () {
        contextOverlayRef.current.drawImage(image, 0, 0);
      };
      image.src = drawingData;
    }
  }, []);

  // Get the position of a touch relative to the canvas
	function getTouchPos(canvasDom, touchEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: touchEvent.touches[0].clientX - rect.left,
			y: touchEvent.touches[0].clientY - rect.top
		};
	}


  const touchStartToDraw = ({ nativeEvent }) => {

    const { target, touches, targetTouches } = nativeEvent;

    const clientX = touches[0].clientX;
    const clientY = touches[0].clientY;

    const rect = target.getBoundingClientRect();
    var offsetX = targetTouches[0].clientX - rect.x;
    var offsetY = targetTouches[0].clientY - rect.y;

    if (actionType == "eraser") {
      contextOverlayRef.current.beginPath();
      contextOverlayRef.current.moveTo(offsetX, offsetY);
      contextOverlayRef.current.lineTo(offsetX, offsetY);
      contextOverlayRef.current.stroke();

      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    } else if (actionType == "pencil") {
      contextOverlayRef.current.strokeStyle = lineColor;
      contextOverlayRef.current.beginPath();
      contextOverlayRef.current.moveTo(offsetX, offsetY);
      contextOverlayRef.current.lineTo(offsetX, offsetY);
      contextOverlayRef.current.stroke();

      setStartX(offsetX);
      setStartY(offsetY);
    } else {
      let mouseX = parseInt(clientX - canvasOffsetX);
      let mouseY = parseInt(clientY - canvasOffsetY);

      setStartX(mouseX);
      setStartY(mouseY);
    }
    setIsDrawing(true);
    nativeEvent.preventDefault();
  };

  const touchMove = ({ nativeEvent }) => {
    const { target, touches, targetTouches } = nativeEvent;

    const clientX = touches[0].clientX;
    const clientY = touches[0].clientY;

    const rect = target.getBoundingClientRect();
    var offsetX = targetTouches[0].clientX - rect.x;
    var offsetY = targetTouches[0].clientY - rect.y;

    if (!isDrawing) {
      return;
    }

    if (actionType == "eraser") {
      contextOverlayRef.current.lineTo(offsetX, offsetY);
      contextOverlayRef.current.stroke();
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    } else if (actionType == "pencil") {
      contextOverlayRef.current.strokeStyle = lineColor;
      contextOverlayRef.current.lineTo(offsetX, offsetY);
      contextOverlayRef.current.stroke();
    } else {
      let mouseX = parseInt(clientX - canvasOffsetX);
      let mouseY = parseInt(clientY - canvasOffsetY);
      
      let width = mouseX - startX;
      let height = mouseY - startY;

      // clear the canvas
      contextRef.current.strokeStyle = lineColor;
      contextRef.current.clearRect(0, 0, canvasWidth, canvasHeight);

      if (actionType == "square") {
        contextRef.current.strokeRect(startX, startY, width, height);

        setPrevStartX(startX);
        setPrevStartY(startY);
        setPrevWidth(width);
        setPrevHeight(height);
      }
      if (actionType == "line") {
        contextRef.current.beginPath();
        contextRef.current.moveTo(startX, startY);
        contextRef.current.lineTo(mouseX, mouseY);
        contextRef.current.fillStyle = "white";
        contextRef.current.fill();
        contextRef.current.stroke();
      }
    }

    // nativeEvent.preventDefault();
  };


  const stopDrawingPencil = ({ nativeEvent }) => {
    if (actionType == "eraser") {
      contextOverlayRef.current.closePath();
    } else if (actionType == "pencil") {
      contextOverlayRef.current.closePath();
    } else {
      const { clientX, clientY } = nativeEvent;

      let mouseX = parseInt(clientX - canvasOffsetX);
      let mouseY = parseInt(clientY - canvasOffsetY);

      if (actionType == "line") {
        contextOverlayRef.current.strokeStyle = lineColor;
        contextOverlayRef.current.beginPath();
        contextOverlayRef.current.moveTo(startX, startY);
        contextOverlayRef.current.lineTo(mouseX, mouseY);
        contextOverlayRef.current.fillStyle = "white";
        contextOverlayRef.current.fill();
        contextOverlayRef.current.stroke();
      }
      if (actionType == "square") {
        contextOverlayRef.current.strokeStyle = lineColor;
        contextOverlayRef.current.strokeRect(
          prevStartX,
          prevStartY,
          prevWidth,
          prevHeight
        );
        
        let rect = {type: 'square', x: prevStartX, y: prevStartY, width: prevWidth, height: prevHeight};
        shapes.push(rect)
      }
      if(actionType == "oval") {
        contextOverlayRef.current.strokeStyle = lineColor;
        drawOval(contextOverlayRef.current, mouseX, mouseY);
      }
    }

    setIsDrawing(false);
  };

  const startDrawingPencil = ({ nativeEvent }) => {
    const { offsetX, offsetY, clientX, clientY } = nativeEvent;

    if (actionType == "eraser") {
      contextOverlayRef.current.beginPath();
      contextOverlayRef.current.moveTo(offsetX, offsetY);
      contextOverlayRef.current.lineTo(offsetX, offsetY);
      contextOverlayRef.current.stroke();

      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    } else if (actionType == "pencil") {
      contextOverlayRef.current.strokeStyle = lineColor;
      contextOverlayRef.current.beginPath();
      contextOverlayRef.current.moveTo(offsetX, offsetY);
      contextOverlayRef.current.lineTo(offsetX, offsetY);
      contextOverlayRef.current.stroke();

      setStartX(offsetX);
      setStartY(offsetY);
    } else if (actionType == "select") {

      // Check if the mouse click is inside a shape and select it
      for(var i = shapes.length - 1; i >= 0; i--) {
        var shape = shapes[i];
  
        if (shape.type === 'square' &&
          offsetX >= shape.x &&
          offsetX <= shape.x + shape.width &&
          offsetY >= shape.y &&
          offsetY <= shape.y + shape.height
        ) {
          selectedShape = shape;
          break;
        }


      }

      // Check if the mouse click is on a resizing handle and set the resizing handle
      if (selectedShape !== null) {
        var diffX = offsetX - selectedShape.x;
        var diffY = offsetY - selectedShape.y;
        var width =
          selectedShape.width !== undefined
            ? selectedShape.width
            : selectedShape.radius * 2;
        var height =
          selectedShape.height !== undefined
            ? selectedShape.height
            : selectedShape.radius * 2;
            
        for (var handle in resizingHandles) {
          console.log(handle, "---------resizing handle---------")
          var handleX = selectedShape.x + (resizingHandles[handle].x * width) / 2;
          var handleY = selectedShape.y + (resizingHandles[handle].y * height) / 2;
          if (
            diffX >= handleX - 5 &&
            diffX <= handleX + 5 &&
            diffY >= handleY - 5 &&
            diffY <= handleY + 5
          ) {
            isResizing = true;
            resizingHandle = handle;
            break;
          }
        }
      }

    } else {
      let mouseX = parseInt(clientX - canvasOffsetX);
      let mouseY = parseInt(clientY - canvasOffsetY);

      if(actionType == "text") {
        // if (hasInput) return;
        addInput(clientX, clientY);

        tempX = mouseX
        tempY = mouseY
      }
      setStartX(mouseX);
      setStartY(mouseY);
    }
    setIsDrawing(true);
    nativeEvent.preventDefault();
  };

  const addInput = (x, y) => {
    textInput = document.createElement('input');
    
    textInput.type = 'text';
    textInput.style.position = 'fixed';
    textInput.style.color = lineColor;
    textInput.style.left = (x - 4) + 'px';
    textInput.style.top = (y - 4) + 'px';

    textInput.onkeydown = handleEnter;

    document.body.appendChild(textInput);

    textInput.focus();
    setHasInput(true);
  }

  let tempX = 0;
  let tempY = 0;

  const handleEnter = e => {
    let keyCode = e.keyCode;
    if (keyCode === 13) {
      drawText(contextOverlayRef.current, textInput.value, tempX, tempY);
      document.body.removeChild(textInput);
      setHasInput(false);
    }
  }

  const drawText = (ctx, txt, x, y) => {
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.font = '14px sans-serif';
    ctx.fillStyle = lineColor;
    ctx.fillText(txt, x + 4, y + 4);
  }

  // const drawCircle = (ctx, circle) => {
  //   const { x1, y1, x2, y2 } = circle
  //   ctx.beginPath();
  //   //Dynamic scaling
  //   var scalex = 1*((x1-x2)/2);
  //   var scaley = 1*((y1-y2)/2);
  //   ctx.scale(scalex,scaley);
  //   //Create ellipse
  //   var centerx = (x2/scalex)+1;
  //   var centery = (y2/scaley)+1;
  //   ctx.arc(centerx, centery, 1, 0, 2*Math.PI);
  //   //Restore and draw
  //   ctx.restore();
  //   ctx.strokeStyle = 'black';
  //   ctx.lineWidth = 5;
  //   ctx.stroke();
  //   ctx.save();
  // }

  const drawOval = (ctx, x, y) => {
    contextRef.current.clearRect(0,0,canvasWidth,canvasHeight);
    ctx.beginPath();
    ctx.moveTo(startX, startY + (y-startY)/2);
    ctx.bezierCurveTo(startX, startY, x, startY, x, startY + (y-startY)/2);
    ctx.bezierCurveTo(x, y, startX, y, startX, startY + (y-startY)/2);
    ctx.closePath();
    ctx.stroke();
  }

  const drawPencil = ({ nativeEvent }) => {
    const { offsetX, offsetY, clientX, clientY } = nativeEvent;
    isResizing = true;
    if(isResizing && actionType == "select") {
      console.log(resizingHandle, "----------resize-----------")
      // Resize the selected shape based on the resizing handle
      var diffX = offsetX - selectedShape.x;
      var diffY = offsetY - selectedShape.y;
      var width =
        selectedShape.width !== undefined
          ? selectedShape.width
          : selectedShape.radius * 2;
      var height =
        selectedShape.height !== undefined
          ? selectedShape.height
          : selectedShape.radius * 2;
      if (resizingHandle === 'nw') {
        console.log("--------------nw------------")
        selectedShape.x = diffX;
        selectedShape.y = diffY;
        if (selectedShape.width !== undefined) {
          selectedShape.width += diffX;
          selectedShape.height += diffY;
        } else {
          selectedShape.radius = Math.max(Math.abs(diffX), Math.abs(diffY));
        }
      } else if (resizingHandle === 'ne') {
        console.log("--------------ne------------")
        selectedShape.y = diffY;
        if (selectedShape.width !== undefined) {
          selectedShape.width = Math.max(diffX, 0);
          selectedShape.height += diffY;
        } else {
          selectedShape.radius = Math.max(Math.abs(diffX), Math.abs(diffY));
        }
      } else if (resizingHandle === 'se') {
        console.log("--------------se------------")
        if (selectedShape.width !== undefined) {
          selectedShape.width = Math.max(diffX, 0);
          selectedShape.height = Math.max(diffY, 0);
        } else {
          selectedShape.radius = Math.max(Math.abs(diffX), Math.abs(diffY));
        }
      } else if (resizingHandle === 'sw') {
        console.log("--------------sw------------")
        selectedShape.x = diffX;
        if (selectedShape.width !== undefined) {
          selectedShape.width += diffX;
          selectedShape.height = Math.max(diffY, 0);
        } else {
          selectedShape.radius = Math.max(Math.abs(diffX), Math.abs(diffY));
        }
      }
    } else {
      
      if (!isDrawing) {
        return;
      }
      
      if (actionType == "eraser") {
        contextOverlayRef.current.lineTo(offsetX, offsetY);
        contextOverlayRef.current.stroke();
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
      } else if (actionType == "pencil") {
        contextOverlayRef.current.strokeStyle = lineColor;
        contextOverlayRef.current.lineTo(offsetX, offsetY);
        contextOverlayRef.current.stroke();
      } else {
        let mouseX = parseInt(clientX - canvasOffsetX);
        let mouseY = parseInt(clientY - canvasOffsetY);
        
        let width = mouseX - startX;
        let height = mouseY - startY;
  
        // clear the canvas
        contextRef.current.strokeStyle = lineColor;
        contextRef.current.clearRect(0, 0, canvasWidth, canvasHeight);
  
        if (actionType == "square") {
          contextRef.current.strokeRect(startX, startY, width, height);
  
          setPrevStartX(startX);
          setPrevStartY(startY);
          setPrevWidth(width);
          setPrevHeight(height);
        }
        if (actionType == "oval") {
          drawOval(contextRef.current, mouseX, mouseY);
  
          setPrevStartX(startX);
          setPrevStartY(startY);
          setPrevWidth(width);
          setPrevHeight(height);
         
        }
        if (actionType == "line") {
          contextRef.current.beginPath();
          contextRef.current.moveTo(startX, startY);
          contextRef.current.lineTo(mouseX, mouseY);
          contextRef.current.fillStyle = "white";
          contextRef.current.fill();
          contextRef.current.stroke();
        }
      }
      nativeEvent.preventDefault();
    }

  };

  const stopTouchEnd = ({ nativeEvent }) => {
    if (actionType == "eraser") {
      contextOverlayRef.current.closePath();
    } else if (actionType == "pencil") {
      contextOverlayRef.current.closePath();
    } else {
      //const { clientX, clientY } = nativeEvent;
      console.log(nativeEvent);
      const { changedTouches } = nativeEvent;

    const clientX = changedTouches[0].clientX;
    const clientY = changedTouches[0].clientY;

    // const rect = target.getBoundingClientRect();
    // var offsetX = targetTouches[0].clientX - rect.x;
    // var offsetY = targetTouches[0].clientY - rect.y;

      let mouseX = parseInt(clientX - canvasOffsetX);
      let mouseY = parseInt(clientY - canvasOffsetY);

      if (actionType == "line") {
        contextOverlayRef.current.strokeStyle = lineColor;
        contextOverlayRef.current.beginPath();
        contextOverlayRef.current.moveTo(startX, startY);
        contextOverlayRef.current.lineTo(mouseX, mouseY);
        contextOverlayRef.current.fillStyle = "white";
        contextOverlayRef.current.fill();
        contextOverlayRef.current.stroke();
      }
      if (actionType == "square") {
        contextOverlayRef.current.strokeStyle = lineColor;
        contextOverlayRef.current.strokeRect(
          prevStartX,
          prevStartY,
          prevWidth,
          prevHeight
        );
      }
    }

    setIsDrawing(false);
  };

  function handleMouseOut({ nativeEvent }) {
    if (actionType != "pencil") {
      nativeEvent.preventDefault();
      nativeEvent.stopPropagation();

      setIsDrawing(false);
    }
  }

  const usePencilBtn = () => {
    //set type
    setActionType("pencil");

    //use state to change classname
    setPencilStatus(true);
    setEraserStatus(false);
    setSquareStatus(false);
    setLineStatus(false);
    setCircleStatus(false);
    setOvalStatus(false);
    setTextStatus(false);
    setSvgStatus(false);
    setSelectStatus(false);

    //use state to change cursor for canvas
    setCursorStyle("canvas-container-pencil");

    contextRef.current.globalCompositeOperation = "source-over";
    contextOverlayRef.current.globalCompositeOperation = "source-over";
    contextOverlayRef.current.strokeWidth = 2;
    contextOverlayRef.current.lineWidth = 2;
    contextRef.current.strokeWidth = 2;
    contextRef.current.lineWidth = 2;
  };

  const useEraserBtn = () => {
    setActionType("eraser");

    //use state to change classname
    setPencilStatus(false);
    setEraserStatus(true);
    setSquareStatus(false);
    setLineStatus(false);
    setCircleStatus(false);
    setOvalStatus(false);
    setTextStatus(false);
    setSvgStatus(false);
    setSelectStatus(false);

    //use state to change cursor for canvas
    setCursorStyle("canvas-container-eraser");
    contextRef.current.globalCompositeOperation = "destination-out";
    contextOverlayRef.current.globalCompositeOperation = "destination-out";
    contextOverlayRef.current.strokeWidth = 10;
    contextOverlayRef.current.lineWidth = 10;
    contextRef.current.strokeWidth = 10;
    contextRef.current.lineWidth = 10;
  };

  const useLineBtn = () => {
    setActionType("line");

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(false);
    setLineStatus(true);
    setCircleStatus(false);
    setOvalStatus(false);
    setTextStatus(false);
    setSvgStatus(false);
    setSelectStatus(false);

    setCursorStyle("canvas-container-square");
    contextRef.current.globalCompositeOperation = "source-over";
    contextOverlayRef.current.globalCompositeOperation = "source-over";
    contextOverlayRef.current.strokeWidth = 2;
    contextOverlayRef.current.lineWidth = 2;
    contextRef.current.strokeWidth = 2;
    contextRef.current.lineWidth = 2;
  };

  const useSquareBtn = () => {
    setActionType("square");

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(true);
    setLineStatus(false);
    setCircleStatus(false);
    setOvalStatus(false);
    setTextStatus(false);
    setSvgStatus(false);
    setSelectStatus(false);

    setCursorStyle("canvas-container-square");
    contextRef.current.globalCompositeOperation = "source-over";
    contextOverlayRef.current.globalCompositeOperation = "source-over";
    contextOverlayRef.current.strokeWidth = 2;
    contextOverlayRef.current.lineWidth = 2;
    contextRef.current.strokeWidth = 2;
    contextRef.current.lineWidth = 2;
  };

  const useCircleBtn = () => {
    setActionType("circle");

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(false);
    setLineStatus(false);
    setCircleStatus(true);
    setOvalStatus(false);
    setTextStatus(false);
    setSvgStatus(false);
    setSelectStatus(false);

    setCursorStyle("canvas-container-circle");
    contextRef.current.globalCompositeOperation = "source-over";
    contextOverlayRef.current.globalCompositeOperation = "source-over";
    contextOverlayRef.current.strokeWidth = 2;
    contextOverlayRef.current.lineWidth = 2;
    contextRef.current.strokeWidth = 2;
    contextRef.current.lineWidth = 2;
  };
  
  const useOvalBtn = () => {
    setActionType("oval");

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(false);
    setLineStatus(false);
    setCircleStatus(false);
    setOvalStatus(true);
    setTextStatus(false);
    setSvgStatus(false);
    setSelectStatus(false);

    setCursorStyle("canvas-container-oval");
    contextRef.current.globalCompositeOperation = "source-over";
    contextOverlayRef.current.globalCompositeOperation = "source-over";
    contextOverlayRef.current.strokeWidth = 2;
    contextOverlayRef.current.lineWidth = 2;
    contextRef.current.strokeWidth = 2;
    contextRef.current.lineWidth = 2;
  };

  const useTextBtn = () => {
    setActionType("text");

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(false);
    setLineStatus(false);
    setCircleStatus(false);
    setOvalStatus(false);
    setTextStatus(true);
    setSvgStatus(false);
    setSelectStatus(false);

    setCursorStyle("canvas-container-oval");
    contextRef.current.globalCompositeOperation = "source-over";
    contextOverlayRef.current.globalCompositeOperation = "source-over";
    contextOverlayRef.current.strokeWidth = 2;
    contextOverlayRef.current.lineWidth = 2;
    contextRef.current.strokeWidth = 2;
    contextRef.current.lineWidth = 2;
  };

  const useSvgBtn = (e) => {
    setActionType("SVG");

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(false);
    setLineStatus(false);
    setCircleStatus(false);
    setOvalStatus(false);
    setTextStatus(false);
    setSvgStatus(true);
    setSelectStatus(false);

    setCursorStyle("canvas-container-svg");

    contextRef.current.globalCompositeOperation = "source-over";
    contextOverlayRef.current.globalCompositeOperation = "source-over";
    [...e.target.files].forEach((file) => {

      var reader = new FileReader();
      reader.onload = function (evt) {
        const image = new Image();
        image.src = evt.target.result;
        console.log(image)
        image.onload = () => {
          contextOverlayRef.current.drawImage(image,0,0);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const useSelectBtn = () => {
    setActionType("select");

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(false);
    setLineStatus(false);
    setCircleStatus(false);
    setOvalStatus(false);
    setTextStatus(false);
    setSvgStatus(false);
    setSelectStatus(true);

    setCursorStyle("canvas-container-select");
    contextRef.current.globalCompositeOperation = "source-over";
    contextOverlayRef.current.globalCompositeOperation = "source-over";
    contextOverlayRef.current.strokeWidth = 2;
    contextOverlayRef.current.lineWidth = 2;
    contextRef.current.strokeWidth = 2;
    contextRef.current.lineWidth = 2;
  }

  const clearCanvasBtn = () => {
    contextOverlayRef.current.clearRect(0, 0, canvasWidth, canvasHeight);
    contextRef.current.clearRect(0, 0, canvasWidth, canvasHeight);
  };

  const saveImage = (event) => {
    const canvas = canvasOverlayRef.current.toDataURL();
    props.saveBtnHandler(canvas);
  };


  return (
    <div>
      <div className="row mb-2">
        <div className="col d-flex align-content-center">
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
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
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
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
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

          {isOvalStatus ? (
            <button
              title="Draw a oval"
              className="btn btn-secondary btn-sm me-2"
              onClick={useOvalBtn}
            >
              <Circle size={24} />
            </button>
          ) : (
            <button
              title="Draw a oval"
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={useOvalBtn}
            >
              <Circle size={24} />
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
          
          {isTextStatus ? (
            <button
              title="Add a Typed Text"
              className="btn btn-secondary btn-sm me-2"
              onClick={useTextBtn}
            >
              <Type size={24} />
            </button>
          ) : (
            <button
              title="Add a Typed Text"
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={useTextBtn}
            >
              <Type size={24} />
            </button>
          )}

          <label htmlFor="contained-button-file">
            <input
                accept=".svg"
                id="contained-button-file"
                type="file"
                style={{ display: "none" }}
                onChange={useSvgBtn}
            />
            <div
              title="Add SVG"
              className={isSvgStatus?"btn btn-secondary btn-sm me-2":"btn btn-outline-secondary btn-sm me-2"}
            >
              <ImageIcon size={24} />
            </div>
          </label>

          {isSelectStatus ? (
            <button
              title="Select a object"
              className="btn btn-secondary btn-sm me-2"
              onClick={useSelectBtn}
            >
              <Move size={24} />
            </button>
          ) : (
            <button
              title="Select a object"
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={useSelectBtn}
            >
              <Move size={24} />
            </button>
          )}

           <input type="color" role="button" className="align-self-center form-control-color" value={lineColor} onChange={(e)=>setLineColor(e.target.value)} /> 
         
          
        </div>
        <div className="col">
          <button
            onClick={clearCanvasBtn}
            className="btn btn-outline-secondary btn-sm me-2 "
          >
            Clear All
          </button>

          <button onClick={saveImage} className="btn btn-warning btn-sm me-2 ">
            Save
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="canvasWrapper">
            <canvas className="overlay" ref={canvasOverlayRef}></canvas>
            <canvas
              className={cursorStyle}
              ref={canvasRef}

              onMouseDown={startDrawingPencil}
              onMouseMove={drawPencil}
              onMouseUp={stopDrawingPencil}
              onMouseLeave={handleMouseOut}

              onTouchStart={touchStartToDraw}
              onTouchMove={touchMove}
              onTouchEnd={stopTouchEnd}
            ></canvas>
            
          </div>
          <div className=" end-container"></div>
        </div>
      </div>
      
    </div>
  );
};

export default DrawingCanvas;
