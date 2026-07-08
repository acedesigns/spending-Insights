/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import React from 'react'
import { CATEGORIES } from '../data/categories'
import type { LoaderFunctionArgs } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import { fetchSpendingSnapshot, type SpendingSnapshot } from '../services/spendingService'
import { Box, Card, chakra, Flex, Heading, NativeSelect, SimpleGrid, Text } from '@chakra-ui/react'
import { formatCurrency, formatMonthLabel, formatPercentage, monthKeyFromDate } from '../utils/formatters'
import { computeCategoryTotals, computeMonthlyTotals, computeSummary, filterTransactions } from '../utils/analytics'
import { SiteLogo, TransactionTable, TransactionFiltersBar, SummaryCard, SpendingTrendChart, SpendingByCategoryChart } from '../components'


import type { CategoryId, CategoryTotal, MonthlyTotal, SpendingSummary, Transaction, TransactionFilters,
    TransactionType } from '../types/spending'

// ─── Loader ──────────────────────────────────────────────────────────────────
interface LoaderData {
    snapshot: SpendingSnapshot
    monthlyTotals: MonthlyTotal[]
    activeMonth: string | null
    monthTransactions: Transaction[]
    summary: SpendingSummary
    categoryTotals: CategoryTotal[]
    filteredTransactions: Transaction[]
    expenseChangePct: number | null
    filters: TransactionFilters
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderData> {

    const url = new URL(request.url)

    const snapshot = await fetchSpendingSnapshot()

    const monthlyTotals = computeMonthlyTotals(snapshot.transactions)

    const activeMonth = url.searchParams.get('month') ?? monthlyTotals.at(-1)?.month ?? null

    const monthTransactions = activeMonth
        ? snapshot.transactions.filter((t) => monthKeyFromDate(t.date) === activeMonth)
        : []

    const summary = computeSummary(
        monthTransactions,
        activeMonth ? formatMonthLabel(activeMonth) : '',
    )

    const categoryTotals = computeCategoryTotals(monthTransactions)

    const activeIndex = monthlyTotals.findIndex((m) => m.month === activeMonth)

    const previousMonthTotal = activeIndex > 0 ? monthlyTotals[activeIndex - 1] : null

    const expenseChangePct = previousMonthTotal && previousMonthTotal.expenses > 0
            ? ((summary.totalExpenses - previousMonthTotal.expenses) / previousMonthTotal.expenses) * 100 : null

    const search     = url.searchParams.get('search')   ?? ''

    const categoryId = (url.searchParams.get('category') ?? 'all') as CategoryId | 'all'

    const accountId  = url.searchParams.get('account')  ?? 'all'

    const type       = (url.searchParams.get('type')    ?? 'all') as TransactionType | 'all'

    const filters: TransactionFilters = { search, categoryId, accountId, type }

    const filteredTransactions = filterTransactions(monthTransactions, filters)

    return {
        snapshot,
        monthlyTotals,
        activeMonth,
        monthTransactions,
        summary,
        categoryTotals,
        filteredTransactions,
        expenseChangePct,
        filters,
    }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DashBoard(): React.JSX.Element {

    const {
        snapshot,
        monthlyTotals,
        activeMonth,
        monthTransactions,
        summary,
        categoryTotals,
        filteredTransactions,
        expenseChangePct,
        filters,
    } = useLoaderData() as LoaderData

    const [, setSearchParams] = useSearchParams()

    const setMonth = (month: string) => {
        setSearchParams((prev) => {
            prev.set('month', month)
            prev.delete('search')
            prev.delete('category')
            prev.delete('account')
            prev.delete('type')
            return prev
        })
    }

    const handleFiltersChange = (next: TransactionFilters) => {
        setSearchParams((prev) => {
            if (activeMonth) prev.set('month', activeMonth)
            next.search         ? prev.set('search',   next.search)         : prev.delete('search')
            next.categoryId !== 'all' ? prev.set('category', next.categoryId) : prev.delete('category')
            next.accountId  !== 'all' ? prev.set('account',  next.accountId)  : prev.delete('account')
            next.type       !== 'all' ? prev.set('type',     next.type)        : prev.delete('type')
            return prev
        })
    }

    const clearFilters = () => {
        setSearchParams((prev) => {
            if (activeMonth) prev.set('month', activeMonth)
            prev.delete('search')
            prev.delete('category')
            prev.delete('account')
            prev.delete('type')
            return prev
        })
    }

    const filtersKey = `${filters.search}-${filters.categoryId}-${filters.accountId}-${filters.type}-${activeMonth}`

    return (
        <Box minH="100vh" bg="ink.50" pb="16">

            {/* ── Dashboard header ── */}
            <Box top={'0'} as={'header'} zIndex={'40'} bg={'white/90'} boxShadow={'soft'}
                position={'sticky'} borderColor={'ink.100'} borderBottomWidth={'1px'} backdropFilter={'blur(12px)'}>
                <PageContainer>
                    <Flex h="16" align="center" justify="space-between">
                        <SiteLogo />

                        <Flex align="center" gap="4" fontSize="sm">
                            <Box display={{ base: 'none', sm: 'block' }} textAlign="right">
                                <Text fontSize="10px" textTransform="uppercase" letterSpacing="wider" color="ink.400">Period</Text>
                                <Text fontWeight="semibold" color="ink.900">{summary.periodLabel || '—'}</Text>
                            </Box>

                            <Box display={{ base: 'none', sm: 'block' }} h="8" w="px" bg="ink.100" />

                            <Box display={{ base: 'none', sm: 'block' }} textAlign="right">
                                <Text fontSize="10px" textTransform="uppercase" letterSpacing="wider" color="ink.400">As of</Text>
                                <Text fontVariantNumeric="tabular-nums" fontWeight="medium" color="ink.900">{snapshot.asOf}</Text>
                            </Box>

                            <Box display={{ base: 'none', sm: 'block' }} h="8" w="px" bg="ink.100" />

                            <Flex align="center" gap="2.5">
                                <Flex h="8" w="8" align="center" justify="center" borderRadius="full" bg="brand.100" fontFamily="display" fontSize="sm" fontWeight="bold" color="brand.700">
                                    A
                                </Flex>
                                <Text display={{ base: 'none', sm: 'block' }} fontSize="sm" fontWeight="medium" color="ink.700">
                                    Maqanda
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </PageContainer>
            </Box>

            <PageContainer as="main" py="8">

                {/* ── Page title + month picker ── */}
                <Flex mb="7" wrap="wrap" align="center" justify="space-between" gap="4">
                    <Box>
                        <Heading as="h1" fontFamily="display" fontSize="2xl" fontWeight="extrabold" letterSpacing="tight" color="ink.950">
                            Spending overview
                        </Heading>
                        <Text mt="1" fontSize="sm" color="ink.500">
                            All transactions and insights for your accounts
                        </Text>
                    </Box>

                    <Flex align="center" gap="2">
                        <chakra.label htmlFor="month-select" fontSize="sm" fontWeight="medium" color="ink.600">
                            Month
                        </chakra.label>
                        <NativeSelect.Root>
                            <NativeSelect.Field
                                id="month-select"
                                value={activeMonth ?? ''}
                                onChange={(e) => setMonth(e.target.value)}
                                borderColor="ink.200"
                                bg="white"
                                fontSize="sm"
                                color="ink.900"
                                _focusVisible={{ borderColor: 'brand.500', boxShadow: '0 0 0 4px {colors.brand.100}' }}
                            >
                                {monthlyTotals
                                    .slice()
                                    .reverse()
                                    .map((m) => (
                                        <option key={m.month} value={m.month}>
                                            {formatMonthLabel(m.month)}
                                        </option>
                                    ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Flex>
                </Flex>

                {/* ── Summary cards ── */}
                <SimpleGrid as="section" aria-label="Summary" columns={{ base: 1, sm: 2, lg: 4 }} gap="4">
                    <SummaryCard
                        eyebrow="Income"
                        value={formatCurrency(summary.totalIncome)}
                        valueTone="positive"
                        detail="Salary and other deposits this period"
                    />
                    <SummaryCard
                        eyebrow="Expenses"
                        value={formatCurrency(summary.totalExpenses)}
                        valueTone="negative"
                        detail={
                            expenseChangePct === null ? (
                                'No prior month to compare'
                            ) : (
                                <Text as="span">
                                    {expenseChangePct >= 0 ? 'Up' : 'Down'}{' '}
                                    {formatPercentage(Math.abs(expenseChangePct))} vs previous month
                                </Text>
                            )
                        }
                    />
                    <SummaryCard
                        eyebrow="Net cash flow"
                        value={formatCurrency(summary.netCashFlow)}
                        valueTone={summary.netCashFlow >= 0 ? 'positive' : 'negative'}
                        detail="Income less expenses this period"
                    />
                    <SummaryCard
                        eyebrow="Top category"
                        value={
                            summary.topCategory
                                ? CATEGORIES[summary.topCategory.categoryId].label
                                : '—'
                        }
                        detail={
                            summary.topCategory
                                ? `${formatCurrency(summary.topCategory.total)} · ${formatPercentage(summary.topCategory.percentageOfSpend)} of spend`
                                : 'No spend recorded'
                        }
                    />
                </SimpleGrid>

                {/* ── Charts ── */}
                <SimpleGrid as="section" aria-label="Charts" mt="6" columns={{ base: 1, lg: 5 }} gap="4">
                    <Card.Root variant="custom" p="6" gridColumn={{ lg: 'span 3' }}>
                        <Heading as="h2" fontFamily="display" fontSize="md" fontWeight="bold" color="ink.950">
                            Income vs expenses
                        </Heading>
                        <Text mb="4" fontSize="xs" color="ink.400">Last six months</Text>
                        <SpendingTrendChart data={monthlyTotals} />
                    </Card.Root>

                    <Card.Root variant="custom" p="6" gridColumn={{ lg: 'span 2' }}>
                        <Heading as="h2" fontFamily="display" fontSize="md" fontWeight="bold" color="ink.950">
                            Spend by category
                        </Heading>
                        <Text mb="4" fontSize="xs" color="ink.400">
                            {activeMonth ? formatMonthLabel(activeMonth) : ''}
                        </Text>
                        {categoryTotals.length === 0 ? (
                            <Text py="10" textAlign="center" fontSize="sm" color="ink.400">
                                No spend recorded this period.
                            </Text>
                        ) : (
                            <SpendingByCategoryChart data={categoryTotals} />
                        )}
                    </Card.Root>
                </SimpleGrid>

                {/* ── Transactions ── */}
                <Card.Root as="section" aria-label="Transactions" variant="custom" mt="6" p="6">
                    <Flex mb="5" wrap="wrap" align="center" justify="space-between" gap="3">
                        <Heading as="h2" fontFamily="display" fontSize="md" fontWeight="bold" color="ink.950">
                            Transactions
                        </Heading>
                        <Text fontSize="xs" color="ink.400">
                            {filteredTransactions.length} of {monthTransactions.length} shown
                        </Text>
                    </Flex>

                    <Box mb="5">
                        <TransactionFiltersBar
                            filters={filters}
                            accounts={snapshot.accounts}
                            onChange={handleFiltersChange}
                        />
                    </Box>

                    <TransactionTable
                        key={filtersKey}
                        transactions={filteredTransactions}
                        onClearFilters={clearFilters}
                    />
                </Card.Root>
            </PageContainer>
        </Box>
    )
}
