class Model {
  private options: Options;

  constructor() {
    console.log("Model created");
  }

  init(options: Options) {
    this.options = options;
    return options;
  }

}

export default Model;