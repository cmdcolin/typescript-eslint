import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import * as tsutils from 'tsutils';

import * as util from '../util';
import { getParserServices } from '../util';

let i = 0;

export function describeNode(node: TSESTree.Node): string {
  switch (node.type) {
    case AST_NODE_TYPES.ArrayExpression:
      return `Array`;

    case AST_NODE_TYPES.Literal:
      return `Literal value ${node.raw}`;

    default:
      return '🤷';
  }
}

export default util.createRule({
  name: 'expect-array-object-fromentries',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Check that the value you are passing to Object.fromEntries is an array',
      recommended: 'error',
      requiresTypeChecking: true,
    },
    messages: {
      expectArrayObjectFromEntries:
        'Expected array for `{{type}}` typed value.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { program, esTreeNodeToTSNodeMap } = util.getParserServices(context);
    const checker = program.getTypeChecker();
    const typeChecker = program.getTypeChecker();

    function test(node: any) {
      const [argumentNode] = node.arguments;
      const typeName = util.getTypeName(
        typeChecker,
        checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(argumentNode)),
      );

      // hacky way to check if a array
      if (!typeName.endsWith('[]')) {
        context.report({
          data: {
            name: context.getSourceCode().getText(node),
          },
          messageId: 'expectArrayObjectFromEntries',
          node,
        });
      }
    }

    return {
      CallExpression: test,
    };
  },
});
