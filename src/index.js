const operators = {
  '+': 'add',
  '-': 'subtract',
  '/': 'divide',
  '*': 'multiply'
};

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
    let { node, scope } = path
      , currencyVariables = [];

    const VariableVisitor = {
      VariableDeclarator({ node }) {
        if (expressionCallsCurrency(node.init, [methodName, ...currencyVariables])) {
          currencyVariables.push(node.id.name);
        }
      }
    };

    if(t.isIdentifier(node.left) && path.scope.hasBinding(node.left.name)) {
      scope.path.traverse(VariableVisitor);
    }

    return node && expressionCallsCurrency(node.left, [methodName]) || (t.isIdentifier(node.left) && currencyVariables.includes(node.left.name));
  }

  function buildExpression(node, methodName) {
    let { operator, left, right } = node;

    if (t.isBinaryExpression(left)) {
      left = buildExpression(left);
    } else if (t.isNumericLiteral(left)) {
      left = t.callExpression(t.identifier(methodName), [t.numericLiteral(left.value)])
    }

    let currencyMethod = operators[operator];

    if (currencyMethod) {
      return t.callExpression(
        t.memberExpression(
          t.isIdentifier(left) ? t.identifier(left.name) : left,
          t.identifier(currencyMethod)
        ),
        [right]
      );
    } else {
      return node;
    }
  }

  return {

    visitor: {

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
        if(opts.hasCurrency && expressionContainsCurrency(path, opts.methodName)) {
          return path.replaceWith(buildExpression(path.node, opts.methodName));
        }

        return;
      }

    }

  }

};