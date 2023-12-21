import { resolve } from 'path';

import scssGen from '../scss';
import { renderSrcAttribute } from '../../../utils/css';

const renderSrcMock = renderSrcAttribute as any as jest.Mock;

const mockOptions = {
    name: 'test',
    prefix: 'tf',
    tag: 'b',
    codepoints: { 'my-icon': 0xf101 },
    assets: { 'my-icon': null },
    templates: {
        scss: resolve(__dirname, '../../../../templates/scss.hbs')
    }
} as any;

jest.mock('../../../utils/css', () => ({
    renderSrcAttribute: jest.fn(() => '"::src-attr::"')
}));

describe('`SCSS` asset generator', () => {
    beforeEach(() => {
        renderSrcMock.mockClear();
    });

    test('renders SCSS correctly with prefix and tag name options', async () => {
        expect(
            await scssGen.generate(mockOptions, Buffer.from(''))
        ).toMatchSnapshot();
    });

    test('renders SCSS correctly with `selector` option', async () => {
        expect(
            await scssGen.generate(
                { ...mockOptions, selector: '.my-selector' },
                Buffer.from('')
            )
        ).toMatchSnapshot();
    });

    test('calls renderSrcAttribute correctly and includes its return value in the rendered template', async () => {
        const fontBuffer = Buffer.from('::svg-content::');

        const result = await scssGen.generate(mockOptions, fontBuffer);

        expect(renderSrcMock).toHaveBeenCalledTimes(1);
        expect(renderSrcMock).toHaveBeenCalledWith(mockOptions, fontBuffer);

        expect(result).toContain('::src-attr::');
    });

    test('renders expected selector block', async () => {
        const sass = await scssGen.generate(mockOptions, Buffer.from(''));

        expect(sass).toContain('b[class^="tf-"]:before, b[class*=" tf-"]:before {');
        expect(sass).toContain('.tf-my-icon:before {');
    });

    test('renders expected variables', async () => {
        const sass = await scssGen.generate(mockOptions, Buffer.from(''));

        expect(sass).toContain('$test-font:');
        expect(sass).toContain('$test-map:');
    });

    test('renders expected selector block with `selector` option', async () => {
        const sass = await scssGen.generate(
            { ...mockOptions, selector: '.my-selector' },
            Buffer.from('')
        );

        expect(sass).toContain('.my-selector:before {');
        expect(sass).toContain('.my-selector.tf-my-icon:before {');
    });
});
