const PDFViewer = ({ pdfUrl }: { pdfUrl: string }) => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <embed src={pdfUrl} type="application/pdf" width="100%" height="100%" />
    </div>
  );
};

export default PDFViewer;
