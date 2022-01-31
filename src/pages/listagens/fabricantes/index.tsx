import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { GetServerSideProps } from "next/types";
import { parseCookies } from "nookies";
import { ReactElement, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../../context/UserContext";
import MainLayout from "../../../layouts/MainLayout";
import api from "../../../services/api";

interface ManufacturersType {
  name: string;
  productsType: number;
  id: string;
}

interface DeleteManufacturerInterface {
  name: string;
  id: string;
}

const ListagemFabricantes = () => {
  const { isUserAuthenticated } = useContext(UserContext);

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: addErrors },
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: updateErrors },
  } = useForm();

  const [manufacturers, setManufacturers] = useState<ManufacturersType[]>([]);

  const [selectedManufacturer, setSelectedManufacturer] =
    useState<DeleteManufacturerInterface | null>();

  const handleGetManufacturers = async () => {
    const result = await api.get("/manufacturers");
    setManufacturers(result.data);
  };

  useEffect(() => {
    const getManufacturers = async () => {
      if (isUserAuthenticated) {
        handleGetManufacturers();
      }
    };

    getManufacturers();
  }, [isUserAuthenticated]);

  const handleManufacturerRegister = async (data: Object) => {
    await api
      .post("/manufacturers", data)
      .then((res) => {
        handleGetManufacturers();
        onAddClose();
        reset();
      })
      .catch((err) => console.log(err.response.data.message));
  };

  const handleManufacturerDelete = async (id: string) => {
    await api
      .delete("/manufacturers", { data: { id } })
      .then((res) => {
        handleGetManufacturers();
        onDeleteClose();
      })
      .catch((err) => console.log(err.response.data.message));
  };

  const handleManufacturerUpdate = async (data: Object) => {
    selectedManufacturer &&
      Object.assign(data, { id: selectedManufacturer.id });

    console.log(data);
    await api
      .post("/manufacturers/update", data)
      .then((res) => {
        handleGetManufacturers();
        resetEdit();
        onEditClose();
      })
      .catch((err) => console.log(err.response.data.message));
  };
  return (
    <>
      <Flex gap={10} w="100%">
        <Head>
          <title>SET | Listagem de fabricantes</title>
        </Head>
        <Grid bg="white" p={5} gap={5} borderRadius={5} w="100%">
          <Heading fontWeight="extrabold">Listagem de fabricantes</Heading>
          <Table variant="simple">
            <TableCaption>
              <Button rightIcon={<AddIcon />} onClick={onAddOpen}>
                Cadastrar fabricante
              </Button>
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Tipo de produto</Th>
                <Th isNumeric>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {manufacturers &&
                manufacturers.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.name}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          item.productsType == 0 ? "purple" : "yellow"
                        }
                      >
                        {item.productsType == 0 ? "Inversores" : "Módulos"}
                      </Badge>
                    </Td>
                    <Td isNumeric>
                      <Button
                        size="sm"
                        mr={2}
                        colorScheme="red"
                        onClick={() => {
                          setSelectedManufacturer({
                            id: item.id,
                            name: item.name,
                          });
                          onDeleteOpen();
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedManufacturer({
                            id: item.id,
                            name: item.name,
                          });
                          onEditOpen();
                        }}
                      >
                        <EditIcon />
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Grid>
      </Flex>

      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={handleSubmit(handleManufacturerRegister)}
          autoComplete="off"
        >
          <ModalHeader>Cadastrar fabricante</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid gap={2}>
              <FormControl>
                <FormLabel htmlFor="name">Nome do fabricante</FormLabel>
                <Input
                  {...register("name", { required: true })}
                  id="name"
                  type="text"
                  isInvalid={addErrors.name}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="productsType">Tipo de produto</FormLabel>
                <Select
                  {...register("productsType", { required: true })}
                  placeholder="Selecione uma opção"
                  isInvalid={addErrors.productsType}
                >
                  <option value="0">Inversores</option>
                  <option value="1">Módulos</option>
                </Select>
              </FormControl>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme="blue">
              Cadastrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={handleSubmit(handleManufacturerRegister)}
          autoComplete="off"
        >
          <ModalHeader>Cadastrar fabricante</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid gap={2}>
              <FormControl>
                <FormLabel htmlFor="name">Nome do fabricante</FormLabel>
                <Input {...register("name")} id="name" type="text" />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="username">Tipo de produto</FormLabel>
                <Select
                  {...register("productsType")}
                  placeholder="Selecione uma opção"
                >
                  <option value="0">Inversores</option>
                  <option value="1">Módulos</option>
                </Select>
              </FormControl>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme="blue">
              Cadastrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Excluir fabricante</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid gap={2}>
              <Text fontWeight="extrabold">
                Essa ação, consequentemente, excluirá TODOS OS SEUS
                MÓDULOS/INVERSORES cadastrados!
              </Text>
              <Text>
                Fabricante a ser excluído:{" "}
                {selectedManufacturer && selectedManufacturer.name}
              </Text>
              <Text>Você tem certeza que deseja continuar?</Text>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() =>
                selectedManufacturer &&
                handleManufacturerDelete(selectedManufacturer.id)
              }
            >
              Excluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          resetEdit();
        }}
      >
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={handleSubmitEdit(handleManufacturerUpdate)}
          autoComplete="off"
        >
          <ModalHeader>Editar fabricante</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid gap={2}>
              <Text fontWeight="extrabold">
                Essa ação, consequentemente, atualizará TODOS OS SEUS
                MÓDULOS/INVERSORES cadastrados!
              </Text>
              <Text>
                Fabricante a ser atualizado:{" "}
                {selectedManufacturer && selectedManufacturer.name}
              </Text>
              <FormControl>
                <FormLabel htmlFor="name">Novo nome do fabricante</FormLabel>
                <Input
                  {...registerEdit("name", { required: true })}
                  id="name"
                  type="text"
                  isInvalid={updateErrors.name}
                />
              </FormControl>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme="blue">
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

ListagemFabricantes.getLayout = function getLayout(page: ReactElement) {
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

export default ListagemFabricantes;
