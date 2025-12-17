import { JwtContext } from "@/context";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { loginAction, logoutAction } from "@/slices";
import { AxiosService, getCookie, getExpired } from "@/utils";
import Swal from "sweetalert2";
import React from "react";
import { useTranslation } from "react-i18next";
const Toast = Swal.mixin({
  toast: true,
  position: "bottom-start",
  showConfirmButton: false,
  timer: 8000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
const JwtProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { user, isLoggedIn } = useAppSelector((state) => state.account);
  React.useEffect(() => {
    const init = () => {
      const token: string = getCookie(import.meta.env.VITE_ACCESS_TOKEN_PREFIX as string);
      if (token) {
        AxiosService()
          .post(
            "/auth/check-valid-token",
            { token },
            {
              headers: { isShowLoading: false }
            }
          )
          .then((res: any) => {
            const { data, checked } = res.data;
            if (checked) {
              const { user } = data;
              dispatch(loginAction(user));
            } else {
              Toast.fire({
                icon: "error",
                title: t("Invalid token")
              });
              removeCookieLogout();
            }
          })
          .catch(() => {
            Toast.fire({
              icon: "error",
              title: t("Error system")
            });
            removeCookieLogout();
          });
      } else {
        removeCookieLogout();
      }
    };
    init();
  }, []);
  const removeCookieLogout = () => {
    document.cookie = `${import.meta.env.VITE_ACCESS_TOKEN_PREFIX as string}=token; expires=${getExpired(-100)}; path=/;`;
    dispatch(logoutAction());
  };
  /* const [checkValidTokenUser] = useMutation(CHECK_VALID_TOKEN);
   React.useEffect(() => {
    const init = async () => {
      const accessToken: string = getCookie(import.meta.env.VITE_ACCESS_TOKEN_PREFIX as string);
      if (accessToken) {
        checkValidTokenUser({ variables: { token: accessToken } })
          .then(async (response: any) => {
            if (response && response.data && response.data.checkValidToken) {
              const item = response.data.checkValidToken;
              const user: IUser | null = item;
              if (user && user.locale) {
                onChangeLocale(user.locale);
                dispatch(loginAction(user));
              }
            } else {
              document.cookie = `${import.meta.env.VITE_ACCESS_TOKEN_PREFIX as string}=token; expires=${getExpired(-100)}; path=/;`;
              dispatch(logoutAction());
            }
          })
          .catch(async (err: any) => {
            document.cookie = `${import.meta.env.VITE_ACCESS_TOKEN_PREFIX as string}=token; expires=${getExpired(-100)}; path=/;`;
            dispatch(logoutAction());
          });
      } else {
        document.cookie = `${import.meta.env.VITE_ACCESS_TOKEN_PREFIX as string}=token; expires=${getExpired(-100)}; path=/;`;
        dispatch(logoutAction());
      }
    };
    init();
  }, []); */
  return <JwtContext.Provider value={{ isLoggedIn, user }}>{children}</JwtContext.Provider>;
};
export { JwtProvider };
