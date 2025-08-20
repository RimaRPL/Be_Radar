declare module 'bad-words' {
  export default class Filter {
    constructor(options?: {
      emptyList?: boolean;
      placeHolder?: string;
      regex?: string | RegExp;
      replaceRegex?: string | RegExp;
    });

    isProfane(word: string): boolean;
    clean(text: string): string;
    addWords(...words: string[]): void;
    removeWords(...words: string[]): void;
  }
}
