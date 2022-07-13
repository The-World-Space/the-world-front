/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCurrentUser
// ====================================================

export interface GetCurrentUser_currentUser {
  __typename: "User";
  id: string;
  username: string;
  createdAt: any;
}

export interface GetCurrentUser {
  currentUser: GetCurrentUser_currentUser;
}
