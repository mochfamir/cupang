import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";

import { getAuth } from "@libs/firebase";

import { Col, Layout, Menu, Row } from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

import "../styles/globals.css";
import "antd/dist/antd.css";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [collapsed, setCollapsed] = useState();

  function onCollapse(value: any) {
    setCollapsed(value);
  }

  async function logout() {
    const auth = getAuth();
    auth.signOut();
    router.push("/login");
  }

  useEffect(() => {
    setIsLoginPage(router.pathname.includes("login"));

    // router.events.on("routeChangeError", () => {
    //   console.log("error");
    // });

    // router.events.on("beforeHistoryChange", () => console.log("before"));
    // router.events.on("hashChangeComplete", () =>
    //   console.log("change complete")
    // );
    // router.events.on("hashChangeStart", () => {
    //   console.log("change start")
    //   console.log(router)
    // });
    // router.events.on('routeChangeStart', () => {
    //   if (router.pathname.includes('[id]')) {
    //     router.push('haloo')
    //   }
    //   console.log(router)
    // });
    // router.events.on('routeChangeError', () => {
    //   console.log('errorrr')
    // });

  }, [router.pathname]);

  return <Component {...pageProps} />;

  return !isLoginPage ? (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className='logo' />
        <Menu theme='dark' defaultSelectedKeys={["1"]} mode='inline'>
          <Menu.Item key='1' icon={<PieChartOutlined />} onClick={logout}>
            logout
          </Menu.Item>
          <Menu.Item key='2' icon={<DesktopOutlined />}>
            Option 2
          </Menu.Item>
          <SubMenu key='sub1' icon={<UserOutlined />} title='User'>
            <Menu.Item key='3'>Tom</Menu.Item>
            <Menu.Item key='4'>Bill</Menu.Item>
            <Menu.Item key='5'>Alex</Menu.Item>
          </SubMenu>
          <SubMenu key='sub2' icon={<TeamOutlined />} title='Team'>
            <Menu.Item key='6'>Team 1</Menu.Item>
            <Menu.Item key='8'>Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key='9' icon={<FileOutlined />}>
            Files
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className='site-layout' style={{ display: "inline-block" }}>
        <Header className='site-layout-background' style={{ padding: 0 }} />
        <Content style={{ margin: "0 16px" }}>
          <div
            className='site-layout-background'
            style={{ padding: 24, minHeight: 360 }}
          >
            <Component {...pageProps} />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>In Development</Footer>
      </Layout>
    </Layout>
  ) : (
    <Component {...pageProps} />
  );
}

export default MyApp;
