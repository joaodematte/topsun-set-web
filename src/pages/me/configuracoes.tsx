import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";
import { ReactElement, useContext } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../context/UserContext";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";

const Configuracoes = () => {
  const { user, setLoggedUser } = useContext(UserContext);

  const { register, handleSubmit } = useForm();
  const { register: registerAvatar, handleSubmit: handleSubmitAvatar } =
    useForm();

  const handleChangeUserInfos = async (data: Object) => {
    Object.assign(data, { avatarUrl: user?.avatarUrl });

    console.log(data);

    await api
      .post("/users/update", data)
      .then((res) => {
        setLoggedUser(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleChangeAvatar = async (data: any) => {
    const secureUrl = await api.get("/gets3url");
    const file = data.avatarImage[0];

    await fetch(secureUrl.data.url, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: file,
    }).then(async (res) => {
      const imageUrl = secureUrl.data.url.split("?")[0];
      await api
        .post("/users/update", {
          fullName: user?.fullName,
          username: user?.username,
          email: user?.email,
          avatarUrl: imageUrl,
        })
        .then((res) => {
          setLoggedUser(res.data);
        });
    });
  };

  return (
    <Flex gap={10} flexDirection={{ base: "column", md: "row" }}>
      <Head>
        <title>SET | Configurações</title>
      </Head>
      <Grid
        bg="white"
        p={5}
        gap={5}
        borderRadius={5}
        onSubmit={handleSubmit((data) => console.log(data))}
        h="fit-content"
      >
        <Heading fontWeight="extrabold">Configurações do usuário</Heading>
        <Grid as="form" gap={2} onSubmit={handleSubmit(handleChangeUserInfos)}>
          <FormControl>
            <FormLabel htmlFor="fullName">Nome completo</FormLabel>
            <Input
              {...register("fullName")}
              id="fullName"
              type="text"
              defaultValue={user?.fullName}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="username">Nome de usuário</FormLabel>
            <Input
              {...register("username")}
              id="username"
              type="text"
              defaultValue={user?.username}
              disabled
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="email">Endereço de email</FormLabel>
            <Input
              {...register("email")}
              id="email"
              type="text"
              defaultValue={user?.email}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue">
            Salvar
          </Button>
        </Grid>
      </Grid>

      <Flex
        bg="white"
        p={5}
        gap={5}
        borderRadius={5}
        h="fit-content"
        flexDirection="column"
        alignItems="center"
      >
        <Heading w="full" fontWeight="extrabold">
          Alterar avatar
        </Heading>
        <Avatar size="2xl" src={user?.avatarUrl} />
        <Grid
          gap={2}
          w="full"
          as="form"
          onSubmit={handleSubmitAvatar(handleChangeAvatar)}
        >
          <FormControl>
            <FormLabel htmlFor="avatarImage">Selecione o arquivo</FormLabel>
            <Input
              {...registerAvatar("avatarImage", { required: true })}
              type="file"
              id="avatarImage"
            />
          </FormControl>

          <Button isFullWidth type="submit" colorScheme="blue">
            Salvar
          </Button>
        </Grid>
      </Flex>
    </Flex>
  );
};

Configuracoes.getLayout = function getLayout(page: ReactElement) {
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

export default Configuracoes;
