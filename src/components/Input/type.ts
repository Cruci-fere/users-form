export type InputType = 'text' | 'password' | 'text-area'

export interface Props {
    value?: string | null;
    type?: InputType;
    placeholder?: string;
    maxLength?: number;
    error?: boolean;
}

export interface Emits {
    onBlur: [value: string]
}