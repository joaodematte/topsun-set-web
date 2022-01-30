import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const NotFound = () => {
  const router = useRouter();

  return (
    <Flex h="100vh" w="full" justifyContent="center" alignItems="center">
      <Box p={5}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Página não encontrada!</AlertTitle>
          <AlertDescription>
            <Button onClick={() => router.back()} colorScheme="red">
              <ChakraLink>Clique aqui para voltar.</ChakraLink>
            </Button>
          </AlertDescription>
        </Alert>
      </Box>
    </Flex>
  );
};

export default NotFound;
