import CancelIcon from "@mui/icons-material/Cancel";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import {
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { useAppDispatch } from "../app/hooks";
import CardItem from "../components/CardItem";
import StyledDropzone from "../components/StyledDropzone";
import APIInstance from "../config/APIInstance";
import { showToast } from "../config/Toast";
import {
  useDestroyBulkMutation,
  useDocumentsQuery,
} from "../features/documents/documentsApi";
import { setDocuments } from "../features/documents/documentsSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 720,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  justifyContent: "center",
};

const Welcome = () => {
  const {
    data,
    isLoading,
    refetch: refetchDocuments,
  } = useDocumentsQuery("Documents");
  const [destroy] = useDestroyBulkMutation();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | undefined>();
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && data) {
      dispatch(setDocuments(data));
    }
  }, [isLoading, data, dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
  };

  /**
   * @description handles file uploads
   */
  const onFileDropHandler = async (files: File[]) => {
    for (const file of files) {
      // unique toast id
      const toastId = uuid();

      // start a new toast for each file
      toast.info(`Uploading ${file.name}: 0% completed`, {
        progress: 0,
        toastId,
        closeButton: false,
      });

      try {
        // generating form data
        const formData = new FormData();
        formData.append("document", file);

        // making document upload request
        await APIInstance.post("/documents", formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total !== undefined) {
              // how much is completed
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );

              // update the progress of the specific toast
              toast.update(toastId, {
                render: `Uploading ${file.name}: ${
                  percentCompleted === 100 ? 90 : percentCompleted
                }% completed`,
              });
            }
          },
        });

        // upload success
        toast.update(toastId, {
          render: `File ${file.name} uploaded successfully.`,
          type: "success",
          autoClose: 5000,
          closeButton: undefined,
        });

        // refetching data
        refetchDocuments();
      } catch (error) {
        // upload failed
        toast.update(toastId, {
          render: `Failed to upload file ${file.name}: ${error.message}`,
          type: "error",
          autoClose: 10000,
          closeButton: undefined,
        });
      }
    }
  };

  if (isLoading) {
    return <LinearProgress color="primary" />;
  }

  return (
    <StyledDropzone onFileDrop={onFileDropHandler}>
      <Container maxWidth="lg">
        <Stack
          spacing={2}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="h4" gutterBottom>
            Home
          </Typography>

          {selectedDocumentIds.length ? (
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="body1" gutterBottom color={"primary"} mr={2}>
                Selected documents {selectedDocumentIds.length}
              </Typography>
              <IconButton
                color="error"
                onClick={async (event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  try {
                    await destroy(selectedDocumentIds).unwrap();
                    setSelectedDocumentIds([]);
                    showToast("Documents successfully deleted", "success");
                  } catch (error) {
                    showToast(
                      "An error occurred when trying to delete documents",
                      "error"
                    );
                  }
                }}
              >
                <DeleteSweepIcon />
              </IconButton>
              <IconButton
                color="info"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setSelectedDocumentIds([]);
                }}
              >
                <CancelIcon />
              </IconButton>
            </Stack>
          ) : (
            <></>
          )}
        </Stack>

        {/* view modal starts */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          onClick={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Box sx={style}>
            {selectedUrl?.includes(".pdf") ? (
              <Document file={selectedUrl} renderMode="canvas">
                <Page
                  pageIndex={0}
                  pageNumber={1}
                  height={600}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className={"modal-width"}
                />
              </Document>
            ) : (
              <img
                src={selectedUrl}
                height={"100%"}
                width={600}
                style={{ objectFit: "contain" }}
                className={"modal-width"}
              />
            )}
          </Box>
        </Modal>
        {/* view modal ends */}

        {data.length ? (
          <Grid container spacing={2}>
            {data.map((item: any) => (
              <CardItem
                key={item._id}
                item={item}
                selected={selectedDocumentIds.some((id) => id === item._id)}
                onClickDocumentHandler={(id) => {
                  const exists = selectedDocumentIds.find(
                    (docId) => docId === id
                  );
                  if (exists) {
                    setSelectedDocumentIds((selectedIds) =>
                      selectedIds.filter((selectedId) => selectedId !== id)
                    );
                  } else {
                    setSelectedDocumentIds((selectedIds) => [
                      ...selectedIds,
                      id,
                    ]);
                  }
                }}
                onShowDocumentHandler={(url) => {
                  setSelectedUrl(url);
                  handleOpen();
                }}
              />
            ))}
          </Grid>
        ) : (
          <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
            <Typography variant="h4">Oops!</Typography>
            <p>No documents available.</p>
          </Stack>
        )}
      </Container>
    </StyledDropzone>
  );
};

export default Welcome;
