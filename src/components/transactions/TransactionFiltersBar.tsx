/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { useEffect, useRef, useState } from 'react'
import { CATEGORY_LIST } from '../../data/categories'
import { Box, Flex, Input, NativeSelect } from '@chakra-ui/react'
import type { Account, CategoryId, TransactionFilters, TransactionType } from '../../types/spending'

const SEARCH_DEBOUNCE_MS = 300

interface TransactionFiltersBarProps {
    filters: TransactionFilters
    accounts: Account[]
    onChange: (filters: TransactionFilters) => void
}

const TYPE_OPTIONS: { value: TransactionType | 'all'; label: string }[] = [
    { value: 'all',    label: 'All types' },
    { value: 'debit',  label: 'Money out' },
    { value: 'credit', label: 'Money in' },
]

const selectFieldStyle = {
    borderColor: 'ink.200',
    bg: 'white',
    color: 'ink.900',
    fontSize: 'sm',
    _focusVisible: { borderColor: 'brand.500', boxShadow: '0 0 0 4px {colors.brand.100}' },
}

export function TransactionFiltersBar({ filters, accounts, onChange }: TransactionFiltersBarProps) {
    // Local, instant-typing state for the search box. `filters.search` comes from
    // URL-driven loader data, which round-trips through a (simulated) network
    // request on every update - pushing every keystroke straight to `onChange`
    // makes typing feel frozen because the controlled value only catches up
    // once the loader resolves. We debounce the upstream update instead.
    const [searchValue, setSearchValue] = useState(filters.search)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        setSearchValue(filters.search)
    }, [filters.search])

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    const handleSearchChange = (value: string) => {
        setSearchValue(value)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            onChange({ ...filters, search: value })
        }, SEARCH_DEBOUNCE_MS)
    }

    return (
        <Flex direction={{ base: 'column', sm: 'row' }} wrap={{ sm: 'wrap' }} align={{ sm: 'center' }} gap="3">

            {/* Search */}
            <Box position="relative" flex="1" minW={{ sm: '200px' }}>
                <label htmlFor="txn-search" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                    Search transactions
                </label>
                <Box
                    position="absolute"
                    left={3}
                    top="50%"
                    transform="translateY(-50%)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="20px"
                    h="20px"
                    color="ink.400"
                    pointerEvents="none"
                    zIndex={1}
                >
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                        <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </Box>
                <Input
                    id="txn-search"
                    type="search"
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search merchant or description"
                    w="full"
                    borderColor="ink.200"
                    bg="white"
                    py="2.5"
                    pl="9"
                    pr="4"
                    fontSize="sm"
                    color="ink.900"
                    _placeholder={{ color: 'ink.400' }}
                    _focusVisible={{ borderColor: 'brand.500', boxShadow: '0 0 0 4px {colors.brand.100}' }}
                />
            </Box>

            {/* Category */}
            <NativeSelect.Root w="auto" minW={{ sm: '160px' }} flexShrink={0}>
                <NativeSelect.Field
                    aria-label="Filter by category"
                    value={filters.categoryId}
                    onChange={(e) => onChange({ ...filters, categoryId: e.target.value as CategoryId | 'all' })}
                    {...selectFieldStyle}
                >
                    <option value="all">All categories</option>
                    {CATEGORY_LIST.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
            </NativeSelect.Root>

            {/* Account */}
            <NativeSelect.Root w="auto" minW={{ sm: '160px' }} flexShrink={0}>
                <NativeSelect.Field
                    aria-label="Filter by account"
                    value={filters.accountId}
                    onChange={(e) => onChange({ ...filters, accountId: e.target.value })}
                    {...selectFieldStyle}
                >
                    <option value="all">All accounts</option>
                    {accounts.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
            </NativeSelect.Root>

            {/* Type */}
            <NativeSelect.Root w="auto" minW={{ sm: '140px' }} flexShrink={0}>
                <NativeSelect.Field
                    aria-label="Filter by transaction type"
                    value={filters.type}
                    onChange={(e) => onChange({ ...filters, type: e.target.value as TransactionType | 'all' })}
                    {...selectFieldStyle}
                >
                    {TYPE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
            </NativeSelect.Root>
        </Flex>
    )
}
