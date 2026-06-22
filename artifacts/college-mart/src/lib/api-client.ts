import { setAuthTokenGetter } from "@workspace/api-client-react/src/custom-fetch";

export function initApiClient() {
  setAuthTokenGetter(() => {
    return localStorage.getItem("token");
  });
}
