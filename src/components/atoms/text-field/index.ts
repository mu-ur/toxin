import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';

import Namespace from './namespace';

class TextField implements Namespace.Interface {
  public readonly focus = () => {
    pipe(this.input, O.map(H.method('focus')));

    return (this);
  };

  public readonly setValue = (value: string) => {
    pipe(this.input, O.map(H.setAttribute('value', value)));

    return (this);
  };

  public readonly setValid = (valid: boolean) => {
    pipe(this.root, O.map(pipe(['text-field_invalid'], valid ? H.removeClassList : H.addClassList)));

    return (this);
  };

  public readonly setDisabled = (disabled: boolean) => {
    pipe(this.input, O.map(pipe('disabled', disabled ? H.setAttribute : H.removeAttribute)));

    return (this);
  };

  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.initInput();
  }

  private readonly root = pipe(this.wrap, H.querySelector<HTMLLabelElement>('.js-text-field'));
  private readonly input = pipe(this.wrap, H.querySelector<HTMLInputElement>('.js-text-field__input'));

  private readonly initInput = () => pipe(this.input, O.map(flow(
    H.addEventListener('input', this.handleChange),
    H.addEventListener('keyup', this.handleEnterPress)
  )));

  private readonly handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;

    this.props.onChange(target.value);
  };

  private readonly handleEnterPress = (event: KeyboardEvent) => {
    const {onEnterPress} = this.props;

    if (event.code === 'Enter' && onEnterPress) {
      onEnterPress();
    }
  };
}

export default TextField;