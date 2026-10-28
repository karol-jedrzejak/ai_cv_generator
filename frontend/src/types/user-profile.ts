export interface UserProfile {
  id: string;
  name: string | null;
  surname: string | null;
  email: string;
  mobilePhone: string | null;
  updatedAt: string;
}

export interface UpdateUserProfileDto {
  name: string | null;
  surname: string | null;
  email: string;
  mobilePhone: string | null;
  password?: string;
  confirmPassword?: string;
}
