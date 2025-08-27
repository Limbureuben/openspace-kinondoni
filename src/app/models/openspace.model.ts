export interface OpenSpaceRegisterData{
  name: string,
  latitude: number,
  longitude: number,
  district: string,
  street: string,
}

export interface ToggleOpenSpaceResponse {
  toggleOpenspaceStatus: {
    openspace: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
      district: string;
      isActive: boolean;
    };
  };
}

export interface RegisterData {
  email?:  string,
  password: string,
  passwordConfirm: string,
  username: string,
  sessionId?: string | null;
  role?: string;
  ward?: string;
  street?: string;
}

export interface LoginData {
  username:string,
  password: string
}


export interface User {
  id: number;
  username: string;
  email?: string;
  ward?: any;
  street?: { id: number; name: string };
  profile_image?: string;
  isActive?: boolean;
}


export interface Report {
  report_id: string;
  description: string;
  email?: string;
  file?: string;
  created_at: string;
  space_name?: string;
  district?: string;
  street?: string;
  latitude?: number;
  longitude?: number;
  user?: any;
}
