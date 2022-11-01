class Toggle {
  private className: string;
  private $component: JQuery<HTMLElement>;
  private $input: JQuery<HTMLElement>;
  private options: ToggleOptions;

  constructor($parent: JQuery<HTMLElement>, options: ToggleOptions) {
    this.className = "toggle";
    this.init($parent, options);
    this.render();
  }

  private init($parent: JQuery<HTMLElement>, options: ToggleOptions) {
    this.options = options;
    this.$component = $parent.find(`.js-${this.className}`);
    this.$input     = this.$component.find(`.js-${this.className}__switch-input`);
  }

  private render() {
    this.setHandlers();
  }

  private setHandlers() {
    this.$input.on("change.toggle", this.handleToggleChange.bind(this));
  }

  private handleToggleChange(event: Event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      const { checked } = event.currentTarget;
      const { handleToggleChange } = this.options;
      handleToggleChange?.(checked);
    }
  }
}

export default Toggle;