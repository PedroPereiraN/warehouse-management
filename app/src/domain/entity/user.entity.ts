import { CPF_LENGTH, PHONE_LENGTH } from "../../utils/constants";
import { emailRegex } from "../../utils/regex";
import { isValidISODate } from "../../utils/validators";

export type CreateUserProps = {
  email: string | null;
  phone: string | null;
  cpf: string;
  password: string;
  name: string;
  isAdmin: boolean;
};

export type UserProps = {
  id: string;
  email: string | null;
  name: string;
  phone: string | null;
  cpf: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

export class User {
  private constructor(private readonly props: UserProps) {
    if (!isValidISODate(props.createdAt)) {
      throw new Error(`Invalid createdAt datetime: ${props.createdAt}`);
    }

    if (props?.updatedAt && !isValidISODate(props.updatedAt)) {
      throw new Error(`Invalid updatedAt datetime: ${props.updatedAt}`);
    }
    if (props?.deletedAt && !isValidISODate(props.deletedAt)) {
      throw new Error(`Invalid deletedAt datetime: ${props.deletedAt}`);
    }

    if (props.cpf.length !== CPF_LENGTH) {
      throw new Error(`Invalid CPF: ${props.cpf}`);
    }

    if (props?.phone && props.phone.length !== PHONE_LENGTH) {
      throw new Error(`Invalid phone: ${props.cpf}`);
    }

    if (props?.email && !emailRegex.test(props.email)) {
      throw new Error(`Invalid email: ${props.email}`);
    }
  }

  public static create({
    email,
    phone,
    name,
    password,
    isAdmin,
    cpf,
  }: CreateUserProps): User {
    return new User({
      id: crypto.randomUUID().toString(),
      email,
      phone,
      name,
      password,
      isAdmin,
      cpf,
      createdAt: new Date().toISOString(),
    });
  }

  public static with(props: UserProps): User {
    return new User(props);
  }

  public with(updatedProps: Partial<UserProps>): User {
    return new User({
      ...this.props,
      ...updatedProps,
    });
  }

  //Returns the password (internal use only)
  public getPassword(): string {
    return this.props.password;
  }

  public get values(): Omit<UserProps, "password"> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeProps } = this.props;

    return safeProps;
  }
}
