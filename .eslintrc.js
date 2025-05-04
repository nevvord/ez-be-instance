export default {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    // Запрещаем использование дефолтных экспортов
    'import/no-default-export': 'error',
    
    // Запрещаем экспорт классов
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ExportNamedDeclaration[declaration.type="ClassDeclaration"]',
        message: 'Prefer functional approach over classes',
      },
    ],
    
    // Стиль кода
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // Импорты между слоями
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@api/*'],
            message: 'Imports from api layer are not allowed in services, db, config, or shared',
          },
          {
            group: ['@services/*'],
            message: 'Imports from services layer are not allowed in db, config, or shared',
          },
          {
            group: ['@db/*'],
            message: 'Imports from db layer are not allowed in config or shared',
          },
          {
            group: ['@config/*'],
            message: 'Imports from config layer are not allowed in shared',
          },
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  overrides: [
    {
      files: ['src/shared/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error', 
          {
            patterns: [
              '@api/*', 
              '@services/*', 
              '@db/*', 
              '@config/*'
            ]
          }
        ],
      },
    },
    {
      files: ['src/config/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error', 
          {
            patterns: [
              '@api/*', 
              '@services/*', 
              '@db/*'
            ]
          }
        ],
      },
    },
  ],
}; 