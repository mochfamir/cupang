import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import {
  addDoc,
  collection,
  db,
  doc,
  getDoc,
  getAuth,
  onSnapshot,
  query,
  where,
  updateDoc,
} from "@libs/firebase";

import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Layout,
  Menu,
  MenuProps,
  Modal,
  Row,
} from "antd";

import SubMenu from "antd/lib/menu/SubMenu";
import Board from "@libs/components/board";
import axios from "axios";
import { reload } from "firebase/auth";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export default function Room(params: any) {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser as any;
  const [room, setRoom] = useState({} as any);
  const [masterTasks, setMasterTasks] = useState([] as any[]);
  const [tasks, setTasks] = useState([] as any[]);
  const [collapsed, setCollapsed] = useState(false);
  const id = (() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.getTime().toString(32);
  })();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [visible, setVisible] = useState(false);

  async function getIceBreaker() {
    await axios({
      method: "GET",
      url: "/api/ice-breaker",
    }).then(({ data }) => {
      const selectedRoom = doc(db, "meetings", id);
      const newRoom = {
        ...room,
        iceBreaker: data.data,
      };
      updateDoc(selectedRoom, newRoom);
    });
  }

  // Set Room
  useEffect(() => {
    if (room?.id) {
      setItems(
        room.rundown.map((rundownName: string) => {
          return getItem(
            rundownName,
            rundownName,
            null,
            room.attendess.map((attendee: any, i: number) => {
              if (rundownName === "teamAgenda") {
                if (i == 0) {
                  return getItem("releasePlan", "releasePlan");
                }
              } else {
                return getItem(
                  attendee.name,
                  `${rundownName}-${attendee.email}`,
                  <Avatar
                    size='small'
                    src={attendee.avatar}
                    style={{ marginRight: "5px" }}
                  />
                );
              }
            })
          );
        })
      );

      if (
        user &&
        !room.attendess.find((attendee: any) => attendee.email === user?.email)
      ) {
        const selectedRoom = doc(db, "meetings", id);
        const newRoom = {
          ...room,
          attendess: [
            ...room.attendess,
            {
              email: user.email,
              name: user.displayName,
              avatar: user.photoURL,
            },
          ],
        };
        updateDoc(selectedRoom, newRoom);
      } else if (!user) {
        router.push("/");
      }
    }
  }, [room]);

  // Get Meeting Room
  useEffect(() => {
    const q = query(collection(db, "meetings"), where("id", "==", id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [] as any[];
      querySnapshot.forEach((doc) => data.push(doc.data()));
      if (!data.length) {
        router.push("/");
      }
      setRoom(data[0]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Get Tasks
  useEffect(() => {
    const q = query(collection(db, "tasks"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [] as any[];
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      const newTasks = data
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
            createdAt: new Intl.DateTimeFormat("en-US", options as any).format(
              new Date(datum.createdAt)
            ),
          };
        });

      setMasterTasks(newTasks);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => {
          setCollapsed(value);
        }}
      >
        <div className='logo' />
        <Menu
          theme='dark'
          defaultSelectedKeys={["iceBreaker"]}
          selectedKeys={room?.currentRundown}
          mode='inline'
          items={items}
          onClick={(params) => {
            if (user?.email === room?.createdBy) {
              const selectedRoom = doc(db, "meetings", id);
              const newRoom = {
                ...room,
                currentRundown: params.key,
              };
              updateDoc(selectedRoom, newRoom);
            } else if (params.key === `personalUpdate-${user.email}`) {
              setVisible(true);
            }
          }}
          onOpenChange={(value) => console.log(value)}
        />
      </Sider>
      <Layout className='site-layout'>
        <Content style={{ margin: "0 16px" }}>
          <div
            className='site-layout-background'
            style={{ padding: 24, minHeight: 360 }}
          >
            {room?.currentRundown?.split("-")[0] === "personalUpdate" ? (
              <Board
                currentRundown={room.currentRundown}
                tasks={masterTasks.filter(
                  (task) =>
                    task?.user?.email === room?.currentRundown?.split("-")[1]
                )}
              />
            ) : room?.currentRundown?.split("-")[0] === "iceBreaker" ? (
              <Row align='middle' style={{ height: "80vh", padding: "30px" }}>
                <Col span={24}>
                  <h1>{room.iceBreaker}</h1>
                  {user?.email === room.createdBy && (
                    <Button onClick={() => getIceBreaker()}>Reload</Button>
                  )}
                </Col>
              </Row>
            ) : (
              <h1>Release Plan Agenda</h1>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Cupang</Footer>
      </Layout>
      <Modal
        title='Modal 1000px width'
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={1000}
      >
        <div style={{ height: "300px", backgroundColor: "#F0F2F5" }}>
          <Board
            currentRundown={`personalUpdate-${user?.email}`}
            tasks={masterTasks.filter(
              (task) => task?.user?.email === user?.email
            )}
          />
        </div>
      </Modal>
    </Layout>
  );
}
