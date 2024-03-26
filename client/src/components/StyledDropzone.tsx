import { ReactNode, useMemo } from "react";
import { useDropzone } from "react-dropzone";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  outline: "none",
  transition: "border .24s ease-in-out",
  height: "100vh",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

interface Props {
  children: ReactNode;
  onFileDrop: (files: File[]) => void; // callback to handle dropped files
}

const StyledDropzone = ({ children, onFileDrop }: Props) => {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { "image/*": [".png", ".jpeg"], "application/pdf": [".pdf"] },
      onDropAccepted: (files) => onFileDrop(files),
    });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div className="container" style={{ height: "100vh" }}>
      {/* @ts-ignore */}
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {children}
      </div>
    </div>
  );
};

export default StyledDropzone;
