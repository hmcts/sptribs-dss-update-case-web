import { AnyObject } from '../controller/PostController';

export type FieldFormats = Record<string, string | ((AnyObject) => AnyObject)>;

export interface Case {
  subjectFullName: string;
  subjectDOB: CaseDate;
}

export interface CaseWithId extends Case {
  id: string;
  state: any;
}

export enum Checkbox {
  Checked = 'checked',
  Unchecked = '',
}

export interface CaseDate {
  year: string;
  month: string;
  day: string;
}

export enum LanguagePreference {
  English = 'english',
  Welsh = 'welsh',
}

export interface UploadedFile {
  id: string;
  name: string;
}

export enum FieldPrefix {
  APPLICANT = 'applicant',
}
