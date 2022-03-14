import { MessageCommandBuilder } from './index';

export interface MessageCommandData {
    builder: MessageCommandBuilder;
    execute: () => Promise<void>;
}
