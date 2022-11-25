import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import { ReactNode } from "react";
import Nav from "./Nav";
import { useGetUser } from "../../hooks/getUser";
import Loading from "./Loading";

interface ILayout {
  children: ReactNode;
}

export default function Layout({ children }: ILayout) {
  useGetUser();
  const authState = useSelector((state: any) => state.auth);
  return (
    <>
      <Nav />
      {authState?.init ? (
        <Container maxWidth="lg">{children}</Container>
      ) : (
        <Loading />
      )}
    </>
  );
}
