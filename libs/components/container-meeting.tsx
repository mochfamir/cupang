import { useState } from "react";
import { useRouter } from "next/router";
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

import MeetingV2 from "pages/meeting-v2";

export const ContainerMeeting = () => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState();

  function onCollapse(value: any) {
    setCollapsed(value);
  }

  async function logout() {
    const auth = getAuth();
    auth.signOut();
    router.push("/login");
  }

  return (
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
            <MeetingV2 />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          In Development
        </Footer>
      </Layout>
    </Layout>
  );
};
