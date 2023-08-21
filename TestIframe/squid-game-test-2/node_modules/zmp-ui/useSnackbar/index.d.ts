import { ReactNode } from "react";

export enum SnackbarPosition {
    "top" = "top",
    "bottom" = "bottom",
}

export enum SnackbarType {
    "default" = "default",
    "success" = "success",
    "info" = "info",
    "error" = "error",
    "warning" = "warning",
    "loading" = "loading",
    "download" = "download",
    "countdown" = "countdown",
    "wifi-connected" = "wifi-connected",
    "wifi-disconnected" = "wifi-disconnected",
}

export interface SnackbarAction {
    close?: boolean;
    text?: string;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export interface SnackbarOptions {
    position?: keyof typeof SnackbarPosition;
    duration?: number;
    text?: string;
    type?: keyof typeof SnackbarType;
    action?: SnackbarAction;
    prefixIcon?: ReactNode;
    icon?: boolean;
    verticalAction?: boolean;
    zIndex?: number;
    onClose?: () => void;
}

export type UseSnackbarType = {
    openSnackbar: (options: SnackbarOptions) => void;
    closeSnackbar: () => void;
    setDownloadProgress: (completed: number) => void;
};

declare function useSnackbar(): UseSnackbarType;

export default useSnackbar;
