import QRCode from "react-qr-code";

export const ProductQRCode = ({ productUrl, size = 120 }) => {
  if (!productUrl) return null;

  return (
    <div
      style={{
        background: "#fff",
      }}
    >
      <QRCode
        value={productUrl}
        size={size}
        level="H"
        bgColor="#ffffff"
        fgColor="#000000"
      />
    </div>
  );
};
