/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { SiteNavbar } from '../components'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { Box, Button, Card, Flex, Heading, SimpleGrid, Span, Stack, Text } from '@chakra-ui/react'
import { ArrowRight, Smartphone, ShieldCheck, Zap, Wallet, TrendingUp, Users, Check, Star, Lock, Fingerprint, Bell, Quote,} from 'lucide-react'


const features = [
    {
        icon: Smartphone,
        title: 'Bank from your pocket',
        desc: 'Open accounts, send money, and pay bills in seconds — all from the aceMedia app, built for every South African phone.',
    },
    {
        icon: Zap,
        title: 'Instant EFT & payments',
        desc: 'Send and receive money instantly to any South African bank. No waiting, no clearing delays, no hidden fees.',
    },
    {
        icon: ShieldCheck,
        title: 'Bank-grade security',
        desc: 'Biometric login, one-time PINs, and real-time fraud monitoring keep every cent safe — 24/7.',
    },
    {
        icon: TrendingUp,
        title: 'Grow your money',
        desc: 'Earn competitive interest on every balance and access fixed deposits starting from R100.',
    },
];

const stats = [
    {value: 'R0', label: 'Monthly account fees'},
    {value: '2 min', label: 'To open an account'},
    {value: '24/7', label: 'Fraud monitoring'},
    {value: '4.9★', label: 'App store rating'},
];

const plans = [
    {
        name: 'Everyday',
        price: 'R0',
        period: '/month',
        tagline: 'Everything you need to bank smart.',
        features: ['Zero monthly fees', 'Free instant EFT', 'Free debit card', 'Tap-to-pay & QR', '24/7 support'],
        cta: 'Open Everyday',
        highlight: false,
    },
    {
        name: 'Premium',
        price: 'R99',
        period: '/month',
        tagline: 'For those who want more.',
        features: [
            'Everything in Everyday',
            '1.5% above prime savings',
            'Unlimited free transfers',
            'Priority human support',
            'Travel insurance included',
            '2 free ATM withdrawals',
        ],
        cta: 'Go Premium',
        highlight: true,
    },
    {
        name: 'Business',
        price: 'R199',
        period: '/month',
        tagline: 'Banking for your business.',
        features: ['Multi-user access', 'Bulk payments', 'Invoicing tools', 'Accounting integrations', 'Dedicated manager'],
        cta: 'Start Business',
        highlight: false,
    },
];

const testimonials = [
    {
        quote:
            'I opened my account during my lunch break in Sandton. No paperwork, no queues — just my ID and a selfie. Brilliant.',
        name: 'Thandiwe M.',
        role: 'Teacher, Johannesburg',
    },
    {
        quote:
            'The instant EFT saved me when paying my supplier in Cape Town. Money was there before I put my phone down.',
        name: 'Sipho N.',
        role: 'Small business owner, Durban',
    },
    {
        quote:
            'Finally a bank that gets South Africans. The app works even on my old phone with slow data. That matters here.',
        name: 'Aisha P.',
        role: 'Nurse, Pretoria',
    },
];

export async function loader() {

}

export async function action() {

}

