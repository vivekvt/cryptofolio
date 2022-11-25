import Layout from "../src/components/common/Layout";
import Portfolio from "../src/components/Portfolio";
import { useSignIn } from "../src/hooks/useSignIn";

export default function Home() {
  useSignIn();
  return (
    <Layout>
      <Portfolio />
    </Layout>
  );
}
