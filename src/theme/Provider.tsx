/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { system } from './system'
import type { ReactNode } from 'react'
import { ChakraProvider } from '@chakra-ui/react'

export function Provider({ children }: { children: ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>
}
