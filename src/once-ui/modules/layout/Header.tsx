'use client';

import { Button, Flex, Logo, NavIcon, SmartLink, ToggleButton, UserMenu } from '@/once-ui/components';
import { usePathname } from 'next/navigation';
import React from 'react';

interface HeaderProps {
    avatar?: string;
    name?: string;
    subline?: string;
}

const Header: React.FC<HeaderProps> = ({
    avatar,
    name,
    subline
}) => {
    const pathname = usePathname() ?? '';

    return (
        <Flex
            style={{
                borderBottom: '1px solid var(--neutral-border-medium)'
            }}
            as="header"
            fillWidth paddingX="m" height="56"
            alignItems="center"
            background="surface">
            <Flex
                hide="s">
                <Logo/>
            </Flex>
            <Flex
                show="s"
                gap="4"
                alignItems="center">
                <NavIcon/>
                <Logo wordmark={false}/>
            </Flex>
            <Flex
                fillWidth
                alignItems="center" justifyContent="flex-end">
                <Flex
                    hide="s"
                    textVariant="label-default-s"
                    fillWidth gap="4" paddingX="l"
                    alignItems="center">
                    <SmartLink
                        href="">
                        Home
                    </SmartLink>
                    <SmartLink
                        href="">
                        Product
                    </SmartLink>
                    <SmartLink
                        href="">
                        Solutions
                    </SmartLink>
                    <SmartLink
                        href="">
                        Pricing
                    </SmartLink>
                </Flex>
                <Flex
                    alignItems="center"
                    gap="8">
                    <Button
                        size="s"
                        variant="secondary"
                        label="Login"
                        href=""/>
                    <Button
                        size="s"
                        variant="primary"
                        label="Sign up"
                        href=""/>
                </Flex>
            </Flex>
        </Flex>
  );
};

Header.displayName = 'Header';
export { Header };