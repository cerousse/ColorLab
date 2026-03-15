import ReactDOMServer from "react-dom/server";
import PencilSvg from "../components/PencilSvg";

export const pencilCursor = (color) => {
  const size = 64;

  const svgString = ReactDOMServer.renderToStaticMarkup(
    <PencilSvg color={color} size={size} />
  );

  return `url("data:image/svg+xml;utf8,${encodeURIComponent(
    svgString
  )}") 0 64, auto`;
};