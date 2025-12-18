import { useContext } from "react";
import { StateContext } from "../context/ReactContext";
import { UserT } from "../types/UserT";
import {
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import userDynamicSort from "../utils/usersDynamicSort";

type Props = {
    inputText: string;
    selectUser: (u: UserT) => void;
};

function FilteredUserList({ inputText, selectUser }: Props) {
    const { activeUsersList } = useContext(StateContext);

    //create a new array by filtering the original array
    const filteredUserList = activeUsersList
        ?.filter((user: UserT) => {
            //if no input the return the original
            if (inputText === "") {
                return user;
            }

            //return the item which contains the user input
            else {
                return user.name?.toLowerCase().includes(inputText.toLowerCase());
            }
        })
        .sort(userDynamicSort());
    return (
        <List sx={{ overflow: "auto", maxHeight: "20rem" }}>
            {filteredUserList?.map((user: UserT) => (
                <span key={user.id}>
                    <ListItem key={user.id}>
                        {user.name}
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => selectUser(user)}>
                                <Send></Send>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="middle" />
                </span>
            ))}
        </List>
    );
}

export default FilteredUserList;
