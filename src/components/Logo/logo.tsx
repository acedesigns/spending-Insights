/* =======================================================
 *
 * Created by anele on 02/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { Landmark } from 'lucide-react'
import { Flex, Text } from '@chakra-ui/react'

type Props = {
    className?: string;
    variant?: 'dark' | 'light';
    size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
    sm: { box: '7', icon: 16, text: 'lg' },
    md: { box: '9', icon: 18, text: 'xl' },
    lg: { box: '11', icon: 22, text: '2xl' },
}

export default function SiteLogo({ className = '', variant = 'dark', size = 'md' }: Props) {
    const s = sizeMap[size];
    const textColor = variant === 'dark' ? 'ink.900' : 'white'

    return (
        <Flex className={className} align="center" gap="2.5">
            <Flex
                h={s.box}
                w={s.box}
                color={'white'}
                align={'center'}
                boxShadow={'soft'}
                justify={'center'}
                borderRadius={'xl'}
                bgGradient={'to-br'}
                gradientFrom={'brand.500'}
                gradientTo={'brand.700'}
            >
                <Landmark size={s.icon} strokeWidth={2.4} />
            </Flex>

            <Text fontFamily="display" fontWeight="extrabold" letterSpacing="tight" fontSize={s.text} color={textColor}>
                aceMedia<Text as="span" color="brand.600">{' '}Bank</Text>
            </Text>
        </Flex>
    );
}
