import { MIN, STEP } from '../../../app/Model/constants';
import { InputFieldOptions, InputUpdate } from './types';

class InputField {
  private className: string;
  private $component: JQuery<HTMLElement>;
  private $input: JQuery<HTMLElement>;
  private options: InputFieldOptions;

  constructor($parent: JQuery<HTMLElement>, options: InputFieldOptions = {}) {
    this.className = 'input-field';
    this.options = options;
    this.$component = $parent.find(`.js-${this.className}`);
    this.$input = this.$component.find(`.js-${this.className}__input`);
    this.render();
  }

  public disable(): void {
    this.$component.addClass(`${this.className}_disabled`);
    this.$input.prop('disabled', true);
  }

  public enable(): void {
    this.$component.removeClass(`${this.className}_disabled`);
    this.$input.prop('disabled', false);
  }

  public update({
    value,
    step,
    min,
  }: InputUpdate): void {
    if (value !== undefined) {
      this.$input.val(value);
    }

    const props: Array<{
      prop: typeof MIN | typeof STEP,
      value: number | undefined
    }> = [
      {
        prop: MIN,
        value: min,
      },
      {
        prop: STEP,
        value: step,
      },
    ];

    props.forEach(({ prop, value }) => {
      this.updateProp(prop, value);
    });
  }

  private updateProp(prop: typeof STEP | typeof MIN, value?: number) {
    if (value === undefined) {
      return;
    }

    this.$input.prop(prop, value);
  }

  private render(): void {
    this.setHandlers();
  }

  private setHandlers(): void {
    this.$input.on('change.input-field', this.handleInputChange.bind(this));
  }

  private handleInputChange(event: Event): void {
    if (event.currentTarget instanceof HTMLInputElement) {
      const value = Number(event.currentTarget.value);
      const { handleChange } = this.options;
      handleChange?.(value);
    }
  }
}

export default InputField;
