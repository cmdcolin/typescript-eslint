import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import * as tsutils from 'tsutils';

import * as util from '../util';
import { getParserServices } from '../util';

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
    const compilerOptions = program.getCompilerOptions();
    const typeChecker = program.getTypeChecker();
    const isNoImplicitThis = tsutils.isStrictCompilerOptionEnabled(
      compilerOptions,
      'noImplicitThis',
    );

    function collectArgumentTypes(types: ts.Type[]): ArgumentType {
      let result = ArgumentType.Other;

      for (const type of types) {
        if (isRegExpType(type)) {
          result |= ArgumentType.RegExp;
        } else if (isStringType(type)) {
          result |= ArgumentType.String;
        }
      }

      return result;
    }

    function test(memberNode: any) {
      // const objectNode = memberNode.object;
      const callNode = memberNode.parent as TSESTree.CallExpression;
      const [argumentNode] = memberNode.arguments;

      const argumentType = typeChecker.getTypeAtLocation(
        esTreeNodeToTSNodeMap.get(argumentNode),
      );
      const argumentTypes = tsutils.unionTypeParts(argumentType);
      console.log({ argumentTypes });
      return true;
    }

    return {
      CallExpression: test,
    };
  },
});
