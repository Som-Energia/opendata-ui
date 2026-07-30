// eslint flat config — StandardJS rules using only core rules (no plugins)
// See: https://github.com/standard/eslint-config-standard

export default [
  {
    ignores: ['dist/', '*.json', 'node_modules/', 'eslint.config.mjs']
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
        URL: 'readonly',
        console: 'readonly',
        test: 'readonly',
        expect: 'readonly'
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      // Possible errors
      'no-cond-assign': ['error', 'always'],
      'no-console': 'warn',
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-empty-character-class': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-func-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-loss-of-precision': 'error',
      'no-misleading-character-class': 'error',
      'no-obj-calls': 'error',
      'no-prototype-builtins': 'error',
      'no-regex-spaces': 'error',
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'error',
      'no-unexpected-multiline': 'error',
      'no-unreachable': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': ['error', { enforceForOrderingRelations: true }],
      'no-useless-backreference': 'error',
      'use-isnan': ['error', { enforceForSwitchCase: true, enforceForIndexOf: true }],
      'valid-typeof': ['error', { requireStringLiterals: true }],

      // Best practices
      'accessor-pairs': ['error', { setWithoutGet: true, enforceForClassMembers: true }],
      'array-callback-return': ['error', { allowImplicit: false, checkForEach: false }],
      'curly': ['error', 'multi-line'],
      'default-case-last': 'error',
      'dot-location': ['error', 'property'],
      'dot-notation': ['error', { allowKeywords: true }],
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-caller': 'error',
      'no-case-declarations': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-label': 'error',
      'no-fallthrough': 'error',
      'no-floating-decimal': 'error',
      'no-global-assign': 'error',
      'no-implied-eval': 'error',
      'no-iterator': 'error',
      'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
      'no-lone-blocks': 'error',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-redeclare': ['error', { builtinGlobals: false }],
      'no-return-assign': ['error', 'except-parens'],
      'no-self-assign': ['error', { props: true }],
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unused-expressions': ['error', {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }],
      'no-unused-vars': ['warn', {
        args: 'none',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
        vars: 'all'
      }],
      'no-use-before-define': ['error', { functions: false, classes: false, variables: false }],
      'no-useless-call': 'error',
      'no-useless-catch': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      'no-with': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
      'wrap-iife': ['error', 'any', { functionPrototypeMethods: true }],
      'yoda': ['error', 'never'],

      // Strict mode
      'strict': ['error', 'never'],

      // Variables
      'no-delete-var': 'error',
      'no-label-var': 'error',
      'no-shadow-restricted-names': 'error',
      'no-undef': 'error',
      'no-undef-init': 'error',
      'no-unused-labels': 'error',

      // Stylistic
      'array-bracket-spacing': ['error', 'never'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'block-spacing': ['error', 'always'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'camelcase': ['error', { allow: ['^UNSAFE_'], properties: 'never', ignoreGlobals: true }],
      'comma-dangle': ['error', {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }],
      'comma-spacing': ['error', { before: false, after: true }],
      'comma-style': ['error', 'last'],
      'computed-property-spacing': ['error', 'never', { enforceForClassMembers: true }],
      'eol-last': 'error',
      'func-call-spacing': ['error', 'never'],
      'generator-star-spacing': ['error', { before: true, after: true }],
      'indent': ['error', 2, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: { parameters: 1, body: 1 },
        FunctionExpression: { parameters: 1, body: 1 },
        CallExpression: { arguments: 1 },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoreComments: false,
        ignoredNodes: ['TemplateLiteral *', 'JSXElement', 'JSXElement > *',
          'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName',
          'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer',
          'JSXOpeningElement', 'JSXClosingElement', 'JSXFragment',
          'JSXOpeningFragment', 'JSXClosingFragment', 'JSXText',
          'JSXEmptyExpression', 'JSXSpreadChild'],
        offsetTernaryExpressions: true
      }],
      'jsx-quotes': ['error', 'prefer-single'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      'multiline-ternary': ['error', 'always-multiline'],
      'new-cap': ['error', { newIsCap: true, capIsNew: false, properties: true }],
      'new-parens': 'error',
      'no-array-constructor': 'error',
      'no-bitwise': 'off',
      'no-extra-parens': ['error', 'functions'],
      'no-lonely-if': 'off',
      'no-mixed-operators': ['error', {
        groups: [
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof']
        ],
        allowSamePrecedence: true
      }],
      'no-mixed-spaces-and-tabs': 'error',
      'no-multi-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      'no-new-object': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.object.name="console"][callee.property.name!=/^(warn|error|info|trace)$/]',
          message: 'Unexpected console statement'
        }
      ],
      'no-tabs': 'error',
      'no-trailing-spaces': 'error',
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'no-whitespace-before-property': 'error',
      'object-curly-newline': ['error', { multiline: true, consistent: true }],
      'object-curly-spacing': ['error', 'always'],
      'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
      'one-var': ['error', { initialized: 'never' }],
      'operator-linebreak': ['error', 'after', {
        overrides: { '?': 'before', ':': 'before', '|>': 'before' }
      }],
      'padded-blocks': ['error', { blocks: 'never', switches: 'never', classes: 'never' }],
      'prefer-const': ['error', { destructuring: 'all' }],
      'prefer-object-spread': 'error',
      'quote-props': ['error', 'as-needed'],
      'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
      'rest-spread-spacing': ['error', 'never'],
      'semi': ['error', 'never'],
      'semi-spacing': ['error', { before: false, after: true }],
      'semi-style': ['error', 'last'],
      'space-before-blocks': ['error', 'always'],
      'space-before-function-paren': ['error', 'always'],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': ['error', { words: true, nonwords: false }],
      'spaced-comment': ['error', 'always', {
        line: { markers: ['*package', '!', '/', ',', '='] },
        block: { balanced: true, markers: ['*package', '!', ',', ':', '::', 'flow-include'], exceptions: ['*'] }
      }],
      'switch-colon-spacing': ['error', { after: true, before: false }],
      'symbol-description': 'error',
      'template-curly-spacing': ['error', 'never'],
      'template-tag-spacing': ['error', 'never'],
      'unicode-bom': ['error', 'never'],
      'yield-star-spacing': ['error', 'both'],

      // ES6
      'arrow-body-style': ['warn', 'as-needed', { requireReturnForObjectLiteral: false }],
      'constructor-super': 'error',
      'no-class-assign': 'error',
      'no-const-assign': 'error',
      'no-dupe-class-members': 'error',
      'no-duplicate-imports': 'error',
      'no-new-symbol': 'error',
      'no-this-before-super': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': 'error',
      'no-var': 'warn',
      'object-shorthand': ['warn', 'properties'],
      'prefer-arrow-callback': ['warn', { allowNamedFunctions: true }],
      'prefer-spread': 'warn',
      'prefer-template': 'warn',
      'require-yield': 'error',
      'sort-imports': ['off', { ignoreDeclarationSort: true }]
    }
  }
]
