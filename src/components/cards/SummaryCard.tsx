/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import type { ReactNode } from 'react'
import { Card, Text } from '@chakra-ui/react'

interface SummaryCardProps {
    value: string
    eyebrow: string
    detail?: ReactNode
    valueTone?: 'neutral' | 'positive' | 'negative'
}

const TONE: Record<NonNullable<SummaryCardProps['valueTone']>, string> = {
    neutral:  'ink.900',
    positive: 'brand.600',
    negative: 'red.500',
}

export function SummaryCard({ eyebrow, value, valueTone = 'neutral', detail }: SummaryCardProps) {
    return (
        <Card.Root variant="custom" p="5">
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="ink.400">
                {eyebrow}
            </Text>
            <Text fontVariantNumeric="tabular-nums" mt="2" fontFamily="display" fontSize="2xl" fontWeight="bold" color={TONE[valueTone]}>
                {value}
            </Text>
            <Text mt="3" borderTopWidth="1px" borderColor="gold.400/30" pt="2.5" fontSize="xs" color="ink.500">
                {detail}
            </Text>
        </Card.Root>
    )
}
