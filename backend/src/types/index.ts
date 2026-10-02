export type PlayerTeam = 'student' | 'staff';
export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';
export type PlayerStatus = 'approved' | 'waitlisted' | 'rejected';

export interface RegisterPlayerDTO {
  userId: string;
  team: PlayerTeam;
  position: PlayerPosition;
  squadNumber?: number;
}

export interface RegistrationResult {
  success: boolean;
  status: PlayerStatus;
  message: string;
  player?: any;
}