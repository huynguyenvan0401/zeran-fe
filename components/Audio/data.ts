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


export const dataJson = [
    {
        start: 3.99,
        end: 8.43,
        text: "2番 女の人が友達と話しています。"
    },
    {
        start: 9.77,
        end: 14.01,
        text: "女の人は地震に備えて何をしておけばいいですか。"
    },
    {
        start: 15.91,
        end: 19.09,
        text: "この間の地震、かなり揺れて怖かったね。"
    },
    {
        start: 20.15,
        end: 27.31,
        text: "地震が来た時のために、 何かしとかなくちゃって思ってるんだけど、 実際にどういうことをすればいいのかな。"
    },
    {
        start: 28.03,
        end: 36.25,
        text: "やっぱり怖いのは家具が倒れることだから、本棚とか背の高い家具があったら、壁に固定した方がいいよ。"
    },
    {
        start: 37.35,
        end: 42.67,
        text: "ああ、でもうちの家具、みんな背が低いから、それは大丈夫かな。"
    },
    {
        start: 43.13,
        end: 43.57,
        text: "そっか。"
    },
    {
        start: 45.11,
        end: 47.31,
        text: "あ、それから避難用のセットはある?"
    },
    {
        start: 48.21,
        end: 54.47,
        text: "すぐ持ち出せるように水や食べ物を入れた袋は必ず用意しておいた方がいいって、テレビで言ってたよ。"
    },
    {
        start: 54.73,
        end: 56.71,
        text: "あ、それは持ってないな。"
    },
    {
        start: 57.39,
        end: 58.39,
        text: "どこで売ってるの?"
    },
    {
        start: 58.79,
        end: 60.01,
        text: "デパートとかにあるよ。"
    },
    {
        start: 60.39,
        end: 61.85,
        text: "じゃあ探してみる。"
    },
    {
        start: 61.91,
        end: 67.39,
        text: "あとは、うちの人と話し合って家族の避難場所を決めておいた方がいいよ。"
    },
    {
        start: 67.39,
        end: 73.71,
        text: "あ、でも、今家族はみんな海外に住んでるから、それは関係ないかな。"
    },
    {
        start: 75.27,
        end: 75.97,
        text: "いろいろありがとう。"
    },
    {
        start: 81.92,
        end: 86.62,
        text: "女の人は地震に備えて何をしておけばいいですか?"
    }
]

export const getTrans = (data: DataSub[]) => {
    let subtiles: Sentence[] = [];
    data.map((item) => {
        let sentence: Sentence = {
            start: item.start,
            end: item.end,
            vn: "",
            transcripts: [
                {
                    start: item.start,
                    end: item.end,
                    text: item.text
                }
            ]
        }
        subtiles.push(sentence);
    })
    return subtiles;
}
