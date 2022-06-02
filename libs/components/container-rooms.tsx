import { Button, Card, Col, Row } from "antd";
import {
  addDoc,
  collection,
  db,
  doc,
  getDoc,
  setDoc,
  getAuth,
  onSnapshot,
  query,
  updateDoc,
} from "@libs/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export const ContainerRooms = () => {
  const router = useRouter();
  let unsubscribe: any;
  const auth = getAuth();
  const user = auth.currentUser as any;
  const [rooms, setRooms] = useState([] as any[]);
  const id = (() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.getTime().toString(32);
  })();

  async function getIceBreaker() {
    return await axios({
      method: "GET",
      url: "/api/ice-breaker",
    }).then(({ data }) => data.data);
  }

  async function onCreateMeeting() {
    const data = rooms;
    const newData = {
      id,
      name: "",
      description: "",
      createdAt: new Date().toISOString(),
      createdBy: user.email,
      createdByName: user.displayName,
      createdByAvatar: user.photoURL,
      rundown: ["iceBreaker", "personalUpdate", "teamAgenda"],
      currentRundown: "iceBreaker",
      iceBreaker: await getIceBreaker(),
      currentTurn: user.email,
      attendess: [
        {
          email: user.email,
          name: user.displayName,
          avatar: user.photoURL,
        },
      ],
    };

    const docRef = doc(db, "meetings", newData.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // router.push(`room/${id}`);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      try {
        await setDoc(doc(db, "meetings", newData.id), newData);
        data.splice(0, 0, newData);

        setRooms(
          data.map((datum: any) => {
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
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }

  useEffect(() => {
    getIceBreaker();
    const q = query(collection(db, "meetings"));
    unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [] as any[];
      querySnapshot.forEach((doc) => data.push(doc.data()));
      setRooms(data);
      if (data.find((datum) => datum.id === id)) {
        router.push(`room?id=${id}`);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Row>
      <Col span={24}>
        <Button onClick={() => onCreateMeeting()}>New Meeting</Button>
      </Col>
      <Col span={24}>
        {rooms.map((room: any) => (
          <Card
            title={room.id}
            key={room.id}
            onClick={() => router.push(`/room/${room.id}`)}
          >
            haloo
          </Card>
        ))}
      </Col>
    </Row>
  );
};
