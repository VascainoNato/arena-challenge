import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../components/Header";

jest.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: jest.fn(),
  }),
}));

describe("Header", () => {
  test("renders logo and search icon", () => {
    render(<Header />);
    expect(screen.getAllByAltText(/logo|search|user icon/i).length).toBeGreaterThan(0);
  });

  test("renders text navigation links", () => {
    render(<Header />);
    expect(screen.getByText(/launches/i)).toBeInTheDocument();
    expect(screen.getByText(/products/i)).toBeInTheDocument();
    expect(screen.getByText(/news/i)).toBeInTheDocument();
    expect(screen.getByText(/forums/i)).toBeInTheDocument();
  });

    test("renders theme toggle button", () => {
    render(<Header />);
    const [toggle] = screen.getAllByRole("button", { name: /toggle theme/i });
    expect(toggle).toBeInTheDocument();
    });

  test("renders Submit button in xl view", () => {
    render(<Header />);
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
  });
});
