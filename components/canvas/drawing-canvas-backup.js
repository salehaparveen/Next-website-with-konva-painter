import { useEffect, useRef, useState } from "react";
import { Edit2 } from "react-feather";

const DrawingCanvasBackup = (props) => {

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawStatus, setDrawStatus] = useState(true);
  const [isEraserStatus, setEraserStatus] = useState(false);
  const [cursorStyle, setCursorStyle] = useState("canvas-container-pencil");

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 700;
    canvas.height = 500;

    const context = canvas.getContext("2d");

    context.lineCap = "round";
    context.strokeStyle = "black";
    context.strokeWidth  = 4;
    context.lineWidth = 4;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();

    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    setIsDrawing(true);
    nativeEvent.preventDefault();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    nativeEvent.preventDefault();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const setToDraw = () => {
    setDrawStatus(true);
    setEraserStatus(false);
    setCursorStyle('canvas-container-pencil');
    contextRef.current.globalCompositeOperation = "source-over";
    contextRef.lineWidth  = 20
  };

  const setToErase = () => {
    setDrawStatus(false);
    setEraserStatus(true);
    setCursorStyle('canvas-container-eraser');
    contextRef.current.globalCompositeOperation = "destination-out";
  };

  const setToErase2 = () => {
    contextResultRef.current.globalCompositeOperation = "destination-out";
  };

  const setToEraseAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  return (
    <div>
      <div className="row mb-2">
        <div className="col">
          {isDrawStatus ? (
            <button
              onClick={setToDraw}
              className="btn btn-secondary btn-sm me-2"
            >
              <Edit2 size={24} />
            </button>
          ) : (
            <button
              onClick={setToDraw}
              className="btn btn-outline-secondary btn-sm me-2"
            >
              <Edit2 size={24} />
            </button>
          )}

          {isEraserStatus ? (
            <button
              onClick={setToErase}
              className="btn btn-secondary btn-sm me-2"
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
              onClick={setToErase}
              className="btn btn-outline-secondary btn-sm me-2"
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
        </div>
        <div className="col">
          <button
            onClick={setToEraseAll}
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
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          ></canvas>
        </div>
      </div>
      {/* 
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

export default DrawingCanvasBackup;
