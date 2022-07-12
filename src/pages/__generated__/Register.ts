/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LocalUserInput } from "./../../../codegen/__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_registerLocal {
  __typename: "User";
  id: string;
}

export interface Register {
  registerLocal: Register_registerLocal | null;
}

export interface RegisterVariables {
  user: LocalUserInput;
}
