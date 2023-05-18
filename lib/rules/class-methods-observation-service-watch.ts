import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/depop/eslint-plugin-depop-demo/blob/master/docs/rules/${name}.md`
);

export const rule = createRule({
  create(context) {
    return {
      ClassDeclaration: (node) => {
        const publicMethods = node.body.body.filter(
          (item): item is TSESTree.PropertyDefinition =>
            item.type === TSESTree.AST_NODE_TYPES.PropertyDefinition &&
            item.accessibility === "public" &&
            item.value?.type === TSESTree.AST_NODE_TYPES.ArrowFunctionExpression
        );

        publicMethods.forEach((publicMethod) => {
          if (publicMethod.key.type === TSESTree.AST_NODE_TYPES.Identifier) {
            let expectedMethodName = publicMethod.key.name;

            const constructorMatch = node.body.body.find(
              (item): item is TSESTree.MethodDefinition =>
                item.type === TSESTree.AST_NODE_TYPES.MethodDefinition &&
                item.kind === "constructor"
            );

            if (!constructorMatch) {
              return context.report({
                messageId: "publicClassMethodsMustBeWatched",
                node: publicMethod,
              });
            }

            const watchMatch = constructorMatch.value.body?.body.find(
              (statement) => {
                if (
                  statement.type ===
                    TSESTree.AST_NODE_TYPES.ExpressionStatement &&
                  statement.expression.type ===
                    TSESTree.AST_NODE_TYPES.AssignmentExpression &&
                  statement.expression.right.type ===
                    TSESTree.AST_NODE_TYPES.CallExpression &&
                  statement.expression.right.callee.type ===
                    TSESTree.AST_NODE_TYPES.MemberExpression &&
                  ((statement.expression.right.callee.object.type ===
                    TSESTree.AST_NODE_TYPES.MemberExpression &&
                    statement.expression.right.callee.object.property.type ===
                      TSESTree.AST_NODE_TYPES.Identifier &&
                    statement.expression.right.callee.object.property.name ===
                      "observationService") ||
                    (statement.expression.right.callee.object.type ===
                      TSESTree.AST_NODE_TYPES.Identifier &&
                      statement.expression.right.callee.object.name ===
                        "observationService")) &&
                  statement.expression.right.callee.property.type ===
                    TSESTree.AST_NODE_TYPES.Identifier &&
                  statement.expression.right.callee.property.name === "watch" &&
                  statement.expression.right.arguments[0].type ===
                    TSESTree.AST_NODE_TYPES.MemberExpression &&
                  statement.expression.right.arguments[0].object.type ===
                    TSESTree.AST_NODE_TYPES.ThisExpression &&
                  statement.expression.right.arguments[0].property.type ===
                    TSESTree.AST_NODE_TYPES.Identifier &&
                  statement.expression.right.arguments[0].property.name ===
                    expectedMethodName
                ) {
                  return true;
                }
                return false;
              }
            );

            if (!watchMatch) {
              return context.report({
                messageId: "publicClassMethodsMustBeWatched",
                node: publicMethod,
              });
            }
          }
        });
      },
    };
  },
  name: "class-methods-observation-service-watch",
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description:
        "Ensures that public class methods are being watched by the ObservationService's watch method",
      recommended: "error",
    },
    messages: {
      publicClassMethodsMustBeWatched:
        "Any public class method must be watched by the observationService",
    },
    schema: [], // Add a schema if the rule has options
  },
  defaultOptions: [],
});
