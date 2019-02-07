/* global describe, it, expect */
import * as util from '../src';

describe('formatting', () => {
  it('Correctly parses a query to get the page number', () => {
    expect(util.getExtension(null)).toBe(null);
    expect(util.getExtension(undefined)).toBe(undefined);
    expect(util.getExtension('https://dev.mighty.com/media/lien_documents/2017-05/Contract-Ruth-2017-05-15_7ubceSG.docx')).toBe('docx');
    expect(util.getExtension('/media/lien_documents/2017-05/Contract-Ruth_Lara-2017-05-15_7ubc1SG.docx')).toBe('docx');
    expect(util.getExtension('Contract-Ruth_Lara-2017-05-15_7ubc1SG.docx')).toBe('docx');
  });
});
