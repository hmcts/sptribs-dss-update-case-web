import autobind from 'autobind-decorator';

import { GetController } from '../../../app/controller/GetController';

import { generateContent } from './content';

@autobind
export class CaseNotFoundGetController extends GetController {
  constructor() {
    super(__dirname + '/template', generateContent);
  }
}
