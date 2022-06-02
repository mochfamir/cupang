import { Card, Row, Col, Avatar, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";

interface TaskItemProps {
  task: any;
  isTyping: boolean;
  submitTask: (task: any) => void;
}

export const TaskItem = (props: TaskItemProps) => {
  const { isTyping, submitTask } = props;
  const [task, setTask] = useState({} as any);

  useEffect(() => {
    setTask(props.task);
  }, [props]);

  return (
    task && (
      <Card size='small' style={{ marginBottom: "5px" }}>
        <div style={{ width: "100%", wordWrap: "break-word" }}>
          <div
            style={{
              width: "30px",
              height: "5px",
              backgroundColor: (() => {
                switch (task.status) {
                  case "Done":
                    return "#49FF00";
                  case "Active":
                    return "#FBFF00";
                  case "Stuck":
                    return "#FF0000";
                  case "Future":
                    return "#FF9300";
                }
              })(),
              // border: "1px solid tra",
              borderRadius: "50px",
            }}
          ></div>
          {!isTyping ? (
            <>
              <p>{task.createdAt}</p>
              <p>{task.content}</p>
            </>
          ) : (
            <>
              <br />
              <TextArea
                placeholder='Add new task'
                bordered={false}
                onChange={(e) => setTask({ ...task, content: e.target.value })}
                onKeyPress={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
                onPressEnter={() => submitTask(task)}
                autoSize
              />
              <br />
              <br />
            </>
          )}
          <div
            style={{
              display: "flex",
              maxWidth: "100%",
            }}
          >
            <Avatar
              size='small'
              src={task.assigneeAvatar}
              style={{ marginRight: "5px" }}
            />
            <p style={{ fontSize: "12px" }}>{task.assigneeName}</p>
          </div>
        </div>
      </Card>
    )
  );
};
