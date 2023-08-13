import { queryScript } from "./exec"

export const getStatus = async (script: string) => {
    const result = await queryScript(script, 'get_game');
    return result;
}