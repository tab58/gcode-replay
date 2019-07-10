import { expect } from 'chai';

import * as actions from '../../src/parser/actions';
import { parse } from '../../src/parser/rs274';

const parserActions: { actions: { [key: string]: any } } = { actions };

describe('Testing parser actions', (): void => {
  describe('Line Structure', (): void => {
    it('should parse block deletes', (): void => {
      const line = '/N00001G3X0.5Y0.5(hello world)Z0.5\n';
      const { blockDelete } = parse(line, parserActions);
      // console.log(blockDelete);
      expect(blockDelete.text).to.be.equal("/");
      expect(blockDelete.offset).to.be.equal(0);
      expect(blockDelete.elements).to.be.deep.equal([]);
    });
    it('should parse line numbers', (): void => {
      const line = '/N00001G3X0.5Y0.5(hello world)Z0.5';
      const { lineNumber } = parse(line, parserActions);
      expect(lineNumber.line).to.be.equal(1);

      const line2 = '/G3X0.5Y0.5(hello world)Z0.5';
      const parsed: any = parse(line2, parserActions);
      const { lineNumber: lineNo2 } = parsed;
      // console.log(parsed);
      expect(lineNo2).to.be.null;
    });
    it('should parse EOLs', (): void => {

    });
  });
  describe('Block Tests', (): void => {
    it('should parse pure unary expressions', (): void => {
      const line = 'G3X[ln[cos[3]]]';
      debugger;
      const parsed: any = parse(line, parserActions);

      const exprNode = parsed.segments[1].value;
      const expected = {
        "type": "expression",
        "value": {
          "type": "ordinary_unary_combo",
          "operator": "ln",
          "expression": {
            "type": "expression",
            "value": {
              "type": "ordinary_unary_combo",
              "operator": "cos",
              "expression": {
                "type": "expression",
                "value": {
                  "type": "real_number",
                  "value": 3
                }
              }
            }
          }
        }
      };
      expect(exprNode).to.be.deep.equal(expected);
    });
  //   it('should parse parameter settings correctly', (): void => {
  //     const line = '#3=15';
  //     const parsed = parse(line, parserActions);
  //     expect(parsed).to.be.deep.equal({
  //       "elements": [
  //         {
  //           "elements": [],
  //           "offset": 0,
  //           "text": "",
  //         },
  //         {
  //           "elements": [],
  //           "offset": 0,
  //           "text": "",
  //         },
  //         {
  //           "elements": [
  //             {
  //               "code": "3",
  //               "type": "parameter_setting",
  //               "value": "15",
  //             }
  //           ],
  //           "offset": 0,
  //           "text": "#3=15",
  //         },
  //         {
  //           "elements": [],
  //           "offset": 5,
  //           "text": "",
  //         }
  //       ],
  //       "offset": 0,
  //       "text": "#3=15",
  //       "type": "make_line"
  //     });
  //   });
  });
});