import { useEffect, useRef, useState } from "react";
import "./index.css";
import Menu from "./Menu";
import { brushCursor } from "./utils/brushCursor";
import { pencilCursor } from "./utils/pencilCursor";
import { markerCursor } from "./utils/markerCursor";
import pipetteCursor from "./utils/pipetteCursor";
import spongeCursor from "./utils/spongeCursor";

const TOOLS = {
  pencil: { lineWidth: 2, lineCap: "round" },
  thickBrush: { lineWidth: 15, lineCap: "round" },
  marker: { lineWidth: 10, lineCap: "square" }
};

const PAINT = {
  RED: "#ff0000",
  YELLOW: "#ffff00",
  BLUE: "#0000ff",
  WHITE: "#ffffff",
  BLACK: "#000000",
  WATER: null
};

// --- COLOR UTILS ---

const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
};

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`;

const rgbToHsl = ({ r, g, b }) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h *= 60;
  }

  return { h, s, l };
};

const hslToRgb = ({ h, s, l }) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
};

// --- MIXING LOGIC ---

const isYellowHue = (h) => h >= 55 && h <= 65;
const isBlueHue = (h) => h >= 230 && h <= 250;

const mixColors = (colors) => {

  if (colors.length === 0) return null;

  const hslColors = colors.map(hex => rgbToHsl(hexToRgb(hex)));

  const yellows = hslColors.filter(c => isYellowHue(c.h));
  const blues = hslColors.filter(c => isBlueHue(c.h));

  // 🎨 YELLOW + BLUE → DYNAMIC GREEN
  if (yellows.length > 0 && blues.length > 0) {

    const all = hslColors;

    const avgS =
      all.reduce((sum, c) => sum + c.s, 0) / all.length;

    const avgL =
      all.reduce((sum, c) => sum + c.l, 0) / all.length;

    // average yellow hue
    const avgYellowH =
      yellows.reduce((sum, c) => sum + c.h, 0) / yellows.length;

    // average blue hue
    const avgBlueH =
      blues.reduce((sum, c) => sum + c.h, 0) / blues.length;

    // shortest circular hue distance
    const distance = (avgBlueH - avgYellowH + 360) % 360;

    // midpoint between yellow and blue
    let greenHue = avgYellowH + distance * 0.5;

    greenHue = greenHue % 360;

    return rgbToHex(
      hslToRgb({
        h: greenHue,
        s: avgS,
        l: avgL
      })
    );
  }

  // fallback RGB mix
  let r = 0, g = 0, b = 0;

  colors.forEach(c => {
    const rgb = hexToRgb(c);
    r += rgb.r;
    g += rgb.g;
    b += rgb.b;
  });

  return rgbToHex({
    r: Math.round(r / colors.length),
    g: Math.round(g / colors.length),
    b: Math.round(b / colors.length)
  });
};

function App() {

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState("pencil");
  const [lineColor, setLineColor] = useState(null);
  const [pipetteColor, setPipetteColor] = useState(null);

  const [palette, setPalette] = useState(
    Array.from({ length: 6 }, () => [])
  );

  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth * 0.75;
    canvas.height = window.innerHeight;

    ctx.lineJoin = "round";
    ctxRef.current = ctx;

  }, []);

  useEffect(() => {

    if (currentTool === "pencil")
      document.body.style.cursor = pencilCursor(lineColor ?? "#ffffff");

    else if (currentTool === "thickBrush")
      document.body.style.cursor = brushCursor(lineColor ?? "#ffffff");

    else if (currentTool === "marker")
      document.body.style.cursor = markerCursor(lineColor ?? "#ffffff");

    else if (currentTool === "pipette")
      document.body.style.cursor = pipetteCursor(pipetteColor ?? "#ffffff");

    else if (currentTool === "sponge")
      document.body.style.cursor = spongeCursor();

    return () => {
      document.body.style.cursor = "default";
    };

  }, [currentTool, lineColor, pipetteColor]);

  useEffect(() => {

    if (!ctxRef.current) return;

    const tool = TOOLS[currentTool];
    if (!tool) return;

    ctxRef.current.lineCap = tool.lineCap;
    ctxRef.current.lineWidth = tool.lineWidth;
    ctxRef.current.strokeStyle = lineColor ?? "transparent";

  }, [currentTool, lineColor]);

  const startDrawing = (e) => {
    if (currentTool === "pipette" || currentTool === "sponge") return;
    if (!lineColor) return;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e) => {

    if (!isDrawing) return;

    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();

  };

  const clearCanvas = () => {

    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);

  };

  const handleColorPotClick = (color) => {

    if (currentTool === "pipette") {

      if (color === null) {
        setPipetteColor(null);
        return;
      }

      setPipetteColor(color);
      return;
    }

    if (color === null || !lineColor) {setLineColor(color)};

  };

  const handlePaletteSlotClick = (index) => {
  const slotColors = palette[index];
  const slotMixed = mixColors(slotColors);

// 🧽 Sponge cleans slot
if (currentTool === "sponge") {
  setPalette(prev => {
    const copy = [...prev];
    copy[index] = [];
    return copy;
  });
  return;
}
  // 🧪 Pipette interaction
  if (currentTool === "pipette") {

    // TAKE color
    if (!pipetteColor && slotMixed) {
      setPipetteColor(slotMixed);
      return;
    }

    // DROP color
    if (pipetteColor) {

      setPalette(prev => {
        const copy = [...prev];
        const newSlotColors = [...copy[index], pipetteColor];

        // calculate mixed color immediately and store only result
        const mixed = mixColors(newSlotColors);

        copy[index] = mixed ? [mixed] : [];
        return copy;
      });

      setPipetteColor(null);
    }

    return;
  }

  // 🎨 Tools take color
  if (!lineColor && slotMixed) {
    setLineColor(slotMixed);
  }
};

  return (
    <div className="App">

      <Menu
        PAINT={PAINT}
        palette={palette}
        mixColors={mixColors}
        onColorPotClick={handleColorPotClick}
        onSlotClick={handlePaletteSlotClick}
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        lineColor={lineColor}
        pipetteColor={pipetteColor}
        clearCanvas={clearCanvas}
      />

      <div className="CanvasWrapper">

        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
        />

      </div>

    </div>
  );
}

export default App;