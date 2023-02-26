import rule from '../../src/rules/expect-array-object-fromentries';
import { getFixturesRootDir, RuleTester } from '../RuleTester';

const rootDir = getFixturesRootDir();
const messageId = 'await';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    tsconfigRootDir: rootDir,
    project: './tsconfig.json',
  },
  parser: '@typescript-eslint/parser',
});

ruleTester.run('expect-array-object-fromentries', rule, {
  valid: [
    "Object.fromEntries([['a',1],['b',2]]);",
    "const val=[['a',1],['b',2]]; Object.fromEntries(val);",
  ],
  invalid: [
    {
      code: 'Object.fromEntries({a:1,b:2})',
      output: 'Object.fromEntries({a:1,b:2})',
      errors: [{ messageId: 'expectArrayObjectFromEntries' }],
    },
    {
      code: 'const val={a:1,b:2}; Object.fromEntries(val)',
      output: 'const val={a:1,b:2}; Object.fromEntries(val)',
      errors: [{ messageId: 'expectArrayObjectFromEntries' }],
    },
  ],
});
