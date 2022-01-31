import Link from "next/link";
import {
  Flex,
  FormControl,
  FormLabel,
  VStack,
  Input,
  Link as ChakraLink,
  Button,
  Text,
  FormHelperText,
  Heading,
} from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { parseCookies } from "nookies";
import { ReactElement, useContext, useRef } from "react";
import IndexRegisterLayout from "../layouts/IndexRegisterLayout";
import api from "../services/api";
import { UserContext } from "../context/UserContext";

const Registro = () => {
  const { signIn } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = useRef({});
  password.current = watch("password", "");

  const handleSignUp = async (data: any) => {
    await api
      .post("/users", data)
      .then(() => {
        signIn(data.username, data.password);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <VStack
      w={350}
      as="form"
      onSubmit={handleSubmit((data) => handleSignUp(data))}
      autoComplete="off"
    >
      <Heading fontSize="5xl" fontWeight="extrabold">
        Registro
      </Heading>
      <FormControl isInvalid={errors.fullName}>
        <FormLabel htmlFor="fullName">Nome completo</FormLabel>
        <Input
          {...register("fullName", { required: true })}
          id="fullName"
          type="text"
        />
      </FormControl>

      <FormControl isInvalid={errors.username}>
        <FormLabel htmlFor="username">Nome de usuário</FormLabel>
        <Input
          {...register("username", { required: true })}
          id="username"
          type="text"
        />
      </FormControl>

      <FormControl isInvalid={errors.email}>
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
          type="text"
        />
      </FormControl>

      <FormControl isInvalid={errors.password}>
        <FormLabel htmlFor="password">Senha</FormLabel>
        <Input
          {...register("password", { required: true })}
          id="password"
          type="password"
        />
      </FormControl>

      <FormControl isInvalid={errors.password_confirm}>
        <FormLabel htmlFor="password_confirm">Confirmação de senha</FormLabel>
        <Input
          {...register("password_confirm", {
            required: true,
            validate: (value) =>
              value === password.current || "As senhas não conferem",
          })}
          id="password_confirm"
          type="password"
        />
      </FormControl>

      <FormControl isInvalid={errors.security_token}>
        <FormLabel htmlFor="security_token">Token de segurança</FormLabel>
        <Input
          {...register("security_token", { required: true })}
          id="security_token"
          type="password"
        />
        <FormHelperText>
          Peça esse token para algum engenheiro registrado.
        </FormHelperText>
      </FormControl>

      <Button
        colorScheme="blue"
        w="100%"
        type="submit"
        rightIcon={<ArrowForwardIcon />}
      >
        Registrar
      </Button>

      <Link href="/" passHref>
        <ChakraLink fontSize="sm">Voltar à página de login</ChakraLink>
      </Link>
    </VStack>
  );
};

Registro.getLayout = function getLayout(page: ReactElement) {
  return <IndexRegisterLayout>{page}</IndexRegisterLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["topsunauth.token"]: token } = parseCookies(ctx);

  if (token) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default Registro;
