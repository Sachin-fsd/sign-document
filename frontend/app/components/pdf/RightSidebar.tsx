// frontend/app/components/pdf/RightSidebar.tsx
import React from "react";
import pkg from 'file-saver';
const {saveAs} = pkg;
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const fonts = [
  { name: "Arial", style: { fontFamily: "Arial, sans-serif" } },
  { name: "Times New Roman", style: { fontFamily: "'Times New Roman', serif" } },
  { name: "Courier New", style: { fontFamily: "'Courier New', monospace" } },
];

const fontMap: Record<string, string> = {
  Arial: StandardFonts.Helvetica,
  "Times New Roman": StandardFonts.TimesRoman,
  "Courier New": StandardFonts.Courier,
};

interface RightSidebarProps {
  pdfFile: File | null;
  formData: any;
  setFormData: (formData: any) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  onAddText: (type: "name" | "description") => void;
  textElements: any[];
  pdfUrl: string | null;
  onDownload: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  pdfFile,
  formData,
  setFormData,
  selectedFont,
  setSelectedFont,
  onAddText,
  textElements,
  pdfUrl,
  onDownload,
}) => {
  // Download PDF with text overlays
  const handleDownload = async () => {
    if (!pdfFile) return;
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const page = pdfDoc.getPages()[0];

    for (const el of textElements) {
      const font = await pdfDoc.embedFont(fontMap[el.font] || StandardFonts.Helvetica);
      page.drawText(el.value, {
        x: el.x,
        y: page.getHeight() - el.y - 20, // Adjust for PDF coordinate system
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
    }

    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "signed.pdf");
  };

  return (
    <aside className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Add Text</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          className="w-full border rounded px-2 py-1"
          value={formData.name}
          onChange={(e) => setFormData((f: any) => ({ ...f, name: e.target.value }))}
        />
        <button
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => onAddText("name")}
          disabled={!formData.name}
        >
          Add Name
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Font</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value)}
        >
          {fonts.map((font) => (
            <option key={font.name} value={font.name}>
              {font.name}
            </option>
          ))}
        </select>
      </div>
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded"
        onClick={onDownload}
      >
        Download PDF
      </button>
    </aside>
  );
};

export default RightSidebar;