export interface Jwt {
  username: string;
  sub: string;
  role: "User" | "Admin";
}
