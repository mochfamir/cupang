import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  collection,
  db,
  getAuth,
  getDocs,
  GoogleAuthProvider,
  provider,
  signInWithPopup,
} from "@libs/firebase";
import { Meeting } from "./meeting";
import { AuthProvider, useAuth } from "@libs/context/auth";
import { Col, Row, Spin } from "antd";
import MeetingV2 from "./meeting-v2";
import { ContainerMeeting } from "@libs/components/container-meeting";
import { ContainerRooms } from "@libs/components/container-rooms";

const Home: NextPage = () => {
  const router = useRouter();
  const [userLoggedIn, setUserLoggedIn] = useState({} as any);

  function getCurrentUser() {
    const auth = getAuth();
    return auth.currentUser;
  }

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      const user = getCurrentUser();
      if (user) {
        setUserLoggedIn(user);
        clearInterval(interval);
      }

      if (i === 3) {
        clearInterval(interval);
        router.push("/login");
      }
      i++;
    }, 500);
  }, []);

  return (
    <AuthProvider>
      {userLoggedIn?.email ? (
        <ContainerRooms />
      ) : (
        <Row justify='center' align='middle' style={{ height: "100vh" }}>
          <Col>
            Loading.. {' '}
            <Spin />
          </Col>
        </Row>
      )}
    </AuthProvider>
  );
};

export default Home;
