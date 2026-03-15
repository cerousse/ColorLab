import ReactDOMServer from "react-dom/server";
import SpongeSvg from "../components/SpongeSvg";

export default function spongeCursor() {
  const svg = ReactDOMServer.renderToStaticMarkup(
    <SpongeSvg size={48} />
  );

  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 8 40, auto`;
}