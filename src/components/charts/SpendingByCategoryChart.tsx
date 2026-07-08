/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { CATEGORIES } from '../../data/categories'
import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import type { CategoryTotal } from '../../types/spending'
import { formatCurrency, formatPercentage } from '../../utils/formatters'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

interface SpendingByCategoryChartProps {
  data: CategoryTotal[];
}

function ChartTooltip({active, payload,}: { active?: boolean; payload?: { payload: CategoryTotal }[]; }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  const category = CATEGORIES[item.categoryId];

  return (
    <Box borderWidth="1px" borderColor="ink.100" bg="white" px="3" py="2.5" fontSize="xs" borderRadius="xl" boxShadow="soft">
      <Text fontWeight="semibold" color="ink.900">{category.label}</Text>
      <Text fontVariantNumeric="tabular-nums" color="ink.500">
        {formatCurrency(item.total)} &middot; {formatPercentage(item.percentageOfSpend)}
      </Text>
    </Box>
  );
}

export function SpendingByCategoryChart({ data }: SpendingByCategoryChartProps) {
  const top = data.slice(0, 6);

  return (
    <Flex direction={{ base: 'column', sm: 'row' }} align={{ sm: 'center' }} gap="4">
      <Box h="56" w={{ base: 'full', sm: '1/2' }} role="img" aria-label="Spend by category, donut chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={top}
              dataKey="total"
              nameKey="categoryId"
              innerRadius={56}
              outerRadius={82}
              paddingAngle={2}
              stroke="none"
            >
              {top.map((entry) => (
                <Cell key={entry.categoryId} fill={CATEGORIES[entry.categoryId].color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Stack flex="1" gap="2.5" as="ul">
        {top.map((entry) => {
          const category = CATEGORIES[entry.categoryId];
          return (
            <Flex key={entry.categoryId} as="li" align="center" justify="space-between" gap="3" fontSize="sm">
              <Flex minW="0" align="center" gap="2">
                <Box aria-hidden="true" h="2.5" w="2.5" flexShrink="0" borderRadius="full" style={{ backgroundColor: category.color }} />
                <Text truncate color="ink.900">{category.label}</Text>
              </Flex>
              <Text flexShrink="0" fontVariantNumeric="tabular-nums" color="ink.500">
                {formatPercentage(entry.percentageOfSpend)}
              </Text>
            </Flex>
          );
        })}
      </Stack>
    </Flex>
  )
}
