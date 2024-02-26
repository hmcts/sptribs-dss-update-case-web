import { enContent } from './content';
import { UploadFormSummary } from './utils';

describe('Form Summary > check-your-answers', () => {
  describe('UploadFormSummary', () => {
    test.each([
      {
        userCase: [{ fileName: 'a.txt', description: 'testFile' }],
        expected: {
          rows: [
            {
              actions: {
                items: [
                  {
                    href: '/upload-documents',
                    text: 'change',
                    visuallyHiddenText: 'Additional information',
                  },
                ],
              },
              key: {
                text: 'Additional information',
              },
              value: {
                text: 'test',
              },
            },
            {
              actions: {
                items: [
                  {
                    href: '/upload-documents',
                    text: 'change',
                    visuallyHiddenText: 'undefined',
                  },
                ],
              },
              key: {
                html: 'Additional documents',
              },
              value: {
                html: 'a.txt',
              },
            },
            {
              actions: {
                items: [
                  {
                    href: '/upload-documents',
                    text: 'change',
                    visuallyHiddenText: 'undefined',
                  },
                ],
              },
              key: {
                html: 'Why is this relevant to the case?',
              },
              value: {
                html: 'testFile',
              },
            },
          ],
          title: 'List of documents uploaded ',
        },
      },
    ])('return correct summary list items', ({ userCase, expected }) => {
      expect(UploadFormSummary(enContent, userCase, 'test')).toEqual(expected);
    });
  });
});
