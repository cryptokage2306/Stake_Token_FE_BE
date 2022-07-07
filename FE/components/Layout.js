import Header from "./Header/Header";

const Layout = ({ children }) => (
  <>
    <Header />
    <div className="omni-body">{children}</div>
  </>
);

export default Layout;
