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
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import { GetServerSideProps } from "next/types";
import { parseCookies } from "nookies";
import { ReactElement, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../../context/UserContext";
import MainLayout from "../../../layouts/MainLayout";
import api from "../../../services/api";

interface InvertersModel {
  id: string;
  model: string;
  activePower: number;
  manufacturerId: string;
  manufacturerName?: string;
}

interface ManufacturersType {
  name: string;
  productsType: number;
  id: string;
}

const ListagemInversores = () => {
  const { isUserAuthenticated } = useContext(UserContext);

  const [inverters, setInverters] = useState([]);
  const [selectedInverter, setSelectedInverter] =
    useState<InvertersModel | null>(null);
  const [manufacturers, setManufacturers] = useState<ManufacturersType[]>([]);

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

  const handleGetInverters = async () => {
    await api
      .get("/inverters")
      .then((res) => {
        setInverters(res.data);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  const handleAddInverters = async (data: any) => {
    await api
      .post("/inverters", data)
      .then((res) => {
        handleGetInverters();
        onAddClose();
        reset();
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  const handleDeleteInverter = async (data: InvertersModel) => {
    await api.delete(`/inverters/${data.id}`).then((res) => {
      handleGetInverters();
      onDeleteClose();
    });
  };

  const handleEditInverter = async (data: any) => {
    if (selectedInverter) {
      await api
        .post(`/inverters/${selectedInverter.id}`, data)
        .then((res) => {
          onEditClose();
          handleGetInverters();
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    }
  };

  const handleGetManufacturers = async () => {
    const result = await api.get("/manufacturers");
    setManufacturers(result.data);
  };

  useEffect(() => {
    const getSolarPanels = async () => {
      if (isUserAuthenticated) {
        handleGetManufacturers();
        handleGetInverters();
      }
    };

    getSolarPanels();
  }, [isUserAuthenticated]);

  return (
    <>
      <Flex gap={10} w="100%">
        <Head>
          <title>SET | Listagem de inversores</title>
        </Head>
        <Grid bg="white" p={5} gap={5} borderRadius={5} w="100%">
          <Heading fontWeight="extrabold">Listagem de inversores</Heading>
          <Table variant="simple">
            <TableCaption>
              <Button rightIcon={<AddIcon />} onClick={onAddOpen}>
                Cadastrar inversor
              </Button>
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Modelo</Th>
                <Th>Potência ativa [W]</Th>
                <Th>Fabricante</Th>
                <Th isNumeric>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {inverters &&
                inverters.map((item: InvertersModel, index: number) => (
                  <Tr key={index}>
                    <Td>{item.model}</Td>
                    <Td>{item.activePower}</Td>
                    <Td>{item.manufacturerName}</Td>
                    <Td isNumeric>
                      <Flex justifyContent="end">
                        <Button
                          size="sm"
                          mr={2}
                          colorScheme="red"
                          onClick={() => {
                            setSelectedInverter(item);
                            onDeleteOpen();
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedInverter(item);
                            onEditOpen();
                          }}
                        >
                          <EditIcon />
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Grid>
      </Flex>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Excluir inversor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid gap={2}>
              <Text fontWeight="extrabold">
                Essa ação, consequentemente, excluirá, sem reversão, O INVERSOR
                de nosso banco de dados!
              </Text>
              <Text>
                Inversor a ser excluído:{" "}
                {selectedInverter && selectedInverter.model}
              </Text>
              <Text>Você tem certeza que deseja continuar?</Text>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() =>
                selectedInverter && handleDeleteInverter(selectedInverter)
              }
            >
              Excluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isAddOpen}
        onClose={() => {
          onAddClose();
          reset();
        }}
      >
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={handleSubmit(handleAddInverters)}
          autoComplete="off"
        >
          <ModalHeader>Cadastrar inversor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid gap={2}>
              <FormControl>
                <FormLabel htmlFor="model">Modelo</FormLabel>
                <Input
                  {...register("model", { required: true })}
                  id="model"
                  type="text"
                  isInvalid={addErrors.model}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="activePower">Potência ativa [W]</FormLabel>
                <Input
                  {...register("activePower", { required: true })}
                  id="activePower"
                  type="text"
                  isInvalid={addErrors.activePower}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="manufacturerId">Fabricante</FormLabel>
                <Select
                  {...register("manufacturerId", { required: true })}
                  placeholder="Selecione uma opção"
                  isInvalid={addErrors.manufacturerId}
                >
                  {manufacturers.map((item, index) => {
                    if (item.productsType == 0) {
                      return (
                        <option value={item.id} key={index}>
                          {item.name}
                        </option>
                      );
                    }
                  })}
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
          onSubmit={handleSubmitEdit(handleEditInverter)}
          autoComplete="off"
        >
          <ModalHeader>Editar inversor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid gap={2}>
              <Text>
                Inversor a ser editado:{" "}
                {selectedInverter && selectedInverter.model}
              </Text>
              <FormControl>
                <FormLabel htmlFor="model">Novo nome do modelo</FormLabel>
                <Input
                  {...registerEdit("model", { required: true })}
                  id="model"
                  type="text"
                  isInvalid={updateErrors.model}
                  // @ts-ignore
                  defaultValue={selectedInverter && selectedInverter.model}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="activePower">Potência</FormLabel>
                <Input
                  {...registerEdit("activePower", { required: true })}
                  id="activePower"
                  type="text"
                  isInvalid={updateErrors.activePower}
                  // @ts-ignore
                  defaultValue={
                    selectedInverter && selectedInverter.activePower.toString()
                  }
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

ListagemInversores.getLayout = function getLayout(page: ReactElement) {
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

export default ListagemInversores;
