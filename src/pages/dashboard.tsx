import { GetServerSideProps } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";
import { ReactElement, useContext } from "react";
import { UserContext } from "../context/UserContext";
import MainLayout from "../layouts/MainLayout";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  return (
    <h1>
      <Head>
        <title>SET | Dashboard</title>
      </Head>
      Autenticado como: {user?.fullName}
    </h1>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["topsunauth.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default Dashboard;
