import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";
import { ReactElement, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../context/UserContext";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import download from "downloadjs";
import { nanoid } from "nanoid";
import { CheckIcon, DownloadIcon } from "@chakra-ui/icons";

interface ManufacturersType {
  name: string;
  productsType: number;
  id: string;
}

interface SolarPanelsModel {
  id: string;
  model: string;
  outputs: number[];
  manufacturerId: string;
  manufacturerName?: string;
}

interface InvertersModel {
  id: string;
  model: string;
  activePower: number;
  manufacturerId: string;
  manufacturerName?: string;
}

const DuSimplificado = () => {
  const { isUserAuthenticated } = useContext(UserContext);

  const [manufacturers, setManufacturers] = useState<ManufacturersType[]>([]);
  const [solarPanels, setSolarPanels] = useState<SolarPanelsModel[]>([]);
  const [inverters, setInverters] = useState<InvertersModel[]>([]);
  const [selectedManufacturerId, setSelectedManufacturerId] = useState("");
  const [selectedSolarPanel, setSelectedSolarPanel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleGetManufacturers = async () => {
    await api.get("/manufacturers").then((res) => {
      setManufacturers(res.data);
    });
  };

  const handleGetSolarPanels = async () => {
    await api.get("/solarpanels").then((res) => {
      setSolarPanels(res.data);
    });
  };

  const handleGetInverters = async () => {
    await api.get("/inverters").then((res) => {
      setInverters(res.data);
    });
  };

  const handlePdfCreation = async (pdfData: Object) => {
    setIsLoading(true);
    await api
      .post("/gerador/simplificado", pdfData)
      .then(async (res) => {
        if (res.status != 200) return alert("não foi possível gerar o pdf");

        await handlePdfDownload();
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  const handlePdfDownload = async () => {
    await api
      .get("/gerador/simplificado", { responseType: "blob" })
      .then((res) => {
        download(res.data, `DIAGRAMA UNIFILAR SIMPLIFICADO-${nanoid()}`);
        setIsLoading(false);
        setIsDownloaded(true);
        setTimeout(() => {
          setIsDownloaded(false);
        }, 2000);
      });
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      handleGetManufacturers();
      handleGetSolarPanels();
      handleGetInverters();
    }
  }, [isUserAuthenticated]);

  return (
    <Flex gap={10} w="100%">
      <Head>
        <title>SET | Gerador de diagrama unifilar simplificado</title>
      </Head>
      <Grid
        bg="white"
        p={5}
        gap={5}
        borderRadius={5}
        w={{ base: "100%", xl: "50%" }}
      >
        <Heading fontWeight="extrabold">
          Gerador de diagrama unifilar simplificado
        </Heading>
        <Grid
          gap={2}
          as="form"
          onSubmit={handleSubmit(handlePdfCreation)}
          autoComplete="off"
        >
          <Flex
            gap={{ base: 2, xl: 5 }}
            flexDirection={{ base: "column", xl: "row" }}
          >
            <FormControl>
              <FormLabel htmlFor="medidor">Número do medidor</FormLabel>
              <Input
                {...register("medidor", { required: true })}
                id="medidor"
                name="medidor"
                type="text"
                isInvalid={errors.medidor}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="capacidadeDisjuntor">
                Capacidade do disjuntor
              </FormLabel>
              <Input
                {...register("capacidadeDisjuntor", { required: true })}
                id="capacidadeDisjuntor"
                name="capacidadeDisjuntor"
                type="number"
                isInvalid={errors.capacidadeDisjuntor}
              />
            </FormControl>
          </Flex>

          <FormControl>
            <FormLabel htmlFor="tipoLigacao">Tipo de ligação</FormLabel>
            <Select
              {...register("tipoLigacao", { required: true })}
              id="tipoLigacao"
              name="tipoLigacao"
              placeholder="Selecione uma opção"
              isInvalid={errors.tipoLigacao}
            >
              <option value="monofasica">Monofásica</option>
              <option value="bifasica">Bifásica</option>
              <option value="trifasica">Trifásica</option>
            </Select>
          </FormControl>

          <Flex
            gap={{ base: 2, xl: 5 }}
            flexDirection={{ base: "column", xl: "row" }}
          >
            <FormControl>
              <FormLabel htmlFor="quantidadeModulos">
                Quantidade de módulos
              </FormLabel>
              <Input
                {...register("quantidadeModulos", { required: true })}
                id="quantidadeModulos"
                name="quantidadeModulos"
                type="number"
                isInvalid={errors.quantidadeModulos}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="fabricanteModulo">
                Fabricante do módulo
              </FormLabel>
              <Select
                {...register("fabricanteModulo", { required: true })}
                id="fabricanteModulo"
                name="fabricanteModulo"
                placeholder="Selecione uma opção"
                isInvalid={errors.fabricanteModulo}
                onChange={(e) => setSelectedManufacturerId(e.target.value)}
                value={selectedManufacturerId}
              >
                {manufacturers.map((item, index) => {
                  if (item.productsType == 1) {
                    return (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    );
                  }
                })}
              </Select>
            </FormControl>
          </Flex>

          <Flex
            gap={{ base: 2, xl: 5 }}
            flexDirection={{ base: "column", xl: "row" }}
          >
            <FormControl>
              <FormLabel htmlFor="modeloModulo">Modelo do módulo</FormLabel>
              <Select
                {...register("modeloModulo", { required: true })}
                id="modeloModulo"
                name="modeloModulo"
                placeholder="Selecione uma opção"
                isInvalid={errors.modeloModulo}
                value={selectedSolarPanel}
                onChange={(e) => setSelectedSolarPanel(e.target.value)}
              >
                {solarPanels.map((item, index) => {
                  if (item.manufacturerId == selectedManufacturerId) {
                    return (
                      <option key={index} value={item.id}>
                        {item.model}
                      </option>
                    );
                  }
                })}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="potenciaModulo">Potência do módulo</FormLabel>
              <Select
                {...register("potenciaModulo", { required: true })}
                id="potenciaModulo"
                name="potenciaModulo"
                placeholder="Selecione uma opção"
                isInvalid={errors.potenciaModulo}
              >
                {solarPanels.map((item, index) => {
                  if (item != null) {
                    if (item.id == selectedSolarPanel) {
                      return item.outputs.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ));
                    }
                  }
                })}
              </Select>
            </FormControl>
          </Flex>

          <FormControl>
            <FormLabel htmlFor="quantidadeInversores">
              Quantidade de inversores
            </FormLabel>
            <Select
              {...register("quantidadeInversores", { required: true })}
              id="quantidadeInversores"
              name="quantidadeInversores"
              isInvalid={errors.quantidadeInversores}
              value="1"
            >
              <option value="1">1</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="modeloInversor1">
              Modelo do inversor 1
            </FormLabel>
            <Select
              {...register("modeloInversor1", { required: true })}
              id="modeloInversor1"
              name="modeloInversor1"
              placeholder="Selecione uma opção"
              isInvalid={errors.modeloInversor1}
            >
              {inverters.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.model}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            colorScheme={isDownloaded ? "green" : "blue"}
            isLoading={isLoading}
            rightIcon={isDownloaded ? undefined : <DownloadIcon />}
          >
            {isDownloaded ? <CheckIcon /> : "Gerar PDF"}
          </Button>
        </Grid>
      </Grid>
    </Flex>
  );
};

DuSimplificado.getLayout = function getLayout(page: ReactElement) {
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

export default DuSimplificado;
