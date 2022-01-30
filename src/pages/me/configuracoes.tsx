import {
  Avatar,
  Box,
  Button,
  Divider,
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
import { ReactElement, useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../context/UserContext";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";

const Configuracoes = () => {
  const { user, setLoggedUser } = useContext(UserContext);

  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: registerAvatar,
    handleSubmit: handleSubmitAvatar,
    formState: { errors: avatarErrors },
  } = useForm();

  useEffect(() => {
    reset(user);
  }, [user]);

  const handleChangeUserInfos = async (data: Object) => {
    Object.assign(data, { avatarUrl: user?.avatarUrl });

    setIsLoading(true);

    await api
      .post("/users/update", data)
      .then((res) => {
        setLoggedUser(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleChangeAvatar = async (data: any) => {
    const secureUrl = await api.get("/gets3url");
    const file = data.avatarImage[0];

    setIsAvatarLoading(true);

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
          setIsAvatarLoading(false);
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
              {...register("fullName", { required: true })}
              id="fullName"
              name="fullName"
              type="text"
              isInvalid={errors.fullname}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="username">Nome de usuário</FormLabel>
            <Input
              {...register("username", { required: true })}
              id="username"
              name="username"
              type="text"
              isInvalid={errors.username}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="email">Endereço de email</FormLabel>
            <Input
              {...register("email", {
                required: true,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Endereço de email em formato inválido",
                },
              })}
              id="email"
              name="email"
              type="text"
              isInvalid={errors.email}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Salvar
          </Button>
        </Grid>
        <Divider />
        <Grid gap={2}>
          <FormControl>
            <FormLabel htmlFor="password">Senha</FormLabel>
            <Input id="password" type="password" />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="password_confirm">
              Confirmação de senha
            </FormLabel>
            <Input id="password_confirm" type="password" />
          </FormControl>

          <Button colorScheme="blue">Salvar</Button>
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
              isInvalid={avatarErrors.avatarImage}
            />
          </FormControl>

          <Button
            isFullWidth
            type="submit"
            colorScheme="blue"
            isLoading={isAvatarLoading}
          >
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
