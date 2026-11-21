import autobind from 'autobind-decorator';

import { GetController } from '../../../app/controller/GetController';

import { generateContent } from './content';

@autobind
export class CCDNotAuthorisedGetController extends GetController {
  constructor() {
    super(__dirname + '/template', generateContent);
  }
}
