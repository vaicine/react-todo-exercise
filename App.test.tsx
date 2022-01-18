import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";

const stateFixture = {
  newTask: "eat the frog 20pts",
  tasks: [
    { name: "kill bill", points: 6 },
    { name: "get shorty", points: 12 },
  ],
};

describe("App", () => {
  it("renders the task names", () => {
    render(<App {...stateFixture} />);

    expect(screen.getByText("kill bill")).toBeInTheDocument();
    expect(screen.getByText("get shorty")).toBeInTheDocument();
  });

  it("sorts tasks by descending point value", () => {
    render(<App {...stateFixture} />);

    const tasks = screen.getAllByLabelText("task");
    expect(tasks[0]).toHaveTextContent("get shorty");
    expect(tasks[1]).toHaveTextContent("kill bill");
  });

  it("renders the correct class for the point threshold", () => {
    render(<App {...stateFixture} />);

    const normalTask = screen.getByText("kill bill");
    const criticalTask = screen.getByText("get shorty");

    expect(normalTask).toHaveAttribute("aria-label", "normal");
    expect(criticalTask).toHaveAttribute("aria-label", "critical");
  });

  it("parses point input in the task name", () => {
    render(<App {...stateFixture} />);

    const existingTasks = screen.getAllByLabelText("task");
    expect(existingTasks.length).toEqual(2);

    const submitButton = screen.getByLabelText("Add");

    userEvent.click(submitButton);

    const tasks = screen.getAllByLabelText("task");
    expect(tasks.length).toEqual(3);
    expect(tasks[0]).toHaveTextContent("eat the frog");
  });
});
