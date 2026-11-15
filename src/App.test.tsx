import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi, beforeEach } from "vitest"
import { http } from "./hooks/custom.type"
import App from "./App"

const mockUsers = [
  { id: 1, name: "Leanne Graham", username: "Bret", email: "Sincere@april.biz", company: { name: "Romaguera-Crona" } },
  { id: 2, name: "Ervin Howell", username: "Antonette", email: "Shanna@melissa.tv", company: { name: "Deckow-Crist" } },
  { id: 3, name: "Clementine Bauch", username: "Samantha", email: "Nathan@yesenia.net", company: { name: "Romaguera-Jacobson" } },
]

const mockPosts = [
  { userId: 1, id: 1, title: "First post", body: "Body of first post" },
  { userId: 1, id: 2, title: "Second post", body: "Body of second post" },
]

const mockNewPost = { userId: 1, id: 101, title: "New title", body: "New body" }

beforeEach(() => {
  vi.restoreAllMocks()
})

describe("App", () => {
  it("shows loading state then renders users", async () => {
    vi.spyOn(http, "get").mockResolvedValueOnce({ data: mockUsers })

    render(<App />)

    expect(screen.getByRole("status")).toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Loading users"
    )

    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument()
      expect(screen.getByText("Ervin Howell")).toBeInTheDocument()
      expect(screen.getByText("Clementine Bauch")).toBeInTheDocument()
    })
  })

  it("filters users by name when searching", async () => {
    vi.spyOn(http, "get").mockResolvedValueOnce({ data: mockUsers })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument()
    })

    const searchInput = screen.getByLabelText(/search by name/i)
    await userEvent.clear(searchInput)
    await userEvent.type(searchInput, "Ervin")

    await waitFor(() => {
      expect(screen.getByText("Ervin Howell")).toBeInTheDocument()
    })
    expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument()
    expect(screen.queryByText("Clementine Bauch")).not.toBeInTheDocument()
  })

  it("loads posts when a user is selected", async () => {
    vi.spyOn(http, "get")
      .mockResolvedValueOnce({ data: mockUsers })
      .mockResolvedValueOnce({ data: mockPosts })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText("Leanne Graham"))

    await waitFor(() => {
      expect(screen.getByText("First post")).toBeInTheDocument()
      expect(screen.getByText("Body of first post")).toBeInTheDocument()
    })
  })

  it("shows validation errors when submitting empty form", async () => {
    vi.spyOn(http, "get")
      .mockResolvedValueOnce({ data: mockUsers })
      .mockResolvedValueOnce({ data: mockPosts })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText("Leanne Graham"))

    await waitFor(() => {
      expect(screen.getByText("First post")).toBeInTheDocument()
    })

    const submitButton = screen.getByRole("button", { name: /Create post/i })
    await userEvent.click(submitButton)

    expect(screen.getByText("Title is required")).toBeInTheDocument()
    expect(screen.getByText("Body is required")).toBeInTheDocument()
  })

  it("creates a new post and shows it in the list", async () => {
    vi.spyOn(http, "get")
      .mockResolvedValueOnce({ data: mockUsers })
      .mockResolvedValueOnce({ data: mockPosts })
    vi.spyOn(http, "post").mockResolvedValueOnce({ data: mockNewPost })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText("Leanne Graham"))
    await waitFor(() => {
      expect(screen.getByText("First post")).toBeInTheDocument()
    })

    const titleInput = screen.getByLabelText("Title")
    const bodyInput = screen.getByLabelText("Body")
    await userEvent.type(titleInput, "New title")
    await userEvent.type(bodyInput, "New body")

    const submitButton = screen.getByRole("button", { name: /Create post/i })
    await userEvent.click(submitButton)

    expect(http.post).toHaveBeenCalledWith("/posts", {
      userId: 1,
      title: "New title",
      body: "New body",
    })

    await waitFor(() => {
      expect(screen.getByText("New title")).toBeInTheDocument()
    })
  })

  it("shows error state and allows retry", async () => {
    vi.spyOn(http, "get")
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValue({ data: mockUsers })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/Unexpected error/i)).toBeInTheDocument()
    })

    const retryButton = screen.getByRole("button", { name: /Retry/i })
    await userEvent.click(retryButton)

    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument()
    })

    expect(http.get).toHaveBeenCalledTimes(2)
  })
})
