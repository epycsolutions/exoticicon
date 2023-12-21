import * as fs from 'fs';

import { readFile, writeFile, stat, checkPath } from '../fs-async';

const readFileMock = fs.readFile as any as jest.Mock;
const writeFileMock = fs.writeFile as any as jest.Mock;
const statMock = fs.stat as any as jest.Mock;

jest.mock('fs', () => ({
    readFile: jest.fn(),
    writeFile: jest.fn(),
    stat: jest.fn()
}));

describe('Async FS utilities', () => {
    beforeEach(() => {
        readFileMock.mockClear();
        writeFileMock.mockClear();
        statMock.mockClear();
    });

    describe('readFile', () => {
        it('is `fs.readFile` correctly promisified', async () => {
            const filePath = '/dev/null';
            const encoding = 'utf-8';
            const result = '::result::';

            readFileMock.mockImplementation((_, __, cb) => cb(null, result));

            expect(await readFile(filePath, encoding)).toBe(result);

            expect(readFileMock).toHaveBeenCalledTimes(1);
            expect(readFileMock).toHaveBeenCalledWith(
                filePath,
                encoding,
                expect.any(Function)
            );
        });
    });

    describe('writeFile', () => {
        it('is `fs.writeFile` correctly promisified', async () => {
            const filePath = '/dev/null';
            const content = '::content::';

            writeFileMock.mockImplementation((_, __, cb) => cb(null));

            expect(await writeFile(filePath, content)).toBe(undefined);

            expect(writeFileMock).toHaveBeenCalledTimes(1);
            expect(writeFileMock).toHaveBeenCalledWith(
                filePath,
                content,
                expect.any(Function)
            );
        });
    });

    describe('stat', () => {
        it('is `fs.stat` correctly promisified', async () => {
            const filePath = '/dev/null';

            statMock.mockImplementation((_, cb) => cb(null));

            expect(await stat(filePath)).toBe(undefined);

            expect(statMock).toHaveBeenCalledTimes(1);
            expect(statMock).toHaveBeenCalledWith(
                filePath,
                expect.any(Function)
            );
        });
    });

    describe('checkPath', () => {
        it('calls `stat` correctly and correctly check the existance of a path', async () => {
            const mockPath = '/dev/null';

            statMock.mockImplementationOnce((_, cb) => cb());

            expect(await checkPath(mockPath)).toBe(true);

            expect(statMock).toHaveBeenCalledTimes(1);
            expect(statMock).toHaveBeenCalledWith(
                mockPath,
                expect.any(Function)
            );

            statMock.mockClear();
            statMock.mockImplementationOnce((_, cb) => cb(new Error('Fail')));

            expect(await checkPath(mockPath)).toBe(false);

            expect(statMock).toHaveBeenCalledTimes(1);
            expect(statMock).toHaveBeenCalledWith(
                mockPath,
                expect.any(Function)
            );
        });

        it('checks if given path is a directory when given as check type', async () => {
            const mockPath = '/dev/null';
            const isDirectory = jest.fn(() => false);

            statMock.mockImplementation((_, cb) => cb(null, { isDirectory }));

            expect(await checkPath(mockPath, 'directory')).toBe(false);

            expect(statMock).toHaveBeenCalledTimes(1);
            expect(statMock).toHaveBeenCalledWith(
                mockPath,
                expect.any(Function)
            );

            expect(isDirectory).toHaveBeenCalledTimes(1);

            isDirectory.mockImplementation(() => true);

            expect(await checkPath(mockPath, 'directory')).toBe(true);
        });

        it('checks if given path is a file when given as check type', async () => {
            const mockPath = '/dev/null';
            const isFile = jest.fn(() => false);

            statMock.mockImplementation((_, cb) => cb(null, { isFile }));

            expect(await checkPath(mockPath, 'file')).toBe(false);

            expect(statMock).toHaveBeenCalledTimes(1);
            expect(statMock).toHaveBeenCalledWith(
                mockPath,
                expect.any(Function)
            );

            expect(isFile).toHaveBeenCalledTimes(1);

            isFile.mockImplementation(() => true);

            expect(await checkPath(mockPath, 'file')).toBe(true);
        });
    });
});
