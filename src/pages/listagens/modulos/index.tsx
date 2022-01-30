import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Flex,
  Grid,
  Heading,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Head from "next/head";
import { GetServerSideProps } from "next/types";
import { parseCookies } from "nookies";
import { ReactElement } from "react";
import MainLayout from "../../../layouts/MainLayout";

const ListagemModulos = () => {
  return (
    <Flex gap={10} w="100%">
      <Head>
        <title>SET | Listagem de módulos</title>
      </Head>
      <Grid bg="white" p={5} gap={5} borderRadius={5} w="100%">
        <Heading fontWeight="extrabold">Listagem de módulos</Heading>
        <Table variant="simple">
          <TableCaption>
            <Button rightIcon={<AddIcon />}>Cadastrar módulo</Button>
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Modelo</Th>
              <Th>Fabricante</Th>
              <Th>Potência(as) [Wp]</Th>
              <Th isNumeric>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>TSM-DE09</Td>
              <Td>TRINA SOLAR</Td>
              <Td>400</Td>
              <Td isNumeric>
                <Flex justifyContent="end">
                  <Button size="sm" mr={2}>
                    <DeleteIcon />
                  </Button>
                  <Button size="sm">
                    <EditIcon />
                  </Button>
                </Flex>
              </Td>
            </Tr>
            <Tr>
              <Td>TSM-DE15H</Td>
              <Td>TRINA SOLAR</Td>
              <Td>400, 405</Td>
              <Td isNumeric>
                <Flex justifyContent="end">
                  <Button size="sm" mr={2}>
                    <DeleteIcon />
                  </Button>
                  <Button size="sm">
                    <EditIcon />
                  </Button>
                </Flex>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Grid>
    </Flex>
  );
};

ListagemModulos.getLayout = function getLayout(page: ReactElement) {
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

export default ListagemModulos;
