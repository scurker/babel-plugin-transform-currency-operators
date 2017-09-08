const arithmeticOperators = {
  '+': 'add',
  '-': 'subtract',
  '/': 'divide',
  '*': 'multiply'
};

const compareOperators = [
  '===',
  '==',
  '>',
  '<',
  '>=',
  '<='
];

export default function transformCurrencyOperators({ types: t }) {

  function expressionCallsCurrency(node, identifiers) {
    if (!node) {
      return false;
    }

    if (t.isCallExpression(node)) {
      return expressionCallsCurrency(node.callee, identifiers);
    }

    if (t.isMemberExpression(node)) {
      return expressionCallsCurrency(node.object, identifiers);
    }

    if (t.isBinaryExpression(node)) {
      return expressionCallsCurrency(node.left, identifiers);
    }

    return t.isIdentifier(node) && identifiers.includes(node.name);
  }

  function expressionContainsCurrency(path, methodName) {
    let { node } = path
      , currencyVariables = [];

    const VariableVisitor = {
      VariableDeclarator({ node }) {
        if (expressionCallsCurrency(node.init, [methodName, ...currencyVariables])) {
          currencyVariables.push(node.id.name);
        }
      }
    };

    if(t.isIdentifier(node)) {
      // Attempt to find any currency variables in scope
      let currentPath = path.parentPath;
      while(currentPath) {
        currentPath.traverse(VariableVisitor);
        currentPath = currentPath.parentPath;
      }
    }

    return node && expressionCallsCurrency(node, [methodName]) || (t.isIdentifier(node) && currencyVariables.includes(node.name));
  }

  function buildExpression(node, methodName) {
    let { operator, left, right } = node;

    if (t.isBinaryExpression(left)) {
      left = buildExpression(left);
    }

    let currencyMethod = arithmeticOperators[operator];

    if (currencyMethod) {
      return t.callExpression(
        t.memberExpression(
          t.isIdentifier(left) ? t.identifier(left.name) : left,
          t.identifier(currencyMethod)
        ),
        [right]
      );
    } else if(compareOperators.includes(operator)) {
      return t.binaryExpression(
        operator,
        t.memberExpression(
          left,
          t.identifier('value')
        ),
        expressionContainsCurrency({ node: right }, methodName) ? t.memberExpression(right, t.identifier('value')) : right
      );
    } else {
      return node;
    }
  }

  return {

    visitor: {

      VariableDeclarator({ node }, { opts }) {
        let { init } = node;

        if(t.isCallExpression(init) && init.callee.name === 'require' && init.arguments[0].value === 'currency.js') {
          opts.hasCurrency = true;
          opts.methodName = node.id.name;
        }

        return;
      },

      ImportDeclaration({ node }, { opts }) {
        let { source, specifiers } = node;

        if(source.value === 'currency.js') {
          let defaultImport = specifiers.find(specifier => t.isImportDefaultSpecifier(specifier));
          opts.hasCurrency = true;
          opts.methodName = defaultImport.local.name;
        }

        return;
      },

      BinaryExpression(path, { opts }) {
        if(opts.hasCurrency && expressionContainsCurrency(path.get('left'), opts.methodName)) {
          // Prevent replacement nodes from being visited multiple times
          path.stop();

          return path.replaceWith(buildExpression(path.node, opts.methodName));
        }

        return;
      }

    }

  }

}