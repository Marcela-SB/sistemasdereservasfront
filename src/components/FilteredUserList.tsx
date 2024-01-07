import { React, useContext, useState } from "react";
import data from "./ListData.json";
import { StateContext } from "../context/ReactContext";
import { UserT } from "../types/UserT";
import { Divider, IconButton, List, ListItem, ListItemSecondaryAction } from "@mui/material";
import { Send } from "@mui/icons-material";

type Props = {
    inputText: string;
    selectUser: (u : UserT) => void
};

function FilteredUserList({ inputText, selectUser}: Props) {
    const { userList } = useContext(StateContext);


    //create a new array by filtering the original array
    const filteredUserList = userList?.filter((user: UserT) => {
        //if no input the return the original
        if (inputText === "") {
            return user;
        }

        //return the item which contains the user input
        else {
            const splitedText = inputText.split("_");
            return user.username.toLowerCase().includes(splitedText[0]);
        }
    });
    return (
        <List
            sx={{
                height: "16rem",
            }}
        >
            {filteredUserList?.map((user: UserT) => (
                <>
                    <ListItem key={user.id}>
                        {user.name}
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => selectUser(user)}>
                                <Send></Send>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="middle" />
                </>
            ))}
        </List>
    );
}

export default FilteredUserList;
