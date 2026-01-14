export class Email {
  private readonly value: string;
  private static readonly EMAIL_REGEX =
    /^[a-z0-9.-]+@student\.itera\.ac\.id$/i;

  private constructor(value: string) {
    this.value = value.toLowerCase().trim();
  }

  public static create = (value: string): Email => {
    if (!this.validate(value))
      throw new Error(
        `Email '${value}' invalid. Must use domain @student.itera.ac.id`,
      );
    return new Email(value);
  };

  private static validate = (value: string): boolean =>
    this.EMAIL_REGEX.test(value);

  public get_value = (): string => this.value;
}
