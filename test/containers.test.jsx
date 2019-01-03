/* global describe, it, expect */
import React, { Component } from 'react';
import { mount } from 'enzyme';

import {
  createGuardedContainer,
  createDisabledContainer,
} from '../src';

class Button extends Component {
  render () {
    return <button {...this.props}>this.props.children</button>
  }
}

describe('createGuardedContainer', () => {
  it('Renders when guarded', async () => {
    const GuardedComponent = createGuardedContainer({
        isGuarded: true,
        disabledComponent: Button,
        enabledComponent: Component,
      }),
      wrapper = mount(<GuardedComponent />);

    expect(wrapper.html()).toContain('button');
  });

  it('Renders when not guarded', async () => {
    const GuardedComponent = createGuardedContainer({
        isGuarded: false,
        disabledComponent: Component,
        enabledComponent: Button,
      }),
      wrapper = mount(<GuardedComponent />);

    expect(wrapper.html()).toContain('button');
  });
});

describe('createDisabledContainer', () => {
  it('Renders disabled container', async () => {
    const DisabledComponent = createDisabledContainer(Button),
      wrapper = mount(<DisabledComponent />);

    expect(wrapper.html()).toContain('disabled');
  });
});
