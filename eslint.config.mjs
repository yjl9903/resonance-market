import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off', // @ts-ignore注释的使用限制
      '@typescript-eslint/no-explicit-any': 'off', // any类型使用限制
      '@stylistic/arrow-parens': 'off', // 箭头函数参数括号使用规则
      '@stylistic/quote-props': 'off' // 对象属性名引号使用规则
    }
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/attribute-hyphenation': 'off', // 模板属性是否必须使用连字符
      'vue/max-attributes-per-line': ['warn', { // 单行最大属性数
        singleline: {
          max: 3 // 单行最大属性数
        },
        multiline: {
          max: 1 // 多行最大属性数
        }
      }],
      'vue/attributes-order': 'off', // 属性顺序
      'vue/multi-word-component-names': 'off', // 组件名多个单词
      'vue/html-self-closing': ['error', { // 自闭合标签
        html: {
          void: 'always', // 空标签，强制自闭合
          normal: 'any', // 普通HTML标签，不强制自闭合
          component: 'always' // 组件，强制自闭合
        }
      }],
      'vue/singleline-html-element-content-newline': 'off', // 单行元素内容换行
      'vue/multiline-html-element-content-newline': 'off', // 多行元素内容换行
      'vue/require-default-prop': 'off' // prop必须有默认值
    }
  }
);
