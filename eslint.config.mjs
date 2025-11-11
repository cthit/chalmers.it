import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __custom_filename = fileURLToPath(import.meta.url);
const __custom_dirname = dirname(__custom_filename);

const compat = new FlatCompat({
  baseDirectory: __custom_dirname
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'warn',
      'no-unused-vars': 'off',
      'prefer-const': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_'
        }
      ]
    }
  }
];

export default eslintConfig;
