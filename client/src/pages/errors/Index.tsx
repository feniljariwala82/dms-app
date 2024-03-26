import { Stack, Typography } from "@mui/material";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error: any = useRouteError();

  return (
    <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
      <Typography variant="h4">Oops!</Typography>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>
          {error.status} {error.statusText || error.message}
        </i>
      </p>
    </Stack>
  );
};

export default ErrorPage;
