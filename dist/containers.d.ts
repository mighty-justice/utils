import React from 'react';
import { Argument as IClassName } from 'classnames';
export interface IDisabledContainerProps {
    className?: IClassName;
}
export interface IGuardedContainerProps {
    disabledComponent: React.ReactNode;
    enabledComponent: React.ReactNode;
    isGuarded: boolean;
}
export declare function createDisabledContainer(WrappedComponent: React.ComponentType<any>): React.ComponentType;
export declare function createGuardedContainer({ isGuarded, enabledComponent, disabledComponent, }: IGuardedContainerProps): React.ComponentClass;
