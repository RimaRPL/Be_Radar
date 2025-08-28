declare module 'pdf-poppler' {
  interface PopplerConvertOptions {
    format?: string;
    out_dir?: string;
    out_prefix?: string;
    page?: number | null;
  }

  export class Poppler {
    static convert(pdfPath: string, options?: PopplerConvertOptions): Promise<void>;
  }
}
