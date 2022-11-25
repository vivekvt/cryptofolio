import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FormEvent, useEffect, useState } from "react";
import { sendSignInLinkToEmail } from "firebase/auth";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { actionCodeSettings, auth } from "../src/config/firebase";
import Layout from "../src/components/common/Layout";
import Loading from "../src/components/common/Loading";
import { Typography } from "@mui/material";

const initialState = {
  email: "",
  loading: false,
  emailSent: false,
};

export default function Auth() {
  const [state, setState] = useState(initialState);

  const { auth: authState } = useSelector((store: any) => store);
  const router = useRouter();

  useEffect(() => {
    if (authState.authenticated) {
      router.push("/");
    }
  }, [authState.authenticated]);

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setState((oldState) => ({ ...oldState, loading: true }));
      const response = await sendSignInLinkToEmail(
        auth,
        state.email,
        actionCodeSettings
      );
      window.localStorage.setItem("emailForSignIn", state.email);
      setState((oldState) => ({
        ...oldState,
        loading: false,
        emailSent: true,
      }));
    } catch (error) {
      alert(`Error , ${error?.message}`);
      setState((oldState) => ({ ...oldState, loading: false }));
    }
  };

  return (
    <Layout>
      {authState?.init && !authState.authenticated ? (
        <Box sx={{ p: 2 }}>
          {state.emailSent ? (
            <>
              <Typography>
                Email with Sign in link is send to {state.email}, open that link
                to complete passwordless signin into Cryptofolio
              </Typography>
              <Button
                size="small"
                onClick={() =>
                  setState((oldState) => ({ ...oldState, emailSent: false }))
                }
              >
                send again
              </Button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                size="small"
                required
                fullWidth
                type="email"
                label="email"
                name="email"
                value={state.email}
                onChange={(event) =>
                  setState((oldState) => ({
                    ...oldState,
                    email: event?.target?.value,
                  }))
                }
              />
              <Button
                disabled={state.loading}
                sx={{ mt: 2 }}
                variant="contained"
                fullWidth
                type="submit"
              >
                Sign In{state.loading && "..."}
              </Button>
            </form>
          )}
        </Box>
      ) : (
        <Loading />
      )}
    </Layout>
  );
}
