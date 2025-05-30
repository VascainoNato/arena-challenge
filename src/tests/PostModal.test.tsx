import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostModal from "../components/Modal/PostModal";
import { mockPost } from "../../__mocks__/mockPost";

describe("PostModal", () => {
  test("renders post name and description", () => {
    render(<PostModal post={mockPost} onClose={() => {}} />);
    expect(screen.getByText(mockPost.name)).toBeInTheDocument();
    expect(screen.getByText(mockPost.description)).toBeInTheDocument();
  });

  test("renders media image with correct src", () => {
    render(<PostModal post={mockPost} onClose={() => {}} />);
    const img = screen.getByAltText(""); // ou um alt melhorado
    expect(img).toHaveAttribute("src", mockPost.media[0].url);
  });

  test("has working Visit Page link", () => {
    render(<PostModal post={mockPost} onClose={() => {}} />);
    const link = screen.getByRole("link", { name: /visit page/i });
    expect(link).toHaveAttribute("href", mockPost.website);
    expect(link).toHaveAttribute("target", "_blank");
  });

  test("calls onClose when ESC key is pressed", () => {
    const onClose = jest.fn();
    render(<PostModal post={mockPost} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  test("renders upvote button", () => {
    render(<PostModal post={mockPost} onClose={() => {}} />);
    expect(screen.getByRole("button", { name: /upvote/i })).toBeInTheDocument();
  });
});
