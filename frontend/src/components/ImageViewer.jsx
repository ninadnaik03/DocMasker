export default function ImageViewer({ hex }) {
  if (!hex) return null;

  const binary = hex.match(/\w{2}/g)
    .map(b => String.fromCharCode(parseInt(b, 16)))
    .join("");

  return <img src={`data:image/png;base64,${btoa(binary)}`} />;
}