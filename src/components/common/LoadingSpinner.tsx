/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { Box, Text, VStack } from '@chakra-ui/react'

export function LoadingSpinner({ label = 'Loading your statement' }: { label?: string }) {
    return (
        <VStack role="status" minH="50vh" justify="center" gap="4" color="ink.400">
            <Box
                h="9"
                w="9"
                animation="spin"
                aria-hidden="true"
                borderRadius="full"
                borderWidth="2px"
                borderColor="ink.200"
                borderTopColor="brand.500"
            />
            <Text fontFamily="display" fontSize="sm" letterSpacing="wide">
                {label}&hellip;
            </Text>
        </VStack>
    )
}
