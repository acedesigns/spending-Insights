/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { Box, Flex, Text } from '@chakra-ui/react'

interface HeaderProps {
  customerName: string;
  periodLabel: string;
  asOf: string;
}

export function Header({ customerName, periodLabel, asOf }: HeaderProps) {
  return (
    <Box as="header" borderBottomWidth="1px" borderColor="ink.100" bg="white">
      <Flex
          py={'5'}
          gap={'4'}
          mx={'auto'}
          maxW={'6xl'}
          align={{ sm: 'center' }}
          px={{ base: '4', sm: '6' }}
          justify={{ sm: 'space-between' }}
          direction={{ base: 'column', sm: 'row' }}
      >
        <Flex align="center" gap="3">
          <Flex h="9" w="9" align="center" justify="center" borderRadius="md" bg="ink.900" color="gold.400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 17 9 10 14 14 20 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Flex>
          <Box>
            <Text fontFamily="display" fontSize="md" fontWeight="semibold" letterSpacing="tight" color="ink.900">
              Spending Insights
            </Text>
            <Text fontSize="xs" color="ink.500">Statement for {customerName}</Text>
          </Box>
        </Flex>

        <Flex gap={'4'} fontSize={'sm'} align={'center'} borderColor={'ink.100'} pt={{ base: '3', sm: '0' }} borderTopWidth={{ base: '1px', sm: '0' }}>

          <Box textAlign="right">
            <Text fontSize="xs" textTransform="uppercase" letterSpacing="wide" color="ink.500">Period</Text>
            <Text fontWeight="medium" color="ink.900">{periodLabel}</Text>
          </Box>

          <Box aria-hidden="true" h="8" w="px" bg="ink.100" />

          <Box textAlign="right">
            <Text fontSize="xs" textTransform="uppercase" letterSpacing="wide" color="ink.500">As of</Text>
            <Text fontVariantNumeric="tabular-nums" fontWeight="medium" color="ink.900">{asOf}</Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
