import resolveRelativePath from './resolveRelativePath';

const arithmeticOperators = {
  '+': 'add',
  '-': 'subtract',
  '/': 'divide',
  '*': 'multiply',
};

const compareOperators = ['===', '==', '>', '<', '>=', '<=', '!=', '!=='];

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

    return t.isIdentifier(node) && identifiers.has(node.name);
  }

  function pathContainsCurrency(refPath, methodName) {
    let { node } = refPath
      , currencyVariables = new Set([methodName]);

    const Visitors = {
      FunctionDeclaration({ node }) {
        if (
          expressionCallsCurrency(
            node.body.body.find(n => t.isReturnStatement(n)),
            currencyVariables
          )
        ) {
          currencyVariables.add(node.id.name);
        }
      },
      VariableDeclarator({ scope, node }) {
        if (expressionCallsCurrency(node.init, currencyVariables)) {
          let binding = scope.bindings[node.id.name] || {};
          if (
            binding.kind !== 'let' ||
            (binding.kind === 'let' && binding.scope === refPath.scope)
          ) {
            currencyVariables.add(node.id.name);
          }
        }
      },
      AssignmentExpression({ node }) {
        let { left, right } = node;
        if (!expressionCallsCurrency(right, currencyVariables)) {
          currencyVariables.delete(left.name);
        } else {
          currencyVariables.add(left.name);
        }
      },
    };

    // Attempt to find any currency variables in scope
    let currentPath = refPath.parentPath;
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
        pathContainsCurrency(path.get('right'), methodName)
          ? t.memberExpression(right, t.identifier('value'))
          : right
      );
    } else {
      return node;
    }
  }

  return {
    pre({ opts }) {
      let { filename } = opts
        , pluginOptions = this.opts
        , paths = Array.isArray(pluginOptions.customCurrency)
            ? pluginOptions.customCurrency.filter(path => typeof path === 'string')
            : typeof pluginOptions.customCurrency === 'string' ? [pluginOptions.customCurrency] : []
      this.currencyResolution = new Set(['currency.js', ...paths.map(path => resolveRelativePath(filename, path))]);
    },

    visitor: {
      VariableDeclarator({ node }, { opts, currencyResolution }) {
        let { init } = node;

        if (
          t.isCallExpression(init) &&
          init.callee.name === 'require' &&
          currencyResolution.has(init.arguments[0].value)
        ) {
          opts.hasCurrency = true;
          opts.methodName = node.id.name;
        }

        return;
      },

      ImportDeclaration({ node }, { opts, currencyResolution }) {
        let { source, specifiers } = node;

        if (currencyResolution.has(source.value)) {
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
          pathContainsCurrency(path.get('left'), opts.methodName)
        ) {
          // Prevent replacement nodes from being visited multiple times
          path.stop();

          path.replaceWith(buildExpression(path, opts.methodName));
          return;
        }

        return;
      },
    },
  };
}
