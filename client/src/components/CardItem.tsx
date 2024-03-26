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
import APIInstance from "../config/APIInstance";
import { showToast } from "../config/Toast";
import { useDestroyMutation } from "../features/documents/documentsApi";
import PDFViewer from "./PDFViewer";

interface Props {
  item: any;
  onShowDocumentHandler: (url: string) => void;
}

const CardItem = ({ item, onShowDocumentHandler }: Props) => {
  const [destroy] = useDestroyMutation();

  // function to prevent the default behavior and stop event propagation
  const handleClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    // additional code to show the image in modal can be added here
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

  const cardActions = (item: any) => (
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
      >
        <RemoveRedEyeIcon />
      </IconButton>

      <IconButton
        color="success"
        onClick={onDocumentDownloadHandler.bind(this, item._id)}
      >
        <DownloadIcon />
      </IconButton>
    </>
  );

  return (
    <>
      {item.mimeType === "application/pdf" ? (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          key={item.storagePath}
          onClick={handleClick}
        >
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <PDFViewer pdfUrl={item.storagePath} />
            </CardContent>

            <CardActions disableSpacing>{cardActions(item)}</CardActions>
          </Card>
        </Grid>
      ) : (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          key={item.storagePath}
          onClick={handleClick}
        >
          <Card sx={{ minWidth: "fit-content" }}>
            <CardContent>
              <img
                srcSet={`${item.storagePath}`}
                src={`${item.storagePath}`}
                loading="lazy"
                style={{ objectFit: "contain", width: "100%", maxHeight: 200 }}
              />
            </CardContent>

            <CardActions disableSpacing>{cardActions(item)}</CardActions>
          </Card>
        </Grid>
      )}
    </>
  );
};

export default CardItem;
