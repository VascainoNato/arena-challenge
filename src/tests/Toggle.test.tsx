import { render, screen, fireEvent } from "@testing-library/react";
import Toggle from "../components/Toggle";

test("changes to 'Newest' when clicked", () => {
  const setActiveTab = jest.fn();
  render(<Toggle activeTab="popular" setActiveTab={setActiveTab} />);

  fireEvent.click(screen.getByText("Newest"));
  expect(setActiveTab).toHaveBeenCalledWith("newest");
});

test("changes to 'Popular' when clicked", () => {
  const setActiveTab = jest.fn();
  render(<Toggle activeTab="newest" setActiveTab={setActiveTab} />);

  fireEvent.click(screen.getByText("Popular"));
  expect(setActiveTab).toHaveBeenCalledWith("popular");
});

