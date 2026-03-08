import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer } from 'lucide-react';

export const QRGenerator = () => {
  const [tableCount, setTableCount] = useState(20);
  const baseUrl = window.location.origin;

  const downloadQR = (tableNum: number) => {
    const svg = document.getElementById(`qr-table-${tableNum}`);
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `Table_${tableNum}_QR.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#4A3728]">QR Code Generator</h1>
        <p className="text-[#8B7E74]">Generate and download QR codes for your tables.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#E5E1D1] flex items-center gap-4">
        <label className="font-medium">Number of Tables:</label>
        <input
          type="number"
          value={tableCount}
          onChange={(e) => setTableCount(parseInt(e.target.value) || 0)}
          className="w-24 px-4 py-2 bg-[#FDFCF0] border border-[#E5E1D1] rounded-xl focus:outline-none focus:border-[#4A3728]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: tableCount }, (_, i) => i + 1).map((num) => (
          <div key={num} className="bg-white p-6 rounded-3xl border border-[#E5E1D1] flex flex-col items-center gap-4 shadow-sm">
            <div className="bg-[#FDFCF0] p-4 rounded-2xl border border-[#E5E1D1]">
              <QRCodeSVG
                id={`qr-table-${num}`}
                value={`${baseUrl}/?table=${num}`}
                size={160}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg">Table {num}</h3>
              <p className="text-xs text-[#8B7E74] mt-1 break-all">
                {baseUrl}/?table={num}
              </p>
            </div>
            <button
              onClick={() => downloadQR(num)}
              className="w-full flex items-center justify-center gap-2 bg-[#4A3728] text-white py-2 rounded-xl hover:bg-[#3A2B20] transition-colors text-sm font-bold"
            >
              <Download size={16} />
              Download PNG
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
