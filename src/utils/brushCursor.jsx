import ReactDOMServer from "react-dom/server";
import ThickBrushSvg from "../components/ThickBrushSvg.jsx";

export const brushCursor = (color) => {
  const svgString = ReactDOMServer.renderToStaticMarkup(
    <ThickBrushSvg color={color} size={64} />
  );

  return `url("data:image/svg+xml;utf8,${encodeURIComponent(
    svgString
  )}") 0 64, auto`;
};