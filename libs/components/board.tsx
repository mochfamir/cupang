import { Card, Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";
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
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { TaskGroup } from "@libs/components/task-group";

const Board = (props: any) => {
  let unsubscribe: any;
  const auth = getAuth();
  const user = auth.currentUser as any;

  const [isWinReady, setIsWinReady] = useState(false);
  const [masterTasks, setMasterTasks] = useState([] as any[]);
  const [tasks, setTasks] = useState([] as any[]);
  const [currentRundown, setCurrentRundown] = useState("");

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
    if (props?.tasks) {
      setTasks(props.tasks);
    }

    if (props?.currentRundown) {
      setCurrentRundown(props.currentRundown);
    }
  }, [props]);

  return (
    <DragDropContext
      onDragEnd={(params) => {
        if (params.destination) {
          if (user.email === currentRundown.split("-")[1])
            updateTask(params.draggableId, {
              status: params.destination?.droppableId,
            });
        }
      }}
    >
      {tasks && (
        <Row gutter={[16, 16]}>
          {["Done", "Active", "Stuck", "Future"].map((s) => (
            <Col span={6} key={s}>
              <TaskGroup
                disableAdd={user?.email !== currentRundown.split("-")[1]}
                data={tasks}
                droppableId={s}
                submitTask={submitTask}
                createDraftTask={onCreateTask}
              />
            </Col>
          ))}
        </Row>
      )}
    </DragDropContext>
  );
};

export default Board;
