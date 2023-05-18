# Ensures that public class methods are being watched by the observationService's watch method

This is an eslint rule to enforce that public class methods are always watched by the ObservationService's `watch` method. This is a pattern heavily used in web api.

## Rule Details

This rule aims to enforce that public class methods are always watched by the ObservationService's watch method.

Examples of **incorrect** code for this rule:

```js

class MyController {
  constructor() {}
  public doSomething = async () => {
    // implementation
  };
}

```

Examples of **correct** code for this rule:

```js

class MyController {
  constructor(args: IMyControllerArgs) {
    this.doSomething = args.observationService.watch(this.doSomething, {
      classFunctionName: 'MyController.doSomething',
      layerName: Layer.Controller,
      excludeFailures: (e) => isClientSideError(e.code),
    });
  }
  public doSomething = async () => {
    // implementation
  };
}

```

## When Not To Use It

When you are not using an ObservationService or you are creating a utility class that doesnt need methods watched.