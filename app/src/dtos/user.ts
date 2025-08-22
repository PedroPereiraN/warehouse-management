export type CreateUserInputDto = {
  email: string;
  phone: string | null;
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

export type AuthenticateUserInputDto = {
  email: string;
  password: string;
};

export type AuthenticateUserResponseDto = {
  token: string;
};

export type AuthenticateUserOutputDto = {
  token: string;
};
