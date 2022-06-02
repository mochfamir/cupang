import { TaskGroup } from "@libs/components/task-group";
import {
  addDoc,
  collection,
  db,
  doc,
  getAuth,
  onSnapshot,
  query,
  updateDoc,
} from "@libs/firebase";
import { Card, Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const MeetingV2 = (props: any) => {
  let unsubscribe: any;
  const auth = getAuth();
  const user = auth.currentUser as any;

  const [isWinReady, setIsWinReady] = useState(false);
  const [masterTasks, setMasterTasks] = useState([] as any[]);
  const [tasks, setTasks] = useState([] as any[]);

  async function getData() {
    const q = query(collection(db, "tasks"));
    unsubscribe = onSnapshot(q, (querySnapshot) => {
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
  }

  function onCreateTask(status: string) {
    const data = tasks;
    const newData = {
      room: "",
      content: "",
      createdAt: new Date().toISOString(),
      user: {
        email: user.email,
        name: user.displayName,
        avatar: user.photoURL,
      },
      status,
    };
    data.splice(0, 0, newData);

    setTasks(
      data.map((datum: any) => {
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

  async function updateTask(id: string, newData: any) {
    const selectedTaskLocal = tasks.filter((task) => task.id !== id);
    setTasks(selectedTaskLocal);
    const updatedTask = doc(db, "tasks", id);

    await updateDoc(updatedTask, {
      ...newData,
    });
  }

  useEffect(() => {
    getData();
    setTimeout(() => {
      setIsWinReady(true);
    }, 1000);

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <DragDropContext
      onDragEnd={(params) => {
        if (params.destination) {
          updateTask(params.draggableId, {
            status: params.destination?.droppableId,
          });
        }
      }}
    >
      {isWinReady && (
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <TaskGroup
              data={tasks}
              droppableId='Done'
              submitTask={submitTask}
              createDraftTask={onCreateTask}
            />
          </Col>
          <Col span={6}>
            <TaskGroup
              data={tasks}
              droppableId='Active'
              submitTask={submitTask}
              createDraftTask={onCreateTask}
            />
          </Col>
          <Col span={6}>
            <TaskGroup
              data={tasks}
              droppableId='Stuck'
              submitTask={submitTask}
              createDraftTask={onCreateTask}
            />
          </Col>
          <Col span={6}>
            <TaskGroup
              data={tasks}
              droppableId='Future'
              submitTask={submitTask}
              createDraftTask={onCreateTask}
            />
          </Col>
        </Row>
      )}
    </DragDropContext>
  );
};

export default MeetingV2;
