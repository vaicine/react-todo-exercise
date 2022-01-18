import { useState, useReducer } from 'react'
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
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'

type TTask = string

type TTasks = {
  name: string
  points: number
}[]

type TAppProps = {
  newTask?: TTask
  tasks?: TTasks
}

const taskStyles = {
  normal: {
    ListItem: {
      borderBottomWidth: '1px',
      borderBottomColor: 'gray.200',
    },
    Tag: {
      color: 'gray.800',
      background: 'gray.200',
    },
    Text: {
      'aria-label': 'normal',
      color: 'gray.800',
    },
    IconButton: {
      color: 'gray.800',
      background: 'gray.200',
    },
  },
}

const TASK_REGEX = new RegExp('(.*?) ([0-9]+)pts')

const processTask = (task: string) => {
  let points = 0
  let name = task

  const scan: RegExpExecArray | null = TASK_REGEX.exec(task)

  if (scan?.index !== -1 && scan?.[2]) {
    points = Number(scan[2])
    name = scan[1]
  }

  return { name, points }
}

interface State {
  name: string
  points: number
}

interface ModifiedState {
  points: number
  index: number
}

enum ActionType {
  setTask,
  removeTask,
  updatePoints,
}

export type Action =
  | {
      type: ActionType.setTask
      task: string
    }
  | {
      type: ActionType.removeTask
      task: number
    }
  | {
      type: ActionType.updatePoints
      task: ModifiedState
    }

const reducer = (state: State[], action: Action) => {
  switch (action.type) {
    case ActionType.setTask:
      return [...state, processTask(action.task)]
    case ActionType.removeTask:
      return sortTasks(state).filter((_, index) => index !== action.task)
    case ActionType.updatePoints:
      return sortTasks(state).map((task, index) => {
        if (index === action.task.index) {
          return {
            ...task,
            points: action.task.points,
          }
        }
        return task
      })
  }
  return state
}

const sortTasks = (tasks: State[]) => tasks.sort((a, b) => b.points - a.points)

const initialEditState = { index: -1, points: 0 }

export const App = ({ newTask = '', tasks: initialTasks = [] }: TAppProps) => {
  const [task, setTask] = useState(newTask)
  const [edit, setEdit] = useState(initialEditState)
  const [tasks, dispatch] = useReducer(reducer, initialTasks)

  return (
    <ChakraProvider theme={theme}>
      <Center py={10} bg="gray.200" mb={10}>
        <Heading>TODO</Heading>
      </Center>
      <Container>
        <Flex gap={2} mb={5}>
          <Input placeholder="Name" onChange={(e) => setTask(e.target.value)} />
          <IconButton
            aria-label="Add"
            icon={<AddIcon />}
            onClick={() => dispatch({ type: ActionType.setTask, task })}
          />
        </Flex>
        <List borderTopWidth="1px" borderTopColor="gray.200">
          {sortTasks(tasks).map((task, i) => (
            <ListItem
              key={i}
              aria-label="task"
              py={3}
              {...taskStyles.normal.ListItem}
            >
              <Flex justify="space-between" align="center">
                <Tag
                  aria-label="points"
                  {...taskStyles.normal.Tag}
                  onClick={() =>
                    setEdit({
                      index: i,
                      points: task.points,
                    })
                  }
                >
                  {edit.index === i ? (
                    <input
                      autoFocus
                      onChange={(e) =>
                        setEdit((prev) => ({
                          ...prev,
                          points: Number(e.target.value),
                        }))
                      }
                      onBlur={() => {
                        dispatch({ type: ActionType.updatePoints, task: edit })
                        setEdit(initialEditState)
                      }}
                      value={edit.points}
                    />
                  ) : (
                    task.points
                  )}
                </Tag>{' '}
                <Text
                  {...taskStyles.normal.Text}
                  {...(task.points >= 10 && { 'aria-label': 'critical' })}
                  onClick={() =>
                    setEdit({
                      index: i,
                      points: task.points,
                    })
                  }
                >
                  {task.name}
                </Text>
                <IconButton
                  aria-label="Remove"
                  icon={<DeleteIcon />}
                  onClick={() =>
                    dispatch({ type: ActionType.removeTask, task: i })
                  }
                />
              </Flex>
            </ListItem>
          ))}
        </List>
      </Container>
    </ChakraProvider>
  )
}
