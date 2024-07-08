export type Transcript = {
    start: number,
    end: number,
    text: string,
}

export type Sentence = {
    start: number,
    end: number,
    vn: string,
    furigana: string,
    transcripts: Transcript[],
}

export type DataSub = {
    start: number,
    end: number,
    text: string,
}
