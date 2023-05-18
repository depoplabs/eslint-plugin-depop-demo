import { ESLintUtils } from "@typescript-eslint/utils";
import { rule } from "../../../lib/rules/class-methods-observation-service-watch";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
});

ruleTester.run("class-methods-observation-service-watch", rule, {
  valid: [
    {
      code: `
        interface IMyControllerArgs {
          observationService: IObservationService;
        }
        export class MyController {
          constructor(args: IMyControllerArgs) {
            this.doSomething = args.observationService.watch(this.doSomething, {
              classFunctionName: 'MyController.doSomething',
              layerName: Layer.Controller
            });
          }
          public doSomething = async () => {
            // implementation
          };
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        interface IMyControllerArgs {
          observationService: IObservationService;
        }
        export class MyController {
          constructor(args: IMyControllerArgs) {}
          public doSomething = async () => {
            // implementation
          };
        }
      `,
      errors: [{ messageId: "publicClassMethodsMustBeWatched" }],
    },
  ],
});
