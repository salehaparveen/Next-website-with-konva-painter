import { useEffect, useRef, useState } from "react";
import { Edit2, Square, Circle, Type, Move, Image as ImageIcon, PenTool } from "react-feather";

var stage;
var allShapes = [];
var layer;
var tr;
var isPaint = false;
var lastLine;
var rect;
var circle;
var line;
var typedText;
var currentTypedText;
var textTr;
var areaPosition;
var textarea;
var svg;
var isDraggable = false;
var lineColor = "#FFFFFF"

const DrawingCanvas = (props) => {
  const { drawingData } = props;

  const [ drawingDataFromBack, setDrawingDataFromBack] = useState(drawingData);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const canvasOverlayRef = useRef(null);
  const contextOverlayRef = useRef(null);

  // const [overlayStage, setOverlayStage] = useState();
  const [overlayLastLine, setOverlayLastLine] = useState(null);

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

  useEffect(() => {
    var canvasWidth = 800;
    var canvasHeight = 600;

    setCanvasWidth(canvasWidth);
    setCanvasHeight(canvasHeight);
    
    stage = new Konva.Stage({
      container: 'canvasContainer',
      width: canvasWidth,
      height: canvasHeight,
    });
    
    layer = new Konva.Layer();
    stage.add(layer);

    if(allShapes.length > 0) {
      for (let i = 0; i < allShapes.length; i++) {
        const shape = allShapes[i];
        layer.add(shape);   
      }
    }

    var selectionRectangle;
    var x1, y1, x2, y2;
    var xx1, yy1, xx2, yy2;
    var xxx1, yyy1, xxx2, yyy2;
    var xxxx1, yyyy1, xxxx2, yyyy2;
    if(actionType == 'select') {
      tr = new Konva.Transformer();
      layer.add(tr);

      // by default select all shapes
      tr.nodes(allShapes);

      // add a new feature, lets add ability to draw selection rectangle
      selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
        visible: false,
      });
      layer.add(selectionRectangle);
    }

    if(actionType == "square") {
      rect = new Konva.Rect({
        stroke: lineColor,
        strokeWidth: 5
      });
      layer.add(rect);
    }

    if(actionType == "oval") {
      circle = new Konva.Circle({
        stroke: lineColor,
        strokeWidth: 5
      });
      layer.add(circle);
    }
   
    stage.on('mousedown touchstart', (e) => {

      if(actionType == 'select') {
        // do nothing if we mousedown on any shape. if not, draw new shapes 
        if (e.target !== stage) {
          return
        } 
        e.evt.preventDefault();
        x1 = stage.getPointerPosition().x;
        y1 = stage.getPointerPosition().y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;
        
        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
      } else {
        isPaint = true;
        let pos = stage.getPointerPosition();
        if(actionType == "pencil") {    
          lastLine = new Konva.Line({
            stroke: lineColor,
            strokeWidth: 5,
            globalCompositeOperation: 'source-over',
            // round cap for smoother lines
            lineCap: 'round',
            lineJoin: 'round',
            // add point twice, so we have some drawings even on a simple click
            points: [pos.x, pos.y, pos.x, pos.y],
          });
          layer.add(lastLine);
        } else if(actionType == "eraser") {
          lastLine = new Konva.Line({
            stroke: lineColor,
            strokeWidth: 20,
            globalCompositeOperation: 'destination-out',
            // round cap for smoother lines
            lineCap: 'round',
            lineJoin: 'round',
            name: "eraser",
            // add point twice, so we have some drawings even on a simple click
            points: [pos.x, pos.y, pos.x, pos.y],
          });
          layer.add(lastLine);
        } else if(actionType == 'square') {
          e.evt.preventDefault();
          xx1 = stage.getPointerPosition().x;
          yy1 = stage.getPointerPosition().y;
          xx2 = stage.getPointerPosition().x;
          yy2 = stage.getPointerPosition().y;
          rect.width(0);
          rect.height(0);
        } else if(actionType == 'oval') {
          e.evt.preventDefault();
          xxx1 = stage.getPointerPosition().x;
          yyy1 = stage.getPointerPosition().y;
          xxx2 = stage.getPointerPosition().x;
          yyy2 = stage.getPointerPosition().y;
          circle.radius(0);
        } else if(actionType == "line") {
          e.evt.preventDefault();
          xxxx1 = pos.x;
          yyyy1 = pos.y;
          line = new Konva.Line({
            stroke: lineColor,
            strokeWidth: 5,
            globalCompositeOperation: 'source-over',
            // round cap for smoother lines
            lineCap: 'round',
            lineJoin: 'round',
            // add point twice, so we have some drawings even on a simple click
            points: [xxxx1, yyyy1],
          });
          layer.add(line);
        } else if(actionType == "text") {

          
        }
      }
    });

    stage.on('mousemove touchmove', (e) => {

      if(!isPaint) {
        if(actionType == "select") {
          // do nothing if we didn't start selection
          if (!selectionRectangle.visible()) {
            return;
          }
          e.evt.preventDefault();
          x2 = stage.getPointerPosition().x;
          y2 = stage.getPointerPosition().y;

          selectionRectangle.setAttrs({
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
          });
        }
      } else {
        const { target, evt: { shiftKey, ctrlKey, metaKey, offsetX, offsetY, clientX, clientY } } =  e;
        const pos = stage.getPointerPosition();
        let mouseX = pos.x;
        let mouseY = pos.y;
        x2 = stage.getPointerPosition().x;
        y2 = stage.getPointerPosition().y;
        if(actionType == "eraser") {
          var newPoints = lastLine.points().concat([pos.x, pos.y]);
          lastLine.points(newPoints);
        } else if(actionType == "pencil") {
          var newPoints = lastLine.points().concat([pos.x, pos.y]);
          lastLine.points(newPoints);
        } else if(actionType == "square") {
          e.evt.preventDefault();
          xx2 = stage.getPointerPosition().x;
          yy2 = stage.getPointerPosition().y;
          rect.setAttrs({
            x: Math.min(xx1, xx2),
            y: Math.min(yy1, yy2),
            width: Math.abs(xx2 - xx1),
            height: Math.abs(yy2 - yy1),
          });
          layer.add(rect);
        } else if(actionType == "oval") {
          e.evt.preventDefault();
          xxx2 = stage.getPointerPosition().x;
          yyy2 = stage.getPointerPosition().y;
          circle.setAttrs({
            x: Math.min(xxx1, xxx2),
            y: Math.min(yyy1, yyy2),
            radius: Math.sqrt(Math.pow(Math.abs(xxx2 - xxx1), 2) + Math.pow(Math.abs(yyy2 - yyy1), 2))
          })
          layer.add(circle);
        } else if(actionType == "line") {
          xxxx2 = pos.x;
          yyyy2 = pos.y;
          line.points([xxxx1, yyyy1, xxxx2, yyyy2]);
          layer.add(line);
        }
        
      }
      
    });

    stage.on('mouseup touchend', (e) => {
      const { target, evt: { shiftKey, ctrlKey, metaKey, offsetX, offsetY, clientX, clientY } } =  e;
      let mouseX = stage.getPointerPosition().x;
      let mouseY = stage.getPointerPosition().y;
      

      if(isPaint) {
        isPaint = false;
        // prevent scrolling on touch devices
        e.evt.preventDefault();

        if(actionType == "pencil") {
          // setOverlayStage(stage);
          // setOverlayLastLine(lastLine);
          allShapes.push(lastLine);
        } else if(actionType == "eraser" ) {
          // setOverlayLastLine(lastLine);
          allShapes.push(lastLine);
        } else if(actionType == "square") {
          // setOverlayLastLine(rect);
          allShapes.push(rect);
        } else if(actionType == "oval") {
          // setOverlayLastLine(circle);
          allShapes.push(circle);
        } else if(actionType == "line") {
          // setOverlayLastLine(line);
          allShapes.push(line);
        } else if(actionType == "text") {
          allShapes.push(typedText);
        }
      } else {
        if(actionType == 'select') {

          // do nothing if we didn't start selection
          if (!selectionRectangle.visible()) {
            return;
          }
          e.evt.preventDefault();

          // update visibility in timeout, so we can check it in click event
          setTimeout(() => {
            selectionRectangle.visible(false);
          });
          
          var box = selectionRectangle.getClientRect();
          var selected = allShapes.filter((shape) =>
            Konva.Util.haveIntersection(box, shape.getClientRect())
          );
          tr.nodes(selected);
        }
      }
    });

    // clicks should select/deselect shapes
    stage.on('click tap', function (e) {
      const { target, evt: { shiftKey, ctrlKey, metaKey, offsetX, offsetY, clientX, clientY } } =  e;

      if(actionType == 'select' && isPaint == false) {

        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }
        
        // // if click on empty area - remove all selections
        if (target === stage) {
          tr.nodes([]);
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = shiftKey || ctrlKey || metaKey;
        const isSelected = tr.nodes().indexOf(target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr.nodes([target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(target), 1);
          tr.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr.nodes().concat([target]);
          tr.nodes(nodes);
        }
      } else {
        var pos = stage.getPointerPosition();

        if(actionType == "text") {
          
          function createTextarea(typedText, areaPosition) {
            // create textarea and style it
            textarea = document.createElement('textarea');
            // textarea.setAttribute("id", )
            document.body.appendChild(textarea);
    
            // apply many styles to match text on canvas as close as possible
            // remember that text rendering on canvas and on the textarea can be different
            // and sometimes it is hard to make it 100% the same. But we will try...
            textarea.value = typedText.text();
            textarea.setAttribute("id", areaPosition.x + areaPosition.y );
            textarea.style.position = 'absolute';
            textarea.style.top = areaPosition.y + 'px';
            textarea.style.left = areaPosition.x + 'px';
            textarea.style.width = typedText.width() - typedText.padding() * 2 + 'px';
            textarea.style.height = typedText.height() - typedText.padding() * 2 + 5 + 'px';
            textarea.style.fontSize = typedText.fontSize() + 'px';
            textarea.style.border = 'none';
            textarea.style.padding = '0px';
            textarea.style.margin = '0px';
            textarea.style.overflow = 'hidden';
            textarea.style.background = 'none';
            textarea.style.outline = 'none';
            textarea.style.resize = 'none';
            textarea.style.lineHeight = typedText.lineHeight();
            textarea.style.fontFamily = typedText.fontFamily();
            textarea.style.transformOrigin = 'left top';
            textarea.style.textAlign = typedText.align();
            textarea.style.color = typedText.fill();
            var rotation = typedText.rotation();
            var transform = '';
            if (rotation) {
              transform += 'rotateZ(' + rotation + 'deg)';
            }
    
            var px = 0;
            // also we need to slightly move textarea on firefox
            // because it jumps a bit
            var isFirefox =
              navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            if (isFirefox) {
              px += 2 + Math.round(typedText.fontSize() / 20);
            }
            transform += 'translateY(-' + px + 'px)';
    
            textarea.style.transform = transform;
    
            // reset height
            textarea.style.height = 'auto';
            // after browsers resized it we can set actual value
            textarea.style.height = textarea.scrollHeight + 3 + 'px';
    
            textarea.focus();
          }

          // do nothing if we mousedown on any shape. if not, add a new typedText
          if (e.target !== stage) {
            typedText = e.target;
          } else {
            typedText = new Konva.Text({
              x: pos.x,
              y: pos.y,
              text: 'Some text here',
              fill: lineColor,
              fontSize: 20,
              // draggable: true,
              width: 200
            });
            // layer.add(typedText);
      
            textTr = new Konva.Transformer({
              node: typedText,
              enabledAnchors: ['middle-left', 'middle-right'],
              // set minimum width of text
              boundBoxFunc: function (oldBox, newBox) {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
              },
            });
      
          }

          typedText.on('transform', function () {
            // reset scale, so only with is changing by transformer
            typedText.setAttrs({
              width: typedText.width() * typedText.scaleX(),
              scaleX: 1,
            });
          });
    
          // layer.add(textTr);
    
          // typedText.on('dblclick dbltap', () => {
          // hide text node and transformer:
          typedText.hide();
          textTr.hide();
  
          // create textarea over canvas with absolute position
          // first we need to find position for textarea
          // how to find it?
  
          // at first lets find position of text node relative to the stage:
          var textPosition = typedText.absolutePosition();
  
          // so position of textarea will be the sum of positions above:
          areaPosition = {
            x: stage.container().offsetLeft + textPosition.x + 200,
            y: stage.container().offsetTop + textPosition.y - 10,
          };

          createTextarea(typedText, areaPosition);
  
          function removeTextarea() {
            textarea.parentNode.removeChild(textarea);
            window.removeEventListener('click', handleOutsideClick);
            typedText.show();
            textTr.show();
            textTr.forceUpdate();
          }
  
          function setTextareaWidth(newWidth) {
            if (!newWidth) {
              // set width for placeholder
              newWidth = typedText.placeholder.length * typedText.fontSize();
            }
            // some extra fixes on different browsers
            var isSafari = /^((?!chrome|android).)*safari/i.test(
              navigator.userAgent
            );
            var isFirefox =
              navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            if (isSafari || isFirefox) {
              newWidth = Math.ceil(newWidth);
            }
  
            var isEdge =
              document.documentMode || /Edge/.test(navigator.userAgent);
            if (isEdge) {
              newWidth += 1;
            }
            textarea.style.width = newWidth + 'px';
          }
  
          textarea.addEventListener('keydown', function (e) {
            
            // hide on enter
            // but don't hide on shift + enter
            if (e.keyCode === 13 && !e.shiftKey) {
              typedText.text(textarea.value);
              typedText.setAttrs({
                x: areaPosition.x - 256,
                y: areaPosition.y - 177,
                height: typedText.height() - typedText.padding() * 2 + 5,
                width: typedText.width() - typedText.padding() * 2
              });
              allShapes.push(typedText);
              layer.add(typedText);
              removeTextarea();
            }
            // on esc do not set value back to node
            if (e.keyCode === 27) {
              removeTextarea();
            }
          });
  
          textarea.addEventListener('keydown', function (e) {
            var scale = typedText.getAbsoluteScale().x;
            setTextareaWidth(typedText.width() * scale);
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + typedText.fontSize() + 'px';
          });
  
          function handleOutsideClick(e) {
            if (e.target !== textarea) {
              typedText.text(textarea.value);
              removeTextarea();
            }
          }
          setTimeout(() => {
            window.addEventListener('click', handleOutsideClick);
          });

          
          // });
        }
      }
    });

    if (drawingDataFromBack) {
      let image = new Image();
      Konva.Image.fromURL(drawingDataFromBack, function(image) {
        // image is Konva.Image instance
        layer.add(image);
        layer.draw();
        stage.add(layer);
      })

      
      // image.onload = function () {
      //   stage.drawImage(image, 0, 0);
      // };
      // image.src = drawingData;
    }

  }, [actionType])

  const usePencilBtn = () => {
    //set type
    setActionType("pencil");
    isDraggable = false;

    for (let i = 0; i < allShapes.length; i++) {
      let shape = allShapes[i];
      shape.draggable(isDraggable);
    }

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
    stage.container().style.cursor = "canvas-container-pencil";
    setCursorStyle("canvas-container-pencil");

    stage.globalCompositeOperation = "source-over";
    // contextOverlayRef.current.globalCompositeOperation = "source-over";
    // contextOverlayRef.current.strokeWidth = 2;
    // contextOverlayRef.current.lineWidth = 2;
    stage.strokeWidth = 2;
    stage.lineWidth = 20;
  };

  const useEraserBtn = () => {
    setActionType("eraser");
    isDraggable = false;

    for (let i = 0; i < allShapes.length; i++) {
      let shape = allShapes[i];
      shape.draggable(isDraggable);
    }

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
    stage.container().style.cursor = "canvas-container-eraser";
    setCursorStyle("canvas-container-eraser");
    stage.globalCompositeOperation = "destination-out";
    stage.strokeWidth = 2;
    stage.lineWidth = 10;
    // contextOverlayRef.current.globalCompositeOperation = "destination-out";
    // contextOverlayRef.current.strokeWidth = 2;
    // contextOverlayRef.current.lineWidth = 2;
  };

  const useLineBtn = () => {
    setActionType("line");
    isDraggable = false;

    for (let i = 0; i < allShapes.length; i++) {
      let shape = allShapes[i];
      shape.draggable(isDraggable);
    }

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(false);
    setLineStatus(true);
    setCircleStatus(false);
    setOvalStatus(false);
    setTextStatus(false);
    setSvgStatus(false);
    setSelectStatus(false);

    stage.container().style.cursor = "canvas-container-square";
    setCursorStyle("canvas-container-square");
    stage.globalCompositeOperation = "source-over";
    stage.strokeWidth = 2;
    stage.lineWidth = 2;
    // contextOverlayRef.current.globalCompositeOperation = "source-over";
    // contextOverlayRef.current.strokeWidth = 2;
    // contextOverlayRef.current.lineWidth = 2;
  };

  const useSquareBtn = () => {
    setActionType("square");
    isDraggable = false;

    for (let i = 0; i < allShapes.length; i++) {
      let shape = allShapes[i];
      shape.draggable(isDraggable);
    }

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(true);
    setLineStatus(false);
    setCircleStatus(false);
    setOvalStatus(false);
    setTextStatus(false);
    setSvgStatus(false);
    setSelectStatus(false);

    stage.container().style.cursor = "canvas-container-square";
    setCursorStyle("canvas-container-square");
    stage.globalCompositeOperation = "source-over";
    stage.strokeWidth = 2;
    stage.lineWidth = 2;
    // contextOverlayRef.current.globalCompositeOperation = "source-over";
    // contextOverlayRef.current.strokeWidth = 2;
    // contextOverlayRef.current.lineWidth = 2;
  };

  const useCircleBtn = () => {
    setActionType("circle");
    isDraggable = false;

    for (let i = 0; i < allShapes.length; i++) {
      let shape = allShapes[i];
      shape.draggable(isDraggable);
    }

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(false);
    setLineStatus(false);
    setCircleStatus(true);
    setOvalStatus(false);
    setTextStatus(false);
    setSvgStatus(false);
    setSelectStatus(false);

    stage.container().style.cursor = "canvas-container-circle";
    setCursorStyle("canvas-container-circle");
    stage.globalCompositeOperation = "source-over";
    stage.strokeWidth = 2;
    stage.lineWidth = 2;
    // contextOverlayRef.current.globalCompositeOperation = "source-over";
    // contextOverlayRef.current.strokeWidth = 2;
    // contextOverlayRef.current.lineWidth = 2;
  };
  
  const useOvalBtn = () => {
    setActionType("oval");
    isDraggable = false;

    for (let i = 0; i < allShapes.length; i++) {
      let shape = allShapes[i];
      shape.draggable(isDraggable);
    }

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(false);
    setLineStatus(false);
    setCircleStatus(false);
    setOvalStatus(true);
    setTextStatus(false);
    setSvgStatus(false);
    setSelectStatus(false);

    stage.container().style.cursor = "canvas-container-oval";
    setCursorStyle("canvas-container-oval");
    stage.globalCompositeOperation = "source-over";
    stage.strokeWidth = 2;
    stage.lineWidth = 2;
    // contextOverlayRef.current.globalCompositeOperation = "source-over";
    // contextOverlayRef.current.strokeWidth = 2;
    // contextOverlayRef.current.lineWidth = 2;
  };

  const useTextBtn = () => {
    setActionType("text");
    isDraggable = false;

    for (let i = 0; i < allShapes.length; i++) {
      let shape = allShapes[i];
      shape.draggable(isDraggable);
    }

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(false);
    setLineStatus(false);
    setCircleStatus(false);
    setOvalStatus(false);
    setTextStatus(true);
    setSvgStatus(false);
    setSelectStatus(false);

    stage.container().style.cursor = "canvas-container-text";
    setCursorStyle("canvas-container-text");
    stage.globalCompositeOperation = "source-over";
    stage.strokeWidth = 2;
    stage.lineWidth = 2;
    // contextOverlayRef.current.globalCompositeOperation = "source-over";
    // contextOverlayRef.current.strokeWidth = 2;
    // contextOverlayRef.current.lineWidth = 2;
  };

  const useSvgBtn = (e) => {
    setActionType("SVG");
    isDraggable = false;

    for (let i = 0; i < allShapes.length; i++) {
      let shape = allShapes[i];
      shape.draggable(isDraggable);
    }

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(false);
    setLineStatus(false);
    setCircleStatus(false);
    setOvalStatus(false);
    setTextStatus(false);
    setSvgStatus(true);
    setSelectStatus(false);

    stage.container().style.cursor = "canvas-container-svg";
    setCursorStyle("canvas-container-text");
    stage.globalCompositeOperation = "source-over";
    stage.strokeWidth = 2;
    stage.lineWidth = 2;

    svg = new Konva.Image({
      width: 100,
      height: 100
    });

    [...e.target.files].forEach((file) => {
      var reader = new FileReader();
      reader.onload = function (evt) {
        const image = new Image();
        image.src = evt.target.result;
        image.onload = () => {
          svg.image(image);
          allShapes.push(svg);
          layer.add(svg);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const useSelectBtn = () => {
    setActionType("select");
    isDraggable = true;

    for (let i = 0; i < allShapes.length; i++) {
      let shape = allShapes[i];
      // if(shape.attrs.name !== 'eraser') {
      //   shape.draggable(isDraggable);
      // }
      shape.draggable(isDraggable);
    }

    setPencilStatus(false);
    setEraserStatus(false);
    setSquareStatus(false);
    setLineStatus(false);
    setCircleStatus(false);
    setOvalStatus(false);
    setTextStatus(false);
    setSvgStatus(false);
    setSelectStatus(true);

    stage.container().style.cursor = "canvas-container-select";
    setCursorStyle("canvas-container-select");
    stage.globalCompositeOperation = "source-over";
    stage.strokeWidth = 2;
    stage.lineWidth = 2;
    // contextOverlayRef.current.globalCompositeOperation = "source-over";
    // contextOverlayRef.current.strokeWidth = 2;
    // contextOverlayRef.current.lineWidth = 2;
  }

  const clearCanvasBtn = () => {
    stage.clear();
    layer.clear();
    allShapes = [];
    setDrawingDataFromBack('');
    
  };

  const saveImage = (event) => {
    const canvas = stage.toDataURL();
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
                stroke="white"
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

           <input type="color" role="button" className="align-self-center form-control-color" value={lineColor} onChange={(e)=> lineColor = e.target.value } /> 
         
          
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
          <div className={"canvasWrapper " + cursorStyle} id="canvasContainer">
            {/* <canvas className="overlay" ref={canvasOverlayRef}></canvas>
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
            ></canvas> */}
            
          </div>
          <div className=" end-container"></div>
        </div>
      </div>
      
    </div>
  );
};

export default DrawingCanvas;
