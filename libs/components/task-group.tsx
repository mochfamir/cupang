import { getAuth } from "@libs/firebase";
import { Col, Row, Card } from "antd";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { TaskGroupHeader } from "./task-group-header";
import { TaskItem } from "./task-item";

interface TaskGroupProps {
  disableAdd?: boolean;
  data: any[];
  droppableId: string;
  submitTask: (task: any) => void;
  createDraftTask: (status: string) => void;
}

export const TaskGroup = (props: TaskGroupProps) => {
  const auth = getAuth();
  const user = auth.currentUser as any;
  const { data, droppableId, submitTask, createDraftTask, disableAdd } = props;

  return (
    <>
      <TaskGroupHeader
        disabled={disableAdd}
        title={droppableId}
        onCreateTask={() => createDraftTask(droppableId)}
      />
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div ref={provided.innerRef}>
            <Row>
              {data
                .filter((task) => task.status === droppableId)
                .map((task, i) => (
                  <Draggable key={i} draggableId={task.id} index={i}>
                    {(_) => (
                      <Col span={24}>
                        <div
                          ref={_.innerRef}
                          {..._.dragHandleProps}
                          {..._.draggableProps}
                        >
                          <TaskItem
                            task={task}
                            isTyping={Boolean(!task.content)}
                            submitTask={submitTask}
                          />
                        </div>
                      </Col>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </Row>
          </div>
        )}
      </Droppable>
    </>
  );
};
