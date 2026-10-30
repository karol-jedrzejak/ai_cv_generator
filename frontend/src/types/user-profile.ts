export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  mobilePhone: string;
  hometown: string;
  avatarUrl: string | null;
  aiProvider: "OLLAMA" | "GOOGLE_AI_STUDIO";
  updatedAt: string;
}

export interface UpdateUserProfileDto {
  name: string;
  surname: string;
  email: string;
  mobilePhone: string;
  hometown: string;
  aiProvider: "OLLAMA" | "GOOGLE_AI_STUDIO";
  password?: string;
  confirmPassword?: string;
}
