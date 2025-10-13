import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:prettier/recommended'),
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  {
    rules: {
      // Prettier
      'prettier/prettier': ['error'],

      // Conventions de nommage plus souples
      'react/jsx-pascal-case': 'error',
      camelcase: [
        'warn',
        {
          properties: 'always',
          ignoreDestructuring: true,
          ignoreImports: true,
          ignoreGlobals: true,
          // Ignorer les propriétés qui viennent de Payload (snake_case)
          allow: [
            'en_attente', 'en_cours', 'code_formation', 'date_creation', 'date_modification',
            'contact_formateur', 'super_admin', 'programme_detail', 'modalites_acces',
            'public_concerne', 'delais_mise_en_place', 'modalites_reglement',
            'modalites_pedagogiques', 'ressources_dispo', 'modalites_evaluation',
            'types_evaluation', 'plateforme_evaluation', 'grille_analyse',
            'greater_than_equal', 'less_than_equal', 'not_equals'
          ],
        },
      ],

      // Types plus souples
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // React
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'warn',

      // Accessibilité
      'jsx-a11y/alt-text': 'warn',
      '@next/next/no-img-element': 'warn',
    },
  },
]

export default eslintConfig
