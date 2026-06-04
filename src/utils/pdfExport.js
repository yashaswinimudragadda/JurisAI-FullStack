import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportChatToPDF = async (elementId, filename = 'JurisAI-Transcript.pdf') => {
  const originalElement = document.getElementById(elementId);
  if (!originalElement) {
    console.error("Element not found:", elementId);
    return;
  }

  // 1. Create a clone to protect the original UI
  const clone = originalElement.cloneNode(true);
  
  // 2. Strip all classes and inline styles to avoid "oklab" parsing errors
  const allElements = clone.querySelectorAll('*');
  allElements.forEach(el => {
    el.removeAttribute('class');
    el.removeAttribute('style');
  });

  // 3. Apply basic, safe styling for the PDF
  clone.style.background = '#ffffff';
  clone.style.color = '#000000';
  clone.style.padding = '20px';
  clone.style.fontFamily = 'sans-serif';
  clone.style.position = 'absolute';
  clone.style.top = '-9999px';
  clone.style.width = '800px'; 
  
  document.body.appendChild(clone);

  try {
    // 4. Capture the clean clone
    const canvas = await html2canvas(clone, { 
      scale: 2, 
      useCORS: true,
      logging: false 
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const ratio = canvas.height / canvas.width;
    
    // 5. Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfWidth * ratio);
    pdf.save(filename);
    
  } catch (error) {
    console.error("PDF Export failed:", error);
  } finally {
    // 6. Cleanup
    document.body.removeChild(clone);
  }
};