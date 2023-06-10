import { Fragment } from "react";
import DrawingCanvas from "../components/canvas/drawing-canvas";
import DrawingCanvasBackup from "../components/canvas/drawing-canvas-backup";

export default function CanvasTest(){
    return(
        <Fragment>
            <div>Canvas Spot</div>
            <DrawingCanvas />
            <DrawingCanvasBackup />
        </Fragment>
    )
}