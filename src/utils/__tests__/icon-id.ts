import { getIconId } from '../icon-id';
import { GetIconIdOptions } from '../../types/misc';

const EMPTY_OPTIONS: GetIconIdOptions = {
    basename: '',
    relativeFilePath: '',
    absoluteFilePath: '',
    relativeDirPath: '',
    index: 0
};

describe('Icon ID utilities', () => {
    describe('getIconId', () => {
        it.each([
            ['./foo/bar/icon.svg', 'icon'],
            ['foo/bar/icon.svg', 'bar-icon'],
            ['foo/icon.SVG', 'icon'],
            ['foo/icon-test_1_a', 'icon-test_1_a'],
            ['foo/ICON-test', 'ICON-test'],
            ['foo/test/icon-test.foo.Sv g', 'test-icon-test-foo']
        ])(
            '`getIconId` produces correctly icon IDs from given filePaths - relative file path: %s, results: %s',
            relativeFilePath => {
                expect(getIconId({ ...EMPTY_OPTIONS, relativeFilePath }));
            }
        );

        it('`getIconId` support backslashes as well as foward slashes', () => {
            expect(
                getIconId({
                    ...EMPTY_OPTIONS,
                    relativeFilePath: './foo\\bar\\icon.svg'
                })
            ).toBe('foo-bar-icon');
        });
    });
});
