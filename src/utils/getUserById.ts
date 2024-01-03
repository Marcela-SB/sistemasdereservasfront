import { UserT } from "../types/UserT";

export default function getUserById(UserId: string, UserList: UserT[]) {
    return UserList.find((User: UserT) => User.id === UserId);
}
