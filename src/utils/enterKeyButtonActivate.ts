import { RefObject, useEffect } from "react"

export function useEnterSubmit(
    isOpen: boolean,
    buttonRef: RefObject<HTMLButtonElement>,
    dialogRef: RefObject<HTMLElement>
){
    useEffect(()=> {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const dialogElement = dialogRef.current;
            const activeElement = document.activeElement;

            if (
                // Verifica se a tecla é Enter
                e.key === "Enter" &&
                // Garante que o diálogo existe
                dialogElement &&
                // Verifica se o elemento com foco está dentro do diálogo
                dialogElement.contains(activeElement)
            ) {
                e.preventDefault();
                e.stopPropagation(); //Bloqueia ações que possam interromper/quebrar este processo
                buttonRef.current?.click();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, buttonRef, dialogRef]);
}