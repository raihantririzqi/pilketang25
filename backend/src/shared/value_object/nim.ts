export class NIM {
  private readonly value: string;
  private static readonly NIM_REGEX = /^125140\d{3}$/;
  private constructor(value: string) {
    this.value = value;
  }

  public static create = (value: string) => {
    if (!this.validate(value)) throw new Error("Invalid NIM");
    new NIM(value);
  };

  private static validate = (value: string): boolean =>
    this.NIM_REGEX.test(value);

  public get_value = (): string => this.value;
}
