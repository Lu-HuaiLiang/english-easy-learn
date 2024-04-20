export interface IWordDetail {
  word: string;
  forms: string[];
  explain_list: {
    pos: string;
    meaning: string;
  }[];
  pronounces: {
    type: string;
    phonetic: string;
    audio: {
      audio_url: string;
    };
  }[];
  synonyms: {
    cn_text: string;
    word: string[];
  };
  phrases: {
    text: string;
    trans: string[];
  }[];
  sentences: {
    text: string;
    tran: string;
    audio: {
      audio_url: string;
    };
    text_indexes: {
      start: number;
      end: number;
    }[];
  }[];
}

export enum OpenDisplayFrom {
  FloatBtn,
  Highlight,
  Close,
}
