import { isReportBottomSheetPath, isFAQBottomSheetPath } from 'utils/bottom-sheet';

describe('bottomSheetUtils', function () {
  describe('#isReportBottomSheetPath', function () {
    it('returns true if path is report bottom sheet', function () {
      isReportBottomSheetPath('/reporting/1').should.be.true();
      isReportBottomSheetPath('/edit/reporting/1').should.be.true();
    });

    it('returns false if path is not report bottom sheet', function () {
      isReportBottomSheetPath('/foo/bar').should.be.false();
      isReportBottomSheetPath('/edit/foo/bar').should.be.false();
    });
  });

  describe('#isFAQBottomSheetPath', function () {
    it('returns true if path is faq bottom sheet', function () {
      isFAQBottomSheetPath('/faq/1').should.be.true();
      isFAQBottomSheetPath('/edit/faq/1').should.be.true();
    });

    it('returns false if path is not faq bottom sheet', function () {
      isFAQBottomSheetPath('/foo/bar').should.be.false();
      isFAQBottomSheetPath('/edit/foo/bar').should.be.false();
    });
  });
});