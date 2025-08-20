export type CreateUserInputDto = {
  email: string | null;
  phone: string | null;
  cpf: string;
  password: string;
  name: string;
  isAdmin: boolean;
};

export type CreateUserOutputDto = {
  id: string;
};

export type CreateUserResponseDto = {
  id: string;
};
