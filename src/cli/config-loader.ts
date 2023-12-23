import { join } from 'path';
import { readFile, checkPath } from '../utils/fs-async';

export const DEFAULT_FILEPATHS = [
    '.exoticiconrc',
    'exoticiconrc',
    '.exoticiconrc.json',
    'exoticiconrc.json',
    '.exoticiconrc.js',
    'exoticiconrc.js',
    '.exoticicon',
    'exoticicon'
];

const attemptLoading = async (filepath: string): Promise<any | void> => {
    if (await checkPath(filepath, 'file')) {
        try {
            return require(join(process.cwd(), filepath));
        } catch (err) {}

        try {
            return JSON.parse(await readFile(filepath, 'utf8'));
        } catch (err) {}

        throw new Error(`Failed parsing configuration at '${filepath}'`);
    }
};

export const loadConfig = async (filepath?: string) => {
    let loadedConfigPath: string | null = null;
    let loadedConfig = {};

    if (filepath) {
        loadedConfig = await attemptLoading(filepath);
        loadedConfigPath = filepath;
    } else {
        for (const path of DEFAULT_FILEPATHS) {
            loadedConfig = await attemptLoading(path);

            if (loadedConfig) {
                loadedConfigPath = path;
                break;
            }
        }
    }

    return { loadedConfig, loadedConfigPath };
};
