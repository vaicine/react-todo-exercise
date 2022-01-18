import { useState } from "react";
import {
  Heading,
  Container,
  Center,
  Flex,
  IconButton,
  ChakraProvider,
  Input,
  List,
  ListItem,
  Text,
  theme,
  Tag,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

type TTask = string;

type TTasks = {
  name: string;
  points: number;
}[];

type TAppProps = {
  newTask?: TTask;
  tasks?: TTasks;
};

const taskStyles = {
  normal: {
    ListItem: {
      borderBottomWidth: "1px",
      borderBottomColor: "gray.200",
    },
    Tag: {
      color: "gray.800",
      background: "gray.200",
    },
    Text: {
      "aria-label": "normal",
      color: "gray.800",
    },
    IconButton: {
      color: "gray.800",
      background: "gray.200",
    },
  },
};

export const App = ({ newTask = "", tasks: initialTasks = [] }: TAppProps) => {
  const [task, setTask] = useState(newTask);
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = () => setTasks([...tasks, { name: task, points: 0 }]);

  const removeTask = (i: number) => {
    const newTasks = [...tasks];
    newTasks.splice(i, 1);
    setTasks(newTasks);
  };

  return (
    <ChakraProvider theme={theme}>
      <Center py={10} bg="gray.200" mb={10}>
        <Heading>TODO</Heading>
      </Center>
      <Container>
        <Flex gap={2} mb={5}>
          <Input placeholder="Name" onChange={(e) => setTask(e.target.value)} />
          <IconButton aria-label="Add" icon={<AddIcon />} onClick={addTask} />
        </Flex>
        <List borderTopWidth="1px" borderTopColor="gray.200">
          {tasks.map((task, i) => (
            <ListItem
              key={i}
              aria-label="task"
              py={3}
              {...taskStyles.normal.ListItem}
            >
              <Flex justify="space-between" align="center">
                <Tag aria-label="points" {...taskStyles.normal.Tag}>
                  {task.points}
                </Tag>{" "}
                <Text {...taskStyles.normal.Text}>{task.name}</Text>
                <IconButton
                  aria-label="Remove"
                  icon={<DeleteIcon />}
                  onClick={() => removeTask(i)}
                />
              </Flex>
            </ListItem>
          ))}
        </List>
      </Container>
    </ChakraProvider>
  );
};
