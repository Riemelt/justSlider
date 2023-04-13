const camelToSnakeCase = function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
};

export {
  camelToSnakeCase,
};
