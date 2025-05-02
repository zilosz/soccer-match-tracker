import { HeaderContainer, Theme } from "@carbon/react";
import { ToastContainer } from "react-toastify";
import AppHeader from "./components/AppHeader";

export default function App() {
  return (
    <>
      <Theme theme="g90">
        <HeaderContainer render={AppHeader} />
      </Theme>
      <ToastContainer limit={1} />
    </>
  );
}
