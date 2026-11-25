import autobind from 'autobind-decorator';

import { GetController } from '../../../app/controller/GetController';

import { generateContent } from './content';

@autobind
export class SubjectDetailsErrorGetController extends GetController {
  constructor() {
    super(__dirname + '/template', generateContent);
  }
}
