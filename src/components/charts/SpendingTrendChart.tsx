/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { Box, Flex, Text } from '@chakra-ui/react'
import type { MonthlyTotal } from '../../types/spending'
import { formatCurrencyCompact, formatMonthLabel } from '../../utils/formatters'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts'

interface SpendingTrendChartProps {
    data: MonthlyTotal[]
}

interface TooltipPayloadItem {
    dataKey: string
    value: number
    color: string
}

function ChartTooltip({active, payload, label,}: {
    active?: boolean
    payload?: TooltipPayloadItem[]
    label?: string
}) {
    if (!active || !payload?.length) return null

    return (
        <Box borderWidth="1px" borderColor="ink.100" bg="white" px="3" py="2.5" fontSize="xs" borderRadius="xl" boxShadow="soft">
            <Text mb="1.5" fontWeight="semibold" color="ink.900">
                {label ? formatMonthLabel(label) : ''}
            </Text>
            {payload.map((item) => (
                <Flex key={item.dataKey} align="center" gap="2" fontVariantNumeric="tabular-nums" color="ink.500">
                    <Box aria-hidden="true" h="2" w="2" borderRadius="full" style={{ backgroundColor: item.color }} />
                    {item.dataKey === 'income' ? 'Income' : 'Expenses'}:{' '}
                    {formatCurrencyCompact(item.value)}
                </Flex>
            ))}
        </Box>
    )
}

export function SpendingTrendChart({ data }: SpendingTrendChartProps) {
    return (
        <Box h="72" w="full" role="img" aria-label="Monthly income versus expenses, bar chart">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barGap={6}>
                    <CartesianGrid stroke="#e9eef4" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={{ stroke: '#e9eef4' }}
                        tickFormatter={formatMonthLabel}
                        tick={{ fill: '#56719a', fontSize: 12 }}
                    />
                    <YAxis
                        width={64}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#56719a', fontSize: 12 }}
                        tickFormatter={(v: number) => formatCurrencyCompact(v)}
                    />

                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(16,185,129,0.06)' }}/>

                    <Legend
                        iconSize={8}
                        iconType="circle"
                        formatter={(value: string) => (
                            <Text as="span" fontSize="xs" color="ink.500">
                                {value === 'income' ? 'Income' : 'Expenses'}
                            </Text>
                        )}
                    />
                    <Bar dataKey="income"   fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={22} />
                    <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={22} />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    )
}
