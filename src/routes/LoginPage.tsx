/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { useState } from 'react'
import { SiteLogo } from '../components'
import type { ActionFunctionArgs } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, Zap, TrendingUp } from 'lucide-react'
import { Box, Button, chakra, Flex, Heading, Input, Link, Stack, Text } from '@chakra-ui/react'
import { Form, Link as RouterLink, useActionData, useNavigation, redirect } from 'react-router-dom'

interface ActionData {
    errors?: {
        email?: string
        password?: string
        general?: string
    }
}

export async function loader() {
    return null
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const email    = formData.get('email') as string
    const password = formData.get('password') as string

    const errors: ActionData['errors'] = {}

    if (!email)
        errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errors.email = 'Enter a valid email address'

    if (!password)
        errors.password = 'Password is required'

    if (Object.keys(errors).length) return { errors }

    // TODO: replace with real auth
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    }).catch(() => null)

    if (!res?.ok) return { errors: { general: 'Invalid email or password.' } }

    return redirect('/dashboard')
}

const inputStyle = {
    mt: '1',
    px: '4',
    py: '3',
    w: 'full',
    bg: 'white',
    fontSize: 'sm',
    color: 'ink.900',
    borderRadius: 'xl',
    borderColor: 'ink.200',
    _placeholder: { color: 'ink.400' },
    _focusVisible: { borderColor: 'brand.500', boxShadow: '0 0 0 4px {colors.brand.100}' },
}

const labelStyle = {
    mb: '1.5',
    fontSize: 'sm',
    color: 'ink.700',
    display: 'block',
    fontWeight: 'medium',
}

export default function LoginPage() {
    const actionData = useActionData() as ActionData | undefined
    const navigation = useNavigation()
    const submitting = navigation.state === 'submitting'
    const [showPw, setShowPw] = useState(false)

    return (
        <Flex minH={'100vh'}>

            {/* ── Left brand panel (desktop only) ── */}
            <Flex
                px={'12'}
                py={'14'}
                bg={'ink.950'}
                direction={'column'}
                justify={'space-between'}
                w={{ lg: '5/12', xl: '1/2' }}
                display={{ base: 'none', lg: 'flex' }}
            >
                <SiteLogo variant={'light'} size={'lg'} />

                <Box>
                    <Heading as="h2" fontSize="4xl" color="white" fontFamily="display" fontWeight="extrabold">
                        Your money,<br />your rules.
                    </Heading>

                    <Text mt="4" maxW="sm" fontSize="lg" lineHeight="relaxed" color="ink.400">
                        Sign in to track spending, send money instantly, and stay on top of every rand.
                    </Text>

                    <Stack mt="10" gap="4">
                        {([
                            { Icon: ShieldCheck, text: 'Bank-grade 256-bit encryption' },
                            { Icon: Zap,         text: 'Instant transfers, zero waiting' },
                            { Icon: TrendingUp,  text: 'Smart insights on every transaction' },
                        ] as const).map(({ Icon, text }) => (
                            <Flex key={text} align="center" gap="3" fontSize="sm" color="ink.300">
                                <Flex h="8" w="8" flexShrink="0" align="center" justify="center" borderRadius="lg" bg="white/10" color="brand.400">
                                    <Icon size={15} />
                                </Flex>
                                {text}
                            </Flex>
                        ))}
                    </Stack>
                </Box>

                <Text fontSize="xs" color="ink.600">© 2026 aceMedia Bank · SARB regulated · POPIA compliant</Text>
            </Flex>

            {/* ── Right form panel ── */}
            <Flex flex="1" direction="column" align="center" justify="center" px="6" py="12" bg="ink.50">
                <Box w="full" maxW="md">

                    {/* Logo visible only on mobile */}
                    <Box mb="8" display={{ lg: 'none' }}>
                        <SiteLogo size="lg" />
                    </Box>

                    <Heading as="h1" fontFamily="display" fontSize="3xl" fontWeight="extrabold" color="ink.950">Welcome back</Heading>
                    <Text mt="2" fontSize="sm" color="ink.500">Sign in to your aceMedia Bank account</Text>

                    {actionData?.errors?.general && (
                        <Box mt="6" borderRadius="xl" bg="red.50" px="4" py="3" fontSize="sm" color="red.700" borderWidth="1px" borderColor="red.200">
                            {actionData.errors.general}
                        </Box>
                    )}

                    <Form method="post">
                        <Stack mt="8" gap="5">

                            {/* Email */}
                            <Box>
                                <chakra.label htmlFor="email" {...labelStyle}>Email address</chakra.label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    {...inputStyle}
                                    {...(actionData?.errors?.email
                                        ? { borderColor: 'red.400', _focusVisible: { borderColor: 'red.400', boxShadow: '0 0 0 4px {colors.red.100}' } }
                                        : {})}
                                />
                                {actionData?.errors?.email && (
                                    <Text mt="1.5" fontSize="xs" color="red.600">{actionData.errors.email}</Text>
                                )}
                            </Box>

                            {/* Password */}
                            <Box>
                                <Flex align="center" justify="space-between">
                                    <chakra.label htmlFor="password" {...labelStyle}>Password</chakra.label>
                                    <Link asChild fontSize="xs" fontWeight="medium" color="brand.600" _hover={{ color: 'brand.700' }}>
                                        <RouterLink to="#">Forgot password?</RouterLink>
                                    </Link>
                                </Flex>
                                <Box position="relative" mt="1">
                                    <Input
                                        pr={'11'}
                                        id={'password'}
                                        name={'password'}
                                        placeholder={'••••••••'}
                                        autoComplete={'current-password'}
                                        type={showPw ? 'text' : 'password'}
                                        {...inputStyle}
                                        {...(actionData?.errors?.password
                                            ? { borderColor: 'red.400', _focusVisible: { borderColor: 'red.400', boxShadow: '0 0 0 4px {colors.red.100}' } }
                                            : {})}
                                    />
                                    <chakra.button
                                        right={'3'}
                                        top={'50%'}
                                        type={'button'}
                                        color={'ink.400'}
                                        position={'absolute'}
                                        _hover={{ color: 'ink.600' }}
                                        transform={'translateY(-50%)'}
                                        onClick={() => setShowPw((v) => !v)}
                                        aria-label={showPw ? 'Hide password' : 'Show password'}
                                    >
                                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </chakra.button>
                                </Box>
                                {actionData?.errors?.password && (
                                    <Text mt="1.5" fontSize="xs" color="red.600">{actionData.errors.password}</Text>
                                )}
                            </Box>

                            <Button
                                w={'full'}
                                type={'submit'}
                                variant={'solid'}
                                boxShadow={'soft'}
                                borderRadius={'xl'}
                                disabled={submitting}
                                colorPalette={'brand'}
                            >
                                {submitting ? 'Signing in…' : 'Sign in'}
                            </Button>
                        </Stack>
                    </Form>

                    <Text mt="8" textAlign="center" fontSize="sm" color="ink.500">
                        Don't have an account?{' '}
                        <Link asChild fontWeight="semibold" color="brand.600" _hover={{ color: 'brand.700' }}>
                            <RouterLink to="/register">Open one free</RouterLink>
                        </Link>
                    </Text>
                </Box>
            </Flex>
        </Flex>
    )
}
