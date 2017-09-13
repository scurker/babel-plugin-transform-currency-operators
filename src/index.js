const arithmeticOperators = {
  '+': 'add',
  '-': 'subtract',
  '/': 'divide',
  '*': 'multiply',
};

const compareOperators = ['===', '==', '>', '<', '>=', '<='];

export default function transformCurrencyOperators({ types: t }) {
  function expressionCallsCurrency(node, identifiers) {
    if (!node) {
      return false;
    }

    if (t.isBinaryExpression(node)) {
      return expressionCallsCurrency(node.left, identifiers);
    }

    if (t.isCallExpression(node)) {
      return expressionCallsCurrency(node.callee, identifiers);
    }

    if (t.isMemberExpression(node)) {
      return expressionCallsCurrency(node.object, identifiers);
    }

    if (t.isFunctionExpression(node)) {
      return expressionCallsCurrency(
        node.body.body.find(n => t.isReturnStatement(n)),
        identifiers
      );
    }

    if (t.isArrowFunctionExpression(node)) {
      if (t.isCallExpression(node.body)) {
        return expressionCallsCurrency(node.body, identifiers);
      } else if (t.isBlockStatement(node.body)) {
        return expressionCallsCurrency(
          node.body.body.find(n => t.isReturnStatement(n)),
          identifiers
        );
      }
    }

    if (t.isReturnStatement(node)) {
      return expressionCallsCurrency(node.argument.callee, identifiers);
    }

    return t.isIdentifier(node) && identifiers.includes(node.name);
  }

  function expressionContainsCurrency(path, methodName) {
    let { node } = path
      , currencyVariables = [methodName];

    const Visitors = {
      FunctionDeclaration({ node }) {
        if (
          expressionCallsCurrency(
            node.body.body.find(n => t.isReturnStatement(n)),
            [methodName, ...currencyVariables]
          )
        ) {
          currencyVariables.push(node.id.name);
        }
      },
      VariableDeclarator({ node }) {
        if (expressionCallsCurrency(node.init, currencyVariables)) {
          currencyVariables.push(node.id.name);
        }
      },
      AssignmentExpression({ node }) {
        let { left, right } = node;
        if (!expressionCallsCurrency(right, currencyVariables)) {
          currencyVariables = currencyVariables.filter(x => x !== left.name);
        } else {
          currencyVariables.push(left.name);
        }
      },
    };

    // Attempt to find any currency variables in scope
    let currentPath = path.parentPath;
    while (currentPath) {
      currentPath.traverse(Visitors);
      currentPath = currentPath.parentPath;
    }

    return node && expressionCallsCurrency(node, currencyVariables);
  }

  function buildExpression(path, methodName) {
    let { node } = path
      , { operator, left, right } = node;

    if (t.isBinaryExpression(left)) {
      left = buildExpression(path.get('left'));
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
    } else if (
      compareOperators.includes(operator) &&
      !t.isMemberExpression(node.left)
    ) {
      return t.binaryExpression(
        operator,
        t.memberExpression(left, t.identifier('value')),
        expressionContainsCurrency(path.get('right'), methodName)
          ? t.memberExpression(right, t.identifier('value'))
          : right
      );
    } else {
      return node;
    }
  }

  return {
    visitor: {
      VariableDeclarator({ node }, { opts }) {
        let { init } = node;

        if (
          t.isCallExpression(init) &&
          init.callee.name === 'require' &&
          init.arguments[0].value === 'currency.js'
        ) {
          opts.hasCurrency = true;
          opts.methodName = node.id.name;
        }

        return;
      },

      ImportDeclaration({ node }, { opts }) {
        let { source, specifiers } = node;

        if (source.value === 'currency.js') {
          let defaultImport = specifiers.find(specifier =>
            t.isImportDefaultSpecifier(specifier)
          );
          opts.hasCurrency = true;
          opts.methodName = defaultImport.local.name;
        }

        return;
      },

      BinaryExpression(path, { opts }) {
        if (
          opts.hasCurrency &&
          expressionContainsCurrency(path.get('left'), opts.methodName)
        ) {
          // Prevent replacement nodes from being visited multiple times
          path.stop();

          return path.replaceWith(buildExpression(path, opts.methodName));
        }

        return;
      },
    },
  };
}
