import {
  Layout,
  Menu,
  Breadcrumb,
  Row,
  Col,
  Divider,
  Tooltip,
  Button,
  Typography,
  Card,
  Badge,
  Avatar,
} from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { TaskGroupHeader } from "@libs/components/task-group-header";
import {
  addDoc,
  collection,
  db,
  getAuth,
  getDocs,
  GoogleAuthProvider,
  onSnapshot,
  provider,
  query,
  signInWithPopup,
  where,
} from "@libs/firebase";
import { TaskItem } from "@libs/components/task-item";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

interface MeetingProps {
  user: any;
}

export const Meeting = (props: MeetingProps) => {
  const router = useRouter();
  let unsubscribe: any;
  const user = props.user;
  const [collapsed, setCollapsed] = useState();
  const [tasks, setTasks] = useState<any[]>([]);

  async function getData() {
    const q = query(
      collection(db, "tasks")
      // ,
      // where("assignee", "==", user.email)
    );
    unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [] as any[];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      setTasks(
        data
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((datum) => {
            const options = {
              weekday: "short",
              year: "numeric",
              month: "long",
              day: "numeric",
            };
            return {
              ...datum,
              createdAt: new Intl.DateTimeFormat(
                "en-US",
                options as any
              ).format(new Date(datum.createdAt)),
            };
          })
      );
    });
  }

  function onCollapse(value: any) {
    setCollapsed(value);
  }

  function onCreateTask(status: string) {
    const data = tasks;
    const newData = {
      content: "",
      createdAt: new Date().toISOString(),
      assignee: user.email,
      assigneeName: user.displayName,
      assigneeAvatar: user.photoURL,
      status,
    };
    data.splice(0, 0, newData);
    setTasks(
      data.map((datum) => {
        const options = {
          weekday: "short",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        return {
          ...datum,
          createdAt: new Intl.DateTimeFormat("en-US", options as any).format(
            new Date(datum.createdAt)
          ),
        };
      })
    );
  }

  async function submitTask(task: any) {
    try {
      const docRef = await addDoc(collection(db, "tasks"), task);
      console.log("Document written with ID: ", docRef.id);
      getData();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function logout() {
    const auth = getAuth();
    auth.signOut();
    router.push("/login");
  }

  useEffect(() => {
    getData();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

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
            <Row gutter={16} style={{ minHeight: "20vh" }}>
              <Col span={6}>
                <div>
                  <TaskGroupHeader title='Done' onCreateTask={onCreateTask} />
                </div>
                <Row>
                  {tasks &&
                    tasks
                      ?.filter((task) => task.status === "Done")
                      .map((task, i) => (
                        <Col key={i} span={24}>
                          <TaskItem
                            task={task}
                            isTyping={Boolean(!task.content)}
                            submitTask={submitTask}
                          />
                        </Col>
                      ))}
                </Row>
              </Col>
              <Col span={6}>
                <div>
                  <TaskGroupHeader title='Active' onCreateTask={onCreateTask} />
                </div>
                <Row>
                  {tasks &&
                    tasks
                      ?.filter((task) => task.status === "Active")
                      .map((task, i) => (
                        <Col key={i} span={24}>
                          <TaskItem
                            task={task}
                            isTyping={Boolean(!task.content)}
                            submitTask={submitTask}
                          />
                        </Col>
                      ))}
                </Row>
              </Col>
              <Col span={6}>
                <div>
                  <TaskGroupHeader title='Stuck' onCreateTask={onCreateTask} />
                </div>
                {tasks &&
                  tasks
                    ?.filter((task) => task.status === "Stuck")
                    .map((task, i) => (
                      <Col key={i} span={24}>
                        <TaskItem
                          task={task}
                          isTyping={Boolean(!task.content)}
                          submitTask={submitTask}
                        />
                      </Col>
                    ))}
              </Col>
              <Col span={6}>
                <div>
                  <TaskGroupHeader title='Future' onCreateTask={onCreateTask} />
                </div>
                {tasks &&
                  tasks
                    ?.filter((task) => task.status === "Future")
                    .map((task, i) => (
                      <Col key={i} span={24}>
                        <TaskItem
                          task={task}
                          isTyping={Boolean(!task.content)}
                          submitTask={submitTask}
                        />
                      </Col>
                    ))}
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Meeting;