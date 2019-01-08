import React from 'react';
export interface IDisabledContainerProps {
    className?: any;
}
export interface IGuardedContainerProps {
    disabledComponent: React.ComponentClass;
    enabledComponent: React.ComponentClass;
    isGuarded: boolean;
}
export declare function createDisabledContainer(WrappedComponent: React.ComponentClass<any>): React.ComponentClass;
export declare function createGuardedContainer({ isGuarded, enabledComponent, disabledComponent }: IGuardedContainerProps): React.ComponentClass;
