import { Grid, LinearProgress, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { useAppDispatch } from "../app/hooks";
import CardItem from "../components/CardItem";
import StyledDropzone from "../components/StyledDropzone";
import APIInstance from "../config/APIInstance";
import { useDocumentsQuery } from "../features/documents/documentsApi";
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
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | undefined>();

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
        <Typography variant="h4" gutterBottom>
          Home
        </Typography>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          onClick={handleClose}
        >
          <Box sx={style}>
            <img
              src={selectedUrl}
              height={"100%"}
              width={600}
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Modal>

        {data.length ? (
          <Grid container spacing={2}>
            {data.map((item: any) => (
              <CardItem
                key={item._id}
                item={item}
                onShowDocumentHandler={(url) => {
                  if (url.includes(".pdf")) {
                    return window.open(url, "_blank");
                  }

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