export default function LandingPage() {
    const navigate = useNavigate()
    const [time, setTime] = useState(new Date().toLocaleTimeString())

    const go = (path: string) => {
        navigate(`/${path}`)
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date().toLocaleTimeString())
        }, 1000)

        return () => clearInterval(timerId)
    }, [])

    return (
        <Flex minH="100vh" direction="column">
            <SiteNavbar />
            <Box>
                {/* Hero */}
                <Box as="section" position="relative" overflow="hidden" bgGradient="to-b" gradientFrom="ink.50" gradientVia="white" gradientTo="ink.50">
                    <Box pointerEvents="none" position="absolute" inset="0">
                        <Box position="absolute" right="-24" top="-24" h="96" w="96" borderRadius="full" bg="brand.200/40" filter="blur(64px)" />
                        <Box position="absolute" left="-32" top="40" h="80" w="80" borderRadius="full" bg="gold.400/20" filter="blur(64px)" />
                    </Box>

                    <SimpleGrid position="relative" columns={{ base: 1, lg: 2 }} alignItems="center" gap="12" py={{ base: '16', lg: '24' }}>
                        <Box animation="fadeUp" px={{ base: '5', sm: '6', lg: '8' }}>
                            <Span display="inline-flex" alignItems="center" gap="2" borderRadius="full" bg="brand.100" px="3" py="1" fontSize="xs" fontWeight="semibold" color="brand.700">
                                <Box position="relative" display="flex" h="2" w="2">
                                    <Box position="absolute" display="inline-flex" h="full" w="full" animation="pulseRing" borderRadius="full" bg="brand.500" />
                                    <Box position="relative" display="inline-flex" h="2" w="2" borderRadius="full" bg="brand.600" />
                                </Box>
                                Now live across South Africa
                            </Span>

                            <Heading as="h1" mt="5" fontFamily="display" fontSize={{ base: '4xl', sm: '5xl', lg: '6xl' }} fontWeight="extrabold" lineHeight="1.1" letterSpacing="tight" color="ink.950">
                                Banking that moves at <Span color="brand.600">your pace.</Span>
                            </Heading>

                            <Text mt="5" maxW="lg" fontSize="lg" lineHeight="relaxed" color="ink.600">
                                Open a free aceMedia Bank account in two minutes. Instant EFT, zero monthly fees,
                                and an app built for every corner of Mzansi — from Sandton to Mthatha.
                            </Text>

                            <Stack mt="8" direction={{ base: 'column', sm: 'row' }} gap="3">
                                <Button onClick={() => go('register')} colorPalette="brand" variant="solid" borderRadius="xl" boxShadow="soft">
                                    Open your account
                                    <ArrowRight size={18} />
                                </Button>

                                <Button onClick={() => go('login')} colorPalette="ink" variant="outline" borderRadius="xl">
                                    I already have an account
                                </Button>
                            </Stack>

                            <Flex mt="8" wrap="wrap" align="center" gapX="6" gapY="2" fontSize="sm" color="ink.500">
                                <Flex align="center" gap="1.5"><Check size={16} color="var(--chakra-colors-brand-600)" /> No paperwork</Flex>
                                <Flex align="center" gap="1.5"><Check size={16} color="var(--chakra-colors-brand-600)" /> SARB regulated</Flex>
                                <Flex align="center" gap="1.5"><Check size={16} color="var(--chakra-colors-brand-600)" /> POPIA compliant</Flex>
                            </Flex>
                        </Box>

                        {/* Phone mockup */}
                        <Box position="relative" mx="auto" w="full" maxW={{ base: 'sm', lg: 'md' }} animation="fadeUp" px={{ base: '5', sm: '6', lg: '8' }}>
                            <Box position="relative" animation="float">
                                <Box borderRadius="2.5rem" bg="ink.950" p="3" boxShadow="2xl" borderWidth="1px" borderColor="ink.900/10">
                                    <Box overflow="hidden" borderRadius="2rem" bg="white">
                                        <Box bgGradient="to-br" gradientFrom="ink.900" gradientTo="ink.950" px="6" pb="8" pt="6" color="white">
                                            <Flex align="center" justify="space-between" fontSize="xs" color="ink.300">
                                                <Text as="span">{time}</Text>
                                                <Text as="span">aceMedia</Text>
                                            </Flex>
                                            <Text mt="6" fontSize="xs" color="ink.300">Available balance</Text>
                                            <Text mt="1" fontFamily="display" fontSize="3xl" fontWeight="bold">R 12,480.50</Text>
                                            <Flex mt="4" gap="2">
                                                <Span borderRadius="md" bg="white/10" px="2" py="1" fontSize="10px" fontWeight="medium">•••• 4821</Span>
                                                <Span borderRadius="md" bg="brand.500/20" px="2" py="1" fontSize="10px" fontWeight="medium" color="brand.300">VISA</Span>
                                            </Flex>
                                        </Box>
                                        <Stack gap="3" p="5">
                                            {[
                                                {icon: TrendingUp, label: 'Salary — Capitec', amount: '+ R 18,500.00', pos: true},
                                                {icon: Wallet, label: 'Pick n Pay', amount: '- R 432.10', pos: false},
                                                {icon: Zap, label: 'EFT to S. Dlamini', amount: '- R 1,200.00', pos: false},
                                            ].map((t) => (
                                                <Flex key={t.label} align="center" gap="3">
                                                    <Flex h="9" w="9" placeItems="center" borderRadius="lg" bg="ink.100" color="ink.600">
                                                        <t.icon size={16}/>
                                                    </Flex>
                                                    <Box flex="1">
                                                        <Text fontSize="xs" fontWeight="semibold" color="ink.900">{t.label}</Text>
                                                        <Text fontSize="11px" color="ink.400">Today</Text>
                                                    </Box>
                                                    <Text fontSize="xs" fontWeight="semibold" color={t.pos ? 'brand.600' : 'ink.700'}>
                                                        {t.amount}
                                                    </Text>
                                                </Flex>
                                            ))}
                                        </Stack>
                                    </Box>
                                </Box>
                                <Box
                                    display={{ base: 'none', sm: 'block' }}
                                    position="absolute"
                                    right="-4"
                                    top="10"
                                    animation="float"
                                    borderRadius="2xl"
                                    bg="white"
                                    p="3"
                                    boxShadow="glow"
                                    borderWidth="1px"
                                    borderColor="brand.100"
                                    style={{animationDelay: '1s'}}
                                >
                                    <Flex align="center" gap="2">
                                        <Flex h="8" w="8" placeItems="center" borderRadius="lg" bg="brand.100" color="brand.700">
                                            <ShieldCheck size={16}/>
                                        </Flex>
                                        <Box>
                                            <Text fontSize="11px" fontWeight="bold" color="ink.900">Fraud blocked</Text>
                                            <Text fontSize="10px" color="ink.500">Just now</Text>
                                        </Box>
                                    </Flex>
                                </Box>
                            </Box>
                        </Box>
                    </SimpleGrid>

                    {/* Stats bar */}
                    <Box borderTopWidth="1px" borderBottomWidth="1px" borderColor="ink.100" bg="white/60" backdropFilter="blur(8px)">
                        <PageContainer>
                            <SimpleGrid columns={{ base: 2, sm: 4 }} gap="6" py="8">
                                {stats.map((s) => (
                                    <Box key={s.label} textAlign="center">
                                        <Text fontFamily="display" fontSize={{ base: '2xl', sm: '3xl' }} fontWeight="extrabold" color="ink.950">{s.value}</Text>
                                        <Text mt="1" fontSize={{ base: 'xs', sm: 'sm' }} fontWeight="medium" color="ink.500">{s.label}</Text>
                                    </Box>
                                ))}
                            </SimpleGrid>
                        </PageContainer>
                    </Box>
                </Box>

                {/* Features */}
                <PageContainer as="section" id="features" py={{ base: '20', lg: '28' }}>
                    <Box mx="auto" maxW="2xl" textAlign="center">
                        <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="brand.600">Why aceMedia</Text>
                        <Heading as="h2" mt="3" fontFamily="display" fontSize={{ base: '3xl', sm: '4xl' }} fontWeight="extrabold" letterSpacing="tight" color="ink.950">
                            Everything you need. Nothing you don't.
                        </Heading>
                        <Text mt="4" fontSize="lg" color="ink.600">
                            We rebuilt banking from the ground up for South Africans — fast, fair, and refreshingly
                            simple.
                        </Text>
                    </Box>

                    <SimpleGrid mt="14" columns={{ base: 1, sm: 2, lg: 4 }} gap="6">
                        {features.map((f, i) => (
                            <Card.Root key={f.title} variant="custom" p="6" transition="all 0.3s" style={{animationDelay: `${i * 80}ms`}}
                                _hover={{ transform: 'translateY(-4px)', boxShadow: 'glow' }}
                            >
                                <Flex h="12" w="12" placeItems="center" borderRadius="xl" bg="brand.50" color="brand.600">
                                    <f.icon size={22}/>
                                </Flex>
                                <Heading as="h3" mt="5" fontFamily="display" fontSize="lg" fontWeight="bold" color="ink.950">{f.title}</Heading>
                                <Text mt="2" fontSize="sm" lineHeight="relaxed" color="ink.600">{f.desc}</Text>
                            </Card.Root>
                        ))}
                    </SimpleGrid>
                </PageContainer>

                {/* Security band */}
                <Box as="section" id="security" bg="ink.950" py={{ base: '20', lg: '28' }} color="white">
                    <PageContainer>
                        <SimpleGrid columns={{ base: 1, lg: 2 }} alignItems="center" gap="12">
                            <Box>
                                <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="brand.400">Security first</Text>
                                <Heading as="h2" mt="3" fontFamily="display" fontSize={{ base: '3xl', sm: '4xl' }} fontWeight="extrabold" letterSpacing="tight">
                                    Your money, protected at every step.
                                </Heading>
                                <Text mt="4" maxW="lg" fontSize="lg" color="ink.300">
                                    We use the same encryption trusted by South Africa's biggest banks — plus biometric
                                    login and real-time fraud alerts that put you in control.
                                </Text>
                                <Stack mt="8" gap="4">
                                    {[
                                        {
                                            icon: Fingerprint,
                                            title: 'Biometric login',
                                            desc: 'Face or fingerprint — no passwords to forget.'
                                        },
                                        {
                                            icon: Lock,
                                            title: '256-bit encryption',
                                            desc: 'Every transaction encrypted end-to-end.'
                                        },
                                        {
                                            icon: Bell,
                                            title: 'Instant alerts',
                                            desc: 'Know the moment money moves in or out.'
                                        },
                                    ].map((s) => (
                                        <Flex key={s.title} align="flex-start" gap="4">
                                            <Flex h="11" w="11" flexShrink="0" placeItems="center" borderRadius="xl" bg="white/10" color="brand.400">
                                                <s.icon size={20}/>
                                            </Flex>
                                            <Box>
                                                <Text fontWeight="semibold" color="white">{s.title}</Text>
                                                <Text fontSize="sm" color="ink.400">{s.desc}</Text>
                                            </Box>
                                        </Flex>
                                    ))}
                                </Stack>
                            </Box>

                            <Box position="relative">
                                <Card.Root variant="custom" mx="auto" maxW="sm" bg="ink.900" p="8" borderColor="ink.800">
                                    <Flex align="center" justify="space-between">
                                        <ShieldCheck size={28} color="var(--chakra-colors-brand-400)"/>
                                        <Span borderRadius="full" bg="brand.500/15" px="3" py="1" fontSize="xs" fontWeight="semibold" color="brand.300">Protected</Span>
                                    </Flex>
                                    <Text mt="6" fontFamily="display" fontSize="xl" fontWeight="bold" color="white">Account safety score</Text>
                                    <Flex mt="4" align="flex-end" gap="2">
                                        <Text as="span" fontFamily="display" fontSize="5xl" fontWeight="extrabold" color="brand.400">98</Text>
                                        <Text as="span" mb="2" color="ink.400">/ 100</Text>
                                    </Flex>
                                    <Box mt="4" h="2" overflow="hidden" borderRadius="full" bg="ink.800">
                                        <Box h="full" w="98%" borderRadius="full" bgGradient="to-r" gradientFrom="brand.500" gradientTo="brand.400" />
                                    </Box>
                                    <Stack as="ul" mt="6" gap="2" fontSize="sm" color="ink.300">
                                        <Flex as="li" align="center" gap="2"><Check size={15} color="var(--chakra-colors-brand-400)"/> Biometric enabled</Flex>
                                        <Flex as="li" align="center" gap="2"><Check size={15} color="var(--chakra-colors-brand-400)"/> 2FA active</Flex>
                                        <Flex as="li" align="center" gap="2"><Check size={15} color="var(--chakra-colors-brand-400)"/> Trusted devices: 2</Flex>
                                    </Stack>
                                </Card.Root>
                            </Box>
                        </SimpleGrid>
                    </PageContainer>
                </Box>

                {/* Pricing */}
                <PageContainer as="section" id="pricing" py={{ base: '20', lg: '28' }}>
                    <Box mx="auto" maxW="2xl" textAlign="center">
                        <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="brand.600">Pricing</Text>
                        <Heading as="h2" mt="3" fontFamily="display" fontSize={{ base: '3xl', sm: '4xl' }} fontWeight="extrabold" letterSpacing="tight" color="ink.950">
                            Simple, honest pricing.
                        </Heading>
                        <Text mt="4" fontSize="lg" color="ink.600">Start free. Upgrade only if you want more. No surprises.</Text>
                    </Box>

                    <SimpleGrid mt="14" columns={{ base: 1, lg: 3 }} gap="6">
                        {plans.map((p) => (
                            <Flex
                                key={p.name}
                                position="relative"
                                direction="column"
                                borderRadius="2xl"
                                p="7"
                                transition="all 0.3s"
                                _hover={{ transform: 'translateY(-4px)' }}
                                bg={p.highlight ? 'ink.950' : 'white'}
                                color={p.highlight ? 'white' : undefined}
                                boxShadow={p.highlight ? '2xl' : 'soft'}
                                borderWidth={p.highlight ? '2px' : '1px'}
                                borderColor={p.highlight ? 'brand.500' : 'ink.100'}
                            >
                                {p.highlight && (
                                    <Span position="absolute" top="-3" left="1/2" transform="translateX(-50%)" borderRadius="full" bg="brand.500" px="4" py="1" fontSize="xs" fontWeight="bold" color="white" boxShadow="soft">
                                        Most popular
                                    </Span>
                                )}
                                <Heading as="h3" fontFamily="display" fontSize="lg" fontWeight="bold" color={p.highlight ? 'white' : 'ink.950'}>{p.name}</Heading>
                                <Text mt="1" fontSize="sm" color={p.highlight ? 'ink.400' : 'ink.500'}>{p.tagline}</Text>
                                <Flex mt="5" align="flex-end" gap="1">
                                    <Text as="span" fontFamily="display" fontSize="4xl" fontWeight="extrabold" color={p.highlight ? 'white' : 'ink.950'}>{p.price}</Text>
                                    <Text as="span" mb="1" fontSize="sm" color={p.highlight ? 'ink.400' : 'ink.500'}>{p.period}</Text>
                                </Flex>
                                <Stack as="ul" mt="6" flex="1" gap="3">
                                    {p.features.map((f) => (
                                        <Flex as="li" key={f} align="flex-start" gap="2.5" fontSize="sm" color={p.highlight ? 'ink.200' : 'ink.700'}>
                                            <Box mt="0.5" flexShrink="0">
                                                <Check size={17} color={p.highlight ? 'var(--chakra-colors-brand-400)' : 'var(--chakra-colors-brand-600)'} />
                                            </Box>
                                            {f}
                                        </Flex>
                                    ))}
                                </Stack>
                                {p.highlight ? (
                                    <Button onClick={() => go('register')} mt="7" colorPalette="brand" variant="solid" borderRadius="xl" boxShadow="soft">
                                        {p.cta}
                                    </Button>
                                ) : (
                                    <Button onClick={() => go('register')} mt="7" colorPalette="ink" variant="outline" borderRadius="xl">
                                        {p.cta}
                                    </Button>
                                )}
                            </Flex>
                        ))}
                    </SimpleGrid>
                </PageContainer>

                {/* Testimonials */}
                <Box as="section" bg="ink.50" py={{ base: '20', lg: '28' }}>
                    <PageContainer>
                        <Box mx="auto" maxW="2xl" textAlign="center">
                            <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="brand.600">Loved by South Africans</Text>
                            <Heading as="h2" mt="3" fontFamily="display" fontSize={{ base: '3xl', sm: '4xl' }} fontWeight="extrabold" letterSpacing="tight" color="ink.950">
                                Don't just take our word for it.
                            </Heading>
                        </Box>
                        <SimpleGrid mt="14" columns={{ base: 1, md: 3 }} gap="6">
                            {testimonials.map((t) => (
                                <Card.Root as="figure" key={t.name} variant="custom" display="flex" flexDirection="column" p="7">
                                    <Quote size={28} color="var(--chakra-colors-brand-200)"/>
                                    <Flex mt="3" gap="0.5">
                                        {Array.from({length: 5}).map((_, i) => (
                                            <Star key={i} size={16} fill="var(--chakra-colors-gold-400)" color="var(--chakra-colors-gold-400)"/>
                                        ))}
                                    </Flex>
                                    <Box as="blockquote" mt="4" flex="1" fontSize="sm" lineHeight="relaxed" color="ink.700">"{t.quote}"</Box>
                                    <Box as="figcaption" mt="5" borderTopWidth="1px" borderColor="ink.100" pt="4">
                                        <Text fontWeight="semibold" color="ink.950">{t.name}</Text>
                                        <Text fontSize="xs" color="ink.500">{t.role}</Text>
                                    </Box>
                                </Card.Root>
                            ))}
                        </SimpleGrid>
                    </PageContainer>
                </Box>

                {/* CTA */}
                <PageContainer as="section" id="support" py={{ base: '20', lg: '28' }}>
                    <Box position="relative" overflow="hidden" borderRadius="3xl" bgGradient="to-br" gradientFrom="brand.600" gradientTo="brand.800" px={{ base: '6', sm: '12' }} py="16" textAlign="center" color="white">
                        <Box pointerEvents="none" position="absolute" inset="0">
                            <Box position="absolute" right="-20" top="-20" h="64" w="64" borderRadius="full" bg="white/10" filter="blur(40px)" />
                            <Box position="absolute" bottom="-24" left="-10" h="64" w="64" borderRadius="full" bg="gold.400/20" filter="blur(40px)" />
                        </Box>
                        <Box position="relative">
                            <Users size={32} color="rgba(255,255,255,0.8)" style={{ margin: '0 auto' }} />
                            <Heading as="h2" mt="5" fontFamily="display" fontSize={{ base: '3xl', sm: '4xl' }} fontWeight="extrabold" letterSpacing="tight">
                                Join thousands banking the modern way.
                            </Heading>
                            <Text mx="auto" mt="4" maxW="xl" fontSize="lg" color="brand.50">
                                Open your free aceMedia Bank account in two minutes. All you need is your SA ID and
                                a phone.
                            </Text>
                            <Button
                                onClick={() => go('register')}
                                mt="8"
                                bg="white"
                                color="ink.950"
                                borderRadius="xl"
                                _hover={{ bg: 'ink.50' }}
                                _active={{ transform: 'scale(0.98)' }}
                            >
                                Get started — it's free
                                <ArrowRight size={18}/>
                            </Button>
                        </Box>
                    </Box>
                </PageContainer>
            </Box>
        </Flex>
    )
}
