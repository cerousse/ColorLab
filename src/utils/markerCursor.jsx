import ReactDOMServer from "react-dom/server";
import MarkerSvg from "../components/MarkerSvg";

export const markerCursor = (color) => {
  const size = 64;

  const svgString = ReactDOMServer.renderToStaticMarkup(
    <MarkerSvg color={color} size={size} />
  );

  return `url("data:image/svg+xml;utf8,${encodeURIComponent(
    svgString
  )}") 0 64, auto`;
};