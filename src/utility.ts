import jwtDecode from "jwt-decode";
import { parseObjWithId } from "./validations";
import { z } from "zod";

export function getIdFromJwtToken(token: any) {
  const decoded = jwtDecode(token);
  const parsed = parseObjWithId(decoded);
  return parsed.id;
}

export function getDataFromAuthForm(form: HTMLFormElement) {
  const data = new FormData(form);
  const username = data.get("username");
  const email = data.get("email");
  const password = data.get("password");
  return {
    username,
    email,
    password,
  };
}

// export function handleAuthFormData(
//   form: HTMLFormElement,
//   failureCb?: () => void
// ) {
//   const data = new FormData(form);
//   const email = data.get("email");
//   const password = data.get("password");
//   if (!email || !password || typeof email !== "string" && typeof password !== "string") {
//     return {
//       email: null,
//       password: null,
//     };
//   }

//   if (failureCb) failureCb();
//   return {
//     email: email as string,
//     password: password as string,
//   };
// if (
//   typeof email !== "string" ||
//   typeof password !== "string" ||
//   email.length === 0 ||
//   password.length === 0
// ) {
//   if (failureCb) failureCb();
//   return {
//     email,
//     password,
//   };
// }
// return {
//   email,
//   password,
// };
// }
