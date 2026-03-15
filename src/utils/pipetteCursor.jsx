import ReactDOMServer from "react-dom/server";
import PipetteSvg from "../components/PipetteSvg";

export default function pipetteCursor(color) {
  const svgString = ReactDOMServer.renderToStaticMarkup(
    <PipetteSvg color={color} size={48} />
  );


  return `url("data:image/svg+xml;utf8,${encodeURIComponent(
    svgString
  )}") 0 64, auto`;
}