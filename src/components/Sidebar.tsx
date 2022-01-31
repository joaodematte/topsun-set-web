import {
  Box,
  VStack,
  Text,
  Link as ChakraLink,
  Heading,
  Grid,
  Flex,
  Button,
  Spacer,
  Avatar,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

import { sidebarLinks } from "../utils/sidebarLinks";

const Sidebar = () => {
  const { user, signOut } = useContext(UserContext);
  const router = useRouter();

  return (
    <Flex
      h="100vh"
      w={72}
      borderRight="2px"
      borderColor="gray.200"
      py={10}
      px={4}
      display={{ base: "none", md: "flex" }}
      direction="column"
      position="fixed"
      bg="white"
    >
      <Grid px={4} py={2} gap={5}>
        <Heading w="full" fontSize="4xl" fontWeight="extrabold">
          SET
        </Heading>
        {sidebarLinks.map((item, index) => (
          <VStack w="full" key={index}>
            <Text
              w="full"
              fontSize="sm"
              textTransform="uppercase"
              fontWeight={600}
              color="gray.500"
            >
              {item.title}
            </Text>
            {item.links.map((item, index) =>
              item.isLogout ? (
                <Button
                  key={index}
                  w="full"
                  borderRadius={5}
                  px={4}
                  py={2}
                  _hover={{ bg: "red.100", color: "red.600" }}
                  fontWeight={500}
                  color="gray.600"
                  onClick={() => signOut()}
                  justifyContent="flex-start"
                  disabled={item.isDisabled}
                >
                  <Flex alignItems="center">
                    {item.icon} <Text ml={4}>{item.title}</Text>
                  </Flex>
                </Button>
              ) : (
                <Link href={{ pathname: item.path }} passHref key={index}>
                  <ChakraLink
                    w="full"
                    borderRadius={5}
                    px={4}
                    py={2}
                    _hover={{ bg: "gray.200" }}
                    fontWeight={500}
                    color="gray.600"
                    bg={router.pathname === item.path ? "gray.200" : "white"}
                    justifyContent="flex-start"
                    disabled={item.isDisabled}
                  >
                    <Flex alignItems="center">
                      {item.icon} <Text ml={4}>{item.title}</Text>
                    </Flex>
                  </ChakraLink>
                </Link>
              )
            )}
          </VStack>
        ))}
      </Grid>
      <Spacer />
      <Flex w="full" alignItems="center" justifyContent="center">
        <Avatar size="md" name="Dan Abrahmov" src={user?.avatarUrl} />
        <Flex flexDirection="column" ml={5}>
          <Text fontWeight={500} color="gray.400" fontSize="sm">
            Bem-vindo,
          </Text>
          <Text fontWeight={500} color="gray.600">
            {user?.fullName}!
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
