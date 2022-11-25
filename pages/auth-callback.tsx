import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../src/components/common/Layout";
import { useSelector } from "react-redux";
import { useSignIn } from "../src/hooks/useSignIn";

export default function AuthCallback() {
  useSignIn();
  const { auth: authState } = useSelector((store: any) => store);
  const router = useRouter();

  useEffect(() => {
    if (authState.authenticated) {
      router.push("/");
    }
  }, [authState.authenticated]);

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
        <CircularProgress />
      </Box>
    </Layout>
  );
}
