import { useCallback, useEffect, useState } from "react";

interface TextElement {
  id: number;
  type: string; // e.g., 'text', 'signature' - for future expansion
  value: string; // The actual text content
  x: number; // X-coordinate on the PDF (in CSS pixels of the canvas display area)
  y: number; // Y-coordinate on the PDF (in CSS pixels of the canvas display area)
  font: string; // CSS font-family property
  fontSize: number; // CSS font-size property in pixels
  color: string; // CSS color property
  fontWeight: string; // CSS font-weight property (e.g., 'normal', 'bold')
  textDecoration: string; // CSS text-decoration property (e.g., 'none', 'underline')
}

// Props interface for the PDFPreview component.
interface PDFPreviewProps {
  pdfUrl: string | null; // URL of the PDF document to display, now can be null initially
  textElements: TextElement[]; // Array of text elements to overlay on the PDF
  onUpdateText: (id: number, x: number, y: number) => void; // Callback for when a text element is dragged
  onRemoveText: (id: number) => void; // Callback for when a text element is removed
  canvasRef: React.RefObject<HTMLCanvasElement>; // Ref to the canvas element for PDF rendering
  onCanvasClick: (event: React.MouseEvent<HTMLCanvasElement>) => void; // Callback for clicks on the canvas
  isPdfJsReady: boolean; // Prop to indicate if PDF.js library is loaded and ready
}

/**
 * PDFPreview component responsible for rendering the PDF and displaying draggable text elements.
 */
const PDFPreview: React.FC<PDFPreviewProps> = ({
  pdfUrl,
  textElements,
  onUpdateText,
  onRemoveText,
  canvasRef,
  onCanvasClick,
  isPdfJsReady,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggingElementId, setDraggingElementId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);

  // Effect hook to render the PDF whenever pdfUrl or isPdfJsReady changes.
  useEffect(() => {
    const renderPDF = async () => {
      if (!isPdfJsReady || !pdfUrl || !canvasRef.current) {
        if (!isPdfJsReady) {
          console.info("PDF.js not yet ready, waiting to render PDF.");
        } else if (!pdfUrl) {
          // console.warn("PDF URL is null, waiting for user to select a PDF.");
        } else {
          console.warn("Canvas ref not available.");
        }
        return;
      }

      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib) {
        console.error("pdfjsLib is not available on the window object.");
        return;
      }

      try {
        if (typeof window !== "undefined" && typeof window.DOMMatrix === "undefined") {
          // @ts-ignore
          window.DOMMatrix = window.WebKitCSSMatrix || (window as any).MSCSSMatrix || (window as any).CSSMatrix;
        }

        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const initialViewport = page.getViewport({ scale: 1 });
        const canvasCssWidth = canvas.offsetWidth * 2;
        const desiredScale = canvasCssWidth / initialViewport.width;

        canvas.width = initialViewport.width * desiredScale;
        canvas.height = initialViewport.height * desiredScale;

        const viewport = page.getViewport({ scale: desiredScale });

        if (context) {
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;
          console.log("PDF rendered successfully with dynamic scaling.");
        }
      } catch (error) {
        console.error("Error rendering PDF:", error);
      }
    };
    renderPDF();
  }, [pdfUrl, canvasRef, isPdfJsReady]);

  const handleMouseDown = useCallback((e: React.MouseEvent, el: TextElement) => {
    e.stopPropagation();
    setIsDragging(true);
    setDraggingElementId(el.id);
    if (canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - canvasRect.left - el.x,
        y: e.clientY - canvasRect.top - el.y,
      });
    }
  }, [canvasRef]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && draggingElementId !== null && canvasRef.current && dragOffset) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      let newX = e.clientX - canvasRect.left - dragOffset.x;
      let newY = e.clientY - canvasRect.top - dragOffset.y;

      const draggedElement = document.getElementById(`text-element-${draggingElementId}`);
      const elementWidth = draggedElement?.offsetWidth || 0;
      const elementHeight = draggedElement?.offsetHeight || 0;

      newX = Math.max(0, Math.min(newX, canvasRect.width - elementWidth));
      newY = Math.max(0, Math.min(newY, canvasRect.height - elementHeight));

      onUpdateText(draggingElementId, newX, newY);
    }
  }, [isDragging, draggingElementId, onUpdateText, canvasRef, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggingElementId(null);
    setDragOffset(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);


  return (
    <div
      className="relative border border-gray-300 rounded-lg shadow-lg overflow-hidden bg-white max-w-full"
      style={{ width: "fit-content" }}
    >
      {pdfUrl ? (
        <canvas
          ref={canvasRef}
          className="block w-full h-auto"
          style={{ borderRadius: '8px' }}
          onClick={onCanvasClick}
        />
      ) : (
        <div className="w-full h-full min-w-[600px] min-h-[800px] flex items-center justify-center bg-gray-200 rounded-lg text-gray-500 text-xl">
          Please select a PDF file to view and edit.
        </div>
      )}

      {textElements.map((el) => (
        <div
          key={el.id}
          id={`text-element-${el.id}`}
          onMouseDown={(e) => handleMouseDown(e, el)}
          className="absolute cursor-grab select-none p-1 rounded-sm bg-white bg-opacity-70 border border-transparent hover:border-blue-500 transition-all duration-150 ease-in-out z-10 group"
          style={{
            left: el.x,
            top: el.y,
            fontFamily: el.font,
            fontSize: el.fontSize,
            color: el.color,
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            fontWeight: el.fontWeight,
            textDecoration: el.textDecoration,
          }}
        >
          {el.value}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveText(el.id);
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out cursor-pointer shadow-md"
            aria-label={`Remove text element "${el.value}"`}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default PDFPreview