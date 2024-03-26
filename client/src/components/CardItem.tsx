import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import DownloadIcon from "@mui/icons-material/Download";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Document, Page } from "react-pdf";
import APIInstance from "../config/APIInstance";
import { showToast } from "../config/Toast";
import { useDestroyMutation } from "../features/documents/documentsApi";

interface Props {
  item: any;
  selected: boolean;
  onClickDocumentHandler: (id: string) => void;
  onShowDocumentHandler: (url: string) => void;
}

const CardItem = ({
  item,
  selected,
  onClickDocumentHandler,
  onShowDocumentHandler,
}: Props) => {
  const [destroy] = useDestroyMutation();

  // function to prevent the default behavior and stop event propagation
  const handleClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    // additional code to show the image in modal can be added here
    onClickDocumentHandler(item._id);
  };

  // function to prevent the default behavior and stop event propagation
  const deleteDocumentHandler = async (event: any, id: string) => {
    event.preventDefault();
    event.stopPropagation();

    // additional code to show the image in modal can be added here
    try {
      const { message } = await destroy(id).unwrap();
      showToast(message, "success");
    } catch (error) {
      showToast(error.data, "error");
    }
  };

  const onDocumentDownloadHandler = async (id: string) => {
    const response = await APIInstance.get(`/documents/downloads/${id}`, {
      responseType: "blob",
    });

    const fileName =
      response.headers["content-disposition"].split("filename=")[1];

    // create a blob from the stream data
    const blob = new Blob([response.data], {
      type: "application/octet-stream",
    });

    // create a download URL for the blob
    const url = window.URL.createObjectURL(blob);

    // create an anchor element with the download URL
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName.replace('"', "").replace('"', "")); // set an empty download attribute to trigger file download
    document.body.appendChild(link);
    link.click();

    // clean up resources
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const cardActions = () => (
    <>
      <IconButton
        color="error"
        onClick={(e) => deleteDocumentHandler(e, item._id)}
      >
        <DeleteSweepIcon />
      </IconButton>

      <IconButton
        color="info"
        onClick={() => onShowDocumentHandler(item.storagePath)}
        disabled={
          !item.mimeType.includes("jpg") &&
          !item.mimeType.includes("jpeg") &&
          !item.mimeType.includes("png") &&
          !item.mimeType.includes("pdf")
        }
      >
        <RemoveRedEyeIcon />
      </IconButton>

      <IconButton
        color="success"
        onClick={() => onDocumentDownloadHandler(item._id)}
      >
        <DownloadIcon />
      </IconButton>
    </>
  );

  const renderCardContent = () => {
    switch (item.mimeType) {
      case "image/jpeg": {
        return (
          <img
            srcSet={`${item.storagePath}`}
            src={`${item.storagePath}`}
            loading="lazy"
            style={{ objectFit: "contain", width: "100%", maxHeight: 200 }}
          />
        );
      }

      case "image/png": {
        return (
          <img
            srcSet={`${item.storagePath}`}
            src={`${item.storagePath}`}
            loading="lazy"
            style={{ objectFit: "contain", width: "100%", maxHeight: 200 }}
          />
        );
      }

      case "application/pdf": {
        return (
          <Document file={item.storagePath} renderMode="canvas">
            <Page
              pageIndex={0}
              pageNumber={1}
              height={200}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        );
      }

      case "text/plain": {
        return (
          <img
            src={"/images/txt-file.png"}
            loading="lazy"
            style={{ objectFit: "contain", width: "100%", maxHeight: 200 }}
          />
        );
      }

      case "application/vnd.ms-excel": {
        return (
          <img
            src={"/images/excel.png"}
            loading="lazy"
            style={{ objectFit: "contain", width: "100%", maxHeight: 200 }}
          />
        );
      }

      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
        return (
          <img
            src={"/images/excel.png"}
            loading="lazy"
            style={{ objectFit: "contain", width: "100%", maxHeight: 200 }}
          />
        );
      }

      case "application/vnd.ms-powerpoint": {
        return (
          <img
            src={"/images/powerpoint.png"}
            loading="lazy"
            style={{ objectFit: "contain", width: "100%", maxHeight: 200 }}
          />
        );
      }

      case "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
        return (
          <img
            src={"/images/powerpoint.png"}
            loading="lazy"
            style={{ objectFit: "contain", width: "100%", maxHeight: 200 }}
          />
        );
      }

      case "application/msword": {
        return (
          <img
            src={"/images/docx.png"}
            loading="lazy"
            style={{ objectFit: "contain", width: "100%", maxHeight: 200 }}
          />
        );
      }

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        return (
          <img
            src={"/images/docx.png"}
            loading="lazy"
            style={{ objectFit: "contain", width: "100%", maxHeight: 200 }}
          />
        );
      }

      default:
        break;
    }
  };

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      key={item.storagePath}
      onClick={handleClick}
    >
      <Card sx={{ background: selected ? blue[50] : undefined }}>
        <CardContent>{renderCardContent()}</CardContent>
        <CardActions disableSpacing>{cardActions()}</CardActions>
      </Card>
    </Grid>
  );
};

export default CardItem;
