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
import { Eye, EyeOff, Check } from 'lucide-react'
import type { ActionFunctionArgs } from 'react-router-dom'
import { Box, Button, chakra, Flex, Heading, Input, Link, Stack, Text } from '@chakra-ui/react'
import { Form, Link as RouterLink, useActionData, useNavigation, redirect } from 'react-router-dom'

interface ActionData {
    errors?: {
        name?: string
        email?: string
        password?: string
        confirm?: string
        general?: string
    }
}

export async function loader() {
    return null
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const name     = formData.get('name')     as string
    const email    = formData.get('email')    as string
    const password = formData.get('password') as string
    const confirm  = formData.get('confirm')  as string

    const errors: ActionData['errors'] = {}

    if (!name?.trim())
        errors.name = 'Full name is required'

    if (!email)
        errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errors.email = 'Enter a valid email address'

    if (!password)
        errors.password = 'Password is required'
    else if (password.length < 8)
        errors.password = 'Password must be at least 8 characters'

    if (password && confirm !== password)
        errors.confirm = 'Passwords do not match'

    if (Object.keys(errors).length) return { errors }

    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    }).catch(() => null)

    if (!res?.ok) return { errors: { general: 'Registration failed. Please try again.' } }

    return redirect('/login')
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

const errorInputStyle = {
    borderColor: 'red.400',
    _focusVisible: { borderColor: 'red.400', boxShadow: '0 0 0 4px {colors.red.100}' },
}

const labelStyle = {
    mb: '1.5',
    fontSize: 'sm',
    display: 'block',
    color: 'ink.700',
    fontWeight: 'medium',
}

