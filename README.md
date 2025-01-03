This template provides a minimal setup for integrating React with TypeScript and Vite, including Hot Module Replacement (HMR) and basic ESLint rules. It supports two official plugins: 

- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)**, which uses **[Babel](https://babeljs.io/)** for Fast Refresh
- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)**, which utilizes **[SWC](https://swc.rs/)** for Fast Refresh.

If you're building a production application, it's recommended to expand the ESLint configuration by enabling type-aware lint rules. To do this, configure the `parserOptions` property in your ESLint config as follows:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

Then, replace `tseslint.configs.recommended` with either `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`. Optionally, you can also add `...tseslint.configs.stylisticTypeChecked`.

To enhance the React linting rules, install **[eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)** and update the config like so:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  settings: {
    react: {
      version: '18.3',
    },
  },
  plugins: {
    react,
  },
  rules: {
    // other rules...
    // Enable recommended rules from the React plugin
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

This setup is part of the **GrowMeOrganic-Assignment** project.  
