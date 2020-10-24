/* tslint:disable max-classes-per-file */
import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';

import { getDisplayName } from './formatting';

export interface IDisabledContainerProps {
  className?: any;
}

export interface IGuardedContainerProps {
  disabledComponent: React.ReactNode;
  enabledComponent: React.ReactNode;
  isGuarded: boolean;
}

export function createDisabledContainer(WrappedComponent: React.ComponentType<any>): React.ComponentType {
  @observer
  class DisabledContainer extends Component<IDisabledContainerProps> {
    public static displayName = `DisabledContainer(${getDisplayName(WrappedComponent)})`;

    public render() {
      const classNames = cx(this.props.className, 'disabled');

      return (
        <WrappedComponent
          {...this.props}
          className={classNames}
          data-for="permission-required"
          data-tip
          data-tip-disable={false}
          onClick={null}
          onSelect={null}
        />
      );
    }
  }

  return DisabledContainer;
}

// tslint:disable-next-line max-line-length
export function createGuardedContainer({
  isGuarded,
  enabledComponent,
  disabledComponent,
}: IGuardedContainerProps): React.ComponentClass {
  @observer
  class GuardedContainer extends Component {
    private readonly GuardedComponent: any;
    public static displayName = `GuardedContainer(${getDisplayName(enabledComponent)})`;

    public constructor(props: any) {
      super(props);
      this.GuardedComponent = this.userHasPermission ? enabledComponent : disabledComponent;
    }

    @computed
    public get userHasPermission() {
      return !isGuarded;
    }

    public render() {
      return <this.GuardedComponent {...this.props} />;
    }
  }

  return GuardedContainer;
}
