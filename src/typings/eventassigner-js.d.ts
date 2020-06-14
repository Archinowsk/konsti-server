declare module 'eventassigner-js' {
  import { Input, OpaAssignResults } from 'typings/opaAssign.typings';
  const defaultImport: { eventAssignment: (input: Input) => OpaAssignResults };
  export = defaultImport;
}
