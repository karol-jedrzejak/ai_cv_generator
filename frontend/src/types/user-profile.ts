export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  mobilePhone: string;
  hometown: string;
  avatarUrl: string | null;
  updatedAt: string;
}

export interface UpdateUserProfileDto {
  name: string;
  surname: string;
  email: string;
  mobilePhone: string;
  hometown: string;
  password?: string;
  confirmPassword?: string;
}
