module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'boundaries', 'import'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules', 'coverage'],
    settings: {
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
            },
        },
        'boundaries/elements': [
            {
                type: 'domain',
                pattern: 'src/domain',
            },
            {
                type: 'application',
                pattern: 'src/application',
            },
            {
                type: 'infrastructure',
                pattern: 'src/infrastructure',
            },
            {
                type: 'presentation',
                pattern: 'src/presentation',
            },
            {
                type: 'api',
                pattern: 'src/api',
            },
        ],
    },
    rules: {
        // Clean Code & Best Practices
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        'max-lines-per-function': [
            'warn',
            { max: 50, skipBlankLines: true, skipComments: true },
        ],

        // Naming Conventions
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'default',
                format: ['camelCase'],
                leadingUnderscore: 'allow',
            },
            {
                selector: 'variable',
                format: ['camelCase', 'UPPER_CASE'],
            },
            {
                selector: 'import',
                format: ['camelCase', 'PascalCase'],
            },
            {
                selector: 'typeLike', // Class, Interface, TypeAlias, Enum
                format: ['PascalCase'],
            },
            {
                selector: 'interface',
                format: ['PascalCase'],
                custom: {
                    regex: '^I[A-Z]',
                    match: false,
                },
            },
            {
                selector: 'enumMember',
                format: ['UPPER_CASE'],
            },
        ],

        // Architecture Boundaries
        'boundaries/element-types': [
            'error',
            {
                default: 'allow',
                rules: [
                    {
                        from: 'domain',
                        disallow: ['application', 'infrastructure', 'presentation', 'api'],
                        message: 'Domain layer must not depend on other layers',
                    },
                    {
                        from: 'application',
                        disallow: ['infrastructure', 'presentation', 'api'],
                        message:
                            'Application layer must not depend on infrastructure or presentation layers',
                    },
                    {
                        from: 'infrastructure',
                        allow: ['domain', 'application'],
                        message:
                            'Infrastructure layer should generally only depend on Domain and Application',
                    },
                    {
                        from: 'presentation',
                        allow: ['domain', 'application'],
                        message:
                            'Presentation layer should generally only depend on Domain and Application',
                    },
                ],
            },
        ],
    },
};
