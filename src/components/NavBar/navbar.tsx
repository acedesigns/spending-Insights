/* =======================================================
 *
 * Created by anele on 02/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { SiteLogo } from '../'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { PageContainer } from '../layout/PageContainer'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Button, Card, Flex, Link, Stack } from '@chakra-ui/react'

const links = [
    { label: 'Features', href: '#features' },
    { label: 'Security', href: '#security' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Support', href: '#support' },
]

export default function SiteNavbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const current = location.pathname.replace(/^\//, '') || 'home'

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const go = (path: string) => {
        setOpen(false)
        navigate(`/${path}`)
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }

    return (
        <Box
            top={'0'}
            zIndex={'50'}
            as={'header'}
            position={'sticky'}
            transition={'all 0.3s'}
            boxShadow={scrolled ? 'soft' : undefined }
            bg={scrolled ? 'white/85' : 'transparent'}
            backdropFilter={scrolled ? 'blur(12px)' : undefined}
        >
            <PageContainer>
                <Flex as="nav" h="16" align="center" justify="space-between">
                    <button onClick={() => go('home')} aria-label="aceMedia Bank home">
                        <SiteLogo />
                    </button>

                    <Flex display={{ base: 'none', md: 'flex' }} align="center" gap="8">
                        {links.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                fontSize={'sm'}
                                color={'ink.600'}
                                fontWeight={'medium'}
                                _hover={{ color: 'ink.900' }}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </Flex>

                    <Flex display={{ base: 'none', md: 'flex' }} align="center" gap="3">
                        <Box
                            as={'button'}
                            fontSize={'sm'}
                            fontWeight={'semibold'}
                            transition={'color 0.15s'}
                            _hover={{ color: 'ink.900' }}
                            onClick={() => go('login')}
                            color={current === 'login' ? 'ink.900' : 'ink.600'}
                        >
                            Sign in
                        </Box>

                        <Button
                            onClick={() => go('register')}
                            colorPalette="brand"
                            variant="solid"
                            borderRadius="xl"
                            boxShadow="soft"
                        >
                            Open account
                        </Button>
                    </Flex>

                    <Flex
                        h={'10'}
                        w={'10'}
                        as={'button'}
                        color={'ink.700'}
                        borderRadius={'lg'}
                        placeItems={'center'}
                        aria-label={'Toggle menu'}
                        _hover={{ bg: 'ink.100' }}
                        display={{ base: 'grid', md: 'none' }}
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </Flex>
                </Flex>
            </PageContainer>

            {open && (
                <Box display={{ md: 'none' }}>
                    <PageContainer pb="4">
                        <Card.Root variant="custom" asChild>
                            <Stack gap="1" p="3">
                                {links.map((l) => (
                                    <Link
                                        key={l.href}
                                        href={l.href}
                                        onClick={() => setOpen(false)}
                                        borderRadius="lg"
                                        px="3"
                                        py="2.5"
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="ink.700"
                                        _hover={{ bg: 'ink.50', textDecoration: 'none' }}
                                    >
                                        {l.label}
                                    </Link>
                                ))}
                                <Box my="2" h="px" bg="ink.100" />
                                <Box
                                    as="button"
                                    onClick={() => go('login')}
                                    borderRadius="lg"
                                    px="3"
                                    py="2.5"
                                    textAlign="left"
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    color="ink.800"
                                    _hover={{ bg: 'ink.50' }}
                                >
                                    Sign in
                                </Box>
                                <Button
                                    onClick={() => go('register')}
                                    colorPalette="brand"
                                    variant="solid"
                                    borderRadius="xl"
                                    boxShadow="soft"
                                    mt="1"
                                >
                                    Open account
                                </Button>
                            </Stack>
                        </Card.Root>
                    </PageContainer>
                </Box>
            )}
        </Box>
    )
}
