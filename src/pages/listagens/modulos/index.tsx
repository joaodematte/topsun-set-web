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

interface SolarPanelsModel {
  id: string;
  model: string;
  outputs: number[];
  manufacturerId: string;
  manufacturerName?: string;
}

interface ManufacturersType {
  name: string;
  productsType: number;
  id: string;
}

const ListagemModulos = () => {
  const { isUserAuthenticated } = useContext(UserContext);

  const [solarPanels, setSolarPanels] = useState([]);
  const [selectedSolarPanel, setSelectedSolarPanel] =
    useState<SolarPanelsModel | null>(null);
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

  const handleGetSolarPanels = async () => {
    await api
      .get("/solarpanels")
      .then((res) => {
        setSolarPanels(res.data);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  const handleAddModules = async (data: any) => {
    const outputs = data.outputs
      .split(",")
      .map((v: string) => v.trim())
      .map((v: string) => Number(v));

    data.outputs = outputs;

    await api
      .post("/solarpanels", data)
      .then((res) => {
        handleGetSolarPanels();
        onAddClose();
        reset();
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  const handleDeleteSolarPanel = async (data: SolarPanelsModel) => {
    await api
      .delete(`/solarpanels/${data.id}`)
      .then((res) => {
        handleGetSolarPanels();
        onDeleteClose();
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  const handleEditSolarPanel = async (data: SolarPanelsModel) => {
    const outputs = data.outputs
      // @ts-ignore
      .split(",")
      .map((v: string) => v.trim())
      .map((v: string) => Number(v));

    data.outputs = outputs;

    if (selectedSolarPanel) {
      await api
        .post(`/solarpanels/${selectedSolarPanel.id}`, data)
        .then((res) => {
          onEditClose();
          handleGetSolarPanels();
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
        handleGetSolarPanels();
      }
    };

    getSolarPanels();
  }, [isUserAuthenticated]);

  return (
    <>
      <Flex gap={10} w="100%">
        <Head>
          <title>SET | Listagem de módulos</title>
        </Head>
        <Grid bg="white" p={5} gap={5} borderRadius={5} w="100%">
          <Heading fontWeight="extrabold">Listagem de módulos</Heading>
          <Table variant="simple">
            <TableCaption>
              <Button rightIcon={<AddIcon />} onClick={onAddOpen}>
                Cadastrar módulo
              </Button>
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Modelo</Th>
                <Th>Potência(as) [Wp]</Th>
                <Th>Fabricante</Th>
                <Th isNumeric>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {solarPanels &&
                solarPanels.map((item: SolarPanelsModel, index: number) => (
                  <Tr key={index}>
                    <Td>{item.model}</Td>
                    <Td>
                      {item.outputs.map(
                        (item: number, index: number) => `${item}, `
                      )}
                    </Td>
                    <Td>{item.manufacturerName}</Td>
                    <Td isNumeric>
                      <Flex justifyContent="end">
                        <Button
                          size="sm"
                          mr={2}
                          colorScheme="red"
                          onClick={() => {
                            setSelectedSolarPanel(item);
                            onDeleteOpen();
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedSolarPanel(item);
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
          <ModalHeader>Excluir módulo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid gap={2}>
              <Text fontWeight="extrabold">
                Essa ação, consequentemente, excluirá, sem reversão, O MÓDULO de
                nosso banco de dados!
              </Text>
              <Text>
                Módulo a ser excluído:{" "}
                {selectedSolarPanel && selectedSolarPanel.model}
              </Text>
              <Text>Você tem certeza que deseja continuar?</Text>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() =>
                selectedSolarPanel && handleDeleteSolarPanel(selectedSolarPanel)
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
          onSubmit={handleSubmit(handleAddModules)}
          autoComplete="off"
        >
          <ModalHeader>Cadastrar módulo</ModalHeader>
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
                <FormLabel htmlFor="name">
                  Potências (separadas por vírgulas, sem espaço)
                </FormLabel>
                <Input
                  {...register("outputs", { required: true })}
                  id="name"
                  type="text"
                  isInvalid={addErrors.outputs}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="productsType">Fabricante</FormLabel>
                <Select
                  {...register("manufacturerId", { required: true })}
                  placeholder="Selecione uma opção"
                  isInvalid={addErrors.manufacturerId}
                >
                  {manufacturers.map((item, index) => {
                    if (item.productsType == 1) {
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
          // @ts-ignore
          onSubmit={handleSubmitEdit(handleEditSolarPanel)}
          autoComplete="off"
        >
          <ModalHeader>Editar módulo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid gap={2}>
              <Text>
                Módulo a ser editado:{" "}
                {selectedSolarPanel && selectedSolarPanel.model}
              </Text>
              <FormControl>
                <FormLabel htmlFor="model">Novo nome do modelo</FormLabel>
                <Input
                  {...registerEdit("model", { required: true })}
                  id="model"
                  type="text"
                  isInvalid={updateErrors.model}
                  // @ts-ignore
                  defaultValue={selectedSolarPanel && selectedSolarPanel.model}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="outputs">Potências</FormLabel>
                <Input
                  {...registerEdit("outputs", { required: true })}
                  id="outputs"
                  type="text"
                  isInvalid={updateErrors.outputs}
                  // @ts-ignore
                  defaultValue={
                    selectedSolarPanel && selectedSolarPanel.outputs.toString()
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
