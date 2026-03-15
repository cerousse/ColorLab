import bucketRed from "./assets/bucket_paint_red.svg";
import bucketYellow from "./assets/bucket_paint_yellow.svg";
import bucketBlue from "./assets/bucket_paint_blue.svg";
import bucketWhite from "./assets/bucket_paint_white.svg";
import bucketBlack from "./assets/bucket_paint_black.svg";
import waterGlass from "./assets/waterGlass.svg";

import ThickBrushSvg from "./components/ThickBrushSvg.jsx";
import PencilSvg from "./components/PencilSvg.jsx";
import MarkerSvg from "./components/MarkerSvg.jsx";
import PaletteSvg from "./components/PaletteSvg";
import PipetteSvg from "./components/PipetteSvg.jsx";
import SpongeSvg from "./components/SpongeSvg.jsx";

const PAINT_ICONS = {
  "#ff0000": bucketRed,
  "#ffff00": bucketYellow,
  "#0000ff": bucketBlue,
  "#ffffff": bucketWhite,
  "#000000": bucketBlack,
  null: waterGlass
};

export default function Menu({
  PAINT,
  palette,
  mixColors,
  onColorPotClick,
  onSlotClick,
  currentTool,
  setCurrentTool,
  lineColor,
  pipetteColor,
  clearCanvas
}) {

  const drawingTools = ["pencil","thickBrush","marker"];
  const paletteTools = ["pipette","sponge"];

  const primaryColors = [
    PAINT.RED,
    PAINT.YELLOW,
    PAINT.BLUE,
    PAINT.WHITE,
    PAINT.BLACK
  ];

  return (
    <div className="Menu">

      {/* TOOLS */}
      <div className="ToolsRow">

        <div className="ToolsGroup DrawingTools">
          {drawingTools.map(tool => (
            <button
              key={tool}
              className={currentTool === tool ? "active" : ""}
              onClick={() => setCurrentTool(tool)}
            >
              {tool === "pencil" && <PencilSvg size={26} />}
              {tool === "thickBrush" && <ThickBrushSvg size={26} />}
              {tool === "marker" && <MarkerSvg size={26} />}
            </button>
          ))}
        </div>

        <div className="ToolsGroup UtilityTools">
          {paletteTools.map(tool => (
            <button
              key={tool}
              className={currentTool === tool ? "active" : ""}
              onClick={() => setCurrentTool(tool)}
            >
              {tool === "pipette" && <PipetteSvg size={26} color={pipetteColor ?? "#ffffff"} />}
              {tool === "sponge" && <SpongeSvg size={26} />}
            </button>
          ))}
        </div>

      </div>

      {/* COLORS */}
      <div className="ColorsRow">

        <div className="PrimaryColors">
          {primaryColors.map(color => (
            <button
              key={color}
              className={`ColorPot ${lineColor === color ? "active" : ""}`}
              onClick={() => onColorPotClick(color)}
            >
              <img src={PAINT_ICONS[color]} draggable={false} />
            </button>
          ))}
        </div>

        <div className="WaterContainer">
          <button
            className={`ColorPot ${lineColor === null ? "active" : ""}`}
            onClick={() => onColorPotClick(null)}
          >
            <img src={waterGlass} draggable={false} />
          </button>
        </div>

      </div>

      {/* PALETTE */}
      <div className="Palette">
        <PaletteSvg
          slots={palette}
          mixColors={mixColors}
          onSlotClick={onSlotClick}
        />
      </div>

      <button className="Danger" onClick={clearCanvas}>
        Clear Canvas
      </button>

    </div>
  );
}