export default function RegisterPage() {
    const navigation = useNavigation()
    const actionData = useActionData() as ActionData | undefined
    const submitting = navigation.state === 'submitting'
    const [showPw, setShowPw] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    return (
        <Flex minH={'100vh'}>

            {/* ── Left brand panel (desktop only) ── */}
            <Flex px={'12'} py={'14'} bgGradient={'to-br'} direction={'column'} gradientTo={'brand.900'} justify={'space-between'}
                gradientFrom={'brand.700'} w={{ lg: '5/12', xl: '1/2' }} display={{ base: 'none', lg: 'flex' }}>

                <SiteLogo variant="light" size="lg" />

                <Box>
                    <Heading as="h2" fontFamily="display" fontSize="4xl" fontWeight="extrabold"  letterSpacing="tight" color="white">
                        Open your account<br />in 2 minutes.
                    </Heading>
                    <Text mt="4" maxW="sm" fontSize="lg" lineHeight="relaxed" color="brand.100">
                        Join thousands of South Africans banking smarter — zero fees, instant EFT, and a card that works everywhere.
                    </Text>
                    <Stack as="ul" mt="10" gap="3">
                        {[
                            'No paperwork — just your SA ID',
                            'Zero monthly account fees, forever',
                            'Instant virtual card on sign-up',
                            'SARB regulated & POPIA compliant',
                        ].map((item) => (
                            <Flex as="li" key={item} align="center" gap="3" fontSize="sm" color="brand.100">
                                <Flex h="6" w="6" flexShrink="0" align="center" justify="center" borderRadius="full" bg="white/20">
                                    <Check size={13} />
                                </Flex>
                                {item}
                            </Flex>
                        ))}
                    </Stack>
                </Box>

                <Text fontSize="xs" color="brand.400">© 2026 aceMedia Bank · SARB regulated · POPIA compliant</Text>
            </Flex>

            {/* ── Right form panel ── */}
            <Flex flex="1" direction="column" align="center" justify="center" px="6" py="12" bg="ink.50">
                <Box w="full" maxW="md">

                    {/* Logo visible only on mobile */}
                    <Box mb="8" display={{ lg: 'none' }}>
                        <SiteLogo size="lg" />
                    </Box>

                    <Heading as="h1" fontFamily="display" fontSize="3xl" fontWeight="extrabold" color="ink.950">Create your account</Heading>
                    <Text mt="2" fontSize="sm" color="ink.500">Free forever. Open in under 2 minutes.</Text>

                    {actionData?.errors?.general && (
                        <Box mt="6" borderRadius="xl" bg="red.50" px="4" py="3" fontSize="sm" color="red.700" borderWidth="1px" borderColor="red.200">
                            {actionData.errors.general}
                        </Box>
                    )}

                    <Form method="post">
                        <Stack mt="8" gap="5">

                            {/* Full name */}
                            <Box>
                                <chakra.label htmlFor="name" {...labelStyle}>Full name</chakra.label>
                                <Input
                                    id={'name'}
                                    name={'name'}
                                    type={'text'}
                                    value={'Thandiwe Mokoena'}
                                    autoComplete={'name'}
                                    placeholder={'Thandiwe Mokoena'}
                                    {...inputStyle}
                                    {...(actionData?.errors?.name ? errorInputStyle : {})}
                                />
                                {actionData?.errors?.name && (
                                    <Text mt="1.5" fontSize="xs" color="red.600">{actionData.errors.name}</Text>
                                )}
                            </Box>

                            {/* Email */}
                            <Box>
                                <chakra.label htmlFor="email" {...labelStyle}>Email address</chakra.label>
                                <Input
                                    id={'email'}
                                    name={'email'}
                                    type={'email'}
                                    value={'thandiwe@gmail.com'}
                                    autoComplete={'email'}
                                    placeholder={'you@example.com'}
                                    {...inputStyle}
                                    {...(actionData?.errors?.email ? errorInputStyle : {})}
                                />
                                {actionData?.errors?.email && (
                                    <Text mt="1.5" fontSize="xs" color="red.600">{actionData.errors.email}</Text>
                                )}
                            </Box>

                            {/* Password */}
                            <Box>
                                <chakra.label htmlFor="password" {...labelStyle}>Password</chakra.label>
                                <Box position="relative" mt="1">
                                    <Input
                                        pr={'11'}
                                        {...inputStyle}
                                        id={'password'}
                                        name={'password'}
                                        value={'password'}
                                        autoComplete={'new-password'}
                                        placeholder={'Min. 8 characters'}
                                        type={showPw ? 'text' : 'password'}
                                        {...(actionData?.errors?.password ? errorInputStyle : {})}
                                    />
                                    <chakra.button
                                        right={'3'}
                                        top={'50%'}
                                        type={'button'}
                                        color={'ink.400'}
                                        position={'absolute'}
                                        transform={'translateY(-50%)'}
                                        _hover={{ color: 'ink.600' }}
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

                            {/* Confirm password */}
                            <Box>
                                <chakra.label htmlFor="confirm" {...labelStyle}>Confirm password</chakra.label>
                                <Box position="relative" mt="1">
                                    <Input
                                        pr={'11'}
                                        id={'confirm'}
                                        {...inputStyle}
                                        name={'confirm'}
                                        value={'password'}
                                        autoComplete={'new-password'}
                                        placeholder={'Re-enter password'}
                                        type={showConfirm ? 'text' : 'password'}
                                        {...(actionData?.errors?.confirm ? errorInputStyle : {})}
                                    />
                                    <chakra.button
                                        right={'3'}
                                        top={'50%'}
                                        type={'button'}
                                        color={'ink.400'}
                                        position={'absolute'}
                                        transform={'translateY(-50%)'}
                                        _hover={{ color: 'ink.600' }}
                                        onClick={() => setShowConfirm((v) => !v)}
                                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </chakra.button>
                                </Box>
                                {actionData?.errors?.confirm && (
                                    <Text mt="1.5" fontSize="xs" color="red.600">{actionData.errors.confirm}</Text>
                                )}
                            </Box>

                            <Text fontSize="xs" color="ink.500">
                                By creating an account you agree to our{' '}
                                <Link asChild fontWeight="medium" color="brand.600" _hover={{ color: 'brand.700' }}>
                                    <RouterLink to="#">Terms of Service</RouterLink>
                                </Link>
                                {' '} and{' '}
                                <Link asChild fontWeight="medium" color="brand.600" _hover={{ color: 'brand.700' }}>
                                    <RouterLink to="#">Privacy Policy</RouterLink>
                                </Link>.
                            </Text>

                            <Button
                                w={'full'}
                                type={'submit'}
                                variant={'solid'}
                                boxShadow={'soft'}
                                borderRadius={'xl'}
                                disabled={submitting}
                                colorPalette={'brand'}
                            >
                                {submitting ? 'Creating account … ' : 'Create free account'}
                            </Button>
                        </Stack>
                    </Form>

                    <Text mt="8" textAlign="center" fontSize="sm" color="ink.500">
                        Already have an account?{' '}
                        <Link asChild fontWeight="semibold" color="brand.600" _hover={{ color: 'brand.700' }}>
                            <RouterLink to="/login">Sign in</RouterLink>
                        </Link>
                    </Text>
                </Box>
            </Flex>
        </Flex>
    )
}
