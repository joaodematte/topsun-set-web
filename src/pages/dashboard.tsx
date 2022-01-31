import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Code,
  Flex,
  Grid,
  Heading,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { parseCookies } from "nookies";
import { ReactElement, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

const Dashboard = () => {
  const { isUserAuthenticated } = useContext(UserContext);
  const [invertersQuantity, setInverterQuantity] = useState(0);
  const [solarPanelsQuantity, setSolarPanelsQuantit] = useState(0);

  const fetchInvertersQuantity = async () => {
    await api.get("/inverters").then((res) => {
      setInverterQuantity(res.data.length);
    });
  };

  const fetchSolarPanelsQuantity = async () => {
    await api.get("/solarpanels").then((res) => {
      setSolarPanelsQuantit(res.data.length);
    });
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      fetchInvertersQuantity();
      fetchSolarPanelsQuantity();
    }
  }, [isUserAuthenticated]);

  return (
    <Flex flexDirection="column" gap={5}>
      <Head>
        <title>SET | Dashboard</title>
      </Head>

      <Grid
        gap={5}
        w="100%"
        templateColumns={{ base: "repeat(1, 1fr)", xl: "repeat(3, 1fr)" }}
      >
        <Box w="100%" p={10} bg="white" borderRadius={5}>
          <Heading color="gray.900">Inversores cadastrados</Heading>
          <Flex justifyContent="end">
            <Text color="gray.900" fontWeight="black" fontSize="6xl">
              {invertersQuantity}
            </Text>
          </Flex>
        </Box>

        <Box w="100%" p={10} bg="white" borderRadius={5}>
          <Heading color="gray.900">Módulos cadastrados</Heading>
          <Flex justifyContent="end">
            <Text color="gray.900" fontWeight="black" fontSize="6xl">
              {solarPanelsQuantity}
            </Text>
          </Flex>
        </Box>

        <Box w="100%" p={10} bg="white" borderRadius={5}>
          <Heading color="gray.900">Usuários cadastrados</Heading>
          <Flex justifyContent="end">
            <Text color="gray.900" fontWeight="black" fontSize="6xl">
              null
            </Text>
          </Flex>
        </Box>
      </Grid>

      <Flex>
        <Grid
          p={10}
          bg="white"
          borderRadius={5}
          gap={2}
          w={{ base: "100%", xl: "fit-content" }}
        >
          <Heading color="gray.900">Artefatos</Heading>
          <Link href="https://pep.celesc.com.br/" passHref>
            <ChakraLink isExternal>
              PEP Celesc <ExternalLinkIcon mx="2px" />
            </ChakraLink>
          </Link>
          <Grid p={2} bg="gray.100" borderRadius={5}>
            <Text>
              Usuário: <Code>78893119900</Code>
            </Text>
            <Text>
              Senha: <Code>hgtm97</Code>
            </Text>
          </Grid>
          <Link href="https://documentcenter.weg.net/SolarBox/" passHref>
            <ChakraLink isExternal>
              Document Center WEG <ExternalLinkIcon mx="2px" />
            </ChakraLink>
          </Link>
          <Grid p={2} bg="gray.100" borderRadius={5}>
            <Text>
              Usuário: <Code>robert@topsun.net.br</Code>
            </Text>
            <Text>
              Senha: <Code>Topsun@2021</Code>
            </Text>
          </Grid>
        </Grid>
      </Flex>
    </Flex>
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
