/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { Button, Heading, Text, VStack } from '@chakra-ui/react'

interface EmptyStateProps {
    title: string
    description: string
    action?: { label: string; onClick: () => void }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
    return (
        <VStack px={'6'} py={'14'} gap={'3'} borderWidth={'1px'}
            borderRadius={'xl'} textAlign={'center'} borderStyle={'dashed'} borderColor={'ink.200'}>
            <Heading as="h3" fontFamily="display" fontSize="md" fontWeight="semibold" color="ink.900">
                {title}
            </Heading>
            <Text maxW="xs" fontSize="sm" color="ink.500">
                {description}
            </Text>
            {action && (
                <Button
                    mt={'1'}
                    fontSize={'sm'}
                    type={'button'}
                    variant={'plain'}
                    color={'brand.600'}
                    fontWeight={'semibold'}
                    onClick={action.onClick}
                    textDecoration={'underline'}
                    textDecorationColor={'brand.300'}
                    textUnderlineOffset={'4px'}
                    _hover={{ color: 'brand.700', textDecorationColor: 'brand.500' }}
                >
                    {action.label}
                </Button>
            )}
        </VStack>
    )
}
