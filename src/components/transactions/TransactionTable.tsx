/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { useMemo, useState } from 'react'
import { ACCOUNTS } from '../../data/accounts'
import { EmptyState } from '../common/EmptyState'
import { CATEGORIES } from '../../data/categories'
import type { Transaction } from '../../types/spending'
import { formatDate, formatSignedCurrency } from '../../utils/formatters'
import { Box, Button, Flex, Span, Stack, Table, Text } from '@chakra-ui/react'

interface TransactionTableProps {
    transactions: Transaction[]
    onClearFilters: () => void
}

const PAGE_SIZE = 10

function accountName(accountId: string): string {
    return ACCOUNTS.find((a) => a.id === accountId)?.name ?? 'Account'
}

const pageButtonStyle = {
    px: '4',
    py: '2',
    bg: 'white',
    fontSize: 'sm',
    color: 'ink.800',
    borderWidth: '1px',
    fontWeight: 'medium',
    borderColor: 'ink.200',
    _hover: { bg: 'ink.50' },
    _disabled: { cursor: 'not-allowed', opacity: 0.4 },
}

export function TransactionTable({ transactions, onClearFilters }: TransactionTableProps) {
    const [page, setPage] = useState(0)

    const pageCount   = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE))
    const currentPage = Math.min(page, pageCount - 1)

    const pageItems = useMemo(
        () => transactions.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE),
        [transactions, currentPage],
    )

    if (transactions.length === 0) {
        return (
            <EmptyState
                title="No transactions match those filters"
                description="Try widening your search or clearing a filter to see more of your statement."
                action={{ label: 'Clear filters', onClick: onClearFilters }}
            />
        )
    }

    return (
        <Box>
            {/* Table — sm+ */}
            <Box display={{ base: 'none', sm: 'block' }} overflow="hidden" borderRadius="xl" borderWidth="1px" borderColor="ink.100">
                <Table.Root w="full" textAlign="left" fontSize="sm">
                    <Table.Header bg="ink.50" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="ink.400">
                        <Table.Row>
                            <Table.ColumnHeader px="4" py="3" fontWeight="semibold">Date</Table.ColumnHeader>
                            <Table.ColumnHeader px="4" py="3" fontWeight="semibold">Merchant</Table.ColumnHeader>
                            <Table.ColumnHeader px="4" py="3" fontWeight="semibold">Category</Table.ColumnHeader>
                            <Table.ColumnHeader px="4" py="3" fontWeight="semibold">Account</Table.ColumnHeader>
                            <Table.ColumnHeader px="4" py="3" textAlign="right" fontWeight="semibold">Amount</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body css={{ '& > tr': { borderTopWidth: '1px', borderColor: 'colors.ink.100' } }}>
                        {pageItems.map((txn) => {
                            const category = CATEGORIES[txn.categoryId]
                            return (
                                <Table.Row key={txn.id} bg="white" transition="background 0.15s" _hover={{ bg: 'ink.50/60' }}>
                                    <Table.Cell whiteSpace="nowrap" px="4" py="3.5" color="ink.500">
                                        {formatDate(txn.date)}
                                    </Table.Cell>
                                    <Table.Cell px="4" py="3.5">
                                        <Text fontWeight="medium" color="ink.900">{txn.merchant}</Text>
                                        {txn.status === 'pending' && (
                                            <Text fontSize="xs" color="gold.500">Pending</Text>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell px="4" py="3.5">
                                        <Span
                                            display="inline-flex"
                                            alignItems="center"
                                            gap="1.5"
                                            borderRadius="full"
                                            px="2.5"
                                            py="1"
                                            fontSize="xs"
                                            fontWeight="semibold"
                                            style={{ backgroundColor: `${category.color}1a`, color: category.color }}
                                        >
                                            {category.label}
                                        </Span>
                                    </Table.Cell>
                                    <Table.Cell px="4" py="3.5" color="ink.500">
                                        {accountName(txn.accountId)}
                                    </Table.Cell>
                                    <Table.Cell
                                        fontVariantNumeric="tabular-nums"
                                        whiteSpace="nowrap"
                                        px="4"
                                        py="3.5"
                                        textAlign="right"
                                        fontWeight="semibold"
                                        color={txn.type === 'credit' ? 'brand.600' : 'ink.900'}
                                    >
                                        {formatSignedCurrency(txn.amount, txn.type)}
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table.Root>
            </Box>

            {/* Card list — mobile */}
            <Stack as="ul" gap="2" display={{ base: 'flex', sm: 'none' }}>
                {pageItems.map((txn) => {
                    const category = CATEGORIES[txn.categoryId]
                    return (
                        <Box as="li" key={txn.id} borderWidth="1px" borderColor="ink.100" bg="white" borderRadius="xl" p="3.5">
                            <Flex align="flex-start" justify="space-between" gap="3">
                                <Box minW="0">
                                    <Text truncate fontWeight="medium" color="ink.900">
                                        {txn.merchant}
                                    </Text>
                                    <Text fontSize="xs" color="ink.400">
                                        {formatDate(txn.date)} · {accountName(txn.accountId)}
                                    </Text>
                                </Box>
                                <Text
                                    fontVariantNumeric="tabular-nums"
                                    flexShrink="0"
                                    fontWeight="semibold"
                                    color={txn.type === 'credit' ? 'brand.600' : 'ink.900'}
                                >
                                    {formatSignedCurrency(txn.amount, txn.type)}
                                </Text>
                            </Flex>
                            <Flex mt="2" align="center" gap="2">
                                <Span
                                    display="inline-flex"
                                    alignItems="center"
                                    gap="1.5"
                                    borderRadius="full"
                                    px="2.5"
                                    py="1"
                                    fontSize="xs"
                                    fontWeight="semibold"
                                    style={{ backgroundColor: `${category.color}1a`, color: category.color }}
                                >
                                    {category.label}
                                </Span>
                                {txn.status === 'pending' && (
                                    <Text fontSize="xs" color="gold.500">Pending</Text>
                                )}
                            </Flex>
                        </Box>
                    )
                })}
            </Stack>

            {/* Pagination */}
            <Flex mt="5" align="center" justify="space-between" fontSize="sm" color="ink.500">
                <Text>
                    Showing {currentPage * PAGE_SIZE + 1}–
                    {Math.min(transactions.length, (currentPage + 1) * PAGE_SIZE)} of{' '}
                    {transactions.length}
                </Text>
                <Flex gap="2">
                    <Button
                        type="button"
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        borderRadius="xl"
                        {...pageButtonStyle}
                    >
                        Previous
                    </Button>
                    <Button
                        type="button"
                        onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                        disabled={currentPage >= pageCount - 1}
                        borderRadius="xl"
                        {...pageButtonStyle}
                    >
                        Next
                    </Button>
                </Flex>
            </Flex>
        </Box>
    )
}
