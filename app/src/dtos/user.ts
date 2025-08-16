export type CreateUserInputDto = {
  email?: string;
  phone?: string;
  cpf: string;
  password: string;
  name: string;
  isAdmin: boolean;
};

export type CreateUserOutputDto = {
  id: string;
};
