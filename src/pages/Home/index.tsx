import { useAbility } from "@casl/react";
import React from "react";
import { Can, GuardContext } from "../../guards/GuardContext";
import { create, fetchTasks, removeTask, updateToClosed } from "./services";
import {
  ActionContainer,
  Container,
  Divider,
  DoneButton,
  Form,
  Id,
  Input,
  ListContainer,
  ListItem,
  NewButton,
  Page,
  RemoveButton,
  Title,
} from "./styles";

type Task = {
  id: number;
  title: string;
  status: "open" | "closed";
};

export const Home = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);

  function refresh() {
    fetchTasks().then((tasks) => setTasks(tasks));
  }

  React.useEffect(() => {
    refresh();
  }, []);

  const onRemove = async (id: number) => {
    await removeTask(id);

    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const onDone = async (id: number) => {
    await updateToClosed(id);

    setTasks((prev) => {
      return prev.map((task) =>
        task.id === id ? { ...task, status: "closed" } : task
      );
    });
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const title = formData.get("title")?.toString();

    await create(title!);

    refresh();
  };

  const ability = useAbility(GuardContext);
  return (
    <Page>
      <Container>
        <Title>Task Manager</Title>

        <Can I="create" a="Task">
          <Form onSubmit={onSubmit}>
            <Input type="text" name="title" required />
            <NewButton type="submit">Criar nova tarefa</NewButton>
          </Form>
        </Can>

        <Divider />

        {ability.can("read", "Task") && (
          <ListContainer>
            {tasks.map((task) => (
              <ListItem $open={task.status === "open"} key={task.id}>
                <Id>{task.id}</Id>
                <p>{task.title}</p>
                <ActionContainer>
                  {task.status === "open" && (
                    <DoneButton onClick={() => onDone(task.id)}>
                      Concluir
                    </DoneButton>
                  )}
                  <RemoveButton onClick={() => onRemove(task.id)}>
                    Excluir
                  </RemoveButton>
                </ActionContainer>
              </ListItem>
            ))}
          </ListContainer>
        )}
      </Container>
    </Page>
  );
};
