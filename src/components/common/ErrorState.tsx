/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <VStack role="alert" mx="auto" minH="50vh" maxW="md" justify="center" gap="4" textAlign="center">
      <Flex h="12" w="12" align="center" justify="center" borderRadius="full" bg="red.50" color="red.500">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 8v5m0 3.5h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Flex>
      <Heading as="h2" fontFamily="display" fontSize="lg" fontWeight="semibold" color="ink.900">
        Couldn't load your statement
      </Heading>
      <Text fontSize="sm" color="ink.500">{message}</Text>
      <Button
        type="button"
        onClick={onRetry}
        bg="ink.900"
        color="white"
        borderRadius="md"
        px="4"
        py="2"
        fontSize="sm"
        fontWeight="medium"
        _hover={{ bg: 'ink.950' }}
      >
        Try again
      </Button>
    </VStack>
  )
}
