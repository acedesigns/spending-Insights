/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { Box, type BoxProps } from '@chakra-ui/react'

export function PageContainer(props: BoxProps) {
    return <Box mx={'auto'} w={'full'} maxW={'6xl'} px={{ base: '5', sm: '6', lg: '8' }} {...props} />
}
