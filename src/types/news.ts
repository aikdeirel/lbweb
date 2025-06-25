export type NewsType = 'status' | 'visual' | 'video' | 'link';

export interface NewsItem {
    _id: number;
    type: NewsType;
    happened: string;
    description: string[];
    link_text?: string;
    link?: string;
    picture_large?: string;
    picture_full?: string;
    picture_alt?: string;
    video?: string;
    post_sub?: Array<{
        _id: number;
        type: NewsType;
        link_text: string;
        link: string;
        picture_large: string;
        picture_full?: string;
        picture_alt?: string;
    }>;
    structuredData?: any[];
}

