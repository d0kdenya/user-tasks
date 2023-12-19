import { JwtPayload } from './jwt-payload.interface';

export interface AccessPayload extends JwtPayload {
  id: number;
  email: string;
  name: string;
}
