import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportChatToPDF = async (elementId, filename = 'JurisAI-Transcript.pdf') => {
  const input = document.getElementById(elementId);
  
  // Convert the HTML element to a canvas
  const canvas = await html2canvas(input, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  
  // Initialize PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
};