// File: FilteredUserListByCpf.tsx

import { useContext } from "react";
import { StateContext } from "../context/ReactContext";
import { UserT } from "../types/UserT";
import {
    Chip,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    Typography, // Adicionando Typography para a mensagem de "não encontrado"
} from "@mui/material";
import { Send } from "@mui/icons-material";
import userDynamicSort from "../utils/usersDynamicSort";

type Props = {
    inputText: string;
    selectUser: (u: UserT) => void;
};

function FilteredUserListByCpf({ inputText, selectUser }: Props) {
    const { allUsersList } = useContext(StateContext); 

    const cleanInputText = inputText.replace(/[^\d]/g, "");

    const filteredUserList = allUsersList
        ?.filter((user: UserT) => {
            
            const sourceText = user.username; // user.cpf

            if (!sourceText) {
                return false; 
            }

            const cleanSourceText = sourceText.replace(/[^\d]/g, ""); 

            if (cleanInputText === "") {
                return true;
            }

            return cleanSourceText.includes(cleanInputText);
        })
        .sort(userDynamicSort());
        
    return (
        <List sx={{ overflow: "auto", maxHeight: "20rem" }}>
            {filteredUserList && filteredUserList.length > 0 ? (
                filteredUserList.map((user: UserT) => (
                    <span key={user.id}>
                        <ListItem key={user.id}>
                            {user.cpf || user.username} | {user.name}

                                <ListItemSecondaryAction>
                            
                                <Chip
                                    label={user.active ? "Ativo" : "Inativo"}
                                    color={user.active ? "success" : "error"}
                                    size="small"
                                />
                                    <IconButton onClick={() => selectUser(user)}>
                                        <Send></Send>
                                    </IconButton>
                                </ListItemSecondaryAction>
                        </ListItem>
                        <Divider variant="middle" />
                    </span>
                ))
            ) : (
                <ListItem>
                    <Typography variant="body1" color="textSecondary" sx={{ margin: 2 }}>
                        {cleanInputText.length > 0 
                            ? "Nenhum usuário encontrado com o CPF digitado." 
                            : "Digite o CPF para procurar o usuário."}
                    </Typography>
                </ListItem>
            )}
        </List>
    );
}

export default FilteredUserListByCpf;