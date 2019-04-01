import React from 'react';
export interface IDisabledContainerProps {
    className?: any;
}
export interface IGuardedContainerProps {
    disabledComponent: React.ReactNode;
    enabledComponent: React.ReactNode;
    isGuarded: boolean;
}
export declare function createDisabledContainer(WrappedComponent: React.ComponentType<any>): React.ReactNode;
export declare function createGuardedContainer({ isGuarded, enabledComponent, disabledComponent }: IGuardedContainerProps): React.ComponentClass;
