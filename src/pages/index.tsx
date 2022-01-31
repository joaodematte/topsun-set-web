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
  Heading,
} from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { ReactElement, useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { parseCookies } from "nookies";
import IndexRegisterLayout from "../layouts/IndexRegisterLayout";
import Head from "next/head";

const Home = () => {
  const { signIn } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignIn = (username: string, password: string) => {
    setIsLoading(true);
    signIn(username, password)
      .then((res) => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setIsLoading(false);
      });
  };

  return (
    <VStack
      w={350}
      as="form"
      onSubmit={handleSubmit((data) =>
        handleSignIn(data.username, data.password)
      )}
      autoComplete="off"
    >
      <Head>
        <title>SET | Login</title>
      </Head>
      <Heading fontSize="5xl" fontWeight="extrabold">
        SET
      </Heading>
      <FormControl isInvalid={errors.username}>
        <FormLabel htmlFor="username">Nome de usuário</FormLabel>
        <Input
          {...register("username", { required: true })}
          id="username"
          type="text"
        />
      </FormControl>

      <FormControl isInvalid={errors.username}>
        <FormLabel htmlFor="password">Senha</FormLabel>
        <Input
          {...register("password", { required: true })}
          id="password"
          type="password"
        />
      </FormControl>

      <Button
        colorScheme="blue"
        w="100%"
        type="submit"
        rightIcon={<ArrowForwardIcon />}
        isLoading={isLoading}
      >
        Logar
      </Button>

      <Link href="/registro" passHref>
        <ChakraLink fontSize="sm">Registre-se</ChakraLink>
      </Link>
    </VStack>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
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

export default Home;
