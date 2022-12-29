import Head from "next/head";
import Image from "next/image";
import Main from "../components/Main";
export default function Home() {
  return (
    <div>
      <Head>
        <title>Pokemon App</title>
        <meta name="description" content="Pokemon App to search pokemon" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main />
    </div>
  );
}
