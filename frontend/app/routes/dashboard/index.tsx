import PDFPreview, { type TextElement } from "@/components/pdf/PDFPreview";
import React, { useEffect, useRef, useState, useCallback } from "react";

// Dynamically load pdfjsLib from CDN and handle its availability.
// No direct import statement for pdfjs-dist is used here to avoid compilation errors.

// Define the interface for a text element, including its properties and position.



/**
 * Custom React Hook for PDF actions including upload.
 * This hook will manage the state and logic for interacting with your backend.
 * Moved directly into App.tsx for self-contained solution.
 */
const usePdfActions = () => {
  // Only upload functionality remains, no userDocuments state here
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const uploadPdf = useCallback(async (pdfBlob: Blob, fileName: string, userId: string) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('pdfFile', pdfBlob, fileName);
    formData.append('userId', userId);

    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/files/upload`,  {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload PDF');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      return result;
    } catch (err: any) {
      console.error('Error during PDF upload:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [BACKEND_API_BASE_URL]);

  // Removed fetchUserDocuments function as per request

  return {
    // userDocuments is removed
    isLoading, // Renamed from isUploading to isLoading for general purpose use in hook
    error,
    uploadPdf,
    // fetchUserDocuments is removed
  };
};


/**
 * Main App component that manages the PDF editor's state and UI.
 */
const App: React.FC = () => {
  const [originalName, setOriginalName] = useState("editted pdf")
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [newText, setNewText] = useState<string>("New Text");
  const [selectedFont, setSelectedFont] = useState<string>("Inter");
  const [selectedFontSize, setSelectedFontSize] = useState<number>(16);
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [selectedFontWeight, setSelectedFontWeight] = useState<string>("normal");
  const [selectedTextDecoration, setSelectedTextDecoration] = useState<string>("none");
  const [nextId, setNextId] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPdfJsReady, setIsPdfJsReady] = useState(false);
  const [isPdfLibReady, setIsPdfLibReady] = useState(false);
  const [isLoadingPdfLibs, setIsLoadingPdfLibs] = useState(true);
  const [isPdfFileLoading, setIsPdfFileLoading] = useState(false);

  // Destructure only uploadPdf from usePdfActions
  const { isLoading: isUploading, error: uploadError, uploadPdf } = usePdfActions();

  // Effect hook to dynamically load the PDF.js and pdf-lib libraries.
  useEffect(() => {
    setIsLoadingPdfLibs(true);

    const loadScript = (src: string, onLoad: () => void, onError: (error: Event | string) => void) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = onLoad;
      script.onerror = (e) => onError(e);
      document.body.appendChild(script);
      return script;
    };

    let pdfjsScript: HTMLScriptElement | null = null;
    let pdfLibScript: HTMLScriptElement | null = null;

    const handlePdfJsLoad = () => {
      setIsPdfJsReady(true);
      if (isPdfLibReady) setIsLoadingPdfLibs(false);
    };
    const handlePdfJsError = (error: Event | string) => {
      console.error("Error loading PDF.js script:", error);
      setIsLoadingPdfLibs(false);
    };

    const handlePdfLibLoad = () => {
      setIsPdfLibReady(true);
      if (isPdfJsReady) setIsLoadingPdfLibs(false);
    };
    const handlePdfLibError = (error: Event | string) => {
      console.error("Error loading pdf-lib script:", error);
      setIsLoadingPdfLibs(false);
    };

    const pdfjsVersion = "2.16.105";
    pdfjsScript = loadScript(`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.min.js`, handlePdfJsLoad, handlePdfJsError);
    pdfLibScript = loadScript(`https://unpkg.com/pdf-lib/dist/pdf-lib.min.js`, handlePdfLibLoad, handlePdfLibError);

    return () => {
      if (pdfjsScript && document.body.contains(pdfjsScript)) {
        document.body.removeChild(pdfjsScript);
      }
      if (pdfLibScript && document.body.contains(pdfLibScript)) {
        document.body.removeChild(pdfLibScript);
      }
    };
  }, [isPdfJsReady, isPdfLibReady]);

  // Removed the useEffect block that fetched user documents on component mount


  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setIsPdfFileLoading(true);
      setTextElements([]);
      setOriginalName(file.name)

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPdfUrl(e.target.result as string);
          setIsPdfFileLoading(false);
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading PDF file:", error);
        setIsPdfFileLoading(false);
        setPdfUrl(null);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      console.error("Please select a valid PDF file (.pdf).");
      setPdfUrl(null);
    } else {
      setPdfUrl(null);
    }
  }, []);

  const addTextElement = useCallback(() => {
    if (!pdfUrl) {
      console.error("Please load a PDF first to add text.");
      return;
    }

    let x = 50;
    let y = 50;

    if (canvasRef.current) {
      const canvasCssWidth = canvasRef.current.offsetWidth;
      const canvasCssHeight = canvasRef.current.offsetHeight;
      x = (canvasCssWidth / 2) - 50;
      y = (canvasCssHeight / 2) - 10;
      x = Math.max(0, x);
      y = Math.max(0, y);
    }

    const newElement: TextElement = {
      id: nextId,
      type: "text",
      value: newText,
      x,
      y,
      font: selectedFont,
      fontSize: selectedFontSize,
      color: selectedColor,
      fontWeight: selectedFontWeight,
      textDecoration: selectedTextDecoration,
    };
    setTextElements((prev) => [...prev, newElement]);
    setNextId((prev) => prev + 1);
    setNewText("New Text");
  }, [newText, nextId, selectedFont, selectedFontSize, selectedColor, selectedFontWeight, selectedTextDecoration, canvasRef, pdfUrl]);

  const handleUpdateText = useCallback((id: number, x: number, y: number) => {
    setTextElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  }, []);

  const handleRemoveText = useCallback((id: number) => {
    setTextElements((prev) => prev.filter((el) => el.id !== id));
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!pdfUrl) {
      console.error("Please load a PDF first to add text by clicking.");
      return;
    }
    const target = event.target as HTMLElement;
    let isClickOnDraggable = false;
    let currentElement: HTMLElement | null = target;
    while (currentElement && currentElement !== event.currentTarget) {
      if (currentElement.classList.contains('cursor-grab') || currentElement.tagName === 'BUTTON') {
        isClickOnDraggable = true;
        break;
      }
      currentElement = currentElement.parentElement;
    }

    if (isClickOnDraggable) {
      return;
    }

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newElement: TextElement = {
        id: nextId,
        type: "text",
        value: newText,
        x,
        y,
        font: selectedFont,
        fontSize: selectedFontSize,
        color: selectedColor,
        fontWeight: selectedFontWeight,
        textDecoration: selectedTextDecoration,
      };
      setTextElements((prev) => [...prev, newElement]);
      setNextId((prev) => prev + 1);
    }
  }, [newText, nextId, selectedFont, selectedFontSize, selectedColor, selectedFontWeight, selectedTextDecoration, canvasRef, pdfUrl]);

  // Function to download the modified PDF and then upload it
  const handleDownloadAndUploadPdf = useCallback(async () => {
    if (!pdfUrl || !isPdfLibReady || !isPdfJsReady) {
      console.error("PDF not loaded or libraries not ready for download/upload.");
      return;
    }

    try {
      // Set isUploading from the hook
      // No direct setIsUploading here, as the hook handles it

      const PDFLib = (window as any).PDFLib;
      const rgb = PDFLib.rgb;
      const StandardFonts = PDFLib.StandardFonts;

      const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
      const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width: pageWidth, height: pageHeight } = firstPage.getSize();

      const canvasDisplayWidth = canvasRef.current?.offsetWidth || 600;
      const canvasDisplayHeight = canvasRef.current?.offsetHeight || 800;

      const scaleX = pageWidth / canvasDisplayWidth;
      const scaleY = pageHeight / canvasDisplayHeight;

      const embeddedFonts: { [key: string]: any } = {};

      const embedHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const embedHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const embedTimesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const embedCourier = await pdfDoc.embedFont(StandardFonts.Courier);

      embeddedFonts[StandardFonts.Helvetica] = embedHelvetica;
      embeddedFonts[StandardFonts.HelveticaBold] = embedHelveticaBold;
      embeddedFonts[StandardFonts.TimesRoman] = embedTimesRoman;
      embeddedFonts[StandardFonts.Courier] = embedCourier;


      for (const el of textElements) {
        let fontKeyToUse;
        if (el.fontWeight === 'bold') {
          fontKeyToUse = StandardFonts.HelveticaBold;
        } else if (el.font.includes('Times')) {
          fontKeyToUse = StandardFonts.TimesRoman;
        } else if (el.font.includes('Courier')) {
          fontKeyToUse = StandardFonts.Courier;
        } else {
          fontKeyToUse = StandardFonts.Helvetica;
        }

        const embeddedFont = embeddedFonts[fontKeyToUse];

        const colorRgb = rgb(
          parseInt(el.color.slice(1, 3), 16) / 255,
          parseInt(el.color.slice(3, 5), 16) / 255,
          parseInt(el.color.slice(5, 7), 16) / 255
        );

        const pdfX = el.x * scaleX;
        const pdfY = pageHeight - (el.y * scaleY) - (el.fontSize * scaleY);


        firstPage.drawText(el.value, {
          x: pdfX,
          y: pdfY,
          font: embeddedFont,
          size: el.fontSize,
          color: colorRgb,
        });

        if (el.textDecoration === 'underline') {
          const textWidthInPdfPoints = embeddedFont.widthOfTextAtSize(el.value, el.fontSize);
          const underlineOffset = el.fontSize * 0.1 * scaleY;
          firstPage.drawLine({
            start: { x: pdfX, y: pdfY - underlineOffset },
            end: { x: pdfX + textWidthInPdfPoints, y: pdfY - underlineOffset },
            thickness: 1,
            color: colorRgb,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      console.log("PDF downloaded successfully.");

      // Call the uploadPdf function from the hook
      await uploadPdf(blob, originalName, JSON.parse(localStorage.getItem("user") || "")._id); // Call the upload function
      console.log("PDF uploaded to backend successfully.");

    } catch (error) {
      console.error("Error generating, downloading, or uploading PDF:", error);
      alert("Failed to download/upload PDF. Check console for details. Ensure a PDF is loaded and try again.");
    } finally {
      // isUploading state is managed by the hook
    }
  }, [pdfUrl, textElements, isPdfLibReady, isPdfJsReady, canvasRef, uploadPdf]);


  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen font-inter">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 drop-shadow-sm">PDF Editor</h1>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-8 p-6 bg-white rounded-xl shadow-lg w-full max-w-5xl">
        <div className="w-full flex justify-center mb-4">
          <label htmlFor="pdf-upload" className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0113 3.414L16.586 7A2 2 0 0118 8.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1-5a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            Select PDF
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload PDF file"
          />
          {pdfUrl && (
            <span className="ml-4 p-3 text-gray-700 bg-gray-50 rounded-lg shadow-sm flex items-center">
              PDF Loaded
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>

        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Enter text to add"
          style={{
            fontFamily: selectedFont,
            fontSize: selectedFontSize + 'px',
            color: selectedColor,
            fontWeight: selectedFontWeight,
            textDecoration: selectedTextDecoration,
          }}
          className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto flex-grow text-gray-700 placeholder-gray-400 shadow-sm"
          aria-label="Text to add"
          disabled={!pdfUrl}
        />
        <select
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 shadow-sm"
          aria-label="Select Font"
          disabled={!pdfUrl}
        >
          <option value="Inter">Inter</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Times New Roman, serif">Times New Roman</option>
          <option value="Courier New, monospace">Courier New</option>
          <option value="Georgia, serif">Georgia</option>
        </select>
        <input
          type="number"
          value={selectedFontSize}
          onChange={(e) => setSelectedFontSize(Number(e.target.value))}
          min="8"
          max="72"
          className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-24 text-center text-gray-700 shadow-sm"
          title="Font Size"
          aria-label="Font Size"
          disabled={!pdfUrl}
        />
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="p-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-12 w-12 cursor-pointer shadow-sm"
          title="Text Color"
          aria-label="Text Color"
          disabled={!pdfUrl}
        />
        <select
          value={selectedFontWeight}
          onChange={(e) => setSelectedFontWeight(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 shadow-sm"
          aria-label="Select Font Weight"
          disabled={!pdfUrl}
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
        </select>
        <select
          value={selectedTextDecoration}
          onChange={(e) => setSelectedTextDecoration(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 shadow-sm"
          aria-label="Select Text Decoration"
          disabled={!pdfUrl}
        >
          <option value="none">None</option>
          <option value="underline">Underline</option>
        </select>
        <button
          onClick={addTextElement}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!pdfUrl}
        >
          Add Text
        </button>
        <button
          onClick={handleDownloadAndUploadPdf}
          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!pdfUrl || !isPdfLibReady || !isPdfJsReady || isUploading}
        >
          {isUploading ? (
            <svg className="animate-spin h-5 w-5 mr-2 inline-block text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
          {isUploading ? "Uploading..." : "Download & Save PDF"}
        </button>
      </div>

      {/* PDF Preview Area */}
      <div className="flex justify-center items-start w-full overflow-auto p-4 max-h-[90vh] rounded-xl bg-gray-50 shadow-inner relative">
        {(isLoadingPdfLibs || isPdfFileLoading || !pdfUrl) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-20 rounded-xl">
            <div className="text-gray-700 text-lg font-semibold flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isLoadingPdfLibs ? "Loading PDF Editor Libraries..." : isPdfFileLoading ? "Loading PDF File..." : "Select a PDF to start"}
            </div>
          </div>
        )}
        <PDFPreview
          pdfUrl={pdfUrl}
          textElements={textElements}
          onUpdateText={handleUpdateText}
          onRemoveText={handleRemoveText}
          canvasRef={canvasRef}
          onCanvasClick={handleCanvasClick}
          isPdfJsReady={isPdfJsReady}
        />
      </div>


      {/* Instructions Section */}
      <div className="mt-10 p-6 bg-white rounded-xl shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">How to Use:</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Click <span className="font-bold text-blue-600">"Select PDF"</span> to upload your PDF file.</li>
          <li>Enter your desired text in the input field. Its style will update live.</li>
          <li>Choose a font style, size, color, weight (Normal/Bold), and decoration (None/Underline) for your text.</li>
          <li>Click the <span className="font-bold text-blue-600">"Add Text"</span> button to place the text initially in the center of the PDF.</li>
          <li>Alternatively, click anywhere directly on the PDF preview to add the text at that exact location.</li>
          <li>Drag any added text element around the PDF to precisely reposition it.</li>
          <li>To remove a text element, hover over it and click the small <span className="font-bold text-red-500">"X"</span> button.</li>
          <li>Click <span className="font-bold text-green-600">"Download & Save PDF"</span> to save the document with your added text and upload it to your account.</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
