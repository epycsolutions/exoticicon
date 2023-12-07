export enum FontAssetType {
    EOT = 'eot',
    WOFF2 = 'woff2',
    WOFF = 'woff',
    TTF = 'ttf',
    SVG = 'svg'
}

export enum OtherAssetType {
    CSS = 'css',
    SCSS = 'scss',
    SASS = 'sass',
    HTML = 'html',
    JSON = 'json',
    TS = 'ts'
}

export const ASSET_TYPES_WITH_TEMPLATES = [
    OtherAssetType.CSS,
    OtherAssetType.HTML,
    OtherAssetType.SCSS,
    OtherAssetType.SASS
]

export const ASSET_TYPES = { ...FontAssetType, ...OtherAssetType }

export type AssetType = FontAssetType | OtherAssetType

export interface GetIconOptions {
    basename: string
    relativeDirPath: string
    absoluteFilePath: string
    relativeFilePath: string
    index: number
}

export type GetIconIdFn = (options: GetIconOptions) => string