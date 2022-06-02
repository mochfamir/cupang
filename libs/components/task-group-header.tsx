import { PlusOutlined } from "@ant-design/icons";
import { Row, Button, Typography } from "antd";

interface TaskGroupHeaderProps {
  disabled?: boolean;
  title: string;
  onCreateTask: (status: string) => void;
}

export const TaskGroupHeader = (props: TaskGroupHeaderProps) => {
  const { title, onCreateTask, disabled } = props;
  return (
    <Row gutter={16}>
      {!disabled ? (
        <Button
          shape='circle'
          size='small'
          style={{ marginRight: "10px" }}
          icon={<PlusOutlined style={{ fontSize: "16px", color: "#08c" }} />}
          onClick={() => onCreateTask(title)}
        />
      ): <>&nbsp;&nbsp;&nbsp;</>}
      <Typography.Title level={5}>{title}</Typography.Title>
    </Row>
  );
};
